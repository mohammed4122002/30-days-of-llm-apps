import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

chain = ChatPromptTemplate.from_template("لخّص النص التالي في 3 نقاط:\n{text}") | get_llm() | StrOutputParser()
print(chain.invoke({"text": "الذكاء الاصطناعي التوليدي يغيّر طريقة عمل الفرق التقنية..."}))
