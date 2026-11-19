from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

emb = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-base")
docs = [Document(page_content=t) for t in ["السيارة الكهربائية توفر الوقود", "القطة نائمة على الأريكة", "المركبات الحديثة أقل تلويثًا"]]
db = FAISS.from_documents(docs, emb)
db.save_local("index")
for d in db.similarity_search("مركبة صديقة للبيئة", k=2):
    print("-", d.page_content)
