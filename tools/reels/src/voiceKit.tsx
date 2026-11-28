import React from 'react';
import {AbsoluteFill, Solid, interpolate, useCurrentFrame} from 'remotion';
import {lightLeak} from '@remotion/effects/light-leak';
import {GOLD, GOLD_LT, INK, W, H, glossy, goldText} from './brand';
import {clamp, sp} from './EnergyReel';

// أدوات مشتركة لريلز الصوت (اليوم 1، 2، ...)
export const FPS = 30;
export type Page = {s: number; e: number; w: [string, number][]};
export type Plan = {off: number; end: number; scenes: [string, number, number][]; pages: Page[]};
export type Kind = 'dark' | 'sky' | 'gold' | 'map';   // map = شفاف فوق عالم اليوم (World)
export type SceneFC = React.FC<{t0: number}>;

// ── أدوات ──
export const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{top: 230, height: 1040, bottom: 'auto', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo', padding: '0 70px'}}><div style={{transform: 'scale(1.1)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div></AbsoluteFill>
);
// ظهور بنابض عند زمن صوتي معيّن (t بالثواني من بداية المشهد)
export const In: React.FC<{at: number; children: React.ReactNode; y?: number; x?: number; rot?: number; style?: React.CSSProperties; pop?: boolean}> = ({at, children, y = 60, x = 0, rot = 0, style, pop}) => {
  const f = useCurrentFrame(); const s = sp(f - at * FPS, pop ? 9 : 13, pop ? 260 : 180); const k = Math.min(1, s);
  return <div style={{opacity: Math.min(1, s * 2), transform: `translate(${(1 - s) * x}px,${(1 - s) * y}px) scale(${pop ? 0.3 + 0.7 * s : 1}) rotate(${(1 - k) * rot}deg)`, ...style}}>{children}</div>;
};
export const Tile: React.FC<{size: number; children: React.ReactNode; r?: number; style?: React.CSSProperties}> = ({size, children, r = 0.28, style}) => (
  <div style={{...glossy, width: size, height: size, borderRadius: size * r, ...style}}>{children}</div>
);
export const Pill: React.FC<{children: React.ReactNode; dark?: boolean; size?: number; style?: React.CSSProperties}> = ({children, dark, size = 44, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: size, padding: `${size * 0.2}px ${size * 0.75}px`, borderRadius: 99, direction: 'rtl', whiteSpace: 'nowrap',
    ...(dark ? {background: INK, color: GOLD_LT, border: `3px solid ${GOLD_LT}`} : {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK, border: '3px solid #F6DE9C'}),
    boxShadow: '0 16px 36px rgba(0,0,0,.28)', ...style}}>{children}</div>
);
export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; gold?: boolean; style?: React.CSSProperties}> = ({children, size = 120, color = '#fff', gold, style}) => (
  <div style={{fontWeight: 800, fontSize: size, lineHeight: 1.25, color, direction: 'rtl', textAlign: 'center', ...(gold ? {...goldText, filter: 'drop-shadow(0 0 30px rgba(232,192,102,.45))'} : {}), ...style}}>{children}</div>
);
export const Float: React.FC<{children: React.ReactNode; amp?: number; speed?: number}> = ({children, amp = 14, speed = 22}) => {
  const f = useCurrentFrame();
  return <div style={{transform: `translateY(${Math.sin(f / speed) * amp}px) rotate(${Math.sin(f / (speed * 1.7)) * 2}deg)`}}>{children}</div>;
};
export const Slash: React.FC<{at: number; color?: string}> = ({at, color = GOLD_LT}) => {
  const f = useCurrentFrame(); const p = interpolate(f, [at * FPS, at * FPS + 6], [0, 100], clamp);
  return <div style={{position: 'absolute', left: '-8%', top: '50%', width: `${p * 1.16}%`, height: 14, background: color, borderRadius: 9, transform: 'rotate(-12deg)', boxShadow: '0 0 20px rgba(0,0,0,.4)'}} />;
};
// نافذة كود بتنكتب حرف حرف
export const Code: React.FC<{lines: string[]; from: number; to: number; hl?: string; title?: string}> = ({lines, from, to, hl, title = 'app.py'}) => {
  const f = useCurrentFrame(); const total = lines.join('').length;
  let n = Math.floor(interpolate(f, [from * FPS, to * FPS], [0, total], clamp));
  return (
    <div style={{width: 940, borderRadius: 30, overflow: 'hidden', background: '#0b0b0b', border: `3px solid ${GOLD}`, boxShadow: '0 0 80px rgba(232,192,102,.25),0 40px 80px rgba(0,0,0,.5)', ...ltr}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 26px', background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)'}}>
        {[0, 1, 2].map((i) => <div key={i} style={{width: 20, height: 20, borderRadius: '50%', background: INK, opacity: 0.75}} />)}
        <div style={{marginLeft: 16, fontWeight: 800, fontSize: 26, color: INK}}>{title}</div>
      </div>
      <div style={{padding: '28px 30px', fontFamily: 'monospace', fontSize: 31, lineHeight: 1.65, color: '#f3ead2', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
        {lines.map((l, i) => {
          const shown = l.slice(0, Math.max(0, n)); n -= l.length; const typing = shown.length > 0 && shown.length < l.length;
          const parts = hl && shown.includes(hl) ? shown.split(hl) : [shown];
          return <div key={i} style={{minHeight: 50}}><span style={{color: '#7c6a3e', marginRight: 18}}>{i + 1}</span>
            {parts.map((p, k) => <React.Fragment key={k}>{k > 0 && <span style={{color: INK, background: GOLD_LT, borderRadius: 6, padding: '0 6px'}}>{hl}</span>}{p}</React.Fragment>)}
            {typing && <span style={{background: GOLD_LT, color: GOLD_LT}}>_</span>}</div>;
        })}
      </div>
    </div>
  );
};
export const Leak: React.FC<{seed?: number; frames?: number}> = ({seed = 0, frames = 40}) => {
  const f = useCurrentFrame();
  if (f > frames) return null;
  return <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
    <Solid width={W} height={H} color="#000" effects={[lightLeak({seed, hueShift: 0, progress: interpolate(f, [0, frames], [0, 1], clamp)})]} />
  </AbsoluteFill>;
};
export const STEP: React.FC<{n: number; dark?: boolean}> = ({n, dark}) => (
  <In at={0.05} x={200} y={0}><Pill dark={!dark} size={46}><span>الخطوة</span><span style={ltr}>{n}</span></Pill></In>
);
