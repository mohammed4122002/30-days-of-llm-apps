import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

emb = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-base")
retriever = FAISS.load_local("index", emb, allow_dangerous_deserialization=True).as_retriever(search_kwargs={"k": 4})
fmt = lambda ds: "\n\n".join(d.page_content for d in ds)
prompt = ChatPromptTemplate.from_template("أجب فقط من السياق. إن لم تجد الجواب قل «لا أعرف».\n\nالسياق:\n{context}\n\nالسؤال: {question}")
rag = {"context": retriever | fmt, "question": RunnablePassthrough()} | prompt | get_llm() | StrOutputParser()
print(rag.invoke("ما هي سياسة الإجازات؟"))
