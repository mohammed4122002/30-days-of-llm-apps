import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class S(TypedDict):
    topic: str; notes: str; draft: str; final: str

llm = get_llm()
def researcher(s): return {"notes": llm.invoke(f"اجمع 5 حقائق عن: {s['topic']}").content}
def writer(s): return {"draft": llm.invoke(f"اكتب منشور لينكدإن من هذه الحقائق:\n{s['notes']}").content}
def editor(s): return {"final": llm.invoke(f"حرّر النص واجعله أقوى وأقصر:\n{s['draft']}").content}

g = StateGraph(S)
for n, f in [("researcher", researcher), ("writer", writer), ("editor", editor)]: g.add_node(n, f)
g.add_edge(START, "researcher"); g.add_edge("researcher", "writer"); g.add_edge("writer", "editor"); g.add_edge("editor", END)
print(g.compile().invoke({"topic": "LangSmith"})["final"])
