# اليوم 19 — الإنسان بالحلقة: الوكيل يستأذن قبل ما ينفّذ

> المرحلة: **وكلاء** · الأدوات: **LangGraph Checkpointer + interrupt**

## 🎯 المشكلة
كيف أضمن إن الوكيل ما يرسل إيميل أو يمسح شيء لحاله؟

## 🧠 شو رح تتعلم
- MemorySaver لحفظ الحالة
- إيقاف قبل الخطوة الحساسة
- الاستئناف بعد الموافقة

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-19/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 20](../day-20/README.md)
