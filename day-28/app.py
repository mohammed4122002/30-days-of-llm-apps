import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.output_parsers import StrOutputParser

app = FastAPI()
chain = get_llm() | StrOutputParser()

class Req(BaseModel):
    text: str

@app.post("/ask")
def ask(r: Req):
    return {"answer": chain.invoke(r.text)}

# تشغيل: uvicorn app:app --reload   ثم من n8n: HTTP Request → POST /ask
