# اليوم 25 — حواجز الأمان: لا تثق بالمدخلات

> المرحلة: **تخصيص** · الأدوات: **Guardrails (قواعد + LLM)**

## 🎯 المشكلة
كيف أحمي تطبيقي من Prompt Injection وتسريب البيانات؟

## 🧠 شو رح تتعلم
- كشف محاولات Prompt Injection
- إخفاء البيانات الحساسة (PII)
- فحص المخرجات قبل عرضها

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-25/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 26](../day-26/README.md)
