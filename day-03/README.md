# اليوم 03 — قوالب Prompts ذكية: مترجم يغيّر اللهجة

> المرحلة: **أساسيات** · الأدوات: **LangChain Prompt Templates**

## 🎯 المشكلة
كيف أخلي نفس الأداة تتكلم بأكثر من أسلوب بدون إعادة كتابة؟

## 🧠 شو رح تتعلم
- System و Human messages
- متغيرات في القالب (لهجة، نبرة)
- Few-shot examples

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-03/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 04](../day-04/README.md)
