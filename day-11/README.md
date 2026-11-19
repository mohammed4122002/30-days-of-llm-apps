# اليوم 11 — LangSmith: أول مرة أشوف داخل «العقل»

> المرحلة: **LangSmith** · الأدوات: **LangSmith Tracing**

## 🎯 المشكلة
ليش النموذج جاوب هيك؟ أي خطوة بالسلسلة خرّبت؟

## 🧠 شو رح تتعلم
- تفعيل التتبع بمتغيرات البيئة
- قراءة الـ trace: prompt، توكنز، زمن
- @traceable لدوالك الخاصة

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-11/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 12](../day-12/README.md)
