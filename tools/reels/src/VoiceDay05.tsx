import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Confetti, Shake, Sign, clamp} from './EnergyReel';
import {Big, Code, FPS, In, Kind, Leak, Pill, SceneFC, Stage, Tile, ltr} from './voiceKit';
import {Stamp} from './VoiceDay02';
import {BedScene, Bedroom, Bubble, Marks, Notebook, Person, Robot, Zzz} from './illus';

// ريل اليوم 5: «الصاحب اللي بينسى والدفتر» — قصة متحركة بالكامل (رسومات SVG من illus.tsx).
// كل زمن بالثواني من بداية صوت محمد (voiceDay05.json)، وT(s) بتحوّله لزمن المشهد.

export const KIND5: Record<string, Kind> = {
  hook: 'dark', promise: 'dark', friend: 'dark', model: 'dark', idea: 'dark', notebook: 'dark', apps: 'dark', code: 'dark', append: 'sky',
  run: 'sky', notsmart: 'gold', secret: 'dark', session: 'sky', pencil: 'dark', thick: 'dark', db: 'sky', golden: 'gold', save: 'dark',
  ask: 'sky', next: 'dark', outro: 'dark',
};

const sp = (f: number, d = 12, s = 180) => spring({frame: f, fps: FPS, config: {damping: d, stiffness: s}});
const NOTE_LINES = ['إنت: اسمي محمد', 'البوت: أهلًا محمد!', 'إنت: شو اسمي؟'];
const CODE = [
  'prompt = ChatPromptTemplate.from_messages([',
  '  ("system", "…"), MessagesPlaceholder("history"),',
  '  ("human", "{input}")])',
  '',
  'bot = RunnableWithMessageHistory(',
  '    prompt | get_llm(), hist,',
  '    history_messages_key="history")',
  'cfg = {"configurable": {"session_id": "u1"}}',
];
const REPLY = 'أسمك محمد كما قلت لي في البداية. كيف يمكنني أن أساعدك اليوم؟';   // المخرج الحقيقي (demo_outputs/day-05.txt)

// غرفة النوم كمشهد كامل (بتعبي الشاشة)
const Room: React.FC<{children: React.ReactNode; day?: number}> = ({children, day}) => (
  <AbsoluteFill><Bedroom day={day} /><AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300}}>{children}</AbsoluteFill></AbsoluteFill>
);

export const S5: Record<string, SceneFC> = {
  // «بدي أقلك سر: الذكاء الاصطناعي اللي بتحكي معه كل يوم، ما بيتذكرك. ولا كلمة.»
  hook: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const gone = interpolate(f, [T(5.72) * FPS, T(5.72) * FPS + 10], [0, 1], clamp);
    const B: [string, number, number][] = [['اسمي محمد', -300, -360], ['بحب القهوة', 290, -250], ['بشتغل مبرمج', -320, 260], ['ساكن بغزة', 300, 360]];
    return <Stage>
      <In at={T(0.71)} y={-80}><Pill dark size={50}><Icon name="lock-key" size={46} />سر</Pill></In>
      <div style={{position: 'relative', marginTop: 40, width: 900, height: 820, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {B.map(([t, x, y], i) => (
          <div key={t} style={{position: 'absolute', left: 450 + x - 170, top: 410 + y - 40, opacity: 1 - gone, transform: `scale(${1 - gone * 0.4}) rotate(${gone * (i % 2 ? 30 : -30)}deg)`, filter: `blur(${gone * 10}px)`}}>
            <In at={T(1.6) + i * 0.3} pop><Bubble size={38}>{t}</Bubble></In></div>))}
        <In at={0} pop><Robot size={360} mood={f > T(3.98) * FPS ? 'blank' : 'idle'} /></In>
      </div>
    </Stage>;
  },
  // «وبآخر الفيديو رح أوريك كيف بوت ممكن يناديك باسم حدا غيرك. معقول؟ تعالوا نشوف»
  promise: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 30, direction: 'ltr'}}>
        <In at={0.1} pop><Robot size={240} mood="happy" /></In>
        <In at={T(10.14)} pop><Bubble dark size={46}>أهلًا يا <span style={{color: GOLD_LT}}>أحمد!</span></Bubble></In>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 50, direction: 'rtl'}}>
        <In at={T(10.81)} pop><Person size={170} hue={1} /></In>
        <In at={T(11.33)} x={-80} y={0}><Bubble size={42}>بس أنا اسمي محمد…</Bubble></In>
      </div>
      <In at={T(12.14)} pop rot={-20} style={{marginTop: 50}}><Stamp rot={-5} size={70}>معقول؟!</Stamp></In>
      <AbsoluteFill style={{pointerEvents: 'none', opacity: interpolate(f, [T(13.3) * FPS, T(14.4) * FPS], [0, 0.85], clamp), background: '#000'}} />
    </Stage>;
  },
  // «تخيل عندك صاحب، كل يوم بيصحى من النوم ناسي كل إشي. ما بيعرف اسمك، ولا شو حكيتوا مبارح.»
  friend: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const pose = f < T(16.84) * FPS ? 'sleep' : 'confused';
    return <Room>
      <div style={{position: 'relative'}}>
        <In at={0.1} y={40}><BedScene pose={pose} scale={1} /></In>
        {pose === 'sleep' ? <Zzz x={250} y={160} /> : <Marks x={200} y={20} at={T(18.0) * FPS} />}
        <In at={T(19.98)} pop style={{position: 'absolute', left: 430, top: -180}}><Bubble size={40}>إنت مين؟</Bubble></In>
        <In at={T(21.48)} pop style={{position: 'absolute', left: 600, top: -40}}>
          <div style={{width: 200, background: '#fff', border: `5px solid ${INK}`, borderRadius: 20, overflow: 'hidden', textAlign: 'center', fontFamily: 'Cairo', fontWeight: 800}}>
            <div style={{background: GOLD, color: INK, fontSize: 30, padding: '4px 0'}}>مبارح</div><div style={{fontSize: 90, color: INK, lineHeight: 1.2}}>؟</div></div></In>
      </div>
    </Room>;
  },
  // «هاد بالضبط النموذج: كل رسالة بتوصله، كأنها أول رسالة بحياته»
  model: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const msgs: [string, number][] = [['مرحبا!', 24.81], ['اسمي محمد', 26.12], ['شو اسمي؟', 27.22]];
    return <Stage>
      <In at={0} pop><Robot size={300} mood={f > T(26.3) * FPS ? 'blank' : 'idle'} /></In>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40, alignItems: 'center'}}>
        {msgs.map(([m, t]) => <In key={m} at={T(t)} x={160} y={0}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl'}}><Bubble size={40}>{m}</Bubble>
            <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 34, color: INK, background: GOLD_LT, borderRadius: 99, padding: '4px 20px'}}>أول رسالة!</span></div></In>)}
      </div>
    </Stage>;
  },
  // «طيب لو بدك صاحبك هاد يتذكرك، شو بتعمل؟»
  idea: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Room>
      <div style={{position: 'relative'}}>
        <BedScene pose="sleep" />
        <Zzz x={250} y={160} />
        <In at={T(31.76)} pop style={{position: 'absolute', left: 380, top: -260}}><Tile size={200} r={0.5}><Icon name="lightbulb" size={130} /></Tile></In>
      </div>
    </Room>;
  },
  // «بتحطله دفتر جنب السرير، وكل يوم، قبل ما يحكي معك، بيقرأ الدفتر»
  notebook: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const nb = sp(f - T(33.82) * FPS, 9, 200);
    const day = interpolate(f, [T(35.0) * FPS, T(35.8) * FPS], [0, 1], clamp);
    const pose = f < T(36.0) * FPS ? 'sleep' : f < T(37.8) * FPS ? 'awake' : f < T(39.0) * FPS ? 'read' : 'happy';
    const open = interpolate(f, [T(37.9) * FPS, T(38.4) * FPS], [0, 1], clamp);
    const lines = interpolate(f, [T(38.3) * FPS, T(39.5) * FPS], [0, 1], clamp);
    return <Room day={day}>
      <div style={{position: 'relative'}}>
        <BedScene pose={pose} notebook={Math.min(1.2, nb)} nbOpen={open} nbLines={lines} />
        {pose === 'sleep' ? <Zzz x={250} y={160} /> : null}
        <In at={T(33.82)} pop style={{position: 'absolute', right: -10, top: 210}}><Pill dark size={36}><Icon name="bookmark-simple" size={34} />دفتر</Pill></In>
      </div>
    </Room>;
  },
  // «وهيك بتشتغل كل تطبيقات الشات: البرنامج بيكتب المحادثة بدفتر، وبيعطي النموذج الدفتر كامل مع كل رسالة جديدة… هو بس بيقرأ بسرعة»
  apps: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const lines = interpolate(f, [T(43.86) * FPS, T(45.2) * FPS], [0, 0.17], clamp) + interpolate(f, [T(48.3) * FPS, T(49.5) * FPS], [0, 0.17], clamp);
    const fly = (a: number) => interpolate(f, [T(a) * FPS, T(a) * FPS + 14], [0, 1], {...clamp});
    const give = Math.max(fly(45.69) - fly(47.4), fly(49.2) - fly(50.6)) ;
    const fastFlip = f > T(52.74) * FPS ? (f % 6) / 6 : 0;
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl'}}>
        <In at={0} x={200} y={0}><div style={{width: 300, height: 520, borderRadius: 46, background: '#111', border: `6px solid ${GOLD}`, padding: 22, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'flex-end'}}>
          <In at={T(43.06)} pop><Bubble size={28}>اسمي محمد</Bubble></In>
          <In at={T(48.11)} pop><Bubble size={28}>شو اسمي؟</Bubble></In>
          <div style={{height: 50, borderRadius: 25, background: '#222', border: '2px solid #444'}} /></div></In>
        <In at={T(43.06)} pop><Icon name="arrow-left" size={80} weight="bold" /></In>
        <div style={{transform: `translateY(${give * 420}px) scale(${1 - give * 0.3})`}}>
          <In at={T(45.22)} pop><Notebook w={300} open={1} lines={lines} flip={fastFlip} glow={give > 0.1} /></In></div>
      </div>
      <In at={T(45.69)} pop style={{marginTop: 120}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Robot size={230} mood={f > T(52.74) * FPS ? 'read' : 'idle'} />
        {f > T(52.74) * FPS ? <Pill size={44}><Icon name="lightning" size={40} color={INK} />بيقرأ بسرعة</Pill> : null}</div></In>
    </Stage>;
  },
  // «تعال نبني الدفتر بالكود… وبلفّه بأداة اسمها رَنَبِل ويذ ميسِج هيستوري، وأنا بسميها: الدفتر»
  code: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0}><Pill dark size={44}><Logo name="python" size={40} /><span style={ltr}>day-05/app.py</span></Pill></In>
      <In at={0.3} style={{marginTop: 34}}><Code lines={CODE} from={T(57.5)} to={T(65.0)} hl="RunnableWithMessageHistory" title="VS Code — app.py" /></In>
      <In at={T(66.04)} pop style={{marginTop: 34}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <span style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 30, color: GOLD_LT, ...ltr}}>RunnableWithMessageHistory</span>
        <span style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 50, color: '#fff'}}>=</span>
        <Notebook w={140} label="الدفتر" glow /></div></In>
    </Stage>;
  },
  // «كل رسالة بتنكتب فيه، وبتنقرأ مع السؤال الجديد»
  append: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const lines = interpolate(f, [T(68.6) * FPS, T(71.0) * FPS], [0, 3 / 12], clamp);
    return <Stage>
      <In at={0} pop><Notebook w={440} open={1} lines={lines} lineText={NOTE_LINES} /></In>
      <In at={T(71.29)} pop style={{marginTop: 60}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Icon name="arrow-down" size={70} color={INK} weight="bold" /><Robot size={200} mood="read" /></div></In>
    </Stage>;
  },
  // «بشغّل، وبكتب: اسمي محمد… شو اسمي؟… وبيرد: اسمك محمد، كما قلت لي في البداية. تذكّرني!» (الكابشن مخفي — المحادثة على الشاشة)
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const n = Math.floor(interpolate(f, [T(80.3) * FPS, T(82.9) * FPS], [0, REPLY.length], clamp));
    return <Stage>
      <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 26}}>
        <In at={T(75.3)} x={-200} y={0} style={{alignSelf: 'flex-start'}}><Bubble dark size={46}>اسمي محمد</Bubble></In>
        <In at={T(78.31)} x={-200} y={0} style={{alignSelf: 'flex-start'}}><Bubble dark size={46}>شو اسمي؟</Bubble></In>
        <In at={T(79.31)} x={200} y={0} style={{alignSelf: 'flex-end'}}><div style={{display: 'flex', alignItems: 'flex-end', gap: 16, direction: 'ltr'}}>
          <Bubble size={42}>{REPLY.slice(0, n)}{n < REPLY.length ? <span style={{color: GOLD}}>▌</span> : null}</Bubble>
          <Robot size={130} mood={f > T(83.5) * FPS ? 'happy' : 'idle'} /></div></In>
      </div>
      <In at={T(83.52)} pop rot={-20} style={{marginTop: 50}}><Stamp rot={-4} size={80}>تذكّرني!</Stamp></In>
      <Sequence from={Math.round(T(83.52) * FPS)} durationInFrames={60}><Confetti /></Sequence>
    </Stage>;
  },
  // «مش لأنه ذكي… لأنه قرأ الدفتر، مش أكثر»
  notsmart: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 50, direction: 'rtl'}}>
        <In at={T(86.21)} pop><div style={{position: 'relative'}}><Tile size={230} r={0.5}><Icon name="brain" size={150} weight="duotone" /></Tile>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="x" size={260} color={INK} weight="bold" /></div></div></In>
        <In at={T(87.51)} pop><Notebook w={260} label="الدفتر" glow /></In>
      </div>
      <In at={T(87.72)} pop style={{marginTop: 50}}><div style={{background: INK, borderRadius: 26, padding: '6px 40px'}}><Big size={84} gold>قرأ الدفتر، مش أكثر</Big></div></In>
    </Stage>;
  },
  // «لو عندك ألف مستخدم، وكلهم بيكتبوا بنفس الدفتر، البوت رح يناديك محمد…»
  secret: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const into = interpolate(f, [T(93.45) * FPS, T(95.0) * FPS], [0, 1], clamp);
    return <Shake power={f > T(97.47) * FPS && f < T(97.47) * FPS + 12 ? 20 : 0} frames={12}><Stage>
      <div style={{position: 'relative', width: 940, height: 620}}>
        {Array.from({length: 24}).map((_, i) => {
          const a = (i / 24) * Math.PI * 2; const r = 400 - into * 180;
          return <div key={i} style={{position: 'absolute', left: 470 + Math.cos(a) * r - 40, top: 310 + Math.sin(a) * r * 0.62 - 40, opacity: interpolate(f, [T(91.72) * FPS + i, T(92.6) * FPS + i], [0, 1], clamp)}}>
            <Person size={80} hue={i} /></div>;
        })}
        <div style={{position: 'absolute', left: 470 - 150, top: 310 - 110}}><In at={T(94.63)} pop><Notebook w={300} label="دفتر واحد للكل" glow /></In></div>
        <In at={T(92.25)} pop style={{position: 'absolute', left: 0, top: -30}}><Pill dark size={44}><Icon name="users-three" size={40} /><span style={ltr}>1000</span> مستخدم</Pill></In>
      </div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: 30, direction: 'ltr'}}>
        <In at={T(95.54)} pop><Robot size={170} mood="happy" /></In>
        <In at={T(96.73)} pop><Bubble dark size={38}>أهلًا محمد! وصلتك الشاورما؟ 🌯</Bubble></In>
      </div>
      <In at={T(97.47)} pop rot={20} style={{marginTop: 20}}><div style={{display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl'}}><Person size={110} hue={2} /><Bubble size={38}>مين محمد؟! وأي شاورما؟</Bubble></div></In>
    </Stage></Shake>;
  },
  // «عشان هيك كل محادثة إلها رقم خاص، اسمه سيشن آي دي… كل واحد إله دفتره، وما حدا بيقرأ دفتر غيره»
  session: ({t0}) => {
    const T = (s: number) => s - t0;
    const U: [string, number][] = [['u1', 0], ['u2', 1], ['u3', 2]];
    return <Stage>
      <In at={T(105.65)} y={-60}><div style={{background: INK, borderRadius: 22, padding: '6px 34px', fontFamily: 'monospace', fontSize: 50, color: GOLD_LT, ...ltr}}>session_id</div></In>
      <div style={{display: 'flex', gap: 40, marginTop: 60, ...ltr}}>
        {U.map(([id, i]) => <In key={id} at={T(102.28) + i * 0.4} pop><div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <Person size={130} hue={i} />
          <Notebook w={230} label={`session: ${id}`} glow={i === 0} />
          <In at={T(113.95) + i * 0.15} pop><Tile size={80} r={0.5}><Icon name="lock-key" size={50} /></Tile></In>
        </div></In>)}
      </div>
      <In at={T(111.99)} pop style={{marginTop: 40}}><Pill dark size={50}>كل واحد إله دفتره</Pill></In>
    </Stage>;
  },
  // «الأولى: الدفتر هون مكتوب بقلم رصاص، إذا أغلقت البرنامج، بينمسح»
  pencil: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const erase = interpolate(f, [T(123.9) * FPS, T(125.4) * FPS], [0, 1], clamp);
    const ex = interpolate(f, [T(123.9) * FPS, T(125.4) * FPS], [900, -100], clamp);
    return <Stage>
      <In at={T(117.79)} y={-60}><Pill size={46}><span style={ltr}>1</span> · قلم رصاص</Pill></In>
      <div style={{position: 'relative', marginTop: 40}}>
        <In at={0.2}><Notebook w={440} open={1} lines={1} erase={erase} /></In>
        <In at={T(121.85)} pop style={{position: 'absolute', right: -40, top: -60}}><div style={{transform: 'rotate(-35deg)'}}><Tile size={130} r={0.3}><Icon name="pencil-simple" size={90} /></Tile></div></In>
        {erase > 0 && erase < 1 ? <div style={{position: 'absolute', left: ex, top: 120, width: 120, height: 70, borderRadius: 14, background: 'linear-gradient(90deg,#f4a7b9 60%,#d8d8d8 60%)', border: `4px solid ${INK}`, transform: 'rotate(-12deg)'}} /> : null}
      </div>
      <In at={T(122.84)} pop style={{marginTop: 50}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Tile size={110} r={0.5}><Icon name="x-circle" size={70} /></Tile><Pill dark size={44}>سكّرت البرنامج ← انمسح</Pill></div></In>
    </Stage>;
  },
  // «الثانية: كل ما طالت المحادثة، الدفتر بيصير أتخن، والنموذج بياخد وقت أطول وتكلفة أعلى»
  thick: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const th = interpolate(f, [T(128.0) * FPS, T(131.2) * FPS], [1, 9], clamp);
    const secs = Math.round(interpolate(f, [T(132.9) * FPS, T(134.5) * FPS], [1, 12], clamp));
    const cost = interpolate(f, [T(133.7) * FPS, T(135.3) * FPS], [0.01, 0.3], clamp);
    return <Stage>
      <In at={0.1} y={-60}><Pill size={46}><span style={ltr}>2</span> · محادثة طويلة</Pill></In>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, marginTop: 40, direction: 'rtl'}}>
        <In at={0.3}><Notebook w={300} label="الدفتر" thick={th} /></In>
        <In at={T(131.63)} pop><Robot size={240} mood={f > T(131.63) * FPS ? 'sweat' : 'idle'} /></In>
      </div>
      <div style={{display: 'flex', gap: 30, marginTop: 50, direction: 'rtl'}}>
        <In at={T(132.91)} pop><Pill dark size={52}><Icon name="clock-counter-clockwise" size={48} /><span style={ltr}>{secs}s</span></Pill></In>
        <In at={T(133.71)} pop><Pill dark size={52}><Icon name="coins" size={48} /><span style={ltr}>${cost.toFixed(2)}</span></Pill></In>
      </div>
    </Stage>;
  },
  // «عشان هيك بالمشاريع الحقيقية بنحفظ هاد الدفتر بقاعدة بيانات، وبنعطيه آخر كم صفحة بس»
  db: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const into = interpolate(f, [T(140.0) * FPS, T(141.5) * FPS], [0, 1], clamp);
    const out = sp(f - T(144.29) * FPS);
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 50, direction: 'rtl'}}>
        <div style={{transform: `translateX(${-into * 300}px) scale(${1 - into * 0.7})`, opacity: 1 - into}}><In at={0.2}><Notebook w={240} label="الدفتر" thick={6} /></In></div>
        <In at={T(141.66)} pop><Tile size={260} r={0.3}><Icon name="database" size={170} weight="duotone" /></Tile></In>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 60, direction: 'rtl', opacity: Math.min(1, out * 1.5), transform: `translateY(${(1 - out) * 60}px)`}}>
        <Notebook w={170} open={0} label="آخر 3 صفحات" thick={0.2} />
        <Icon name="arrow-left" size={70} color={INK} weight="bold" />
        <Robot size={200} mood="happy" />
      </div>
    </Stage>;
  },
  // «الخلاصة: النموذج ما بيتذكر. إحنا اللي بنكتبله الدفتر. وهيك خلصنا أسبوع الأساسيات»
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 40, direction: 'rtl'}}>
          <In at={T(147.99)} pop><Robot size={220} mood="blank" /></In>
          <In at={T(150.93)} pop><Notebook w={240} label="الدفتر" glow /></In>
        </div>
        <In at={T(147.99)} pop style={{marginTop: 34}}><Big size={86} color={INK}>النموذج ما بيتذكر.</Big></In>
        <In at={T(150.13)} pop style={{marginTop: 14}}><div style={{background: INK, borderRadius: 26, padding: '4px 36px'}}><Big size={74} gold style={{whiteSpace: 'nowrap'}}>إحنا اللي بنكتبله الدفتر.</Big></div></In>
        <In at={T(152.59)} pop style={{marginTop: 30}}><div style={{display: 'flex', gap: 10, direction: 'rtl', alignItems: 'center'}}>
          <Pill dark size={40}>أسبوع الأساسيات</Pill>{[1, 2, 3, 4, 5].map((d) => <Tile key={d} size={64} r={0.5}><Icon name="check" size={40} weight="bold" /></Tile>)}</div></In>
      </Stage>
    </>;
  },
  // «إذا الفيديو فادك احفظه، وابعته لصاحبك… الكود كامل على جيت هَب»
  save: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const plane = interpolate(f, [T(157.5) * FPS, T(158.8) * FPS], [0, 1], clamp);
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, direction: 'rtl'}}>
        <In at={T(156.95)} pop><div style={{textAlign: 'center'}}><Tile size={200} r={0.5}><Icon name="bookmark-simple" size={130} /></Tile>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 46, color: '#fff', marginTop: 14}}>احفظه</div></div></In>
        <In at={T(157.43)} pop><div style={{textAlign: 'center', position: 'relative'}}><Tile size={200} r={0.5}><Icon name="paper-plane-tilt" size={130} /></Tile>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 46, color: '#fff', marginTop: 14}}>ابعته لصاحبك</div>
          <div style={{position: 'absolute', left: -plane * 380, top: -plane * 160, opacity: 1 - plane}}><Icon name="paper-plane-tilt" size={80} /></div></div></In>
      </div>
      <In at={T(158.51)} pop style={{marginTop: 40}}><div style={{display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl'}}><Person size={110} hue={3} /><Bubble size={36}>مفكره بيتذكرني 😅</Bubble></div></In>
      <In at={T(162.43)} pop style={{marginTop: 40}}><Pill size={46}><Logo name="github" size={42} color={INK} />الكود بأول تعليق</Pill></In>
    </Stage>;
  },
  // «وإنت: بتحب بوت بيتذكر كل إشي عنك، ولا بوت بينسى بعد كل محادثة؟ وليش؟ اكتبلي بالتعليقات»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const Card: React.FC<{title: string; mood: 'happy' | 'blank'; book?: boolean; at: number}> = ({title, mood, book, at}) => (
      <In at={T(at)} pop><div style={{width: 400, background: '#fff', border: `5px solid ${INK}`, borderRadius: 34, padding: '26px 10px', textAlign: 'center', boxShadow: `12px 12px 0 ${GOLD_LT}`}}>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6}}><Robot size={160} mood={mood} />{book ? <Notebook w={110} label="" glow /> : null}</div>
        <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 46, color: INK, marginTop: 10}}>{title}</div></div></In>);
    return <Stage>
      <div style={{display: 'flex', gap: 30, direction: 'rtl'}}>
        <Card title="بيتذكر كل إشي" mood="happy" book at={167.86} />
        <Card title="بينسى كل مرة" mood="blank" at={169.82} />
      </div>
      <In at={T(171.98)} pop rot={-15} style={{marginTop: 40}}><Stamp rot={-4} size={70}>وليش؟</Stamp></In>
      <In at={T(172.98)} pop style={{marginTop: 34}}><Pill dark size={52}><Icon name="chat-circle-dots" size={48} />اكتبلي بالتعليقات</Pill></In>
    </Stage>;
  },
  // «وتابعني، لأنه بكرة بنبلّش بأهم موضوع بالسلسلة: الراغ، وبنخلي النموذج يقرأ ملفاتك إنت»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(174.5) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 110, padding: '10px 80px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={130} color="#fff" /></div>
      </div></In>
      <In at={T(175.35)} style={{marginTop: 110}}>
        <div style={{width: 820, borderRadius: 36, padding: '30px 44px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontWeight: 800, fontSize: 46, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>6</span> · بلّشنا أسبوع <span style={ltr}>RAG</span></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 18}}>
            <Tile size={110} r={0.3}><Icon name="file-pdf" size={70} /></Tile><Icon name="arrow-left" size={56} weight="bold" /><Robot size={120} mood="read" />
            <div style={{fontWeight: 800, fontSize: 52, color: '#fff'}}>النموذج <span style={goldText}>بيقرأ ملفاتك</span></div>
          </div>
        </div></In>
      <Sequence from={Math.round(T(180.9) * FPS)} durationInFrames={60}><Confetti /></Sequence>
    </Stage>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
