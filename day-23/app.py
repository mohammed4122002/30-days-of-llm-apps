from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model
from datasets import Dataset

name = "aubmindlab/bert-base-arabertv2"
tok = AutoTokenizer.from_pretrained(name)
model = AutoModelForSequenceClassification.from_pretrained(name, num_labels=2)
model = get_peft_model(model, LoraConfig(r=8, lora_alpha=16, target_modules=["query", "value"], task_type="SEQ_CLS"))
model.print_trainable_parameters()

ds = Dataset.from_list([{"text": "خدمة رائعة", "label": 1}, {"text": "سيئ جدًا", "label": 0}] * 100)
ds = ds.map(lambda b: tok(b["text"], truncation=True, padding="max_length", max_length=64), batched=True)
Trainer(model=model, args=TrainingArguments("out", num_train_epochs=1, per_device_train_batch_size=8, report_to="none"), train_dataset=ds).train()
model.save_pretrained("adapter")
