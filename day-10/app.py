import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def build(retriever):
    fmt = lambda ds: "\n\n".join(f"[{i+1}] {d.page_content}" for i, d in enumerate(ds))
    prompt = ChatPromptTemplate.from_template("أجب واذكر أرقام المصادر مثل [1].\n\n{context}\n\nالسؤال: {q}")
    answer = (RunnablePassthrough.assign(context=lambda x: fmt(x["docs"])) | prompt | get_llm() | StrOutputParser())
    return RunnableParallel(docs=lambda q: retriever.invoke(q), q=RunnablePassthrough()) | RunnablePassthrough.assign(answer=answer)
