# اليوم 16 — أول Agent: نموذج يستخدم أدوات

> المرحلة: **وكلاء** · الأدوات: **LangGraph prebuilt agent + Tools**

## 🎯 المشكلة
كيف أخلي النموذج يحسب ويبحث ويتصرف بدل ما يتكلم فقط؟

## 🧠 شو رح تتعلم
- تعريف أدوات بـ @tool
- حلقة التفكير → أداة → ملاحظة
- تتبع قرارات الوكيل في LangSmith

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-16/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 17](../day-17/README.md)
