// كاروسيل منشور الانتقال (6 شرائح + PDF).  الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> NODE_PATH=<مسار playwright> node tools/render_bridge.js
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const {STYLE,slide}=require('./render_carousel.js');
const OUT=path.resolve(__dirname,'../announcements/day-00-bridge');fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
const G='#C9A24B';
const extra=`<style>
.hero{font-size:104px;line-height:1.25;font-weight:800}.hero span{color:${G}}
.lead{font-size:40px;line-height:1.6;margin-top:24px;color:#333}
.done{display:flex;align-items:center;gap:20px;font-weight:800;font-size:56px;direction:ltr;justify-content:flex-end}
.done i{font-style:normal;width:76px;height:76px;border-radius:50%;background:${G};display:flex;align-items:center;justify-content:center;font-size:44px}
.list{display:flex;flex-direction:column;gap:20px;margin-top:40px}
.q{font-size:84px;line-height:1.4;font-weight:800}.q span{color:${G}}
.tools{display:flex;flex-direction:column;gap:22px}
.tool{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:40px;padding:28px 34px;border-radius:24px;box-shadow:0 10px 24px rgba(0,0,0,.2)}
.tool small{font-size:28px;font-weight:400;opacity:.85}
.pills{display:flex;flex-wrap:wrap;gap:14px;margin-top:34px}.pills span{background:#111;color:#fff;font-weight:800;font-size:30px;padding:10px 26px;border-radius:99px;border:2px solid ${G}}
.date{font-size:96px;font-weight:800;line-height:1.2}.date span{color:${G}}
.ma{display:inline-block;background:#111;color:#fff;padding:2px 24px;border-radius:16px;border:3px solid ${G}}
</style>`;
const card=(cls,html)=>`<div class="card ${cls}">${html}</div>`;
const s=[
slide(1,`<div class="hero">30 يوم انتهت.<br><span>والجاية أكبر.</span></div><div class="lead">ربطت الأدوات ببعض.<br>هلّق جاي دور العقل نفسه.</div><div class="swipe">اسحب <b>←</b></div>`),
slide(2,`<div class="label">المحطة الأولى</div><div class="done">30 Days of n8n <i>✓</i></div><div class="lead" style="margin-top:12px">30 workflow حقيقية، منها:</div>
<div class="list">${card('dark','<div class="num">01</div><div>ملخص Gmail يوصلك على Telegram كل صباح</div>')}${card('gold','<div class="num">13</div><div>وكيل RAG بيجاوب من ملفات الشركة مع المصدر</div>')}${card('dark','<div class="num">30</div><div>نظام بيرجّع طالب منقطع عن المدرسة لمساره</div>')}</div>`),
slide(3,`<div class="label">3 دروس طلعت فيها</div><div class="cards">${card('dark','<div class="num">1</div><div>الأتمتة مش أدوات. الأتمتة إنك تشوف المشكلة قبل غيرك.</div>')}${card('gold','<div class="num">2</div><div>الاستمرار أهم من الكمال.</div>')}${card('dark','<div class="num">3</div><div>المحتوى التقني العربي ناقص، ونحنا قادرين نعبّيه.</div>')}</div>`),
slide(4,`<div class="label">السؤال اللي ضل يلاحقني</div><div class="q">شو اللي بيصير<br><span>جوّا عقدة الـ AI؟</span></div><div class="lead">n8n علّمتني أربط الأدوات.<br>هلّق بدي أبني العقل نفسه.</div>`),
slide(5,`<div class="label">التحدي الجديد</div><div class="done" style="font-size:60px;margin-bottom:30px">30 Days of LLM Apps</div>
<div class="tools"><div class="tool dark"><span>Hugging Face</span><small>نماذج مفتوحة المصدر</small></div><div class="tool gold"><span>LangChain + LangGraph</span><small>RAG ووكلاء</small></div><div class="tool dark"><span>LangSmith</span><small>تتبع وتقييم بالأرقام</small></div></div>
<div class="pills"><span>مشكلة حقيقية</span><span>كود مفتوح</span><span>شرح بالعربي</span><span>نتيجة تجربها</span></div>`),
slide(6,`<div class="label">موعدنا</div><div class="date">الثلاثاء<br><span>9 الصبح</span></div><div class="lead" style="font-weight:800;color:#111;margin-top:40px">ناوي تمشي معي؟ اكتب <span class="ma">معك</span> بالتعليقات، وبوسمك بأول يوم.</div><div class="acts"><span>أعجبني</span><span>شارك</span><span>احفظ</span><span>تابعني</span></div><div class="tl" style="margin-top:36px;font-size:28px">روابط المستودعين بأول تعليق</div>`)];
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1440}});
await pg.setContent(`<html dir="rtl"><style>${STYLE}</style>${extra}<body>${s.join('')}</body></html>`);await pg.evaluate(()=>document.fonts.ready);
const sl=pg.locator('.slide');for(let k=0;k<6;k++)await sl.nth(k).screenshot({path:path.join(OUT,'assets',`slide-${k+1}.jpg`),type:'jpeg',quality:90});
await pg.pdf({path:path.join(OUT,'carousel.pdf'),width:'1080px',height:'1440px',printBackground:true});await br.close();})();
