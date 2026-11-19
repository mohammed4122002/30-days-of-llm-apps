import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langsmith import Client
from langchain_core.output_parsers import StrOutputParser

chain = get_llm() | StrOutputParser()
out = chain.invoke("مرحبا", config={"tags": ["prod", "v2"], "metadata": {"user_tier": "free"}})

# لاحقًا: ربط تقييم المستخدم بالـ run
Client().create_feedback(run_id="<RUN_ID>", key="thumbs", score=1)
