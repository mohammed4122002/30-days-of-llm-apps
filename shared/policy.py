"""مستند تجريبي موحّد (دليل الموظف) بتستخدمه أيام الـ RAG والتقييم. نفس محتوى day-06/sample.pdf."""
POLICY = [
    ("ساعات العمل", "يبدأ الدوام الرسمي الساعة الثامنة صباحًا وينتهي الساعة الرابعة عصرًا، من الأحد إلى الخميس. يُسمح بالعمل عن بُعد يومين في الأسبوع بعد موافقة المدير المباشر."),
    ("الإجازة السنوية", "يستحق الموظف إجازة سنوية مدتها واحد وعشرون يومًا مدفوعة الأجر، تزيد إلى ثلاثين يومًا بعد إتمام خمس سنوات من الخدمة. يجب تقديم طلب الإجازة قبل أسبوعين على الأقل."),
    ("الإجازة المرضية", "يحق للموظف الحصول على إجازة مرضية مدفوعة حتى أربعة عشر يومًا في السنة، بشرط تقديم تقرير طبي معتمد عند تجاوز يومين متتاليين."),
    ("سياسة الاسترجاع", "يمكن للعميل استرجاع المنتج خلال أربعة عشر يومًا من تاريخ الشراء، بشرط أن يكون المنتج بحالته الأصلية ومعه الفاتورة."),
    ("الدعم الفني", "فريق الدعم الفني متاح على مدار الساعة طوال أيام الأسبوع عبر البريد الإلكتروني والدردشة المباشرة. متوسط زمن الرد ساعتان."),
    ("أمن المعلومات", "يُمنع مشاركة كلمات المرور أو مفاتيح الوصول مع أي شخص. يجب تفعيل التحقق الثنائي على جميع حسابات العمل، والإبلاغ عن أي رسالة مشبوهة فورًا."),
]


def policy_docs():
    from langchain_core.documents import Document
    return [Document(page_content=f"{t}: {b}", metadata={"source": "دليل_الموظف.pdf", "page": i // 2 + 1}) for i, (t, b) in enumerate(POLICY)]


def policy_retriever(k: int = 2):
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_community.vectorstores import FAISS
    emb = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-base")
    return FAISS.from_documents(policy_docs(), emb).as_retriever(search_kwargs={"k": k})


def policy_rag(llm, k: int = 2):
    """بوت الأسئلة من دليل الموظف (نفس فكرة اليوم 8)."""
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.runnables import RunnablePassthrough
    fmt = lambda ds: "\n\n".join(d.page_content for d in ds)
    prompt = ChatPromptTemplate.from_template("أجب باختصار وفقط من السياق. إن لم تجد الجواب قل «لا أعرف».\n\nالسياق:\n{context}\n\nالسؤال: {question}")
    return {"context": policy_retriever(k) | fmt, "question": RunnablePassthrough()} | prompt | llm | StrOutputParser()
