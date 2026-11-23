import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))
from shared.llm import get_llm

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# مثال واحد لكل لهجة (few-shot): بيعلّم النموذج الأسلوب أحسن من أي شرح
EXAMPLES = {
    "الفلسطينية": ("كيف حالك؟ ماذا تفعل الآن؟", "كيفك؟ شو بتعمل هلقيت؟"),
    "الشامية": ("كيف حالك؟ ماذا تفعل الآن؟", "كيفك؟ شو عم تعمل هلق؟"),
    "المصرية": ("كيف حالك؟ ماذا تفعل الآن؟", "إزيك؟ بتعمل إيه دلوقتي؟"),
}
prompt = ChatPromptTemplate.from_messages([
    ("system", "أنت مترجم لهجات. حوّل الجملة من الفصحى إلى اللهجة {dialect} بنبرة {tone}. اكتب الجملة فقط."),
    ("human", "{ex_in}"), ("ai", "{ex_out}"),
    ("human", "{text}"),
])
chain = prompt | get_llm() | StrOutputParser()
for dialect, (ex_in, ex_out) in EXAMPLES.items():
    print(dialect, "→", chain.invoke({"dialect": dialect, "tone": "ودّية", "ex_in": ex_in, "ex_out": ex_out,
                                      "text": "أريد أن أذهب إلى السوق الآن، هل تأتي معي؟"}))
