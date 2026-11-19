import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "أنت مترجم محترف. حوّل النص إلى اللهجة {dialect} بنبرة {tone}."),
    ("human", "{text}"),
])
chain = prompt | get_llm() | StrOutputParser()
print(chain.invoke({"dialect": "الشامية", "tone": "ودّية", "text": "نرجو منكم إرسال التقرير في أقرب وقت."}))
