from langsmith import Client

# الأسئلة الذهبية: كل سؤال ومعه الجواب المرجعي (من دليل الموظف)
GOLDEN = [
    ("كم مدة الإجازة السنوية؟", "21 يومًا، وتصير 30 بعد خمس سنوات"),
    ("ما سياسة الاسترجاع؟", "خلال 14 يومًا من الشراء مع الفاتورة"),
    ("متى يبدأ الدوام؟", "الساعة الثامنة صباحًا"),
    ("كم يوم عمل عن بعد مسموح؟", "يومين في الأسبوع بموافقة المدير"),
    ("متى أحتاج تقرير طبي؟", "عند تجاوز يومين متتاليين من الإجازة المرضية"),
    ("هل الدعم الفني متاح بالليل؟", "نعم، على مدار الساعة طوال الأسبوع"),
    ("كم متوسط زمن رد الدعم؟", "ساعتان"),
    ("هل أقدر أشارك كلمة المرور مع زميلي؟", "لا، ممنوع"),
]
client = Client()
name = "rag-golden-v1"
ds = client.read_dataset(dataset_name=name) if client.has_dataset(dataset_name=name) else client.create_dataset(name, description="أسئلة ذهبية")
if not list(client.list_examples(dataset_id=ds.id, limit=1)):
    client.create_examples(dataset_id=ds.id, inputs=[{"q": q} for q, _ in GOLDEN], outputs=[{"a": a} for _, a in GOLDEN])
print("Dataset:", ds.name, "| عدد الأسئلة:", len(list(client.list_examples(dataset_id=ds.id))))
