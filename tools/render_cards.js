const {chromium}=require('playwright');const fs=require('fs');
const ROOT=require('path').resolve(__dirname,'..');
const FD=process.env.FONTS_DIR; // مجلد node_modules/@fontsource/ (cairo + playfair-display)
const b64=p=>fs.readFileSync(FD+p).toString('base64');
const AR='U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F', LA='U+0000-05FF,U+2000-206F,U+2190-2BFF';
const ff=(fam,w,file,ur)=>`@font-face{font-family:${fam};font-weight:${w};src:url(data:font/woff2;base64,${b64(file)});unicode-range:${ur}}`;
const css=[ff('C',400,'cairo/files/cairo-arabic-400-normal.woff2',AR),ff('C',800,'cairo/files/cairo-arabic-800-normal.woff2',AR),
ff('C',400,'cairo/files/cairo-latin-400-normal.woff2',LA),ff('C',800,'cairo/files/cairo-latin-800-normal.woff2',LA),
ff('P',700,'playfair-display/files/playfair-display-latin-700-normal.woff2',LA),ff('P',800,'playfair-display/files/playfair-display-latin-800-normal.woff2',LA)].join('');
const GOLD='#C9A24B';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const logoFile=`${ROOT}/brand/logo.png`;
const logo=fs.existsSync(logoFile)?`<img src="data:image/png;base64,${fs.readFileSync(logoFile).toString('base64')}" style="height:84px">`:
`<div class="mono"><span>M</span><span style="color:${GOLD}">A</span><i>✦</i></div>`;
function html(n,title,hook,bul,tools){
const cards=bul.map((x,i)=>`<div class="card ${i==1?'gold':'dark'}">${esc(x)}</div>`).join('');
return `<html dir="rtl"><style>${css}
*{box-sizing:border-box;margin:0;padding:0}html,body{width:1080px;height:1440px;overflow:hidden}
body{font-family:C,sans-serif;color:#111;position:relative;background:
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
.rl{font-family:C;font-weight:800;font-size:21px;letter-spacing:3px;margin-top:8px}.rl b{color:${GOLD}}
.cnt{font-weight:800;font-size:38px}
h1{font-size:60px;line-height:1.45;font-weight:800;margin-top:62px}
.day{align-self:flex-start;margin-top:34px;background:#111;color:#fff;font-weight:800;font-size:32px;padding:10px 30px;border-radius:99px;border:3px solid ${GOLD}}
.cards{margin-top:auto;display:flex;flex-direction:column;gap:22px}
.card{font-weight:800;font-size:38px;line-height:1.4;padding:24px 34px;border-radius:22px;box-shadow:0 10px 24px rgba(0,0,0,.22)}
.dark{background:#2b2b2b;color:#fff}.gold{background:#E8C066;color:#111}
.tag{margin-top:40px;text-align:center;font-weight:800;font-size:25px;letter-spacing:7px;direction:ltr;color:#111}.tag b{color:${GOLD};margin:0 12px}
.tools{text-align:center;font-size:23px;margin-top:14px;opacity:.7;direction:ltr}
</style><div class="w">
<div class="top"><div class="cnt">${n}/30</div><div class="brand"><div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div><div class="sep"></div>${logo}</div></div>
<h1>${esc(hook)}</h1><div class="day">اليوم ${n} · ${esc(title.replace(/: /g,' — '))}</div>
<div class="cards">${cards}</div>
<div class="tag">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div><div class="tools">${esc(tools)} · #30DaysOfLLMApps</div></div></html>`}
(async()=>{const br=await chromium.launch();const pg=await br.newPage({viewport:{width:1080,height:1440}});
for(let n=1;n<=30;n++){const d=`day-${String(n).padStart(2,'0')}`;
const post=fs.readFileSync(`${ROOT}/${d}/post.md`,'utf8');const hook=post.split('\n')[0];
const m=post.match(/اليوم \d+ من 30 — (.+)/);const bul=[...post.matchAll(/^✅ (.+)$/gm)].map(x=>x[1]);
const tools=post.match(/اليوم \((.+)\):/)[1];
await pg.setContent(html(n,m[1],hook,bul,tools));await pg.evaluate(()=>document.fonts.ready);
await pg.screenshot({path:`${ROOT}/${d}/assets/linkedin.png`});}
await br.close();})();
