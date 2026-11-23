// يجهّز أصول الريلز:
//  - الخطوط والصور في public/
//  - src/days.ts: بيانات الأيام الثلاثين (من days.json و tools/design_data.js والكود)
//  - src/assets.ts: كل الأيقونات والشعارات المستعملة
// FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> node scripts/gen-assets.js
const fs=require('fs'),path=require('path');
const FD=process.env.FONTS_DIR, ICONS=process.env.ICONS_DIR, ROOT=path.resolve(__dirname,'../../..');
const pub=path.resolve(__dirname,'../public'); fs.mkdirSync(path.join(pub,'fonts'),{recursive:true});
for(const f of ['cairo-arabic-400-normal','cairo-arabic-800-normal','cairo-latin-400-normal','cairo-latin-800-normal'])
  fs.copyFileSync(path.join(FD,'cairo/files',f+'.woff2'),path.join(pub,'fonts',f+'.woff2'));
fs.copyFileSync(path.join(FD,'playfair-display/files/playfair-display-latin-700-normal.woff2'),path.join(pub,'fonts','playfair-700.woff2'));
fs.copyFileSync(path.join(ROOT,'brand/avatar.jpg'),path.join(pub,'avatar.jpg'));
fs.copyFileSync(path.join(ROOT,'brand/portrait.jpg'),path.join(pub,'portrait.jpg'));

// بيانات الأيام
const {PH,DAY_ICON,DAY_LOGOS,LOGO_LABEL}=require(path.join(ROOT,'tools/render_carousel.js'));
const {HL,FLOW}=require(path.join(ROOT,'tools/design_data.js'));
const D=JSON.parse(fs.readFileSync(path.join(ROOT,'days.json'),'utf8'));
const ph=n=>PH[n]||n;
function code(n){
  let src=fs.readFileSync(path.join(ROOT,`day-${String(n).padStart(2,'0')}`,'app.py'),'utf8');
  src=src.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]\s?/gu,'').replace(/^import sys, pathlib\nsys\.path.*\nfrom shared\.llm import get_llm\n\n/,'');
  const out=[];for(const line of src.trimEnd().split('\n')){let l=line;const ind=(l.match(/^ */)||[''])[0];while(l.length>44){out.push(l.slice(0,44));l=ind+'  '+l.slice(44);}out.push(l);}
  return out.length>15?[...out.slice(0,14),'# …']:out;
}
const days=D.map((d,i)=>{const n=i+1;return {day:n,title:d.title,hook:d.hook,hl:HL[n],problem:d.problem,learn:d.learn,cta:d.cta,tools:d.tools,
  icon:ph(DAY_ICON[n]),logos:DAY_LOGOS(n),flow:FLOW[n],code:code(n),next:D[n]?{title:D[n].title,icon:ph(DAY_ICON[n+1])}:null};});
fs.writeFileSync(path.resolve(__dirname,'../src/days.ts'),`// ملف مولّد من scripts/gen-assets.js. لا تعدّله يدويًا.\nexport type Day = {day:number;title:string;hook:string;hl:string;problem:string;learn:string[];cta:string;tools:string;icon:string;logos:string[];flow:[string,string][];code:string[];next:{title:string;icon:string}|null};\nexport const DAYS: Day[] = ${JSON.stringify(days)};\nexport const LOGO_LABEL: Record<string,string> = ${JSON.stringify(LOGO_LABEL)};\n`);

// الأيقونات: كل اللي بيستعمله الريل 0 وريلز الأيام
const need=new Set(['brain','flag','check','lightbulb','question','rocket-launch','pulse','calendar-check','heart','repeat','bookmark-simple','user-plus',
 'sparkle','arrow-left','target','code','translate','play','chat-circle-dots','check-circle','arrow-down','terminal-window','file-code','hammer','trophy','flow-arrow','warning-circle','cursor-text']);
days.forEach(d=>{need.add(d.icon);if(d.next)need.add(d.next.icon);d.flow.forEach(([i])=>need.add(i));});
const icons={};
for(const n of need)for(const w of ['fill','duotone','thin','bold']){const f=path.join(ICONS,'@phosphor-icons/core/assets',w,`${n}-${w}.svg`);if(fs.existsSync(f))icons[`${n}:${w}`]=fs.readFileSync(f,'utf8');}
const SI=new Set(['huggingface','langchain','langgraph','python','n8n','gmail','telegram','github']);days.forEach(d=>d.logos.forEach(l=>SI.add(l)));
const logos={};for(const n of SI)logos[n]=fs.readFileSync(path.join(ICONS,'simple-icons/icons',n+'.svg'),'utf8');
fs.writeFileSync(path.resolve(__dirname,'../src/assets.ts'),`// ملف مولّد من scripts/gen-assets.js. لا تعدّله يدويًا.\nexport const ICONS: Record<string,string> = ${JSON.stringify(icons)};\nexport const LOGOS: Record<string,string> = ${JSON.stringify(logos)};\n`);
const missing=[...need].filter(n=>!icons[`${n}:fill`]);
console.log('days',days.length,'icons',Object.keys(icons).length,'logos',Object.keys(logos).length,'missing',missing.join(',')||'none');
