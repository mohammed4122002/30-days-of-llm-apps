# اليوم 09 — تحسين الاسترجاع: MMR + بحث هجين

> المرحلة: **RAG** · الأدوات: **MMR + BM25 + EnsembleRetriever**

## 🎯 المشكلة
الجواب موجود بالملف لكن البوت ما لقاه. ليش؟

## 🧠 شو رح تتعلم
- MMR لتنويع النتائج
- BM25 للكلمات المفتاحية + المتجهات للمعنى
- قياس الفرق قبل/بعد

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-09/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 📝 منشور لينكدإن
جاهز في [`post.md`](./post.md).

## 🔗 التالي
[اليوم 10](../day-10/README.md)
