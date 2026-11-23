import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, Solid, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {lightLeak} from '@remotion/effects/light-leak';
import {GOLD, GOLD_LT, H, INK, Icon, Logo, W, glossy, goldText} from './brand';
import {BG, Confetti, Flash, Rays, Shake, Shock, Sign, Streaks, clamp, sp} from './EnergyReel';
import V1 from './voiceDay01.json';

// ريل بصوت محمد: المشاهد والترجمة على توقيت الصوت (بالثواني من voiceDay01.json)
const FPS = 30;
type Page = {s: number; e: number; w: [string, number][]};
type Plan = {off: number; end: number; scenes: [string, number, number][]; pages: Page[]};
const PLANS: Record<number, Plan> = {1: V1 as any};
export const voiceFrames = (day: number) => Math.round(PLANS[day].end * FPS);
const KIND: Record<string, 'dark' | 'sky' | 'gold'> = {hook: 'dark', four: 'dark', letsgo: 'gold', subs: 'sky', locked: 'dark', hf: 'dark', diff: 'gold', restaurant: 'dark',
  recipe: 'sky', step1: 'sky', env: 'dark', warn: 'dark', step2: 'dark', qwen: 'sky', step3: 'dark', chat: 'sky', golden: 'gold', github: 'dark', ask: 'sky', next: 'dark', outro: 'dark'};

// ── أدوات ──
const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};
const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{top: 230, height: 1040, bottom: 'auto', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo', padding: '0 70px'}}><div style={{transform: 'scale(1.1)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{children}</div></AbsoluteFill>
);
// ظهور بنابض عند زمن صوتي معيّن (t بالثواني من بداية المشهد)
const In: React.FC<{at: number; children: React.ReactNode; y?: number; x?: number; rot?: number; style?: React.CSSProperties; pop?: boolean}> = ({at, children, y = 60, x = 0, rot = 0, style, pop}) => {
  const f = useCurrentFrame(); const s = sp(f - at * FPS, pop ? 9 : 13, pop ? 260 : 180); const k = Math.min(1, s);
  return <div style={{opacity: Math.min(1, s * 2), transform: `translate(${(1 - s) * x}px,${(1 - s) * y}px) scale(${pop ? 0.3 + 0.7 * s : 1}) rotate(${(1 - k) * rot}deg)`, ...style}}>{children}</div>;
};
const Tile: React.FC<{size: number; children: React.ReactNode; r?: number; style?: React.CSSProperties}> = ({size, children, r = 0.28, style}) => (
  <div style={{...glossy, width: size, height: size, borderRadius: size * r, ...style}}>{children}</div>
);
const Pill: React.FC<{children: React.ReactNode; dark?: boolean; size?: number; style?: React.CSSProperties}> = ({children, dark, size = 44, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: size, padding: `${size * 0.2}px ${size * 0.75}px`, borderRadius: 99, direction: 'rtl', whiteSpace: 'nowrap',
    ...(dark ? {background: INK, color: GOLD_LT, border: `3px solid ${GOLD_LT}`} : {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK, border: '3px solid #F6DE9C'}),
    boxShadow: '0 16px 36px rgba(0,0,0,.28)', ...style}}>{children}</div>
);
const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; gold?: boolean; style?: React.CSSProperties}> = ({children, size = 120, color = '#fff', gold, style}) => (
  <div style={{fontWeight: 800, fontSize: size, lineHeight: 1.25, color, direction: 'rtl', textAlign: 'center', ...(gold ? {...goldText, filter: 'drop-shadow(0 0 30px rgba(232,192,102,.45))'} : {}), ...style}}>{children}</div>
);
const Float: React.FC<{children: React.ReactNode; amp?: number; speed?: number}> = ({children, amp = 14, speed = 22}) => {
  const f = useCurrentFrame();
  return <div style={{transform: `translateY(${Math.sin(f / speed) * amp}px) rotate(${Math.sin(f / (speed * 1.7)) * 2}deg)`}}>{children}</div>;
};
const Slash: React.FC<{at: number; color?: string}> = ({at, color = GOLD_LT}) => {
  const f = useCurrentFrame(); const p = interpolate(f, [at * FPS, at * FPS + 6], [0, 100], clamp);
  return <div style={{position: 'absolute', left: '-8%', top: '50%', width: `${p * 1.16}%`, height: 14, background: color, borderRadius: 9, transform: 'rotate(-12deg)', boxShadow: '0 0 20px rgba(0,0,0,.4)'}} />;
};
// نافذة كود بتنكتب حرف حرف
const Code: React.FC<{lines: string[]; from: number; to: number; hl?: string; title?: string}> = ({lines, from, to, hl, title = 'app.py'}) => {
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
const Leak: React.FC<{seed?: number; frames?: number}> = ({seed = 0, frames = 40}) => {
  const f = useCurrentFrame();
  if (f > frames) return null;
  return <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
    <Solid width={W} height={H} color="#000" effects={[lightLeak({seed, hueShift: 0, progress: interpolate(f, [0, frames], [0, 1], clamp)})]} />
  </AbsoluteFill>;
};
const STEP: React.FC<{n: number; dark?: boolean}> = ({n, dark}) => (
  <In at={0.05} x={200} y={0}><Pill dark={!dark} size={46}><span>الخطوة</span><span style={ltr}>{n}</span></Pill></In>
);
const LINES = ['from huggingface_hub import InferenceClient', '', 'client = InferenceClient("Qwen/Qwen2.5-72B-Instruct")', 'r = client.chat_completion(messages)', 'print(r.choices[0].message.content)'];

// ── المشاهد (t: زمن المشهد بالثواني) ──
const S: Record<string, React.FC<{t0: number}>> = {
  hook: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Float><div style={{position: 'relative'}}>
        <Tile size={380}><Icon name="graphics-card" size={250} weight="duotone" /></Tile>
        <In at={T(1.7)} rot={-30} pop style={{position: 'absolute', right: -150, top: -70}}>
          <div style={{transform: 'rotate(12deg)', display: 'flex', alignItems: 'center', gap: 10, background: GOLD_LT, color: INK, fontWeight: 800, fontSize: 64, padding: '10px 30px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,.4)'}}>
            <Icon name="tag" size={56} color={INK} /><span style={ltr}>$1,999</span></div></In>
      </div></Float></In>
      <In at={T(3.9)} rot={20} pop style={{marginTop: 70}}>
        <div style={{transform: 'rotate(-5deg)', background: '#fff', color: INK, fontWeight: 800, fontSize: 70, padding: '14px 44px', borderRadius: 18, border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD_LT}`, direction: 'rtl'}}>
          للبيع: كلية وحدة</div></In>
    </Stage>;
  },
  four: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cnt = Math.min(4, Math.floor(interpolate(f, [T(6.5) * FPS, T(8.9) * FPS], [1, 4.99], clamp)));
    return <Stage>
      <In at={0} y={-200}><div style={{position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, background: GOLD_LT, color: INK, fontWeight: 800, fontSize: 64, padding: '10px 30px', borderRadius: 20}}>
        <Icon name="tag" size={56} color={INK} /><span style={ltr}>$1,999</span><Slash at={0.2} color={INK} /></div></In>
      <div style={{height: 50}} />
      <In at={0.3}><Code lines={[LINES[0], LINES[2], LINES[3], LINES[4]]} from={T(6.4)} to={T(9.3)} /></In>
      <In at={T(7.9)} pop style={{marginTop: 40}}><Pill size={60}><span style={ltr}>{cnt}</span><span>سطور بس</span></Pill></In>
    </Stage>;
  },
  letsgo: () => <Stage>
    <In at={0} pop><Big size={150} color={INK}>يلا نشوف</Big></In>
    <div style={{display: 'flex', gap: 40, marginTop: 60, ...ltr}}>
      {[1, 2, 3].map((n, i) => <In key={n} at={0.25 + i * 0.18} pop><Tile size={170}><span style={{fontWeight: 800, fontSize: 100, ...goldText}}>{n}</span></Tile></In>)}
    </div>
  </Stage>,
  subs: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const months = Math.floor(interpolate(f, [T(14.4) * FPS, T(16.6) * FPS], [1, 12.99], clamp));
    return <Stage>
      <In at={0} x={-300} y={0}><div style={{display: 'flex', alignItems: 'center', gap: 30, ...ltr}}>
        <Tile size={200}><Icon name="chat-teardrop-text" size={120} weight="duotone" /></Tile>
        <Big size={96} color={INK} style={ltr}>ChatGPT</Big></div></In>
      <In at={T(14.38)} style={{marginTop: 60}}>
        <div style={{width: 760, background: '#fff', borderRadius: 34, padding: '36px 44px', boxShadow: '0 30px 60px rgba(30,20,5,.25)', border: `4px solid ${INK}`, direction: 'rtl'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontWeight: 800, fontSize: 48, color: INK}}><Icon name="receipt" size={56} color={INK} />اشتراك شهري</div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20}}>
            <div style={{fontWeight: 800, fontSize: 40, color: '#555'}}>شهر <span style={ltr}>{months}</span></div>
            <div style={{fontWeight: 800, fontSize: 96, color: INK, ...ltr}}>${months * 20}</div>
          </div>
        </div></In>
    </Stage>;
  },
  locked: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Shake power={26} frames={12}><Stage>
      <In at={0} pop><Tile size={360} r={0.5}><Icon name="lock" size={230} /></Tile></In>
      <In at={T(18.2)} style={{marginTop: 60}}><Big size={92}>النماذج القوية</Big></In>
      <In at={T(19.6)} pop style={{marginTop: 20}}><Pill size={84}>مش إلنا؟</Pill></In>
    </Stage></Shake>;
  },
  hf: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <>
      <Rays dark /><Leak seed={3} frames={45} />
      <Stage>
        <In at={0} pop><Tile size={220} r={0.5}><Icon name="lock-open" size={140} /></Tile></In>
        <In at={T(23.3)} style={{marginTop: 40}}><Pill size={58}><span style={ltr}>Open Source</span></Pill></In>
        <In at={T(24.8)} pop style={{marginTop: 50}}><div style={{filter: `drop-shadow(0 0 ${40 + Math.sin(f / 6) * 15}px rgba(255,210,80,.7))`}}><Logo name="huggingface" size={260} /></div></In>
        <In at={T(26.1)} style={{marginTop: 20}}><Big size={90} gold style={ltr}>Hugging Face</Big></In>
      </Stage>
      <Sequence from={0} durationInFrames={70}><Confetti /></Sequence>
    </>;
  },
  diff: () => <Stage>
    <In at={0} pop><Big size={140} color={INK}>إيش الفرق؟</Big></In>
    <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 70, direction: 'rtl'}}>
      <In at={0.3} x={200} y={0}><Pill dark size={54}><Icon name="lock" size={50} />مسكّر</Pill></In>
      <In at={0.5} pop><span style={{fontWeight: 800, fontSize: 60, color: INK, ...ltr}}>VS</span></In>
      <In at={0.7} x={-200} y={0}><Pill dark size={54}><Icon name="lock-open" size={50} />مفتوح</Pill></In>
    </div>
  </Stage>,
  restaurant: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} y={-80}><Pill size={50}><Icon name="lock" size={46} color={INK} />النموذج المسكّر</Pill></In>
      <div style={{display: 'flex', gap: 60, marginTop: 70, alignItems: 'flex-end', direction: 'rtl'}}>
        <In at={T(32.4)} pop><div style={{textAlign: 'center'}}><Tile size={300}><Icon name="fork-knife" size={190} weight="duotone" /></Tile>
          <div style={{fontWeight: 800, fontSize: 56, color: '#fff', marginTop: 24}}>بتوكل</div></div></In>
        <In at={T(35.7)} pop><div style={{textAlign: 'center', position: 'relative'}}><Tile size={300}><Icon name="door" size={190} weight="duotone" /></Tile>
          <div style={{position: 'absolute', top: -30, left: -30}}><Tile size={120} r={0.5}><Icon name="lock-key" size={70} /></Tile></div>
          <div style={{fontWeight: 800, fontSize: 56, color: '#fff', marginTop: 24}}>المطبخ؟</div></div></In>
      </div>
      <In at={T(36.3)} rot={-15} pop style={{marginTop: 50}}><div style={{transform: 'rotate(-4deg)', background: GOLD_LT, color: INK, fontWeight: 800, fontSize: 58, padding: '10px 40px', borderRadius: 14, border: `5px solid ${INK}`}}>ممنوع الدخول</div></In>
    </Stage>;
  },
  recipe: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const salt = T(45.36) * FPS;
    const items: [string, string][] = [['scroll', 'الأوزان'], ['code', 'الكود'], ['file', 'طريقة التدريب']];
    return <Stage>
      <In at={0} y={-80}><Pill dark size={50}><Icon name="lock-open" size={46} />النموذج المفتوح</Pill></In>
      <In at={T(41.4)} style={{marginTop: 60}}>
        <div style={{width: 780, background: '#fff', borderRadius: 36, padding: '40px 50px', border: `5px solid ${INK}`, boxShadow: `14px 14px 0 ${GOLD_LT}`, direction: 'rtl'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, fontWeight: 800, fontSize: 64, color: INK}}><Icon name="chef-hat" size={72} color={INK} weight="duotone" />الوصفة</div>
          {items.map(([ic, tx], i) => <In key={tx} at={T(42.5) + i * 0.35} x={120} y={0}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, fontWeight: 800, fontSize: 48, color: INK, marginTop: 22}}><Icon name="check-circle" size={50} color={GOLD} />{tx}</div></In>)}
        </div></In>
      <In at={T(45.2)} pop rot={-20} style={{marginTop: 40}}><Pill dark size={64}><Icon name="plus" size={56} weight="bold" />ملح</Pill></In>
      {f > salt && Array.from({length: 40}).map((_, i) => {const k = f - salt; const x = W / 2 - 70 + (random('sx' + i) - 0.5) * 300; const y = 760 + k * (14 + random('sy' + i) * 10) + random('s0' + i) * 60;
        return <div key={i} style={{position: 'absolute', left: x - 70, top: y - 250, width: 10, height: 10, borderRadius: 3, background: '#fff', border: '2px solid #ccc', opacity: interpolate(k, [0, 30], [1, 0], clamp)}} />;})}
    </Stage>;
  },
  step1: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <STEP n={1} />
      <div style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: 60, direction: 'rtl'}}>
        <In at={T(49.0)} pop><Tile size={260}><Logo name="huggingface" size={170} /></Tile></In>
        <In at={T(49.2)} x={-120} y={0}><div style={{fontWeight: 800, fontSize: 64, color: INK}}>حساب جديد</div></In>
      </div>
      <In at={T(51.5)} pop style={{marginTop: 60}}><div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl'}}>
        <Tile size={200} r={0.5}><Icon name="key" size={120} weight="duotone" /></Tile>
        <Big size={86} color={INK} style={ltr}>Token</Big></div></In>
      <In at={T(54.9)} style={{marginTop: 40}}><div style={{background: INK, color: GOLD_LT, fontFamily: 'monospace', fontSize: 52, padding: '14px 40px', borderRadius: 18, ...ltr}}>hf_••••••••••••</div></In>
    </Stage>;
  },
  env: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><div style={{display: 'flex', alignItems: 'center', gap: 26, ...ltr}}><Tile size={170}><Icon name="file" size={100} weight="duotone" /></Tile><Big size={110} gold style={ltr}>.env</Big></div></In>
      <In at={0.3} style={{marginTop: 50}}><Code lines={['HF_TOKEN=hf_••••••••••••']} from={T(57.1)} to={T(58.9)} title=".env" /></In>
    </Stage>;
  },
  warn: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const blink = Math.floor(f / 6) % 2;
    return <Shake power={34} frames={14}><Stage>
      <In at={0} pop><div style={{position: 'relative'}}><Tile size={300} r={0.5}><Logo name="github" size={180} /></Tile>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="x" size={330} color={GOLD_LT} weight="bold" /></div></div></In>
      <In at={0.25} style={{marginTop: 40}}><Pill size={62} style={{opacity: blink ? 1 : 0.75}}><Icon name="warning" size={58} color={INK} />لا ترفعه</Pill></In>
      <In at={T(62.0)} rot={25} pop style={{marginTop: 50}}><div style={{transform: 'rotate(6deg)', background: '#fff', color: INK, fontWeight: 800, fontSize: 70, padding: '12px 44px', borderRadius: 18, border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD_LT}`}}>أنا حكيتلك</div></In>
    </Stage></Shake>;
  },
  step2: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <STEP n={2} dark />
      <In at={0.3} style={{marginTop: 50}}><Code lines={[LINES[0], LINES[1], 'client = InferenceClient(', '    "Qwen/Qwen2.5-72B-Instruct")']} from={T(65.7)} to={T(71.4)} hl="InferenceClient" /></In>
    </Stage>;
  },
  qwen: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Tile size={300} r={0.5}><Logo name="qwen" size={190} /></Tile></In>
      <In at={T(74.4)} style={{marginTop: 40}}><Big size={110} color={INK} style={ltr}>Qwen</Big></In>
      <div style={{display: 'flex', gap: 20, marginTop: 30, direction: 'rtl'}}>
        {['مفتوح المصدر', 'بيحكي عربي', '72B'].map((c, i) => <In key={c} at={T(74.6) + i * 0.15} pop><Pill dark size={40}><span style={c === '72B' ? ltr : {}}>{c}</span></Pill></In>)}
      </div>
    </Stage>;
  },
  step3: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <STEP n={3} dark />
      <In at={0.3} style={{marginTop: 50}}><Code lines={[LINES[3], LINES[4]]} from={T(75.6)} to={T(77.1)} /></In>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, marginTop: 50}}>
        <In at={T(77.2)} pop rot={-30}><div style={{transform: 'rotate(-8deg)', border: `8px solid ${GOLD_LT}`, color: GOLD_LT, fontWeight: 800, fontSize: 90, padding: '0 40px', borderRadius: 20}}>خلصت</div></In>
        <In at={T(79.55)} pop rot={30}><div style={{transform: 'rotate(7deg)', background: GOLD_LT, color: INK, fontWeight: 800, fontSize: 78, padding: '4px 40px', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>آه والله خلصت</div></In>
      </div>
    </Stage>;
  },
  chat: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const ans = 'الـ Transformer بيقرأ الجملة كلها مرة وحدة، وبيعرف قديش كل كلمة مهمة لباقي الكلمات عن طريق آلية الانتباه.';
    const shown = ans.slice(0, Math.floor(interpolate(f, [T(84.7) * FPS, T(88.6) * FPS], [0, ans.length], clamp)));
    return <Stage>
      <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 34}}>
        <In at={T(80.6)} x={-200} y={0} style={{alignSelf: 'flex-start'}}>
          <div style={{background: INK, color: '#fff', fontWeight: 800, fontSize: 46, padding: '24px 36px', borderRadius: '36px 36px 36px 8px', maxWidth: 720, direction: 'rtl'}}>اشرحلي الـ <span style={{color: GOLD_LT}}>Transformer</span> بجملتين</div></In>
        <In at={T(84.4)} x={200} y={0} style={{alignSelf: 'flex-end'}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, direction: 'ltr'}}>
            <div style={{background: '#fff', color: INK, fontWeight: 800, fontSize: 42, lineHeight: 1.5, padding: '26px 36px', borderRadius: '36px 36px 8px 36px', width: 690, minHeight: 120, border: `4px solid ${GOLD}`, direction: 'rtl', boxShadow: '0 24px 50px rgba(30,20,5,.2)'}}>{shown}</div>
            <Tile size={110} r={0.5}><Logo name="qwen" size={70} /></Tile>
          </div></In>
        <div style={{display: 'flex', gap: 20, justifyContent: 'center', direction: 'rtl'}}>
          <In at={T(86.0)} pop><Pill size={42}><Icon name="seal-check" size={42} color={INK} />بالعربي</Pill></In>
          <In at={T(87.4)} pop><Pill size={42}><Icon name="seal-check" size={42} color={INK} />ومرتب</Pill></In>
        </div>
      </div>
    </Stage>;
  },
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <In at={0.15} pop><Big size={110} color={INK}>نموذج قوي.</Big></In>
          <In at={T(90.5)} pop><div style={{display: 'flex', alignItems: 'center', gap: 24, direction: 'rtl'}}><div style={{position: 'relative'}}><Tile size={130}><Icon name="graphics-card" size={86} weight="duotone" /></Tile><Slash at={T(91.6)} color={INK} /></div>
            <Big size={100} color={INK}>بدون <span style={ltr}>GPU</span>.</Big></div></In>
          <In at={T(92.2)} pop><div style={{background: INK, borderRadius: 26, padding: '6px 40px'}}><Big size={100} gold>وبدون ولا شيكل.</Big></div></In>
        </div>
      </Stage>
    </>;
  },
  github: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <In at={0} pop><Tile size={300} r={0.5}><Logo name="github" size={190} /></Tile></In>
      <In at={T(96.5)} style={{marginTop: 40}}><Big size={96}>الكود كامل</Big></In>
      <In at={T(98.6)} style={{marginTop: 40}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Pill size={56}><Icon name="chat-centered-dots" size={54} color={INK} />الرابط بأول تعليق</Pill></div></In>
      <In at={T(99.0)} style={{marginTop: 20, transform: `translateY(${Math.abs(Math.sin(f / 5)) * 26}px)`}}><Icon name="arrow-down" size={110} weight="bold" /></In>
    </Stage>;
  },
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const C: [string, string, number][] = [['meta', 'Llama', 101.4], ['mistralai', 'Mistral', 102.0], ['googlegemini', 'Gemma', 102.55], ['qwen', 'Qwen', 103.1], ['ollama', 'Ollama', 103.6]];
    return <Stage>
      <In at={0} pop><Big size={100} color={INK}>جربت نموذج مفتوح قبل؟</Big></In>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 26, marginTop: 60, width: 900}}>
        {C.map(([l, n, t], i) => <In key={n} at={T(t)} pop rot={i % 2 ? 12 : -12}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `4px solid ${INK}`, borderRadius: '30px 30px 30px 6px', padding: '14px 30px', boxShadow: `8px 8px 0 ${GOLD_LT}`, ...ltr}}>
            <Logo name={l} size={54} color={INK} /><span style={{fontWeight: 800, fontSize: 50, color: INK}}>{n}</span></div></In>)}
      </div>
      <In at={T(104.4)} pop style={{marginTop: 50}}><Pill dark size={56}><Icon name="chat-circle-dots" size={54} />قلّي بالتعليقات</Pill></In>
    </Stage>;
  },
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(105.9) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 110, padding: '10px 80px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={130} color="#fff" /></div>
      </div></In>
      <In at={T(106.9)} style={{marginTop: 110}}>
        <div style={{width: 820, borderRadius: 36, padding: '34px 44px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontWeight: 800, fontSize: 48, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>2</span></div>
            <Logo name="langchain" size={90} />
          </div>
          <div style={{fontWeight: 800, fontSize: 64, color: '#fff', marginTop: 14}}>أول سلسلة <span style={{...ltr, ...goldText}}>LangChain</span></div>
        </div></In>
    </Stage>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};

// ── الترجمة الحيّة: كلمة كلمة، والكلمة الحالية ذهبية ──
const Captions: React.FC<{plan: Plan}> = ({plan}) => {
  const f = useCurrentFrame(); const now = f / FPS - plan.off;
  const sc = plan.scenes.find(([, a, b]) => now >= a && now < b)?.[0] ?? 'hook';
  if (sc === 'outro') return null;
  const page = plan.pages.find((p) => now >= p.s - 0.05 && now < p.e + 0.12);
  if (!page) return null;
  const dark = KIND[sc] === 'dark'; const s = sp((now - page.s + 0.05) * FPS, 12, 260);
  return (
    <div style={{position: 'absolute', top: 1300, left: 60, right: 60, display: 'flex', justifyContent: 'center', fontFamily: 'Cairo', pointerEvents: 'none'}}>
      <div dir="rtl" lang="ar" style={{textAlign: 'center', fontWeight: 800, fontSize: 76, lineHeight: 1.35, transform: `scale(${0.85 + 0.15 * Math.min(1, s)})`, opacity: Math.min(1, s * 2),
        padding: '10px 34px', borderRadius: 28, background: dark ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.7)', backdropFilter: 'blur(6px)'}}>
        {page.w.map(([w, t], i) => {
          const nxt = page.w[i + 1]?.[1] ?? page.e; const active = now >= t && now < nxt; const said = now >= t;
          const k = sp((now - t) * FPS, 10, 300);
          return <span key={i} style={{display: 'inline-block', margin: '0 10px', opacity: said ? 1 : 0.38,
            transform: `scale(${active ? 1 + 0.12 * Math.min(1, k) : 1}) translateY(${active ? -4 : 0}px)`,
            ...(active ? (dark ? goldText : {color: GOLD_LT, background: INK, borderRadius: 14, padding: '0 14px'}) : {color: dark ? '#fff' : INK})}}>{w}</span>;
        })}
      </div>
    </div>
  );
};

// ── الرأس: صورة محمد + اليوم + تقدم السلسلة ──
const Top: React.FC<{day: number; total: number}> = ({day, total}) => {
  const f = useCurrentFrame(); const s = sp(f - 4, 12, 200);
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 9, background: 'rgba(0,0,0,.2)'}}><div style={{height: '100%', width: `${(f / total) * 100}%`, background: 'linear-gradient(90deg,#8F6A1F,#E8C066,#FFF1C4)'}} /></div>
    <div style={{position: 'absolute', top: 100, left: '50%', transform: `translateX(-50%) translateY(${(1 - s) * -120}px)`, display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl',
      background: 'rgba(17,17,17,.86)', padding: '8px 8px 8px 30px', borderRadius: 99, border: '2px solid rgba(232,192,102,.75)', fontFamily: 'Cairo', boxShadow: '0 10px 30px rgba(0,0,0,.3)'}}>
      <Img src={staticFile('avatar.jpg')} style={{width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${GOLD_LT}`}} />
      <div>
        <div style={{fontWeight: 800, fontSize: 30, color: '#fff', lineHeight: 1.15}}>اليوم <span style={{...goldText, ...ltr}}>{day}</span> من <span style={ltr}>30</span></div>
        <div style={{width: 230, height: 8, borderRadius: 9, background: 'rgba(255,255,255,.15)', marginTop: 6, overflow: 'hidden'}}><div style={{height: '100%', width: `${(day / 30) * 100}%`, marginRight: 0, background: GOLD_LT, borderRadius: 9}} /></div>
      </div>
    </div>
  </AbsoluteFill>;
};

// افتتاح: خط ذهبي بينكتب بأول ثانية
const Opening: React.FC = () => {
  const f = useCurrentFrame(); if (f > 24) return null;
  const w = interpolate(f, [0, 12], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)}); const o = interpolate(f, [14, 24], [1, 0], clamp);
  return <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: o}}>
    <div style={{width: `${w}%`, height: 8, background: 'linear-gradient(90deg,transparent,#FFF1C4,#E8C066,transparent)', boxShadow: '0 0 40px #E8C066'}} />
  </AbsoluteFill>;
};

export const VoiceReel: React.FC<{day: number}> = ({day}) => {
  const P = PLANS[day]; const total = voiceFrames(day); const nn = String(day).padStart(2, '0');
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Cairo'}}>
      {P.scenes.map(([k, a, b]) => {
        const from = Math.round((a + P.off) * FPS) + (k === 'hook' ? -Math.round(P.off * FPS) : 0); const to = Math.round((b + P.off) * FPS);
        const Sc = S[k]; const kind = KIND[k];
        return <Sequence key={k} name={k} from={from} durationInFrames={to - from}>
          <BG kind={kind} />{kind === 'dark' ? <Streaks dark /> : null}
          <Sc t0={k === 'hook' ? -P.off : a} />
          {k !== 'hook' && k !== 'outro' ? <Flash frames={4} color={kind === 'dark' ? '#E8C066' : '#FFF6DA'} /> : null}
          {['four', 'hf', 'golden', 'warn'].includes(k) ? <Shock y="40%" color={kind === 'gold' ? INK : GOLD_LT} /> : null}
        </Sequence>;
      })}
      <Captions plan={P} />
      <Top day={day} total={total} />
      <Opening />
      <Audio src={staticFile(`audio/voice/day-${nn}-mix.wav`)} />
    </AbsoluteFill>
  );
};
