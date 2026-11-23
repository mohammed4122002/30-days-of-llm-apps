import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm
from shared.policy import policy_rag
from langsmith import evaluate

judge = get_llm(temperature=0.1)
bot = policy_rag(get_llm())

def correctness(run, example):
    q = f"السؤال: {example.inputs['q']}\nالمرجع: {example.outputs['a']}\nالإجابة: {run.outputs['output']}\nهل الإجابة تتفق مع المرجع؟ أجب بـ 1 أو 0 فقط."
    return {"key": "correct", "score": int(judge.invoke(q).content.strip()[:1] == "1")}

res = evaluate(lambda inp: {"output": bot.invoke(inp["q"])}, data="rag-golden-v1", evaluators=[correctness], experiment_prefix="baseline")
rows = list(res)
for r in rows:
    print(r["evaluation_results"]["results"][0].score, "|", r["example"].inputs["q"], "→", r["run"].outputs["output"][:60])
print("الدقة:", sum(r["evaluation_results"]["results"][0].score for r in rows), "/", len(rows))
