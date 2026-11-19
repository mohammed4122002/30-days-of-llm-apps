# اليوم 18 — Agent ذكي بيقرر: يجاوب بمعرفته أم يبحث بملفاتك؟

> المرحلة: **وكلاء** · الأدوات: **LangGraph Conditional Edges (Router)**

## 🎯 المشكلة
ليش أبحث بالملفات لسؤال بسيط؟ وليش أخمّن لسؤال محتاج مصدر؟

## 🧠 شو رح تتعلم
- Router يصنّف السؤال
- conditional edges
- توفير تكلفة وزمن

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-18/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 19](../day-19/README.md)
