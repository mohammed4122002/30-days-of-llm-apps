# اليوم 13 — تقييم تلقائي: نموذج يصحّح نموذج

> المرحلة: **LangSmith** · الأدوات: **LangSmith evaluate + LLM-as-judge**

## 🎯 المشكلة
كيف أقيّم 200 إجابة بدون ما أقراها كلها بنفسي؟

## 🧠 شو رح تتعلم
- كتابة evaluator مخصص
- LLM-as-judge ومحاذيره
- قراءة النتائج والبحث عن الأنماط

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-13/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 14](../day-14/README.md)
