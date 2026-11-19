from huggingface_hub import HfApi

api = HfApi()
repo = "YOUR_USER/my-llm-app"
api.create_repo(repo, repo_type="space", space_sdk="gradio", exist_ok=True)
api.upload_folder(folder_path="day-26", repo_id=repo, repo_type="space")
api.add_space_secret(repo, "HF_TOKEN", "<token>")
print("https://huggingface.co/spaces/" + repo)
