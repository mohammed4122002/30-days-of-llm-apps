# اليوم 07 — RAG الجزء 2: Embeddings عربية + قاعدة متجهات

> المرحلة: **RAG** · الأدوات: **HuggingFace Embeddings + FAISS**

## 🎯 المشكلة
كيف يفهم الكمبيوتر إن «سيارة» و«مركبة» نفس المعنى؟

## 🧠 شو رح تتعلم
- Embeddings متعددة اللغات (multilingual-e5)
- بناء فهرس FAISS وحفظه
- البحث بالمعنى لا بالكلمات

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-07/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 08](../day-08/README.md)
