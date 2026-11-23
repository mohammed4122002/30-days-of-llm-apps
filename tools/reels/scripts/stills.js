// لقطات سريعة لفحص المشاهد: node scripts/stills.js Voice01 outDir f1,f2,...
const {bundle}=require('@remotion/bundler');const {selectComposition,renderStill}=require('@remotion/renderer');const path=require('path');
(async()=>{const [id,out,fr]=process.argv.slice(2);const serveUrl=await bundle({entryPoint:path.resolve(__dirname,'../src/index.ts')});
const browserExecutable='/opt/pw-browsers/chromium_headless_shell';
const comp=await selectComposition({serveUrl,id,browserExecutable});
for(const f of fr.split(',').filter(Boolean).map(Number)){await renderStill({composition:comp,serveUrl,frame:f,output:path.join(out,`f${String(f).padStart(5,'0')}.jpg`),imageFormat:'jpeg',scale:0.5,browserExecutable});process.stdout.write(f+' ');}})();
