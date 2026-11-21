// يولّد صور README: banner.png و roadmap.png و footer.png (تصميم V3 بصورة Mohammed Abu Saada)
// الاستخدام:
//   FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> AVATAR=<avatar.jpg> PORTRAIT=<portrait.jpg> \
//   NODE_PATH=<مسار playwright> node assets/readme/make_readme.js
const {ic,logo,banner,footer,render}=require('./brandkit.js');
const chip=(l,t)=>`<span class="chip">${logo(l,24)}${t}</span>`;
const phases=[['1–5','الأساسيات','HF · LangChain · Prompts','cpu'],['6–10','RAG عربي','Embeddings · FAISS · Hybrid','file-magnifying-glass'],
 ['11–15','LangSmith','Tracing · Datasets · Evals','pulse'],['16–20','الوكلاء','LangGraph · Tools · HITL','robot'],
 ['21–25','التخصيص','LoRA · Datasets · Guardrails','sliders-horizontal'],['26–30','النشر والختام','Gradio · Spaces · n8n','rocket-launch']];
const roadmap=`<div dir="rtl" style="position:absolute;inset:0;padding:44px 52px;display:flex;flex-direction:column">
<div style="display:flex;align-items:center;justify-content:space-between;direction:ltr">
 <div class="tag" style="font-size:18px">INNOVATE<b>•</b>AUTOMATE<b>•</b>TRANSFORM</div>
 <div dir="rtl" style="font-weight:800;font-size:54px">خريطة <mark>الرحلة</mark></div></div>
<div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:28px">
${phases.map(([d,t,s,icn],i)=>{const gold=i%2==1;return `<div style="position:relative;overflow:hidden;border-radius:28px;padding:26px 28px;display:flex;flex-direction:column;justify-content:space-between;
 ${gold?'background:linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%);color:#111;border:1px solid rgba(255,255,255,.6)':'background:linear-gradient(150deg,#363636 0%,#1c1c1c 60%,#111 100%);color:#fff;border:1px solid rgba(232,192,102,.3)'};box-shadow:0 18px 40px rgba(30,22,5,.28)">
 <div style="position:absolute;left:-10px;bottom:-40px;font-weight:800;font-size:200px;line-height:1;color:transparent;-webkit-text-stroke:3px ${gold?'rgba(17,17,17,.18)':'rgba(232,192,102,.25)'}">${i+1}</div>
 <div style="display:flex;justify-content:space-between;align-items:center;position:relative">
  <div class="mini" style="width:78px;height:78px;border-radius:22px;display:flex;align-items:center;justify-content:center">${ic(icn,44)}</div>
  <span style="font-weight:800;font-size:24px;padding:6px 16px;border-radius:99px;${gold?'background:#111;color:#fff':'background:linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B);color:#111'}">اليوم <span dir="ltr">${d}</span></span></div>
 <div style="position:relative"><div style="font-weight:800;font-size:42px;margin-top:10px">${t}</div><div style="font-size:21px;opacity:.85;direction:ltr;text-align:right">${s}</div></div></div>`}).join('')}
</div></div>`;
const pages={
 banner:[1280,640,banner({
  titleTop:`<span style="color:#C9A24B">30</span> Days of`, titleBottom:'LLM Apps',
  sub:'30 يوم · 30 مشروع · من الصفر إلى <mark>منتج ذكاء اصطناعي</mark>',
  chips:chip('huggingface','Hugging Face')+chip('langchain','LangChain')+chip('langgraph','LangGraph'),
  hub:ic('brain',70), orbitLogos:['huggingface','langchain','ph:pulse','langgraph','gradio'], bignum:'30'})],
 roadmap:[1280,720,roadmap],
 footer:[1280,220,footer()]};
render(pages,__dirname);
