// ريل منشور الانتقال (الريل 0): فيديو عمودي 1080×1920، حوالي 31 ثانية، بتصميم V3.
// الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> NODE_PATH=<مسار playwright> node tools/render_reel_bridge.js
// يحتاج ffmpeg. الإطارات تُرسم واحدًا واحدًا (30 إطار بالثانية) فتطلع الحركة ناعمة ومضبوطة التوقيت.
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');const {spawn}=require('child_process');
const {STYLE,V3CSS,ic,logo,PORTRAIT,brandMark}=require('./render_carousel.js');
const OUT=path.resolve(__dirname,'../announcements/day-00-bridge/reel.mp4');
const W=1080,H=1920,FPS=30;
const G='#C9A24B',GL='#E8C066';

// توقيت المشاهد بالثواني
const S=[[0,4.4],[4.4,9.2],[9.2,13.8],[13.8,17.8],[17.8,23.4],[23.4,26.6],[26.6,31.5]];
const DUR=S[S.length-1][1];
const sc=(i,cls,inner)=>{const [s,e]=S[i];const last=i===S.length-1;
 return `<section class="sc ${cls}" style="animation:scIn .45s cubic-bezier(.2,.8,.2,1) ${s}s both${last?'':`, scOut .4s ease-in ${e-.4}s forwards`}">${inner}</section>`};
const a=(anim,d,inner,extra='')=>`<div class="a" style="animation:${anim} ${d}s both;${extra}">${inner}</div>`;
const T=(i,o)=>+(S[i][0]+o).toFixed(2); // وقت داخل مشهد

const css=`
html,body{width:${W}px;height:${H}px;overflow:hidden;margin:0}
body{font-family:C,sans-serif;background:#000}
.sc{position:absolute;inset:0;opacity:0;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:260px 70px 420px}
.lt{background:radial-gradient(ellipse 700px 260px at 15% 10%,#fff 0,rgba(255,255,255,0) 70%),
 radial-gradient(ellipse 800px 300px at 85% 30%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 70%),
 radial-gradient(ellipse 900px 500px at 90% 100%,rgba(255,214,140,.8) 0,rgba(255,214,140,0) 70%),
 radial-gradient(ellipse 700px 400px at 0% 100%,rgba(170,200,130,.45) 0,rgba(170,200,130,0) 70%),
 linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)}
.dkb{background:radial-gradient(ellipse 900px 600px at 85% 8%,rgba(201,162,75,.3) 0,rgba(201,162,75,0) 70%),
 radial-gradient(ellipse 800px 500px at 10% 100%,rgba(201,162,75,.18) 0,rgba(201,162,75,0) 70%),
 radial-gradient(circle at 50% 40%,#232323 0,#111 55%,#050505 100%);color:#fff}
.a{position:relative}
@keyframes scIn{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:none}}
@keyframes scOut{from{opacity:1}to{opacity:0;transform:scale(.96)}}
@keyframes rise{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.55)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes slideL{from{opacity:0;transform:translateX(-140px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes sweep{from{background-size:0% 100%}to{background-size:100% 100%}}
@keyframes fill{from{width:0}to{width:100%}}
@keyframes spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
@keyframes beat{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes prog{from{width:0}to{width:100%}}
.hm{background:linear-gradient(180deg,transparent 56%,rgba(232,192,102,.95) 56%,rgba(232,192,102,.95) 92%,transparent 92%) no-repeat right/0% 100%;padding:0 10px}
.hmd{color:#F6DE9C}
.rays{position:absolute;left:50%;top:38%;width:1600px;height:1600px;border-radius:50%;
 background:repeating-conic-gradient(from 0deg,rgba(255,214,130,.34) 0deg 5deg,rgba(255,255,255,0) 5deg 15deg);
 -webkit-mask:radial-gradient(circle,#000 0,rgba(0,0,0,.5) 26%,transparent 56%);mask:radial-gradient(circle,#000 0,rgba(0,0,0,.5) 26%,transparent 56%);
 animation:spin 40s linear 0s infinite both}
.big{font-weight:800;line-height:1.25}
.lbl{display:inline-flex;align-items:center;gap:14px;font-weight:800;font-size:40px;padding:12px 34px 12px 24px;border-radius:99px;margin-bottom:44px;
 background:linear-gradient(150deg,#2a2a2a,#0d0d0d);color:#fff;border:3px solid ${G}}
.dkb .lbl{background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111;border-color:#F6DE9C}
.topbar{position:absolute;left:0;right:0;top:0;height:8px;background:rgba(0,0,0,.15);z-index:20}
.topbar i{display:block;height:100%;background:linear-gradient(90deg,#8F6A1F,#E8C066,#FFF1C4);animation:prog ${DUR}s linear 0s both}
.hdr{position:absolute;top:110px;left:50%;transform:translateX(-50%);z-index:20;display:flex;align-items:center;gap:18px;direction:ltr;
 background:rgba(17,17,17,.82);padding:10px 30px 10px 10px;border-radius:99px;border:2px solid rgba(232,192,102,.6);box-shadow:0 10px 30px rgba(0,0,0,.25)}
.hdr .avatar{width:74px;height:74px;padding:3px}
.hdr .nm{font-family:P,serif;font-weight:700;font-size:30px;color:#fff;line-height:1.1}
.hdr .rl{font-weight:800;font-size:16px;letter-spacing:3px;color:#e9e2cf;margin-top:4px}.hdr .rl b{color:${G}}
.pcard{display:flex;align-items:center;gap:30px;padding:34px 36px;border-radius:30px;font-weight:800;font-size:46px;line-height:1.35;margin-top:28px;
 background:linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%);color:#111;box-shadow:0 20px 44px rgba(0,0,0,.45)}
.pcard .n{flex:none;font-size:96px;line-height:.8;color:transparent;-webkit-text-stroke:3px #111;direction:ltr;width:150px;text-align:center}
.bc{display:flex;align-items:center;gap:30px;padding:36px 38px;border-radius:30px;font-weight:800;font-size:50px;line-height:1.4;margin-top:30px;box-shadow:0 20px 44px rgba(30,22,5,.3)}
.bc.dark{background:linear-gradient(150deg,#363636 0%,#1c1c1c 60%,#111 100%);color:#fff}
.bc.gold{background:linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%);color:#111}
.bc .n{flex:none;font-size:120px;line-height:.8;color:transparent;-webkit-text-stroke:3px ${G};direction:ltr;width:170px;text-align:center}
.bc.gold .n{-webkit-text-stroke:3px #111}
.fl{display:flex;flex-direction:column;gap:26px;position:relative}
.fl:before{content:"";position:absolute;left:50%;top:50px;bottom:50px;width:5px;transform:translateX(-50%);background:repeating-linear-gradient(180deg,${G} 0 16px,transparent 16px 30px)}
.st{display:flex;width:100%}.st.r{justify-content:flex-start}.st.l{justify-content:flex-end}
.sc2{width:100%;display:flex;align-items:center;gap:22px;padding:24px 26px;border-radius:28px;font-weight:800;font-size:38px;line-height:1.25;
 background:rgba(255,255,255,.88);border:2px solid rgba(201,162,75,.5);box-shadow:0 16px 34px rgba(40,30,10,.2)}
.sc2 .ix{flex:none;width:96px;height:96px;border-radius:26px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 20%,#454545,#141414 65%,#050505);box-shadow:0 0 0 3px #D9B25E,0 10px 20px rgba(0,0,0,.3)}
.sc2 small{display:block;font-size:26px;color:${G}}
.tile{width:230px;height:230px;border-radius:62px;display:flex;align-items:center;justify-content:center;
 background:radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%);
 box-shadow:0 0 0 6px #D9B25E,0 0 0 16px rgba(201,162,75,.2),0 0 90px 20px rgba(255,200,90,.45),0 40px 70px rgba(30,20,5,.45)}
.pills{display:flex;flex-wrap:wrap;gap:16px;margin-top:50px}
.pills span{display:flex;align-items:center;gap:12px;background:linear-gradient(150deg,#2a2a2a,#0d0d0d);color:#fff;font-weight:800;font-size:34px;padding:12px 28px 12px 16px;border-radius:99px;border:1px solid rgba(232,192,102,.45)}
.btns{display:flex;gap:16px;justify-content:center;margin-top:44px;flex-wrap:wrap}
.btns span{display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;padding:14px 30px;border-radius:99px;background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111}
`;

const arch=(w,h)=>`<div class="arch" style="position:relative;width:${w}px;height:${h}px;border-radius:${w/2}px ${w/2}px 44px 44px"><img src="${PORTRAIT}" style="border-radius:${w/2-8}px ${w/2-8}px 36px 36px"></div>`;
const scenes=[
// 1 الافتتاحية
sc(0,'lt',`<div class="rays"></div>
<div style="position:absolute;left:-40px;top:200px;font-weight:800;font-size:760px;line-height:.8;color:transparent;-webkit-text-stroke:4px rgba(201,162,75,.3);direction:ltr;animation:fade 1s ${T(0,.1)}s both">30</div>
<div style="display:flex;justify-content:center;margin-top:-40px">${a('pop .8s cubic-bezier(.2,.8,.2,1)',T(0,.2),`<div style="animation:floaty 4s ease-in-out 0s infinite both">${arch(500,660)}</div>`)}</div>
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(0,.9),`<div class="big" style="font-size:124px;text-align:center;margin-top:60px">30 يوم انتهت.</div>`)}
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(0,1.5),`<div class="big" style="font-size:124px;text-align:center"><span class="hm" style="animation:sweep .7s ease-out ${T(0,2.1)}s both">والجاية أكبر.</span></div>`)}`),
// 2 المحطة الأولى
sc(1,'dkb',`${a('slideL .5s ease-out',T(1,.2),`<div class="lbl">${ic('flag',38,'#111',0,'fill')}المحطة الأولى</div>`)}
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(1,.4),`<div class="big" style="font-size:96px;direction:ltr;text-align:right;display:flex;align-items:center;gap:24px;justify-content:flex-end">30 Days of n8n <span style="width:100px;height:100px;border-radius:50%;background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);display:flex;align-items:center;justify-content:center">${ic('check',60,'#111',0,'bold')}</span></div>`)}
${a('fade .4s',T(1,.8),`<div style="height:20px;border-radius:99px;background:#3a3a3a;margin-top:30px;overflow:hidden;direction:ltr"><i style="display:block;height:100%;background:linear-gradient(90deg,${G},${GL});animation:fill 1.2s ease-out ${T(1,.9)}s both"></i></div><div style="display:flex;justify-content:space-between;font-size:34px;color:#e9e2cf;margin-top:12px"><span>30 workflow حقيقية</span><span dir="ltr">30 / 30</span></div>`)}
${[['01','ملخص Gmail يوصلك على Telegram كل صباح'],['13','وكيل RAG بيجاوب من ملفات الشركة مع المصدر'],['30','نظام بيرجّع طالب منقطع عن المدرسة لمساره']].map(([n,t],i)=>a('slideL .55s cubic-bezier(.2,.8,.2,1)',T(1,1.8+i*.45),`<div class="pcard"><div class="n">${n}</div><div>${t}</div></div>`)).join('')}`),
// 3 الدروس
sc(2,'lt',`${a('slideL .5s ease-out',T(2,.2),`<div class="lbl">${ic('lightbulb',38,GL)}3 دروس طلعت فيها</div>`)}
${[['الأتمتة مش أدوات. الأتمتة إنك تشوف المشكلة قبل غيرك.','dark'],['الاستمرار أهم من الكمال.','gold'],['المحتوى التقني العربي ناقص، ونحنا قادرين نعبّيه.','dark']].map(([t,c],i)=>a('rise .6s cubic-bezier(.2,.8,.2,1)',T(2,.5+i*.7),`<div class="bc ${c}"><div class="n">0${i+1}</div><div>${t}</div></div>`)).join('')}`),
// 4 السؤال
sc(3,'dkb',`<div style="position:absolute;left:50%;top:50%;opacity:.14;animation:spin 60s linear 0s infinite both">${ic('brain',1300,GL,0,'thin')}</div>
${a('slideL .5s ease-out',T(3,.2),`<div class="lbl">${ic('question',38,'#111',0,'fill')}السؤال اللي ضل يلاحقني</div>`)}
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(3,.5),`<div class="big" style="font-size:118px">شو اللي بيصير</div>`)}
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(3,1.1),`<div class="big hmd" style="font-size:118px">جوّا عقدة الـ AI؟</div>`)}
${a('fade .6s',T(3,2),`<div style="font-size:44px;line-height:1.6;color:#e9e2cf;margin-top:40px">n8n علّمتني أربط الأدوات.<br>هلّق بدي أبني العقل نفسه.</div>`)}`),
// 5 التحدي الجديد
sc(4,'lt',`${a('slideL .5s ease-out',T(4,.2),`<div class="lbl">${ic('rocket-launch',38,GL)}التحدي الجديد</div>`)}
${a('rise .5s ease-out',T(4,.4),`<div class="big" style="font-size:80px;direction:ltr;text-align:right;margin-bottom:40px">30 Days of LLM Apps</div>`)}
<div class="fl">${[[logo('huggingface',52,'gold'),'Hugging Face','نماذج مفتوحة'],[logo('langchain',50,'gold'),'LangChain','RAG وسلاسل'],[ic('pulse',54,GL,0,'duotone'),'LangSmith','تقييم بالأرقام'],[logo('langgraph',50,'gold'),'LangGraph','وكلاء بيستأذنوا'],[ic('rocket-launch',54,GL,0,'duotone'),'النهاية','منتج منشور']]
 .map(([x,k,v],i)=>`<div class="st ${i%2?'l':'r'}">${a('pop .55s cubic-bezier(.2,.8,.2,1)',T(4,.9+i*.6),`<div class="sc2"><div class="ix">${x}</div><div><small>${k}</small>${v}</div></div>`,'width:48%')}</div>`).join('')}</div>`),
// 6 الموعد
sc(5,'lt',`<div class="rays" style="top:30%"></div>
<div style="display:flex;justify-content:center">${a('pop .7s cubic-bezier(.2,.8,.2,1)',T(5,.2),`<div class="tile">${ic('calendar-check',140,GL,0,'duotone')}</div>`)}</div>
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(5,.6),`<div class="big" style="font-size:170px;text-align:center;margin-top:60px">الثلاثاء</div>`)}
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(5,1),`<div class="big" style="font-size:150px;text-align:center;color:${G}">9 الصبح</div>`)}`),
// 7 الدعوة
sc(6,'dkb',`<div style="display:flex;justify-content:center">${a('pop .8s cubic-bezier(.2,.8,.2,1)',T(6,.2),arch(400,530))}</div>
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(6,.8),`<div class="big" style="font-size:84px;text-align:center;margin-top:70px">ناوي تمشي معي؟</div>`)}
${a('rise .6s cubic-bezier(.2,.8,.2,1)',T(6,1.3),`<div class="big" style="font-size:84px;text-align:center">اكتب <span class="hmd" style="display:inline-block;animation:beat 1.2s ease-in-out ${T(6,2)}s infinite both">معك</span> بالتعليقات</div>`)}
${a('fade .6s',T(6,2),`<div class="btns">${[['heart','أعجبني'],['repeat','شارك'],['bookmark-simple','احفظ'],['user-plus','تابعني']].map(([i,t])=>`<span>${ic(i,34,'#111')}${t}</span>`).join('')}</div>`)}`),
];

const html=`<html dir="rtl"><head><style>${STYLE}${V3CSS}${css}</style></head><body>
<div class="topbar"><i></i></div>
<div class="hdr">${brandMark}<div><div class="nm">Mohammed Abu Saada</div><div class="rl">AI Agent <b>•</b> AI Engineer</div></div></div>
${scenes.join('')}</body></html>`;

(async()=>{
 const br=await chromium.launch();const pg=await br.newPage({viewport:{width:W,height:H}});
 await pg.setContent(html);await pg.evaluate(()=>document.fonts.ready);
 await pg.evaluate(()=>document.getAnimations().forEach(x=>x.pause()));
 if(process.env.PREVIEW){ // لقطات ثابتة للمراجعة: PREVIEW=2.5,7,... OUT_DIR=<مجلد>
  for(const ts of process.env.PREVIEW.split(',')){await pg.evaluate(t=>document.getAnimations().forEach(x=>{x.currentTime=t}),+ts*1000);
   await pg.screenshot({path:path.join(process.env.OUT_DIR||'.',`reel-${ts}.jpg`),type:'jpeg',quality:85});}
  await br.close();return;}
 const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(FPS),'-i','-','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',OUT],{stdio:['pipe','ignore','inherit']});
 const N=Math.round(DUR*FPS);
 for(let f=0;f<N;f++){
  const t=f*1000/FPS;
  await pg.evaluate(t=>document.getAnimations().forEach(x=>{x.currentTime=t}),t);
  const buf=await pg.screenshot({type:'jpeg',quality:92});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if(f%90===0)process.stdout.write(`frame ${f}/${N}\n`);
 }
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();
 console.log('saved',OUT);
})();
