import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Confetti, Rays, Shake, Sign, clamp} from './EnergyReel';
import {Big, Code, FPS, Float, In, Kind, Leak, Pill, SceneFC, Slash, Stage, Tile, ltr} from './voiceKit';
import {Sequence} from 'remotion';

// ريل اليوم 2 (أول سلسلة LangChain) — نفس منهجية ريل اليوم 1.
// كل زمن هون بالثواني من بداية صوت محمد (voiceDay02.json)، وT(s) بتحوّله لزمن المشهد.

export const KIND2: Record<string, Kind> = {
  hook: 'dark', one: 'dark', three: 'gold', prompt: 'sky', model: 'dark', parser: 'sky', tape: 'dark', easier: 'gold',
  pipe: 'dark', factory: 'sky', letsgo: 'gold', code: 'dark', run: 'dark', sorry: 'sky', stream: 'dark', whatsapp: 'sky',
  golden: 'gold', github: 'dark', ask: 'sky', next: 'dark', outro: 'dark',
};

// الكود الحقيقي من day-02/app.py (مقسوم لأسطر قصيرة)
const APP = [
  'prompt = ChatPromptTemplate.from_template(',
  '    "لخّص النص في 3 نقاط: {text}")',
  '',
  'chain = prompt | get_llm() | StrOutputParser()',
  '',
  'print(chain.invoke({"text": article}))',
];
const ONE_LINE = 'prompt | llm | parser';

// المخرجات الحقيقية من tools/demo_outputs/day-02.txt (مختصرة)
const OUT = [
  '1. الذكاء الاصطناعي التوليدي يغيّر طريقة عمل الفرق التقنية.',
  '2. بيقدر يقوم بأدوار متعددة ويقدم حلول عامة.',
  '3. وممكن يغيّر نماذج العمل التقليدية.',
];
const SORRY = 'عذرًا على الالتباس، لكن النص الذي قدمته لم يكن مكتملاً…';

// بطاقة قطعة: أيقونة + الاسم الإنجليزي + تعريف بكلمتين
const PieceTile: React.FC<{icon: string; en: string; ar: string; size?: number; dark?: boolean}> = ({icon, en, ar, size = 230, dark}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
    <Tile size={size}><Icon name={icon} size={size * 0.6} weight="duotone" /></Tile>
    <div style={{fontWeight: 800, fontSize: size * 0.3, color: dark ? '#fff' : INK, ...ltr}}>{en}</div>
    {ar ? <div style={{fontWeight: 800, fontSize: size * 0.17, color: dark ? '#e9e2cf' : '#3a3220'}}>{ar}</div> : null}
  </div>
);

// شاشة تيرمنال
export const Term: React.FC<{children: React.ReactNode; title?: string}> = ({children, title = 'Terminal'}) => (
  <div style={{width: 940, borderRadius: 30, overflow: 'hidden', background: '#0b0b0b', border: `3px solid ${GOLD}`, boxShadow: '0 0 80px rgba(232,192,102,.25),0 40px 80px rgba(0,0,0,.5)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 26px', background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', ...ltr}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 20, height: 20, borderRadius: '50%', background: INK, opacity: 0.75}} />)}
      <Icon name="terminal-window" size={34} color={INK} style={{marginLeft: 16}} />
      <div style={{fontWeight: 800, fontSize: 26, color: INK}}>{title}</div>
    </div>
    <div style={{padding: '28px 34px', minHeight: 420}}>{children}</div>
  </div>
);

// ختم مائل (للنكت)
export const Stamp: React.FC<{children: React.ReactNode; rot?: number; size?: number}> = ({children, rot = -5, size = 70}) => (
  <div style={{transform: `rotate(${rot}deg)`, background: '#fff', color: INK, fontWeight: 800, fontSize: size, padding: '12px 44px', borderRadius: 18,
    border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD_LT}`, direction: 'rtl', whiteSpace: 'nowrap'}}>{children}</div>
);

// كلمات بتطلع وحدة وحدة (stream)
const StreamText: React.FC<{text: string; from: number; perWord?: number; size?: number; color?: string}> = ({text, from, perWord = 0.16, size = 50, color = '#fff'}) => {
  const f = useCurrentFrame(); const ws = text.split(' ');
  const n = Math.max(0, Math.floor((f - from * FPS) / (perWord * FPS)));
  return <div style={{direction: 'rtl', fontWeight: 800, fontSize: size, lineHeight: 1.5, color, textAlign: 'right'}}>
    {ws.slice(0, n).map((w, i) => <span key={i} style={{display: 'inline-block', margin: '0 8px', ...(i === n - 1 ? {color: GOLD_LT} : {})}}>{w}</span>)}
    {n < ws.length && n > 0 ? <span style={{background: GOLD_LT, color: GOLD_LT, marginRight: 6}}>_</span> : null}
  </div>;
};

export const S2: Record<string, SceneFC> = {
  // «أول ما بلّشت مع لانغ تشين، كنت أكتب كود طويل، بس عشان أوصّل سؤال للنموذج»
  hook: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const scroll = interpolate(f, [T(2.1) * FPS, T(6.0) * FPS], [0, -1500], clamp);
    const wall = Array.from({length: 46}, (_, i) => {
      const r = random('w' + i); const ind = '    '.repeat(Math.floor(r * 3));
      return ind + ['msgs = [{"role": "user", "content": q}]', 'resp = requests.post(URL, json=body)', 'if resp.status_code != 200:', 'text = resp.json()["choices"][0]', 'text = text.strip().split("\\n")', 'for line in text:', 'out.append(clean(line))', 'headers = {"Authorization": key}', 'except Exception as e:', 'retry += 1'][i % 10];
    });
    return <Stage>
      <In at={0} pop><div style={{display: 'flex', alignItems: 'center', gap: 26, ...ltr}}>
        <Tile size={150} r={0.3}><Logo name="langchain" size={100} /></Tile>
        <Big size={88} gold style={ltr}>LangChain</Big></div></In>
      <In at={T(2.1)} style={{marginTop: 50}}>
        <div style={{position: 'relative', width: 920, height: 640, borderRadius: 30, overflow: 'hidden', background: '#0b0b0b', border: `3px solid ${GOLD}`, boxShadow: '0 0 60px rgba(232,192,102,.25)'}}>
          <div style={{transform: `translateY(${scroll}px)`, padding: '24px 30px', fontFamily: 'monospace', fontSize: 27, lineHeight: 1.55, color: '#bfb498', whiteSpace: 'pre', ...ltr}}>
            {wall.map((l, i) => <div key={i}><span style={{color: '#5d5034', marginRight: 16}}>{String(i + 1).padStart(3, ' ')}</span>{l}</div>)}
          </div>
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0b0b0b 0,transparent 18%,transparent 70%,#0b0b0b 100%)'}} />
        </div></In>
      <In at={T(3.0)} rot={-20} pop style={{marginTop: -60}}><Stamp rot={-6}>كود طويل عريض</Stamp></In>
    </Stage>;
  },
  // «وطلع الموضوع كله سطر واحد»
  one: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} y={-120}><Big size={96}>طلع الموضوع كله</Big></In>
      <In at={T(8.2)} pop style={{marginTop: 50}}><div style={{background: INK, borderRadius: 26, padding: '6px 50px', border: `4px solid ${GOLD_LT}`}}><Big size={150} gold>سطر واحد</Big></div></In>
      <In at={T(8.5)} style={{marginTop: 60}}>
        <div style={{background: '#0b0b0b', border: `3px solid ${GOLD}`, borderRadius: 24, padding: '22px 44px', fontFamily: 'monospace', fontSize: 52, color: '#f3ead2', boxShadow: '0 0 60px rgba(232,192,102,.3)', ...ltr}}>
          {ONE_LINE.split('|').map((p, i) => <React.Fragment key={i}>{i > 0 && <span style={{color: INK, background: GOLD_LT, borderRadius: 8, padding: '0 8px'}}>|</span>}{p}</React.Fragment>)}
        </div></In>
    </Stage>;
  },
  // «أي تطبيق ذكاء اصطناعي فيه ثلاث قطع»
  three: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={110} color={INK}>أي تطبيق<br />ذكاء اصطناعي</Big></In>
      <In at={T(11.35)} style={{marginTop: 40}}><Pill dark size={64}><Icon name="puzzle-piece" size={60} />فيه <span style={ltr}>3</span> قطع</Pill></In>
      <div style={{display: 'flex', gap: 36, marginTop: 60, ...ltr}}>
        {['chat-text', 'brain', 'list-checks'].map((ic, i) => <In key={ic} at={T(11.6) + i * 0.15} pop rot={i % 2 ? 15 : -15}><Tile size={190}><Icon name={ic} size={120} weight="duotone" /></Tile></In>)}
      </div>
    </Stage>;
  },
  // «البرومبت، يعني السؤال اللي إنت بتجهزه»
  prompt: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0}><Pill dark size={46}><span>القطعة</span><span style={ltr}>1</span></Pill></In>
      <In at={0.1} pop style={{marginTop: 50}}><Float><PieceTile icon="chat-text" en="Prompt" ar="" size={300} /></Float></In>
      <In at={T(12.85)} style={{marginTop: 30}}><Pill size={58}><Icon name="pencil-simple" size={54} color={INK} />السؤال اللي بتجهزه</Pill></In>
    </Stage>;
  },
  // «النموذج، اللي بيفكر وبيجاوب»
  model: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <In at={0} x={200} y={0}><Pill size={46}><span>القطعة</span><span style={ltr}>2</span></Pill></In>
      <In at={0.1} pop style={{marginTop: 50}}>
        <div style={{filter: `drop-shadow(0 0 ${30 + Math.sin(f / 5) * 15}px rgba(255,210,80,.6))`}}><PieceTile icon="brain" en="LLM" ar="" size={300} dark /></div></In>
      <In at={T(15.66)} style={{marginTop: 30}}><Pill dark size={58}><Icon name="lightning" size={54} />بيفكر وبيجاوب</Pill></In>
      <In at={T(16.2)} pop style={{marginTop: 30}}><div style={{display: 'flex', alignItems: 'center', gap: 16, ...ltr}}><Logo name="qwen" size={60} /><span style={{fontWeight: 800, fontSize: 44, color: '#e9e2cf'}}>Qwen 2.5</span></div></In>
    </Stage>;
  },
  // «والبارسر، اللي بيرتب إلك الجواب»
  parser: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0}><Pill dark size={46}><span>القطعة</span><span style={ltr}>3</span></Pill></In>
      <In at={0.1} pop style={{marginTop: 50}}><Float><PieceTile icon="list-checks" en="Parser" ar="" size={300} /></Float></In>
      <In at={T(18.59)} style={{marginTop: 30}}><Pill size={58}><Icon name="sparkle" size={54} color={INK} />بيرتب الجواب</Pill></In>
    </Stage>;
  },
  // «وأنا كنت أربطهم ببعض يدويًا، زي اللي بيصلّح أي عطل بشريط لاصق: بيمشي الحال، بس مش مرتّب»
  tape: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const tapeAt = T(25.0) * FPS;
    const tape = (i: number) => {
      const p = interpolate(f, [tapeAt + i * 4, tapeAt + i * 4 + 6], [0, 1], clamp);
      return <div style={{position: 'absolute', top: '42%', left: i === 0 ? 205 : 455, width: 190 * p, height: 64, background: 'rgba(240,228,196,.88)',
        transform: `rotate(${i ? 10 : -12}deg)`, boxShadow: '0 6px 14px rgba(0,0,0,.45)', borderLeft: '3px dashed rgba(0,0,0,.15)', borderRight: '3px dashed rgba(0,0,0,.15)'}} />;
    };
    return <Shake power={18} frames={10}><Stage>
      <In at={0} y={-100}><Big size={84}>كنت أربطهم <span style={goldText}>بإيدي</span></Big></In>
      <div style={{position: 'relative', display: 'flex', gap: 30, marginTop: 70, ...ltr}}>
        {[['chat-text', -9, 0], ['brain', 7, 30], ['list-checks', -4, -20]].map(([ic, r, y], i) =>
          <In key={ic as string} at={T(21.5) + i * 0.2} pop rot={r as number}><div style={{transform: `rotate(${r}deg) translateY(${y}px)`}}><Tile size={200}><Icon name={ic as string} size={120} weight="duotone" /></Tile></div></In>)}
        {tape(0)}{tape(1)}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, marginTop: 70}}>
        <In at={T(26.14)} pop><Pill size={60}><Icon name="thumbs-up" size={56} color={INK} />بيمشي الحال</Pill></In>
        <In at={T(27.31)} pop rot={25}><Stamp rot={5} size={74}>بس مش مرتّب</Stamp></In>
      </div>
    </Stage></Shake>;
  },
  // «لانغ تشين بتقلك: في طريقة أسهل، اربطهم بخط»
  easier: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const line = interpolate(f, [T(31.4) * FPS, T(32.3) * FPS], [0, 100], clamp);
    return <Stage>
      <In at={0} pop><Tile size={260} r={0.5}><Logo name="langchain" size={170} /></Tile></In>
      <In at={T(30.06)} style={{marginTop: 50}}><Big size={120} color={INK}>في طريقة أسهل</Big></In>
      <In at={T(31.29)} style={{marginTop: 40}}><div style={{display: 'flex', alignItems: 'center', gap: 0, ...ltr}}>
        {['chat-text', 'brain', 'list-checks'].map((ic, i) => <React.Fragment key={ic}>
          {i > 0 && <div style={{width: 110, height: 14, background: INK, borderRadius: 7, transform: `scaleX(${Math.min(1, Math.max(0, line / 50 - (i - 1)))})`, transformOrigin: 'left'}} />}
          <Tile size={150}><Icon name={ic} size={90} weight="duotone" /></Tile>
        </React.Fragment>)}
      </div></In>
    </Stage>;
  },
  // «برومبت، خط، نموذج، خط، بارسر. والخط هاد اسمه بايب»
  pipe: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const node = (en: string, ic: string, at: number) => <In at={T(at)} pop><div style={{display: 'flex', alignItems: 'center', gap: 24, background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, borderRadius: 30, padding: '18px 40px', width: 560, ...ltr}}>
      <Icon name={ic} size={70} weight="duotone" /><span style={{fontWeight: 800, fontSize: 70, color: '#fff'}}>{en}</span></div></In>;
    const bar = (at: number) => <In at={T(at)} pop><div style={{fontFamily: 'monospace', fontWeight: 900, fontSize: 110, lineHeight: 1, ...goldText, filter: 'drop-shadow(0 0 20px rgba(232,192,102,.6))'}}>|</div></In>;
    const glow = interpolate(f, [T(36.56) * FPS, T(36.56) * FPS + 8], [0, 1], clamp);
    return <>
      <Rays dark />
      <Stage>
        {node('Prompt', 'chat-text', 32.7)}{bar(33.48)}{node('LLM', 'brain', 33.74)}{bar(34.28)}{node('Parser', 'list-checks', 34.46)}
        <In at={T(35.95)} pop style={{marginTop: 40}}><div style={{display: 'flex', alignItems: 'center', gap: 24, background: INK, border: `4px solid ${GOLD_LT}`, borderRadius: 26, padding: '6px 40px',
          boxShadow: `0 0 ${80 * glow}px rgba(232,192,102,.6)`, ...ltr}}>
          <span style={{fontFamily: 'monospace', fontWeight: 900, fontSize: 96, ...goldText}}>|</span><Big size={96} gold style={ltr}>pipe</Big></div></In>
      </Stage>
    </>;
  },
  // «زي خط الإنتاج بالمصنع، كل قطعة بتسلّم اللي بعدها»
  factory: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const belt = (f * 6) % 80;
    return <Stage>
      <In at={0} pop><Big size={96} color={INK}>خط الإنتاج</Big></In>
      <In at={0.2} style={{marginTop: 70}}>
        <div style={{position: 'relative', width: 940, height: 330}}>
          <div style={{position: 'absolute', bottom: 40, left: 0, right: 0, height: 46, borderRadius: 23, background: `repeating-linear-gradient(90deg,#222 0 40px,#3a3a3a 40px 80px)`, backgroundPosition: `${belt}px 0`, border: `4px solid ${INK}`}} />
          <div style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', ...ltr}}>
            {['chat-text', 'brain', 'list-checks'].map((ic, i) => <In key={ic} at={T(38.2) + i * 0.25} pop><Tile size={170}><Icon name={ic} size={100} weight="duotone" /></Tile></In>)}
          </div>
          {[0, 1, 2].map((i) => {
            const x = ((f * 5 + i * 320) % 1100) - 120;
            return <div key={i} style={{position: 'absolute', bottom: 92, left: x, width: 70, height: 60, borderRadius: 12, background: 'linear-gradient(150deg,#F6DE9C,#C9A24B)', border: `4px solid ${INK}`}} />;
          })}
        </div></In>
      <In at={T(38.99)} style={{marginTop: 40}}><Pill dark size={56}><Icon name="arrow-left" size={52} />كل قطعة بتسلّم اللي بعدها</Pill></In>
    </Stage>;
  },
  // «تعالوا نشوف عملي. بفتح في إس كود»
  letsgo: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={150} color={INK}>يلا عملي</Big></In>
      <In at={T(42.55)} pop style={{marginTop: 70}}><div style={{display: 'flex', alignItems: 'center', gap: 30, ...ltr}}>
        <Tile size={200}><Icon name="file-code" size={120} weight="duotone" /></Tile>
        <Big size={100} color={INK} style={ltr}>VS Code</Big></div></In>
      <In at={T(43.6)} style={{marginTop: 40}}><Pill dark size={50}><Logo name="python" size={46} /><span style={ltr}>day-02/app.py</span></Pill></In>
    </Stage>;
  },
  // «وبكتب سلسلة بسطر واحد: قالب بيقول لخّص النص بثلاث نقاط، بعده النموذج، وبعده البارسر»
  code: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0}><Pill size={46}><Icon name="link" size={44} color={INK} />سلسلة بسطر واحد</Pill></In>
      <In at={0.3} style={{marginTop: 46}}><Code lines={APP} from={T(45.3)} to={T(54.2)} hl="|" title="app.py" /></In>
      <div style={{display: 'flex', gap: 18, marginTop: 40, ...ltr}}>
        <In at={T(47.31)} pop><Pill dark size={40}><Icon name="chat-text" size={38} /><span style={ltr}>Prompt</span></Pill></In>
        <In at={T(52.2)} pop><Pill dark size={40}><Icon name="brain" size={38} /><span style={ltr}>LLM</span></Pill></In>
        <In at={T(53.7)} pop><Pill dark size={40}><Icon name="list-checks" size={38} /><span style={ltr}>Parser</span></Pill></In>
      </div>
    </Stage>;
  },
  // «بشغّل الملف بالتيرمنال. طلبت ثلاث نقاط، وطلعولي ثلاث نقاط مرتبة»
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cmd = '$ python day-02/app.py'; const typed = cmd.slice(0, Math.floor(interpolate(f, [T(56.4) * FPS, T(57.6) * FPS], [0, cmd.length], clamp)));
    return <Stage>
      <In at={0}><Term>
        <div style={{fontFamily: 'monospace', fontSize: 36, color: GOLD_LT, ...ltr}}>{typed}<span style={{opacity: Math.floor(f / 8) % 2}}>_</span></div>
        <div style={{marginTop: 26}}>
          {OUT.map((l, i) => <In key={i} at={T(60.06) + i * 0.45} x={-80} y={0}><div style={{direction: 'rtl', textAlign: 'right', fontWeight: 800, fontSize: 38, lineHeight: 1.5, color: '#f3ead2', marginTop: 10}}>{l}</div></In>)}
        </div>
      </Term></In>
      <In at={T(61.33)} pop style={{marginTop: 46}}><Pill size={62}><Icon name="check-circle" size={58} color={INK} /><span style={ltr}>3</span> نقاط مرتبة</Pill></In>
    </Stage>;
  },
  // «بس قبلها، النموذج اعتذر عن خطأ ما صار أصلًا. مؤدب زيادة عن اللزوم»
  sorry: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} y={-80}><Pill dark size={46}><Icon name="warning" size={44} />بس قبلها…</Pill></In>
      <In at={T(63.57)} x={200} y={0} style={{marginTop: 60}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, direction: 'ltr'}}>
          <div style={{background: '#fff', color: INK, fontWeight: 800, fontSize: 46, lineHeight: 1.5, padding: '26px 36px', borderRadius: '36px 36px 8px 36px', width: 700, border: `4px solid ${GOLD}`, direction: 'rtl', boxShadow: '0 24px 50px rgba(30,20,5,.2)'}}>{SORRY}</div>
          <Tile size={110} r={0.5}><Logo name="qwen" size={70} /></Tile>
        </div></In>
      <In at={T(64.61)} pop rot={-20} style={{marginTop: 46}}><Stamp rot={-4} size={60}>على خطأ ما صار أصلًا</Stamp></In>
      <In at={T(66.28)} pop rot={20} style={{marginTop: 46}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Tile size={130} r={0.5}><Icon name="smiley" size={90} /></Tile>
        <Pill dark size={58}>مؤدب زيادة عن اللزوم</Pill></div></In>
    </Stage>;
  },
  // «وإذا بدي الجواب يطلع كلمة كلمة، بغيّر إنفوك لستريم»
  stream: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={100}>كلمة <span style={goldText}>كلمة</span></Big></In>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 60, ...ltr}}>
        <In at={T(70.41)} x={-150} y={0}><div style={{position: 'relative', fontFamily: 'monospace', fontWeight: 800, fontSize: 60, color: '#9b9078', background: '#1a1a1a', padding: '14px 30px', borderRadius: 20, border: '3px solid #444'}}>.invoke()<Slash at={T(71.0)} /></div></In>
        <In at={T(71.0)} pop><Icon name="arrow-right" size={80} weight="bold" /></In>
        <In at={T(71.47)} pop><div style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 64, color: INK, background: GOLD_LT, padding: '14px 34px', borderRadius: 20, boxShadow: '0 0 60px rgba(232,192,102,.6)'}}>.stream()</div></In>
      </div>
      <In at={T(71.5)} style={{marginTop: 50, width: 900}}><Term title="chain.stream()"><StreamText text="الذكاء الاصطناعي التوليدي يغيّر طريقة عمل الفرق التقنية" from={T(71.6)} /></Term></In>
    </Stage>;
  },
  // «والكود كله أقصر من رسالة واتساب عادية»
  whatsapp: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0} style={{alignSelf: 'flex-end'}}>
        <div style={{width: 760, background: '#fff', borderRadius: '36px 36px 8px 36px', padding: '26px 34px', border: `4px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD_LT}`, direction: 'rtl'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: 36, color: '#555'}}><Icon name="chat-circle-text" size={40} color={INK} />رسالة واتساب</div>
          <div style={{fontWeight: 800, fontSize: 38, lineHeight: 1.5, color: INK, marginTop: 10}}>مرحبا، كيفك؟ شو أخبارك؟ بدي أسألك عن شغلة صغيرة بخصوص موعد بكرة، إذا مش مشكلة…</div>
        </div></In>
      <In at={T(72.84)} pop style={{marginTop: 50}}><div style={{background: '#0b0b0b', border: `3px solid ${GOLD}`, borderRadius: 22, padding: '18px 40px', fontFamily: 'monospace', fontSize: 46, color: '#f3ead2', ...ltr}}>
        {ONE_LINE.split('|').map((p, i) => <React.Fragment key={i}>{i > 0 && <span style={{color: GOLD_LT}}>|</span>}{p}</React.Fragment>)}</div></In>
      <In at={T(73.0)} pop rot={-20} style={{marginTop: 46}}><Pill dark size={70}><Icon name="ruler" size={64} />أقصر</Pill></In>
    </Stage>;
  },
  // «الفكرة: لا تربط الأشياء ببعض يدويًا. ركّب قطع جاهزة، وخلّيها تمشي ورا بعض»
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
          <In at={T(77.92)} pop><div style={{position: 'relative'}}><Big size={104} color={INK}>لا تربط بإيدك.</Big><Slash at={T(79.74)} color={INK} /></div></In>
          <In at={T(80.46)} pop><div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl'}}>
            <Tile size={120}><Icon name="puzzle-piece" size={80} weight="duotone" /></Tile><Big size={100} color={INK}>ركّب قطع.</Big></div></In>
          <In at={T(82.1)} pop><div style={{background: INK, borderRadius: 26, padding: '6px 40px'}}><Big size={78} gold style={{whiteSpace: 'nowrap'}}>وخلّيها تمشي ورا بعض.</Big></div></In>
        </div>
      </Stage>
    </>;
  },
  // «الكود كامل على جيت هَب، والرابط بأول تعليق»
  github: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <In at={0} pop><Tile size={300} r={0.5}><Logo name="github" size={190} /></Tile></In>
      <In at={T(84.95)} style={{marginTop: 40}}><Big size={96}>الكود كامل</Big></In>
      <In at={T(86.63)} style={{marginTop: 40}}><Pill size={56}><Icon name="chat-centered-dots" size={54} color={INK} />الرابط بأول تعليق</Pill></In>
      <In at={T(87.4)} style={{marginTop: 20, transform: `translateY(${Math.abs(Math.sin(f / 5)) * 26}px)`}}><Icon name="arrow-down" size={110} weight="bold" /></In>
    </Stage>;
  },
  // «وإنت، شو أول شي ممكن تبنيه بسلسلة زي هاي؟ اكتبلي بالتعليقات»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const C: [string, string, 'logo' | 'icon', number][] = [['gmail', 'ملخّص إيميلات', 'logo', 90.2], ['translate', 'مترجم', 'icon', 90.6], ['telegram', 'بوت تيليجرام', 'logo', 91.0], ['robot', 'مساعد دعم', 'icon', 91.4]];
    return <Stage>
      <In at={0} pop><Big size={96} color={INK}>شو أول شي<br />ممكن تبنيه؟</Big></In>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 26, marginTop: 60, width: 900}}>
        {C.map(([n, l, k, t], i) => <In key={l} at={T(t)} pop rot={i % 2 ? 12 : -12}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `4px solid ${INK}`, borderRadius: '30px 30px 30px 6px', padding: '14px 30px', boxShadow: `8px 8px 0 ${GOLD_LT}`, direction: 'rtl'}}>
            {k === 'logo' ? <Logo name={n} size={54} color={INK} /> : <Icon name={n} size={54} color={INK} />}<span style={{fontWeight: 800, fontSize: 48, color: INK}}>{l}</span></div></In>)}
      </div>
      <In at={T(92.11)} pop style={{marginTop: 50}}><Pill dark size={56}><Icon name="chat-circle-dots" size={54} />اكتبلي بالتعليقات</Pill></In>
    </Stage>;
  },
  // «وتابعني، لأنه بكرة بنعلّم النموذج يحكي بثلاث لهجات»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(93.9) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 110, padding: '10px 80px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={130} color="#fff" /></div>
      </div></In>
      <In at={T(94.74)} style={{marginTop: 110}}>
        <div style={{width: 820, borderRadius: 36, padding: '34px 44px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontWeight: 800, fontSize: 48, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>3</span></div>
            <Tile size={100} r={0.3}><Icon name="translate" size={64} /></Tile>
          </div>
          <div style={{fontWeight: 800, fontSize: 64, color: '#fff', marginTop: 14}}>النموذج بيحكي <span style={goldText}>بثلاث لهجات</span></div>
        </div></In>
      <Sequence from={Math.round(T(97.78) * FPS)} durationInFrames={60}><Confetti /></Sequence>
    </Stage>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
