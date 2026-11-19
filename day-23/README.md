# اليوم 23 — Fine-tuning بـ LoRA: درّب نموذجك بدون GPU ضخم

> المرحلة: **تخصيص** · الأدوات: **PEFT / LoRA + Trainer**

## 🎯 المشكلة
كيف أعلّم النموذج أسلوبي أو مجالي بتكلفة بسيطة؟

## 🧠 شو رح تتعلم
- فكرة LoRA: تدريب 1% من الأوزان
- إعداد LoraConfig
- حفظ الـ adapter ومشاركته

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-23/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 24](../day-24/README.md)
