import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Confetti, Shake, Sign, clamp} from './EnergyReel';
import {Big, Code, FPS, In, Kind, Leak, Pill, SceneFC, Stage, Tile, ltr} from './voiceKit';
import {Stamp, Term} from './VoiceDay02';
import {Bubble, Notebook, Person, Robot} from './illus';

// ريل اليوم 6 (RAG ج1: تحميل PDF عربي وتقطيعه) — القالب الجديد: خطّاف، تعريف مع بطاقة متابعة، كابشن كلمة كلمة، قصة متحركة.
// الخيط: دليل الموظف ← بيتقطّع لبطاقات بمقص ← غرزة بتربطها ← توأم الحروف ← 6 بطاقات جاهزة.

export const KIND6: Record<string, Kind> = {
  hook: 'dark', trapTease: 'dark', intro: 'dark', office: 'sky', rag: 'dark', exam: 'sky', cards: 'dark', badcut: 'sky', goodcut: 'dark', stitch: 'gold',
  code: 'dark', numbers: 'sky', trap: 'dark', twins: 'dark', run: 'dark', golden: 'gold', save: 'dark', ask: 'sky', next: 'dark', signature: 'dark', outro: 'dark',
};

const sp = (f: number, d = 12, s = 180) => spring({frame: f, fps: FPS, config: {damping: d, stiffness: s}});
const lerp = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], clamp);

// ── مقص ذهبي بيفتح ويسكّر ──
const Scissors: React.FC<{size?: number; open?: number; rot?: number}> = ({size = 300, open = 0.5, rot = 0}) => {
  const a = 6 + open * 26;
  return (
    <svg viewBox="-150 -150 300 300" width={size} height={size} style={{overflow: 'visible', transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.5))'}}>
      <defs><linearGradient id="sc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1C4" /><stop offset=".45" stopColor="#E8C066" /><stop offset="1" stopColor="#8F6A1F" /></linearGradient></defs>
      {[1, -1].map((s) => (
        <g key={s} transform={`rotate(${s * a})`}>
          <path d={`M0 ${s * 6} L140 ${s * 2} L140 ${s * -6} L0 ${s * -10}Z`} fill="#e9e2cf" stroke="#9a8f78" strokeWidth="2" />
          <circle cx="-62" cy={s * 30} r="34" fill="none" stroke="url(#sc)" strokeWidth="16" />
          <path d={`M-10 ${s * 2} L-40 ${s * 18}`} stroke="url(#sc)" strokeWidth="16" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="0" cy="0" r="9" fill={INK} stroke="url(#sc)" strokeWidth="4" />
    </svg>
  );
};

// ── بطاقة صغيرة (Chunk) ──
const Card: React.FC<{w?: number; text?: string; lines?: number; broken?: 'start' | 'end'; glow?: boolean; label?: string; dark?: boolean}> = ({w = 300, text, lines = 4, broken, glow, label, dark}) => (
  <div style={{width: w, minHeight: w * 0.62, borderRadius: 18, padding: `${w * 0.07}px ${w * 0.08}px`, position: 'relative', direction: 'rtl',
    background: dark ? '#1a1a1a' : '#fffaf0', border: `4px solid ${dark ? GOLD_LT : INK}`,
    boxShadow: glow ? '0 0 50px rgba(232,192,102,.6)' : `10px 10px 0 ${GOLD_LT}`,
    clipPath: broken === 'end' ? 'polygon(0 0,100% 0,100% 100%,0 100%,0 70%,6% 60%,0 50%,6% 40%,0 30%)' : broken === 'start' ? 'polygon(0 0,100% 0,100% 30%,94% 40%,100% 50%,94% 60%,100% 70%,100% 100%,0 100%)' : undefined}}>
    {label ? <div style={{position: 'absolute', top: -22, right: 18, fontFamily: 'Cairo', fontWeight: 800, fontSize: w * 0.075, background: INK, color: GOLD_LT, padding: '0 14px', borderRadius: 99}}>{label}</div> : null}
    {text ? <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: w * 0.105, lineHeight: 1.45, color: dark ? '#fff' : INK}}>{text}</div>
      : Array.from({length: lines}).map((_, i) => <div key={i} style={{height: w * 0.035, width: `${70 + random('c' + i + w) * 28}%`, background: dark ? '#6d6450' : '#cdbf9f', borderRadius: 6, marginTop: w * 0.05}} />)}
  </div>
);

// ── مكتب: الموظف الجديد، والمدير، ودليل الموظف ──
const Office: React.FC<{t: (s: number) => number}> = ({t}) => {
  const f = useCurrentFrame();
  const drop = sp(f - t(27.68) * FPS, 9, 140);
  const pages = Math.floor(lerp(f, t(28.89) * FPS, t(29.6) * FPS, 0, 100));
  return (
    <div style={{position: 'relative', width: 980, height: 820}}>
      <svg viewBox="0 0 980 820" width="980" height="820" style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="dk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1C4" /><stop offset=".5" stopColor="#E8C066" /><stop offset="1" stopColor="#8F6A1F" /></linearGradient></defs>
        <rect x="60" y="560" width="860" height="40" rx="14" fill="#2a1f17" stroke="url(#dk)" strokeWidth="5" />
        <rect x="120" y="600" width="26" height="200" fill="#2a1f17" /><rect x="834" y="600" width="26" height="200" fill="#2a1f17" />
        {/* لابتوب */}
        <rect x="600" y="420" width="230" height="140" rx="12" fill="#151515" stroke="url(#dk)" strokeWidth="5" />
        <rect x="580" y="556" width="270" height="12" rx="6" fill="url(#dk)" />
        <rect x="622" y="440" width="186" height="100" rx="6" fill="#0b1430" />
      </svg>
      {/* الموظف */}
      <div style={{position: 'absolute', left: 380, top: 300}}><In at={0.1} pop><Person size={230} hue={0} /></In></div>
      {/* الدليل بيسقط عالمكتب */}
      <div style={{position: 'absolute', left: 120, top: 330 - (1 - drop) * 500, transform: `rotate(${(1 - drop) * -20}deg)`}}>
        {drop > 0.01 ? <Notebook w={230} label="دليل الموظف" thick={7} /> : null}
      </div>
      {pages > 0 ? <div style={{position: 'absolute', left: 160, top: 250, fontFamily: 'Cairo', fontWeight: 800, fontSize: 56, color: INK, background: GOLD_LT, borderRadius: 99, padding: '2px 26px', direction: 'rtl'}}>
        <span style={ltr}>{pages}</span> صفحة</div> : null}
      {/* المدير */}
      <div style={{position: 'absolute', right: 60, top: 60}}><In at={t(29.88)} x={-160} y={0}><div style={{display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl'}}>
        <Person size={130} hue={2} /><Bubble size={36} dark>كم يوم إجازة إلك؟</Bubble></div></In></div>
    </div>
  );
};

// ── توأم الحروف: نفس الشكل، رقم هوية مختلف ──
const Twin: React.FC<{code: string; ok?: boolean; tag: string}> = ({code, ok, tag}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
    <div style={{width: 260, height: 260, borderRadius: 36, background: '#fffaf0', border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `10px 10px 0 ${GOLD_LT}`}}>
      <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 190, color: INK, lineHeight: 1}}>ب</span></div>
    <div style={{width: 300, borderRadius: 18, overflow: 'hidden', border: `4px solid ${ok ? GOLD_LT : '#c44'}`, background: '#141414'}}>
      <div style={{background: ok ? GOLD_LT : '#c44', color: ok ? INK : '#fff', fontFamily: 'Cairo', fontWeight: 800, fontSize: 28, padding: '4px 0', textAlign: 'center'}}>{tag}</div>
      <div style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 46, color: '#fff', textAlign: 'center', padding: '10px 0', ...ltr}}>{code}</div></div>
  </div>
);

export const S6: Record<string, SceneFC> = {
  // «أغلب مشاكل الذكاء الاصطناعي مع ملفاتك، مش من النموذج…»
  hook: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, direction: 'rtl'}}>
        <In at={T(3.47)} pop><Notebook w={260} label="ملفاتك" thick={4} /></In>
        <In at={T(0.52)} pop><div style={{position: 'relative'}}><Robot size={280} mood={f > T(4.76) * FPS ? 'happy' : 'idle'} />
          {f > T(4.23) * FPS ? <div style={{position: 'absolute', top: -40, left: 50, width: 180, height: 40, borderRadius: '50%', border: `8px solid ${GOLD_LT}`, transform: 'rotateX(60deg)', boxShadow: '0 0 30px #ffd56a'}} /> : null}</div></In>
      </div>
      <In at={T(4.23)} pop style={{marginTop: 50}}><div style={{position: 'relative'}}><Pill dark size={56}><Icon name="robot" size={52} />النموذج؟</Pill>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="x" size={150} color={GOLD_LT} weight="bold" /></div></div></In>
    </Stage>;
  },
  // «…من المقص. وبالنص رح أوريك فخ بيوقع فيه كل حدا بيشتغل على ملفات عربية»
  trapTease: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const snap = sp(f - T(6.72) * FPS, 8, 260); const open = 0.5 + 0.5 * Math.sin(f / 3);
    return <Shake power={f < T(6.72) * FPS + 10 && f > T(6.72) * FPS ? 24 : 0} frames={10}><Stage>
      <div style={{transform: `scale(${0.3 + 0.7 * snap}) rotate(${(1 - snap) * -60}deg)`, opacity: Math.min(1, snap * 2)}}><Scissors size={460} open={f > T(7.27) * FPS ? open * 0.6 : 1 - snap * 0.8} rot={-20} /></div>
      <In at={T(8.84)} pop style={{marginTop: 30}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Tile size={140} r={0.5}><Icon name="warning" size={90} /></Tile>
        <div><Big size={80}>فخ</Big><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 44, color: GOLD_LT}}>بالملفات العربية</div></div></div></In>
      <In at={T(12.0)} pop style={{marginTop: 30}}><Pill size={44}><Icon name="lock-key" size={40} color={INK} />بالنص…</Pill></In>
    </Stage></Shake>;
  },
  // «أنا محمد أبو سعادة، مهندس ومدرّب ذكاء اصطناعي، وهاي سلسلة ثلاثين يوم… واليوم، اليوم السادس» (بطاقة المتابعة فوق)
  intro: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const prog = lerp(f, T(17.9) * FPS, T(20.9) * FPS, 0, 6 / 30);
    const R = 190, C = 2 * Math.PI * R;
    return <Stage>
      <div style={{position: 'relative', marginTop: 260, width: 460, height: 460}}>
        <svg width="460" height="460" style={{position: 'absolute', inset: 0, transform: 'rotate(-90deg)'}}>
          <circle cx="230" cy="230" r={R} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="26" />
          <circle cx="230" cy="230" r={R} fill="none" stroke="#E8C066" strokeWidth="26" strokeLinecap="round" strokeDasharray={`${C * prog} ${C}`} style={{filter: 'drop-shadow(0 0 14px #ffd56a)'}} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#e9e2cf'}}>اليوم</div>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 190, lineHeight: 1, ...goldText, ...ltr}}>{f > T(22.4) * FPS ? 6 : Math.max(1, Math.round(prog * 30))}</div>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 36, color: '#e9e2cf', ...ltr}}>/ 30</div>
        </div>
      </div>
      <In at={T(20.76)} pop style={{marginTop: 30}}><Pill dark size={44}><Icon name="rocket-launch" size={40} />من الصفر</Pill></In>
    </Stage>;
  },
  // «تخيل أول يوم إلك بشركة جديدة… دليل الموظف ميت صفحة… كم يوم إجازة إلك؟ رح تقرأ ميت صفحة عشان سؤال واحد؟»
  office: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <Office t={T} />
      <In at={T(32.99)} pop rot={-15} style={{marginTop: -30}}><div style={{display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl'}}>
        <Tile size={110} r={0.5}><Icon name="clock-counter-clockwise" size={70} style={{transform: `rotate(${-f * 12}deg)`}} /></Tile>
        <Stamp rot={-4} size={56}><span style={ltr}>100</span> صفحة… لسؤال واحد؟</Stamp></div></In>
    </Stage>;
  },
  // «الذكاء الاصطناعي عنده نفس المشكلة. والحل اسمه راغ: بيفتح ملفاتك، بيلاقي الصفحة الصح، وبعدين بيجاوب»
  rag: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const step = (a: number) => sp(f - T(a) * FPS);
    return <Stage>
      <In at={T(40.93)} pop><div style={{background: INK, borderRadius: 30, padding: '4px 46px', border: `4px solid ${GOLD_LT}`}}><Big size={120} gold style={ltr}>RAG</Big></div></In>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 60, direction: 'rtl', width: 1000, justifyContent: 'center'}}>
        {([['robot', 'النموذج', 42.4], ['folder', 'بيفتح ملفاتك', 44.43], ['file-magnifying-glass', 'بيلاقي الصفحة', 45.71], ['chat-centered-dots', 'بيجاوب', 48.12]] as const).map(([ic, l, t], i) => (
          <React.Fragment key={l}>
            {i > 0 ? <div style={{opacity: step(t), transform: `scaleX(${step(t)})`}}><Icon name="arrow-left" size={36} weight="bold" /></div> : null}
            <div style={{opacity: Math.min(1, step(t) * 1.5), transform: `translateY(${(1 - step(t)) * 60}px)`, textAlign: 'center'}}>
              {ic === 'robot' ? <Robot size={140} mood="read" /> : ic === 'folder' ? <Notebook w={140} label="ملفات" thick={3} /> : <Tile size={140} r={0.3}><Icon name={ic} size={88} weight="duotone" /></Tile>}
              <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 28, color: '#fff', marginTop: 12, whiteSpace: 'nowrap'}}>{l}</div></div>
          </React.Fragment>))}
      </div>
    </Stage>;
  },
  // «زي الطالب اللي مسموحله يفتح الكتاب بالامتحان»
  exam: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 30, direction: 'rtl'}}>
        <In at={0.1} pop><div style={{width: 380, background: '#fff', border: `5px solid ${INK}`, borderRadius: 20, padding: 26, boxShadow: `12px 12px 0 ${GOLD_LT}`, direction: 'rtl'}}>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 46, color: INK}}>امتحان</div>
          {[1, 2, 3].map((q) => <div key={q} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 18}}><Icon name="check-circle" size={40} color={GOLD} />
            <div style={{height: 14, flex: 1, background: '#d9d1bd', borderRadius: 7}} /></div>)}</div></In>
        <In at={T(50.89)} pop rot={12}><Notebook w={260} open={0} label="الكتاب مفتوح ✓" glow /></In>
      </div>
      <In at={T(49.17)} pop style={{marginTop: 40}}><Person size={190} hue={3} glow /></In>
    </Stage>;
  },
  // «بس الطالب الشاطر… بيكون محضّر بطاقات صغيرة، كل بطاقة فيها فكرة وحدة… اسمها تشَنكس»
  cards: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const fan = sp(f - T(58.2) * FPS, 14, 120);
    return <Stage>
      <div style={{position: 'relative', width: 900, height: 620}}>
        <div style={{position: 'absolute', left: 330, top: 160, opacity: 1 - fan, transform: `scale(${1 - fan * 0.5})`}}><Notebook w={240} label="الكتاب" thick={8} /></div>
        {Array.from({length: 7}).map((_, i) => {
          const a = (i - 3) * 13 * fan; const x = (i - 3) * 72 * fan;
          return <div key={i} style={{position: 'absolute', left: 335 + x, top: 180 + Math.abs(i - 3) * 22 * fan, transform: `rotate(${a}deg)`, transformOrigin: '50% 140%', opacity: Math.min(1, fan * 2)}}>
            <Card w={230} lines={3} label={`فكرة ${i + 1}`} /></div>;
        })}
      </div>
      <In at={T(65.0)} pop style={{marginTop: 20}}><div style={{background: INK, borderRadius: 26, padding: '4px 40px', border: `4px solid ${GOLD_LT}`}}><Big size={96} gold style={ltr}>Chunks</Big></div></In>
    </Stage>;
  },
  // «والسر كله بالمقص: إذا قصيت بنص الجملة… واحد وعشرين… يوم عمل»
  badcut: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cut = T(70.34) * FPS; const sx = lerp(f, T(68.1) * FPS, cut, -500, 0); const split = sp(f - cut, 11, 150);
    return <Stage>
      <div style={{position: 'relative', width: 980, height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', gap: 30 * split + 0, direction: 'rtl'}}>
          <div style={{transform: `translateX(${split * 30}px) rotate(${split * 4}deg)`}}><Card w={430} text="الإجازة السنوية 21…" broken={split > 0.1 ? 'end' : undefined} /></div>
          <div style={{transform: `translateX(${-split * 30}px) rotate(${-split * 4}deg)`, opacity: Math.min(1, split * 2)}}><Card w={430} text="…يوم عمل" broken="start" /></div>
        </div>
        <div style={{position: 'absolute', left: 490 + sx - 120, top: 120}}><Scissors size={240} open={f < cut ? 0.5 + 0.5 * Math.sin(f / 2.5) : 0} rot={90} /></div>
      </div>
      <In at={T(77.69)} pop rot={-15}><Stamp rot={-4} size={66}>ولا وحدة بتجاوب لحالها</Stamp></In>
    </Stage>;
  },
  // «فبنقص على حدود الفقرات والجمل، وبنخلي سطر مشترك بين كل بطاقتين، اسمه أوفرلاب»
  goodcut: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const ov = sp(f - T(84.67) * FPS, 14, 140);
    return <Stage>
      <In at={0.1} pop style={{marginTop: 120}}><Card w={600} text="الإجازة السنوية 21 يوم عمل." glow /></In>
      <In at={T(81.87)} pop style={{marginTop: 20}}><div style={{display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl'}}><Scissors size={110} open={0.1} rot={90} /><Pill size={40}>بنقص هون: آخر الجملة</Pill></div></In>
      <div style={{position: 'relative', marginTop: 40, width: 900, height: 300}}>
        <div style={{position: 'absolute', right: 40 + ov * 60, top: 0}}><Card w={400} lines={4} label="بطاقة 1" dark /></div>
        <div style={{position: 'absolute', left: 40 + ov * 60, top: 40}}><Card w={400} lines={4} label="بطاقة 2" dark /></div>
        <div style={{position: 'absolute', left: 340, top: 30, width: 220, height: 240, borderRadius: 16, background: `rgba(232,192,102,${0.35 * ov})`, border: `4px dashed ${GOLD_LT}`, opacity: ov}} />
      </div>
      <In at={T(88.55)} pop style={{marginTop: 10}}><div style={{background: INK, borderRadius: 26, padding: '2px 36px', border: `4px solid ${GOLD_LT}`}}><Big size={80} gold style={ltr}>Overlap</Big></div></In>
    </Stage>;
  },
  // «زي الغرزة اللي بتربط قطعتين قماش، عشان الفكرة ما تنقطع»
  stitch: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const p = lerp(f, T(90.2) * FPS, T(93.6) * FPS);
    const N = 9;
    return <Stage>
      <div style={{position: 'relative', width: 900, height: 520}}>
        <div style={{position: 'absolute', right: 0, top: 60, transform: 'rotate(2deg)'}}><Card w={440} lines={5} /></div>
        <div style={{position: 'absolute', left: 0, top: 60, transform: 'rotate(-2deg)'}}><Card w={440} lines={5} /></div>
        <svg width="900" height="520" style={{position: 'absolute', inset: 0}}>
          {Array.from({length: N}).map((_, i) => {
            const y = 90 + i * 40; const show = Math.min(1, Math.max(0, p * N - i));
            return <g key={i} opacity={show}><line x1="400" y1={y} x2={400 + 100 * show} y2={y + 20} stroke={INK} strokeWidth="9" strokeLinecap="round" /><line x1="500" y1={y} x2={500 - 100 * show} y2={y + 20} stroke={INK} strokeWidth="9" strokeLinecap="round" /></g>;
          })}
          <circle cx={400 + 100 * ((p * N) % 1)} cy={90 + Math.floor(p * N) * 40} r="12" fill="#fff" stroke={INK} strokeWidth="4" opacity={p < 1 ? 1 : 0} />
        </svg>
      </div>
      <In at={T(93.78)} pop><Pill dark size={52}><Icon name="link" size={48} />الفكرة ما بتنقطع</Pill></In>
    </Stage>;
  },
  // «تعالوا نشوف عملي… وبقطّعه بأداة شاطرة: الفقرة، السطر، النقطة وعلامة السؤال، وآخر إشي الكلمة»
  code: ({t0}) => {
    const T = (s: number) => s - t0;
    const SEP: [string, string, number][] = [['¶', 'فقرة', 107.13], ['↵', 'سطر', 108.97], ['.', 'نقطة', 109.67], ['؟', 'سؤال', 111.0], ['␣', 'كلمة', 113.28]];
    return <Stage>
      <In at={0} x={200} y={0}><Pill dark size={42}><Logo name="python" size={40} /><span style={ltr}>day-06/app.py</span></Pill></In>
      <In at={0.3} style={{marginTop: 30}}><Code lines={[
        'docs = PyPDFLoader("sample.pdf").load()',
        'd.page_content = unicodedata.normalize(',
        '    "NFKC", d.page_content)',
        'splitter = RecursiveCharacterTextSplitter(',
        '    chunk_size=800, chunk_overlap=120,',
        '    separators=["\\n\\n","\\n","۔",".","؟"," "])',
        'chunks = splitter.split_documents(docs)']} from={T(98.6)} to={T(106.5)} hl="RecursiveCharacterTextSplitter" title="VS Code — app.py" /></In>
      <div style={{display: 'flex', gap: 14, marginTop: 34, direction: 'rtl'}}>
        {SEP.map(([s, l, t], i) => <React.Fragment key={l}>{i > 0 ? <In at={T(t)} pop><Icon name="arrow-left" size={34} weight="bold" /></In> : null}
          <In at={T(t)} pop><div style={{textAlign: 'center'}}><Tile size={100} r={0.3}><span style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 56, ...goldText}}>{s}</span></Tile>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 28, color: '#fff', marginTop: 6}}>{l}</div></div></In></React.Fragment>)}
      </div>
    </Stage>;
  },
  // «كل بطاقة حوالي ثمنمية حرف، ومية وعشرين حرف مشتركين مع اللي بعدها»
  numbers: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const n1 = Math.round(lerp(f, T(114.79) * FPS, T(116.1) * FPS, 0, 800)); const n2 = Math.round(lerp(f, T(116.43) * FPS, T(117.9) * FPS, 0, 120));
    return <Stage>
      <div style={{position: 'relative', width: 900, height: 420}}>
        <div style={{position: 'absolute', right: 30, top: 0}}><Card w={460} lines={6} label="800 حرف" /></div>
        <div style={{position: 'absolute', left: 30, top: 80}}><Card w={460} lines={6} label="البطاقة الجاية" /></div>
        <div style={{position: 'absolute', left: 360, top: 70, width: 180, height: 300, borderRadius: 16, background: 'rgba(232,192,102,.35)', border: `4px dashed ${GOLD}`, opacity: lerp(f, T(116.4) * FPS, T(117) * FPS)}} />
      </div>
      <div style={{display: 'flex', gap: 30, marginTop: 40, direction: 'rtl'}}>
        <In at={T(115.29)} pop><Pill dark size={58}><span style={ltr}>{n1}</span> حرف</Pill></In>
        <In at={T(116.43)} pop><Pill size={58}><span style={ltr}>{n2}</span> مشتركين</Pill></In>
      </div>
    </Stage>;
  },
  // «وهاد الفخ اللي وعدتك فيه: الحروف بتطلع من البي دي إف بشكل غريب… زي توأم، نفس الشكل»
  trap: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={T(122.17)} pop><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}><Tile size={130} r={0.5}><Icon name="warning" size={84} /></Tile><Big size={96} gold>الفخ</Big></div></In>
      <div style={{display: 'flex', alignItems: 'center', gap: 50, marginTop: 50, direction: 'rtl'}}>
        <In at={T(126.72)} pop><div style={{textAlign: 'center'}}><Icon name="eye-slash" size={60} weight="duotone" /><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 36, color: '#fff'}}>إنت بتشوف</div></div></In>
        <In at={T(129.65)} pop><div style={{display: 'flex', gap: 30}}>
          {[0, 1].map((i) => <div key={i} style={{width: 220, height: 220, borderRadius: 30, background: '#fffaf0', border: `5px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `10px 10px 0 ${GOLD_LT}`}}>
            <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 160, color: INK, lineHeight: 1}}>ب</span></div>)}</div></In>
      </div>
      <In at={T(130.03)} pop style={{marginTop: 40}}><Pill size={48}>نفس الشكل… ؟</Pill></In>
    </Stage>;
  },
  // «بس كل واحد إله رقم هوية مختلف… كلمة إجازة ما بتلاقيها مع إنها قدامك! والحل؟ سطر واحد بالكود بيرجّع كل حرف لأصله»
  twins: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const fixed = f > T(142.63) * FPS;
    const q = 'إجازة'; const typed = q.slice(0, Math.floor(lerp(f, T(134.89) * FPS, T(136.3) * FPS, 0, q.length)));
    const found = fixed && f > T(143.9) * FPS;
    return <Shake power={f > T(137.22) * FPS && f < T(137.22) * FPS + 10 ? 18 : 0} frames={10}><Stage>
      <div style={{display: 'flex', gap: 40, direction: 'rtl'}}>
        <In at={0.1} pop><Twin code="U+0628" ok tag="حرف عادي" /></In>
        <In at={0.25} pop><Twin code={fixed ? 'U+0628' : 'U+FE91'} ok={fixed} tag={fixed ? 'رجع لأصله ✓' : 'من الـ PDF'} /></In>
      </div>
      <In at={T(134.52)} style={{marginTop: 50}}><div style={{width: 820, display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 99, padding: '14px 30px', border: `5px solid ${found ? GOLD : INK}`, direction: 'rtl',
        boxShadow: found ? '0 0 40px rgba(232,192,102,.7)' : 'none'}}>
        <Icon name="magnifying-glass" size={50} color={INK} /><span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 50, color: INK, flex: 1}}>{typed}<span style={{color: GOLD}}>▌</span></span>
        {f > T(136.94) * FPS ? <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 36, color: found ? INK : '#fff', background: found ? GOLD_LT : '#c44', borderRadius: 99, padding: '4px 20px', whiteSpace: 'nowrap'}}>
          {found ? 'لقيتها ✓' : '0 نتيجة'}</span> : null}</div></In>
      <In at={T(140.83)} pop style={{marginTop: 34}}><div style={{background: INK, borderRadius: 20, padding: '8px 30px', border: `3px solid ${GOLD_LT}`, fontFamily: 'monospace', fontSize: 40, color: GOLD_LT, ...ltr}}>unicodedata.normalize("NFKC", …)</div></In>
    </Stage></Shake>;
  },
  // «بشغّل، وهاي النتيجة: ثلاث صفحات… صاروا ست بطاقات جاهزة»
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cmd = '$ python day-06/app.py'; const typed = cmd.slice(0, Math.floor(lerp(f, T(145.5) * FPS, T(146.6) * FPS, 0, cmd.length)));
    const split = sp(f - T(148.64) * FPS, 13, 120);
    return <Stage>
      <In at={0}><Term>
        <div style={{fontFamily: 'monospace', fontSize: 34, color: GOLD_LT, ...ltr}}>{typed}</div>
        <In at={T(147.72)}><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 46, color: '#fff', marginTop: 16, direction: 'rtl'}}>3 صفحة → 6 مقطع</div></In>
        <In at={T(151.19)}><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 30, color: '#d9cfb3', marginTop: 12, direction: 'rtl', lineHeight: 1.6}}>دليل الموظف — شركة المثال<br />يبدأ الدوام الرسمي الساعة الثامنة صباحًا…</div></In>
      </Term></In>
      <div style={{position: 'relative', width: 900, height: 330, marginTop: 30}}>
        {[0, 1, 2].map((pg) => [0, 1].map((h) => {
          const i = pg * 2 + h; const x = 360 + (pg - 1) * 260 * (1 - split) + split * (i - 2.5) * 145;
          return <div key={i} style={{position: 'absolute', left: x, top: 30 + split * (h ? 60 : -10), transform: `rotate(${split * (i - 2.5) * 5}deg)`}}>
            <Card w={180} lines={3} label={split > 0.5 ? `${i + 1}` : undefined} glow={i === 0 && f > T(151.19) * FPS} /></div>;
        }))}
      </div>
    </Stage>;
  },
  // «الخلاصة: الراغ قوته من المقص. قُص صح… بيجاوب صح.»
  golden: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <In at={T(162.44)} pop style={{marginTop: 30}}><Scissors size={300} open={0.5 + 0.5 * Math.sin(f / 4)} rot={-25} /></In>
        <In at={T(164.82)} pop style={{marginTop: 20}}><Big size={110} color={INK}>قُص صح…</Big></In>
        <In at={T(165.42)} pop style={{marginTop: 10}}><div style={{background: INK, borderRadius: 26, padding: '4px 44px'}}><Big size={110} gold>بيجاوب صح.</Big></div></In>
      </Stage>
    </>;
  },
  // «إذا الفيديو فادك احفظه، لأنه أول خطوة بأي مشروع راغ. الكود على جيت هَب»
  save: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={T(167.72)} pop><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}><Pill dark size={44}>أسبوع الراغ</Pill><Tile size={70} r={0.5}><Icon name="check" size={44} weight="bold" /></Tile></div></In>
      <div style={{display: 'flex', gap: 40, marginTop: 50, direction: 'rtl'}}>
        <In at={T(170.67)} pop><div style={{textAlign: 'center'}}><Tile size={200} r={0.5}><Icon name="bookmark-simple" size={130} /></Tile><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 42, color: '#fff', marginTop: 12}}>احفظه</div></div></In>
        <In at={T(171.98)} pop><div style={{textAlign: 'center'}}><Tile size={200} r={0.5}><span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 90, ...goldText}}>1</span></Tile><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 42, color: '#fff', marginTop: 12}}>أول خطوة</div></div></In>
      </div>
      <In at={T(173.59)} pop style={{marginTop: 50}}><Pill size={46}><Logo name="github" size={42} color={INK} />الكود بأول تعليق</Pill></In>
    </Stage>;
  },
  // «وإنت: شو أطول ملف بتتمنى تسأله سؤال، ويجاوبك فورًا؟ اكتبلي بالتعليقات»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const F: [string, string, number][] = [['file-pdf', 'كتاب جامعي', 178.85], ['scroll', 'عقد عمل', 179.32], ['receipt', 'فواتير سنة', 179.65], ['file-text', 'دليل شركة', 180.0]];
    return <Stage>
      <In at={0} pop><Notebook w={300} label="أطول ملف؟" thick={9} /></In>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 40, width: 900}}>
        {F.map(([ic, l, t], i) => <In key={l} at={T(t)} pop rot={i % 2 ? 10 : -10}><div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `4px solid ${INK}`, borderRadius: '26px 26px 26px 6px', padding: '10px 26px', boxShadow: `8px 8px 0 ${GOLD_LT}`, direction: 'rtl'}}>
          <Icon name={ic} size={44} color={INK} /><span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 42, color: INK}}>{l}</span></div></In>)}
      </div>
      <In at={T(182.54)} pop style={{marginTop: 40}}><Pill dark size={52}><Icon name="chat-circle-dots" size={48} />اكتبلي بالتعليقات</Pill></In>
    </Stage>;
  },
  // «وتابعني، لأنه بكرة بنعلّم الكمبيوتر يفهم المعنى، مش بس الكلمات»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(184.5) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 104, padding: '8px 76px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={120} color="#fff" /></div>
      </div></In>
      <In at={T(185.21)} style={{marginTop: 100}}>
        <div style={{width: 820, borderRadius: 36, padding: '28px 40px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl'}}>
          <div style={{fontWeight: 800, fontSize: 44, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>7</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 14}}>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#fff'}}>سيارة</div><span style={{fontSize: 40, color: GOLD_LT}}>≈</span><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#fff'}}>مركبة</div>
            <div style={{fontWeight: 800, fontSize: 44, color: '#fff', marginRight: 20}}>بيفهم <span style={goldText}>المعنى</span></div></div>
        </div></In>
    </Stage>;
  },
  // «وتذكّر: من غزة… للعالم.» — التوقيع الثابت
  signature: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const reach = lerp(f, T(190.97) * FPS, T(191.9) * FPS);
    return <>
      <Leak seed={4} frames={40} />
      <Stage>
        <div style={{position: 'relative', width: 700, height: 520}}>
          {/* كرة أرضية من خطوط */}
          <svg viewBox="-250 -250 500 500" width="700" height="520" style={{position: 'absolute', inset: 0, opacity: 0.25 + 0.75 * reach}}>
            <circle r="210" fill="none" stroke="#E8C066" strokeWidth="5" />
            {[-140, -70, 0, 70, 140].map((y) => <ellipse key={y} cx="0" cy={y} rx={Math.sqrt(210 * 210 - y * y)} ry={12} fill="none" stroke="#E8C066" strokeWidth="2.5" opacity=".7" />)}
            {[0, 1, 2, 3].map((i) => <ellipse key={i} rx={210 * Math.abs(Math.cos(f / 30 + (i * Math.PI) / 4))} ry="210" fill="none" stroke="#E8C066" strokeWidth="2.5" opacity=".7" />)}
          </svg>
          {/* دبوس غزة */}
          <In at={T(190.64)} pop style={{position: 'absolute', left: 390, top: 120}}><div style={{textAlign: 'center'}}>
            <svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 115 C45 115 5 70 5 42 A40 40 0 1 1 85 42 C85 70 45 115 45 115Z" fill="#E8C066" stroke="#8F6A1F" strokeWidth="4" /><circle cx="45" cy="42" r="15" fill={INK} /></svg>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#fff'}}>غزة</div></div></In>
          {/* موجات للعالم */}
          {reach > 0 ? [0, 1, 2].map((i) => { const k = ((reach * 1.5 + i / 3) % 1); return <div key={i} style={{position: 'absolute', left: 435 - k * 300, top: 165 - k * 300, width: k * 600, height: k * 600, borderRadius: '50%', border: `4px solid ${GOLD_LT}`, opacity: 1 - k}} />; }) : null}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20}}>
          <In at={T(190.64)} pop><Big size={110}>من غزة…</Big></In>
          <In at={T(191.43)} pop><Big size={130} gold>للعالم</Big></In>
        </div>
      </Stage>
    </>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
