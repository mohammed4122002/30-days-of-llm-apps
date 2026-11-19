# اليوم 06 — RAG الجزء 1: حمّل PDF عربي وقطّعه صح

> المرحلة: **RAG** · الأدوات: **PyPDFLoader + RecursiveCharacterTextSplitter**

## 🎯 المشكلة
ليش RAG بيفشل؟ غالبًا لأن التقطيع سيّئ من البداية.

## 🧠 شو رح تتعلم
- تحميل PDF إلى Documents
- اختيار chunk_size و overlap
- تأثير التقطيع على جودة الإجابة

## ▶️ التشغيل
```bash
cp .env.example .env      # ضع HF_TOKEN و LANGSMITH_API_KEY
pip install -r requirements.txt
python day-06/app.py
```

## 📸 النتيجة
ضع لقطة شاشة في `assets/` (للتطبيق + لقطة LangSmith Trace من اليوم 11 وما بعد).

## 🔗 التالي
[اليوم 07](../day-07/README.md)
