import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Highlight} from './Highlight';
import {GOLD_LT, INK, goldText} from './brand';

// بطاقة العنوان: أول قصة بكل هايلايت (1080×1920). نفس دايرة الغلاف + الاسم + جملة بتشرح شو جوّا.
// dark/light بالتبادل حسب ترتيب الهايلايت على البروفايل.
export const CARDS: Record<string, {title: string; sub: string; foot: string}> = {
  about: {title: 'عني', sub: 'مين أنا، ومن وين، وشو بعمل', foot: 'محمد أبو سعادة · غزة 🇵🇸'},
  '30days': {title: '30 يوم', sub: 'كل يوم تطبيق ذكاء اصطناعي، والكود مجانًا', foot: '30 DAYS OF LLM APPS'},
  projects: {title: 'مشاريع', sub: 'المشكلة، والحل، والنتيجة', foot: 'أتمتة n8n · وكلاء ذكاء اصطناعي'},
  work: {title: 'اشتغل معي', sub: 'بدك أتمتة أو وكيل ذكاء اصطناعي لشغلك؟', foot: 'الخدمات · طريقة الشغل · تواصل'},
  agents: {title: 'وكلاء AI', sub: 'موظفين ذكاء اصطناعي شغّالين قدامك', foot: 'AI AGENTS'},
  reviews: {title: 'آراء', sub: 'شو حكوا العملاء والطلاب', foot: 'شكرًا لثقتكم 🤍'},
  tips: {title: 'نصائح', sub: 'نصيحة وحدة بكل قصة', foot: 'احفظها وارجعلها'},
  sahihly: {title: 'صحيحلي', sub: 'شو هو، ولمين، وكيف تستعمله', foot: 'sahihly.com'},
};

export const HighlightCard: React.FC<{id: string; light?: boolean}> = ({id, light}) => {
  const c = CARDS[id]; const fg = light ? INK : '#fff';
  return (
    <AbsoluteFill style={{fontFamily: 'Cairo', overflow: 'hidden',
      background: light ? 'linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)' : 'radial-gradient(circle at 50% 40%,#262626 0,#111 55%,#050505 100%)'}}>
      <div style={{position: 'absolute', left: '50%', top: '38%', width: 2800, height: 2800, borderRadius: '50%', transform: 'translate(-50%,-50%) rotate(6deg)',
        background: `repeating-conic-gradient(from 0deg,${light ? 'rgba(255,255,255,.5)' : 'rgba(232,192,102,.13)'} 0deg 6deg,transparent 6deg 18deg)`,
        WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)'}} />
      {/* الدايرة نفسها من الغلاف (نفس الملف، مصغّر) */}
      <div style={{position: 'absolute', left: (1080 - 640) / 2, top: 420, width: 640, height: 640, borderRadius: '50%', overflow: 'hidden'}}>
        <div style={{width: 1080, height: 1080, transform: 'scale(0.5926)', transformOrigin: '0 0'}}><Highlight id={id} light={light} /></div>
      </div>
      <div style={{position: 'absolute', top: 1140, left: 60, right: 60, textAlign: 'center', direction: 'rtl'}}>
        <div style={{fontWeight: 800, fontSize: 130, lineHeight: 1.15, paddingBottom: 30, ...(light ? {color: INK} : goldText)}}>{c.title}</div>
        <div style={{fontWeight: 800, fontSize: 52, lineHeight: 1.4, color: fg, marginTop: -6}}>{c.sub}</div>
        <div dir="auto" style={{display: 'inline-block', unicodeBidi: 'plaintext', marginTop: 50, fontWeight: 800, fontSize: 34, padding: '8px 34px', borderRadius: 99,
          ...(light ? {background: INK, color: '#F6DE9C'} : {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK})}}>{c.foot}</div>
      </div>
      <div style={{position: 'absolute', bottom: 150, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 26, letterSpacing: 6, color: light ? INK : '#e9e2cf', direction: 'ltr'}}>
        MOHAMMED ABU SAADA<b style={{color: GOLD_LT, margin: '0 12px'}}>•</b>AI AGENT ENGINEER
      </div>
    </AbsoluteFill>
  );
};
