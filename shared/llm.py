import os
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

DEFAULT_MODEL = "Qwen/Qwen2.5-72B-Instruct"

def get_llm(model: str | None = None, temperature: float = 0.3):
    """نموذج HF مفتوح المصدر عبر Inference API (يحتاج HF_TOKEN)."""
    endpoint = HuggingFaceEndpoint(
        repo_id=model or os.getenv("HF_MODEL", DEFAULT_MODEL),
        huggingfacehub_api_token=os.getenv("HF_TOKEN"),
        temperature=temperature,
        max_new_tokens=512,
        task="text-generation",
    )
    return ChatHuggingFace(llm=endpoint)
