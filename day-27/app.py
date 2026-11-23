from pathlib import Path
from huggingface_hub import HfApi

api = HfApi()                                   # بياخد التوكن من HF_TOKEN أو من huggingface-cli login
repo = f"{api.whoami()['name']}/my-llm-app"
# ملاحظة: سبيس Gradio على CPU المجاني صار بده اشتراك PRO.
# فهون بننشر Static Space: النموذج بيشتغل جوّا متصفح الزائر بـ transformers.js، وهاد مجاني للكل.
api.create_repo(repo, repo_type="space", space_sdk="static", exist_ok=True)
api.upload_folder(folder_path=Path(__file__).parent / "space", repo_id=repo, repo_type="space")
# إذا تطبيقك بينادي Inference API: api.add_space_secret(repo, "HF_TOKEN", "<توكنك>")  ← السر بالإعدادات، مش بالملفات
print("https://huggingface.co/spaces/" + repo)
