// يولّد كاروسيل 6 شرائح + PDF لكل يوم.  الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> NODE_PATH=<مسار playwright> node tools/render_carousel.js [يوم]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const FD=process.env.FONTS_DIR;
const b64=p=>fs.readFileSync(path.join(FD,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F', LA='U+0000-05FF,U+2000-206F,U+2190-2BFF';
const ff=(fam,w,file,ur)=>`@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(file)});unicode-range:${ur}}`;
const css=[ff('C',400,'cairo/files/cairo-arabic-400-normal.woff2',AR),ff('C',800,'cairo/files/cairo-arabic-800-normal.woff2',AR),
ff('C',400,'cairo/files/cairo-latin-400-normal.woff2',LA),ff('C',800,'cairo/files/cairo-latin-800-normal.woff2',LA),
ff('P',700,'playfair-display/files/playfair-display-latin-700-normal.woff2',LA),ff('P',800,'playfair-display/files/playfair-display-latin-800-normal.woff2',LA)].join('');
const GOLD='#C9A24B';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const logoFile=path.join(ROOT,'brand/logo.png');
const logo=fs.existsSync(logoFile)?`<img src="data:image/png;base64,${fs.readFileSync(logoFile).toString('base64')}" style="height:84px">`:
`<div class="mono"><span>M</span><span style="color:${GOLD}">A</span><i>✦</i></div>`;

const STYLE=`${css}
@page{size:1080px 1440px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:C,sans-serif;color:#111}
.slide{position:relative;width:1080px;height:1440px;overflow:hidden;page-break-after:always;background:
radial-gradient(ellipse 500px 200px at 15% 12%,#fff 0,rgba(255,255,255,0) 70%),
radial-gradient(ellipse 600px 220px at 85% 30%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 70%),
radial-gradient(ellipse 700px 400px at 90% 100%,rgba(255,214,140,.75) 0,rgba(255,214,140,0) 70%),
radial-gradient(ellipse 600px 300px at 0% 100%,rgba(170,200,130,.45) 0,rgba(170,200,130,0) 70%),
linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)}
.w{position:absolute;inset:0;padding:64px 70px 56px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;direction:ltr}
.brand{display:flex;align-items:center;gap:22px}
.mono{font-family:P,serif;font-weight:800;font-size:92px;line-height:.9;letter-spacing:-6px;position:relative;padding-right:26px}
.mono i{position:absolute;right:-2px;top:-14px;font-style:normal;color:${GOLD};font-size:34px;letter-spacing:0}
.sep{width:2px;height:74px;background:${GOLD}}
.nm{font-family:P,serif;font-weight:700;font-size:34px;line-height:1.1}
.rl{font-weight:800;font-size:21px;letter-spacing:3px;margin-top:8px}.rl b{color:${GOLD}}
.cnt{font-weight:800;font-size:38px}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:20px 0}
.label{align-self:flex-start;background:#111;color:#fff;font-weight:800;font-size:32px;padding:10px 30px;border-radius:99px;border:3px solid ${GOLD};margin-bottom:36px}
h1{font-size:64px;line-height:1.45;font-weight:800}
.big{font-size:70px;line-height:1.5;font-weight:800}
.cards{display:flex;flex-direction:column;gap:26px}
.card{display:flex;align-items:center;gap:26px;font-weight:800;font-size:44px;line-height:1.4;padding:30px 36px;border-radius:24px;box-shadow:0 10px 24px rgba(0,0,0,.22)}
.dark{background:#2b2b2b;color:#fff}.gold{background:#E8C066;color:#111}
.num{flex:none;width:68px;height:68px;border-radius:50%;background:${GOLD};color:#111;display:flex;align-items:center;justify-content:center;font-size:38px}
.gold .num{background:#111;color:#fff}
.code{direction:ltr;text-align:left;background:#1e1e1e;color:#e8e8e8;border-radius:24px;padding:26px 30px;font-family:'DejaVu Sans Mono',monospace;font-size:23px;line-height:1.5;white-space:pre-wrap;box-shadow:0 12px 28px rgba(0,0,0,.3);overflow:hidden}
.dots{display:flex;gap:10px;margin-bottom:18px}.dots span{width:16px;height:16px;border-radius:50%;background:#ff5f57}.dots span:nth-child(2){background:#febc2e}.dots span:nth-child(3){background:#28c840}
.tl{margin-top:20px;text-align:center;font-size:26px;opacity:.75;direction:ltr}
.bar{height:22px;border-radius:99px;background:rgba(0,0,0,.12);margin-top:44px;overflow:hidden;direction:ltr}.bar i{display:block;height:100%;background:linear-gradient(90deg,${GOLD},#E8C066)}
.pc{font-weight:800;font-size:30px;margin-top:12px;direction:ltr;text-align:left}
.next{margin-top:44px}.next small{display:block;font-size:26px;opacity:.7;margin-bottom:6px;font-weight:400}
.acts{display:flex;gap:18px;margin-top:40px;direction:rtl;flex-wrap:wrap}.acts span{background:#111;color:#fff;font-weight:800;font-size:30px;padding:12px 28px;border-radius:99px}
.swipe{align-self:flex-start;margin-top:34px;font-weight:800;font-size:30px;color:#111;direction:ltr}.swipe b{color:${GOLD}}
.tag{margin-top:10px;text-align:center;font-weight:800;font-size:25px;letter-spacing:7px;direction:ltr}.tag b{color:${GOLD};margin:0 12px}`;

function slide(k,inner){return `<section class="slide"><div class="w"><div class="top"><div class="brand">${logo}<div class="sep"></div><div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div></div><div class="cnt">${k}/6</div></div><div class="body">${inner}</div><div class="tag">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div></div></section>`}

function codeText(src){
 src=src.replace(/^import sys, pathlib\nsys\.path.*\nfrom shared\.llm import get_llm\n\n/,'');
 const out=[];
 for(const line of src.trimEnd().split('\n')){
  let l=line;const ind=(l.match(/^ */)||[''])[0];
  while(l.length>58){out.push(l.slice(0,58));l=ind+'  '+l.slice(58);}
  out.push(l);
 }
 if(out.length>22){return out.slice(0,21).join('\n')+'\n# … الكود الكامل في app.py';}
 return out.join('\n');
}

function build(n,D){
 const d=D[n-1], nxt=D[n];
 const cards=d.learn.map((x,i)=>`<div class="card ${i==1?'gold':'dark'}"><div class="num">${i+1}</div><div>${esc(x)}</div></div>`).join('');
 const s=[];
 s.push(slide(1,`<h1>${esc(d.hook)}</h1><div class="label" style="margin-top:44px;margin-bottom:0">اليوم ${n} · ${esc(d.title.replace(/: /g,' — '))}</div><div class="swipe">اسحب <b>←</b></div>`));
 s.push(slide(2,`<div class="label">المشكلة</div><div class="big">${esc(d.problem)}</div>`));
 s.push(slide(3,`<div class="label">شو بنينا اليوم</div><div class="cards">${cards}</div>`));
 s.push(slide(4,`<div class="label">الكود</div><div class="code"><div class="dots"><span></span><span></span><span></span></div>${esc(codeText(d.code))}</div><div class="tl">${esc(d.tools)}</div>`));
 s.push(slide(5,`<div class="label">الخلاصة</div><div class="big">كل يوم خطوة صغيرة، وبعد 30 يوم الفرق بيكون ضخم.</div><div class="bar"><i style="width:${Math.round(n/30*100)}%"></i></div><div class="pc">${n} / 30</div>${nxt?`<div class="card gold next"><div><small>بكرة</small>${esc(nxt.title.replace(/: /g,' — '))}</div></div>`:`<div class="card gold next"><div>انتهى التحدي. شكرًا لكل من تابع!</div></div>`}`));
 s.push(slide(6,`<div class="label">دورك</div><div class="big">${esc(d.cta)}</div><div class="acts"><span>أعجبني</span><span>شارك</span><span>احفظ</span><span>تابعني</span></div><div class="tl" style="margin-top:44px;font-size:28px">الكود كامل على GitHub: الرابط بأول تعليق</div>`));
 return `<html dir="rtl"><style>${STYLE}</style><body>${s.join('')}</body></html>`;
}

function parse(n){
 const d=`day-${String(n).padStart(2,'0')}`;
 const post=fs.readFileSync(path.join(ROOT,d,'post.md'),'utf8');
 return {hook:post.split('\n')[0],title:post.match(/اليوم \d+ من 30 — (.+)/)[1],problem:post.match(/🎯 المشكلة:\n(.+)/)[1],
  tools:post.match(/اليوم \((.+)\):/)[1],learn:[...post.matchAll(/^✅ (.+)$/gm)].map(x=>x[1]),
  cta:post.match(/\n\n([^\n]+)\n\n🔁/)[1],code:fs.readFileSync(path.join(ROOT,d,'app.py'),'utf8')};
}
module.exports={STYLE,slide,esc};
if(require.main===module)(async()=>{
 const D=Array.from({length:30},(_,i)=>parse(i+1));
 const only=process.argv[2]?+process.argv[2]:null;
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1440}});
 for(let n=1;n<=30;n++){if(only&&n!==only)continue;
  const d=`day-${String(n).padStart(2,'0')}`;
  await pg.setContent(build(n,D));await pg.evaluate(()=>document.fonts.ready);
  const sl=pg.locator('.slide');
  for(let k=0;k<6;k++)await sl.nth(k).screenshot({path:path.join(ROOT,d,'assets',`slide-${k+1}.jpg`),type:'jpeg',quality:90});
  await pg.pdf({path:path.join(ROOT,d,'carousel.pdf'),width:'1080px',height:'1440px',printBackground:true});
 }
 await br.close();
})();
