# اليوم 08 — RAG الجزء 3: اسأل ملفاتك

> المرحلة: **RAG** · الأدوات: **LangChain Retriever + LCEL**

## 🎯 المشكلة
كيف أبني بوت يجاوب من مستنداتي أنا لا من تخمينات النموذج؟

## 🧠 شو رح تتعلم
- ربط retriever بالـ prompt
- تعليمات «لا تخمّن» لتقليل الهلوسة
- اختبار أسئلة يعرف المستند جوابها وأسئلة لا يعرفها

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-08/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 09](../day-09/README.md)
