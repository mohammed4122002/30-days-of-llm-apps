# اليوم 21 — تصنيف النصوص العربية بنموذج جاهز

> المرحلة: **تخصيص** · الأدوات: **Transformers pipeline**

## 🎯 المشكلة
كيف أصنّف آلاف التعليقات (إيجابي/سلبي) بدقة وبدون تدريب؟

## 🧠 شو رح تتعلم
- اختيار نموذج عربي من الـ Hub
- pipeline في 3 أسطر
- قراءة الـ confidence

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-21/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 22](../day-22/README.md)
