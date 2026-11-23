import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm
from shared.policy import policy_rag
from langsmith import evaluate
import time

judge = get_llm(temperature=0.1)
def correctness(run, example):  # نفس مقيّم اليوم 13
    q = f"السؤال: {example.inputs['q']}\nالمرجع: {example.outputs['a']}\nالإجابة: {run.outputs['output']}\nهل الإجابة تتفق مع المرجع؟ أجب بـ 1 أو 0 فقط."
    return {"key": "correct", "score": int(judge.invoke(q).content.strip()[:1] == "1")}

for model in ["Qwen/Qwen2.5-72B-Instruct", "meta-llama/Llama-3.3-70B-Instruct"]:
    llm = get_llm(model)
    name = getattr(llm, "model_id", model).split("/")[-1]   # بالوضع المحلي: النموذج الصغير المقابل
    bot = policy_rag(llm)
    t0 = time.time()
    rows = list(evaluate(lambda inp, bot=bot: {"output": bot.invoke(inp["q"])}, data="rag-golden-v1",
                         evaluators=[correctness], experiment_prefix=name))
    score = sum(r["evaluation_results"]["results"][0].score for r in rows)
    print(f"{name}: {score}/{len(rows)} صح | الزمن {time.time() - t0:.0f} ثانية")
