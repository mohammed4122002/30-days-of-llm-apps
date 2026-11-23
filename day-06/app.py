from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

import unicodedata
docs = PyPDFLoader("sample.pdf").load()
for d in docs:  # الـ PDF العربي بيطلع بحروف «أشكال العرض»، بنرجّعها لحروف عادية عشان البحث يشتغل صح
    d.page_content = unicodedata.normalize("NFKC", d.page_content)
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120, separators=["\n\n", "\n", "۔", ".", "؟", " "])
chunks = splitter.split_documents(docs)
print(len(docs), "صفحة →", len(chunks), "مقطع")
print(chunks[0].page_content[:300])
