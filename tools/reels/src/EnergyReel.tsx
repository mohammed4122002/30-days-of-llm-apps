import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from 'remotion';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {GOLD, GOLD_LT, H, INK, Icon, Logo, W, glossy, goldText} from './brand';
import {DAYS, LOGO_LABEL} from './days';
import plans from './energyPlan.json';

// ريلز «الطاقة»: كل شي على النبضة (120 نبضة بالدقيقة = 15 إطار)
export const FPB = 15;
type Sec = [string, number, Record<string, any>];
const planOf = (n: number): Sec[] => ((plans as any)[String(n)]?.sections ?? []) as Sec[];
export const energyFrames = (n: number) => Math.max(30, ((plans as any)[String(n)]?.beats ?? 2) * FPB + 20);

// ── أدوات الحركة ──
export const sp = (f: number, d = 12, s = 220) => spring({frame: f, fps: 30, config: {damping: d, stiffness: s}});
export const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
// قفزة الكاميرا مع كل نبضة
export const Punch: React.FC<{children: React.ReactNode; amt?: number}> = ({children, amt = 0.045}) => {
  const f = useCurrentFrame(); const ph = (f % FPB) / FPB;
  return <AbsoluteFill style={{transform: `scale(${1 + amt * Math.exp(-ph * 7)})`}}>{children}</AbsoluteFill>;
};
// اهتزاز عند بداية القسم
export const Shake: React.FC<{children: React.ReactNode; power?: number; frames?: number}> = ({children, power = 22, frames = 10}) => {
  const f = useCurrentFrame(); const k = Math.max(0, 1 - f / frames);
  const x = (random('sx' + f) - 0.5) * power * k, y = (random('sy' + f) - 0.5) * power * k;
  return <AbsoluteFill style={{transform: `translate(${x}px,${y}px) rotate(${(random('sr' + f) - .5) * 2 * k}deg)`}}>{children}</AbsoluteFill>;
};
export const Flash: React.FC<{color?: string; frames?: number}> = ({color = '#FFF6DA', frames = 5}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: color, opacity: interpolate(f, [0, frames], [0.9, 0], clamp), pointerEvents: 'none'}} />;
};
export const Shock: React.FC<{y?: string; color?: string}> = ({y = '45%', color = GOLD_LT}) => {
  const f = useCurrentFrame(); const p = interpolate(f, [0, 18], [0, 1], clamp);
  return <div style={{position: 'absolute', left: '50%', top: y, width: 200, height: 200, borderRadius: '50%', border: `${14 * (1 - p) + 2}px solid ${color}`,
    transform: `translate(-50%,-50%) scale(${1 + p * 9})`, opacity: 1 - p, pointerEvents: 'none'}} />;
};
export const Streaks: React.FC<{dark?: boolean}> = ({dark}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {Array.from({length: 14}).map((_, i) => {
        const y = random('ly' + i) * H, sp2 = 30 + random('lv' + i) * 60, len = 200 + random('ll' + i) * 400;
        const x = ((random('lx' + i) * (W + len) - f * sp2) % (W + len) + W + len) % (W + len) - len;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: len, height: 4 + random('lh' + i) * 6, borderRadius: 9,
          background: `linear-gradient(90deg,transparent,${dark ? 'rgba(232,192,102,.55)' : 'rgba(255,255,255,.8)'},transparent)`}} />;
      })}
    </AbsoluteFill>
  );
};
export const BG: React.FC<{kind: 'dark' | 'gold' | 'sky'}> = ({kind}) => {
  const f = useCurrentFrame();
  if (kind === 'gold') return <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(f / 20) * 10}% 35%, #FFF1C4 0, #E8C066 40%, #C9A24B 75%, #8F6A1F 100%)`}} />;
  if (kind === 'sky') return <AbsoluteFill style={{background: 'radial-gradient(ellipse 900px 500px at 90% 100%,rgba(255,214,140,.9) 0,rgba(255,214,140,0) 70%),radial-gradient(ellipse 700px 260px at 15% 10%,#fff 0,rgba(255,255,255,0) 70%),linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)'}} />;
  return <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 700px at ${50 + Math.sin(f / 25) * 15}% 30%,rgba(201,162,75,.35) 0,rgba(201,162,75,0) 70%),radial-gradient(circle at 50% 50%,#1d1d1d 0,#0a0a0a 60%,#000 100%)`}} />;
};
export const Rays: React.FC<{dark?: boolean}> = ({dark}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: '50%', top: '45%', width: 2200, height: 2200, transform: `translate(-50%,-50%) rotate(${f * 0.8}deg)`, borderRadius: '50%',
    background: `repeating-conic-gradient(from 0deg, ${dark ? 'rgba(232,192,102,.16)' : 'rgba(255,255,255,.35)'} 0deg 6deg, transparent 6deg 18deg)`,
    WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)'}} />;
};
// كلمات بتنضرب على الشاشة، مع إبراز
export const Slam: React.FC<{text: string; size: number; color: string; hl?: string; hlStyle?: React.CSSProperties; start?: number; stagger?: number}> =
  ({text, size, color, hl, hlStyle, start = 0, stagger = 3}) => {
    const f = useCurrentFrame(); const words = text.replace(/[«»]/g, '').split(' ');
    hl = hl?.replace(/[«»]/g, '');
    let a = -1, b = -1;
    if (hl) {const hw = hl.split(' '); for (let i = 0; i + hw.length <= words.length; i++) if (hw.every((w, k) => words[i + k].replace(/[.،:]$/, '') === w.replace(/[.،:]$/, ''))) {a = i; b = i + hw.length - 1;}}
    return (
      <div style={{direction: 'rtl', textAlign: 'center', fontSize: size, fontWeight: 800, lineHeight: 1.28, color}}>
        {words.map((w, i) => {
          const s = sp(f - start - i * stagger, 10, 260);
          const on = i >= a && i <= b;
          return <span key={i} style={{display: 'inline-block', padding: `0 ${size * 0.12}px`, margin: on ? '6px 0' : 0, opacity: Math.min(1, s * 2),
            transform: `scale(${2.2 - 1.2 * Math.min(1, s)}) rotate(${(1 - Math.min(1, s)) * (i % 2 ? 8 : -8)}deg)`, filter: `blur(${Math.max(0, 1 - s) * 12}px)`,
            ...(on ? {borderRadius: 18, ...hlStyle} : {})}}>{w}</span>;
        })}
      </div>
    );
  };
const PHASE = (n: number) => n <= 5 ? 'أسبوع الأساسيات' : n <= 10 ? 'أسبوع الـ RAG' : n <= 15 ? 'أسبوع LangSmith' : n <= 20 ? 'أسبوع الوكلاء' : n <= 25 ? 'أسبوع التخصيص' : 'أسبوع النشر';
export const fitSize = (t: string, max = 150, min = 86) => Math.round(Math.max(min, Math.min(max, 2600 / Math.pow(Math.max(10, t.length), 0.78))));

// ── الأقسام ──
const Intro: React.FC<{n: number}> = ({n}) => {
  const f = useCurrentFrame(); const d = DAYS[n - 1];
  const s = sp(f - 2, 9, 260); const s2 = sp(f - 10, 10, 220);
  return (
    <AbsoluteFill>
      <BG kind="dark" /><Rays dark /><Streaks dark />
      <Shake power={30}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo'}}>
          <div style={{fontWeight: 800, fontSize: 90, color: '#fff', opacity: s2, transform: `translateY(${(1 - s2) * -80}px)`, direction: 'rtl', letterSpacing: 4}}>اليوم</div>
          <div style={{height: 500, overflow: 'hidden', transform: `scale(${3.5 - 2.5 * Math.min(1, s)})`, opacity: Math.min(1, s * 2), filter: 'drop-shadow(0 0 40px rgba(232,192,102,.6))'}}>
            {/* بكرة الأرقام: من اليوم السابق لليوم الحالي */}
            <div style={{transform: `translateY(${-500 * interpolate(f, [6, 22], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))})}px)`}}>
              {[n - 1, n].map((v) => <div key={v} style={{height: 500, fontWeight: 800, fontSize: 520, lineHeight: '500px', direction: 'ltr', textAlign: 'center', ...goldText}}>{String(Math.max(0, v)).padStart(2, '0')}</div>)}
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, opacity: s2, transform: `scale(${s2})`}}>
            <div style={{...glossy, width: 90, height: 90, borderRadius: 26}}><Icon name={d.icon} size={52} weight="duotone" /></div>
            <div style={{fontWeight: 800, fontSize: 46, color: '#e9e2cf'}}>من 30</div>
          </div>
          <div style={{marginTop: 28, opacity: s2, transform: `translateY(${(1 - s2) * 60}px)`, fontWeight: 800, fontSize: 38, color: INK, direction: 'rtl',
            background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', padding: '8px 30px', borderRadius: 99}}>{PHASE(n)}</div>
        </AbsoluteFill>
      </Shake>
      <Shock /><Flash frames={6} />
    </AbsoluteFill>
  );
};
export const PH_STYLES: {bg: 'sky' | 'dark' | 'gold'; color: string; hl: React.CSSProperties}[] = [
  {bg: 'sky', color: INK, hl: {background: INK, color: GOLD_LT}},
  {bg: 'dark', color: '#fff', hl: {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK}},
  {bg: 'gold', color: INK, hl: {background: INK, color: '#F6DE9C'}},
];
const Phrase: React.FC<{n: number; text: string; i: number}> = ({n, text, i}) => {
  const st = PH_STYLES[i % 3]; const d = DAYS[n - 1]; const f = useCurrentFrame();
  const port = sp(f - 4, 12, 160);
  return (
    <AbsoluteFill>
      <BG kind={st.bg} />{st.bg !== 'gold' && <Rays dark={st.bg === 'dark'} />}<Streaks dark={st.bg === 'dark'} />
      <Punch>
        <Shake power={18} frames={8}>
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '300px 70px 440px', fontFamily: 'Cairo'}}>
            {i === 0 && (
              <div style={{width: 300, height: 380, padding: 7, borderRadius: '150px 150px 34px 34px', marginBottom: 50, background: 'linear-gradient(160deg,#FFF1C4,#E8C066 35%,#C9A24B 65%,#8F6A1F)',
                boxShadow: '0 0 80px 16px rgba(255,200,90,.5)', transform: `translateY(${(1 - port) * 400}px) rotate(${(1 - port) * -12}deg)`, opacity: Math.min(1, port * 2)}}>
                <Img src={staticFile('portrait.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', borderRadius: '143px 143px 27px 27px', background: '#000'}} />
              </div>)}
            <Slam text={text} size={fitSize(text, i === 0 ? 120 : 150)} color={st.color} hl={d.hl} hlStyle={st.hl} start={2} />
          </AbsoluteFill>
        </Shake>
      </Punch>
      <Flash frames={4} color={st.bg === 'dark' ? '#E8C066' : '#fff'} />
    </AbsoluteFill>
  );
};
const ProblemTitle: React.FC = () => {
  const f = useCurrentFrame(); const s = sp(f, 8, 300);
  const g = (k: number) => (random('gl' + Math.floor(f / 2) + k) - 0.5) * 24 * Math.max(0, 1 - f / 20);
  return (
    <AbsoluteFill>
      <BG kind="dark" /><Streaks dark />
      <Shake power={40} frames={14}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo'}}>
          <div style={{transform: `scale(${3 - 2 * Math.min(1, s)}) rotate(-6deg)`, opacity: Math.min(1, s * 2), position: 'relative'}}>
            {[['#E8C066', g(1)], ['#fff', g(2)]].map(([c, o], k) => <div key={k} style={{position: 'absolute', inset: 0, fontWeight: 800, fontSize: 200, color: c as string, transform: `translateX(${o}px)`, opacity: 0.45, direction: 'rtl'}}>المشكلة؟</div>)}
            <div style={{fontWeight: 800, fontSize: 200, direction: 'rtl', ...goldText}}>المشكلة؟</div>
          </div>
        </AbsoluteFill>
      </Shake>
      <Shock color="#fff" /><Flash frames={4} />
    </AbsoluteFill>
  );
};
const Problem: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BG kind="dark" />
      <div style={{position: 'absolute', left: '50%', top: '50%', opacity: 0.14, transform: `translate(-50%,-50%) rotate(${f * 1.2}deg)`}}><Icon name="question" size={1400} weight="thin" /></div>
      <Punch amt={0.025}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '300px 70px 440px', fontFamily: 'Cairo'}}>
          <Slam text={d.problem} size={fitSize(d.problem, 110, 80)} color="#fff" start={0} stagger={2} />
        </AbsoluteFill>
      </Punch>
    </AbsoluteFill>
  );
};
const Flow: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame(); const k = d.flow.length;
  const rowH = k > 4 ? 205 : 245, cw = W - 140;
  const pts = d.flow.map((_, i) => [i % 2 ? cw * .27 : cw * .73, rowH * i + rowH / 2]);
  const path = pts.reduce((acc, [x, y], i) => i === 0 ? `M ${x} ${y}` : `${acc} C ${pts[i - 1][0]} ${pts[i - 1][1] + rowH * .55}, ${x} ${y - rowH * .55}, ${x} ${y}`, '');
  const prog = interpolate(f, [FPB, FPB * k], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const ev = evolvePath(prog, path); const dot = getPointAtLength(path, Math.max(.01, prog * getLength(path)));
  const title = sp(f, 10, 240);
  return (
    <AbsoluteFill>
      <BG kind="sky" /><Streaks />
      <Punch amt={0.02}>
        <AbsoluteFill style={{padding: '280px 70px 400px', fontFamily: 'Cairo'}}>
          <div style={{fontWeight: 800, fontSize: 100, direction: 'rtl', textAlign: 'center', marginBottom: 30, transform: `scale(${2 - Math.min(1, title)})`, opacity: Math.min(1, title * 2)}}>
            كيف <span style={{background: INK, color: GOLD_LT, padding: '0 18px', borderRadius: 18}}>بيشتغل؟</span></div>
          <div style={{position: 'relative', height: rowH * k}}>
            <svg width={cw} height={rowH * k} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <path d={path} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
              <circle cx={dot.x} cy={dot.y} r={20} fill={GOLD_LT} style={{filter: 'drop-shadow(0 0 16px #E8C066) drop-shadow(0 0 34px #E8C066)'}} opacity={prog < 1 ? 1 : 0} />
            </svg>
            {d.flow.map(([ic, lab], i) => {
              const s = sp(f - FPB * (i + 1), 9, 260); const right = i % 2 === 0;
              return (
                <div key={i} style={{position: 'absolute', top: rowH * i, height: rowH, width: '50%', [right ? 'right' : 'left']: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: Math.min(1, s * 2), transform: `scale(${1.8 - .8 * Math.min(1, s)}) rotate(${(1 - Math.min(1, s)) * (right ? 10 : -10)}deg)`}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 18, width: '96%', padding: '20px 22px', borderRadius: 30, direction: 'rtl', fontWeight: 800, fontSize: 38, lineHeight: 1.2,
                    background: i % 2 ? INK : 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: i % 2 ? '#fff' : INK, boxShadow: '0 20px 40px rgba(0,0,0,.3)'}}>
                    <div style={{...glossy, flex: 'none', width: 92, height: 92, borderRadius: 26, boxShadow: '0 0 0 3px #D9B25E'}}><Icon name={ic} size={52} weight="duotone" /></div>
                    <div><div style={{fontSize: 24, opacity: .8}}>{i + 1}</div>{lab.replace(/[«»]/g, '')}</div>
                  </div>
                </div>);
            })}
          </div>
        </AbsoluteFill>
      </Punch>
      <Flash frames={4} color="#fff" />
    </AbsoluteFill>
  );
};
const Code: React.FC<{n: number; beats: number}> = ({n, beats}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const lines = d.code.slice(0, 12); const total = lines.reduce((a, l) => a + l.length + 1, 0);
  const typed = Math.floor(interpolate(f, [FPB * .5, FPB * (beats - 1.5)], [0, total], clamp));
  let left = typed, cur = 0;
  const shown = lines.map((l, i) => {const c = Math.max(0, Math.min(l.length, left)); left -= l.length + 1; if (left >= 0) cur = i + 1; return l.slice(0, c);});
  cur = Math.min(cur, lines.length - 1);
  const s = sp(f, 11, 200); const zoom = interpolate(f, [0, FPB * beats], [1.12, 1.0], clamp);
  return (
    <AbsoluteFill>
      <BG kind="dark" /><Streaks dark />
      <Punch amt={0.02}>
        <AbsoluteFill style={{padding: '300px 60px 420px', fontFamily: 'Cairo', justifyContent: 'center'}}>
          <div style={{transform: `perspective(1400px) rotateX(${(1 - Math.min(1, s)) * 50}deg) rotateZ(${(1 - Math.min(1, s)) * -6}deg) scale(${zoom})`, opacity: Math.min(1, s * 2),
            borderRadius: 28, overflow: 'hidden', background: '#141414', boxShadow: '0 0 0 3px rgba(232,192,102,.7),0 0 120px rgba(201,162,75,.45)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', background: 'linear-gradient(90deg,#F6DE9C,#C9A24B)', direction: 'ltr'}}>
              {['#111', '#111', '#111'].map((c, i) => <span key={i} style={{width: 18, height: 18, borderRadius: '50%', background: c, opacity: .6}} />)}
              <span style={{marginLeft: 'auto', fontWeight: 800, fontSize: 28, color: INK}}>day-{String(n).padStart(2, '0')}/app.py</span>
            </div>
            <div style={{padding: '22px 26px', fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 31, lineHeight: 1.5, color: '#eee', direction: 'ltr', textAlign: 'left', whiteSpace: 'pre', minHeight: 720}}>
              {shown.map((l, i) => (
                <div key={i} style={{background: i === cur && typed < total ? 'rgba(232,192,102,.14)' : 'transparent', margin: '0 -26px', padding: '0 26px'}}>
                  <span style={{color: i === cur ? GOLD_LT : '#555', marginRight: 20}}>{String(i + 1).padStart(2, ' ')}</span>{l}
                  {i === cur && <span style={{display: 'inline-block', width: 16, height: 36, verticalAlign: 'middle', background: GOLD_LT, opacity: Math.floor(f / 6) % 2 ? 1 : 0.2, boxShadow: '0 0 14px #E8C066'}} />}
                </div>))}
            </div>
          </div>
          <div style={{display: 'flex', gap: 14, justifyContent: 'center', marginTop: 30, direction: 'ltr'}}>
            {d.logos.map((l, i) => {const q = sp(f - FPB * (2 + i), 9, 260); return (
              <span key={l} style={{display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', borderRadius: 99, padding: '10px 26px 10px 12px', fontWeight: 800, fontSize: 32, color: INK, transform: `scale(${q})`}}>
                <span style={{width: 52, height: 52, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Logo name={l} size={30} color="#fff" /></span>{LOGO_LABEL[l]}</span>);})}
          </div>
        </AbsoluteFill>
      </Punch>
      <Flash frames={4} />
    </AbsoluteFill>
  );
};
const Built: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame(); const t = sp(f, 10, 260);
  return (
    <AbsoluteFill>
      <BG kind="gold" /><Streaks />
      <Punch amt={0.03}>
        <AbsoluteFill style={{padding: '300px 64px 420px', fontFamily: 'Cairo', justifyContent: 'center'}}>
          <div style={{fontWeight: 800, fontSize: 110, color: INK, textAlign: 'center', direction: 'rtl', transform: `scale(${2 - Math.min(1, t)})`, opacity: Math.min(1, t * 2), marginBottom: 20}}>شو بنينا؟</div>
          {d.learn.map((x, i) => {const s = sp(f - FPB * (1 + i * 2), 9, 240); const from = i % 2 ? -1 : 1; return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '30px 32px', marginTop: 26, borderRadius: 30, background: INK, color: '#fff', direction: 'rtl',
              fontWeight: 800, fontSize: 48, lineHeight: 1.3, boxShadow: '0 24px 50px rgba(60,40,0,.4)', opacity: Math.min(1, s * 2),
              transform: `translateX(${(1 - Math.min(1, s)) * 700 * from}px) rotate(${(1 - Math.min(1, s)) * 8 * from}deg)`}}>
              <div style={{flex: 'none', fontSize: 110, lineHeight: .8, color: 'transparent', WebkitTextStroke: `3px ${GOLD_LT}`, direction: 'ltr', width: 150, textAlign: 'center'}}>0{i + 1}</div>
              <div>{x}</div>
            </div>);})}
        </AbsoluteFill>
      </Punch>
      <Flash frames={4} color="#fff" />
    </AbsoluteFill>
  );
};
const Progress: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame();
  const v = interpolate(f, [0, FPB], [n - 1, n], {...clamp, easing: Easing.out(Easing.back(2))});
  const r = 190, c = 2 * Math.PI * r; const s = sp(f - FPB * 1.5, 10, 220);
  return (
    <AbsoluteFill>
      <BG kind="sky" /><Rays /><Streaks />
      <Punch amt={0.05}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '300px 70px 420px', fontFamily: 'Cairo'}}>
          <div style={{position: 'relative', width: 460, height: 460, filter: 'drop-shadow(0 20px 40px rgba(201,162,75,.6))'}}>
            <svg width={460} height={460} viewBox="0 0 460 460"><defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1C4" /><stop offset=".5" stopColor="#E2B95A" /><stop offset="1" stopColor="#8F6A1F" /></linearGradient></defs>
              <circle cx={230} cy={230} r={r} fill="none" stroke="rgba(0,0,0,.1)" strokeWidth={40} />
              <circle cx={230} cy={230} r={r} fill="none" stroke="url(#eg)" strokeWidth={40} strokeLinecap="round" strokeDasharray={`${(c * Math.min(30, v)) / 30} ${c}`} transform="rotate(-90 230 230)" /></svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', direction: 'ltr'}}>
              <div style={{fontWeight: 800, fontSize: 190, lineHeight: 1}}>{n}</div><div style={{fontWeight: 800, fontSize: 48, opacity: .55}}>/ 30</div></div>
          </div>
          <div style={{marginTop: 40, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - Math.min(1, s)) * 200}px)`, display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl',
            background: INK, color: '#fff', padding: '24px 30px', borderRadius: 30, fontWeight: 800, fontSize: 40, boxShadow: '0 20px 40px rgba(0,0,0,.3)'}}>
            <div style={{...glossy, flex: 'none', width: 90, height: 90, borderRadius: 26}}><Icon name={d.next ? d.next.icon : 'trophy'} size={52} /></div>
            <div><div style={{fontSize: 28, color: GOLD_LT}}>{d.next ? 'بكرة' : 'خلصنا!'}</div>{d.next ? d.next.title : 'انتهى التحدي'}</div>
          </div>
        </AbsoluteFill>
      </Punch>
      {n % 5 === 0 && <Confetti />}
      {n % 5 === 0 && <Banner text={n === 30 ? 'خلّصنا التحدي!' : 'خلّصنا مرحلة!'} />}
      <Shock color={GOLD} /><Flash frames={5} color="#fff" />
    </AbsoluteFill>
  );
};
export const Confetti: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 120}).map((_, i) => {
        const a = random('ca' + i) * Math.PI * 2, v = 16 + random('cv' + i) * 30, g = 0.7;
        const x = W / 2 + Math.cos(a) * v * f, y = H * 0.42 + Math.sin(a) * v * f + g * f * f, r = 10 + random('cr' + i) * 16;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r * 0.5, borderRadius: 3, background: i % 3 === 0 ? INK : i % 3 === 1 ? GOLD_LT : '#fff',
          transform: `rotate(${f * 14 + i * 33}deg)`, opacity: interpolate(f, [0, 55], [1, 0], clamp)}} />;
      })}
    </AbsoluteFill>
  );
};
export const Banner: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame(); const s = sp(f - 4, 9, 220);
  return <div style={{position: 'absolute', top: 300, left: '50%', transform: `translateX(-50%) rotate(-4deg) scale(${Math.min(1.2, s)})`, opacity: Math.min(1, s * 2),
    background: INK, color: GOLD_LT, fontFamily: 'Cairo', fontWeight: 800, fontSize: 64, padding: '12px 40px', borderRadius: 20, border: `4px solid ${GOLD_LT}`, direction: 'rtl', whiteSpace: 'nowrap',
    boxShadow: '0 20px 40px rgba(0,0,0,.35)'}}>{text}</div>;
};
const Cta: React.FC<{n: number}> = ({n}) => {
  const d = DAYS[n - 1]; const f = useCurrentFrame(); const beat = Math.exp(-((f % FPB) / FPB) * 6);
  const p = sp(f, 10, 200); const q = sp(f - FPB * 2, 9, 260);
  return (
    <AbsoluteFill>
      <BG kind="dark" /><Rays dark /><Streaks dark />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '280px 60px 420px', fontFamily: 'Cairo'}}>
        <div style={{position: 'relative', transform: `scale(${(0.4 + 0.6 * Math.min(1, p)) * (1 + 0.03 * beat)})`}}>
          {[0, 1].map((k) => {const r = ((f + k * 7) % FPB) / FPB; return <div key={k} style={{position: 'absolute', left: '50%', top: '50%', width: 360, height: 360, borderRadius: '50%',
            border: `5px solid ${GOLD_LT}`, transform: `translate(-50%,-50%) scale(${1 + r * .8})`, opacity: (1 - r) * .7}} />;})}
          <div style={{width: 320, height: 420, padding: 8, borderRadius: '160px 160px 36px 36px', background: 'linear-gradient(160deg,#FFF1C4,#E8C066 35%,#C9A24B 65%,#8F6A1F)', boxShadow: '0 0 100px 24px rgba(255,200,90,.5)'}}>
            <Img src={staticFile('portrait.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', borderRadius: '152px 152px 28px 28px', background: '#000'}} />
          </div>
        </div>
        <div style={{marginTop: 50}}><Slam text={d.cta} size={fitSize(d.cta, 70, 56)} color="#fff" start={FPB} stagger={2} /></div>
        <div style={{marginTop: 34, fontWeight: 800, fontSize: 130, direction: 'rtl', transform: `scale(${(0.3 + .7 * Math.min(1, q)) * (1 + .08 * beat)})`, opacity: Math.min(1, q * 2),
          ...goldText, filter: 'drop-shadow(0 0 30px rgba(232,192,102,.7))'}}>تابعني</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, fontSize: 32, fontWeight: 800, color: '#e9e2cf', direction: 'rtl', opacity: Math.min(1, q)}}>
          <Logo name="github" size={34} color="#e9e2cf" />الكود كامل بأول تعليق</div>
      </AbsoluteFill>
      <Flash frames={6} color="#E8C066" />
      <Sign start={FPB * 8} />
    </AbsoluteFill>
  );
};
// توقيع: شريط ذهبي بيكشف الشعار
export const Sign: React.FC<{start: number}> = ({start}) => {
  const f = useCurrentFrame() - start; if (f < 0) return null;
  const w = interpolate(f, [0, 10], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)});
  const o = interpolate(f, [8, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: `rgba(0,0,0,${interpolate(f, [0, 10], [0, .95], clamp)})`, alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo'}}>
      <div style={{width: `${w}%`, height: 6, background: 'linear-gradient(90deg,transparent,#E8C066,transparent)'}} />
      <div style={{marginTop: 26, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, fontWeight: 800, fontSize: 34, letterSpacing: 7, color: '#fff', direction: 'ltr'}}>
        INNOVATE <span style={{color: GOLD_LT}}>•</span> AUTOMATE <span style={{color: GOLD_LT}}>•</span> TRANSFORM</div>
      <div style={{marginTop: 18, opacity: o, fontFamily: 'Playfair', fontWeight: 700, fontSize: 44, ...goldText}}>Mohammed Abu Saada</div>
    </AbsoluteFill>
  );
};

export const Header: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame(); const o = interpolate(f, [FPB * 1.5, FPB * 2], [0, 1], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: 'rgba(0,0,0,.2)'}}><div style={{height: '100%', width: `${(f / total) * 100}%`, background: 'linear-gradient(90deg,#8F6A1F,#E8C066,#FFF1C4)'}} /></div>
      <div style={{position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', opacity: o, display: 'flex', alignItems: 'center', gap: 16, direction: 'ltr',
        background: 'rgba(17,17,17,.85)', padding: '8px 28px 8px 8px', borderRadius: 99, border: '2px solid rgba(232,192,102,.7)'}}>
        <Img src={staticFile('avatar.jpg')} style={{width: 66, height: 66, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${GOLD_LT}`}} />
        <div style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 28, color: '#fff'}}>Mohammed Abu Saada</div>
      </div>
    </AbsoluteFill>
  );
};

export const EnergyReel: React.FC<{day: number}> = ({day}) => {
  const P = planOf(day); let at = 0; const total = energyFrames(day);
  const nn = String(day).padStart(2, '0');
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Cairo'}}>
      {P.map(([kind, beats, extra], i) => {
        const from = at; const dur = beats * FPB + (i === P.length - 1 ? 20 : 0); at += beats * FPB;
        const el = kind === 'intro' ? <Intro n={day} /> : kind === 'phrase' ? <Phrase n={day} text={extra.text} i={extra.i} /> : kind === 'problemTitle' ? <ProblemTitle />
          : kind === 'problem' ? <Problem n={day} /> : kind === 'flow' ? <Flow n={day} /> : kind === 'code' ? <Code n={day} beats={beats} />
          : kind === 'built' ? <Built n={day} /> : kind === 'progress' ? <Progress n={day} /> : <Cta n={day} />;
        return <Sequence key={i} from={from} durationInFrames={dur}>{el}</Sequence>;
      })}
      <Header total={total} />
      <Audio src={staticFile(`audio/energy/day-${nn}.wav`)} />
    </AbsoluteFill>
  );
};
