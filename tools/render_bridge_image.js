// صورة منشور الانتقال الواحدة (1080×1350) بتصميم V3.  الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> NODE_PATH=<مسار playwright> node tools/render_bridge_image.js
const {chromium}=require('playwright');const path=require('path');
const {STYLE,V3CSS,V4CSS,slide3,ic,logo,PORTRAIT}=require('./render_carousel.js');
const OUT=path.resolve(__dirname,'../announcements/day-00-bridge/post.jpg');
const G='#C9A24B', GL='#E8C066';

const extra=`<style>
html,body{width:1080px;height:1350px;overflow:hidden}
.slide{height:1350px}.cnt{display:none}
.w{padding:56px 64px 44px}
.body{justify-content:flex-start;padding-top:20px}
h1.hd{font-size:96px;line-height:1.55;font-weight:800;position:relative}
.row2{display:flex;gap:34px;align-items:center;margin-top:18px;direction:ltr}
.row2 .arch{width:380px;height:510px;border-radius:190px 190px 36px 36px}
.row2 .arch img{border-radius:182px 182px 28px 28px}
.col{flex:1;direction:rtl;display:flex;flex-direction:column;gap:14px}
.pcard{border-radius:26px;padding:22px 24px;box-shadow:0 16px 34px rgba(30,22,5,.28)}
.pcard.dark{background:linear-gradient(150deg,#363636 0%,#1c1c1c 60%,#111 100%);color:#fff;border:1px solid rgba(232,192,102,.3)}
.pcard.gold{background:linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%);color:#111;border:1px solid rgba(255,255,255,.6)}
.ph{display:flex;align-items:center;gap:14px;font-weight:800;font-size:31px;direction:ltr;justify-content:flex-end}
.ph i{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 20%,#454545,#141414 65%,#050505);box-shadow:0 0 0 3px #D9B25E}
.st{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:22px;padding:6px 16px;border-radius:99px;margin-top:12px}
.dark .st{background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111}.gold .st{background:#111;color:#fff}
.pbar{height:12px;border-radius:99px;margin-top:14px;overflow:hidden;direction:ltr}.dark .pbar{background:#444}.gold .pbar{background:rgba(0,0,0,.15)}
.pbar i{display:block;height:100%}.dark .pbar i{background:linear-gradient(90deg,${G},${GL})}.gold .pbar i{background:#111}
.meta{display:flex;justify-content:space-between;font-size:20px;margin-top:8px;opacity:.85}
.chips{display:flex;gap:8px;margin-top:12px;direction:ltr;flex-wrap:wrap;justify-content:flex-end}
.chips span{display:flex;align-items:center;gap:6px;background:#111;color:#fff;font-weight:800;font-size:18px;padding:4px 12px 4px 5px;border-radius:99px}
.chips b{width:28px;height:28px;border-radius:50%;background:#2b2b2b;display:flex;align-items:center;justify-content:center}
.down{align-self:center;width:52px;height:52px;border-radius:50%;background:#111;border:3px solid ${G};display:flex;align-items:center;justify-content:center}
.cta2{margin-top:auto;display:flex;align-items:center;justify-content:center;gap:16px;font-weight:800;font-size:40px}
.cta2 b{background:linear-gradient(150deg,#2a2a2a,#0d0d0d);color:#F6DE9C;padding:4px 26px;border-radius:16px;border:3px solid ${G}}
</style>`;

const chip=(n,l)=>`<span><b>${logo(n,18,'#fff')}</b>${l}</span>`;
const html=`<html dir="rtl"><style>${STYLE}${V3CSS}${V4CSS}</style>${extra}<body>${slide3(1,1,`
<div class="bignum" style="left:-30px;top:-60px;font-size:540px;-webkit-text-stroke:3px rgba(201,162,75,.3)">30</div>
<div class="cv"><h1 class="hd">30 يوم انتهت.<br><mark>والجاية أكبر.</mark></h1></div>
<div class="row2">${PORTRAIT?`<div class="arch"><img src="${PORTRAIT}"><div class="tagme">${ic('sparkle',22,GL)}AI Engineer</div></div>`:''}
<div class="col">
 <div class="pcard dark"><div class="ph">30 Days of n8n<i>${logo('n8n',32,'gold')}</i></div>
  <div style="text-align:left"><span class="st">${ic('check',20,'#111',0,'bold')}مكتمل</span></div>
  <div class="pbar"><i style="width:100%"></i></div><div class="meta"><span>30 workflow حقيقية</span><span dir="ltr">30 / 30</span></div></div>
 <div class="down">${ic('arrow-down',26,GL,0,'bold')}</div>
 <div class="pcard gold"><div class="ph">30 Days of LLM Apps<i>${ic('brain',34,GL,0,'duotone')}</i></div>
  <div style="text-align:left"><span class="st">${ic('calendar-check',20,GL)}يبدأ الثلاثاء</span></div>
  <div class="chips">${chip('huggingface','Hugging Face')}${chip('langchain','LangChain')}${chip('langgraph','LangGraph')}</div>
  <div class="pbar"><i style="width:3%"></i></div><div class="meta"><span>30 تطبيق ذكاء اصطناعي · بالعربي</span><span dir="ltr">0 / 30</span></div></div>
</div></div>
<div class="cta2" style="margin-top:26px">${ic('chat-circle-dots',44,G,0,'duotone')}معك؟ اكتب <b>معك</b> بالتعليقات</div>`)}</body></html>`;

(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
await pg.setContent(html);await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:OUT,type:'jpeg',quality:92});await br.close();})();
