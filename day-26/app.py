import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

import gradio as gr
from langchain_core.output_parsers import StrOutputParser

chain = get_llm() | StrOutputParser()

def chat(msg, history):
    return chain.invoke(msg)

gr.ChatInterface(chat, title="مساعدي الذكي", description="جرّب اسألني أي شيء").launch()
