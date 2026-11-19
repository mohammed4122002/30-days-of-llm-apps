# اليوم 04 — مخرجات منظمة: حوّل نص فوضوي إلى JSON نظيف

> المرحلة: **أساسيات** · الأدوات: **Pydantic + PydanticOutputParser**

## 🎯 المشكلة
كيف أستخرج بيانات موثوقة من نص حر (فواتير، إيميلات)؟

## 🧠 شو رح تتعلم
- تعريف Schema بـ Pydantic
- تعليمات الصيغة تلقائيًا (format_instructions)
- التعامل مع الأخطاء وإعادة المحاولة

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-04/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 05](../day-05/README.md)
