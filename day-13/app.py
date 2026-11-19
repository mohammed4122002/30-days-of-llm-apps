import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langsmith import evaluate

judge = get_llm(temperature=0.1)

def correctness(run, example):
    q = f"المرجع: {example.outputs['a']}\nالإجابة: {run.outputs['output']}\nهل الإجابة صحيحة؟ أجب بـ 1 أو 0 فقط."
    return {"key": "correct", "score": int(judge.invoke(q).content.strip()[:1] == "1")}

evaluate(lambda inp: {"output": get_llm().invoke(inp["q"]).content},
         data="rag-golden-v1", evaluators=[correctness], experiment_prefix="baseline")
