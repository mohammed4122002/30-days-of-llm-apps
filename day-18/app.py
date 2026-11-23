import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm
from shared.policy import policy_rag
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    q: str; route: str; answer: str

llm = get_llm()
rag = policy_rag(llm)  # بوت اليوم 8
def route(s):
    r = llm.invoke(f"صنّف السؤال: هل يحتاج مستندات الشركة (سياسات، إجازات، دوام)؟ أجب بكلمة واحدة: docs أو general.\nالسؤال: {s['q']}").content
    return {"route": "docs" if "docs" in r.lower() else "general"}
def docs(s): return {"answer": rag.invoke(s["q"])}
def general(s): return {"answer": llm.invoke(s["q"]).content}

g = StateGraph(S)
for n, f in [("route", route), ("docs", docs), ("general", general)]: g.add_node(n, f)
g.add_edge(START, "route")
g.add_conditional_edges("route", lambda s: s["route"], {"docs": "docs", "general": "general"})
g.add_edge("docs", END); g.add_edge("general", END)
app = g.compile()
for q in ["مرحبا، كيفك؟", "كم يوم الإجازة المرضية؟"]:
    out = app.invoke({"q": q})
    print(f"س: {q}\nالمسار: {out['route']}\nج: {out['answer']}\n")
