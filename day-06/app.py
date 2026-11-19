from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

docs = PyPDFLoader("sample.pdf").load()
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=120, separators=["\n\n", "\n", "۔", ".", "؟", " "])
chunks = splitter.split_documents(docs)
print(len(docs), "صفحة →", len(chunks), "مقطع")
print(chunks[0].page_content[:300])
