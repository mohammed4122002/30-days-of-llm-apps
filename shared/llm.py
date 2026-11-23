import os
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

DEFAULT_MODEL = "Qwen/Qwen2.5-72B-Instruct"
# نماذج صغيرة بتشتغل على جهازك بدون GPU وبدون رصيد (LLM_BACKEND=local)
LOCAL_DEFAULT = "Qwen/Qwen2.5-3B-Instruct"
LOCAL_MAP = {
    "Qwen/Qwen2.5-72B-Instruct": "Qwen/Qwen2.5-3B-Instruct",
    "meta-llama/Llama-3.3-70B-Instruct": "HuggingFaceTB/SmolLM2-1.7B-Instruct",
}


def get_llm(model: str | None = None, temperature: float = 0.3):
    """نموذج مفتوح المصدر.
    - الافتراضي: عبر Hugging Face Inference API (يحتاج HF_TOKEN ورصيد).
    - LLM_BACKEND=local: نموذج صغير على جهازك، مجاني بالكامل (أبطأ وأضعف شوي)."""
    model = model or os.getenv("HF_MODEL", DEFAULT_MODEL)
    if os.getenv("LLM_BACKEND", "api") == "local":
        mid = os.getenv("LOCAL_MODEL") or LOCAL_MAP.get(model, model if any(x in model for x in ("0.5B", "1.5B", "1.7B", "3B-")) else LOCAL_DEFAULT)
        from shared.local_chat import LocalChat
        return LocalChat(model_id=mid)
    endpoint = HuggingFaceEndpoint(
        repo_id=model,
        huggingfacehub_api_token=os.getenv("HF_TOKEN"),
        temperature=temperature,
        max_new_tokens=512,
        task="text-generation",
    )
    return ChatHuggingFace(llm=endpoint)
