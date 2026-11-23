import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langsmith import Client
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tracers.context import collect_runs

chain = get_llm() | StrOutputParser()
with collect_runs() as cb:
    out = chain.invoke("اكتب جملة ترحيب قصيرة لعميل جديد.",
                       config={"tags": ["prod", "v2"], "metadata": {"user_tier": "free", "feature": "welcome"}})
    run_id = cb.traced_runs[0].id
print("الجواب:", out)

# المستخدم ضغط «إعجاب» → بنربط رأيه بنفس الـ run
Client().create_feedback(run_id=run_id, key="thumbs", score=1, comment="جواب لطيف")
print("تم ربط التقييم بالـ run:", run_id)
