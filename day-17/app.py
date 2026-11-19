import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    q: str; draft: str; final: str

llm = get_llm()
def draft(s): return {"draft": llm.invoke(f"اكتب إجابة مختصرة: {s['q']}").content}
def review(s): return {"final": llm.invoke(f"حسّن الصياغة:\n{s['draft']}").content}

g = StateGraph(S)
g.add_node("draft", draft); g.add_node("review", review)
g.add_edge(START, "draft"); g.add_edge("draft", "review"); g.add_edge("review", END)
print(g.compile().invoke({"q": "ما فائدة RAG؟"})["final"])
