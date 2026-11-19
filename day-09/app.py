from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

texts = ["رقم الفاتورة INV-2041 مدفوع", "سياسة الاسترجاع 14 يومًا", "الدعم الفني متاح 24/7"]
docs = [Document(page_content=t) for t in texts]
emb = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-base")
vec = FAISS.from_documents(docs, emb).as_retriever(search_type="mmr", search_kwargs={"k": 2})
bm25 = BM25Retriever.from_documents(docs); bm25.k = 2
hybrid = EnsembleRetriever(retrievers=[bm25, vec], weights=[0.4, 0.6])
print(hybrid.invoke("INV-2041"))
