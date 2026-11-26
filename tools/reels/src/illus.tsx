import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// رسومات متحركة (SVG) لقصة «الصاحب اللي بينسى والدفتر»: غرفة نوم، شخص بالسرير، دفتر، روبوت.
// كلها بألوان البراند وبتتحرك بالإطار (useCurrentFrame)، بدون صور خارجية.

const C = {
  gold: '#E8C066', goldD: '#C9A24B', goldDD: '#8F6A1F', cream: '#FFF6DF', ink: '#111111',
  skin: '#C98B5D', skinD: '#A66E45', hair: '#1B1410', night: '#0E1628', night2: '#05070D', wood: '#2A1F17',
};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const GoldDefs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFF1C4" /><stop offset=".4" stopColor="#E8C066" /><stop offset=".75" stopColor="#C9A24B" /><stop offset="1" stopColor="#8F6A1F" />
    </linearGradient>
  </defs>
);

// ── غرفة النوم: جدار ليلي/نهاري، شباك بقمر أو شمس، نجوم بتلمع ──
export const Bedroom: React.FC<{day?: number}> = ({day = 0}) => {
  const f = useCurrentFrame();
  const wall = day > 0.5 ? 'linear-gradient(180deg,#3b3020 0%,#1c160e 100%)' : 'linear-gradient(180deg,#14203a 0%,#070b16 100%)';
  return (
    <div style={{position: 'absolute', inset: 0, background: wall, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#f6e2b0 0%,#c9a24b 100%)', opacity: day * 0.55}} />
      <svg viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <GoldDefs id="bg" />
        {/* الشباك */}
        <rect x="620" y="330" width="330" height="400" rx="26" fill={day > 0.5 ? '#9fd0f5' : '#0b1430'} stroke="url(#bg)" strokeWidth="14" />
        <line x1="785" y1="330" x2="785" y2="730" stroke="url(#bg)" strokeWidth="10" />
        <line x1="620" y1="530" x2="950" y2="530" stroke="url(#bg)" strokeWidth="10" />
        {day < 0.5 ? (
          <>
            <circle cx="870" cy="420" r="48" fill={C.cream} />
            <circle cx="890" cy="405" r="44" fill="#0b1430" />
            {Array.from({length: 9}).map((_, i) => <circle key={i} cx={640 + random('sx' + i) * 290} cy={350 + random('sy' + i) * 360} r={2 + random('sr' + i) * 3}
              fill={C.cream} opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 12 + i))} />)}
          </>
        ) : <circle cx="700" cy="420" r="55" fill="#FFE08A" opacity={day} style={{filter: 'drop-shadow(0 0 30px #ffd56a)'}} />}
        {/* أرضية */}
        <rect x="0" y="1300" width="1080" height="620" fill={day > 0.5 ? '#2a2117' : '#0a0d16'} />
        <rect x="0" y="1296" width="1080" height="8" fill="url(#bg)" opacity=".5" />
      </svg>
    </div>
  );
};

// ── الشخص بالسرير ──
export type Pose = 'sleep' | 'awake' | 'confused' | 'sit' | 'read' | 'happy';
export const BedScene: React.FC<{pose: Pose; notebook?: number; nbOpen?: number; nbLines?: number; scale?: number}> = ({pose, notebook = 0, nbOpen = 0, nbLines = 0, scale = 1}) => {
  const f = useCurrentFrame();
  const breathe = pose === 'sleep' ? Math.sin(f / 14) * 6 : 0;
  const lying = pose === 'sleep' || pose === 'awake' || pose === 'confused';
  const blink = Math.floor(f / 4) % 40 === 0;
  return (
    <svg viewBox="0 0 1000 700" width={1000 * scale} height={700 * scale} style={{overflow: 'visible'}}>
      <GoldDefs id="bed" />
      {/* السرير */}
      <rect x="60" y="250" width="40" height="330" rx="14" fill={C.wood} stroke="url(#bed)" strokeWidth="5" />
      <rect x="80" y="420" width="720" height="140" rx="26" fill="#3a2a1d" />
      <rect x="80" y="400" width="720" height="40" rx="18" fill={C.cream} />
      <rect x="110" y="540" width="24" height="90" fill={C.wood} /><rect x="745" y="540" width="24" height="90" fill={C.wood} />
      {/* المخدة */}
      <ellipse cx="210" cy="385" rx="120" ry="42" fill="#fffaf0" stroke="#e9d7ad" strokeWidth="4" />
      {lying ? (
        <g>
          {/* الراس على المخدة */}
          <g transform={`translate(205,${330 + breathe * 0.3})`}>
            <ellipse cx="0" cy="0" rx="62" ry="68" fill={C.skin} />
            <path d="M-62 -10 Q-60 -78 0 -80 Q60 -78 62 -10 Q40 -50 0 -52 Q-40 -50 -62 -10Z" fill={C.hair} />
            <path d="M-48 18 Q0 92 48 18 Q40 60 0 66 Q-40 60 -48 18Z" fill={C.hair} />
            {pose === 'sleep' ? (
              <><path d="M-32 0 Q-20 10 -8 0" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M8 0 Q20 10 32 0" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" /></>
            ) : (
              <><ellipse cx="-20" cy="-2" rx="8" ry={blink ? 1 : pose === 'confused' ? 11 : 9} fill={C.ink} /><ellipse cx="20" cy="-2" rx="8" ry={blink ? 1 : pose === 'confused' ? 11 : 9} fill={C.ink} />
                {pose === 'confused' ? <path d="M-34 -22 L-8 -16 M8 -18 L32 -26" stroke={C.ink} strokeWidth="5" strokeLinecap="round" /> : null}</>
            )}
            {pose === 'confused' ? <ellipse cx="0" cy="38" rx="9" ry="11" fill="#5a2a1a" /> : <path d="M-10 36 Q0 42 10 36" stroke="#5a2a1a" strokeWidth="4" fill="none" strokeLinecap="round" />}
          </g>
          {/* البطانية */}
          <path d={`M250 ${330 - breathe} Q520 ${300 - breathe} 800 360 L800 470 L240 470 Z`} fill="url(#bed)" />
          <path d={`M250 ${330 - breathe} Q520 ${300 - breathe} 800 360`} stroke={C.goldDD} strokeWidth="6" fill="none" />
        </g>
      ) : (
        <g>
          {/* قاعد بالسرير */}
          <path d="M260 470 Q260 300 330 270 L470 270 Q540 300 540 470Z" fill="#1d1d1d" stroke="url(#bed)" strokeWidth="4" />
          <g transform="translate(400,200)">
            <ellipse cx="0" cy="0" rx="62" ry="68" fill={C.skin} />
            <path d="M-62 -10 Q-60 -78 0 -80 Q60 -78 62 -10 Q40 -50 0 -52 Q-40 -50 -62 -10Z" fill={C.hair} />
            <path d="M-48 18 Q0 92 48 18 Q40 60 0 66 Q-40 60 -48 18Z" fill={C.hair} />
            {pose === 'read' ? (
              <><path d="M-30 6 Q-20 0 -8 6" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" /><path d="M8 6 Q20 0 30 6" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" /></>
            ) : <><ellipse cx="-20" cy="-2" rx="8" ry={blink ? 1 : 9} fill={C.ink} /><ellipse cx="20" cy="-2" rx="8" ry={blink ? 1 : 9} fill={C.ink} /></>}
            <path d={pose === 'happy' ? 'M-18 34 Q0 52 18 34' : 'M-10 36 Q0 42 10 36'} stroke="#5a2a1a" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
          <path d="M240 470 Q520 430 800 470 L800 470 L240 470Z" fill="url(#bed)" />
          <rect x="240" y="440" width="560" height="40" rx="18" fill="url(#bed)" />
        </g>
      )}
      {/* الكومودينا والدفتر */}
      <rect x="830" y="420" width="150" height="190" rx="14" fill={C.wood} stroke="url(#bed)" strokeWidth="5" />
      {notebook > 0 && !(pose === 'read' || pose === 'happy') ? (
        <g transform={`translate(905,${410 - notebook * 8}) scale(${notebook})`}>
          <rect x="-55" y="-30" width="110" height="30" rx="6" fill="url(#bed)" style={{filter: `drop-shadow(0 0 ${12 + Math.sin(f / 6) * 6}px #ffd56a)`}} />
          <rect x="-55" y="-30" width="18" height="30" fill={C.goldDD} />
        </g>
      ) : null}
      {(pose === 'read' || pose === 'happy') ? (
        <g transform="translate(400,330)"><MiniBook open={nbOpen} lines={nbLines} /></g>
      ) : null}
    </svg>
  );
};

// دفتر صغير مفتوح بالإيدين
const MiniBook: React.FC<{open: number; lines: number}> = ({open, lines}) => (
  <g>
    <GoldDefs id="mb" />
    <rect x={-130 * open} y="-70" width={130 * open} height="140" rx="8" fill={C.cream} stroke={C.goldD} strokeWidth="4" />
    <rect x="0" y="-70" width="130" height="140" rx="8" fill={open > 0.3 ? C.cream : 'url(#mb)'} stroke={C.goldD} strokeWidth="4" />
    {Array.from({length: 5}).map((_, i) => <rect key={i} x="14" y={-50 + i * 24} width={100 * Math.min(1, Math.max(0, lines * 5 - i))} height="7" rx="3" fill={C.goldDD} opacity=".8" />)}
    {open > 0.5 ? Array.from({length: 5}).map((_, i) => <rect key={'l' + i} x={-116} y={-50 + i * 24} width={100 * Math.min(1, Math.max(0, lines * 5 - i))} height="7" rx="3" fill={C.goldDD} opacity=".8" />) : null}
  </g>
);

// ── دفتر كبير: مسكّر بعنوان، أو مفتوح بأسطر بتنكتب، وبسماكة ──
export const Notebook: React.FC<{w?: number; open?: number; lines?: number; label?: string; thick?: number; erase?: number; flip?: number; glow?: boolean; lineText?: string[]}> =
  ({w = 520, open = 0, lines = 0, label, thick = 1, erase = 0, flip = 0, glow, lineText}) => {
    const f = useCurrentFrame(); const h = w * 0.72;
    const pages = Math.round(2 + thick * 10);
    return (
      <div style={{position: 'relative', width: open > 0.5 ? w * 2 : w, height: h + pages * 3, transition: 'none'}}>
        {/* سماكة */}
        {Array.from({length: pages}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: open > 0.5 ? 0 : 0, right: 0, top: (pages - i) * 3, height: h, borderRadius: 14, background: i % 2 ? '#efe2c2' : '#f7ecd2', border: '2px solid #d6c39a'}} />
        ))}
        {open > 0.5 ? (
          <div style={{position: 'absolute', inset: 0, height: h, display: 'flex', borderRadius: 16, overflow: 'hidden', boxShadow: glow ? `0 0 ${50 + Math.sin(f / 6) * 20}px rgba(255,214,110,.6)` : '0 20px 40px rgba(0,0,0,.45)'}}>
            {[0, 1].map((side) => (
              <div key={side} style={{flex: 1, background: C.cream, borderRight: side === 0 ? `5px solid ${C.goldD}` : 'none', padding: `${w * 0.08}px ${w * 0.07}px`, position: 'relative'}}>
                {Array.from({length: 6}).map((_, i) => {
                  const idx = side * 6 + i; const p = Math.min(1, Math.max(0, lines * 12 - idx));
                  const er = Math.min(1, Math.max(0, erase * 12 - idx));
                  const txt = lineText?.[idx];
                  return <div key={i} style={{height: w * 0.075, marginBottom: w * 0.03, borderBottom: '2px solid #e7d9b8', position: 'relative'}}>
                    {txt ? <div style={{position: 'absolute', right: 0, bottom: 2, fontFamily: 'Cairo', fontWeight: 800, fontSize: w * 0.05, color: '#3a2a12', direction: 'rtl', whiteSpace: 'nowrap',
                      clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, opacity: 1 - er}}>{txt}</div>
                      : <div style={{position: 'absolute', right: 0, bottom: 6, height: w * 0.022, width: `${p * (60 + random('w' + idx) * 35)}%`, borderRadius: 6, background: C.goldDD, opacity: 0.85 * (1 - er)}} />}
                  </div>;
                })}
              </div>
            ))}
            {flip > 0 ? <div style={{position: 'absolute', top: 0, bottom: 0, left: '50%', width: '50%', background: '#fffaf0', transformOrigin: 'left center',
              transform: `perspective(1400px) rotateY(${-180 * flip}deg)`, borderLeft: `4px solid ${C.goldD}`}} /> : null}
          </div>
        ) : (
          <div style={{position: 'absolute', inset: 0, height: h, borderRadius: 18, overflow: 'hidden',
            background: 'linear-gradient(150deg,#FFF1C4 0%,#E8C066 35%,#C9A24B 65%,#8F6A1F 100%)', boxShadow: glow ? `0 0 ${50 + Math.sin(f / 6) * 20}px rgba(255,214,110,.7)` : '0 20px 40px rgba(0,0,0,.45)'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.12, background: C.goldDD}} />
            {label ? <div style={{position: 'absolute', left: '22%', right: '8%', top: '34%', padding: '10px 0', background: C.cream, borderRadius: 10, border: `3px solid ${C.ink}`,
              textAlign: 'center', fontFamily: 'Cairo', fontWeight: 800, fontSize: w * 0.075, color: C.ink, direction: 'ltr'}}>{label}</div> : null}
          </div>
        )}
      </div>
    );
  };

// ── الروبوت (النموذج) ──
export type Mood = 'idle' | 'blank' | 'happy' | 'read' | 'sweat' | 'wrong';
export const Robot: React.FC<{size?: number; mood?: Mood}> = ({size = 300, mood = 'idle'}) => {
  const f = useCurrentFrame();
  const blink = Math.floor(f / 3) % 30 === 0;
  const bob = Math.sin(f / 10) * 6;
  return (
    <svg viewBox="0 0 300 320" width={size} height={size * 320 / 300} style={{overflow: 'visible', transform: `translateY(${bob}px)`}}>
      <GoldDefs id="rb" />
      <line x1="150" y1="40" x2="150" y2="10" stroke="url(#rb)" strokeWidth="8" />
      <circle cx="150" cy="10" r="14" fill="#FFE08A" style={{filter: `drop-shadow(0 0 ${10 + Math.sin(f / 5) * 6}px #ffd56a)`}} />
      <rect x="40" y="40" width="220" height="170" rx="54" fill="#1c1c1c" stroke="url(#rb)" strokeWidth="9" />
      <rect x="64" y="70" width="172" height="110" rx="36" fill="#0b0b0b" />
      {mood === 'blank' ? (
        <text x="150" y="150" textAnchor="middle" fontFamily="Cairo" fontWeight="800" fontSize="80" fill="#E8C066">?</text>
      ) : mood === 'happy' || mood === 'read' ? (
        <><path d="M95 130 Q115 105 135 130" stroke="#E8C066" strokeWidth="12" fill="none" strokeLinecap="round" /><path d="M165 130 Q185 105 205 130" stroke="#E8C066" strokeWidth="12" fill="none" strokeLinecap="round" /></>
      ) : mood === 'wrong' ? (
        <><path d="M95 112 L135 140 M135 112 L95 140" stroke="#E8C066" strokeWidth="11" strokeLinecap="round" /><path d="M165 112 L205 140 M205 112 L165 140" stroke="#E8C066" strokeWidth="11" strokeLinecap="round" /></>
      ) : (
        <><ellipse cx="115" cy="125" rx="18" ry={blink ? 2 : 22} fill="#E8C066" /><ellipse cx="185" cy="125" rx="18" ry={blink ? 2 : 22} fill="#E8C066" /></>
      )}
      {mood === 'sweat' ? <path d={`M248 ${70 + (f % 40)} q10 18 0 26 q-10 -8 0 -26z`} fill="#9fd0f5" /> : null}
      <rect x="85" y="220" width="130" height="90" rx="30" fill="#1c1c1c" stroke="url(#rb)" strokeWidth="8" />
      <circle cx="150" cy="265" r="16" fill="url(#rb)" />
    </svg>
  );
};

// ── Zzz و «؟» ──
export const Zzz: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  return <>{[0, 1, 2].map((i) => {
    const t = ((f + i * 18) % 54) / 54;
    return <div key={i} style={{position: 'absolute', left: x + t * 90 + i * 10, top: y - t * 160, fontFamily: 'Cairo', fontWeight: 800, fontSize: 50 + i * 14, color: C.cream, opacity: Math.sin(t * Math.PI)}}>Z</div>;
  })}</>;
};
export const Marks: React.FC<{x: number; y: number; at: number; n?: number}> = ({x, y, at, n = 3}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return <>{Array.from({length: n}).map((_, i) => {
    const s = spring({frame: f - at - i * 5, fps, config: {damping: 9, stiffness: 200}});
    return <div key={i} style={{position: 'absolute', left: x + (i - 1) * 90, top: y - (i % 2) * 40 + Math.sin(f / 8 + i) * 6, fontFamily: 'Cairo', fontWeight: 800, fontSize: 110,
      color: C.gold, opacity: Math.min(1, s * 1.5), transform: `scale(${s}) rotate(${(i - 1) * 14}deg)`, textShadow: '0 6px 20px rgba(0,0,0,.5)'}}>؟</div>;
  })}</>;
};

// فقاعة كلام
export const Bubble: React.FC<{children: React.ReactNode; side?: 'left' | 'right'; dark?: boolean; size?: number}> = ({children, side = 'right', dark, size = 44}) => (
  <div style={{display: 'inline-block', maxWidth: 760, fontFamily: 'Cairo', fontWeight: 800, fontSize: size, lineHeight: 1.45, padding: '18px 30px', direction: 'rtl',
    borderRadius: side === 'right' ? '32px 32px 8px 32px' : '32px 32px 32px 8px', background: dark ? C.ink : '#fff', color: dark ? '#fff' : C.ink,
    border: `4px solid ${dark ? C.gold : C.ink}`, boxShadow: dark ? '0 16px 30px rgba(0,0,0,.4)' : `8px 8px 0 ${C.gold}`}}>{children}</div>
);

// أفاتار مستخدم صغير
export const Person: React.FC<{size?: number; hue?: number; glow?: boolean}> = ({size = 80, hue = 0, glow}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={glow ? {filter: 'drop-shadow(0 0 12px #ffd56a)'} : undefined}>
    <circle cx="50" cy="50" r="48" fill={['#2a2a2a', '#3a2f22', '#22303a', '#2f2a3a'][hue % 4]} stroke="#C9A24B" strokeWidth="4" />
    <circle cx="50" cy="40" r="17" fill={['#C98B5D', '#E0B48A', '#8D5A3B', '#D8A27A'][hue % 4]} />
    <path d="M20 86 Q50 52 80 86" fill={['#C98B5D', '#E0B48A', '#8D5A3B', '#D8A27A'][hue % 4]} />
  </svg>
);

export const fade = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
