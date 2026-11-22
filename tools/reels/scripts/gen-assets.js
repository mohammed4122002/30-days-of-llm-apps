// يجهّز أصول الريلز: الخطوط والصور في public/، والأيقونات والشعارات في src/assets.ts
// FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> node scripts/gen-assets.js
const fs=require('fs'),path=require('path');
const FD=process.env.FONTS_DIR, ICONS=process.env.ICONS_DIR, ROOT=path.resolve(__dirname,'../../..');
const pub=path.resolve(__dirname,'../public');
for(const f of ['cairo-arabic-400-normal','cairo-arabic-800-normal','cairo-latin-400-normal','cairo-latin-800-normal'])
  fs.copyFileSync(path.join(FD,'cairo/files',f+'.woff2'),path.join(pub,'fonts',f+'.woff2'));
fs.copyFileSync(path.join(FD,'playfair-display/files/playfair-display-latin-700-normal.woff2'),path.join(pub,'fonts','playfair-700.woff2'));
fs.copyFileSync(path.join(ROOT,'brand/avatar.jpg'),path.join(pub,'avatar.jpg'));
fs.copyFileSync(path.join(ROOT,'brand/portrait.jpg'),path.join(pub,'portrait.jpg'));
const PH=['brain','flag','check','lightbulb','question','rocket-launch','pulse','calendar-check','heart','repeat','bookmark-simple','user-plus',
 'sparkle','arrow-left','target','code','translate','play','chat-circle-dots','check-circle','arrow-down'];
const SI=['huggingface','langchain','langgraph','python','n8n','gmail','telegram','github'];
const icons={};
for(const n of PH)for(const w of ['fill','duotone','thin','bold']){const f=path.join(ICONS,'@phosphor-icons/core/assets',w,`${n}-${w}.svg`);if(fs.existsSync(f))icons[`${n}:${w}`]=fs.readFileSync(f,'utf8');}
const logos={};for(const n of SI)logos[n]=fs.readFileSync(path.join(ICONS,'simple-icons/icons',n+'.svg'),'utf8');
fs.writeFileSync(path.resolve(__dirname,'../src/assets.ts'),
 `// ملف مولّد من scripts/gen-assets.js. لا تعدّله يدويًا.\nexport const ICONS: Record<string,string> = ${JSON.stringify(icons)};\nexport const LOGOS: Record<string,string> = ${JSON.stringify(logos)};\n`);
console.log('icons',Object.keys(icons).length,'logos',Object.keys(logos).length);
