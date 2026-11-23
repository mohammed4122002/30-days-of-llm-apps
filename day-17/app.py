import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    q: str; plan: str; draft: str; final: str

llm = get_llm()
def analyze(s): return {"plan": llm.invoke(f"اكتب نقطتين فقط: ما أهم شيء يجب أن تغطيه الإجابة عن: {s['q']}").content}
def draft(s): return {"draft": llm.invoke(f"اكتب إجابة مختصرة عن: {s['q']}\nغطِّ هذه النقاط:\n{s['plan']}").content}
def review(s): return {"final": llm.invoke(f"حسّن الصياغة واجعلها أقصر:\n{s['draft']}").content}

g = StateGraph(S)
g.add_node("analyze", analyze); g.add_node("draft", draft); g.add_node("review", review)
g.add_edge(START, "analyze"); g.add_edge("analyze", "draft"); g.add_edge("draft", "review"); g.add_edge("review", END)
app = g.compile()
print(app.get_graph().draw_ascii())
print(app.invoke({"q": "ما فائدة RAG؟"})["final"])
