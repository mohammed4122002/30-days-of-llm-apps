import os
from huggingface_hub import InferenceClient

client = InferenceClient(model=os.getenv("HF_MODEL", "Qwen/Qwen2.5-72B-Instruct"), token=os.getenv("HF_TOKEN"))
r = client.chat_completion(messages=[{"role": "user", "content": "اشرح الـ Transformer بجملتين"}], max_tokens=200)
print(r.choices[0].message.content)
