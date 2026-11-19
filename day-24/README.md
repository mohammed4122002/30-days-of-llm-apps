# اليوم 24 — هل تحسّن فعلًا؟ قارن الأساسي بالمضبوط

> المرحلة: **تخصيص** · الأدوات: **evaluate + مقارنة المقاييس**

## 🎯 المشكلة
الـ fine-tuning بدون قياس = تفاؤل مش علم.

## 🧠 شو رح تتعلم
- Accuracy و F1
- اختبار على بيانات لم يرها النموذج
- تقرير مقارنة صادق

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-24/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 25](../day-25/README.md)
