// كاروسيل منشور الانتقال (7 شرائح + PDF) بتصميم V3.  الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> NODE_PATH=<مسار playwright> node tools/render_bridge.js
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const {STYLE,V3CSS,slide3,ic,logo,PORTRAIT,hl,esc}=require('./render_carousel.js');
const OUT=path.resolve(__dirname,'../announcements/day-00-bridge');fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
const G='#C9A24B', GL='#E8C066', T=7;

const extra=`<style>
.mini2{display:flex;align-items:center;gap:18px;direction:ltr;justify-content:flex-end}
.tile2{width:120px;height:120px;border-radius:32px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);
 box-shadow:0 0 0 4px #D9B25E,0 0 0 11px rgba(201,162,75,.2),0 0 50px 8px rgba(255,200,90,.35),0 24px 40px rgba(30,20,5,.4)}
.arw2{width:70px;height:70px;border-radius:50%;background:#111;border:3px solid ${G};display:flex;align-items:center;justify-content:center}
.done{display:flex;align-items:center;gap:20px;font-weight:800;font-size:58px;color:#fff;direction:ltr;justify-content:flex-end;margin-bottom:10px}
.done i{width:76px;height:76px;border-radius:50%;background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);display:flex;align-items:center;justify-content:center}
.lead2{font-size:34px;color:#e9e2cf;margin-bottom:34px}
.pc{display:flex;align-items:center;gap:26px;padding:26px 30px;border-radius:26px;font-weight:800;font-size:38px;line-height:1.35;margin-top:22px;
 background:linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%);color:#111;box-shadow:0 18px 40px rgba(0,0,0,.4)}
.pc .n{flex:none;font-size:72px;line-height:.8;color:transparent;-webkit-text-stroke:3px #111;direction:ltr;width:120px;text-align:center}
.q2{font-size:92px;line-height:1.35;font-weight:800;color:#fff}
.sub2{font-size:38px;line-height:1.6;color:#e9e2cf;margin-top:30px}
.when{display:flex;align-items:center;gap:40px}
.when .big2{font-size:110px;line-height:1.15;font-weight:800}.when .big2 span{color:${G}}
.pills2{display:flex;flex-wrap:wrap;gap:14px;margin-top:44px}
.pills2 span{display:flex;align-items:center;gap:10px;background:linear-gradient(150deg,#2a2a2a,#0d0d0d);color:#fff;font-weight:800;font-size:28px;padding:10px 24px 10px 14px;border-radius:99px;border:1px solid rgba(232,192,102,.45)}
</style>`;

const s=[];
// 1 الغلاف
s.push(slide3(1,T,`<div class="bignum" style="left:-30px;top:-40px;font-size:560px;-webkit-text-stroke:3px rgba(201,162,75,.3)">30</div>
<h1 style="font-size:96px;line-height:1.3">30 يوم انتهت.<br><mark>والجاية أكبر.</mark></h1>
<div class="cvrow">${PORTRAIT?`<div class="arch"><img src="${PORTRAIT}"><div class="tagme">${ic('sparkle',22,GL)}AI Engineer</div></div>`:''}
<div class="cvside"><div class="mini2"><div class="tile2">${logo('n8n',70,'gold')}</div><div class="arw2">${ic('arrow-right',38,GL,0,'bold')}</div><div class="tile2">${ic('brain',78,GL,0,'duotone')}</div></div>
<div class="dttl" style="text-align:right;font-size:40px;color:#111">من n8n<br>إلى LLM Apps</div>
<div class="dttl" style="text-align:right">ربطت الأدوات ببعض.<br>هلّق جاي دور العقل نفسه.</div>
<div class="swp">اسحب ${ic('arrow-left',28,GL,0,'bold')}</div></div></div>`));
// 2 المحطة الأولى (داكن)
s.push(slide3(2,T,`<div class="label">${ic('flag',30,'#111',0,'fill')}المحطة الأولى</div>
<div class="done">30 Days of n8n <i>${ic('check',44,'#111',0,'bold')}</i></div><div class="lead2">30 workflow حقيقية، منها:</div>
<div class="pc"><div class="n">01</div><div>ملخص Gmail يوصلك على Telegram كل صباح</div></div>
<div class="pc"><div class="n">13</div><div>وكيل RAG بيجاوب من ملفات الشركة مع المصدر</div></div>
<div class="pc"><div class="n">30</div><div>نظام بيرجّع طالب منقطع عن المدرسة لمساره</div></div>`,true));
// 3 الدروس
const L=[['الأتمتة مش أدوات. الأتمتة إنك تشوف المشكلة قبل غيرك.','dark'],['الاستمرار أهم من الكمال.','gold'],['المحتوى التقني العربي ناقص، ونحنا قادرين نعبّيه.','dark']];
s.push(slide3(3,T,`<div class="label">${ic('lightbulb',30,GL)}3 دروس طلعت فيها</div><div class="cards">${L.map(([t,c],i)=>`<div class="bcard ${c}" style="box-shadow:0 18px 40px rgba(30,22,5,.28)"><div class="n">0${i+1}</div><div>${esc(t)}</div></div>`).join('')}</div>`));
// 4 السؤال (داكن)
s.push(slide3(4,T,`<div class="label">${ic('question',30,'#111',0,'fill')}السؤال اللي ضل يلاحقني</div>
<div class="q2">شو اللي بيصير <mark>جوّا عقدة الـ AI؟</mark></div><div class="sub2">n8n علّمتني أربط الأدوات.<br>هلّق بدي أبني العقل نفسه.</div>`,true,
`<div style="position:absolute;left:-120px;bottom:60px;opacity:.16">${ic('brain',760,GL,0,'thin')}</div>`));
// 5 التحدي الجديد (مخطط)
const F=[[logo('huggingface',44,'gold'),'Hugging Face','نماذج مفتوحة المصدر'],[logo('langchain',44,'gold'),'LangChain','RAG وسلاسل'],
 [ic('pulse',46,GL,0,'duotone'),'LangSmith','تقييم بالأرقام'],[logo('langgraph',44,'gold'),'LangGraph','وكلاء بيستأذنوا'],[ic('rocket-launch',46,GL,0,'duotone'),'النهاية','منتج منشور ومقيّم']];
s.push(slide3(5,T,`<div class="label">${ic('rocket-launch',30,GL)}التحدي الجديد</div><div class="fttl" style="direction:ltr;text-align:right">30 Days of LLM Apps</div>
<div class="flow f5">${F.map(([ix,a,b],i)=>`<div class="step ${i%2?'l':'r'}"><div class="node"></div><div class="scard"><div class="ix">${ix}</div><div><small>${a}</small>${b}</div></div></div>`).join('')}</div>`));
// 6 الموعد
s.push(slide3(6,T,`<div class="label">${ic('calendar-check',30,GL)}موعدنا</div>
<div class="when"><div class="dtile">${ic('calendar-check',92,GL,0,'duotone')}</div><div class="big2">الثلاثاء<br><span>9 الصبح</span></div></div>
<div class="pills2"><span>${ic('target',28,GL)}مشكلة حقيقية</span><span>${ic('code',28,GL)}كود مفتوح</span><span>${ic('translate',28,GL)}شرح بالعربي</span><span>${ic('play',28,GL)}نتيجة تجربها</span></div>`));
// 7 الدعوة (داكن)
s.push(slide3(7,T,`<div class="ctawrap">${PORTRAIT?`<div class="arch"><img src="${PORTRAIT}"><div class="tagme">${ic('chat-circle-dots',24,GL)}معك؟</div></div>`:''}
<div class="ctaq">ناوي تمشي معي؟<br>اكتب <mark>معك</mark> بالتعليقات، وبوسمك بأول يوم.</div>
<div class="acts"><span>${ic('heart',30,'#111')}أعجبني</span><span>${ic('repeat',30,'#111')}شارك</span><span>${ic('bookmark-simple',30,'#111')}احفظ</span><span>${ic('user-plus',30,'#111')}تابعني</span></div>
<div class="gh">${logo('github',30,'#e9e2cf')}روابط المستودعين بأول تعليق</div></div>`,true));

(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1440}});
await pg.setContent(`<html dir="rtl"><style>${STYLE}${V3CSS}</style>${extra}<body>${s.join('')}</body></html>`);await pg.evaluate(()=>document.fonts.ready);
const sl=pg.locator('.slide');for(let k=0;k<T;k++)await sl.nth(k).screenshot({path:path.join(OUT,'assets',`slide-${k+1}.jpg`),type:'jpeg',quality:90});
await pg.pdf({path:path.join(OUT,'carousel.pdf'),width:'1080px',height:'1440px',printBackground:true});await br.close();})();
