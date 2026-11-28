import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {CAR, CarDay} from './carouselData';

// كاروسيلات الأيام 6-30: كل يوم «عالم» تصميم مختلف (25 عالم) بنفس البراند: أسود/ذهبي/سماوي، خط Cairo، صورة محمد.
// العالم = خلفية وزخارف خاصة + أسلوب غلاف + أسلوب خطوات + أسلوب نتيجة + أسلوب تظليل.
export const CAR_W = 1080, CAR_H = 1440, CAR_N = 7;
const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};
const SKY = '#8ec5f0', SKY_D = '#2c6aa8';
const GG = 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B 75%,#8F6A1F)';

type Cover = 'stack' | 'poster' | 'split' | 'badge';
type Steps = 'track' | 'grid' | 'chips' | 'ladder';
type Res = 'term' | 'receipt' | 'card';
type HLs = 'box' | 'marker' | 'underline' | 'gold' | 'circle';
type Theme = {
  name: string; dark: boolean; Bg: React.FC<{n: number}>; cover: Cover; steps: Steps; res: Res; hl: HLs;
  card?: React.CSSProperties; kicker?: 'pill' | 'stamp' | 'tape' | 'mono' | 'label'; accent?: string;
};

// ── أدوات رسم صغيرة ──
const Abs: React.FC<{s: React.CSSProperties; children?: React.ReactNode}> = ({s, children}) => <div style={{position: 'absolute', ...s}}>{children}</div>;
const Grid: React.FC<{c: string; s: number; w?: number; c2?: string; s2?: number}> = ({c, s, w = 2, c2, s2}) => (
  <AbsoluteFill style={{backgroundImage: [`linear-gradient(${c} ${w}px, transparent ${w}px)`, `linear-gradient(90deg, ${c} ${w}px, transparent ${w}px)`,
    ...(c2 ? [`linear-gradient(${c2} 1px, transparent 1px)`, `linear-gradient(90deg, ${c2} 1px, transparent 1px)`] : [])].join(','),
    backgroundSize: [`${s}px ${s}px`, `${s}px ${s}px`, ...(c2 ? [`${s2}px ${s2}px`, `${s2}px ${s2}px`] : [])].join(',')}} />
);
const Dots: React.FC<{c: string; s: number; r?: number}> = ({c, s, r = 2}) => (
  <AbsoluteFill style={{backgroundImage: `radial-gradient(${c} ${r}px, transparent ${r + 0.6}px)`, backgroundSize: `${s}px ${s}px`}} />
);
const Ic: React.FC<{n: string; s: number; c?: string; w?: 'fill' | 'duotone' | 'thin' | 'bold'; st?: React.CSSProperties}> = ({n, s, c = 'gold', w = 'duotone', st}) => <Icon name={n} size={s} color={c} weight={w} style={st} />;

// ── 25 خلفية ──
const BG: Record<string, React.FC<{n: number}>> = {
  mat: () => <><AbsoluteFill style={{background: '#efe9d8'}} /><Grid c="rgba(143,106,31,.22)" s={200} w={3} c2="rgba(143,106,31,.12)" s2={40} />
    <Abs s={{top: 0, left: 0, right: 0, height: 64, background: '#1a1712', borderBottom: `4px solid ${GOLD_LT}`}}>
      {Array.from({length: 55}).map((_, i) => <div key={i} style={{position: 'absolute', left: 10 + i * 20, top: 0, width: 2, height: i % 5 ? 18 : 34, background: GOLD_LT}} />)}</Abs>
    <svg width="1080" height="1440" style={{position: 'absolute', inset: 0}}><path d="M-20 1180 L1100 980" stroke={INK} strokeWidth="4" strokeDasharray="22 16" opacity=".35" /></svg>
    <Abs s={{right: 40, bottom: 120, transform: 'rotate(-30deg)', opacity: 0.18}}><Ic n="scissors" s={260} c={INK} w="fill" /></Abs></>,
  nightmap: () => <><AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 30%,#13213b 0,#070b14 65%)'}} />
    <Grid c="rgba(232,192,102,.12)" s={160} w={2} c2="rgba(142,197,240,.06)" s2={40} />
    <svg width="1080" height="1440" style={{position: 'absolute', inset: 0}}><path d="M0 900 C 300 820, 600 1000, 1080 860" stroke="rgba(232,192,102,.45)" strokeWidth="14" fill="none" />
      <path d="M700 0 C 650 400, 820 900, 760 1440" stroke="rgba(232,192,102,.35)" strokeWidth="10" fill="none" />
      {[[180, 300], [880, 520], [300, 1180], [940, 1250]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="60" fill="rgba(232,192,102,.12)" /><circle cx={x} cy={y} r="10" fill={GOLD_LT} /></g>)}</svg></>,
  casefile: () => <><AbsoluteFill style={{background: '#e7d6a8'}} /><AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.5),transparent 60%)'}} />
    <Abs s={{top: 0, right: 120, width: 360, height: 70, background: '#d9c48e', borderRadius: '0 0 24px 24px', boxShadow: 'inset 0 -4px 0 rgba(0,0,0,.08)'}} />
    <Abs s={{top: 30, left: 70, width: 40, height: 130, border: '7px solid #8a8a8a', borderRadius: 30}} />
    <Abs s={{bottom: 150, left: 50, transform: 'rotate(-14deg)', border: '6px solid rgba(143,106,31,.45)', color: 'rgba(143,106,31,.5)', fontFamily: 'Cairo', fontWeight: 800, fontSize: 70, padding: '0 26px', borderRadius: 14}}>سري</Abs></>,
  noir: () => <><AbsoluteFill style={{background: '#050505'}} />
    <AbsoluteFill style={{background: 'conic-gradient(from 150deg at 15% -5%, transparent 0deg, rgba(232,192,102,.22) 18deg, rgba(232,192,102,.05) 40deg, transparent 50deg)'}} />
    <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,.03) 0 2px, transparent 2px 14px)'}} />
    <Abs s={{right: -90, bottom: 60, width: 380, height: 380, borderRadius: '50%', border: `22px solid rgba(232,192,102,.25)`}} />
    <Abs s={{right: -150, bottom: -60, width: 46, height: 230, background: 'rgba(232,192,102,.25)', transform: 'rotate(-45deg)', borderRadius: 20}} /></>,
  library: () => <><AbsoluteFill style={{background: '#f6f0e1'}} />
    <Abs s={{bottom: 0, left: 0, right: 0, height: 110, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 20px', borderTop: `6px solid ${INK}`}}>
      {Array.from({length: 34}).map((_, i) => <div key={i} style={{width: 24 + random('b' + i) * 18, height: 60 + random('h' + i) * 46, background: ['#1a1712', GOLD, '#8F6A1F', '#3a2a12', GOLD_LT][i % 5], borderRadius: '4px 4px 0 0'}} />)}</Abs>
    <Abs s={{top: 0, bottom: 110, left: 54, width: 3, background: GOLD, opacity: 0.5}} /></>,
  trace: () => <><AbsoluteFill style={{background: '#06090d'}} /><AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(142,197,240,.04) 0 2px, transparent 2px 6px)'}} />
    <Abs s={{top: 170, bottom: 120, left: 52, width: 4, background: `linear-gradient(${GOLD_LT},rgba(232,192,102,.1))`}} />
    {[0, 1, 2, 3, 4, 5].map((i) => <Abs key={i} s={{left: 40, top: 220 + i * 190, width: 28, height: 28, borderRadius: '50%', background: '#06090d', border: `5px solid ${i % 2 ? SKY : GOLD_LT}`}} />)}</>,
  exam: () => <><AbsoluteFill style={{background: '#fdfcf8'}} /><AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 62px, rgba(44,106,168,.18) 62px 65px)'}} />
    <Abs s={{top: 0, bottom: 0, right: 110, width: 4, background: GOLD}} />
    <Abs s={{bottom: 150, left: 60, width: 190, height: 190, borderRadius: '50%', border: `8px solid ${GOLD}`, transform: 'rotate(-12deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo', fontWeight: 800, fontSize: 90, color: GOLD, opacity: 0.55, ...ltr}}>A+</Abs></>,
  pitch: () => <><AbsoluteFill style={{background: 'linear-gradient(#0b120c,#050805)'}} /><AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 120px, transparent 120px 240px)'}} />
    <svg width="1080" height="1440" style={{position: 'absolute', inset: 0}} fill="none" stroke="rgba(232,192,102,.35)" strokeWidth="5">
      <rect x="40" y="40" width="1000" height="1360" /><line x1="40" y1="720" x2="1040" y2="720" /><circle cx="540" cy="720" r="150" /><rect x="290" y="40" width="500" height="200" /><rect x="290" y="1200" width="500" height="200" /></svg></>,
  fight: () => <><AbsoluteFill style={{background: '#f3e9d2'}} /><Dots c="rgba(17,17,17,.12)" s={14} r={2.4} />
    <Abs s={{top: -300, left: -900, width: 1000, height: 2400, background: INK, transform: 'rotate(18deg)'}} />
    <Abs s={{top: -300, left: 130, width: 40, height: 2400, background: GOLD, transform: 'rotate(18deg)'}} />
    {[[860, 1240], [950, 1330], [800, 1350]].map(([x, y], i) => <Abs key={i} s={{left: x, top: y}}><Ic n="star" s={50 + i * 10} c={GOLD} w="fill" /></Abs>)}</>,
  cockpit: () => <><AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 120%,#1c1a14 0,#060606 60%)'}} />
    {[[-110, 1120, 360], [860, 1180, 300], [880, -90, 260]].map(([x, y, s], i) => <Abs key={i} s={{left: x, top: y, width: s, height: s, borderRadius: '50%', border: `8px solid rgba(232,192,102,.3)`,
      background: `repeating-conic-gradient(rgba(232,192,102,.35) 0deg 2deg, transparent 2deg 15deg)`, WebkitMaskImage: 'radial-gradient(circle, transparent 60%, #000 61%)'}} />)}
    <Abs s={{left: 0, right: 0, bottom: 0, height: 10, background: `linear-gradient(90deg,transparent,${GOLD_LT},transparent)`}} /></>,
  blueprint: () => <><AbsoluteFill style={{background: '#1f5a94'}} /><Grid c="rgba(255,255,255,.18)" s={180} w={2} c2="rgba(255,255,255,.08)" s2={36} />
    {[[40, 40], [1000, 40], [40, 1360], [1000, 1360]].map(([x, y], i) => <Abs key={i} s={{left: x, top: y, width: 40, height: 40, borderTop: i < 2 ? '4px solid rgba(255,255,255,.7)' : 'none', borderBottom: i > 1 ? '4px solid rgba(255,255,255,.7)' : 'none', borderLeft: i % 2 ? 'none' : '4px solid rgba(255,255,255,.7)', borderRight: i % 2 ? '4px solid rgba(255,255,255,.7)' : 'none'}} />)}</>,
  metro: () => <><AbsoluteFill style={{background: '#08080a'}} />
    <svg width="1080" height="1440" style={{position: 'absolute', inset: 0}} fill="none" strokeLinecap="round" strokeWidth="18">
      <path d="M-20 300 H 420 Q 500 300 540 380 L 760 820 Q 800 900 880 900 H 1100" stroke="rgba(232,192,102,.55)" />
      <path d="M200 -20 V 600 Q 200 680 280 700 L 700 1150 Q 740 1200 820 1200 H 1100" stroke="rgba(142,197,240,.45)" />
      <path d="M-20 1300 H 300 Q 380 1300 420 1240 L 640 900" stroke="rgba(255,255,255,.18)" />
      {[[420, 300], [760, 820], [200, 600], [700, 1150], [640, 900]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="22" fill="#08080a" stroke="#fff" strokeWidth="8" />)}</svg></>,
  ticket: () => <><AbsoluteFill style={{background: '#e8eef4'}} />
    <Abs s={{inset: 40, borderRadius: 40, background: '#fffdf6', boxShadow: '0 20px 50px rgba(0,0,0,.12)'}} />
    <Abs s={{left: 40, right: 40, top: 1180, borderTop: '5px dashed #c7b98f'}} />
    {[-1, 1].map((s) => <Abs key={s} s={{top: 1150, [s < 0 ? 'left' : 'right']: 10, width: 60, height: 60, borderRadius: '50%', background: '#e8eef4'}} />)}
    <Abs s={{left: 100, bottom: 70, display: 'flex', gap: 5, height: 80, alignItems: 'stretch'}}>{Array.from({length: 40}).map((_, i) => <div key={i} style={{width: random('bc' + i) > 0.5 ? 6 : 3, background: INK}} />)}</Abs></>,
  office: () => <><AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%,#221a12 0,#0a0806 70%)'}} />
    <Abs s={{inset: 34, border: `3px solid ${GOLD}`, borderRadius: 12}} /><Abs s={{inset: 50, border: '1px solid rgba(232,192,102,.5)', borderRadius: 8}} />
    <Abs s={{right: 60, bottom: 130, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#e8c066,#8F6A1F)', boxShadow: '0 10px 30px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Ic n="seal-check" s={90} c={INK} w="fill" /></Abs></>,
  newsprint: () => <><AbsoluteFill style={{background: '#efeadf'}} /><Dots c="rgba(0,0,0,.05)" s={6} r={1} />
    <Abs s={{top: 150, left: 70, right: 70, borderTop: `6px double ${INK}`}} />
    {[360, 720].map((x) => <Abs key={x} s={{top: 170, bottom: 120, left: x, width: 1, background: 'rgba(17,17,17,.15)'}} />)}</>,
  sorter: () => <><AbsoluteFill style={{background: '#0d0d0d'}} />
    {[0, 1].map((k) => <Abs key={k} s={{left: 0, right: 0, [k ? 'bottom' : 'top']: 0, height: 34, background: `repeating-linear-gradient(45deg, ${GOLD} 0 30px, ${INK} 30px 60px)`}} />)}
    <Abs s={{left: 0, right: 0, bottom: 150, height: 70, background: 'linear-gradient(#2a2a2a,#151515)', borderTop: `4px solid ${GOLD}`}}>
      {Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: i * 80 + 20, top: 18, width: 34, height: 34, borderRadius: '50%', border: '4px solid #444'}} />)}</Abs></>,
  kraft: () => <><AbsoluteFill style={{background: '#d6b585'}} /><AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(8deg, rgba(0,0,0,.025) 0 3px, transparent 3px 9px)'}} />
    <Abs s={{top: -20, left: 380, width: 320, height: 130, background: 'rgba(240,226,190,.75)', transform: 'rotate(-3deg)'}} />
  </>,
  tailor: () => <><AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 30%,#2a1d14 0,#100b07 70%)'}} />
    <Abs s={{inset: 40, border: `4px dashed ${GOLD}`, borderRadius: 30}} />
    <Abs s={{top: 0, bottom: 0, left: 0, width: 46, background: '#e9d9a6', display: 'flex', flexDirection: 'column'}}>
      {Array.from({length: 72}).map((_, i) => <div key={i} style={{height: 20, borderBottom: `2px solid ${INK}`, width: i % 5 ? 16 : 32}} />)}</Abs></>,
  lab: () => <><AbsoluteFill style={{background: '#fbfdff'}} /><Grid c="rgba(44,106,168,.2)" s={100} w={2} c2="rgba(44,106,168,.08)" s2={20} />
    <Abs s={{right: 60, bottom: 120, width: 200, height: 200, background: '#ffe9a6', transform: 'rotate(5deg)', boxShadow: '0 10px 20px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Ic n="flask" s={110} c={INK} /></Abs></>,
  vault: () => <><AbsoluteFill style={{background: 'radial-gradient(circle at 80% 85%,#2b2b2b 0,#0b0b0b 55%)'}} />
    {[520, 400, 300].map((s, i) => <Abs key={s} s={{right: 760 - 860 - s / 2 + 600, bottom: -s / 2 + 120, width: s, height: s, borderRadius: '50%', border: `${10 - i * 2}px solid rgba(232,192,102,${0.3 - i * 0.06})`}} />)}
    {Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <Abs key={i} s={{right: 260 - 30 + Math.cos(a) * 200 - 260 + 200, bottom: 120 - 20 + Math.sin(a) * 200, width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#e8c066,#5a4416)'}} />; })}</>,
  phone: () => <><AbsoluteFill style={{background: 'linear-gradient(170deg,#dff0ff 0,#bfe0fb 50%,#fff3d6 100%)'}} />
    <Abs s={{inset: '30px 46px', borderRadius: 90, border: `14px solid ${INK}`, boxShadow: '0 30px 60px rgba(0,0,0,.2)'}} />
    <Abs s={{top: 44, left: 420, width: 240, height: 40, borderRadius: 30, background: INK}} /></>,
  space: () => <><AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 20%,#141a2e 0,#04050a 70%)'}} />
    {Array.from({length: 90}).map((_, i) => <Abs key={i} s={{left: random('x' + i) * 1080, top: random('y' + i) * 1440, width: 2 + random('s' + i) * 3, height: 2 + random('s' + i) * 3, borderRadius: '50%', background: random('c' + i) > 0.7 ? GOLD_LT : '#fff', opacity: 0.3 + random('o' + i) * 0.6}} />)}
    <Abs s={{right: -160, top: -140, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%,#e8c066,#5a4416 70%)', opacity: 0.55}} />
    <Abs s={{right: -300, top: 60, width: 780, height: 200, borderRadius: '50%', border: '6px solid rgba(232,192,102,.4)', transform: 'rotate(-18deg)'}} /></>,
  nodes: () => <><AbsoluteFill style={{background: '#f4f5f8'}} /><Dots c="rgba(17,17,17,.14)" s={30} r={2} />
    <svg width="1080" height="1440" style={{position: 'absolute', inset: 0, opacity: 0.5}} fill="none" stroke="rgba(201,162,75,.6)" strokeWidth="6">
      <path d="M120 1240 C 300 1240, 300 1120, 480 1120" /><path d="M600 1120 C 780 1120, 780 1260, 960 1260" /></svg>
    {[[40, 1200], [480, 1080], [900, 1220]].map(([x, y], i) => <Abs key={i} s={{opacity: 0.45, left: x, top: y, width: 120, height: 80, borderRadius: 18, background: '#fff', border: `4px solid ${i === 1 ? GOLD : '#c9ccd4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Ic n={['envelope-simple', 'brain', 'table'][i]} s={44} c={INK} /></Abs>)}</>,
  control: () => <><AbsoluteFill style={{background: '#070809'}} />
    <Grid c="rgba(142,197,240,.08)" s={270} w={3} />
    <Abs s={{left: 0, right: 0, top: 120, height: 3, background: `linear-gradient(90deg,transparent,${SKY},transparent)`, opacity: 0.6}} />
    <svg width="1080" height="160" style={{position: 'absolute', left: 0, bottom: 110, opacity: 0.5}}><polyline fill="none" stroke={GOLD_LT} strokeWidth="5"
      points={Array.from({length: 40}).map((_, i) => `${i * 28},${80 + (i % 7 === 3 ? -60 : i % 7 === 4 ? 50 : (random('p' + i) - 0.5) * 20)}`).join(' ')} /></svg></>,
  certificate: () => <><AbsoluteFill style={{background: '#fbf6e8'}} />
    <Abs s={{inset: 30, border: `10px solid ${GOLD}`}} /><Abs s={{inset: 54, border: `3px solid ${GOLD}`}} />
    {[[30, 30], [1010, 30], [30, 1370], [1010, 1370]].map(([x, y], i) => <Abs key={i} s={{left: x - 20, top: y - 20, width: 80, height: 80, background: GG, borderRadius: '50%', border: `4px solid ${INK}`}} />)}
    <Abs s={{left: 90, bottom: 110, width: 170, height: 170, borderRadius: '50%', background: GG, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(0,0,0,.2)'}}>
      <Ic n="trophy" s={96} c={INK} w="fill" /></Abs></>,
};

// العالم لكل يوم (فاتح للأيام الزوجية وداكن للفردية عشان شبكة إنستغرام تتبادل)
const T: Record<number, Theme> = {
  6: {name: 'mat', dark: false, Bg: BG.mat, cover: 'poster', steps: 'ladder', res: 'receipt', hl: 'marker', kicker: 'tape'},
  7: {name: 'nightmap', dark: true, Bg: BG.nightmap, cover: 'badge', steps: 'track', res: 'term', hl: 'gold', kicker: 'pill'},
  8: {name: 'casefile', dark: false, Bg: BG.casefile, cover: 'split', steps: 'grid', res: 'card', hl: 'box', kicker: 'stamp'},
  9: {name: 'noir', dark: true, Bg: BG.noir, cover: 'stack', steps: 'chips', res: 'term', hl: 'circle', kicker: 'mono'},
  10: {name: 'library', dark: false, Bg: BG.library, cover: 'stack', steps: 'track', res: 'card', hl: 'underline', kicker: 'label'},
  11: {name: 'trace', dark: true, Bg: BG.trace, cover: 'split', steps: 'ladder', res: 'term', hl: 'box', kicker: 'mono'},
  12: {name: 'exam', dark: false, Bg: BG.exam, cover: 'badge', steps: 'grid', res: 'receipt', hl: 'circle', kicker: 'stamp'},
  13: {name: 'pitch', dark: true, Bg: BG.pitch, cover: 'poster', steps: 'chips', res: 'card', hl: 'gold', kicker: 'pill'},
  14: {name: 'fight', dark: false, Bg: BG.fight, cover: 'poster', steps: 'ladder', res: 'term', hl: 'box', kicker: 'stamp'},
  15: {name: 'cockpit', dark: true, Bg: BG.cockpit, cover: 'badge', steps: 'grid', res: 'term', hl: 'underline', kicker: 'label'},
  16: {name: 'blueprint', dark: true, Bg: BG.blueprint, cover: 'split', steps: 'track', res: 'card', hl: 'marker', kicker: 'mono', accent: '#fff'},
  17: {name: 'metro', dark: true, Bg: BG.metro, cover: 'stack', steps: 'track', res: 'term', hl: 'gold', kicker: 'pill'},
  18: {name: 'ticket', dark: false, Bg: BG.ticket, cover: 'split', steps: 'chips', res: 'receipt', hl: 'box', kicker: 'label'},
  19: {name: 'office', dark: true, Bg: BG.office, cover: 'badge', steps: 'ladder', res: 'card', hl: 'gold', kicker: 'stamp'},
  20: {name: 'newsprint', dark: false, Bg: BG.newsprint, cover: 'poster', steps: 'grid', res: 'card', hl: 'underline', kicker: 'label'},
  21: {name: 'sorter', dark: true, Bg: BG.sorter, cover: 'stack', steps: 'chips', res: 'receipt', hl: 'box', kicker: 'tape'},
  22: {name: 'kraft', dark: false, Bg: BG.kraft, cover: 'split', steps: 'ladder', res: 'card', hl: 'marker', kicker: 'tape'},
  23: {name: 'tailor', dark: true, Bg: BG.tailor, cover: 'poster', steps: 'track', res: 'term', hl: 'gold', kicker: 'label'},
  24: {name: 'lab', dark: false, Bg: BG.lab, cover: 'badge', steps: 'grid', res: 'term', hl: 'circle', kicker: 'mono'},
  25: {name: 'vault', dark: true, Bg: BG.vault, cover: 'split', steps: 'ladder', res: 'term', hl: 'box', kicker: 'stamp'},
  26: {name: 'phone', dark: false, Bg: BG.phone, cover: 'stack', steps: 'chips', res: 'card', hl: 'gold', kicker: 'pill'},
  27: {name: 'space', dark: true, Bg: BG.space, cover: 'poster', steps: 'track', res: 'card', hl: 'underline', kicker: 'pill'},
  28: {name: 'nodes', dark: false, Bg: BG.nodes, cover: 'badge', steps: 'chips', res: 'term', hl: 'box', kicker: 'mono'},
  29: {name: 'control', dark: true, Bg: BG.control, cover: 'split', steps: 'grid', res: 'term', hl: 'marker', kicker: 'mono'},
  30: {name: 'certificate', dark: false, Bg: BG.certificate, cover: 'badge', steps: 'track', res: 'card', hl: 'gold', kicker: 'label'},
};

// ── أدوات المحتوى حسب العالم ──
const useTok = (t: Theme) => ({fg: t.dark ? '#fff' : INK, sub: t.dark ? '#d9cfb3' : '#5b4a2a', acc: t.accent ?? (t.dark ? GOLD_LT : '#8F6A1F'),
  card: t.card ?? (t.dark ? {background: 'rgba(14,14,16,.82)', border: `3px solid ${GOLD_LT}`, borderRadius: 30, boxShadow: '0 24px 60px rgba(0,0,0,.5)'}
    : {background: '#fff', border: `4px solid ${INK}`, borderRadius: 26, boxShadow: `10px 10px 0 ${GOLD_LT}`})});

const Hl: React.FC<{t: Theme; children: React.ReactNode}> = ({t, children}) => {
  const s = t.hl;
  if (s === 'box') return <span style={{background: t.dark ? GG : INK, color: t.dark ? INK : GOLD_LT, borderRadius: 18, padding: '0 22px', display: 'inline-block', lineHeight: 1.35}}>{children}</span>;
  if (s === 'marker') return <span style={{position: 'relative', display: 'inline-block', padding: '0 10px'}}><span style={{position: 'absolute', left: 0, right: 0, top: '50%', bottom: '4%', background: t.dark ? 'rgba(232,192,102,.4)' : 'rgba(232,192,102,.75)', transform: 'skew(-8deg) rotate(-1deg)', borderRadius: 6}} /><span style={{position: 'relative'}}>{children}</span></span>;
  if (s === 'underline') return <span style={{display: 'inline-block', borderBottom: `12px solid ${GOLD_LT}`, lineHeight: 1.2, ...(t.dark ? goldText : {})}}>{children}</span>;
  if (s === 'circle') return <span style={{position: 'relative', display: 'inline-block', padding: '0 18px'}}><svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{position: 'absolute', left: -14, right: -14, top: -12, bottom: -12, width: 'calc(100% + 28px)', height: 'calc(100% + 24px)', overflow: 'visible'}}>
    <path d="M50 3 C 90 2, 99 14, 96 24 C 92 38, 20 40, 6 28 C -4 18, 12 4, 56 5" fill="none" stroke={GOLD} strokeWidth="2.4" vectorEffect="non-scaling-stroke" style={{strokeWidth: 7}} /></svg><span style={{position: 'relative'}}>{children}</span></span>;
  if (!t.dark) return <span style={{color: '#8F6A1F', textShadow: '0 2px 0 rgba(232,192,102,.45)'}}>{children}</span>;
  return <span style={{...goldText, filter: 'drop-shadow(0 4px 14px rgba(232,192,102,.35))'}}>{children}</span>;
};
const Kicker: React.FC<{t: Theme; children: React.ReactNode; icon?: string}> = ({t, children, icon}) => {
  const k = t.kicker ?? 'pill'; const {fg} = useTok(t);
  const base: React.CSSProperties = {display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: 'Cairo', fontWeight: 800, fontSize: 34, direction: 'rtl', whiteSpace: 'nowrap'};
  const ico = icon ? <Ic n={icon} s={36} c={k === 'pill' && t.dark ? INK : k === 'pill' ? GOLD_LT : t.dark ? GOLD_LT : INK} w="fill" /> : null;
  if (k === 'stamp') return <span style={{...base, border: `5px solid ${t.dark ? GOLD_LT : INK}`, color: t.dark ? GOLD_LT : INK, padding: '2px 22px', borderRadius: 10, transform: 'rotate(-2deg)'}}>{ico}{children}</span>;
  if (k === 'tape') return <span style={{...base, background: 'rgba(232,192,102,.8)', color: INK, padding: '6px 28px', transform: 'rotate(-1.5deg)', clipPath: 'polygon(2% 0,98% 6%,100% 50%,97% 96%,1% 100%,0 50%)'}}>{ico}{children}</span>;
  if (k === 'mono') return <span style={{...base, fontFamily: 'monospace', fontSize: 30, color: t.dark ? GOLD_LT : '#8F6A1F'}}><span style={ltr}>{'>'}</span> {ico}{children}</span>;
  if (k === 'label') return <span style={{...base, color: fg, borderBottom: `5px solid ${GOLD}`, paddingBottom: 4}}>{ico}{children}</span>;
  return <span style={{...base, padding: '6px 26px', borderRadius: 99, ...(t.dark ? {background: GG, color: INK} : {background: INK, color: GOLD_LT})}}>{ico}{children}</span>;
};
const H1: React.FC<{t: Theme; children: React.ReactNode; size?: number}> = ({t, children, size = 74}) => (
  <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: size, lineHeight: 1.28, color: useTok(t).fg, direction: 'rtl', textShadow: t.dark ? '0 6px 30px rgba(0,0,0,.6)' : 'none'}}>{children}</div>
);
const P: React.FC<{t: Theme; children: React.ReactNode; size?: number}> = ({t, children, size = 40}) => (
  <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: size, lineHeight: 1.6, color: useTok(t).sub, direction: 'rtl'}}>{children}</div>
);
const Tile: React.FC<{size: number; icon: string; t: Theme}> = ({size, icon, t}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: t.dark ? 'linear-gradient(160deg,#2a2a2a,#0d0d0d)' : INK, border: `4px solid ${GOLD_LT}`, boxShadow: '0 10px 30px rgba(0,0,0,.25)'}}>
    <Ic n={icon} s={size * 0.6} /></div>
);

// ── الإطار المشترك: الخلفية + رأس + تذييل ──
const Frame: React.FC<{t: Theme; d: CarDay; n: number; children: React.ReactNode}> = ({t, d, n, children}) => {
  const {fg, sub} = useTok(t);
  const pad = t.name === 'phone' ? 110 : t.name === 'tailor' ? 100 : 80;
  return (
    <AbsoluteFill style={{fontFamily: 'Cairo', overflow: 'hidden', direction: 'rtl'}}>
      <t.Bg n={n} />
      <div style={{position: 'absolute', top: t.name === 'mat' ? 92 : t.name === 'phone' ? 110 : 70, right: pad, left: pad, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 64, height: 64, borderRadius: '50%', padding: 3, background: GG}}>
            <Img src={staticFile('profile.png')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#111', transform: 'scale(1.25)', transformOrigin: '50% 40%'}} /></div>
          <div style={{lineHeight: 1.2}}>
            <div style={{fontWeight: 800, fontSize: 26, color: fg}}>محمد أبو سعادة</div>
            <div style={{fontWeight: 800, fontSize: 22, color: sub}}>اليوم <span style={ltr}>{d.day}</span> · {d.tag}</div></div>
        </div>
        <div style={{fontWeight: 800, fontSize: 26, padding: '4px 20px', borderRadius: 99, ...ltr, ...(t.dark ? {background: GG, color: INK} : {background: INK, color: GOLD_LT})}}>{n} / {CAR_N}</div>
      </div>
      <div style={{position: 'absolute', top: t.name === 'phone' ? 220 : 190, right: pad, left: pad, bottom: t.name === 'library' ? 150 : 130}}>{children}</div>
      <div style={{position: 'absolute', bottom: t.name === 'phone' ? 70 : t.name === 'library' ? 120 : 46, right: pad, left: pad, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 24, color: sub, opacity: 0.85}}>
        <span style={ltr}>@eng_mohammed_saada</span><span>{n < CAR_N ? 'اسحب ←' : '30 DAYS OF LLM APPS'}</span></div>
    </AbsoluteFill>
  );
};

// ── الشرائح ──
const SCover: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const {fg, sub} = useTok(t);
  const num = <span style={{...goldText, ...ltr, filter: 'drop-shadow(0 6px 20px rgba(143,106,31,.35))'}}>{String(d.day).padStart(2, '0')}</span>;
  const lines = <>
    <H1 t={t} size={84}>{d.cover[0]}</H1>
    <H1 t={t} size={98}><Hl t={t}>{d.cover[1]}</Hl></H1>
    {d.cover[2] ? <H1 t={t} size={74}>{d.cover[2]}</H1> : null}
  </>;
  const pills = <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
    <Kicker t={t}>{d.phase}</Kicker>
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 30, color: fg, border: `3px solid ${GOLD_LT}`, borderRadius: 99, padding: '4px 22px'}}>
      {d.logos.map((l) => <Logo key={l} name={l} size={34} color={t.dark ? 'gold' : INK} />)}</span>
  </div>;
  const me = <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
    <div style={{width: 150, height: 150, borderRadius: '50%', padding: 6, background: GG, flexShrink: 0}}>
      <Img src={staticFile('profile.png')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#111', transform: 'scale(1.3)', transformOrigin: '50% 42%'}} /></div>
    <div><div style={{fontWeight: 800, fontSize: 36, color: fg}}>محمد أبو سعادة</div><div style={{fontWeight: 800, fontSize: 28, color: sub}}>30 يوم · 30 تطبيق ذكاء اصطناعي</div></div>
  </div>;
  if (t.cover === 'poster') return <>
    <div style={{position: 'absolute', left: -40, top: -40, fontWeight: 800, fontSize: 560, lineHeight: 1, opacity: t.dark ? 0.16 : 0.2, ...goldText, ...ltr}}>{String(d.day).padStart(2, '0')}</div>
    <div style={{position: 'absolute', top: 40}}>{pills}</div>
    <div style={{position: 'absolute', bottom: 250, right: 0, left: 0}}>{lines}</div>
    <div style={{position: 'absolute', bottom: 20, right: 0}}>{me}</div>
  </>;
  if (t.cover === 'split') return <div style={{display: 'flex', height: '100%', gap: 40}}>
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingTop: 30}}>
      {pills}<div>{lines}</div>{me}</div>
    <div style={{width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: `4px solid ${GOLD_LT}`, paddingRight: 30}}>
      <div style={{fontWeight: 800, fontSize: 46, color: sub}}>اليوم</div>
      <div style={{fontWeight: 800, fontSize: 220, lineHeight: 1}}>{num}</div>
      <div style={{fontWeight: 800, fontSize: 40, color: sub, ...ltr}}>/ 30</div>
    </div>
  </div>;
  if (t.cover === 'badge') return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 30, paddingTop: 20}}>
    <div style={{position: 'relative', width: 300, height: 300, borderRadius: '50%', background: t.dark ? 'linear-gradient(160deg,#242424,#0b0b0b)' : INK, border: `8px solid ${GOLD_LT}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(232,192,102,.35)'}}>
      <div style={{fontWeight: 800, fontSize: 40, color: '#e9e2cf'}}>اليوم</div><div style={{fontWeight: 800, fontSize: 150, lineHeight: 1}}>{num}</div>
      <div style={{position: 'absolute', inset: -26, borderRadius: '50%', border: `3px dashed ${GOLD}`}} /></div>
    {pills}
    <div>{lines}</div>
    <div style={{marginTop: 10}}>{me}</div>
  </div>;
  return <div style={{display: 'flex', flexDirection: 'column', gap: 34, paddingTop: 30, height: '100%'}}>
    {pills}
    <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}><span style={{fontWeight: 800, fontSize: 56, color: fg}}>اليوم</span><span style={{fontWeight: 800, fontSize: 190, lineHeight: 0.9}}>{num}</span></div>
    <div>{lines}</div>
    <div style={{marginTop: 'auto'}}>{me}</div>
  </div>;
};

const SProblem: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const {card} = useTok(t);
  return <div style={{display: 'flex', flexDirection: 'column', gap: 40, height: '100%', justifyContent: 'center', paddingBottom: 40}}>
    <Kicker t={t} icon="warning">المشكلة</Kicker>
    <div style={{display: 'flex', justifyContent: 'center', margin: '30px 0'}}>
      <div style={{position: 'relative'}}><Tile size={260} icon={d.problemIcon} t={t} />
        <div style={{position: 'absolute', top: -30, left: -40, fontWeight: 800, fontSize: 130, color: GOLD_LT, transform: 'rotate(-14deg)', textShadow: '0 6px 20px rgba(0,0,0,.4)'}}>؟</div></div></div>
    <div style={{...card, padding: '36px 44px'}}><H1 t={t} size={58}><span style={{color: t.dark ? '#fff' : INK}}>{d.problem}</span></H1></div>
  </div>;
};

const SAnalogy: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const {card, acc} = useTok(t);
  return <div style={{display: 'flex', flexDirection: 'column', gap: 36, height: '100%', justifyContent: 'center', paddingBottom: 40}}>
    <Kicker t={t} icon="lightbulb">ببساطة</Kicker>
    <H1 t={t} size={88}><Hl t={t}>{d.analogy.title}</Hl></H1>
    <div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 20}}>
      <Tile size={220} icon={d.analogy.icon} t={t} />
      <div style={{flex: 1, ...card, padding: '30px 36px'}}><P t={t} size={44}>{d.analogy.text}</P></div>
    </div>
    <div style={{fontWeight: 800, fontSize: 34, color: acc, marginTop: 10}}>✦ {d.tag}</div>
  </div>;
};

const SSteps: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const {fg, card} = useTok(t); const S = d.steps;
  let body: React.ReactNode;
  if (t.steps === 'track') body = <div style={{position: 'relative', paddingRight: 70}}>
    <div style={{position: 'absolute', right: 40, top: 40, bottom: 40, width: 6, background: `linear-gradient(${GOLD_LT},${GOLD})`, borderRadius: 4}} />
    {S.map(([ic, l], i) => <div key={l} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 26, marginBottom: 34}}>
      <div style={{position: 'absolute', right: -52, width: 44, height: 44, borderRadius: '50%', background: GG, border: `5px solid ${t.dark ? INK : '#fff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, color: INK, ...ltr}}>{i + 1}</div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 24, ...card, padding: '22px 30px'}}><Tile size={100} icon={ic} t={t} /><span style={{fontWeight: 800, fontSize: 44, color: fg}}>{l}</span></div>
    </div>)}</div>;
  else if (t.steps === 'grid') body = <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30}}>
    {S.map(([ic, l], i) => <div key={l} style={{...card, padding: '34px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', position: 'relative'}}>
      <div style={{position: 'absolute', top: 16, right: 22, fontWeight: 800, fontSize: 40, ...goldText, ...ltr}}>0{i + 1}</div>
      <Tile size={150} icon={ic} t={t} /><span style={{fontWeight: 800, fontSize: 40, color: fg, lineHeight: 1.3}}>{l}</span></div>)}</div>;
  else if (t.steps === 'chips') body = <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
    {S.map(([ic, l], i) => <React.Fragment key={l}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 40px 18px 22px', borderRadius: 99, ...(i === S.length - 1 ? {background: GG} : card), minWidth: 640}}>
        <Tile size={96} icon={ic} t={t} /><span style={{fontWeight: 800, fontSize: 44, color: i === S.length - 1 ? INK : fg}}>{l}</span></div>
      {i < S.length - 1 ? <Ic n="arrow-down" s={56} w="bold" /> : null}</React.Fragment>)}</div>;
  else body = <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
    {S.map(([ic, l], i) => <div key={l} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px', borderRadius: 24, background: t.dark ? '#0e0e10' : INK, border: `3px solid ${GOLD_LT}`, transform: `translateX(${i * -24}px)`}}>
      <span style={{fontWeight: 800, fontSize: 80, lineHeight: 1, ...goldText, ...ltr}}>0{i + 1}</span>
      <span style={{fontWeight: 800, fontSize: 46, color: '#fff', flex: 1}}>{l}</span><Ic n={ic} s={70} /></div>)}</div>;
  return <div style={{display: 'flex', flexDirection: 'column', gap: 40, height: '100%', justifyContent: 'center', paddingBottom: 40}}>
    <Kicker t={t} icon="flow-arrow">كيف بيشتغل؟</Kicker>{body}</div>;
};

const CodeBox: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const light = !t.dark && (t.res === 'receipt' || t.name === 'exam' || t.name === 'newsprint');
  return <div style={{borderRadius: 28, overflow: 'hidden', border: `4px solid ${light ? INK : GOLD_LT}`, background: light ? '#fffdf5' : '#0b0b0c', boxShadow: t.dark ? '0 0 60px rgba(232,192,102,.18)' : `12px 12px 0 ${GOLD_LT}`}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px', background: light ? '#efe6cc' : GG, direction: 'ltr'}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 18, height: 18, borderRadius: '50%', background: INK, opacity: 0.8}} />)}
      <span style={{marginLeft: 12, fontFamily: 'monospace', fontWeight: 700, fontSize: 24, color: INK}}>day-{String(d.day).padStart(2, '0')}/app.py</span></div>
    <div style={{padding: '24px 28px', direction: 'ltr', textAlign: 'left'}}>
      {d.code.map((l, i) => <div key={i} style={{fontFamily: 'monospace', fontSize: 28, lineHeight: 1.65, color: light ? '#2a2012' : '#f3ead2', whiteSpace: 'pre', minHeight: 46}}>
        <span style={{color: light ? '#b9a675' : '#7c6a3e', marginRight: 18}}>{i + 1}</span>{l}</div>)}</div>
  </div>;
};
const SCode: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 36, height: '100%', justifyContent: 'center', paddingBottom: 40}}>
    <Kicker t={t} icon="code">الكود الحقيقي</Kicker>
    <CodeBox t={t} d={d} />
    <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
      {d.logos.map((l) => <span key={l} style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 30, padding: '8px 22px', borderRadius: 99, ...(t.dark ? {background: 'rgba(255,255,255,.08)', color: '#fff', border: '2px solid rgba(232,192,102,.5)'} : {background: '#fff', color: INK, border: `3px solid ${INK}`})}}>
        <Logo name={l} size={34} color={t.dark ? 'gold' : INK} /></span>)}
      <span style={{fontWeight: 800, fontSize: 30, color: useTok(t).sub}}>الكود كامل على GitHub</span></div>
  </div>
);

const SResult: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const {card, fg} = useTok(t); const o = d.out;
  let box: React.ReactNode;
  if (t.res === 'receipt') box = <div style={{background: '#fffdf6', padding: '40px 46px 60px', boxShadow: '0 20px 40px rgba(0,0,0,.18)', clipPath: 'polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)'}}>
    <div style={{fontFamily: 'monospace', fontSize: 26, color: '#9c8a64', ...ltr, textAlign: 'left'}}>$ {o.cmd}</div>
    <div style={{borderTop: '3px dashed #c7b98f', margin: '18px 0'}} />
    {o.lines.map((l, i) => <div key={i} style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 38, lineHeight: 1.7, color: INK, unicodeBidi: 'plaintext', textAlign: 'right'}}>{l}</div>)}
    <div style={{borderTop: '3px dashed #c7b98f', margin: '18px 0 0'}} /></div>;
  else if (t.res === 'card') box = <div style={{position: 'relative', ...card, padding: '44px 40px', transform: 'rotate(-1deg)'}}>
    <div style={{position: 'absolute', top: -24, left: 260, width: 200, height: 50, background: 'rgba(232,192,102,.7)', transform: 'rotate(3deg)'}} />
    <div style={{fontFamily: 'monospace', fontSize: 26, color: t.dark ? SKY : SKY_D, ...ltr, textAlign: 'left', marginBottom: 14}}>$ {o.cmd}</div>
    {o.lines.map((l, i) => <div key={i} style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, lineHeight: 1.65, color: fg, unicodeBidi: 'plaintext', textAlign: 'right'}}>{l}</div>)}</div>;
  else box = <div style={{borderRadius: 26, overflow: 'hidden', border: `4px solid ${GOLD_LT}`, background: '#0b0b0c', boxShadow: '0 0 60px rgba(232,192,102,.2)'}}>
    <div style={{padding: '12px 24px', background: GG, fontFamily: 'monospace', fontWeight: 700, fontSize: 24, color: INK, ...ltr}}>Terminal</div>
    <div style={{padding: '26px 30px'}}>
      <div style={{fontFamily: 'monospace', fontSize: 28, color: GOLD_LT, ...ltr, textAlign: 'left', marginBottom: 12}}>$ {o.cmd}</div>
      {o.lines.map((l, i) => <div key={i} style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 38, lineHeight: 1.65, color: '#f3ead2', unicodeBidi: 'plaintext', textAlign: 'right'}}>{l}</div>)}</div></div>;
  return <div style={{display: 'flex', flexDirection: 'column', gap: 40, height: '100%', justifyContent: 'center', paddingBottom: 40}}>
    <Kicker t={t} icon="terminal-window">النتيجة الحقيقية</Kicker>
    {box}
    <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '26px 30px', borderRadius: 28, background: t.dark ? GG : INK}}>
      <Ic n={o.noteIcon ?? 'sparkle'} s={70} c={t.dark ? INK : 'gold'} w="fill" />
      <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.45, color: t.dark ? INK : '#fff', flex: 1}}>{o.note}</div></div>
  </div>;
};

const SCta: React.FC<{t: Theme; d: CarDay}> = ({t, d}) => {
  const {fg, sub, card} = useTok(t);
  return <div style={{display: 'flex', flexDirection: 'column', gap: 34, height: '100%', justifyContent: 'center'}}>
    <Kicker t={t} icon="sparkle">الخلاصة</Kicker>
    <div><H1 t={t} size={66}>{d.golden[0]}</H1><H1 t={t} size={80}><Hl t={t}>{d.golden[1]}</Hl></H1></div>
    <div style={{...card, padding: '28px 34px'}}>
      <div style={{fontWeight: 800, fontSize: 32, color: sub}}>دورك ✍️</div>
      <div style={{fontWeight: 800, fontSize: 46, color: fg, lineHeight: 1.4, marginTop: 6}}>{d.cta}</div></div>
    <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
      {([['user-plus', 'تابعني'], ['bookmark-simple', 'احفظ'], ['paper-plane-tilt', 'شارك'], ['github-logo', 'الكود بأول تعليق']] as const).map(([ic, l], i) => (
        <span key={l} style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 32, padding: '10px 26px', borderRadius: 99,
          ...(i === 0 ? {background: GG, color: INK} : t.dark ? {border: `3px solid ${GOLD}`, color: GOLD_LT} : {border: `3px solid ${INK}`, color: INK})}}>
          <Ic n={ic} s={34} c={i === 0 ? INK : t.dark ? 'gold' : INK} w="fill" />{l}</span>))}</div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTop: `3px solid ${GOLD_LT}`}}>
      <div style={{fontWeight: 800, fontSize: 32, color: fg}}>بكرة: <span style={{color: t.dark ? GOLD_LT : '#8F6A1F'}}>{d.next}</span></div></div>
    <div style={{fontWeight: 800, fontSize: 36, ...goldText}}>من غزة… للعالم</div>
  </div>;
};

const SLIDES = [SCover, SProblem, SAnalogy, SSteps, SCode, SResult, SCta];
export const CAR_DAYS = Object.keys(CAR).map(Number);
export const CarouselDay: React.FC<{day: number; n: number}> = ({day, n}) => {
  const d = CAR[day]; const t = T[day]; const S = SLIDES[n - 1];
  return <Frame t={t} d={d} n={n}><S t={t} d={d} /></Frame>;
};
