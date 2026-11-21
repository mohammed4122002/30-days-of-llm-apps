// يولّد كاروسيل 6 شرائح + PDF لكل يوم، بأيقونات Lucide وشعارات Simple Icons.
// الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> NODE_PATH=<مسار playwright> node tools/render_carousel.js [يوم]
// ICONS_DIR مجلد فيه الحزمتان lucide-static و simple-icons (npm i lucide-static simple-icons).
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const FD=process.env.FONTS_DIR;
const ICONS=process.env.ICONS_DIR||FD&&path.resolve(FD,'..');
const b64=p=>fs.readFileSync(path.join(FD,p)).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F', LA='U+0000-05FF,U+2000-206F,U+2190-2BFF';
const ff=(fam,w,file,ur)=>`@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(file)});unicode-range:${ur}}`;
const css=[ff('C',400,'cairo/files/cairo-arabic-400-normal.woff2',AR),ff('C',800,'cairo/files/cairo-arabic-800-normal.woff2',AR),
ff('C',400,'cairo/files/cairo-latin-400-normal.woff2',LA),ff('C',800,'cairo/files/cairo-latin-800-normal.woff2',LA),
ff('P',700,'playfair-display/files/playfair-display-latin-700-normal.woff2',LA),ff('P',800,'playfair-display/files/playfair-display-latin-800-normal.woff2',LA)].join('');
const GOLD='#C9A24B', GOLD_LT='#E8C066';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');

// ── الأيقونات ──────────────────────────────────────────────────────────
// Lucide: أيقونات خطية. ic(name, size, color, stroke)
function ic(name,size=48,color='currentColor',stroke=2){
  let s=fs.readFileSync(path.join(ICONS,'lucide-static/icons',name+'.svg'),'utf8');
  s=s.replace(/<!--[\s\S]*?-->/g,'').replace(/width="\d+"/,`width="${size}"`).replace(/height="\d+"/,`height="${size}"`)
     .replace(/stroke="currentColor"/,`stroke="${color}"`).replace(/stroke-width="[\d.]+"/,`stroke-width="${stroke}"`);
  return s.replace(/class="[^"]*"/,'');
}
// Simple Icons: شعارات الأدوات (مصمتة).
function logo(name,size=44,color='#111'){
  const s=fs.readFileSync(path.join(ICONS,'simple-icons/icons',name+'.svg'),'utf8');
  return s.replace('<svg ',`<svg width="${size}" height="${size}" fill="${color}" `);
}
const LOGO_LABEL={huggingface:'Hugging Face',langchain:'LangChain',langgraph:'LangGraph',python:'Python',pydantic:'Pydantic',gradio:'Gradio',n8n:'n8n',fastapi:'FastAPI'};

// أيقونة لكل يوم + شعارات الأدوات المستخدمة فيه
const DAY_ICON=[null,'cpu','link','languages','braces','brain','scissors','network','file-search','search','quote',
 'activity','database','check-check','swords','gauge','wrench','git-branch','split','hand','users',
 'tags','cloud-upload','sliders-horizontal','chart-column','shield-check','app-window','rocket','workflow','radar','trophy'];
const DAY_LOGOS=n=>n==1?['huggingface','python']:n==4?['langchain','pydantic']:n<=5?['langchain','python']:
 n<=10?['langchain','huggingface']:n<=15?['langchain','python']:n<=20?['langgraph','langchain']:n<=25?['huggingface','python']:
 n==26?['gradio','python']:n==27?['huggingface','gradio']:n==28?['n8n','fastapi']:n==29?['langchain','python']:['huggingface','langgraph','langchain'];
// أيقونات ثانوية تطفو حول المشهد، حسب المرحلة
const PHASE_ORBIT=n=>n<=5?['message-square','sparkles','code-xml']:n<=10?['file-text','database','search']:n<=15?['activity','gauge','check-check']:
 n<=20?['bot','git-branch','wrench']:n<=25?['sliders-horizontal','chart-column','shield-check']:['rocket','globe','workflow'];

const logoFile=path.join(ROOT,'brand/logo.png');
const brandLogo=fs.existsSync(logoFile)?`<img src="data:image/png;base64,${fs.readFileSync(logoFile).toString('base64')}" style="height:84px">`:
`<div class="mono"><span>M</span><span style="color:${GOLD}">A</span><i>✦</i></div>`;

const STYLE=`${css}
@page{size:1080px 1440px;margin:0}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:C,sans-serif;color:#111}
svg{display:block;flex:none}
.slide{position:relative;width:1080px;height:1440px;overflow:hidden;page-break-after:always;background:
radial-gradient(ellipse 500px 200px at 15% 12%,#fff 0,rgba(255,255,255,0) 70%),
radial-gradient(ellipse 600px 220px at 85% 30%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 70%),
radial-gradient(ellipse 700px 400px at 90% 100%,rgba(255,214,140,.75) 0,rgba(255,214,140,0) 70%),
radial-gradient(ellipse 600px 300px at 0% 100%,rgba(170,200,130,.45) 0,rgba(170,200,130,0) 70%),
linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)}
.ghost{position:absolute;left:-90px;bottom:120px;opacity:.07;transform:rotate(-12deg)}
.w{position:absolute;inset:0;padding:64px 70px 56px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center;direction:ltr}
.brand{display:flex;align-items:center;gap:22px}
.mono{font-family:P,serif;font-weight:800;font-size:92px;line-height:.9;letter-spacing:-6px;position:relative;padding-right:26px}
.mono i{position:absolute;right:-2px;top:-14px;font-style:normal;color:${GOLD};font-size:34px;letter-spacing:0}
.sep{width:2px;height:74px;background:${GOLD}}
.nm{font-family:P,serif;font-weight:700;font-size:34px;line-height:1.1}
.rl{font-weight:800;font-size:21px;letter-spacing:3px;margin-top:8px}.rl b{color:${GOLD}}
.cnt{font-weight:800;font-size:38px}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:20px 0;position:relative}
.label{align-self:flex-start;display:flex;align-items:center;gap:14px;background:#111;color:#fff;font-weight:800;font-size:32px;padding:10px 30px 10px 22px;border-radius:99px;border:3px solid ${GOLD};margin-bottom:36px}
h1{font-size:58px;line-height:1.45;font-weight:800}
.big{font-size:66px;line-height:1.5;font-weight:800}
.cards{display:flex;flex-direction:column;gap:26px}
.card{display:flex;align-items:center;gap:26px;font-weight:800;font-size:42px;line-height:1.4;padding:30px 34px;border-radius:24px;box-shadow:0 10px 24px rgba(0,0,0,.22)}
.dark{background:#2b2b2b;color:#fff}.gold{background:${GOLD_LT};color:#111}
.num{flex:none;width:68px;height:68px;border-radius:50%;background:${GOLD};color:#111;display:flex;align-items:center;justify-content:center;font-size:38px}
.gold .num{background:#111;color:#fff}
.ibox{flex:none;width:84px;height:84px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:${GOLD}}
.gold .ibox{background:#111}
.tl{margin-top:20px;text-align:center;font-size:26px;opacity:.75;direction:ltr}
.acts{display:flex;gap:18px;margin-top:40px;direction:rtl;flex-wrap:wrap}.acts span{display:flex;align-items:center;gap:10px;background:#111;color:#fff;font-weight:800;font-size:30px;padding:12px 26px;border-radius:99px}
.swipe{align-self:flex-start;display:flex;align-items:center;gap:10px;margin-top:28px;font-weight:800;font-size:30px;color:#111}
.tag{margin-top:10px;text-align:center;font-weight:800;font-size:25px;letter-spacing:7px;direction:ltr}.tag b{color:${GOLD};margin:0 12px}

/* مشهد الغلاف */
.scene{position:relative;height:580px;margin:6px 0 26px;direction:ltr}
.halo{position:absolute;left:50%;top:50%;width:520px;height:520px;transform:translate(-50%,-50%);border-radius:50%;
 background:radial-gradient(circle,rgba(255,230,170,.95) 0,rgba(255,220,150,.45) 40%,rgba(255,255,255,0) 70%)}
.orbit{position:absolute;left:50%;top:50%;border-radius:50%;border:2px dashed rgba(17,17,17,.18);transform:translate(-50%,-50%)}
.hero{position:absolute;left:50%;top:50%;width:340px;height:340px;transform:translate(-50%,-50%) perspective(900px) rotateX(10deg) rotateY(-14deg);
 border-radius:80px;background:linear-gradient(145deg,#F3D58A 0%,${GOLD} 55%,#9C7A2E 100%);
 box-shadow:0 40px 70px rgba(80,60,20,.45),inset 0 4px 0 rgba(255,255,255,.6),inset 0 -10px 24px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center}
.hero:after{content:"";position:absolute;inset:10px;border-radius:62px;background:linear-gradient(160deg,rgba(255,255,255,.45),rgba(255,255,255,0) 45%)}
.chip{position:absolute;display:flex;align-items:center;gap:14px;background:#fff;border-radius:22px;padding:14px 22px 14px 16px;
 box-shadow:0 16px 34px rgba(0,0,0,.16);font-weight:800;font-size:30px;color:#111}
.chip .lg{width:64px;height:64px;border-radius:16px;background:#111;display:flex;align-items:center;justify-content:center}
.float{position:absolute;width:104px;height:104px;border-radius:26px;background:#2b2b2b;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
.dayno{position:absolute;right:0;top:6px;font-weight:800;font-size:30px;background:#111;color:#fff;padding:8px 22px;border-radius:99px;border:3px solid ${GOLD}}
.dayno b{color:${GOLD}}

/* شريحة المشكلة */
.qmark{width:170px;height:170px;border-radius:50%;background:#111;border:5px solid ${GOLD};display:flex;align-items:center;justify-content:center;margin-bottom:40px;box-shadow:0 18px 40px rgba(0,0,0,.25)}
.quote{position:relative;padding-right:34px;border-right:10px solid ${GOLD}}

/* شريحة الكود */
.term{direction:ltr;text-align:left;background:#1e1e1e;color:#e8e8e8;border-radius:26px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,.32)}
.term .bar{display:flex;align-items:center;gap:10px;padding:18px 24px;background:#2b2b2b;border-bottom:2px solid ${GOLD}}
.term .bar span{width:16px;height:16px;border-radius:50%;background:#ff5f57}.term .bar span:nth-child(2){background:#febc2e}.term .bar span:nth-child(3){background:#28c840}
.term .bar em{margin-left:auto;display:flex;align-items:center;gap:10px;font-style:normal;font-family:C;font-weight:800;font-size:22px;color:${GOLD_LT}}
.code{padding:24px 30px;font-family:'DejaVu Sans Mono',monospace;font-size:23px;line-height:1.5;white-space:pre-wrap}
.code .k{color:${GOLD_LT}}.code .s{color:#9fd49f}.code .c{color:#8a8a8a}
.logos{display:flex;justify-content:center;gap:16px;margin-top:26px;direction:ltr}
.logos span{display:flex;align-items:center;gap:12px;background:#fff;border-radius:99px;padding:10px 24px 10px 12px;font-weight:800;font-size:26px;box-shadow:0 8px 18px rgba(0,0,0,.12)}
.logos i{width:48px;height:48px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center}

/* شريحة الخلاصة */
.ringwrap{display:flex;align-items:center;gap:44px;margin-top:10px}
.ring{position:relative;width:300px;height:300px;flex:none}
.ring .t{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;direction:ltr}
.ring .t b{font-size:96px;line-height:1;font-weight:800}.ring .t span{font-size:30px;font-weight:800;opacity:.6}
.next{margin-top:44px}.next small{display:block;font-size:26px;opacity:.7;margin-bottom:6px;font-weight:400}

/* شريحة الدعوة */
.bubble{width:190px;height:190px;border-radius:50%;background:${GOLD_LT};display:flex;align-items:center;justify-content:center;margin-bottom:40px;box-shadow:0 18px 40px rgba(120,90,20,.3)}
.gh{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:44px;font-size:28px;font-weight:800;opacity:.85}`;

function slide(k,inner,ghost=''){return `<section class="slide">${ghost?`<div class="ghost">${ic(ghost,620,'#111',1.5)}</div>`:''}<div class="w"><div class="top"><div class="brand">${brandLogo}<div class="sep"></div><div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div></div><div class="cnt">${k}/6</div></div><div class="body">${inner}</div><div class="tag">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div></div></section>`}

function codeText(src){
 src=src.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]\s?/gu,''); // الشرائح بلا إيموجي
 src=src.replace(/^import sys, pathlib\nsys\.path.*\nfrom shared\.llm import get_llm\n\n/,'');
 const out=[];
 for(const line of src.trimEnd().split('\n')){
  let l=line;const ind=(l.match(/^ */)||[''])[0];
  while(l.length>58){out.push(l.slice(0,58));l=ind+'  '+l.slice(58);}
  out.push(l);
 }
 const txt=out.length>21?out.slice(0,20).join('\n')+'\n# … الكود الكامل في app.py':out.join('\n');
 // تلوين بسيط: كلمات Python المفتاحية، النصوص، التعليقات
 return esc(txt).split('\n').map(l=>{
   const ci=l.indexOf('#');
   let code=ci>=0?l.slice(0,ci):l, com=ci>=0?`<span class="c">${l.slice(ci)}</span>`:'';
   code=code.replace(/("[^"]*")/g,'<span class="s">$1</span>')
            .replace(/\b(from|import|def|return|class|for|in|if|else|with|lambda|print)\b(?![^<]*<\/span>)/g,'<span class="k">$1</span>');
   return code+com;
 }).join('\n');
}

const ring=(n)=>{const r=130,c=2*Math.PI*r,f=c*n/30;return `<div class="ring"><svg width="300" height="300" viewBox="0 0 300 300">
<circle cx="150" cy="150" r="${r}" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="26"/>
<circle cx="150" cy="150" r="${r}" fill="none" stroke="${GOLD}" stroke-width="26" stroke-linecap="round" stroke-dasharray="${f} ${c}" transform="rotate(-90 150 150)"/></svg>
<div class="t"><b>${n}</b><span>/ 30</span></div></div>`};

function cover(n,d){
 const logos=DAY_LOGOS(n), orb=PHASE_ORBIT(n);
 const pos=[['left:10px;top:70px'],['right:0;bottom:40px'],['left:40px;bottom:10px']];
 const chips=logos.slice(0,3).map((l,i)=>`<div class="chip" style="${pos[i]}"><div class="lg">${logo(l,40,'#fff')}</div>${LOGO_LABEL[l]}</div>`).join('');
 const fl=[['right:90px;top:90px',orb[0]],['left:190px;top:250px',orb[1]],['right:170px;bottom:150px',orb[2]]]
   .map(([p,o],i)=>`<div class="float" style="${p};transform:rotate(${[-8,6,-4][i]}deg)">${ic(o,52,GOLD_LT,2.2)}</div>`).join('');
 return `<div class="scene"><div class="halo"></div><div class="orbit" style="width:470px;height:470px"></div><div class="orbit" style="width:640px;height:640px;opacity:.6"></div>
 ${fl}<div class="hero">${ic(DAY_ICON[n],190,'#111',1.8)}</div>${chips}<div class="dayno" dir="rtl">اليوم <b>${n}</b> من 30</div></div>
 <h1>${esc(d.hook)}</h1><div class="swipe">${ic('arrow-left',34,GOLD,3)} اسحب</div>`;
}

function build(n,D){
 const d=D[n-1], nxt=D[n];
 const LI=['target','code-xml','lightbulb'];
 const cards=d.learn.map((x,i)=>`<div class="card ${i==1?'gold':'dark'}"><div class="ibox">${ic(LI[i],46,i==1?GOLD_LT:'#111',2.2)}</div><div>${esc(x)}</div></div>`).join('');
 const logos=DAY_LOGOS(n).map(l=>`<span><i>${logo(l,28,'#fff')}</i>${LOGO_LABEL[l]}</span>`).join('');
 const s=[];
 s.push(slide(1,cover(n,d)));
 s.push(slide(2,`<div class="qmark">${ic('circle-help',100,GOLD_LT,2)}</div><div class="label">${ic('target',30,GOLD_LT,2.4)}المشكلة</div><div class="big quote">${esc(d.problem)}</div>`,DAY_ICON[n]));
 s.push(slide(3,`<div class="label">${ic('hammer',30,GOLD_LT,2.4)}شو بنينا اليوم</div><div class="cards">${cards}</div>`,'sparkles'));
 s.push(slide(4,`<div class="label">${ic('terminal',30,GOLD_LT,2.4)}الكود</div><div class="term"><div class="bar"><span></span><span></span><span></span><em>${ic('file-code',24,GOLD_LT,2.4)}day-${String(n).padStart(2,'0')}/app.py</em></div><div class="code">${codeText(d.code)}</div></div><div class="logos">${logos}</div>`));
 s.push(slide(5,`<div class="label">${ic('lightbulb',30,GOLD_LT,2.4)}الخلاصة</div><div class="ringwrap">${ring(n)}<div class="big" style="font-size:56px">كل يوم خطوة صغيرة، وبعد 30 يوم الفرق بيكون ضخم.</div></div>
 ${nxt?`<div class="card gold next"><div class="ibox">${ic(DAY_ICON[n+1],46,GOLD_LT,2.2)}</div><div><small>بكرة</small>${esc(nxt.title.replace(/: /g,' — '))}</div></div>`:`<div class="card gold next"><div class="ibox">${ic('trophy',46,GOLD_LT,2.2)}</div><div>انتهى التحدي. شكرًا لكل من تابع!</div></div>`}`,'calendar-clock'));
 s.push(slide(6,`<div class="bubble">${ic('message-circle',100,'#111',2)}</div><div class="label">${ic('users',30,GOLD_LT,2.4)}دورك</div><div class="big">${esc(d.cta)}</div>
 <div class="acts"><span>${ic('heart',30,GOLD_LT,2.4)}أعجبني</span><span>${ic('repeat-2',30,GOLD_LT,2.4)}شارك</span><span>${ic('bookmark',30,GOLD_LT,2.4)}احفظ</span><span>${ic('user-plus',30,GOLD_LT,2.4)}تابعني</span></div>
 <div class="gh">${logo('github',34,'#111')}الكود كامل على GitHub: الرابط بأول تعليق</div>`,'message-circle'));
 return `<html dir="rtl"><style>${STYLE}</style><body>${s.join('')}</body></html>`;
}

// بيانات الشرائح في days.json (العنوان، المشكلة، الأدوات، النقاط، الافتتاحية، السؤال)
const DAYS=JSON.parse(fs.readFileSync(path.join(ROOT,'days.json'),'utf8'));
function parse(n){
 const d=`day-${String(n).padStart(2,'0')}`;
 return {...DAYS[n-1],code:fs.readFileSync(path.join(ROOT,d,'app.py'),'utf8')};
}
module.exports={STYLE,slide,esc,ic,logo};
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
