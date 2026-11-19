# 🚀 30 Days of LLM Apps

**30 يوم · 30 مشروع · من الصفر إلى منتج ذكاء اصطناعي منشور ومُقيَّم.**

بعد سلسلة **30 يوم n8n**، هذا التحدي يفتح الصندوق الأسود: نبني بنفسنا بـ
**🤗 Hugging Face** + **🦜 LangChain / LangGraph** + **🛠️ LangSmith**.

> كل يوم: مشكلة حقيقية ← كود يشتغل ← شرح بالعربي.

## 🧭 المراحل
| الأيام | المحور |
|---|---|
| 1–5 | أساسيات HF و LangChain |
| 6–10 | RAG على ملفات عربية |
| 11–15 | LangSmith: تتبع، تقييم، مقارنة |
| 16–20 | وكلاء وأدوات (LangGraph) |
| 21–25 | تخصيص، LoRA، أمان |
| 26–30 | نشر ومشروع ختامي |

## ⚡ البدء السريع
```bash
git clone <repo-url> && cd 30-days-of-llm-apps
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # أضف HF_TOKEN و LANGSMITH_API_KEY
python day-01/app.py
```

## 📅 الأيام
| # | المرحلة | المشروع | الأدوات | ✔ |
|---|---|---|---|---|
| 01 | أساسيات | [أول نموذج مفتوح المصدر يرد عليك](./day-01/README.md) | Hugging Face Inference API | ⬜ |
| 02 | أساسيات | [أول سلسلة LangChain: Prompt \| LLM \| Parser](./day-02/README.md) | LangChain (LCEL) | ⬜ |
| 03 | أساسيات | [قوالب Prompts ذكية: مترجم يغيّر اللهجة](./day-03/README.md) | LangChain Prompt Templates | ⬜ |
| 04 | أساسيات | [مخرجات منظمة: حوّل نص فوضوي إلى JSON نظيف](./day-04/README.md) | Pydantic + PydanticOutputParser | ⬜ |
| 05 | أساسيات | [ذاكرة المحادثة: بوت يتذكرك](./day-05/README.md) | RunnableWithMessageHistory | ⬜ |
| 06 | RAG | [RAG الجزء 1: حمّل PDF عربي وقطّعه صح](./day-06/README.md) | PyPDFLoader + RecursiveCharacterTextSplitter | ⬜ |
| 07 | RAG | [RAG الجزء 2: Embeddings عربية + قاعدة متجهات](./day-07/README.md) | HuggingFace Embeddings + FAISS | ⬜ |
| 08 | RAG | [RAG الجزء 3: اسأل ملفاتك](./day-08/README.md) | LangChain Retriever + LCEL | ⬜ |
| 09 | RAG | [تحسين الاسترجاع: MMR + بحث هجين](./day-09/README.md) | MMR + BM25 + EnsembleRetriever | ⬜ |
| 10 | RAG | [RAG مع مصادر: كل إجابة معها دليلها](./day-10/README.md) | LangChain Citations | ⬜ |
| 11 | LangSmith | [LangSmith: أول مرة أشوف داخل «العقل»](./day-11/README.md) | LangSmith Tracing | ⬜ |
| 12 | LangSmith | [ابنِ Dataset للتقييم: الأسئلة الذهبية](./day-12/README.md) | LangSmith Datasets | ⬜ |
| 13 | LangSmith | [تقييم تلقائي: نموذج يصحّح نموذج](./day-13/README.md) | LangSmith evaluate + LLM-as-judge | ⬜ |
| 14 | LangSmith | [معركة النماذج: A ضد B على نفس الأسئلة](./day-14/README.md) | LangSmith Experiments | ⬜ |
| 15 | LangSmith | [التكلفة والزمن والأخطاء: لوحة مراقبة](./day-15/README.md) | LangSmith Tags, Metadata, Feedback | ⬜ |
| 16 | وكلاء | [أول Agent: نموذج يستخدم أدوات](./day-16/README.md) | LangGraph prebuilt agent + Tools | ⬜ |
| 17 | وكلاء | [LangGraph: ارسم المنطق كخريطة](./day-17/README.md) | LangGraph StateGraph | ⬜ |
| 18 | وكلاء | [Agent ذكي بيقرر: يجاوب بمعرفته أم يبحث بملفاتك؟](./day-18/README.md) | LangGraph Conditional Edges (Router) | ⬜ |
| 19 | وكلاء | [الإنسان بالحلقة: الوكيل يستأذن قبل ما ينفّذ](./day-19/README.md) | LangGraph Checkpointer + interrupt | ⬜ |
| 20 | وكلاء | [فريق وكلاء: باحث + كاتب + محرّر](./day-20/README.md) | LangGraph Multi-Agent | ⬜ |
| 21 | تخصيص | [تصنيف النصوص العربية بنموذج جاهز](./day-21/README.md) | Transformers pipeline | ⬜ |
| 22 | تخصيص | [ابنِ Dataset ونشره على Hugging Face Hub](./day-22/README.md) | datasets + push_to_hub | ⬜ |
| 23 | تخصيص | [Fine-tuning بـ LoRA: درّب نموذجك بدون GPU ضخم](./day-23/README.md) | PEFT / LoRA + Trainer | ⬜ |
| 24 | تخصيص | [هل تحسّن فعلًا؟ قارن الأساسي بالمضبوط](./day-24/README.md) | evaluate + مقارنة المقاييس | ⬜ |
| 25 | تخصيص | [حواجز الأمان: لا تثق بالمدخلات](./day-25/README.md) | Guardrails (قواعد + LLM) | ⬜ |
| 26 | نشر وختام | [واجهة Gradio: حوّل السكربت لتطبيق](./day-26/README.md) | Gradio ChatInterface | ⬜ |
| 27 | نشر وختام | [انشر على Hugging Face Spaces: رابط يشاركه العالم](./day-27/README.md) | HF Spaces + huggingface_hub | ⬜ |
| 28 | نشر وختام | [اربط عالمين: n8n + وكيل LangChain](./day-28/README.md) | FastAPI + Webhook + n8n | ⬜ |
| 29 | نشر وختام | [الإنتاج: تتبع وتقييم مستمر](./day-29/README.md) | LangSmith Production Monitoring | ⬜ |
| 30 | نشر وختام | [المشروع الختامي: منتج متكامل](./day-30/README.md) | كل ما تعلمناه | ⬜ |

## 🤝 المساهمة
افتح Issue أو PR، وشارك نسختك بالتحدي بوسم `#30DaysOfLLMApps`.

> ⚠️ الأكواد مكتوبة بحسب واجهات المكتبات الحالية، وقد تتغيّر الأسماء بين الإصدارات. جرّب كل يوم قبل نشره وعدّل ما يلزم.
