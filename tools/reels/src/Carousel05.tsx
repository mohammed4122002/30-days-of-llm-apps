import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Notebook, Robot} from './illus';

// كاروسيل اليوم 5 بتصميم جديد: «الدفتر». الشريحة الأولى غلاف دفتر جلد، والشرائح 2-6 صفحات ورق مسطّر بقصة،
// والأخيرة الغلاف الخلفي. نفس شخصيات ريل اليوم 5 (الروبوت والدفتر) عشان الريل والكاروسيل يكمّلوا بعض.
export const CW = 1080, CH = 1440, C5_SLIDES = 7;
const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};
const PAPER = '#FBF5E6', LINE = '#E6D8B6', INK2 = '#3a2a12';

// تظليل قلم فسفوري ذهبي ورا الكلمة
const HL: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => (
  <span style={{position: 'relative', display: 'inline-block', padding: '0 10px'}}>
    <span style={{position: 'absolute', left: 0, right: 0, top: '52%', bottom: '2%', background: dark ? 'rgba(232,192,102,.35)' : 'rgba(232,192,102,.75)', transform: 'skew(-8deg) rotate(-1.2deg)', borderRadius: 6}} />
    <span style={{position: 'relative'}}>{children}</span>
  </span>
);
// شريط لاصق
const Tape: React.FC<{x: number; y: number; r?: number; w?: number}> = ({x, y, r = -8, w = 170}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 46, background: 'rgba(232,192,102,.55)', transform: `rotate(${r}deg)`, boxShadow: '0 2px 6px rgba(0,0,0,.08)',
    clipPath: 'polygon(3% 0,97% 4%,100% 50%,97% 96%,3% 100%,0 50%)'}} />
);
// سهم مرسوم باليد
const Arrow: React.FC<{d: string; w?: number; h?: number; style?: React.CSSProperties; color?: string}> = ({d, w = 200, h = 160, style, color = INK}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', overflow: 'visible', ...style}}>
    <defs><marker id={'ah' + d.length} markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={color} /></marker></defs>
    <path d={d} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" markerEnd={`url(#ah${d.length})`} />
  </svg>
);

// صفحة ورق مسطّر بهامش ذهبي وثقوب حلقات
const Page: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
  <AbsoluteFill style={{background: PAPER, fontFamily: 'Cairo', overflow: 'hidden', direction: 'rtl'}}>
    <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, transparent 0 66px, ${LINE} 66px 69px)`, backgroundPosition: '0 30px'}} />
    <div style={{position: 'absolute', top: 0, bottom: 0, right: 120, width: 4, background: GOLD, opacity: 0.7}} />
    {Array.from({length: 7}).map((_, i) => <div key={i} style={{position: 'absolute', right: 34, top: 120 + i * 190, width: 46, height: 46, borderRadius: '50%', background: '#e9dcbc', boxShadow: 'inset 0 4px 8px rgba(0,0,0,.25)'}} />)}
    {/* رأس الصفحة */}
    <div style={{position: 'absolute', top: 48, right: 160, left: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 62, height: 62, borderRadius: '50%', padding: 3, background: `linear-gradient(150deg,#FFF1C4,${GOLD_LT},#8F6A1F)`}}>
          <Img src={staticFile('profile.png')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#111'}} /></div>
        <div style={{fontWeight: 800, fontSize: 26, color: INK2}}>دفتر محمد · اليوم <span style={ltr}>5</span></div>
      </div>
      <div style={{fontWeight: 800, fontSize: 26, color: INK, background: GOLD_LT, padding: '4px 22px', borderRadius: 99, ...ltr}}>{n} / {C5_SLIDES}</div>
    </div>
    <div style={{position: 'absolute', top: 150, right: 160, left: 70, bottom: 110}}>{children}</div>
    <div style={{position: 'absolute', bottom: 40, right: 160, left: 70, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 24, color: '#9c8a64'}}>
      <span style={ltr}>@eng_mohammed_saada</span><span>اسحب ←</span></div>
  </AbsoluteFill>
);
// غلاف جلد أسود بتطريز ذهبي
const Cover: React.FC<{children: React.ReactNode; back?: boolean}> = ({children, back}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 30%,#2b2620 0,#141210 55%,#070707 100%)', fontFamily: 'Cairo', overflow: 'hidden', direction: 'rtl'}}>
    <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'radial-gradient(rgba(255,255,255,.25) 1px, transparent 1.4px)', backgroundSize: '7px 7px'}} />
    <div style={{position: 'absolute', inset: 40, border: `3px dashed ${GOLD}`, borderRadius: 40, opacity: 0.7}} />
    <div style={{position: 'absolute', top: 0, bottom: 0, [back ? 'left' : 'right']: 0, width: 70, background: 'linear-gradient(90deg,#0b0a09,#2a241c,#0b0a09)'}} />
    {/* حزام الدفتر */}
    <div style={{position: 'absolute', top: 0, bottom: 0, [back ? 'right' : 'left']: 150, width: 56, background: `linear-gradient(90deg,#8F6A1F,${GOLD_LT},#8F6A1F)`, boxShadow: '0 0 30px rgba(0,0,0,.6)'}} />
    {children}
  </AbsoluteFill>
);

const S1 = () => (
  <Cover>
    <div style={{position: 'absolute', top: 110, right: 140, left: 260, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{fontWeight: 800, fontSize: 30, color: INK, background: `linear-gradient(150deg,#FFF1C4,${GOLD_LT},#C9A24B)`, padding: '6px 26px', borderRadius: 99}}>أسبوع الأساسيات</div>
      <div style={{fontWeight: 800, fontSize: 30, color: GOLD_LT, border: `3px solid ${GOLD_LT}`, padding: '3px 22px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 10}}>
        <Logo name="langchain" size={32} /><span style={ltr}>Chat Memory</span></div>
    </div>
    <div style={{position: 'absolute', top: 230, right: 140, left: 260, textAlign: 'right'}}>
      <div style={{fontWeight: 800, fontSize: 44, color: '#e9e2cf'}}>اليوم <span style={{...goldText, fontSize: 120, ...ltr}}>05</span></div>
      <div style={{fontWeight: 800, fontSize: 92, lineHeight: 1.2, color: '#fff', marginTop: 10}}>البوت<br />ما بيتذكرك…</div>
      <div style={{fontWeight: 800, fontSize: 92, lineHeight: 1.2, marginTop: 6}}><span style={{color: '#fff'}}>إلا </span><span style={goldText}>بالدفتر!</span></div>
    </div>
    <div style={{position: 'absolute', bottom: 190, right: 150, display: 'flex', alignItems: 'flex-end', gap: 30}}>
      <div style={{transform: 'rotate(-6deg)'}}><Notebook w={300} label="session: u1" thick={6} glow /></div>
      <Robot size={240} mood="read" />
    </div>
    <div style={{position: 'absolute', bottom: 90, right: 150, left: 260, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 28, color: GOLD_LT}}>
      <span style={ltr}>30 DAYS OF LLM APPS</span><span>افتح الدفتر ←</span></div>
  </Cover>
);

const Chat: React.FC<{me?: boolean; children: React.ReactNode; bad?: boolean}> = ({me, children, bad}) => (
  <div style={{alignSelf: me ? 'flex-start' : 'flex-end', maxWidth: 560, fontWeight: 800, fontSize: 40, padding: '16px 28px', lineHeight: 1.4,
    borderRadius: me ? '30px 30px 30px 8px' : '30px 30px 8px 30px', background: me ? INK : '#fff', color: me ? '#fff' : INK,
    border: `4px solid ${bad ? '#c0392b' : INK}`, boxShadow: me ? 'none' : `7px 7px 0 ${GOLD_LT}`}}>{children}</div>
);

const S2 = () => (
  <Page n={2}>
    <div style={{fontWeight: 800, fontSize: 40, color: '#9c8a64'}}>المشكلة</div>
    <div style={{fontWeight: 800, fontSize: 74, lineHeight: 1.25, color: INK}}>بتعرّفه على حالك…<br />وبعد رسالة <HL>بينساك!</HL></div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 60, direction: 'ltr'}}>
      <Chat me>أنا محمد 👋</Chat>
      <Chat>أهلًا يا محمد!</Chat>
      <Chat me>شو اسمي؟</Chat>
      <Chat bad>ما بعرف… مين إنت؟ 🤷</Chat>
    </div>
    <div style={{position: 'absolute', left: 10, bottom: 40, transform: 'rotate(-12deg)', border: '7px solid #c0392b', color: '#c0392b', fontWeight: 800, fontSize: 70, padding: '0 30px', borderRadius: 16}}>نسي!</div>
    <div style={{position: 'absolute', right: 0, bottom: 0}}><Robot size={190} mood="blank" /></div>
  </Page>
);

const S3 = () => (
  <Page n={3}>
    <div style={{fontWeight: 800, fontSize: 40, color: '#9c8a64'}}>ليش؟</div>
    <div style={{fontWeight: 800, fontSize: 74, lineHeight: 1.25, color: INK}}>كل رسالة عنده…<br /><HL>كأنها أول مرة.</HL></div>
    <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.6, color: INK2, marginTop: 30}}>النموذج ما إله ذاكرة.<br />بيشوف بس الرسالة اللي قدامه، وبعدين بتروح.</div>
    <div style={{display: 'flex', gap: 26, marginTop: 70, justifyContent: 'center'}}>
      {['رسالة 1', 'رسالة 2', 'رسالة 3'].map((t, i) => (
        <div key={t} style={{position: 'relative', width: 230, height: 190, background: '#fff', border: `4px solid ${INK}`, borderRadius: 18, transform: `rotate(${(i - 1) * 5}deg)`, boxShadow: `7px 7px 0 ${GOLD_LT}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: i === 2 ? 1 : 0.45}}>
          <Icon name="chat-circle-dots" size={64} color={INK} /><div style={{fontWeight: 800, fontSize: 34, color: INK}}>{t}</div>
          {i < 2 ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="x" size={150} color="#c0392b" weight="bold" /></div> : null}
        </div>))}
    </div>
    <div style={{textAlign: 'center', fontWeight: 800, fontSize: 36, color: '#9c8a64', marginTop: 40}}>اللي قبل… ممسوح</div>
  </Page>
);

const S4 = () => (
  <Page n={4}>
    <div style={{fontWeight: 800, fontSize: 40, color: '#9c8a64'}}>الحل</div>
    <div style={{fontWeight: 800, fontSize: 74, lineHeight: 1.25, color: INK}}>نعطيه <HL>دفتر</HL><br />لكل محادثة.</div>
    <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.6, color: INK2, marginTop: 24}}>كل رسالة بتنكتب بالدفتر،<br />وقبل ما يرد، بيقرأ الدفتر من أوله.</div>
    <div style={{position: 'relative', marginTop: 60, display: 'flex', justifyContent: 'center'}}>
      <div style={{width: 780, display: 'flex', borderRadius: 22, overflow: 'hidden', border: `5px solid ${INK}`, boxShadow: `12px 12px 0 ${GOLD_LT}`, transform: 'rotate(-1.5deg)'}}>
        {[['أنا محمد', 'أهلًا يا محمد!', 'شو اسمي؟'], ['…', '…', 'اسمك محمد ✓']].map((col, k) => (
          <div key={k} style={{flex: 1, background: '#fffaf0', padding: '30px 30px', borderLeft: k === 0 ? `5px solid ${GOLD}` : 'none'}}>
            {col.map((t, i) => <div key={i} style={{fontWeight: 800, fontSize: 38, color: t.includes('✓') ? '#8F6A1F' : INK2, borderBottom: `3px solid ${LINE}`, padding: '10px 0', height: 70}}>
              {t.includes('✓') ? <HL>{t}</HL> : t}</div>)}
          </div>))}
      </div>
      <Tape x={60} y={-24} r={-10} /><Tape x={560} y={-18} r={7} />
    </div>
    <div style={{position: 'absolute', left: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
      <Robot size={200} mood="happy" />
      <div style={{fontWeight: 800, fontSize: 40, color: INK, background: '#fff', border: `4px solid ${INK}`, borderRadius: '30px 30px 30px 8px', padding: '14px 26px', boxShadow: `7px 7px 0 ${GOLD_LT}`}}>اسمك محمد! 😄</div>
    </div>
  </Page>
);

const Step: React.FC<{n: string; title: string; code: string; desc: string}> = ({n, title, code, desc}) => (
  <div style={{display: 'flex', gap: 26, alignItems: 'flex-start', background: '#fff', border: `4px solid ${INK}`, borderRadius: 24, padding: '22px 26px', boxShadow: `9px 9px 0 ${GOLD_LT}`}}>
    <div style={{flexShrink: 0, width: 92, height: 92, borderRadius: 24, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 56, ...goldText, ...ltr}}>{n}</div>
    <div style={{flex: 1}}>
      <div style={{fontWeight: 800, fontSize: 44, color: INK}}>{title}</div>
      <div style={{fontFamily: 'monospace', fontWeight: 700, fontSize: 28, color: '#8F6A1F', marginTop: 2, ...ltr, textAlign: 'right'}}>{code}</div>
      <div style={{fontWeight: 800, fontSize: 30, color: INK2, marginTop: 6}}>{desc}</div>
    </div>
  </div>
);

const S5 = () => (
  <Page n={5}>
    <div style={{fontWeight: 800, fontSize: 40, color: '#9c8a64'}}>كيف بنبنيه؟</div>
    <div style={{fontWeight: 800, fontSize: 70, lineHeight: 1.25, color: INK}}>3 قطع <HL>بس</HL></div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 50}}>
      <Step n="1" title="غلاف الدفتر" code='session_id = "u1"' desc="رقم لكل محادثة، عشان دفتر كل واحد لحاله." />
      <Step n="2" title="صفحات الدفتر" code="InMemoryChatMessageHistory" desc="بيخزّن كل الرسائل اللي صارت." />
      <Step n="3" title="بيقرأ قبل ما يرد" code='MessagesPlaceholder("history")' desc="بيحط الدفتر كله جوّا البرومبت قبل كل جواب." />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 40, fontWeight: 800, fontSize: 32, color: INK}}>
      <Logo name="langchain" size={40} color={INK} />
      <span>والكل بيربطه:</span><span style={{fontFamily: 'monospace', fontSize: 28, color: '#8F6A1F', ...ltr}}>RunnableWithMessageHistory</span></div>
  </Page>
);

const S6 = () => (
  <Page n={6}>
    <div style={{fontWeight: 800, fontSize: 40, color: '#9c8a64'}}>جرّبته</div>
    <div style={{fontWeight: 800, fontSize: 70, lineHeight: 1.25, color: INK}}>رسالتين…<br />و<HL>تذكّرني!</HL></div>
    <div style={{position: 'relative', marginTop: 50, background: '#141210', borderRadius: 26, border: `4px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD_LT}`, overflow: 'hidden', transform: 'rotate(-1deg)'}}>
      <div style={{background: `linear-gradient(90deg,#C9A24B,${GOLD_LT})`, padding: '10px 22px', display: 'flex', gap: 10, alignItems: 'center', direction: 'ltr'}}>
        {[0, 1, 2].map((i) => <div key={i} style={{width: 16, height: 16, borderRadius: '50%', background: INK}} />)}
        <span style={{fontFamily: 'monospace', fontWeight: 700, fontSize: 24, color: INK, marginLeft: 12}}>day-05/app.py</span></div>
      <div style={{padding: '22px 26px', fontFamily: 'monospace', fontSize: 27, lineHeight: 1.7, color: '#e9e2cf', direction: 'ltr', textAlign: 'left'}}>
        <div><span style={{color: GOLD_LT}}>cfg</span> = {'{'}"configurable": {'{'}"session_id": <span style={{color: GOLD_LT}}>"u1"</span>{'}}'}</div>
        <div>bot.invoke({'{'}"input": <span style={{color: GOLD_LT}}>"اسمي محمد"</span>{'}'}, cfg)</div>
        <div>bot.invoke({'{'}"input": <span style={{color: GOLD_LT}}>"شو اسمي؟"</span>{'}'}, cfg)</div>
      </div>
    </div>
    <Tape x={330} y={330} r={4} w={200} />
    <div style={{marginTop: 50, background: '#fff', border: `4px solid ${INK}`, borderRadius: 22, padding: '20px 26px', boxShadow: `8px 8px 0 ${GOLD_LT}`}}>
      <div style={{fontFamily: 'monospace', fontSize: 26, color: '#9c8a64', ...ltr, textAlign: 'right'}}>$ python app.py</div>
      <div style={{fontWeight: 800, fontSize: 40, color: INK, marginTop: 6, lineHeight: 1.5}}>«اسمك محمد كما قلت لي في البداية.»</div>
    </div>
    <div style={{position: 'absolute', left: 0, bottom: 40, fontWeight: 800, fontSize: 36, color: INK2, transform: 'rotate(-4deg)'}}><HL>المخرج الحقيقي ✓</HL></div>
    <div style={{position: 'absolute', right: 0, bottom: 0}}><Robot size={190} mood="happy" /></div>
  </Page>
);

const S7 = () => (
  <Cover back>
    <div style={{position: 'absolute', top: 120, left: 140, right: 260, textAlign: 'right'}}>
      <div style={{fontWeight: 800, fontSize: 40, color: GOLD_LT}}>دورك ✍️</div>
      <div style={{fontWeight: 800, fontSize: 70, lineHeight: 1.3, color: '#fff', marginTop: 16}}>بتفضّل بوت <span style={goldText}>بيتذكر كل إشي</span>،<br />ولا بوت بينسى بعد كل محادثة؟</div>
      <div style={{fontWeight: 800, fontSize: 38, color: '#d9cfb3', marginTop: 24}}>اكتبلي جوابك بالتعليقات</div>
    </div>
    <div style={{position: 'absolute', top: 700, left: 140, right: 260, display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl'}}>
      <div style={{width: 200, height: 200, borderRadius: '50%', padding: 7, background: `conic-gradient(#FFF1C4,${GOLD_LT},#8F6A1F,${GOLD_LT},#FFF1C4)`, flexShrink: 0}}>
        <Img src={staticFile('profile.png')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#111', transform: 'scale(1.3)', transformOrigin: '50% 42%'}} /></div>
      <div>
        <div style={{fontWeight: 800, fontSize: 40, color: '#fff', ...ltr, textAlign: 'right'}}>eng_mohammed_saada</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 14, fontWeight: 800, fontSize: 40, color: INK, background: `linear-gradient(150deg,#FFF1C4,${GOLD_LT},#C9A24B)`, padding: '8px 34px', borderRadius: 20}}>
          <Icon name="user-plus" size={40} color={INK} />تابعني</div>
      </div>
    </div>
    <div style={{position: 'absolute', top: 1000, left: 140, right: 260, display: 'flex', gap: 16, flexWrap: 'wrap', direction: 'rtl'}}>
      {([['bookmark-simple', 'احفظ الدفتر'], ['paper-plane-tilt', 'ابعته لصاحبك'], ['github-logo', 'الكود بأول تعليق']] as const).map(([ic, t]) => (
        <div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 32, color: GOLD_LT, border: `3px solid ${GOLD}`, borderRadius: 99, padding: '8px 24px'}}>
          <Icon name={ic} size={34} />{t}</div>))}
    </div>
    <div style={{position: 'absolute', bottom: 90, left: 140, right: 260, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 30, color: '#e9e2cf'}}>
      <span>بكرة: <span style={goldText}>RAG ج1 · PDF عربي</span></span><span style={{color: GOLD_LT}}>من غزة… للعالم</span></div>
  </Cover>
);

const ALL = [S1, S2, S3, S4, S5, S6, S7];
export const Carousel05: React.FC<{n: number}> = ({n}) => {
  const S = ALL[n - 1];
  return <S />;
};
