from langsmith import Client

client = Client()
ds = client.create_dataset("rag-golden-v1", description="أسئلة ذهبية")
client.create_examples(
    dataset_id=ds.id,
    inputs=[{"q": "كم مدة الإجازة السنوية؟"}, {"q": "ما سياسة الاسترجاع؟"}],
    outputs=[{"a": "14 يومًا"}, {"a": "خلال 14 يومًا من الشراء"}],
)
