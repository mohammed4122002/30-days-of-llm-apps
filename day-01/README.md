# اليوم 01 — أول نموذج مفتوح المصدر يرد عليك

> المرحلة: **أساسيات** · الأدوات: **Hugging Face Inference API**

## 🎯 المشكلة
كيف أشغّل نموذج لغوي قوي بدون GPU وبدون دفع قرش؟

## 🧠 شو رح تتعلم
- إنشاء توكن HF وتأمينه في .env
- استدعاء نموذج مفتوح عبر InferenceClient
- الفرق بين النماذج المفتوحة والمغلقة

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-01/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 02](../day-02/README.md)
