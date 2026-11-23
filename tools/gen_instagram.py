"""كابشن إنستغرام لريلز السلسلة: day-XX/instagram.md لكل يوم، و downloads/instagram-captions.md للكل.
إنستغرام: أقصر من لينكدإن، الرابط بالبايو (الروابط بالكابشن ما بتشتغل)، و 10 هاشتاغات تقريبًا."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'days.json'), encoding='utf-8'))
BASE = ['#الذكاء_الاصطناعي', '#برمجة', '#تعلم_الآلة', '#AI', '#LLM', '#Python', '#30DaysOfLLMApps']
PHASE = [(5, 'أسبوع الأساسيات', ['#HuggingFace', '#LangChain', '#PromptEngineering']),
         (10, 'أسبوع الـ RAG', ['#RAG', '#LangChain', '#VectorDatabase']),
         (15, 'أسبوع LangSmith', ['#LangSmith', '#LLMOps', '#AIEvaluation']),
         (20, 'أسبوع الوكلاء', ['#AIAgents', '#LangGraph', '#Automation']),
         (25, 'أسبوع التخصيص', ['#HuggingFace', '#FineTuning', '#AISecurity']),
         (30, 'أسبوع النشر', ['#Gradio', '#n8n', '#BuildInPublic'])]
SAVE = ['احفظ الريل عشان ترجعله لما تطبّق.', 'احفظه، بتحتاجه لما تبني مشروعك.', 'خلّيه محفوظ عندك، بترجعله.']

def phase(n):
    for lim, name, tags in PHASE:
        if n <= lim: return name, tags

def caption(n, d):
    name, tags = phase(n)
    title = d['title'].replace(': ', ' — ')
    nxt = D[n]['title'].replace(': ', ' — ') if n < 30 else None
    lines = [d['hook'], '',
             f'اليوم {n} من 30 بتحدي 30 Days of LLM Apps، {name}.',
             f'موضوع اليوم: {title}.', '',
             d['cta'], 'جاوبني بالتعليقات.', '',
             SAVE[n % 3] + ' والكود كامل مع الشرح بالرابط بالبايو.',
             f'بكرة: {nxt}.' if nxt else 'وهيك خلص التحدي. شكرًا لكل حدا كان معي.', '',
             ' '.join(BASE + tags)]
    return '\n'.join(lines)

DAY0 = '\n'.join([
    '30 يوم n8n خلصت. والجاية أكبر.', '',
    'بنيت 30 أتمتة حقيقية، وأهم درس طلعت فيه: الاستمرار أهم من الكمال.',
    'بس ضل سؤال براسي: شو اللي بيصير جوّا الذكاء الاصطناعي؟', '',
    'عشان هيك ببلّش تحدي جديد: 30 Days of LLM Apps.',
    '30 يوم، تطبيق ذكاء اصطناعي كل يوم، بالعربي، بـ Hugging Face و LangChain و LangSmith.', '',
    'أول يوم الثلاثاء الساعة 9 الصبح.',
    'إذا ناوي تمشي معي اكتب "معك" بالتعليقات، وتابعني عشان ما يفوتك اليوم الأول.', '',
    ' '.join(BASE + ['#n8n', '#Automation', '#BuildInPublic'])])

def md(title, cap):
    return f"""# {title}

## الكابشن
```text
{cap}
```

## ملاحظات النشر
- أضف صوت رائج أو صوتك من مكتبة إنستغرام، والفيديو مصمم يشتغل بدون صوت كمان.
- غلاف الريل (Cover): اختار لقطة من الثانية الأولى أو الثانية، لما يكون رقم اليوم أو صورتك واضحين.
- حط رابط المستودع بالبايو: https://github.com/mohammed4122002/30-days-of-llm-apps
"""

allc = ['# كابشن إنستغرام لكل الريلز\n', '## اليوم 0 (الانتقال)\n```text\n' + DAY0 + '\n```\n']
open(os.path.join(ROOT, 'announcements', 'day-00-bridge', 'instagram.md'), 'w', encoding='utf-8').write(md('اليوم 0: ريل الانتقال على إنستغرام', DAY0))
for n, d in enumerate(D, 1):
    cap = caption(n, d)
    open(os.path.join(ROOT, f'day-{n:02d}', 'instagram.md'), 'w', encoding='utf-8').write(md(f'اليوم {n}: ريل إنستغرام', cap))
    allc.append(f'## اليوم {n}\n```text\n{cap}\n```\n')
os.makedirs(os.path.join(ROOT, 'downloads'), exist_ok=True)
open(os.path.join(ROOT, 'downloads', 'instagram-captions.md'), 'w', encoding='utf-8').write('\n'.join(allc))
print('ok', len(D) + 1)
