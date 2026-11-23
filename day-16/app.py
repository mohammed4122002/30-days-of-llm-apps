import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.tools import tool
from langchain.agents import create_agent

@tool
def calc(expr: str) -> str:
    """احسب تعبيرًا رياضيًا بسيطًا."""
    return str(eval(expr, {"__builtins__": {}}))  # للتجربة فقط

agent = create_agent(get_llm(), [calc])
res = agent.invoke({"messages": [("user", "كم يساوي 1234 * 5678؟")]})
for m in res["messages"]:
    if m.type == "ai" and m.tool_calls: print("الوكيل قرر يستخدم:", m.tool_calls[0]["name"], m.tool_calls[0]["args"])
    if m.type == "tool": print("الأداة رجّعت:", m.content)
print("الجواب:", res["messages"][-1].content)
