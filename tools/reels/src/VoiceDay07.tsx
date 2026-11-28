import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Sign, clamp, sp} from './EnergyReel';
import {Code, FPS, In, Kind, Leak, Pill, Plan, SceneFC, Tile, ltr} from './voiceKit';
import {Robot} from './illus';

// ريل اليوم 7 (RAG ج2: Embeddings + FAISS) — أسلوب جديد: «خريطة المعاني».
// عالم واحد ثابت (مدينة ليلية بشوارع ذهبية) والكاميرا بتطير فيه طول الفيديو، والمشاهد طبقة شفافة فوقه:
// تايبوغرافي ضخم بيضرب الشاشة، لعبة «مين الغريب؟»، شلال أرقام 768، ورادار بيلاقي أقرب جار.

export const KIND7: Record<string, Kind> = {
  hook: 'map', intro: 'map', search: 'map', game: 'map', secret: 'map', map: 'map', address: 'map', code: 'map', run: 'map',
  golden: 'map', save: 'map', ask: 'map', next: 'map', signature: 'map', outro: 'dark',
} as any;

const lerp = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], clamp);
const F = (s: number) => s * FPS;

// ── العالم: البيوت والأحياء (إحداثيات على لوح 3200×3200، المركز 0،0) ──
type House = {id: string; x: number; y: number; label?: string; icon: string; big?: boolean};
const HOUSES: House[] = [
  {id: 'car', x: -600, y: -340, label: 'السيارة الكهربائية', icon: 'car-profile', big: true},
  {id: 'veh', x: -360, y: -230, label: 'المركبات الحديثة', icon: 'bus', big: true},
  {id: 'train', x: -760, y: -90, label: 'قطار', icon: 'train'},
  {id: 'bike', x: -300, y: -520, label: 'دراجة', icon: 'bicycle'},
  {id: 'cat', x: 760, y: 560, label: 'القطة نايمة', icon: 'cat', big: true},
  {id: 'dog', x: 960, y: 380, label: 'كلب', icon: 'dog'},
  {id: 'bird', x: 580, y: 760, label: 'عصفور', icon: 'bird'},
  {id: 'apple', x: 640, y: -700, label: 'تفاحة', icon: 'apple-logo'},
  {id: 'coffee', x: 860, y: -520, label: 'قهوة', icon: 'coffee'},
  {id: 'pc', x: -680, y: 700, label: 'كمبيوتر', icon: 'desktop'},
  {id: 'phone', x: -460, y: 860, label: 'موبايل', icon: 'device-mobile'},
];
const DISTRICTS: [string, number, number][] = [['حي المواصلات', -530, -300], ['حي الحيوانات', 770, 560], ['حي الأكل', 740, -620], ['حي التكنولوجيا', -560, 780]];
const Q = {x: -500, y: 80};   // مكان سؤال «مركبة صديقة للبيئة»

// ── كاميرا: [زمن، x، y، زوم، ميلان، دوران، تعتيم] ──
type K = [number, number, number, number, number, number, number];
const CAM: K[] = [
  [0, 0, 0, 0.32, 52, -10, 0.8], [9, 0, 0, 0.36, 55, 6, 0.82], [12, 0, 0, 0.42, 55, 12, 0.45], [14.6, 0, 0, 0.42, 55, 14, 0.55],
  [23.6, 0, 0, 0.36, 58, 30, 0.86], [37.4, 0, 0, 0.36, 58, 50, 0.86], [60.5, 0, 0, 0.3, 58, 60, 0.86],
  [61.5, 0, 0, 0.26, 0, 0, 0.7], [64.4, 0, 0, 0.28, 0, 0, 0.45], [66.3, 0, 0, 0.42, 48, -15, 0], [70.6, 0, 0, 0.48, 52, -5, 0],
  [72.4, -470, -290, 0.95, 55, -18, 0], [76.7, -470, -290, 1.1, 55, -24, 0], [77.3, 760, 560, 1.1, 55, 18, 0], [80.2, 760, 560, 1.15, 55, 22, 0],
  [81.2, -600, -340, 1.7, 38, -8, 0.15], [84.4, -600, -340, 1.85, 38, -12, 0.15], [85.2, -600, -340, 2.4, 30, -12, 0.75], [87.1, -600, -340, 2.4, 30, -12, 0.8],
  [88.2, 0, 0, 0.36, 58, 10, 0.88], [109.8, 0, 0, 0.36, 58, 40, 0.88], [110.8, 0, 0, 0.44, 50, 0, 0.15],
  [112.4, Q.x, Q.y, 0.9, 55, -15, 0], [118.9, Q.x, Q.y, 1.0, 55, -25, 0], [122.1, Q.x, Q.y, 1.0, 55, -25, 0], [122.7, 760, 560, 1.3, 50, 15, 0], [125.1, 760, 560, 1.35, 50, 20, 0],
  [126.2, 80, 110, 0.3, 30, 0, 0.35], [132.4, 80, 110, 0.3, 30, 10, 0.35], [133.4, 0, 0, 0.36, 58, 20, 0.86], [150.3, 0, 0, 0.36, 58, 60, 0.92], [160, 0, 0, 0.36, 58, 70, 0.95],
];
const camAt = (t: number) => {
  let i = CAM.findIndex((k) => k[0] > t); if (i <= 0) i = i === 0 ? 1 : CAM.length - 1;
  const a = CAM[i - 1], b = CAM[i]; const p = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
  return a.map((v, k) => (k === 0 ? t : v + (b[k] - v) * p)) as K;
};
// زمن الصوت الأصلي من زمن الفيديو (عشان النسخة القصيرة)
export const origTime = (plan: Plan, now: number) => {
  const sc = plan.scenes.find(([, a, b]) => now >= a && now < b) ?? plan.scenes[plan.scenes.length - 1];
  return ((sc as any)[3] ?? sc[1]) + (now - sc[1]);
};

const Billboard: React.FC<{h: House; tilt: number; rot: number; glow: number; rank?: number; t: number}> = ({h, tilt, rot, glow, rank, t}) => {
  const size = h.big ? 150 : 104;
  return (
    <div style={{position: 'absolute', left: h.x + 1600, top: h.y + 1600, transformStyle: 'preserve-3d'}}>
      {/* هالة على الأرض */}
      <div style={{position: 'absolute', left: -size * 1.4, top: -size * 1.4, width: size * 2.8, height: size * 2.8, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(232,192,102,${0.18 + 0.5 * glow}) 0, transparent 65%)`}} />
      {glow > 0.05 ? <div style={{position: 'absolute', left: -size, top: -size, width: size * 2, height: size * 2, borderRadius: '50%', border: `6px solid rgba(255,225,140,${glow * (1 - ((t * 0.8) % 1))})`,
        transform: `scale(${1 + ((t * 0.8) % 1) * 1.2})`}} /> : null}
      {/* المبنى واقف قدام الكاميرا */}
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `rotateZ(${-rot}deg) rotateX(${-tilt}deg)`}}>
        <div style={{position: 'absolute', left: -size / 2, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {h.label ? <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: h.big ? 44 : 34, whiteSpace: 'nowrap', padding: '4px 20px', borderRadius: 16, marginBottom: 14, direction: 'rtl',
            background: glow > 0.3 ? 'linear-gradient(150deg,#FFF1C4,#E8C066 50%,#C9A24B)' : 'rgba(10,14,24,.85)', color: glow > 0.3 ? INK : '#e9e2cf', border: `3px solid ${GOLD_LT}`,
            boxShadow: glow > 0.3 ? '0 0 50px rgba(255,214,110,.8)' : 'none'}}>{h.label}</div> : null}
          <div style={{position: 'relative', width: size, height: size, borderRadius: size * 0.3, background: 'linear-gradient(160deg,#1f2433,#0b0e16)', border: `5px solid ${GOLD_LT}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${30 + 60 * glow}px rgba(232,192,102,${0.35 + 0.6 * glow})`}}>
            <Icon name={h.icon} size={size * 0.6} weight="duotone" />
            {rank ? <div style={{position: 'absolute', top: -34, right: -34, width: 76, height: 76, borderRadius: '50%', background: GOLD_LT, color: INK, fontFamily: 'Cairo', fontWeight: 800, fontSize: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `4px solid ${INK}`}}>{rank}</div> : null}
          </div>
          <div style={{width: 10, height: 50, background: `linear-gradient(${GOLD_LT},transparent)`}} />
        </div>
      </div>
    </div>
  );
};

// ── طبقة العالم (تحت كل المشاهد) ──
export const World7: React.FC<{plan: Plan}> = ({plan}) => {
  const f = useCurrentFrame(); const now = f / FPS - plan.off; const t = origTime(plan, now);
  const [, cx, cy, zoom, tilt, rot, dim] = camAt(t);
  const [, px, py, pz] = camAt(t - 1 / FPS);
  const speed = Math.hypot((cx - px) * zoom, (cy - py) * zoom) + Math.abs(zoom - pz) * 900;
  const blur = Math.min(16, speed * 0.12);
  const glowOf = (id: string) => {
    let g = 0;
    if ((id === 'car' || id === 'veh') && t > 74.1 && t < 80.3) g = 1;
    if (id === 'cat' && t > 76.9 && t < 80.3) g = 0.8;
    if (id === 'car' && t > 115.2 && t < 126) g = 1;
    if (id === 'veh' && t > 118.7 && t < 126) g = 1;
    if (id === 'car' && t > 80.3 && t < 87.2) g = 1;
    if (t > 68.5 && t < 70.7) g = Math.max(g, 0.5 + 0.5 * Math.sin(t * 6 + id.length));
    return g;
  };
  const rank = (id: string) => (t > 115.2 && t < 126 ? (id === 'car' ? 1 : id === 'veh' && t > 118.7 ? 2 : undefined) : undefined);
  // ظهور البيوت عند «كل جملة إلها بيت»
  const houseIn = (i: number) => (t < 60 ? 1 : t < 68.4 ? 0.0 : Math.min(1, (t - 68.4 - i * 0.07) * 4));
  const qPin = t > 111.8 && t < 126 ? sp(F(t - 111.8), 9, 220) : 0;
  const radar = t > 112.6 && t < 122.2 ? ((t - 112.6) * 0.7) % 1 : -1;
  const link = lerp(t, 75.3, 75.9);
  const carH = HOUSES[0], vehH = HOUSES[1];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%,#101a2e 0,#070b14 60%,#020306 100%)', overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 38%', filter: blur > 0.6 ? `blur(${blur}px)` : undefined}}>
        <div style={{position: 'absolute', left: 540, top: 820, transformStyle: 'preserve-3d', transform: `rotateX(${tilt}deg) rotateZ(${rot}deg) scale(${zoom}) translate(${-cx}px,${-cy}px)`}}>
          <div style={{position: 'absolute', left: -1600, top: -1600, width: 3200, height: 3200, transformStyle: 'preserve-3d',
            backgroundImage: `linear-gradient(rgba(232,192,102,.16) 3px, transparent 3px), linear-gradient(90deg, rgba(232,192,102,.16) 3px, transparent 3px),
              linear-gradient(rgba(120,170,230,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,230,.07) 1px, transparent 1px)`,
            backgroundSize: '320px 320px, 320px 320px, 80px 80px, 80px 80px', backgroundPosition: '0 0'}}>
            {/* شوارع رئيسية */}
            <svg width="3200" height="3200" style={{position: 'absolute', inset: 0}}>
              <path d="M0 1300 C 900 1250, 1500 1500, 3200 1700" stroke="rgba(232,192,102,.5)" strokeWidth="26" fill="none" />
              <path d="M1300 0 C 1250 900, 1700 1700, 1900 3200" stroke="rgba(232,192,102,.45)" strokeWidth="22" fill="none" />
              <path d="M300 300 L 2900 2900" stroke="rgba(150,200,255,.18)" strokeWidth="14" fill="none" />
              {link > 0 ? <line x1={carH.x + 1600} y1={carH.y + 1600} x2={carH.x + 1600 + (vehH.x - carH.x) * link} y2={carH.y + 1600 + (vehH.y - carH.y) * link} stroke="#FFE08A" strokeWidth="14" strokeDasharray="30 18" strokeLinecap="round" /> : null}
              {/* خط المسافة بالخلاصة */}
              {t > 128.5 && t < 133 ? <>
                <line x1={carH.x + 1600} y1={carH.y + 1600} x2={vehH.x + 1600} y2={vehH.y + 1600} stroke="#FFE08A" strokeWidth="22" strokeLinecap="round" />
                <line x1={carH.x + 1600} y1={carH.y + 1600} x2={carH.x + 1600 + (HOUSES[4].x - carH.x) * lerp(t, 129.8, 131.4)} y2={carH.y + 1600 + (HOUSES[4].y - carH.y) * lerp(t, 129.8, 131.4)}
                  stroke="rgba(233,226,207,.6)" strokeWidth="16" strokeDasharray="40 26" strokeLinecap="round" /></> : null}
            </svg>
            {DISTRICTS.map(([n, x, y]) => <div key={n} style={{position: 'absolute', left: x + 1600 - 360, top: y + 1600 - 360, width: 720, height: 720, borderRadius: '50%',
              border: '4px dashed rgba(232,192,102,.35)', background: 'radial-gradient(circle, rgba(120,170,230,.08), transparent 70%)'}}>
              <div style={{position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontFamily: 'Cairo', fontWeight: 800, fontSize: 54, color: 'rgba(232,192,102,.6)', direction: 'rtl'}}>{n}</div></div>)}
            {/* موجة الرادار من السؤال */}
            {radar >= 0 ? [0, 0.33, 0.66].map((o) => { const k = (radar + o) % 1; return <div key={o} style={{position: 'absolute', left: Q.x + 1600 - 700 * k, top: Q.y + 1600 - 700 * k, width: 1400 * k, height: 1400 * k,
              borderRadius: '50%', border: `8px solid rgba(255,225,140,${1 - k})`}} />; }) : null}
            {HOUSES.map((h, i) => <div key={h.id} style={{opacity: houseIn(i), transformStyle: 'preserve-3d'}}>
              <Billboard h={h} tilt={tilt} rot={rot} glow={glowOf(h.id)} rank={rank(h.id)} t={t} /></div>)}
            {/* دبوس السؤال */}
            {qPin > 0.01 ? <div style={{position: 'absolute', left: Q.x + 1600, top: Q.y + 1600, transformStyle: 'preserve-3d'}}>
              <div style={{position: 'absolute', transformOrigin: '0 0', transform: `rotateZ(${-rot}deg) rotateX(${-tilt}deg) translateY(${(1 - qPin) * -400}px)`}}>
                <div style={{position: 'absolute', left: -60, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap', padding: '6px 22px', borderRadius: 18, background: '#fff', color: INK, border: `4px solid ${INK}`, marginBottom: 10, direction: 'rtl'}}>
                    🔍 مركبة صديقة للبيئة</div>
                  <svg width="120" height="160" viewBox="0 0 90 120"><path d="M45 115 C45 115 5 70 5 42 A40 40 0 1 1 85 42 C85 70 45 115 45 115Z" fill="#9fd0f5" stroke="#fff" strokeWidth="5" /><circle cx="45" cy="42" r="15" fill={INK} /></svg>
                </div></div></div> : null}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(2,3,6,${dim})`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,.65) 100%)'}} />
    </AbsoluteFill>
  );
};

// ── أدوات المونتاج الجديدة ──
// كلمة ضخمة بتنضرب بالشاشة (من كبير لطبيعي مع ضبابية) وبعدين بتطلع
const Slam: React.FC<{at: number; out?: number; children: React.ReactNode; size?: number; gold?: boolean; y?: number; color?: string}> = ({at, out, children, size = 260, gold, y = 0, color = '#fff'}) => {
  const f = useCurrentFrame(); const k = sp(f - F(at), 11, 320); if (f < F(at)) return null;
  const o = out ? lerp(f, F(out), F(out) + 6, 1, 0) : 1; if (o <= 0) return null;
  const sh = f - F(at) < 8 ? (random('s' + f) - 0.5) * 30 * (1 - (f - F(at)) / 8) : 0;
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', top: y}}>
    <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: size, lineHeight: 1.1, direction: 'rtl', whiteSpace: 'nowrap', opacity: Math.min(1, k * 2) * o,
      transform: `translate(${sh}px,${sh * 0.6}px) scale(${2.4 - 1.4 * Math.min(1, k)})`, filter: `blur(${(1 - Math.min(1, k)) * 14}px)`,
      ...(gold ? {...goldText, filter: `drop-shadow(0 0 40px rgba(232,192,102,.6)) blur(${(1 - Math.min(1, k)) * 14}px)`} : {color, textShadow: '0 10px 40px rgba(0,0,0,.8)'})}}>{children}</div>
  </AbsoluteFill>;
};
// عنصر بيطلع ويختفي بنافذة زمنية
const Win: React.FC<{a: number; b: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'down' | 'left' | 'right' | 'pop'}> = ({a, b, children, style, from = 'up'}) => {
  const f = useCurrentFrame(); if (f < F(a) - 1 || f > F(b) + 10) return null;
  const k = sp(f - F(a), 12, 220); const o = lerp(f, F(b), F(b) + 8, 1, 0);
  const d = (1 - Math.min(1, k)) * 140;
  const tr = from === 'up' ? `translateY(${-d}px)` : from === 'down' ? `translateY(${d}px)` : from === 'left' ? `translateX(${-d}px)` : from === 'right' ? `translateX(${d}px)` : `scale(${0.4 + 0.6 * k})`;
  return <div style={{position: 'absolute', opacity: Math.min(1, k * 2) * o, transform: tr, ...style}}>{children}</div>;
};
const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: 'rgba(10,14,24,.78)', border: `3px solid ${GOLD_LT}`, borderRadius: 34, boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 60px rgba(232,192,102,.18)', backdropFilter: 'blur(10px)', ...style}}>{children}</div>
);
const Center: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 300}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Cairo'}}>{children}</div>
);
const typed = (f: number, txt: string, a: number, b: number) => txt.slice(0, Math.floor(lerp(f, F(a), F(b), 0, txt.length)));

const Signature: React.FC<{T: (s: number) => number; a: number; b: number}> = ({T, a, b}) => {
  const f = useCurrentFrame(); const reach = lerp(f, F(T(b)), F(T(b) + 0.9));
  return <>
    <Leak seed={4} frames={40} />
    <AbsoluteFill style={{background: 'rgba(2,3,6,.55)'}} />
    <Center top={330}>
      <div style={{position: 'relative', width: 700, height: 560}}>
        <svg viewBox="-250 -250 500 500" width="700" height="560" style={{position: 'absolute', inset: 0, opacity: 0.3 + 0.7 * reach}}>
          <circle r="210" fill="none" stroke="#E8C066" strokeWidth="5" />
          {[-140, -70, 0, 70, 140].map((y) => <ellipse key={y} cx="0" cy={y} rx={Math.sqrt(210 * 210 - y * y)} ry={12} fill="none" stroke="#E8C066" strokeWidth="2.5" opacity=".7" />)}
          {[0, 1, 2, 3].map((i) => <ellipse key={i} rx={210 * Math.abs(Math.cos(f / 30 + (i * Math.PI) / 4))} ry="210" fill="none" stroke="#E8C066" strokeWidth="2.5" opacity=".7" />)}
        </svg>
        <In at={T(a)} pop style={{position: 'absolute', left: 390, top: 130}}><div style={{textAlign: 'center'}}>
          <svg width="90" height="120" viewBox="0 0 90 120"><path d="M45 115 C45 115 5 70 5 42 A40 40 0 1 1 85 42 C85 70 45 115 45 115Z" fill="#E8C066" stroke="#8F6A1F" strokeWidth="4" /><circle cx="45" cy="42" r="15" fill={INK} /></svg>
          <div style={{fontWeight: 800, fontSize: 40, color: '#fff'}}>غزة</div></div></In>
        {reach > 0 ? [0, 1, 2].map((i) => { const k = (reach * 1.5 + i / 3) % 1; return <div key={i} style={{position: 'absolute', left: 435 - k * 300, top: 175 - k * 300, width: k * 600, height: k * 600, borderRadius: '50%', border: `4px solid ${GOLD_LT}`, opacity: 1 - k}} />; }) : null}
      </div>
      <In at={T(a)} pop><div style={{fontWeight: 800, fontSize: 110, color: '#fff', direction: 'rtl'}}>من غزة…</div></In>
      <In at={T(b)} pop><div style={{fontWeight: 800, fontSize: 130, direction: 'rtl', ...goldText}}>للعالم</div></In>
    </Center>
  </>;
};

const SentenceCard: React.FC<{icon: string; text: string; odd?: boolean; w?: number}> = ({icon, text, odd, w = 820}) => (
  <div style={{width: w, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 28px', borderRadius: 28, direction: 'rtl', fontFamily: 'Cairo',
    background: odd ? 'linear-gradient(150deg,#3a1414,#1a0808)' : 'rgba(10,14,24,.86)', border: `4px solid ${odd ? '#e05a4f' : GOLD_LT}`, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
    <Tile size={96} r={0.3}><Icon name={icon} size={62} weight="duotone" /></Tile>
    <div style={{fontWeight: 800, fontSize: 46, color: '#fff'}}>{text}</div>
  </div>
);

export const S7: Record<string, SceneFC> = {
  // «سألت الكمبيوتر عن مركبة صديقة للبيئة، جابلي السيارة الكهربائية! ولا كلمة وحدة مشتركة… طيب كيف عرف؟»
  hook: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const q = typed(f, 'مركبة صديقة للبيئة', T(2.0), T(3.5));
    const away = lerp(f, F(T(9.6)), F(T(10.4))); const dimQ = lerp(f, F(T(8.3)), F(T(8.6)), 1, 0.25);
    return <>
      <div style={{position: 'absolute', top: 360, left: 70, right: 70, opacity: (1 - away) * dimQ, transform: `translateY(${-away * 300}px) scale(${1 - away * 0.3})`}}>
        <In at={T(0.2)} y={-120}><Glass style={{display: 'flex', alignItems: 'center', gap: 20, padding: '22px 34px', borderRadius: 99, direction: 'rtl', background: '#fff'}}>
          <Icon name="magnifying-glass" size={58} color={INK} />
          <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 56, color: INK, flex: 1}}>{q}<span style={{color: GOLD}}>{f % 20 < 10 ? '|' : ' '}</span></span></Glass></In>
        <In at={T(4.06)} pop style={{marginTop: 50}}><Glass style={{padding: '28px 36px', direction: 'rtl'}}>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 32, color: '#9fd0f5'}}>النتيجة الأولى</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8}}>
            <Tile size={110} r={0.3}><Icon name="car-profile" size={74} weight="duotone" /></Tile>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 64, ...goldText}}>السيارة الكهربائية</div>
            <Icon name="check-circle" size={70} /></div></Glass></In>
        <In at={T(6.32)} pop style={{marginTop: 40, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 46, color: '#fff', background: '#c0392b', padding: '8px 34px', borderRadius: 99, direction: 'rtl'}}>
            كلمات مشتركة: <span style={ltr}>0</span></div></In>
      </div>
      <Slam at={T(8.4)} out={T(9.6)} size={420} gold>؟</Slam>
      <Win a={T(10.33)} b={T(14.5)} from="pop" style={{top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 70, color: '#fff', textAlign: 'center', direction: 'rtl', lineHeight: 1.3, textShadow: '0 8px 30px #000'}}>
          الجواب رح يغيّر<br /><span style={goldText}>نظرتك للبحث كله</span></div></Win>
    </>;
  },
  // التعريف (بطاقة المتابعة فوق) — شبكة 30 يوم والسابع بيضوي
  intro: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const show = lerp(f, F(T(18.6)), F(T(19.6)));
    return <Center top={760}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 70px)', gap: 16, direction: 'rtl', opacity: show, transform: `scale(${0.8 + 0.2 * show})`}}>
        {Array.from({length: 30}).map((_, i) => {
          const done = i < 6; const me = i === 6; const lit = me && f > F(T(23.2));
          const k = sp(f - F(T(18.6)) - i * 1.2, 12, 220);
          return <div key={i} style={{width: 70, height: 70, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 30, ...ltr,
            transform: `scale(${Math.min(1, k) * (me ? 1 + 0.15 * Math.sin(f / 4) : 1)})`,
            background: done || lit ? 'linear-gradient(150deg,#FFF1C4,#E8C066 50%,#C9A24B)' : 'rgba(255,255,255,.06)', color: done || lit ? INK : 'rgba(255,255,255,.4)',
            border: me ? `4px solid ${GOLD_LT}` : '2px solid rgba(232,192,102,.25)', boxShadow: lit ? '0 0 50px rgba(255,214,110,.9)' : 'none'}}>{i + 1}</div>;
        })}
      </div>
      <In at={T(22.66)} pop style={{marginTop: 50}}><div style={{display: 'flex', alignItems: 'baseline', gap: 20, direction: 'rtl'}}>
        <span style={{fontWeight: 800, fontSize: 70, color: '#fff'}}>اليوم</span><span style={{fontWeight: 800, fontSize: 160, lineHeight: 1, ...goldText, ...ltr}}>07</span></div></In>
    </Center>;
  },
  // «جرّب هلأ: افتح أي ملف ودوّر على "مركبة"… الملف كله مليان "سيارة"… والنتيجة؟ صفر!»
  search: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const q = typed(f, 'مركبة', T(28.3), T(29.0));
    const zero = f > F(T(31.0));
    const docOut = lerp(f, F(T(32.6)), F(T(33.2)));
    const lines = ['اشتريت سيارة جديدة الأسبوع الماضي،', 'والسيارة بتمشي على الكهرباء.', 'صيانة السيارة سهلة ورخيصة،', 'وسيارة الشركة كمان كهربائية.'];
    return <>
      <div style={{position: 'absolute', top: 330, left: 80, right: 80, opacity: 1 - docOut, transform: `translateX(${docOut * -900}px) rotate(${docOut * -8}deg)`}}>
        <In at={T(24.0)} y={200}><div style={{transform: zero && f < F(T(31.0)) + 10 ? `translate(${(random('x' + f) - 0.5) * 40}px,${(random('y' + f) - 0.5) * 24}px)` : undefined}}>
          <div style={{background: '#fffaf0', borderRadius: 26, border: `4px solid ${GOLD_LT}`, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.6)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', background: '#e9dfc6', direction: 'rtl'}}>
              <Icon name="file-text" size={40} color={INK} /><span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 30, color: INK}}>ملف.docx</span></div>
            {f > F(T(27.4)) ? <div style={{display: 'flex', alignItems: 'center', gap: 14, margin: '18px 24px 0', padding: '10px 20px', borderRadius: 16, background: '#fff', border: `3px solid ${INK}`, direction: 'rtl'}}>
              <Icon name="magnifying-glass" size={40} color={INK} />
              <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 42, color: INK, flex: 1}}>{q}</span>
              {zero ? <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 34, color: '#fff', background: '#c0392b', borderRadius: 99, padding: '2px 20px'}}>0 من 0</span> : null}
            </div> : null}
            <div style={{padding: '24px 34px 34px', direction: 'rtl'}}>
              {lines.map((l, i) => <div key={i} style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 42, lineHeight: 1.75, color: '#3a2a12'}}>
                {l.split(/(سيارة|السيارة|وسيارة)/).map((p, k) => k % 2 ? <span key={k} style={{background: f > F(T(30.1)) ? 'rgba(232,192,102,.8)' : 'transparent', borderRadius: 8, padding: '0 6px'}}>{p}</span> : p)}</div>)}
            </div>
          </div></div></In>
      </div>
      <Slam at={T(31.94)} out={T(32.8)} size={330} color="#ff6b5e">صفر!</Slam>
      {/* حروف ≠ ، معنى ≈ */}
      <Win a={T(33.4)} b={T(37.4)} from="down" style={{top: 420, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
        {[['مركبة', 'سيارة']].map(([a, b]) => <React.Fragment key={a}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl'}}>
            {[a, b].map((w, j) => <React.Fragment key={w}>{j ? <div style={{fontWeight: 800, fontSize: 110, color: '#ff6b5e', fontFamily: 'Cairo'}}>≠</div> : null}
              <div style={{display: 'flex', gap: 8}}>{[...w].map((c, i) => <div key={i} style={{width: 86, height: 100, borderRadius: 18, background: '#fffaf0', border: `4px solid ${INK}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo', fontWeight: 800, fontSize: 60, color: INK}}>{c}</div>)}</div></React.Fragment>)}
          </div>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 48, color: '#ff6b5e', direction: 'rtl'}}>الحروف: مختلفة ✗</div>
          {f > F(T(36.6)) ? <In at={T(36.6)} pop><div style={{display: 'flex', alignItems: 'center', gap: 26, direction: 'rtl'}}>
            <Tile size={140} r={0.3}><Icon name="bus" size={96} weight="duotone" /></Tile>
            <span style={{fontWeight: 800, fontSize: 120, fontFamily: 'Cairo', ...goldText}}>≈</span>
            <Tile size={140} r={0.3}><Icon name="car-profile" size={96} weight="duotone" /></Tile></div>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 52, textAlign: 'center', marginTop: 16, ...goldText}}>المعنى: نفسه ✓</div></In> : null}
        </React.Fragment>)}
      </Win>
    </>;
  },
  // «خلينا نلعب لعبة سريعة… مين الغريب بينهم؟ صح… القطة!»
  game: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cards: [string, string, number, boolean][] = [['car-profile', 'السيارة الكهربائية توفر الوقود', 44.0, false], ['cat', 'القطة نايمة على الكنبة', 47.15, true], ['bus', 'المركبات الحديثة أقل تلويثًا', 49.54, false]];
    const kick = lerp(f, F(T(54.6)), F(T(55.6)));
    const cd = [[52.24, '3'], [52.85, '2'], [53.45, '1']] as const;
    const robot = f > F(T(57.0));
    return <>
      <Win a={T(38.85)} b={T(56.8)} from="up" style={{top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pill size={50}><Icon name="game-controller" size={52} color={INK} />لعبة: مين الغريب؟</Pill></Win>
      <div style={{position: 'absolute', top: 500, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, opacity: robot ? lerp(f, F(T(57.0)), F(T(57.5)), 1, 0) : 1}}>
        {cards.map(([ic, tx, t, odd]) => {
          const k = sp(f - F(T(t)), 11, 200); if (f < F(T(t))) return <div key={tx} style={{height: 136}} />;
          const isOdd = odd && f > F(T(54.12));
          return <div key={tx} style={{opacity: Math.min(1, k * 2), transform: `translateX(${(1 - Math.min(1, k)) * (odd ? -600 : 600)}px) ${odd ? `translate(${kick * -900}px,${kick * -300}px) rotate(${kick * -40}deg)` : ''}`}}>
            <SentenceCard icon={ic} text={tx} odd={isOdd} /></div>;
        })}
      </div>
      {cd.map(([t, n], i) => <Slam key={n} at={T(t)} out={T(cd[i + 1]?.[0] ?? 54.0) - 0.05} size={360} gold>{n}</Slam>)}
      <Slam at={T(54.12)} out={T(55.4)} size={200} y={-120} color="#ff6b5e">القطة!</Slam>
      {robot ? <Center top={470}>
        <In at={T(57.14)} pop><Robot size={330} mood={f > F(T(59.67)) ? 'happy' : 'blank'} /></In>
        <In at={T(58.5)} style={{marginTop: 30}}><Pill dark size={48}><Icon name="graduation-cap" size={48} />نعلّم الكمبيوتر</Pill></In>
      </Center> : null}
    </>;
  },
  // «السر اسمه… الإمبِدنغز»
  secret: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Slam at={T(60.72)} out={T(62.4)} size={240}>السر…</Slam>
      <Slam at={T(62.54)} out={T(64.3)} size={160} color="#9fd0f5">اسمه</Slam>
      <Slam at={T(64.49)} size={150} gold><span style={ltr}>Embeddings</span></Slam>
      <Win a={T(64.8)} b={T(66.2)} from="down" style={{top: 1040, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 60, color: '#fff'}}>إمبِدنغز</div></Win>
    </>;
  },
  // «تخيّل خريطة ضخمة… كل جملة إلها بيت… الجيران… والقطة بحي ثاني خالص»
  map: ({t0}) => {
    const T = (s: number) => s - t0;
    const tags: [number, number, string, string][] = [[66.28, 68.5, 'map-trifold', 'خريطة ضخمة'], [68.57, 70.6, 'house-line', 'كل جملة = بيت'], [70.72, 74.0, 'users-three', 'المعنى قريب = جيران'],
      [74.14, 76.8, 'car-profile', 'سيارة ومركبة: نفس الشارع'], [76.86, 80.3, 'cat', 'القطة: حي ثاني خالص']];
    return <>{tags.map(([a, b, ic, tx]) => <Win key={tx} a={T(a)} b={T(b)} from="up" style={{top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Pill size={50}><Icon name={ic} size={52} color={INK} />{tx}</Pill></Win>)}</>;
  },
  // «والعنوان مش رقمين… لا، 768 رقم!»
  address: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const rain = f > F(T(84.5));
    const n = Math.round(lerp(f, F(T(84.65)), F(T(85.8)), 2, 768));
    return <>
      <Win a={T(80.4)} b={T(84.5)} from="pop" style={{top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Glass style={{padding: '24px 40px', direction: 'rtl', textAlign: 'center'}}>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#9fd0f5'}}>عنوان البيت</div>
          <div style={{position: 'relative', fontFamily: 'monospace', fontWeight: 800, fontSize: 80, color: '#fff', marginTop: 6, ...ltr}}>(0.42, -0.17)
            {f > F(T(84.25)) ? <div style={{position: 'absolute', left: -20, right: -20, top: '50%', height: 14, background: '#ff6b5e', transform: 'rotate(-8deg)', borderRadius: 8}} /> : null}</div>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 38, color: GOLD_LT, marginTop: 6}}>رقمين؟</div>
        </Glass></Win>
      {rain ? <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
        {Array.from({length: 26}).map((_, c) => {
          const sp2 = 18 + random('sp' + c) * 26; const off = random('of' + c) * 1900;
          return <div key={c} style={{position: 'absolute', left: c * 42, top: ((f - F(T(84.5))) * sp2 + off) % 2300 - 400, fontFamily: 'monospace', fontWeight: 700, fontSize: 30, lineHeight: 1.25,
            color: c % 3 ? 'rgba(232,192,102,.85)' : 'rgba(159,208,245,.8)', width: 40, textAlign: 'center', ...ltr}}>
            {Array.from({length: 16}).map((_, r) => <div key={r} style={{opacity: 1 - r / 16}}>{(random(`d${c}-${r}`) * 2 - 1).toFixed(1).replace('0.', '.')}</div>)}</div>;
        })}
      </AbsoluteFill> : null}
      {rain ? <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: -80}}>
        <div style={{background: 'rgba(2,3,6,.75)', borderRadius: 50, padding: '20px 70px', border: `5px solid ${GOLD_LT}`, textAlign: 'center', boxShadow: '0 0 100px rgba(232,192,102,.5)'}}>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 260, lineHeight: 1.05, ...goldText, ...ltr}}>{n}</div>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 80, color: '#fff'}}>رقم!</div></div>
      </AbsoluteFill> : null}
    </>;
  },
  // «يلا عملي: VS Code، نموذج Embeddings بيفهم 100 لغة، FAISS من Meta، وبحفظ الخريطة»
  code: ({t0}) => {
    const T = (s: number) => s - t0;
    const steps: [number, React.ReactNode, string][] = [
      [92.1, <Logo name="huggingface" size={64} />, 'multilingual-e5'], [93.92, <Icon name="globe-hemisphere-east" size={64} />, '~100 لغة'],
      [96.14, <Icon name="map-pin-line" size={64} />, 'جملة ← عنوان'], [101.36, <Logo name="meta" size={64} />, 'FAISS'],
      [103.5, <Icon name="crosshair" size={64} />, 'أقرب جار'], [105.64, <Icon name="floppy-disk" size={64} />, 'index/']];
    return <>
      <Center top={290}>
        <In at={T(88.0)} y={-100}><Pill dark size={42}><Icon name="lightning" size={42} />يلا عملي</Pill></In>
        <In at={T(88.82)} style={{marginTop: 26}}><Code title="VS Code — day-07/app.py" from={T(89.2)} to={T(100.5)} hl="multilingual-e5-base" lines={[
          'emb = HuggingFaceEmbeddings(model_name=',
          '  "intfloat/multilingual-e5-base")',
          'docs = [Document(page_content=t) for t in [',
          '  "السيارة الكهربائية توفر الوقود",',
          '  "القطة نائمة على الأريكة",',
          '  "المركبات الحديثة أقل تلويثًا"]]',
          'db = FAISS.from_documents(docs, emb)',
          'db.save_local("index")']} /></In>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 290px)', gap: 18, marginTop: 30, direction: 'rtl'}}>
          {steps.map(([t, ic, l]) => <In key={l} at={T(t)} pop><Glass style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 24}}>
            {ic}<span style={{fontWeight: 800, fontSize: 32, color: '#fff', whiteSpace: 'nowrap', ...ltr}}>{l}</span></Glass></In>)}
        </div>
      </Center>
    </>;
  },
  // «بشغّل وبسأل… الأولى… الثانية… والقطة؟ ضلّت نايمة، ما حدا جابها»
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cmd = typed(f, '$ python day-07/app.py', T(110.1), T(111.0));
    const z = f > F(T(123.38));
    return <>
      <Win a={T(110.0)} b={T(122.0)} from="up" style={{top: 290, left: 70, right: 70}}>
        <Glass style={{padding: '20px 30px', ...ltr}}>
          <div style={{fontFamily: 'monospace', fontSize: 32, color: GOLD_LT}}>{cmd}</div>
          <div style={{fontFamily: 'monospace', fontSize: 28, color: '#9fd0f5', marginTop: 6}}>{f > F(T(111.89)) ? 'similarity_search("مركبة صديقة للبيئة", k=2)' : ''}</div>
          {[[115.25, 'السيارة الكهربائية توفر الوقود'], [118.75, 'المركبات الحديثة أقل تلويثًا']].map(([t, s], i) => f > F(T(t as number)) ?
            <In key={i} at={T(t as number)} x={-80} y={0}><div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#fff', direction: 'rtl', textAlign: 'right', marginTop: 8}}>
              <span style={{...goldText, ...ltr}}>{i + 1}</span> — {s}</div></In> : null)}
        </Glass></Win>
      {z ? <Win a={T(123.38)} b={T(125.3)} from="pop" style={{top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Pill dark size={50}><Icon name="moon-stars" size={50} />ضلّت نايمة… Zzz</Pill></Win> : null}
    </>;
  },
  // «الخلاصة: الكمبيوتر ما بيفهم الكلام… بس بيفهم المسافة بين المعاني»
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={45} />
      <Center top={300}>
        <In at={0} y={-60}><Pill size={42}><Icon name="sparkle" size={40} color={INK} />الخلاصة</Pill></In>
        <In at={T(126.94)} style={{marginTop: 40}}><div style={{fontWeight: 800, fontSize: 84, color: '#fff', direction: 'rtl', textAlign: 'center', lineHeight: 1.3, textShadow: '0 8px 30px #000'}}>
          الكمبيوتر <span style={{color: '#ff6b5e'}}>ما بيفهم</span> الكلام…</div></In>
      </Center>
      <Center top={1000}>
        <In at={T(129.04)} pop><div style={{background: 'rgba(2,3,6,.8)', border: `4px solid ${GOLD_LT}`, borderRadius: 36, padding: '18px 44px', textAlign: 'center', direction: 'rtl'}}>
          <div style={{fontWeight: 800, fontSize: 64, color: '#fff'}}>بس بيفهم</div>
          <div style={{fontWeight: 800, fontSize: 96, lineHeight: 1.2, ...goldText}}>المسافة بين المعاني</div></div></In>
      </Center>
    </>;
  },
  // «وهيك صار عنّا خريطة معاني لملفاتنا. الكود على جيت هَب»
  save: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Center top={400}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl'}}>
        <In at={T(133.0)} pop><Tile size={190} r={0.3}><Icon name="files" size={120} weight="duotone" /></Tile></In>
        <In at={T(134.3)} pop><Icon name="arrow-left" size={80} weight="bold" /></In>
        <In at={T(134.34)} pop><Tile size={190} r={0.3}><Icon name="map-trifold" size={120} weight="duotone" /></Tile></In>
      </div>
      <In at={T(134.84)} style={{marginTop: 30}}><div style={{fontWeight: 800, fontSize: 70, color: '#fff', direction: 'rtl'}}>خريطة <span style={goldText}>معاني</span> لملفاتك</div></In>
      <In at={T(136.37)} pop style={{marginTop: 60}}><Glass style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 36px', direction: 'rtl'}}>
        <Logo name="github" size={70} /><span style={{fontWeight: 800, fontSize: 48, color: '#fff'}}>الكود كامل · الرابط بأول تعليق</span></Glass></In>
    </Center>;
  },
  // «جرّبت نماذج إمبِدنغز عربية قبل؟ أي واحد كان أحسن معك؟»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const M: [string, number][] = [['multilingual-e5', 142.34], ['bge-m3', 143.09], ['LaBSE', 143.55], ['؟؟؟', 144.42]];
    return <Center top={360}>
      <In at={T(140.66)} pop><div style={{fontWeight: 800, fontSize: 76, color: '#fff', direction: 'rtl', textAlign: 'center', lineHeight: 1.3}}>جرّبت نماذج<br /><span style={goldText}>إمبِدنغز عربية</span>؟</div></In>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22, marginTop: 50, width: 900}}>
        {M.map(([m, t], i) => <In key={m} at={T(t)} pop rot={i % 2 ? 12 : -12}><Glass style={{padding: '12px 32px', borderRadius: 99}}>
          <span style={{fontWeight: 800, fontSize: 46, color: GOLD_LT, ...ltr}}>{m}</span></Glass></In>)}
      </div>
      <In at={T(146.2)} pop style={{marginTop: 50}}><Pill size={52}><Icon name="chat-circle-dots" size={52} color={INK} />اكتبلي بالتعليقات</Pill></In>
    </Center>;
  },
  // «وتابعني، لأنه بكرة ملفاتك رح تحكي معك!»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = F(T(147.6)); const pressed = f > click && f < click + 8;
    return <Center top={380}>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 100, padding: '6px 76px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${lerp(f, 0, click, 140, 0)}px,${lerp(f, 0, click, 140, 0)}px)`}}><Icon name="hand-pointing" size={120} color="#fff" /></div>
      </div></In>
      <In at={T(148.38)} style={{marginTop: 100}}><Glass style={{width: 820, padding: '26px 40px', direction: 'rtl'}}>
        <div style={{fontWeight: 800, fontSize: 42, color: '#9fd0f5'}}>بكرة: اليوم <span style={ltr}>8</span></div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 10}}>
          <Tile size={110} r={0.3}><Icon name="file-text" size={70} weight="duotone" /></Tile>
          <div style={{fontWeight: 800, fontSize: 56, color: '#fff'}}>ملفاتك <span style={goldText}>بتحكي معك!</span></div>
          <Icon name="chat-circle-dots" size={70} /></div>
      </Glass></In>
    </Center>;
  },
  signature: ({t0}) => <Signature T={(s) => s - t0} a={151.79} b={152.93} />,
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
