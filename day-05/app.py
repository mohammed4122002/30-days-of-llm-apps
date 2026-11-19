import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

prompt = ChatPromptTemplate.from_messages([("system", "أنت مساعد ودود."), MessagesPlaceholder("history"), ("human", "{input}")])
store = {}
def hist(sid): return store.setdefault(sid, InMemoryChatMessageHistory())
bot = RunnableWithMessageHistory(prompt | get_llm(), hist, input_messages_key="input", history_messages_key="history")
cfg = {"configurable": {"session_id": "u1"}}
bot.invoke({"input": "اسمي محمد"}, cfg)
print(bot.invoke({"input": "شو اسمي؟"}, cfg).content)
