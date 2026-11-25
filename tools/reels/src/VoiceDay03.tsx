import React from 'react';
import {Sequence, interpolate, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Confetti, Rays, Shake, Sign, clamp} from './EnergyReel';
import {Big, Code, FPS, Float, In, Kind, Leak, Pill, SceneFC, Slash, Stage, Tile, ltr} from './voiceKit';
import {Stamp, Term} from './VoiceDay02';

// ريل اليوم 3 (قوالب Prompts: مترجم لهجات) — نفس منهجية اليوم 1 و2.
// كل زمن بالثواني من بداية صوت محمد (voiceDay03.json)، وT(s) بتحوّله لزمن المشهد.

export const KIND3: Record<string, Kind> = {
  hook: 'dark', dialects: 'sky', egypt: 'gold', tool: 'dark', copies: 'sky', waste: 'dark', template: 'gold', form: 'sky',
  letsgo: 'gold', system: 'dark', fewshot: 'sky', run: 'dark', inside: 'gold', golden: 'gold', small: 'dark',
  github: 'dark', ask: 'sky', next: 'dark', outro: 'dark',
};

// الكود الحقيقي من day-03/app.py (مختصر لأسطر قصيرة)
const APP = [
  'prompt = ChatPromptTemplate.from_messages([',
  '  ("system", "… {dialect} … {tone}"),',
  '  ("human", "{ex_in}"), ("ai", "{ex_out}"),',
  '  ("human", "{text}"),',
  '])',
  'chain = prompt | get_llm() | StrOutputParser()',
];
// المخرجات الحقيقية من tools/demo_outputs/day-03.txt
const OUT: [string, string, number][] = [
  ['الفلسطينية', 'أوي، عايزك معاي في السوق هيك، إيه طريقة السوق؟', 56.36],
  ['الشامية', 'أوي، بس مش هيبقى معك في السوق اليوم؟', 59.39],
  ['المصرية', 'أنا هروح معك عشان كده، إزاي السوق؟', 60.9],
];

const Chip: React.FC<{label: string; dark?: boolean; size?: number}> = ({label, dark, size = 56}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: size, padding: `${size * 0.18}px ${size * 0.6}px`, borderRadius: `${size * 0.6}px ${size * 0.6}px ${size * 0.6}px ${size * 0.12}px`,
    background: dark ? INK : '#fff', color: dark ? GOLD_LT : INK, border: `4px solid ${INK}`, boxShadow: `8px 8px 0 ${GOLD_LT}`, direction: 'rtl', whiteSpace: 'nowrap'}}>
    <Icon name="chat-circle-text" size={size * 0.9} color={dark ? 'gold' : INK} />{label}
  </div>
);

// خانة فورم بتتعبّى
const Blank: React.FC<{label: string; value: string; fillAt: number}> = ({label, value, fillAt}) => {
  const f = useCurrentFrame(); const k = interpolate(f, [fillAt * FPS, fillAt * FPS + 8], [0, 1], clamp);
  return <div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl', marginTop: 22}}>
    <div style={{width: 210, fontWeight: 800, fontSize: 44, color: '#3a3220'}}>{label}</div>
    <div style={{flex: 1, position: 'relative', height: 84, borderRadius: 18, border: `4px ${k > 0.5 ? 'solid' : 'dashed'} ${k > 0.5 ? GOLD : '#9a8f78'}`, background: k > 0.5 ? '#fffaf0' : '#f3efe6',
      display: 'flex', alignItems: 'center', padding: '0 24px', boxShadow: k > 0.5 ? `0 0 ${30 * k}px rgba(232,192,102,.6)` : 'none'}}>
      <span style={{fontWeight: 800, fontSize: 46, color: INK, opacity: k, transform: `scale(${0.7 + 0.3 * k})`, display: 'inline-block'}}>{value}</span>
      {k < 0.5 ? <span style={{position: 'absolute', left: 24, fontFamily: 'monospace', fontSize: 34, color: '#9a8f78', ...ltr}}>{`{${label === 'اللهجة' ? 'dialect' : label === 'النبرة' ? 'tone' : 'text'}}`}</span> : null}
    </div>
  </div>;
};

const MiniCode: React.FC<{n: number}> = ({n}) => (
  <div style={{width: 300, borderRadius: 20, overflow: 'hidden', background: '#0b0b0b', border: `3px solid ${GOLD}`, boxShadow: '0 20px 40px rgba(0,0,0,.35)'}}>
    <div style={{display: 'flex', gap: 8, padding: '10px 14px', background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', ...ltr}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 12, height: 12, borderRadius: '50%', background: INK, opacity: 0.7}} />)}
      <span style={{marginLeft: 10, fontWeight: 800, fontSize: 18, color: INK}}>{`app_${n}.py`}</span>
    </div>
    <div style={{padding: '14px 16px'}}>{[0.9, 0.7, 0.8, 0.5, 0.75].map((w, i) => <div key={i} style={{height: 12, width: `${w * 100}%`, background: i % 2 ? '#5d5034' : '#8a7a52', borderRadius: 6, marginTop: 10}} />)}</div>
  </div>
);

export const S3: Record<string, SceneFC> = {
  // «نفس النموذج، ونفس الكود، طلبت منه ثلاث لهجات»
  hook: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 50, ...ltr}}>
        <In at={0} pop><div style={{textAlign: 'center'}}><Tile size={250} r={0.5}><Logo name="qwen" size={160} /></Tile><div style={{fontWeight: 800, fontSize: 52, color: '#fff', marginTop: 20}}>نفس النموذج</div></div></In>
        <In at={T(1.41)} pop><div style={{textAlign: 'center'}}><Tile size={250}><Icon name="code" size={160} weight="duotone" /></Tile><div style={{fontWeight: 800, fontSize: 52, color: '#fff', marginTop: 20}}>نفس الكود</div></div></In>
      </div>
      <In at={T(3.37)} pop style={{marginTop: 80}}><div style={{background: INK, borderRadius: 26, padding: '6px 50px', border: `4px solid ${GOLD_LT}`}}><Big size={130} gold><span style={ltr}>3</span> لهجات</Big></div></In>
    </Stage>;
  },
  // «فلسطيني، شامي، مصري»
  dialects: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={90} color={INK}>طلبت منه</Big></In>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, marginTop: 60}}>
        <In at={T(4.45)} pop rot={-12}><Chip label="فلسطيني" size={72} /></In>
        <In at={T(5.45)} pop rot={12}><Chip label="شامي" size={72} /></In>
        <In at={T(6.27)} pop rot={-12}><Chip label="مصري" size={72} /></In>
      </div>
    </Stage>;
  },
  // «وطلعولي الثلاثة مصري»
  egypt: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Shake power={26} frames={12}><Stage>
      <In at={0} y={-80}><Big size={92} color={INK}>وطلعولي الثلاثة…</Big></In>
      <div style={{display: 'flex', gap: 22, marginTop: 60, direction: 'rtl'}}>
        {[0, 1, 2].map((i) => <In key={i} at={T(8.08) + i * 0.12} pop rot={i % 2 ? 14 : -14}><Chip label="مصري" dark size={54} /></In>)}
      </div>
      <In at={T(9.1)} pop rot={-25} style={{marginTop: 70}}><Stamp rot={-6} size={96}>كلهم مصري!</Stamp></In>
    </Stage></Shake>;
  },
  // «بدك أداة وحدة تحكي بأكثر من أسلوب»
  tool: ({t0}) => {
    const T = (s: number) => s - t0;
    const B: [string, React.CSSProperties, number][] = [['ودّي', {right: 0, top: 30}, 10.86], ['رسمي', {left: 0, top: 30}, 11.19], ['مضحك', {left: 330, bottom: 0}, 11.98]];
    return <Stage>
      <div style={{position: 'relative', width: 900, height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 90}}>
        <In at={0} pop><Float><Tile size={280} r={0.5}><Icon name="robot" size={180} weight="duotone" /></Tile></Float></In>
        {B.map(([l, pos, t]) => <div key={l} style={{position: 'absolute', ...pos}}><In at={T(t)} pop><Pill dark size={50}><Icon name="chat-circle-dots" size={46} />{l}</Pill></In></div>)}
      </div>
      <In at={T(9.94)} style={{marginTop: 0}}><Big size={70} style={{whiteSpace: 'nowrap'}}>أداة وحدة. <span style={goldText}>أكثر من أسلوب.</span></Big></In>
    </Stage>;
  },
  // «والحل اللي ببالك: إنك تكتب ثلاث نسخ من الكود»
  copies: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={84} color={INK}>الحل اللي ببالك؟</Big></In>
      <div style={{position: 'relative', width: 760, height: 560, marginTop: 50}}>
        {[1, 2, 3].map((n, i) => <div key={n} style={{position: 'absolute', left: 60 + i * 150, top: 40 + i * 110, transform: `rotate(${(i - 1) * 6}deg)`}}>
          <In at={T([15.41, 16.09, 16.59][i])} pop rot={(i - 1) * 20}><MiniCode n={n} /></In></div>)}
      </div>
      <In at={T(15.41)} pop style={{marginTop: 10}}><Pill dark size={58}><span style={ltr}>×3</span> نسخ من الكود</Pill></In>
    </Stage>;
  },
  // «طبعًا هاد تعب على الفاضي»
  waste: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Shake power={22} frames={10}><Stage>
      <In at={0} pop><div style={{position: 'relative'}}><div style={{display: 'flex', gap: 18, ...ltr}}>{[1, 2, 3].map((n) => <div key={n} style={{transform: 'scale(.62)', margin: '0 -55px'}}><MiniCode n={n} /></div>)}</div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name="x" size={420} color={GOLD_LT} weight="bold" /></div></div></In>
      <In at={T(18.48)} pop rot={20} style={{marginTop: 70}}><Stamp rot={4} size={88}>تعب على الفاضي</Stamp></In>
    </Stage></Shake>;
  },
  // «الحل اسمه برومبت تِمبليت، يعني قالب»
  template: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={5} frames={40} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={46}><Icon name="lightbulb" size={44} />الحل</Pill></In>
        <In at={T(21.47)} pop style={{marginTop: 50}}><Tile size={240}><Icon name="file-text" size={150} weight="duotone" /></Tile></In>
        <In at={T(21.47)} style={{marginTop: 40}}><Big size={104} color={INK} style={ltr}>Prompt Template</Big></In>
        <In at={T(23.48)} pop style={{marginTop: 30}}><div style={{background: INK, borderRadius: 26, padding: '4px 50px'}}><Big size={110} gold>= قالب</Big></div></In>
      </Stage>
    </>;
  },
  // «القالب عبارة عن فورم فيها فراغات، وإنت بتعبّي الفراغ: باللهجة، والنبرة، والنص»
  form: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={84} color={INK}>زي فورم فيه فراغات</Big></In>
      <In at={T(26.92)} style={{marginTop: 50}}>
        <div style={{width: 860, background: '#fff', borderRadius: 36, padding: '36px 46px', border: `5px solid ${INK}`, boxShadow: `14px 14px 0 ${GOLD_LT}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontWeight: 800, fontSize: 52, color: INK, direction: 'rtl'}}><Icon name="list-checks" size={58} color={INK} />مترجم لهجات</div>
          <Blank label="اللهجة" value="الشامية" fillAt={T(30.0)} />
          <Blank label="النبرة" value="ودّية" fillAt={T(30.72)} />
          <Blank label="النص" value="بدي روح عالسوق…" fillAt={T(31.53)} />
        </div></In>
    </Stage>;
  },
  // «يلا نجرب عملي. بفتح في إس كود»
  letsgo: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Big size={150} color={INK}>يلا عملي</Big></In>
      <In at={T(36.49)} pop style={{marginTop: 70}}><div style={{display: 'flex', alignItems: 'center', gap: 30, ...ltr}}>
        <Tile size={200}><Icon name="file-code" size={120} weight="duotone" /></Tile><Big size={100} color={INK} style={ltr}>VS Code</Big></div></In>
      <In at={T(36.9)} style={{marginTop: 40}}><Pill dark size={50}><Logo name="python" size={46} /><span style={ltr}>day-03/app.py</span></Pill></In>
    </Stage>;
  },
  // «وبكتب القالب: رسالة السيستم بتقول إنت مترجم لهجات، ورسالة اليوزر فيها فراغين»
  system: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <div style={{display: 'flex', gap: 18, direction: 'rtl'}}>
        <In at={T(38.55)} pop><Pill size={42}><Icon name="robot" size={40} color={INK} /><span style={ltr}>system</span></Pill></In>
        <In at={T(41.97)} pop><Pill dark size={42}><Icon name="user-circle" size={40} /><span style={ltr}>human</span></Pill></In>
      </div>
      <In at={0.3} style={{marginTop: 40}}><Code lines={APP} from={T(37.6)} to={T(44.8)} hl="{text}" title="app.py" /></In>
      <In at={T(43.58)} pop style={{marginTop: 36}}><Pill dark size={50}>فراغين: <span style={{...ltr, color: GOLD_LT}}>{'{text}'}</span> و <span style={{...ltr, color: GOLD_LT}}>{'{dialect}'}</span></Pill></In>
    </Stage>;
  },
  // «وبحط مثالين جاهزين، اسمهم الفيو شوت، عشان يفهم الأسلوب من غير شرح»
  fewshot: ({t0}) => {
    const T = (s: number) => s - t0;
    const Ex: React.FC<{a: string; b: string}> = ({a, b}) => (
      <div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl', background: '#fff', border: `4px solid ${INK}`, borderRadius: 26, padding: '18px 28px', boxShadow: `8px 8px 0 ${GOLD_LT}`}}>
        <span style={{fontWeight: 800, fontSize: 40, color: '#666'}}>{a}</span><Icon name="arrow-left" size={44} color={INK} weight="bold" /><span style={{fontWeight: 800, fontSize: 44, color: INK}}>{b}</span>
      </div>);
    return <Stage>
      <In at={0} pop><Big size={84} color={INK}>مثالين جاهزين</Big></In>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 50, alignItems: 'center'}}>
        <In at={T(46.08)} x={200} y={0}><Ex a="كيف حالك؟" b="كيفك؟" /></In>
        <In at={T(47.17)} x={-200} y={0}><Ex a="ماذا تفعل الآن؟" b="شو عم تعمل هلق؟" /></In>
      </div>
      <In at={T(49.08)} pop style={{marginTop: 50}}><div style={{background: INK, borderRadius: 26, padding: '4px 44px'}}><Big size={110} gold style={ltr}>Few-shot</Big></div></In>
      <In at={T(53.02)} pop style={{marginTop: 30}}><Pill size={52}><Icon name="seal-check" size={48} color={INK} />بيفهم من غير شرح</Pill></In>
    </Stage>;
  },
  // «بشغّل، والنتيجة بالتيرمنال: الفلسطيني قال عايزك معاي في السوق، والشامي قال مش هيبقى معاك…»
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cmd = '$ python day-03/app.py'; const typed = cmd.slice(0, Math.floor(interpolate(f, [T(54.7) * FPS, T(55.9) * FPS], [0, cmd.length], clamp)));
    return <Stage>
      <In at={0}><Term>
        <div style={{fontFamily: 'monospace', fontSize: 36, color: GOLD_LT, ...ltr}}>{typed}<span style={{opacity: Math.floor(f / 8) % 2}}>_</span></div>
        {OUT.map(([d, s, t]) => <In key={d} at={T(t)} x={-80} y={0}>
          <div style={{direction: 'rtl', textAlign: 'right', marginTop: 20}}>
            <span style={{fontWeight: 800, fontSize: 36, color: INK, background: GOLD_LT, borderRadius: 10, padding: '0 14px'}}>{d}</span>
            <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.45, color: '#f3ead2', marginTop: 8}}>{s}</div></div></In>)}
      </Term></In>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: 28}}>
        <In at={T(57.73)} pop rot={-20}><Stamp rot={-4} size={44}>عايزك؟ ده مصري!</Stamp></In>
        <In at={T(60.59)} pop rot={20}><Stamp rot={4} size={44}>هيبقى؟ برضو مصري</Stamp></In>
      </div>
    </Stage>;
  },
  // «يعني نموذجنا الصغير طلع مصري»
  inside: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Shake power={30} frames={14}><Stage>
      <In at={0} pop><div style={{position: 'relative'}}><Tile size={300} r={0.5}><Logo name="qwen" size={190} /></Tile>
        <In at={T(64.0)} pop rot={-30} style={{position: 'absolute', right: -170, top: -40}}><Chip label="مصري" dark size={58} /></In></div></In>
      <In at={T(62.68)} style={{marginTop: 60}}><Big size={96} color={INK}>نموذجنا الصغير</Big></In>
      <In at={T(64.03)} pop style={{marginTop: 20}}><div style={{background: INK, borderRadius: 26, padding: '4px 44px'}}><Big size={110} gold>طلع مصري</Big></div></In>
    </Stage></Shake>;
  },
  // «الخلاصة: القالب بيغيّر الأسلوب، بس ما بيعلّم النموذج إشي ما بيعرفه»
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
          <In at={T(67.56)} pop><div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl'}}>
            <Tile size={120}><Icon name="check" size={80} weight="bold" /></Tile><Big size={78} color={INK} style={{whiteSpace: 'nowrap'}}>القالب بيغيّر الأسلوب.</Big></div></In>
          <In at={T(69.31)} pop><div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl'}}>
            <Tile size={120}><Icon name="x" size={80} weight="bold" /></Tile>
            <div style={{background: INK, borderRadius: 26, padding: '4px 34px'}}><Big size={62} gold style={{whiteSpace: 'nowrap'}}>بس ما بيعلّمه إشي جديد.</Big></div></div></In>
        </div>
      </Stage>
    </>;
  },
  // «النموذج الصغير ضعيف باللهجات، وهون بتعرف ليش أحيانًا بدك نموذج أكبر»
  small: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const g = interpolate(f, [T(78.56) * FPS, T(79.6) * FPS], [0, 1], clamp);
    return <>
      <Rays dark />
      <Stage>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 70, ...ltr}}>
          <In at={0} pop><div style={{textAlign: 'center'}}><Tile size={170} r={0.5}><Logo name="qwen" size={100} /></Tile>
            <div style={{fontWeight: 800, fontSize: 56, color: '#fff', marginTop: 16}}>3B</div>
            <div style={{fontWeight: 800, fontSize: 38, color: '#e9e2cf', direction: 'rtl'}}>ضعيف باللهجات</div></div></In>
          <In at={T(78.56)} pop><div style={{textAlign: 'center', filter: `drop-shadow(0 0 ${50 * g}px rgba(255,210,80,.7))`}}><Tile size={320} r={0.5}><Logo name="qwen" size={200} /></Tile>
            <div style={{fontWeight: 800, fontSize: 80, marginTop: 16, ...goldText}}>72B</div></div></In>
        </div>
        <In at={T(75.29)} style={{marginTop: 60}}><Big size={84}>ليش أحيانًا بدك <span style={goldText}>نموذج أكبر</span></Big></In>
      </Stage>
    </>;
  },
  // «الكود كامل على جيت هَب، والرابط بأول تعليق»
  github: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <In at={0} pop><Tile size={300} r={0.5}><Logo name="github" size={190} /></Tile></In>
      <In at={T(80.31)} style={{marginTop: 40}}><Big size={96}>الكود كامل</Big></In>
      <In at={T(82.25)} style={{marginTop: 40}}><Pill size={56}><Icon name="chat-centered-dots" size={54} color={INK} />الرابط بأول تعليق</Pill></In>
      <In at={T(82.9)} style={{marginTop: 20, transform: `translateY(${Math.abs(Math.sin(f / 5)) * 26}px)`}}><Icon name="arrow-down" size={110} weight="bold" /></In>
    </Stage>;
  },
  // «وإنت، أي لهجة بتحب نجربها كمان؟ اكتبلي بالتعليقات»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const C: [string, number][] = [['خليجي', 84.6], ['مغربي', 84.95], ['عراقي', 85.3], ['سوداني', 85.65]];
    return <Stage>
      <In at={0} pop><Big size={96} color={INK}>أي لهجة<br />نجربها كمان؟</Big></In>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 26, marginTop: 60, width: 900}}>
        {C.map(([l, t], i) => <In key={l} at={T(t)} pop rot={i % 2 ? 12 : -12}><Chip label={l} size={52} /></In>)}
      </div>
      <In at={T(86.41)} pop style={{marginTop: 50}}><Pill dark size={56}><Icon name="chat-circle-dots" size={54} />اكتبلي بالتعليقات</Pill></In>
    </Stage>;
  },
  // «وتابعني، لأنه بكرة بنحوّل نص فوضوي لبيانات نظيفة»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(88.3) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 110, padding: '10px 80px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={130} color="#fff" /></div>
      </div></In>
      <In at={T(89.38)} style={{marginTop: 110}}>
        <div style={{width: 820, borderRadius: 36, padding: '34px 44px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontWeight: 800, fontSize: 48, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>4</span></div>
            <Tile size={100} r={0.3}><Icon name="brackets-curly" size={64} /></Tile>
          </div>
          <div style={{fontWeight: 800, fontSize: 60, color: '#fff', marginTop: 14}}>نص فوضوي ← <span style={{...goldText, ...ltr}}>JSON</span> نظيف</div>
        </div></In>
      <Sequence from={Math.round(T(92.3) * FPS)} durationInFrames={60}><Confetti /></Sequence>
    </Stage>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
