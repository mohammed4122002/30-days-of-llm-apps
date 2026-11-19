# اليوم 29 — الإنتاج: تتبع وتقييم مستمر

> المرحلة: **نشر وختام** · الأدوات: **LangSmith Production Monitoring**

## 🎯 المشكلة
التطبيق نزل للمستخدمين. كيف أعرف جودته بعد أسبوع؟

## 🧠 شو رح تتعلم
- فصل مشروع الإنتاج عن التجريب
- تتبع كل الطلبات مع tags
- تقييم عينة من الإنتاج أسبوعيًا

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-29/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 30](../day-30/README.md)
