import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langsmith import evaluate

def correctness(run, example):  # نفس مقيّم اليوم 13
    q = f"المرجع: {example.outputs['a']}\nالإجابة: {run.outputs['output']}\nهل الإجابة صحيحة؟ أجب بـ 1 أو 0 فقط."
    return {"key": "correct", "score": int(get_llm(temperature=0.1).invoke(q).content.strip()[:1] == "1")}

for model in ["Qwen/Qwen2.5-72B-Instruct", "meta-llama/Llama-3.3-70B-Instruct"]:
    llm = get_llm(model)
    evaluate(lambda inp, llm=llm: {"output": llm.invoke(inp["q"]).content},
             data="rag-golden-v1", evaluators=[correctness], experiment_prefix=model.split("/")[-1])
