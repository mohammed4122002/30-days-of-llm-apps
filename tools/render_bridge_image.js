// صورة منشور الانتقال الواحدة (1080×1350) بنفس تصميم الكاروسيل.  الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> NODE_PATH=<مسار playwright> node tools/render_bridge_image.js
const {chromium}=require('playwright');const path=require('path');
const {STYLE,ic,logo,brandMark}=require('./render_carousel.js');
const OUT=path.resolve(__dirname,'../announcements/day-00-bridge/post.jpg');
const G='#C9A24B', GL='#E8C066';

const extra=`<style>
html,body{width:1080px;height:1350px;overflow:hidden}
.slide{height:1350px}
.w{padding:56px 66px 46px}
.bscene{position:relative;height:220px;display:flex;align-items:center;justify-content:center;gap:48px;direction:ltr;margin-top:18px}
.bscene .halo{width:380px;height:380px;z-index:0}
.bscene>.tile,.bscene>.arw{z-index:1}
.tile{position:relative;width:184px;height:184px;border-radius:54px;display:flex;align-items:center;justify-content:center;box-shadow:0 26px 50px rgba(60,45,15,.35)}
.tile.d{background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);box-shadow:0 0 0 5px #D9B25E,0 0 0 13px rgba(201,162,75,.22),0 0 60px 12px rgba(255,200,90,.4),0 40px 70px rgba(30,20,5,.5),inset 0 3px 0 rgba(255,255,255,.2)}
.tile.g{background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);box-shadow:0 0 0 5px #D9B25E,0 0 0 13px rgba(201,162,75,.22),0 0 60px 12px rgba(255,200,90,.4),0 40px 70px rgba(30,20,5,.5),inset 0 3px 0 rgba(255,255,255,.2);transform:perspective(900px) rotateY(-12deg)}
.tile.g:after{display:none;content:"";position:absolute;inset:8px;border-radius:46px;background:linear-gradient(160deg,rgba(255,255,255,.45),rgba(255,255,255,0) 45%)}
.arw{position:relative;width:96px;height:96px;border-radius:50%;background:#111;border:4px solid ${G};display:flex;align-items:center;justify-content:center}
.headline{font-size:76px;line-height:1.22;font-weight:800;margin-top:14px}.headline span{color:${G}}
.sub{font-size:30px;line-height:1.5;margin-top:4px;color:#333}
.pcard{border-radius:28px;padding:22px 30px;box-shadow:0 14px 30px rgba(0,0,0,.22);margin-top:18px}
.pcard.dark{background:#2b2b2b;color:#fff}.pcard.gold{background:${GL};color:#111}
.row{display:flex;justify-content:space-between;align-items:center}
.ttl{display:flex;align-items:center;gap:18px;font-weight:800;font-size:40px;direction:ltr}
.ttl i{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center}
.dark .ttl i{background:${G}}.gold .ttl i{background:#111}
.st{display:flex;align-items:center;gap:8px;font-weight:800;font-size:24px;padding:8px 20px;border-radius:99px}
.dark .st{background:${G};color:#111}.gold .st{background:#111;color:#fff}
.pbar{height:16px;border-radius:99px;margin-top:20px;overflow:hidden;direction:ltr}.dark .pbar{background:#444}.gold .pbar{background:rgba(0,0,0,.15)}
.pbar i{display:block;height:100%}.dark .pbar i{background:linear-gradient(90deg,${G},${GL})}.gold .pbar i{background:#111}
.meta{display:flex;justify-content:space-between;font-size:24px;margin-top:10px;opacity:.85}
.chips{display:flex;gap:10px;margin-top:16px;direction:ltr;flex-wrap:wrap}
.chips span{display:flex;align-items:center;gap:8px;background:#111;color:#fff;font-weight:800;font-size:21px;padding:6px 16px 6px 8px;border-radius:99px}
.chips span b{width:32px;height:32px;border-radius:50%;background:#2b2b2b;display:flex;align-items:center;justify-content:center}
.link{display:flex;justify-content:center;margin:10px 0 -8px}
.link span{width:54px;height:54px;border-radius:50%;background:#111;border:3px solid ${G};display:flex;align-items:center;justify-content:center}
.cta{margin-top:18px;display:flex;align-items:center;justify-content:center;gap:14px;font-weight:800;font-size:36px}
.cta b{background:#111;color:#fff;padding:2px 22px;border-radius:14px;border:3px solid ${G}}
</style>`;

const logoChip=(name,label)=>`<span><b>${logo(name,20,'#fff')}</b>${label}</span>`;
const html=`<html dir="rtl"><style>${STYLE}</style>${extra}<body><section class="slide"><div class="w">
<div class="top"><div class="brand">${brandMark}<div class="sep"></div><div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div></div></div>
<div class="bscene"><div class="halo" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,230,170,.95) 0,rgba(255,220,150,.45) 40%,rgba(255,255,255,0) 70%)"></div>
 <div class="tile d">${logo('n8n',100,GL)}</div><div class="arw">${ic('arrow-right',52,GL,3)}</div><div class="tile g">${ic('brain',120,GL,0,'duotone')}</div></div>
<div class="headline">30 يوم انتهت.<br><span>والجاية أكبر.</span></div>
<div class="sub">ربطت الأدوات ببعض. هلّق جاي دور العقل نفسه.</div>
<div class="pcard dark"><div class="row"><div class="ttl"><i>${logo('n8n',38,'#111')}</i>30 Days of n8n</div><div class="st">${ic('check',24,'#111',3)}مكتمل</div></div>
 <div class="pbar"><i style="width:100%"></i></div><div class="meta"><span>30 workflow حقيقية</span><span dir="ltr">30 / 30</span></div></div>
<div class="link"><span>${ic('arrow-down',30,GL,3)}</span></div>
<div class="pcard gold"><div class="row"><div class="ttl"><i>${ic('brain',38,GL,2.2)}</i>30 Days of LLM Apps</div><div class="st">${ic('calendar-clock',24,'#fff',2.4)}يبدأ الثلاثاء</div></div>
 <div class="chips">${logoChip('huggingface','Hugging Face')}${logoChip('langchain','LangChain')}${logoChip('langgraph','LangGraph')}<span><b>${ic('activity',20,'#fff',2.4)}</b>LangSmith</span></div>
 <div class="pbar"><i style="width:2%"></i></div><div class="meta"><span>30 تطبيق ذكاء اصطناعي · بالعربي</span><span dir="ltr">0 / 30</span></div></div>
<div class="cta">${ic('message-circle',40,G,2.4)}معك؟ اكتب <b>معك</b> بالتعليقات</div>
<div class="tag" style="margin-top:auto">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div>
</div></section></body></html>`;

(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
await pg.setContent(html);await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:OUT,type:'jpeg',quality:92});await br.close();})();
