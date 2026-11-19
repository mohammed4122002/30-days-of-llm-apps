import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

@tool
def calc(expr: str) -> str:
    """احسب تعبيرًا رياضيًا بسيطًا."""
    return str(eval(expr, {"__builtins__": {}}))  # للتجربة فقط

agent = create_react_agent(get_llm(), [calc])
res = agent.invoke({"messages": [("user", "كم يساوي 1234 * 5678؟")]})
print(res["messages"][-1].content)
