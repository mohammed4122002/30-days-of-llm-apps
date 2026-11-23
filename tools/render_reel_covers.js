// أغلفة الريلز (1080×1920): day-XX/reel-cover.jpg و announcements/day-00-bridge/reel-cover.jpg
// المحتوى المهم بالوسط (1080×1440) لأنه شبكة حساب إنستغرام بتقص الأطراف.
// الأيام الفردية داكنة، الزوجية سماء، والمحطات (كل 5 أيام) ذهبية، فالشبكة بتطلع متناسقة.
// الاستخدام: FONTS_DIR=... ICONS_DIR=... NODE_PATH=<playwright> node tools/render_reel_covers.js [يوم]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const {STYLE,V3CSS,ic,logo,PORTRAIT,DAY_ICON,DAY_LOGOS}=require('./render_carousel.js');
const ROOT=path.resolve(__dirname,'..');
const D=JSON.parse(fs.readFileSync(path.join(ROOT,'days.json'),'utf8'));
const G='#C9A24B',GL='#E8C066';
const PHASE=n=>n<=5?'أسبوع الأساسيات':n<=10?'أسبوع الـ RAG':n<=15?'أسبوع LangSmith':n<=20?'أسبوع الوكلاء':n<=25?'أسبوع التخصيص':'أسبوع النشر';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
// تقسيم العنوان لأسطر متوازنة، كل سطر بكتلة لحاله (بدون تداخل بين الكتل)
const lines=t=>{t=t.replace(/Hugging Face (Hub|Spaces)/g,'Hugging\u00a0Face\u00a0$1').replace(/بـ /g,'بـ\u00a0');
  if(t.length<=20)return [t];const w=t.split(' ');let best=null;
  for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(' '),b=w.slice(i).join(' ');const d=Math.max(a.length,b.length);if(!best||d<best[0])best=[d,[a,b]];}
  return best?best[1]:[t];};
const topic=t=>{const i=t.indexOf(':');return (i>0?t.slice(0,i):t).trim();};

const CSS=`${STYLE}${V3CSS}
html,body{width:1080px;height:1920px;margin:0;overflow:hidden}
.cov{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:C,sans-serif}
.cov.dark{background:radial-gradient(ellipse 900px 700px at 50% 30%,rgba(201,162,75,.35) 0,rgba(201,162,75,0) 70%),radial-gradient(circle at 50% 50%,#1d1d1d 0,#0a0a0a 60%,#000 100%);color:#fff}
.cov.sky{background:radial-gradient(ellipse 900px 500px at 90% 100%,rgba(255,214,140,.9) 0,rgba(255,214,140,0) 70%),radial-gradient(ellipse 700px 260px at 15% 18%,#fff 0,rgba(255,255,255,0) 70%),linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%);color:#111}
.cov.gold{background:radial-gradient(circle at 50% 35%,#FFF1C4 0,#E8C066 40%,#C9A24B 75%,#8F6A1F 100%);color:#111}
.rays{position:absolute;left:50%;top:42%;width:2600px;height:2600px;transform:translate(-50%,-50%) rotate(6deg);border-radius:50%;
 background:repeating-conic-gradient(from 0deg,var(--ray) 0deg 6deg,transparent 6deg 18deg);
 -webkit-mask:radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%);mask:radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)}
.dark{--ray:rgba(232,192,102,.16)}.sky{--ray:rgba(255,255,255,.4)}.gold{--ray:rgba(255,255,255,.3)}
.in{position:absolute;left:0;right:0;top:250px;height:1370px;display:flex;flex-direction:column;align-items:center;padding:0 60px}
.phase{font-weight:800;font-size:36px;padding:8px 34px;border-radius:99px;margin-top:10px}
.dark .phase{background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111}.sky .phase,.gold .phase{background:#111;color:#F6DE9C}
.lbl{font-weight:800;font-size:64px;margin-top:6px;line-height:1}
.bign{font-weight:800;font-size:330px;line-height:1.05;direction:ltr;margin:0;width:auto;height:auto;border-radius:0;background:none}
.dark .bign{background:linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 40px rgba(232,192,102,.5))}
.ttl{font-weight:800;font-size:82px;line-height:1.3;text-align:center;direction:rtl;margin-top:6px}
.ttl{display:flex;flex-direction:column;align-items:center;gap:18px}
.ttl .ln{display:block;line-height:1.35}
.ttl span{display:inline-block;padding:4px 26px 10px;border-radius:20px;white-space:nowrap}
.dark .ttl span{background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111}.sky .ttl span,.gold .ttl span{background:#111;color:#F6DE9C}
.bottom{position:relative;margin-top:auto;display:flex;align-items:flex-end;justify-content:center;gap:40px;direction:ltr;width:100%}
.arch{position:relative;width:330px;height:430px;border-radius:165px 165px 34px 34px;padding:8px}
.arch img{border-radius:157px 157px 26px 26px}
.tile{width:170px;height:170px;border-radius:48px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);box-shadow:0 0 0 5px #D9B25E,0 0 0 13px rgba(201,162,75,.2),0 30px 50px rgba(30,20,5,.45);margin-bottom:40px}
.logos{display:flex;flex-direction:column;gap:14px;margin-bottom:40px}
.logos span{width:84px;height:84px;border-radius:24px;display:flex;align-items:center;justify-content:center;background:#111;box-shadow:0 0 0 3px #D9B25E}
.series{position:absolute;bottom:250px;left:0;right:0;text-align:center;font-weight:800;font-size:26px;letter-spacing:6px;direction:ltr}
.dark .series{color:#e9e2cf}.series b{color:${G};margin:0 10px}
.mile{position:absolute;top:300px;right:50px;transform:rotate(8deg);background:#111;color:#E8C066;font-weight:800;font-size:40px;padding:8px 26px;border-radius:16px;border:3px solid #E8C066}
`;

function cover(n){
  const d=D[n-1]; const kind=n%5===0?'gold':n%2?'dark':'sky';
  const t=topic(d.title);
  const L=lines(t);const m=Math.max(...L.map(x=>x.length));const size=m>20?70:m>16?78:86;
  return `<div class="cov ${kind}"><div class="rays"></div>
  ${n%5===0?`<div class="mile">${n===30?'الختام':'محطة!'}</div>`:''}
  <div class="in">
    <div class="phase">${PHASE(n)}</div>
    <div class="lbl">اليوم</div>
    <div class="bign">${String(n).padStart(2,'0')}</div>
    <div class="ttl" style="font-size:${size}px">${L.map(x=>`<div class="ln"><span>${esc(x)}</span></div>`).join('')}</div>
    <div class="bottom">
      <div class="logos">${DAY_LOGOS(n).slice(0,2).map(l=>`<span>${logo(l,46,'gold')}</span>`).join('')}</div>
      <div class="arch"><img src="${PORTRAIT}"></div>
      <div class="tile">${ic(DAY_ICON[n],100,GL,0,'duotone')}</div>
    </div>
  </div>
  <div class="series">30 DAYS OF LLM APPS<b>•</b>MOHAMMED ABU SAADA</div></div>`;
}
function cover0(){
  return `<div class="cov dark"><div class="rays"></div><div class="in">
    <div class="phase">التحدي الجديد</div>
    <div class="bign" style="font-size:300px;margin-top:20px">30</div>
    <div class="ttl" style="font-size:96px;margin-top:10px"><div class="ln">يوم انتهت.</div><div class="ln"><span>والجاية أكبر.</span></div></div>
    <div class="bottom">
      <div class="tile">${logo('n8n',96,'gold')}</div>
      <div class="arch"><img src="${PORTRAIT}"></div>
      <div class="tile">${ic('brain',100,GL,0,'duotone')}</div>
    </div></div>
  <div class="series">FROM N8N<b>•</b>TO LLM APPS</div></div>`;
}
(async()=>{
  const only=process.argv[2]!==undefined?+process.argv[2]:null;
  const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1920}});
  const jobs=[[0,path.join(ROOT,'announcements/day-00-bridge/reel-cover.jpg'),cover0()]];
  for(let n=1;n<=30;n++)jobs.push([n,path.join(ROOT,`day-${String(n).padStart(2,'0')}`,'reel-cover.jpg'),cover(n)]);
  for(const [n,out,html] of jobs){if(only!==null&&n!==only)continue;
    await pg.setContent(`<html dir="rtl"><style>${CSS}</style><body>${html}</body></html>`);await pg.evaluate(()=>document.fonts.ready);
    await pg.screenshot({path:out,type:'jpeg',quality:92});}
  await br.close();
})();
