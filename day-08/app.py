import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm
from shared.policy import policy_retriever
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

retriever = policy_retriever(k=2)
fmt = lambda ds: "\n\n".join(d.page_content for d in ds)
prompt = ChatPromptTemplate.from_template("أجب فقط من السياق. إن لم تجد الجواب قل «لا أعرف».\n\nالسياق:\n{context}\n\nالسؤال: {question}")
rag = {"context": retriever | fmt, "question": RunnablePassthrough()} | prompt | get_llm() | StrOutputParser()
for q in ["كم يوم الإجازة السنوية؟", "كم راتب المدير العام؟"]:
    print("س:", q); print("ج:", rag.invoke(q)); print()
