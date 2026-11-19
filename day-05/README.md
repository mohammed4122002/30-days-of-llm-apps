# اليوم 05 — ذاكرة المحادثة: بوت يتذكرك

> المرحلة: **أساسيات** · الأدوات: **RunnableWithMessageHistory**

## 🎯 المشكلة
كيف أخلي البوت يتذكر اسمك وسياق الحوار؟

## 🧠 شو رح تتعلم
- حفظ تاريخ المحادثة لكل session
- MessagesPlaceholder
- متى تقصّ الذاكرة لتوفير التوكنز

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-05/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 06](../day-06/README.md)
