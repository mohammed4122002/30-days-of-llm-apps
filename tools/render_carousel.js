// يولّد كاروسيل 6 شرائح + PDF لكل يوم، بأيقونات Phosphor الذهبية وشعارات Simple Icons.
// الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> NODE_PATH=<مسار playwright> node tools/render_carousel.js [يوم]
// ICONS_DIR مجلد فيه @phosphor-icons/core و simple-icons (npm i @phosphor-icons/core simple-icons).
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
// Phosphor: أيقونات مصمتة (fill) أو ثنائية اللون (duotone). الأسماء القديمة (Lucide) تُترجم هنا.
const PH={cpu:'cpu',link:'link',languages:'translate',braces:'brackets-curly',brain:'brain',scissors:'scissors',network:'graph',
 'file-search':'file-magnifying-glass',search:'magnifying-glass',quote:'quotes',activity:'pulse',database:'database','check-check':'checks',
 swords:'sword',gauge:'gauge',wrench:'wrench','git-branch':'git-branch',split:'arrows-split',hand:'hand-palm',users:'users-three',tags:'tag',
 'cloud-upload':'cloud-arrow-up','sliders-horizontal':'sliders-horizontal','chart-column':'chart-bar','shield-check':'shield-check',
 'app-window':'app-window',rocket:'rocket-launch',workflow:'flow-arrow',radar:'binoculars',trophy:'trophy',target:'target','code-xml':'code',
 lightbulb:'lightbulb','circle-help':'question',terminal:'terminal-window',heart:'heart','repeat-2':'repeat',bookmark:'bookmark-simple',
 'user-plus':'user-plus','message-circle':'chat-circle-dots',sparkles:'sparkle','calendar-clock':'calendar-check','arrow-left':'arrow-left',
 hammer:'hammer','file-code':'file-code',bot:'robot',globe:'globe','message-square':'chat-text','file-text':'file-text',
 'arrow-right':'arrow-right','arrow-down':'arrow-down',flag:'flag',clock:'clock',check:'check'};
let GID=0;
// ic(name, size, color, _, weight): اللون الذهبي (#C9A24B أو #E8C066) يُرسم بتدرّج معدني
function ic(name,size=48,color='currentColor',_s,weight='fill'){
  const ph=PH[name]||name;
  let s=fs.readFileSync(path.join(ICONS,'@phosphor-icons/core/assets',weight,`${ph}${weight==='regular'?'':'-'+weight}.svg`),'utf8');
  let fill=color,defs='';
  if(color===GOLD||color===GOLD_LT||color==='gold'){const id='g'+(GID++);
    defs=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C4"/><stop offset=".4" stop-color="#E8C066"/><stop offset=".75" stop-color="#C9A24B"/><stop offset="1" stop-color="#8F6A1F"/></linearGradient></defs>`;fill=`url(#${id})`;}
  s=s.replace('fill="currentColor"',`fill="${fill}" width="${size}" height="${size}"`).replace(/opacity="0.2"/g,'opacity="0.38"');
  return s.replace(/(<svg[^>]*>)/,`$1${defs}`);
}
// Simple Icons: شعارات الأدوات (مصمتة).
function logo(name,size=44,color='#111'){
  const s=fs.readFileSync(path.join(ICONS,'simple-icons/icons',name+'.svg'),'utf8');
  let fill=color,defs='';
  if(color==='gold'||color===GOLD||color===GOLD_LT){const id='lg'+(GID++);
    defs=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C4"/><stop offset=".4" stop-color="#E8C066"/><stop offset=".75" stop-color="#C9A24B"/><stop offset="1" stop-color="#8F6A1F"/></linearGradient></defs>`;fill=`url(#${id})`;}
  return s.replace('<svg ',`<svg width="${size}" height="${size}" fill="${fill}" `).replace(/(<svg[^>]*>)/,`$1${defs}`);
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

// صورة شخصية اختيارية: brand/avatar.jpg أو متغير AVATAR. BRAND_MODE=replace (بدل MA، الافتراضي) أو both (مع MA)
const AV=process.env.AVATAR&&fs.existsSync(process.env.AVATAR)?process.env.AVATAR:(fs.existsSync(path.join(ROOT,'brand/avatar.jpg'))?path.join(ROOT,'brand/avatar.jpg'):null);
const avImg=AV?`<img src="data:image/jpeg;base64,${fs.readFileSync(AV).toString('base64')}">`:'';
const MODE=process.env.BRAND_MODE||'replace';
const brandMark=!AV?brandLogo:MODE==='replace'?`<div class="avatar">${avImg}</div>`:`<div class="avatar">${avImg}</div>${brandLogo}`;
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
.ghost{position:absolute;left:-90px;bottom:120px;opacity:.12;transform:rotate(-12deg)}
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
.avatar{flex:none;width:100px;height:100px;border-radius:50%;padding:5px;background:linear-gradient(145deg,#FFF1C4,#E8C066 40%,#C9A24B 70%,#8F6A1F);box-shadow:0 0 24px rgba(255,200,90,.45),0 10px 22px rgba(0,0,0,.25)}
.avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;border:3px solid #fff;display:block}
.avatar.big{width:240px;height:240px;padding:8px;position:relative;box-shadow:0 0 0 14px rgba(201,162,75,.2),0 0 70px 16px rgba(255,205,110,.45),0 24px 50px rgba(0,0,0,.35);margin-bottom:40px}
.avatar.big img{border-width:5px}
.avatar.big .badge{position:absolute;right:-6px;bottom:6px;width:84px;height:84px;border-radius:50%;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 20%,#4a4a4a,#151515 60%,#050505);box-shadow:0 0 0 4px #D9B25E,0 10px 20px rgba(0,0,0,.3)}
.gh{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:44px;font-size:28px;font-weight:800;opacity:.85}
/* ── طبقة التصميم المتقدم ── */
.dark{background:linear-gradient(150deg,#363636 0%,#1c1c1c 60%,#111 100%);border:1px solid rgba(232,192,102,.25)}
.gold{background:linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%);border:1px solid rgba(255,255,255,.6)}
.card{box-shadow:0 18px 40px rgba(30,22,5,.28),inset 0 1px 0 rgba(255,255,255,.18)}
.ibox{width:92px;height:92px;border-radius:26px;background:radial-gradient(circle at 30% 20%,#454545,#141414 65%,#050505);
 box-shadow:0 0 0 3px #D9B25E,0 10px 22px rgba(0,0,0,.35),inset 0 2px 0 rgba(255,255,255,.18)}
.gold .ibox{background:radial-gradient(circle at 30% 20%,#454545,#141414 65%,#050505)}
.label{background:linear-gradient(150deg,#2a2a2a,#0d0d0d);box-shadow:0 10px 24px rgba(0,0,0,.25)}
.rays{position:absolute;left:50%;top:50%;width:1000px;height:1000px;transform:translate(-50%,-50%);
 background:repeating-conic-gradient(from 0deg,rgba(255,214,130,.32) 0deg 5deg,rgba(255,255,255,0) 5deg 15deg);
 -webkit-mask:radial-gradient(circle,#000 0,rgba(0,0,0,.55) 28%,transparent 58%);mask:radial-gradient(circle,#000 0,rgba(0,0,0,.55) 28%,transparent 58%)}
.halo{width:560px;height:560px;background:radial-gradient(circle,rgba(255,226,150,1) 0,rgba(255,215,130,.55) 38%,rgba(255,255,255,0) 70%)}
.orbit{border:2px solid rgba(201,162,75,.35)}
.hero{background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);
 box-shadow:0 0 0 6px #D9B25E,0 0 0 16px rgba(201,162,75,.22),0 0 80px 20px rgba(255,200,90,.45),0 60px 90px rgba(30,20,5,.55),inset 0 4px 0 rgba(255,255,255,.22)}
.hero:after{background:linear-gradient(160deg,rgba(255,255,255,.22),rgba(255,255,255,0) 42%)}
.hero svg{filter:drop-shadow(0 6px 14px rgba(232,192,102,.45))}
.float{background:radial-gradient(circle at 30% 20%,#444,#121212 65%,#050505);box-shadow:0 0 0 3px #D9B25E,0 18px 36px rgba(0,0,0,.32)}
.chip{background:rgba(255,255,255,.82);backdrop-filter:blur(12px);border:2px solid rgba(201,162,75,.55);box-shadow:0 18px 38px rgba(40,30,10,.22)}
.chip .lg{background:radial-gradient(circle at 30% 20%,#444,#111 70%)}
.spk{position:absolute;filter:drop-shadow(0 2px 6px rgba(201,162,75,.6))}
.dayno{background:linear-gradient(150deg,#2a2a2a,#0d0d0d);box-shadow:0 10px 24px rgba(0,0,0,.28)}
.qmark,.bubble{background:radial-gradient(circle at 30% 20%,#4a4a4a,#151515 60%,#050505);border:none;
 box-shadow:0 0 0 6px #D9B25E,0 0 0 16px rgba(201,162,75,.2),0 0 70px 16px rgba(255,205,110,.45),0 24px 50px rgba(0,0,0,.35)}
.qmark{width:190px;height:190px}.bubble{width:200px;height:200px}
.ring{filter:drop-shadow(0 10px 24px rgba(201,162,75,.45))}
.term{border:1px solid rgba(232,192,102,.35)}
.acts span{background:linear-gradient(150deg,#2a2a2a,#0d0d0d);box-shadow:0 8px 18px rgba(0,0,0,.22);border:1px solid rgba(232,192,102,.35)}
.logos span{border:2px solid rgba(201,162,75,.45)}
`;

function slide(k,inner,ghost=''){return `<section class="slide">${ghost?`<div class="ghost">${ic(ghost,620,'#111',0,'thin')}</div>`:''}<div class="w"><div class="top"><div class="brand">${brandMark}<div class="sep"></div><div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div></div><div class="cnt">${k}/6</div></div><div class="body">${inner}</div><div class="tag">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div></div></section>`}

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
<defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C4"/><stop offset=".5" stop-color="#E2B95A"/><stop offset="1" stop-color="#9C7A2E"/></linearGradient></defs><circle cx="150" cy="150" r="${r}" fill="none" stroke="url(#rg)" stroke-width="26" stroke-linecap="round" stroke-dasharray="${f} ${c}" transform="rotate(-90 150 150)"/></svg>
<div class="t"><b>${n}</b><span>/ 30</span></div></div>`};

function cover(n,d){
 const logos=DAY_LOGOS(n), orb=PHASE_ORBIT(n);
 const pos=[['left:10px;top:70px'],['right:0;bottom:40px'],['left:40px;bottom:10px']];
 const chips=logos.slice(0,3).map((l,i)=>`<div class="chip" style="${pos[i]}"><div class="lg">${logo(l,40,'#fff')}</div>${LOGO_LABEL[l]}</div>`).join('');
 const fl=[['right:90px;top:90px',orb[0]],['left:190px;top:250px',orb[1]],['right:170px;bottom:150px',orb[2]]]
   .map(([p,o],i)=>`<div class="float" style="${p};transform:rotate(${[-8,6,-4][i]}deg)">${ic(o,52,GOLD_LT,2.2)}</div>`).join('');
 const spk=[['left:330px;top:40px',34],['right:330px;top:470px',28],['left:120px;top:420px',22],['right:60px;top:300px',24]].map(([p,z])=>`<div class="spk" style="${p}">${ic('sparkles',z,GOLD_LT)}</div>`).join('');
 return `<div class="scene"><div class="rays"></div><div class="halo"></div>${spk}<div class="orbit" style="width:470px;height:470px"></div><div class="orbit" style="width:640px;height:640px;opacity:.6"></div>
 ${fl}<div class="hero">${ic(DAY_ICON[n],200,GOLD_LT,0,'duotone')}</div>${chips}<div class="dayno" dir="rtl">اليوم <b>${n}</b> من 30</div></div>
 <h1>${esc(d.hook)}</h1><div class="swipe">${ic('arrow-left',34,GOLD,3)} اسحب</div>`;
}

function build(n,D){
 const d=D[n-1], nxt=D[n];
 const LI=['target','code-xml','lightbulb'];
 const cards=d.learn.map((x,i)=>`<div class="card ${i==1?'gold':'dark'}"><div class="ibox">${ic(LI[i],50,GOLD_LT)}</div><div>${esc(x)}</div></div>`).join('');
 const logos=DAY_LOGOS(n).map(l=>`<span><i>${logo(l,28,'#fff')}</i>${LOGO_LABEL[l]}</span>`).join('');
 const s=[];
 s.push(slide(1,cover(n,d)));
 s.push(slide(2,`<div class="qmark">${ic('circle-help',110,GOLD_LT,0,'duotone')}</div><div class="label">${ic('target',30,GOLD_LT,2.4)}المشكلة</div><div class="big quote">${esc(d.problem)}</div>`,DAY_ICON[n]));
 s.push(slide(3,`<div class="label">${ic('hammer',30,GOLD_LT,2.4)}شو بنينا اليوم</div><div class="cards">${cards}</div>`,'sparkles'));
 s.push(slide(4,`<div class="label">${ic('terminal',30,GOLD_LT,2.4)}الكود</div><div class="term"><div class="bar"><span></span><span></span><span></span><em>${ic('file-code',24,GOLD_LT,2.4)}day-${String(n).padStart(2,'0')}/app.py</em></div><div class="code">${codeText(d.code)}</div></div><div class="logos">${logos}</div>`));
 s.push(slide(5,`<div class="label">${ic('lightbulb',30,GOLD_LT,2.4)}الخلاصة</div><div class="ringwrap">${ring(n)}<div class="big" style="font-size:56px">كل يوم خطوة صغيرة، وبعد 30 يوم الفرق بيكون ضخم.</div></div>
 ${nxt?`<div class="card gold next"><div class="ibox">${ic(DAY_ICON[n+1],50,GOLD_LT)}</div><div><small>بكرة</small>${esc(nxt.title.replace(/: /g,' — '))}</div></div>`:`<div class="card gold next"><div class="ibox">${ic('trophy',50,GOLD_LT)}</div><div>انتهى التحدي. شكرًا لكل من تابع!</div></div>`}`,'calendar-clock'));
 s.push(slide(6,`${AV?`<div class="avatar big">${avImg}<div class="badge">${ic('message-circle',46,GOLD_LT,0,'duotone')}</div></div>`:`<div class="bubble">${ic('message-circle',110,GOLD_LT,0,'duotone')}</div>`}<div class="label">${ic('users',30,GOLD_LT,2.4)}دورك</div><div class="big">${esc(d.cta)}</div>
 <div class="acts"><span>${ic('heart',30,GOLD_LT,2.4)}أعجبني</span><span>${ic('repeat-2',30,GOLD_LT,2.4)}شارك</span><span>${ic('bookmark',30,GOLD_LT,2.4)}احفظ</span><span>${ic('user-plus',30,GOLD_LT,2.4)}تابعني</span></div>
 <div class="gh">${logo('github',34,'#111')}الكود كامل على GitHub: الرابط بأول تعليق</div>`,'message-circle'));
 return `<html dir="rtl"><style>${STYLE}</style><body>${s.join('')}</body></html>`;
}

// ══════════════ التصميم V3: 7 شرائح، فاتح وداكن بالتناوب ══════════════
const {HL,FLOW}=require('./design_data.js');
const PORTRAIT=fs.existsSync(path.join(ROOT,'brand/portrait.jpg'))?`data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT,'brand/portrait.jpg')).toString('base64')}`:null;
const V3CSS=`
.slide.dk{background:radial-gradient(ellipse 700px 500px at 85% 8%,rgba(201,162,75,.28) 0,rgba(201,162,75,0) 70%),
 radial-gradient(ellipse 600px 400px at 10% 100%,rgba(201,162,75,.16) 0,rgba(201,162,75,0) 70%),
 radial-gradient(circle at 50% 40%,#232323 0,#111 55%,#050505 100%)}
.dk .nm,.dk .cnt,.dk .tag{color:#fff}.dk .rl{color:#e9e2cf}.dk .sep{background:${GOLD}}
.dk .label{background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111;border-color:#F6DE9C}
.dk .grain{position:absolute;inset:0;opacity:.5;background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:6px 6px}
.bignum{position:absolute;font-weight:800;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(201,162,75,.55);direction:ltr;pointer-events:none}
mark{color:inherit;background:linear-gradient(180deg,transparent 56%,rgba(232,192,102,.9) 56%,rgba(232,192,102,.9) 92%,transparent 92%);padding:0 6px}
.dk mark{color:#F6DE9C;background:none}
/* الغلاف */
.cv h1{font-size:66px;line-height:1.42;position:relative}
.cvrow{display:flex;gap:44px;align-items:flex-end;margin-top:36px;direction:ltr}
.arch{flex:none;position:relative;width:420px;height:560px;border-radius:210px 210px 40px 40px;padding:8px;
 background:linear-gradient(160deg,#FFF1C4,#E8C066 35%,#C9A24B 65%,#8F6A1F);
 box-shadow:0 0 0 14px rgba(201,162,75,.18),0 0 90px 20px rgba(255,200,90,.45),0 40px 80px rgba(30,20,5,.45)}
.arch img{width:100%;height:100%;object-fit:cover;object-position:50% 20%;border-radius:202px 202px 32px 32px;display:block;background:#000}
.arch .tagme{position:absolute;left:50%;bottom:-26px;transform:translateX(-50%);white-space:nowrap;display:flex;align-items:center;gap:10px;
 background:linear-gradient(150deg,#2a2a2a,#0d0d0d);color:#fff;font-weight:800;font-size:24px;padding:10px 24px;border-radius:99px;border:2px solid ${GOLD};box-shadow:0 10px 24px rgba(0,0,0,.3)}
.cvside{flex:1;direction:rtl;display:flex;flex-direction:column;gap:22px;padding-bottom:30px}
.dtile{width:150px;height:150px;border-radius:40px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);
 box-shadow:0 0 0 5px #D9B25E,0 0 0 13px rgba(201,162,75,.2),0 0 60px 10px rgba(255,200,90,.4),0 30px 50px rgba(30,20,5,.45)}
.dnum{font-weight:800;font-size:40px;line-height:1.1}.dnum b{color:${GOLD};font-size:64px}
.dttl{font-weight:800;font-size:34px;line-height:1.4;color:#222}
.lrow{display:flex;gap:10px;flex-wrap:wrap;direction:ltr;justify-content:flex-end}
.lrow span{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.85);border:2px solid rgba(201,162,75,.5);border-radius:99px;padding:6px 16px 6px 6px;font-weight:800;font-size:22px}
.lrow i{width:38px;height:38px;border-radius:50%;background:#111;display:flex;align-items:center;justify-content:center}
.swp{align-self:flex-end;display:flex;align-items:center;gap:12px;background:linear-gradient(150deg,#2a2a2a,#0d0d0d);color:#fff;font-weight:800;font-size:28px;padding:12px 26px;border-radius:99px;border:2px solid ${GOLD}}
/* المشكلة */
.pq{font-size:76px;line-height:1.5;font-weight:800;color:#fff;position:relative}
.pnote{margin-top:46px;display:flex;align-items:center;gap:16px;font-size:30px;color:#cfc6b0;font-weight:800}
/* الفكرة */
.fttl{font-weight:800;font-size:46px;line-height:1.35;margin-bottom:34px}
.flow{position:relative;display:flex;flex-direction:column;gap:26px}
.flow:before{content:"";position:absolute;left:50%;top:40px;bottom:40px;width:4px;transform:translateX(-50%);
 background:repeating-linear-gradient(180deg,${GOLD} 0 14px,transparent 14px 26px)}
.step{position:relative;display:flex;align-items:center;width:100%}
.step .node{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;background:${GOLD};box-shadow:0 0 0 7px rgba(201,162,75,.25)}
.scard{width:47%;display:flex;align-items:center;gap:20px;padding:22px 24px;border-radius:26px;font-weight:800;font-size:34px;line-height:1.3;
 background:rgba(255,255,255,.82);backdrop-filter:blur(10px);border:2px solid rgba(201,162,75,.45);box-shadow:0 16px 34px rgba(40,30,10,.18)}
.step.r{justify-content:flex-start}.step.l{justify-content:flex-end}
.scard .ix{flex:none;width:86px;height:86px;border-radius:24px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 20%,#454545,#141414 65%,#050505);box-shadow:0 0 0 3px #D9B25E,0 10px 20px rgba(0,0,0,.3)}
.scard small{display:block;font-size:22px;color:${GOLD};letter-spacing:1px}
.flow.f5 .scard{padding:16px 22px;font-size:30px}.flow.f5 .scard .ix{width:76px;height:76px}.flow.f5{gap:16px}
/* ما بنيناه */
.bcard{display:flex;align-items:center;gap:30px;padding:30px 34px;border-radius:28px;font-weight:800;font-size:42px;line-height:1.4}
.bcard .n{flex:none;font-size:104px;line-height:.8;font-weight:800;color:transparent;-webkit-text-stroke:3px ${GOLD};direction:ltr;width:150px;text-align:center}
.bcard.gold .n{-webkit-text-stroke:3px #111}
/* الكود */
.dk .term{box-shadow:0 0 0 2px rgba(232,192,102,.5),0 0 80px rgba(201,162,75,.25),0 30px 60px rgba(0,0,0,.5)}
.dk .logos span{background:rgba(255,255,255,.92)}
/* الدعوة */
.ctawrap{display:flex;flex-direction:column;align-items:center;text-align:center}
.ctawrap .arch{width:330px;height:420px;border-radius:165px 165px 34px 34px;margin-bottom:56px}
.ctawrap .arch img{border-radius:157px 157px 26px 26px}
.ctaq{font-size:60px;line-height:1.45;font-weight:800;color:#fff}
.dk .acts{justify-content:center}.dk .acts span{background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111;border:none}
.dk .gh{color:#e9e2cf}
`;
function slide3(k,total,inner,dark=false,extra=''){
 const cls=dark===true?' dk':dark==='gold'?' gd':'';
 return `<section class="slide${cls}">${dark===true?'<div class="grain"></div><div class="rays4 dkr"></div>':''}${dark==='gold'?'<div class="rays4"></div>':''}${STREAKS(k,dark)}${extra}<div class="w"><div class="top"><div class="brand">${brandMark}<div class="sep"></div><div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div></div><div class="cnt">${k}/${total}</div></div><div class="body">${inner}</div><div class="tag">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div></div></section>`;
}
// خطوط ضوء ثابتة (روح ريلز الطاقة) بأماكن مختلفة لكل شريحة
function STREAKS(k,dark){let o='';for(let i=0;i<7;i++){const r=(x)=>{const v=Math.sin(k*91.7+i*37.3+x)*43758.5453;return v-Math.floor(v)};
 // على الفاتح: بس بالأطراف العليا والسفلى بعيد عن النص، وأخف
 const light=dark!==true; const y=light?Math.round(1255+r(1)*110):Math.round(r(1)*1440);
 const l=Math.round(260+r(2)*420),x=Math.round(r(3)*1080-200),h=(3+r(4)*(light?3:6)).toFixed(1);
 o+=`<div class="streak" style="top:${y}px;left:${x}px;width:${l}px;height:${h}px;background:linear-gradient(90deg,transparent,${dark===true?'rgba(232,192,102,.5)':'rgba(255,255,255,.6)'},transparent)"></div>`;}return o;}
const PHASE=n=>n<=5?'أسبوع الأساسيات':n<=10?'أسبوع الـ RAG':n<=15?'أسبوع LangSmith':n<=20?'أسبوع الوكلاء':n<=25?'أسبوع التخصيص':'أسبوع النشر';
const V4CSS=`
.streak{position:absolute;border-radius:9px;pointer-events:none;opacity:.9}
.rays4{position:absolute;left:50%;top:42%;width:2200px;height:2200px;transform:translate(-50%,-50%) rotate(8deg);border-radius:50%;pointer-events:none;
 background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.3) 0deg 6deg,transparent 6deg 18deg);
 -webkit-mask:radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%);mask:radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)}
.rays4.dkr{background:repeating-conic-gradient(from 0deg,rgba(232,192,102,.14) 0deg 6deg,transparent 6deg 18deg)}
.slide.gd{background:radial-gradient(circle at 50% 32%,#FFF1C4 0,#E8C066 40%,#C9A24B 75%,#8F6A1F 100%)}
.gd .label{background:#111;color:#F6DE9C;border-color:#111}
.gd .bcard{background:#111!important;color:#fff!important;border:none}
.gd .bcard .n{-webkit-text-stroke:3px #E8C066!important}
.gd .tag,.gd .nm{color:#111}
/* الغلاف: إبراز بكتلة سوداء */
.cv mark{background:#111;color:#F6DE9C;border-radius:16px;padding:2px 16px;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.phase{align-self:flex-end;font-weight:800;font-size:30px;color:#111;background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);padding:8px 26px;border-radius:99px;box-shadow:0 10px 22px rgba(120,90,20,.25)}
.swp{font-size:34px;padding:16px 34px;background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111;border:none;box-shadow:0 14px 30px rgba(120,90,20,.35)}
/* الكود: شريط ذهبي */
.term .bar{background:linear-gradient(90deg,#F6DE9C,#C9A24B)!important;border-bottom:none!important}
.term .bar em{color:#111!important}
/* الخلاصة: حلقة أكبر ولافتة المحطات */
.ring{transform:scale(1.22);margin:30px 30px 30px 0}
.mile{position:relative;align-self:center;margin-bottom:34px;transform:rotate(-4deg);background:#111;color:#E8C066;font-weight:800;font-size:58px;padding:12px 40px;border-radius:20px;
 border:4px solid #E8C066;white-space:nowrap;box-shadow:0 20px 40px rgba(0,0,0,.3);z-index:3}
.conf{position:absolute;border-radius:3px;pointer-events:none}
/* الدعوة: تابعني ضخمة */
.follow{font-weight:800;font-size:150px;line-height:1.1;margin-top:20px;background:linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 0 30px rgba(232,192,102,.55))}
`;
function hl(text,phrase){const t=esc(text),p=esc(phrase);const i=t.lastIndexOf(p);return i<0?t:t.slice(0,i)+`<mark>${p}</mark>`+t.slice(i+p.length);}
function build3(n,D){
 const d=D[n-1], nxt=D[n], T=7, nn=String(n).padStart(2,'0');
 const s=[];
 // 1 الغلاف
 const logos=DAY_LOGOS(n).map(l=>`<span><i>${logo(l,22,'#fff')}</i>${LOGO_LABEL[l]}</span>`).join('');
 s.push(slide3(1,T,`<div class="bignum" style="left:-30px;top:-40px;font-size:560px;-webkit-text-stroke:3px rgba(201,162,75,.3)">${nn}</div>
 <div class="cv"><h1>${hl(d.hook,HL[n])}</h1></div>
 <div class="cvrow">${PORTRAIT?`<div class="arch"><img src="${PORTRAIT}"><div class="tagme">${ic('sparkle',22,GOLD_LT)}AI Engineer</div></div>`:''}
 <div class="cvside"><div class="dtile" style="align-self:flex-end">${ic(DAY_ICON[n],92,GOLD_LT,0,'duotone')}</div>
 <div class="phase">${PHASE(n)}</div><div class="dnum" style="text-align:right">اليوم <b>${n}</b> من 30</div><div class="dttl" style="text-align:right">${esc(d.title.replace(/: /g,' — '))}</div>
 <div class="lrow">${logos}</div><div class="swp">اسحب ${ic('arrow-left',28,GOLD_LT,0,'bold')}</div></div></div>`));
 // 2 المشكلة (داكن)
 s.push(slide3(2,T,`<div class="label">${ic('target',30,'#111',0,'fill')}المشكلة</div><div class="pq">${esc(d.problem)}</div>
 <div class="pnote">${ic('lightbulb',40,GOLD_LT,0,'duotone')}الحل بالشريحة الجاية</div>`,true,
 `<div style="position:absolute;left:-120px;bottom:60px;opacity:.16">${ic('question',760,GOLD_LT,0,'thin')}</div>`));
 // 3 الفكرة (مخطط)
 const F=FLOW[n];
 const steps=F.map(([icn,lab],i)=>`<div class="step ${i%2?'l':'r'}"><div class="node"></div><div class="scard"><div class="ix">${ic(icn,46,GOLD_LT,0,'duotone')}</div><div><small>الخطوة ${i+1}</small>${esc(lab)}</div></div></div>`).join('');
 s.push(slide3(3,T,`<div class="label">${ic('flow-arrow',30,GOLD_LT)}الفكرة</div><div class="fttl">كيف بيشتغل؟</div><div class="flow${F.length>4?' f5':''}">${steps}</div>`));
 // 4 ما بنيناه
 const cards=d.learn.map((x,i)=>`<div class="bcard ${i==1?'gold':'dark'}" style="box-shadow:0 18px 40px rgba(30,22,5,.28)"><div class="n">0${i+1}</div><div>${esc(x)}</div></div>`).join('');
 s.push(slide3(4,T,`<div class="label">${ic('hammer',30,GOLD_LT)}شو بنينا اليوم</div><div class="cards">${cards}</div>`,'gold'));
 // 5 الكود (داكن)
 const clogos=DAY_LOGOS(n).map(l=>`<span><i>${logo(l,28,'#fff')}</i>${LOGO_LABEL[l]}</span>`).join('');
 s.push(slide3(5,T,`<div class="label">${ic('terminal-window',30,'#111',0,'fill')}الكود</div><div class="term"><div class="bar"><span></span><span></span><span></span><em>${ic('file-code',24,GOLD_LT)}day-${nn}/app.py</em></div><div class="code">${codeText(d.code)}</div></div><div class="logos">${clogos}</div>`,true));
 // 6 الخلاصة
 s.push(slide3(6,T,`${n%5===0?`<div class="mile">${n===30?'خلّصنا التحدي!':'خلّصنا مرحلة!'}</div>`+Array.from({length:46},(_,i)=>{const r=x=>{const v=Math.sin(i*12.9898+x*78.233+n)*43758.5453;return v-Math.floor(v)};return `<div class="conf" style="left:${Math.round(i%2?r(1)*110:950+r(1)*110)}px;top:${Math.round(140+r(2)*1200)}px;width:${Math.round(10+r(3)*16)}px;height:${Math.round(6+r(4)*8)}px;transform:rotate(${Math.round(r(5)*360)}deg);background:${['#111','#E8C066','#fff','#C9A24B'][i%4]}"></div>`}).join(''):''}<div class="label">${ic('lightbulb',30,GOLD_LT)}الخلاصة</div><div class="ringwrap">${ring(n)}<div class="big" style="font-size:56px">كل يوم خطوة صغيرة، وبعد 30 يوم الفرق بيكون <mark>ضخم</mark>.</div></div>
 ${nxt?`<div class="card gold next"><div class="ibox">${ic(DAY_ICON[n+1],50,GOLD_LT)}</div><div><small>بكرة</small>${esc(nxt.title.replace(/: /g,' — '))}</div></div>`:`<div class="card gold next"><div class="ibox">${ic('trophy',50,GOLD_LT)}</div><div>انتهى التحدي. شكرًا لكل من تابع!</div></div>`}`));
 // 7 الدعوة (داكن، مع صورتك)
 s.push(slide3(7,T,`<div class="ctawrap">${PORTRAIT?`<div class="arch"><img src="${PORTRAIT}"><div class="tagme">${ic('chat-circle-dots',24,GOLD_LT)}دورك</div></div>`:''}
 <div class="ctaq">${esc(d.cta)}</div>
 <div class="follow">تابعني</div>
 <div class="acts"><span>${ic('heart',30,'#111')}أعجبني</span><span>${ic('repeat',30,'#111')}شارك</span><span>${ic('bookmark-simple',30,'#111')}احفظ</span><span>${ic('user-plus',30,'#111')}تابعني</span></div>
 <div class="gh">${logo('github',30,'#e9e2cf')}الكود كامل على GitHub: الرابط بأول تعليق</div></div>`,true));
 return `<html dir="rtl"><style>${STYLE}${V3CSS}${V4CSS}</style><body>${s.join('')}</body></html>`;
}

// بيانات الشرائح في days.json (العنوان، المشكلة، الأدوات، النقاط، الافتتاحية، السؤال)
const DAYS=JSON.parse(fs.readFileSync(path.join(ROOT,'days.json'),'utf8'));
function parse(n){
 const d=`day-${String(n).padStart(2,'0')}`;
 return {...DAYS[n-1],code:fs.readFileSync(path.join(ROOT,d,'app.py'),'utf8')};
}
module.exports={STYLE,slide,esc,ic,logo,brandMark,slide3,V3CSS,V4CSS,PORTRAIT,hl,ring,LOGO_LABEL,PH,DAY_ICON,DAY_LOGOS};
if(require.main===module)(async()=>{
 const D=Array.from({length:30},(_,i)=>parse(i+1));
 const only=process.argv[2]?+process.argv[2]:null;
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1440}});
 for(let n=1;n<=30;n++){if(only&&n!==only)continue;
  const d=`day-${String(n).padStart(2,'0')}`;
  const BASE=process.env.OUT_DIR||ROOT; fs.mkdirSync(path.join(BASE,d,'assets'),{recursive:true});
  await pg.setContent(build3(n,D));await pg.evaluate(()=>document.fonts.ready);
  const sl=pg.locator('.slide');
  const cnt=await sl.count();
  for(let k=0;k<cnt;k++)await sl.nth(k).screenshot({path:path.join(BASE,d,'assets',`slide-${k+1}.jpg`),type:'jpeg',quality:90});
  // PDF من صور الشرائح (المطبوع مباشرة بيطلع فيه بقع سودا على لينكدإن)
  require('child_process').execFileSync('python3',[path.join(__dirname,'pdf_from_slides.py'),path.join(BASE,d)]);
 }
 await br.close();
})();
