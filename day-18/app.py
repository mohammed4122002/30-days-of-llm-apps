import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    q: str; route: str; answer: str

llm = get_llm()
def route(s): return {"route": "docs" if "سياسة" in s["q"] or "شركة" in s["q"] else "general"}
def docs(s): return {"answer": "[RAG] " + s["q"]}  # اربطه بيوم 8
def general(s): return {"answer": llm.invoke(s["q"]).content}

g = StateGraph(S)
for n, f in [("route", route), ("docs", docs), ("general", general)]: g.add_node(n, f)
g.add_edge(START, "route")
g.add_conditional_edges("route", lambda s: s["route"], {"docs": "docs", "general": "general"})
g.add_edge("docs", END); g.add_edge("general", END)
print(g.compile().invoke({"q": "ما سياسة الشركة؟"}))
