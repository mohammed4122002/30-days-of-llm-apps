import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {iris} from '@remotion/transitions/iris';
import {pushCut} from '@remotion/transitions/push-cut';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {fade} from '@remotion/transitions/fade';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {noise2D} from '@remotion/noise';
import {Trail} from '@remotion/motion-blur';
import {Arch, Chrome, Dark, GOLD, GOLD_LT, H, INK, Icon, Label, LightSweep, Logo, Particles, Pop, Rays, Rise, Safe, SlideIn, Sky, W, glossy, goldText, useSpring} from './brand';
import {DAYS, LOGO_LABEL} from './days';
import timings from './dayTimings.json';

// ── التوقيت ─────────────────────────────────────────────
export const TR = 16;
export const BASE = [180, 150, 216, 210, 150, 165, 180];
export const dayScenes = (n: number): number[] => ((timings as Record<string, {scenes: number[]}>)[String(n)]?.scenes) ?? BASE;
type Sync = {start: number; stagger: number};
export const daySync = (n: number, scene: number, fallback: Sync): Sync =>
  ((timings as Record<string, {sync?: Record<string, Sync>}>)[String(n)]?.sync?.[String(scene)]) ?? fallback;
export const dayFrames = (n: number) => {const s = dayScenes(n); return s.reduce((a, b) => a + b, 0) - TR * (s.length - 1);};
// توقيتات داخلية مشتركة مع scripts/gen-day-audio.py
export const FLOW_START = 26, FLOW_STEP = 30, TYPE_START = 22, TYPE_END_PAD = 64;

// ── مؤثرات سينمائية ─────────────────────────────────────
const Drift: React.FC<{children: React.ReactNode; seed: string; amp?: number}> = ({children, seed, amp = 1}) => {
  const f = useCurrentFrame();
  const x = noise2D(seed + 'x', f / 90, 0) * 10 * amp, y = noise2D(seed + 'y', 0, f / 90) * 10 * amp, r = noise2D(seed + 'r', f / 120, 1) * 0.5 * amp;
  return <AbsoluteFill style={{transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(1.015)`}}>{children}</AbsoluteFill>;
};
const Leaks: React.FC<{dark?: boolean; seed: string}> = ({dark, seed}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: dark ? 'screen' : 'soft-light', pointerEvents: 'none'}}>
      {[0, 1, 2].map((i) => {
        const x = 50 + noise2D(seed + i, f / 160, i) * 45, y = 40 + noise2D(seed + 'y' + i, i, f / 170) * 40;
        const s = 700 + 200 * Math.sin(f / 50 + i);
        return <div key={i} style={{position: 'absolute', left: `${x}%`, top: `${y}%`, width: s, height: s, transform: 'translate(-50%,-50%)', borderRadius: '50%',
          background: `radial-gradient(circle, rgba(232,192,102,${dark ? 0.32 : 0.55}) 0, rgba(232,192,102,0) 65%)`, filter: 'blur(20px)'}} />;
      })}
    </AbsoluteFill>
  );
};
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.08, backgroundImage: 'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1.2px)',
    backgroundSize: '5px 5px', backgroundPosition: `${(random('g' + f) * 5) | 0}px ${(random('h' + f) * 5) | 0}px`, mixBlendMode: 'overlay'}} />;
};
const Scan: React.FC<{delay?: number}> = ({delay = 0}) => {
  const f = useCurrentFrame() - delay;
  const y = interpolate(f, [0, 40], [-10, 110], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(f, [0, 5, 35, 40], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: o, background: `linear-gradient(180deg, transparent ${y - 6}%, rgba(246,222,156,.35) ${y}%, transparent ${y + 1}%)`}} />;
};

// نص كلمة كلمة، مع خلفية ذهبية تمتد على العبارة المبرزة
const Kinetic: React.FC<{text: string; start: number; size: number; color?: string; hl?: string; stagger?: number; align?: 'center' | 'right'; dark?: boolean}> =
  ({text, start, size, color = INK, hl, stagger = 3, align = 'center', dark}) => {
    const f = useCurrentFrame(); const {fps} = useVideoConfig();
    const words = text.split(' ');
    let a = -1, b = -1;
    if (hl) {const hw = hl.split(' '); for (let i = 0; i + hw.length <= words.length; i++) if (hw.every((w, k) => words[i + k] === w)) {a = i; b = i + hw.length - 1;}}
    const hlStart = start + (b + 1) * stagger + 8;
    return (
      <div style={{direction: 'rtl', textAlign: align, fontSize: size, fontWeight: 800, lineHeight: 1.42, color}}>
        {words.map((w, i) => {
          const s = spring({frame: f - start - i * stagger, fps, config: {damping: 13, stiffness: 150}});
          const inHl = i >= a && i <= b;
          const p = inHl ? interpolate(f - hlStart - (b - i) * 2, [0, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
          return <span key={i} style={{display: 'inline-block', padding: `0 ${size * 0.13}px`, opacity: Math.min(1, s * 1.6),
            transform: `translateY(${(1 - s) * size * 0.55}px) scale(${0.82 + 0.18 * s})`, filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
            ...(inHl ? (dark ? {color: '#F6DE9C', textShadow: `0 0 ${p / 3}px rgba(232,192,102,.8)`}
              : {background: 'linear-gradient(180deg,transparent 60%,rgba(232,192,102,.95) 60%,rgba(232,192,102,.95) 94%,transparent 94%) no-repeat right', backgroundSize: `${p}% 100%`}) : {})}}>{w}</span>;
        })}
      </div>
    );
  };
const hookSize = (t: string) => Math.round(Math.max(72, Math.min(112, 112 - (t.length - 45) * 0.75)));

// ── المشاهد ─────────────────────────────────────────────
const Hook: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const nn = String(n).padStart(2, '0');
  const zoom = interpolate(f, [0, 20], [3.2, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const reveal = interpolate(f, [4, 26], [0, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const arch = useSpring(14, {damping: 12, stiffness: 110});
  const badge = useSpring(30, {damping: 10, stiffness: 170});
  return (
    <AbsoluteFill style={{clipPath: `circle(${reveal}% at 50% 40%)`}}>
      <Sky /><Leaks seed={`h${n}`} /><Rays y="30%" /><Particles n={24} light />
      <AbsoluteFill style={{alignItems: 'flex-start'}}>
        <Trail layers={5} lagInFrames={0.6} trailOpacity={0.5}>
          <AbsoluteFill>
            <div style={{position: 'absolute', left: -50, top: 190, fontFamily: 'Cairo', fontWeight: 800, fontSize: 760, lineHeight: 0.8, color: 'transparent',
              WebkitTextStroke: '5px rgba(201,162,75,.4)', direction: 'ltr', transform: `scale(${zoom})`, transformOrigin: '30% 40%'}}>{nn}</div>
          </AbsoluteFill>
        </Trail>
      </AbsoluteFill>
      <Drift seed={`hook${n}`}>
        <Safe>
          <div style={{display: 'flex', justifyContent: 'center', opacity: Math.min(1, arch * 1.6), transform: `translateY(${Math.sin(f / 22) * 10}px) scale(${0.55 + 0.45 * arch})`}}>
            <div style={{position: 'relative'}}>
              <Arch w={430} h={570} glow={0.8 + Math.sin(f / 14) * 0.2} />
              <div style={{position: 'absolute', left: '50%', bottom: -34, transform: `translateX(-50%) scale(${badge})`, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12,
                background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', color: '#fff', fontWeight: 800, fontSize: 38, padding: '12px 30px', borderRadius: 99, border: `3px solid ${GOLD}`, direction: 'rtl', boxShadow: '0 14px 30px rgba(0,0,0,.35)'}}>
                <Icon name={d.icon} size={40} weight="duotone" />اليوم <span style={goldText}>{n}</span> من 30
              </div>
              {[[-70, 70, 44], [450, 170, 34], [-40, 470, 28], [440, 520, 38]].map(([x, y, s], i) => (
                <div key={i} style={{position: 'absolute', left: x, top: y, transform: `scale(${0.5 + 0.5 * Math.abs(Math.sin(f / 11 + i))}) rotate(${f * 2}deg)`}}><Icon name="sparkle" size={s} /></div>))}
            </div>
          </div>
          <div style={{marginTop: 84}}><Kinetic text={d.hook} hl={d.hl} start={daySync(n, 0, {start: 36, stagger: 3}).start} stagger={daySync(n, 0, {start: 36, stagger: 3}).stagger} size={hookSize(d.hook)} /></div>
        </Safe>
      </Drift>
      <LightSweep delay={18} /><Grain />
    </AbsoluteFill>
  );
};

const Problem: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Dark /><Leaks dark seed={`p${n}`} />
      <div style={{position: 'absolute', left: '50%', top: '48%', opacity: 0.17, transform: `translate(-50%,-50%) rotate(${f * 0.35}deg) scale(${1 + Math.sin(f / 18) * 0.05})`}}>
        <Icon name="question" size={1300} weight="thin" />
      </div>
      <Drift seed={`prob${n}`}>
        <Safe>
          <div style={{display: 'flex', justifyContent: 'flex-start', direction: 'rtl', marginBottom: 40}}>
            <Pop delay={4}><div style={{...glossy, width: 150, height: 150, borderRadius: 42, transform: `rotate(${Math.sin(f / 9) * 4}deg)`}}><Icon name="warning-circle" size={92} weight="duotone" /></div></Pop>
          </div>
          <Label icon="target" text="المشكلة" dark delay={10} />
          <Kinetic text={d.problem} start={daySync(n, 1, {start: 20, stagger: 3}).start} stagger={daySync(n, 1, {start: 20, stagger: 3}).stagger} size={88} color="#fff" align="right" />
        </Safe>
      </Drift>
      <Scan delay={8} /><Grain />
    </AbsoluteFill>
  );
};

const Idea: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const steps = d.flow; const k = steps.length;
  const rowH = k > 4 ? 200 : 236, top = 0, cw = W - 140;
  const pts = steps.map((_, i) => [i % 2 ? cw * 0.27 : cw * 0.73, top + rowH * i + rowH / 2]);
  const path = pts.reduce((acc, [x, y], i) => i === 0 ? `M ${x} ${y}` : `${acc} C ${pts[i - 1][0]} ${pts[i - 1][1] + rowH * 0.55}, ${x} ${y - rowH * 0.55}, ${x} ${y}`, '');
  const total = getLength(path);
  const prog = interpolate(f, [FLOW_START, FLOW_START + FLOW_STEP * (k - 1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const {strokeDasharray, strokeDashoffset} = evolvePath(prog, path);
  const dot = getPointAtLength(path, Math.max(0.01, prog * total));
  return (
    <AbsoluteFill>
      <Sky /><Leaks seed={`i${n}`} />
      <Drift seed={`idea${n}`} amp={0.6}>
        <Safe justify="flex-start">
          <div style={{marginTop: 20}}><Label icon="flow-arrow" text="الفكرة" delay={2} /></div>
          <Rise delay={8}><div style={{fontWeight: 800, fontSize: 70, direction: 'rtl', marginBottom: 30}}>كيف <span style={goldText}>بيشتغل؟</span></div></Rise>
          <div style={{position: 'relative', height: rowH * k}}>
            <svg width={cw} height={rowH * k} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <path d={path} fill="none" stroke="rgba(201,162,75,.22)" strokeWidth={6} strokeDasharray="14 14" />
              <path d={path} fill="none" stroke="url(#pg)" strokeWidth={8} strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
              <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8F6A1F" /><stop offset=".5" stopColor="#E8C066" /><stop offset="1" stopColor="#C9A24B" /></linearGradient></defs>
              <circle cx={dot.x} cy={dot.y} r={16} fill="#FFF1C4" style={{filter: 'drop-shadow(0 0 14px #E8C066) drop-shadow(0 0 30px #E8C066)'}} opacity={prog < 1 ? 1 : 0.0} />
            </svg>
            {steps.map(([ic, lab], i) => {
              const at = FLOW_START + FLOW_STEP * i;
              const s = spring({frame: f - at, fps: 30, config: {damping: 11, stiffness: 160}});
              const right = i % 2 === 0;
              return (
                <div key={i} style={{position: 'absolute', top: rowH * i, height: rowH, width: '50%', [right ? 'right' : 'left']: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', opacity: Math.min(1, s * 1.8), transform: `scale(${0.4 + 0.6 * s}) translateX(${(1 - s) * (right ? 60 : -60)}px)`}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '22px 26px', borderRadius: 30, fontWeight: 800, fontSize: 36, lineHeight: 1.25, direction: 'rtl', width: '96%',
                    background: 'rgba(255,255,255,.9)', border: '2px solid rgba(201,162,75,.5)', boxShadow: '0 18px 36px rgba(40,30,10,.2)'}}>
                    <div style={{...glossy, flex: 'none', width: 96, height: 96, borderRadius: 26, boxShadow: '0 0 0 3px #D9B25E,0 10px 20px rgba(0,0,0,.3)'}}><Icon name={ic} size={54} weight="duotone" /></div>
                    <div><div style={{fontSize: 24, color: GOLD}}>الخطوة {i + 1}</div>{lab}</div>
                  </div>
                </div>);
            })}
          </div>
        </Safe>
      </Drift>
      <Grain />
    </AbsoluteFill>
  );
};

const KW = /\b(from|import|def|return|class|for|in|if|else|with|lambda|print|while|not|and|or|True|False|None)\b/g;
const colorize = (line: string) => {
  const ci = line.indexOf('#');
  const code = ci >= 0 ? line.slice(0, ci) : line, com = ci >= 0 ? line.slice(ci) : '';
  const parts: React.ReactNode[] = []; let last = 0; const re = /("[^"]*"?|'[^']*'?)|\b(from|import|def|return|class|for|in|if|else|with|lambda|print|while|not|and|or|True|False|None)\b/g; let m; let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) parts.push(<span key={k++}>{code.slice(last, m.index)}</span>);
    parts.push(<span key={k++} style={{color: m[1] ? '#9fd49f' : GOLD_LT}}>{m[0]}</span>); last = m.index + m[0].length;
  }
  if (last < code.length) parts.push(<span key={k++}>{code.slice(last)}</span>);
  if (com) parts.push(<span key={k++} style={{color: '#8a8a8a'}}>{com}</span>);
  return parts;
};
void KW;
const Code: React.FC<{n: number; dur: number}> = ({n, dur}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const lines = d.code; const totalChars = lines.reduce((a, l) => a + l.length + 1, 0);
  const typed = Math.floor(interpolate(f, [TYPE_START, dur - TYPE_END_PAD], [0, totalChars], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  let left = typed, cur = 0;
  const shown = lines.map((l, i) => {const c = Math.max(0, Math.min(l.length, left)); left -= l.length + 1; if (left >= 0) cur = i + 1; return l.slice(0, c);});
  cur = Math.min(cur, lines.length - 1);
  const blink = Math.floor(f / 8) % 2 === 0;
  const term = useSpring(6, {damping: 14, stiffness: 120});
  return (
    <AbsoluteFill>
      <Dark /><Leaks dark seed={`c${n}`} />
      <Drift seed={`code${n}`} amp={0.5}>
        <Safe>
          <Label icon="terminal-window" text="الكود" dark delay={2} />
          <div style={{transform: `perspective(1400px) rotateX(${(1 - term) * 25}deg) scale(${0.85 + 0.15 * term})`, opacity: Math.min(1, term * 1.5),
            borderRadius: 28, overflow: 'hidden', background: '#161616', boxShadow: '0 0 0 2px rgba(232,192,102,.5),0 0 90px rgba(201,162,75,.3),0 40px 80px rgba(0,0,0,.6)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '20px 26px', background: '#232323', borderBottom: `2px solid ${GOLD}`, direction: 'ltr'}}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{width: 18, height: 18, borderRadius: '50%', background: c}} />)}
              <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 26, color: GOLD_LT}}><Icon name="file-code" size={28} />day-{String(n).padStart(2, '0')}/app.py</span>
            </div>
            <div style={{padding: '24px 28px', fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 30, lineHeight: 1.55, color: '#eee', direction: 'ltr', textAlign: 'left', whiteSpace: 'pre', minHeight: 900}}>
              {shown.map((l, i) => (
                <div key={i} style={{background: i === cur && typed < totalChars ? 'rgba(232,192,102,.10)' : 'transparent', margin: '0 -28px', padding: '0 28px'}}>
                  <span style={{color: '#5d5d5d', marginRight: 22}}>{String(i + 1).padStart(2, ' ')}</span>{colorize(l)}
                  {i === cur && <span style={{display: 'inline-block', width: 16, height: 36, marginLeft: 2, verticalAlign: 'middle', background: GOLD_LT, opacity: blink ? 1 : 0, boxShadow: '0 0 12px #E8C066'}} />}
                </div>))}
            </div>
          </div>
          <div style={{display: 'flex', gap: 14, justifyContent: 'center', marginTop: 30, direction: 'ltr'}}>
            {d.logos.map((l, i) => <Pop key={l} delay={20 + i * 6}><span style={{display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.94)', borderRadius: 99, padding: '10px 26px 10px 12px', fontWeight: 800, fontSize: 30, color: INK, border: '2px solid rgba(201,162,75,.5)'}}>
              <span style={{width: 50, height: 50, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo name={l} size={30} color="#fff" /></span>{LOGO_LABEL[l]}</span></Pop>)}
          </div>
        </Safe>
      </Drift>
      <Grain />
    </AbsoluteFill>
  );
};

const Built: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sky /><Leaks seed={`b${n}`} />
      <Drift seed={`built${n}`} amp={0.6}>
        <Safe>
          <Label icon="hammer" text="شو بنينا اليوم" delay={2} />
          {d.learn.map((t, i) => {
            const s = spring({frame: f - (14 + i * 14), fps: 30, config: {damping: 14, stiffness: 130}});
            const g = i === 1; const from = i % 2 ? -1 : 1;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '36px 36px', borderRadius: 32, fontWeight: 800, fontSize: 48, lineHeight: 1.4, marginTop: 30, direction: 'rtl',
                  opacity: Math.min(1, s * 1.5), transform: `perspective(1200px) translateX(${(1 - s) * 260 * from}px) rotateY(${(1 - s) * 35 * from}deg)`,
                  filter: `blur(${Math.max(0, 1 - s) * 14}px)`,
                  boxShadow: '0 22px 46px rgba(30,22,5,.3)',
                  ...(g ? {background: 'linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%)', color: INK} : {background: 'linear-gradient(150deg,#363636 0%,#1c1c1c 60%,#111 100%)', color: '#fff'})}}>
                  <div style={{flex: 'none', fontSize: 120, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `3px ${g ? INK : GOLD}`, direction: 'ltr', width: 160, textAlign: 'center'}}>0{i + 1}</div>
                  <div>{t}</div>
                </div>);
          })}
        </Safe>
      </Drift>
      <Grain />
    </AbsoluteFill>
  );
};

const Confetti: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame() - start; if (f < 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 90}).map((_, i) => {
        const a = random('ca' + i) * Math.PI * 2, v = 14 + random('cv' + i) * 26, g = 0.55;
        const x = W / 2 + Math.cos(a) * v * f, y = H * 0.42 + Math.sin(a) * v * f + g * f * f;
        const r = 8 + random('cr' + i) * 14;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r * 0.5, background: i % 3 ? GOLD_LT : '#111', transform: `rotate(${f * 12 + i * 30}deg)`, opacity: interpolate(f, [0, 70], [1, 0], {extrapolateRight: 'clamp'})}} />;
      })}
    </AbsoluteFill>
  );
};
const Lesson: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const v = interpolate(f, [10, 52], [n - 1, n], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const r = 150, c = 2 * Math.PI * r;
  const pulse = f > 52 ? 1 + 0.06 * Math.sin((f - 52) / 5) * Math.exp(-(f - 52) / 30) : 1;
  return (
    <AbsoluteFill>
      <Sky /><Leaks seed={`l${n}`} /><Rays y="40%" size={1400} />
      <Drift seed={`les${n}`} amp={0.6}>
        <Safe>
          <Label icon="lightbulb" text="الخلاصة" delay={2} />
          <div style={{display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
            <div style={{position: 'relative', width: 360, height: 360, filter: 'drop-shadow(0 12px 30px rgba(201,162,75,.5))'}}>
              <svg width={360} height={360} viewBox="0 0 360 360">
                <defs><linearGradient id="rg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1C4" /><stop offset=".5" stopColor="#E2B95A" /><stop offset="1" stopColor="#9C7A2E" /></linearGradient></defs>
                <circle cx={180} cy={180} r={r} fill="none" stroke="rgba(0,0,0,.1)" strokeWidth={30} />
                <circle cx={180} cy={180} r={r} fill="none" stroke="url(#rg2)" strokeWidth={30} strokeLinecap="round" strokeDasharray={`${(c * v) / 30} ${c}`} transform="rotate(-90 180 180)" />
              </svg>
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'ltr'}}>
                <div style={{fontWeight: 800, fontSize: 130, lineHeight: 1}}>{Math.round(v)}</div><div style={{fontWeight: 800, fontSize: 38, opacity: 0.55}}>/ 30</div>
              </div>
            </div>
          </div>
          <div style={{marginTop: 40}}><Kinetic text="كل يوم خطوة صغيرة، وبعد 30 يوم الفرق بيكون ضخم." hl="بيكون ضخم." start={20} size={62} /></div>
          <Rise delay={60} dist={140}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '28px 32px', borderRadius: 30, marginTop: 40, direction: 'rtl', fontWeight: 800, fontSize: 40,
              background: 'linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%)', boxShadow: '0 20px 40px rgba(30,22,5,.28)'}}>
              <div style={{...glossy, flex: 'none', width: 100, height: 100, borderRadius: 28, boxShadow: '0 0 0 3px #D9B25E'}}><Icon name={d.next ? d.next.icon : 'trophy'} size={56} /></div>
              <div><div style={{fontSize: 28, fontWeight: 400, opacity: 0.75}}>{d.next ? 'بكرة' : 'خلصنا!'}</div>{d.next ? d.next.title : 'انتهى التحدي. شكرًا لكل حدا تابع!'}</div>
            </div>
          </Rise>
        </Safe>
      </Drift>
      {n === 30 && <Confetti start={52} />}
      <Grain />
    </AbsoluteFill>
  );
};

const Cta: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const rings = [0, 1, 2].map((k) => ((f + k * 20) % 60) / 60);
  return (
    <AbsoluteFill>
      <Dark /><Leaks dark seed={`t${n}`} />
      <Drift seed={`cta${n}`} amp={0.5}>
        <Safe>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              {rings.map((p, k) => <div key={k} style={{position: 'absolute', left: '50%', top: '50%', width: 400, height: 400, borderRadius: '50%', border: `4px solid ${GOLD_LT}`,
                transform: `translate(-50%,-50%) scale(${1 + p * 0.75})`, opacity: (1 - p) * 0.5}} />)}
              <Pop delay={4}><Arch w={360} h={470} /></Pop>
            </div>
          </div>
          <div style={{marginTop: 64}}><Kinetic text={d.cta} start={daySync(n, 6, {start: 18, stagger: 3}).start} stagger={daySync(n, 6, {start: 18, stagger: 3}).stagger} size={74} color="#fff" /></div>
          <div style={{display: 'flex', gap: 16, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap', direction: 'rtl'}}>
            {[['heart', 'أعجبني'], ['repeat', 'شارك'], ['bookmark-simple', 'احفظ'], ['user-plus', 'تابعني']].map(([i, t], k) => (
              <Pop key={i} delay={46 + k * 6}>
                <span style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 34, padding: '14px 28px', borderRadius: 99,
                  background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK, transform: k === 3 ? `scale(${1 + 0.06 * Math.max(0, Math.sin((f - 80) / 6))})` : undefined}}>
                  <Icon name={i} size={34} color={INK} />{t}</span>
              </Pop>))}
          </div>
          <Rise delay={74}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 40, fontSize: 32, fontWeight: 800, color: '#e9e2cf', direction: 'rtl'}}>
            <Logo name="github" size={36} color="#e9e2cf" />الكود كامل على GitHub
          </div></Rise>
        </Safe>
      </Drift>
      <Grain />
    </AbsoluteFill>
  );
};

// ── التركيب ─────────────────────────────────────────────
const PRES = [
  () => slide({direction: 'from-bottom'}), () => wipe({direction: 'from-right'}), () => iris({width: W, height: H}),
  () => pushCut(), () => clockWipe({width: W, height: H}), () => fade(),
];
export const DayReel: React.FC<{day: number}> = ({day}) => {
  const sc = dayScenes(day); const total = dayFrames(day);
  const scenes = [<Hook n={day} />, <Problem n={day} />, <Idea n={day} />, <Code n={day} dur={sc[3]} />, <Built n={day} />, <Lesson n={day} />, <Cta n={day} />];
  const items: React.ReactNode[] = [];
  scenes.forEach((s, i) => {
    items.push(<TransitionSeries.Sequence key={'s' + i} durationInFrames={sc[i]}>{s}</TransitionSeries.Sequence>);
    if (i < scenes.length - 1) items.push(<TransitionSeries.Transition key={'t' + i} presentation={PRES[(i + day) % PRES.length]()}
      timing={i % 2 ? linearTiming({durationInFrames: TR}) : springTiming({config: {damping: 200}, durationInFrames: TR})} />);
  });
  const nn = String(day).padStart(2, '0');
  const hasAudio = (timings as Record<string, {audio?: boolean}>)[String(day)]?.audio;
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Cairo'}}>
      <TransitionSeries>{items}</TransitionSeries>
      <Chrome total={total} />
      {hasAudio ? <Audio src={staticFile(`audio/days/day-${nn}.wav`)} /> : null}
    </AbsoluteFill>
  );
};
