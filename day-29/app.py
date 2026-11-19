import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

import os
from langsmith import tracing_context

os.environ["LANGSMITH_PROJECT"] = "my-app-prod"

def handle(q: str, user: str):
    with tracing_context(enabled=True, tags=["prod"], metadata={"user": user}):
        return get_llm().invoke(q).content

print(handle("مرحبا", "u42"))
