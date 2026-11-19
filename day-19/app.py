import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

class S(TypedDict):
    task: str; result: str

def plan(s): return {"result": f"سأرسل إيميل: {s['task']}"}
def send(s): return {"result": "تم الإرسال ✅"}

g = StateGraph(S); g.add_node("plan", plan); g.add_node("send", send)
g.add_edge(START, "plan"); g.add_edge("plan", "send"); g.add_edge("send", END)
app = g.compile(checkpointer=MemorySaver(), interrupt_before=["send"])

cfg = {"configurable": {"thread_id": "1"}}
print(app.invoke({"task": "تأكيد الموعد"}, cfg))   # يتوقف قبل send
input("موافق؟ Enter للمتابعة")
print(app.invoke(None, cfg))                         # يكمل بعد الموافقة
