from datasets import Dataset, DatasetDict

rows = [{"text": "خدمة رائعة", "label": 1}, {"text": "تأخر الطلب", "label": 0}] * 50
ds = Dataset.from_list(rows).train_test_split(test_size=0.2, seed=42)
print(ds)
# ds.push_to_hub("YOUR_USER/arabic-sentiment-mini")  # بعد huggingface-cli login
