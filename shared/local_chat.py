"""نموذج محادثة محلي (بدون رصيد وبدون GPU) متوافق مع LangChain، وبيدعم الأدوات (tool calling).
بيستخدم قالب المحادثة الخاص بالنموذج نفسه (Qwen2.5 بيدعم الأدوات أصلًا)."""
import json, re, uuid
from functools import lru_cache
from typing import Any

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.outputs import ChatGeneration, ChatResult
from langchain_core.utils.function_calling import convert_to_openai_tool


@lru_cache(maxsize=4)
def _load(model_id: str):
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    torch.set_num_threads(max(1, torch.get_num_threads()))
    tok = AutoTokenizer.from_pretrained(model_id)
    import os
    dt = torch.float32 if os.getenv("LOCAL_DTYPE", "float32") == "float32" else torch.bfloat16
    model = AutoModelForCausalLM.from_pretrained(model_id, dtype=dt)
    model.eval()
    return tok, model


def _to_dict(m: BaseMessage) -> dict:
    if isinstance(m, SystemMessage): return {"role": "system", "content": m.content}
    if isinstance(m, HumanMessage): return {"role": "user", "content": m.content}
    if isinstance(m, ToolMessage): return {"role": "tool", "content": str(m.content), "name": getattr(m, "name", None) or "tool"}
    if isinstance(m, AIMessage):
        d = {"role": "assistant", "content": m.content or ""}
        if m.tool_calls:
            d["tool_calls"] = [{"type": "function", "function": {"name": t["name"], "arguments": t["args"]}} for t in m.tool_calls]
        return d
    return {"role": "user", "content": str(m.content)}


class LocalChat(BaseChatModel):
    model_id: str = "Qwen/Qwen2.5-3B-Instruct"
    max_new_tokens: int = 384
    tools: list[dict] | None = None

    @property
    def _llm_type(self) -> str:
        return "local-transformers-chat"

    def bind_tools(self, tools, **kwargs):
        return self.model_copy(update={"tools": [convert_to_openai_tool(t) for t in tools]})

    def _generate(self, messages: list[BaseMessage], stop=None, run_manager=None, **kwargs: Any) -> ChatResult:
        import torch
        tok, model = _load(self.model_id)
        msgs = [_to_dict(m) for m in messages]
        kw = {"tools": self.tools} if self.tools else {}
        ids = tok.apply_chat_template(msgs, add_generation_prompt=True, return_tensors="pt", return_dict=True, **kw)
        with torch.no_grad():
            out = model.generate(**ids, max_new_tokens=self.max_new_tokens, do_sample=False, repetition_penalty=1.08)
        new = out[0][ids["input_ids"].shape[1]:]
        text = tok.decode(new, skip_special_tokens=True).strip()
        calls = []
        for blob in re.findall(r"<tool_call>\s*(\{.*?\})\s*</tool_call>", text, re.S):
            try:
                c = json.loads(blob)
                calls.append({"name": c["name"], "args": c.get("arguments", {}), "id": "call_" + uuid.uuid4().hex[:8], "type": "tool_call"})
            except Exception:
                pass
        if calls:
            text = re.sub(r"<tool_call>.*?</tool_call>", "", text, flags=re.S).strip()
        n_in, n_out = int(ids["input_ids"].shape[1]), int(new.shape[0])
        msg = AIMessage(content=text, tool_calls=calls,
                        usage_metadata={"input_tokens": n_in, "output_tokens": n_out, "total_tokens": n_in + n_out},
                        response_metadata={"model_name": self.model_id})
        return ChatResult(generations=[ChatGeneration(message=msg)])
