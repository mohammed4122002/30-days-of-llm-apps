import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

class Invoice(BaseModel):
    vendor: str = Field(description="اسم المورد")
    total: float = Field(description="المبلغ الإجمالي")
    currency: str

parser = PydanticOutputParser(pydantic_object=Invoice)
prompt = ChatPromptTemplate.from_template("استخرج البيانات.\n{format_instructions}\n\nالنص:\n{text}")
chain = prompt.partial(format_instructions=parser.get_format_instructions()) | get_llm() | parser
print(chain.invoke({"text": "فاتورة من شركة النور بمبلغ 1250.5 دولار"}))
