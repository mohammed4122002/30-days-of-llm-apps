import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm
from shared.policy import policy_retriever
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

def build(retriever):
    fmt = lambda ds: "\n\n".join(f"[{i+1}] {d.page_content}" for i, d in enumerate(ds))
    prompt = ChatPromptTemplate.from_template("أجب باختصار واذكر رقم المصدر مثل [1].\n\n{context}\n\nالسؤال: {q}")
    answer = (RunnablePassthrough.assign(context=lambda x: fmt(x["docs"])) | prompt | get_llm() | StrOutputParser())
    return RunnableParallel(docs=lambda q: retriever.invoke(q), q=RunnablePassthrough()) | RunnablePassthrough.assign(answer=answer)

res = build(policy_retriever(k=2)).invoke("متى يمكنني استرجاع المنتج؟")
print("الجواب:", res["answer"])
print("المصادر:")
for i, d in enumerate(res["docs"]):
    print(f"  [{i+1}] {d.metadata['source']} — صفحة {d.metadata['page']}")
