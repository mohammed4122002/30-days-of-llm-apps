import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

import os
from langsmith import traceable

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "30-days-day-11"

@traceable(name="ask")
def ask(q: str) -> str:
    return get_llm().invoke(q).content

print(ask("ما عاصمة الأردن؟"))
