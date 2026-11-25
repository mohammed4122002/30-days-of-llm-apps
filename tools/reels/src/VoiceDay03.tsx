import React from 'react';
import {Sequence, interpolate, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Confetti, Rays, Shake, Sign, clamp} from './EnergyReel';
import {Big, Code, FPS, Float, In, Kind, Leak, Pill, SceneFC, Slash, Stage, Tile, ltr} from './voiceKit';
import {Stamp, Term} from './VoiceDay02';

// ريل اليوم 3 (نسخة 2، سكريبت مدقق): قالب Prompt لمترجم لهجات، والنموذج الصغير بيطلّع كل شي مصري.
// القاعدة: الكابشن بيحمل كلام محمد، والمشهد بيضيف معلومة جديدة (مش نفس الكلام مرة ثانية).
// بالمشاهد اللي النص فيها هو المحتوى (sentence، expected) الكابشن مخفي (nocap بالخطة).
// كل زمن بالثواني من بداية صوت محمد (voiceDay03.json).

export const KIND3: Record<string, Kind> = {
  hook: 'dark', dialects: 'sky', egypt: 'gold', sentence: 'dark', expected: 'sky', behind: 'gold', three: 'dark', one: 'sky',
  template: 'gold', form: 'sky', code: 'dark', fewshot: 'sky', run: 'dark', pal: 'dark', sham: 'sky', verdict: 'gold',
  why: 'dark', golden: 'gold', github: 'dark', ask: 'sky', next: 'dark', outro: 'dark',
};

const FUSHA = 'أريد أن أذهب إلى السوق الآن، هل تأتي معي؟';   // حرفيًا من day-03/app.py
// المخرجات الحقيقية (tools/demo_outputs/day-03.txt)
const OUT_PAL = ['أوي، ', 'عايزك', ' معاي في السوق هيك، ', 'إيه', ' طريقة السوق؟'];
const OUT_SHAM = ['أوي، بس مش ', 'هيبقى', ' معك في السوق اليوم؟'];
// الأمثلة الحقيقية (EXAMPLES بالكود)
const EXAMPLES: [string, string][] = [['الفلسطينية', 'كيفك؟ شو بتعمل هلقيت؟'], ['الشامية', 'كيفك؟ شو عم تعمل هلق؟'], ['المصرية', 'إزيك؟ بتعمل إيه دلوقتي؟']];
const CODE = [
  'prompt = ChatPromptTemplate.from_messages([',
  '  ("system", "أنت مترجم لهجات. حوّل الجملة',
  '     إلى اللهجة {dialect}"),',
  '  ("human", "{ex_in}"), ("ai", "{ex_out}"),',
  '  ("human", "{text}"),',
  '])',
  'chain = prompt | get_llm() | StrOutputParser()',
];

// شريحة لهجة
const Chip: React.FC<{label: string; dark?: boolean; size?: number; sub?: string}> = ({label, dark, size = 56, sub}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: size, padding: `${size * 0.16}px ${size * 0.55}px`, borderRadius: `${size * 0.6}px ${size * 0.6}px ${size * 0.6}px ${size * 0.12}px`,
    background: dark ? INK : '#fff', color: dark ? GOLD_LT : INK, border: `4px solid ${INK}`, boxShadow: `8px 8px 0 ${GOLD_LT}`, direction: 'rtl', whiteSpace: 'nowrap'}}>
    <Icon name="chat-circle-text" size={size * 0.85} color={dark ? 'gold' : INK} />{label}
    {sub ? <span style={{fontSize: size * 0.62, color: dark ? '#e9e2cf' : '#7a6a45', marginRight: 6}}>«{sub}»</span> : null}
  </div>
);
// بطاقة جملة (فقاعة)
const Quote: React.FC<{tag: string; children: React.ReactNode; dark?: boolean; w?: number; size?: number; pad?: number}> = ({tag, children, dark, w = 900, size = 54, pad = 12}) => (
  <div style={{width: w, background: dark ? 'linear-gradient(150deg,#2a2a2a,#0d0d0d)' : '#fff', borderRadius: '36px 36px 36px 8px', padding: '24px 36px 30px', direction: 'rtl',
    border: `4px solid ${dark ? GOLD_LT : INK}`, boxShadow: dark ? '0 30px 60px rgba(0,0,0,.5)' : `12px 12px 0 ${GOLD_LT}`}}>
    <div style={{display: 'inline-block', fontWeight: 800, fontSize: 32, padding: '2px 22px', borderRadius: 99, background: dark ? GOLD_LT : INK, color: dark ? INK : GOLD_LT}}>{tag}</div>
    <div style={{fontWeight: 800, fontSize: size, lineHeight: 1.75, color: dark ? '#fff' : INK, marginTop: pad}}>{children}</div>
  </div>
);
// كلمة مضوية (+ وسم اختياري)
const Mark: React.FC<{children: React.ReactNode; at: number; tag?: string}> = ({children, at, tag}) => {
  const f = useCurrentFrame(); const k = interpolate(f, [at * FPS, at * FPS + 6], [0, 1], clamp);
  return <span style={{position: 'relative', display: 'inline-block'}}>
    <span style={{background: `rgba(232,192,102,${k})`, color: k > 0.5 ? INK : 'inherit', borderRadius: 12, padding: '0 10px', boxShadow: k > 0.5 ? `0 0 ${24 * k}px rgba(232,192,102,.7)` : 'none'}}>{children}</span>
    {tag && k > 0.05 ? <span style={{position: 'absolute', top: -58, left: '50%', transform: `translateX(-50%) scale(${k}) rotate(-6deg)`, whiteSpace: 'nowrap', fontWeight: 800, fontSize: 32,
      background: INK, color: GOLD_LT, padding: '2px 18px', borderRadius: 12, border: `3px solid ${GOLD_LT}`}}>{tag}</span> : null}
  </span>;
};
// كرت برومبت صغير
const PromptCard: React.FC<{label: string; w?: number; blank?: number}> = ({label, w = 420, blank}) => {
  const f = useCurrentFrame(); const g = blank == null ? 0 : interpolate(f, [blank * FPS, blank * FPS + 8], [0, 1], clamp);
  return <div style={{width: w, borderRadius: 26, overflow: 'hidden', background: '#0b0b0b', border: `3px solid ${GOLD}`, boxShadow: '0 20px 40px rgba(0,0,0,.35)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', direction: 'rtl'}}>
      <Icon name="chat-text" size={30} color={INK} /><span style={{fontWeight: 800, fontSize: 28, color: INK}}>برومبت</span></div>
    <div style={{padding: '18px 22px', direction: 'rtl', fontWeight: 800, fontSize: w > 500 ? 40 : 30, lineHeight: 1.5, color: '#f3ead2'}}>
      حوّل الجملة للهجة{' '}
      {blank == null ? <span style={{color: GOLD_LT}}>{label}</span>
        : <span style={{display: 'inline-block', minWidth: 170, textAlign: 'center', border: `3px dashed ${GOLD_LT}`, borderRadius: 12, padding: '0 12px', color: GOLD_LT,
          background: `rgba(232,192,102,${0.15 * g})`, boxShadow: `0 0 ${40 * g}px rgba(232,192,102,.6)`}}>{label}</span>}
    </div>
  </div>;
};

export const S3: Record<string, SceneFC> = {
  // «عطيت الذكاء الاصطناعي جملة وحدة بالفصحى، وطلبت منه يحكيها بثلاث لهجات»
  hook: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Float><Tile size={230} r={0.5}><Icon name="robot" size={150} weight="duotone" /></Tile></Float></In>
      <In at={T(3.05)} style={{marginTop: 60}}><Quote tag="فصحى" dark size={50}>{FUSHA}</Quote></In>
      <In at={T(5.98)} pop style={{marginTop: 46}}><Pill size={58}><Icon name="arrows-split" size={54} color={INK} /><span style={ltr}>3</span> لهجات</Pill></In>
    </Stage>;
  },
  // «فلسطيني، شامي، مصري» — كل لهجة مع كلمتها المميزة (معلومة جديدة)
  dialects: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
        <In at={T(7.13)} pop rot={-10}><Chip label="فلسطيني" sub="هلقيت" size={70} /></In>
        <In at={T(8.0)} pop rot={10}><Chip label="شامي" sub="هلّق" size={70} /></In>
        <In at={T(8.58)} pop rot={-10}><Chip label="مصري" sub="دلوقتي" size={70} /></In>
      </div>
    </Stage>;
  },
  // «وللأسف الثلاثة طلعوا معاي كلهم مصري»
  egypt: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Shake power={28} frames={12}><Stage>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        {['فلسطيني', 'شامي', 'مصري'].map((d, i) => <In key={d} at={T(10.06) + i * 0.12} x={120} y={0}>
          <div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl'}}>
            <span style={{fontWeight: 800, fontSize: 50, color: INK, width: 190, textAlign: 'left'}}>{d}</span>
            <Icon name="arrow-left" size={50} color={INK} weight="bold" />
            <Chip label="مصري" dark size={52} /></div></In>)}
      </div>
      <In at={T(11.88)} pop rot={-25} style={{marginTop: 60}}><Stamp rot={-6} size={100}><span style={ltr}>3</span> من <span style={ltr}>3</span> مصري</Stamp></In>
    </Stage></Shake>;
  },
  // «الجملة كانت: أريد أن أذهب للسوق الآن، هل تأتي معي؟» (الكابشن مخفي، الجملة على الشاشة)
  sentence: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const words = FUSHA.split(' '); const n = Math.floor(interpolate(f, [T(13.74) * FPS, T(16.3) * FPS], [0, words.length], clamp));
    return <Stage>
      <In at={0} y={-60}><Pill dark size={44}><Icon name="quotes" size={42} />الجملة</Pill></In>
      <In at={0.15} style={{marginTop: 50}}>
        <div style={{width: 920, direction: 'rtl', textAlign: 'center', fontWeight: 800, fontSize: 92, lineHeight: 1.45, color: '#fff'}}>
          {words.map((w, i) => <span key={i} style={{display: 'inline-block', margin: '0 12px', opacity: i < n ? 1 : 0.18, ...(i === n - 1 ? goldText : {})}}>{w}</span>)}
        </div></In>
    </Stage>;
  },
  // «المفروض الفلسطيني يقول… والمصري يقول…» (الكابشن مخفي)
  expected: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} y={-60}><Pill dark size={44}><Icon name="target" size={42} />المتوقّع</Pill></In>
      <div style={{display: 'flex', flexDirection: 'column', gap: 70, marginTop: 70, alignItems: 'center'}}>
        <In at={T(17.18)} x={200} y={0}><Quote tag="فلسطيني" w={900} size={56}>بدي أروح عالسوق <Mark at={T(19.79)}>هلقيت</Mark>، بتيجي معي؟</Quote></In>
        <In at={T(21.43)} x={-200} y={0}><Quote tag="مصري" w={900} size={56}><Mark at={T(22.56)}>عايز</Mark> أروح السوق <Mark at={T(23.89)}>دلوقتي</Mark>، تيجي معايا؟</Quote></In>
      </div>
    </Stage>;
  },
  // «تعالوا نشوف شو عملنا»
  behind: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Tile size={260} r={0.5}><Icon name="magnifying-glass" size={170} weight="duotone" /></Tile></In>
      <In at={T(26.54)} pop style={{marginTop: 50}}><div style={{background: INK, borderRadius: 26, padding: '6px 44px'}}><Big size={96} gold>ورا الكواليس</Big></div></In>
    </Stage>;
  },
  // «بدل ما أكتب ثلاث برومبتات، واحد لكل لهجة»
  three: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        {['الفلسطينية', 'الشامية', 'المصرية'].map((d, i) => <In key={d} at={T(29.9) + i * 0.85} pop rot={(i - 1) * 8}>
          <div style={{transform: `rotate(${(i - 1) * 3}deg)`}}><PromptCard label={d} w={720} /></div></In>)}
      </div>
      <In at={T(33.6)} pop style={{marginTop: 40}}><Pill dark size={42}><span style={ltr}>×3</span> نفس الكلام، تغيير كلمة وحدة</Pill></In>
    </Stage>;
  },
  // «كتبت برومبت واحد، وفيه فراغ اسمه اللهجة»
  one: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><PromptCard label="اللهجة" w={860} blank={T(36.87)} /></In>
      <In at={T(37.85)} pop style={{marginTop: 50}}><div style={{display: 'flex', gap: 18, direction: 'rtl'}}>
        {['الفلسطينية', 'الشامية', 'المصرية'].map((d) => <Pill key={d} dark size={40}>{d}</Pill>)}</div></In>
      <In at={T(37.85)} style={{marginTop: 26}}><Icon name="arrow-bend-right-down" size={70} color={INK} weight="bold" style={{transform: 'scaleY(-1) rotate(-30deg)'}} /></In>
    </Stage>;
  },
  // «هاد اسمه برومبت تِمبليت، يعني قالب»
  template: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={5} frames={40} />
      <Stage>
        <In at={T(39.67)} pop><Tile size={230}><Icon name="file-text" size={150} weight="duotone" /></Tile></In>
        <In at={T(39.67)} style={{marginTop: 40}}><Big size={104} color={INK} style={ltr}>Prompt Template</Big></In>
        <In at={T(41.15)} pop style={{marginTop: 26}}><div style={{background: INK, borderRadius: 26, padding: '4px 50px'}}><Big size={90} gold>برومبت فيه فراغات</Big></div></In>
      </Stage>
    </>;
  },
  // «زي فورم جاهز: بتعبّي الفراغ، وبيشتغل مع أي لهجة» — الفراغ بيتبدّل بين لهجات كثير
  form: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const opts = ['الفلسطينية', 'الشامية', 'المصرية', 'الخليجية', 'المغربية', 'العراقية'];
    const start = T(43.67) * FPS; const idx = f < start ? -1 : Math.floor((f - start) / 9) % opts.length;
    return <Stage>
      <In at={0}>
        <div style={{width: 880, background: '#fff', borderRadius: 36, padding: '36px 44px', border: `5px solid ${INK}`, boxShadow: `14px 14px 0 ${GOLD_LT}`, direction: 'rtl'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontWeight: 800, fontSize: 48, color: INK}}><Icon name="list-checks" size={54} color={INK} />مترجم لهجات</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 30}}>
            <span style={{fontWeight: 800, fontSize: 44, color: '#3a3220', width: 170}}>اللهجة</span>
            <div style={{flex: 1, height: 96, borderRadius: 20, border: `4px solid ${idx >= 0 ? GOLD : '#9a8f78'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px',
              background: idx >= 0 ? '#fffaf0' : '#f3efe6', boxShadow: idx >= 0 ? '0 0 30px rgba(232,192,102,.6)' : 'none'}}>
              <span style={{fontWeight: 800, fontSize: 52, color: idx >= 0 ? INK : '#9a8f78'}}>{idx >= 0 ? opts[idx] : '…'}</span>
              <Icon name="arrow-down" size={44} color={INK} weight="bold" /></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 22}}>
            <span style={{fontWeight: 800, fontSize: 44, color: '#3a3220', width: 170}}>الجملة</span>
            <div style={{flex: 1, borderRadius: 20, border: '4px solid #d8cfba', padding: '12px 22px', fontWeight: 800, fontSize: 34, color: '#555'}}>{FUSHA}</div>
          </div>
        </div></In>
      <In at={T(46.02)} pop style={{marginTop: 46}}><Pill dark size={54}><Icon name="repeat" size={50} />قالب واحد، أي لهجة</Pill></In>
    </Stage>;
  },
  // «بفتح في إس كود وبكتب القالب: إنت مترجم لهجات، وحوّل الجملة للهجة، وهون الفراغ»
  code: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0}><Pill dark size={46}><Logo name="python" size={42} /><span style={ltr}>day-03/app.py</span></Pill></In>
      <In at={0.3} style={{marginTop: 40}}><Code lines={CODE} from={T(48.4)} to={T(54.3)} hl="{dialect}" title="VS Code — app.py" /></In>
      <In at={T(53.71)} pop style={{marginTop: 36}}><Pill size={50}><Icon name="hand-pointing" size={48} color={INK} />الفراغ: <span style={{...ltr, fontFamily: 'monospace'}}>{'{dialect}'}</span></Pill></In>
    </Stage>;
  },
  // «وعشان يفهم الأسلوب بعطيه مثال جاهز من كل لهجة… الفيو شوت: بتعلّمه عن طريق الأمثلة مش بالشرح»
  fewshot: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} y={-60}><Quote tag="المثال بالفصحى" w={900} size={46}>كيف حالك؟ ماذا تفعل الآن؟</Quote></In>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 34, alignItems: 'center'}}>
        {EXAMPLES.map(([d, s], i) => <In key={d} at={T(57.0) + i * 0.45} x={i % 2 ? -160 : 160} y={0}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', width: 900, background: INK, borderRadius: 24, padding: '14px 26px', border: `3px solid ${GOLD_LT}`}}>
            <span style={{fontWeight: 800, fontSize: 32, color: INK, background: GOLD_LT, borderRadius: 99, padding: '0 18px', whiteSpace: 'nowrap'}}>{d}</span>
            <span style={{fontWeight: 800, fontSize: 44, color: '#fff'}}>{s}</span></div></In>)}
      </div>
      <In at={T(61.06)} pop style={{marginTop: 34}}><div style={{background: INK, borderRadius: 22, padding: '0 40px'}}><Big size={80} gold style={{...ltr, whiteSpace: 'nowrap'}}>Few-shot</Big></div></In>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, direction: 'rtl', marginTop: 24}}>
        <In at={T(63.23)} pop><Pill size={42}><Icon name="check-circle" size={40} color={INK} />بالأمثلة</Pill></In>
        <In at={T(64.48)} pop><div style={{position: 'relative'}}><Pill dark size={42}>بالشرح</Pill><Slash at={T(64.7)} /></div></In>
      </div>
    </Stage>;
  },
  // «بشغّل الملف بالتيرمنال، وهاي النتيجة»
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cmd = '$ python day-03/app.py'; const typed = cmd.slice(0, Math.floor(interpolate(f, [T(66.3) * FPS, T(67.6) * FPS], [0, cmd.length], clamp)));
    const p = interpolate(f, [T(68.0) * FPS, T(70.1) * FPS], [0, 1], clamp);
    return <Stage>
      <In at={0}><Term>
        <div style={{fontFamily: 'monospace', fontSize: 38, color: GOLD_LT, ...ltr}}>{typed}<span style={{opacity: Math.floor(f / 8) % 2}}>_</span></div>
        <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 20, ...ltr}}>
          <Logo name="qwen" size={56} /><span style={{fontFamily: 'monospace', fontSize: 32, color: '#bfb498'}}>Qwen2.5-3B (local)</span></div>
        <div style={{marginTop: 26, height: 18, borderRadius: 9, background: '#222', overflow: 'hidden'}}><div style={{height: '100%', width: `${p * 100}%`, background: 'linear-gradient(90deg,#8F6A1F,#E8C066,#FFF1C4)'}} /></div>
        <div style={{marginTop: 14, fontFamily: 'monospace', fontSize: 28, color: '#8a7f68', ...ltr}}>{p < 1 ? 'generating…' : 'done ✓'}</div>
      </Term></In>
    </Stage>;
  },
  // «الفلسطيني قال: عايزك معي في السوق. بس كلمة عايزك مصرية مش فلسطينية» — المخرج الحقيقي كامل
  pal: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={200} y={0}><Quote tag="طلب: الفلسطينية ← رد النموذج" dark w={920} size={52} pad={76}>
        {OUT_PAL[0]}<Mark at={T(75.11)} tag="مصري">{OUT_PAL[1]}</Mark>{OUT_PAL[2]}<Mark at={T(75.5)}>{OUT_PAL[3]}</Mark>{OUT_PAL[4]}</Quote></In>
      <In at={T(78.0)} pop style={{marginTop: 60}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
          <Pill size={48}>الفلسطيني الصح:</Pill><span style={{fontWeight: 800, fontSize: 60, color: '#fff'}}>«<span style={goldText}>بدي</span>»</span></div></In>
    </Stage>;
  },
  // «والشامي قال: مش هيبقى معك. وكلمة هيبقى برضو مصرية»
  sham: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} x={-200} y={0}><Quote tag="طلب: الشامية ← رد النموذج" w={920} size={54} pad={76}>
        {OUT_SHAM[0]}<Mark at={T(82.96)} tag="مصري">{OUT_SHAM[1]}</Mark>{OUT_SHAM[2]}</Quote></In>
      <In at={T(83.6)} pop style={{marginTop: 60}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
          <Pill dark size={48}>الشامي الصح:</Pill><span style={{fontWeight: 800, fontSize: 60, color: INK}}>«رح يكون»</span></div></In>
    </Stage>;
  },
  // «يعني القالب وصّل الطلب صح، بس النموذج ما عرف يحكي لهجاتنا»
  verdict: ({t0}) => {
    const T = (s: number) => s - t0;
    const Col: React.FC<{icon: string; title: string; ok: boolean; at: number}> = ({icon, title, ok, at}) => (
      <In at={T(at)} pop><div style={{width: 400, background: ok ? '#fff' : INK, border: `5px solid ${INK}`, borderRadius: 34, padding: '34px 20px', textAlign: 'center', boxShadow: `12px 12px 0 ${ok ? INK : GOLD_LT}`}}>
        <Tile size={150} r={0.5}><Icon name={icon} size={96} weight="duotone" /></Tile>
        <div style={{fontWeight: 800, fontSize: 54, color: ok ? INK : '#fff', marginTop: 20}}>{title}</div>
        <div style={{marginTop: 14}}><Icon name={ok ? 'check-circle' : 'x-circle'} size={90} color={ok ? INK : GOLD_LT} weight="fill" /></div>
      </div></In>);
    return <Stage>
      <div style={{display: 'flex', gap: 40, direction: 'rtl'}}>
        <Col icon="file-text" title="القالب" ok at={84.93} />
        <Col icon="brain" title="النموذج" ok={false} at={87.26} />
      </div>
    </Stage>;
  },
  // «والسبب إنه النموذج اللي استخدمته صغير، وعلى الأغلب ما شاف كفاية من لهجاتنا»
  why: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><div style={{display: 'flex', alignItems: 'center', gap: 30, ...ltr}}>
        <Tile size={200} r={0.5}><Logo name="qwen" size={120} /></Tile>
        <div><div style={{fontWeight: 800, fontSize: 96, ...goldText}}>3B</div><div style={{fontWeight: 800, fontSize: 40, color: '#e9e2cf', direction: 'rtl'}}>نموذج صغير</div></div></div></In>
      <In at={T(93.59)} style={{marginTop: 60}}><div style={{display: 'flex', gap: 20, direction: 'rtl'}}>
        {[['فلسطيني', .3], ['شامي', .3], ['مصري', 1]].map(([d, o]) => <div key={d as string} style={{opacity: o as number}}><Chip label={d as string} dark size={46} /></div>)}
      </div></In>
      <In at={T(94.06)} style={{marginTop: 40}}><Pill size={44}><Icon name="question" size={42} color={INK} />شاف أمثلة قليلة من لهجاتنا (على الأغلب)</Pill></In>
    </Stage>;
  },
  // «الخلاصة: القالب بيرتّب طلبك، بس ما بيعلّم النموذج إشي ما بيعرفه. وإذا بدك لهجة صح: نموذج أكبر وأمثلة أكثر»
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <div style={{marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <In at={T(98.5)} pop><div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl'}}>
            <Tile size={110}><Icon name="check" size={72} weight="bold" /></Tile><Big size={80} color={INK} style={{whiteSpace: 'nowrap'}}>القالب = ترتيب</Big></div></In>
          <In at={T(100.12)} pop><div style={{display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl'}}>
            <Tile size={110}><Icon name="x" size={72} weight="bold" /></Tile><div style={{background: INK, borderRadius: 24, padding: '2px 30px'}}><Big size={72} gold style={{whiteSpace: 'nowrap'}}>مش معرفة جديدة</Big></div></div></In>
        </div>
        <In at={T(104.04)} style={{marginTop: 50}}><div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl'}}>
          <span style={{fontWeight: 800, fontSize: 44, color: INK, whiteSpace: 'nowrap'}}>للهجة صح:</span>
          <In at={T(105.08)} pop><Pill dark size={38}><Icon name="arrow-down" size={36} style={{transform: 'rotate(180deg)'}} />نموذج أكبر</Pill></In>
          <In at={T(106.02)} pop><Pill dark size={38}><Icon name="plus" size={36} />أمثلة أكثر</Pill></In>
        </div></In>
      </Stage>
    </>;
  },
  // «الكود كامل على جيت هَب، والرابط بأول تعليق»
  github: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <In at={0} pop><Tile size={280} r={0.5}><Logo name="github" size={180} /></Tile></In>
      <In at={T(108.3)} style={{marginTop: 40}}><Pill dark size={52}><span style={ltr}>day-03/app.py</span></Pill></In>
      <In at={T(109.46)} style={{marginTop: 30}}><Pill size={56}><Icon name="chat-centered-dots" size={54} color={INK} />أول تعليق</Pill></In>
      <In at={T(110.2)} style={{marginTop: 20, transform: `translateY(${Math.abs(Math.sin(f / 5)) * 26}px)`}}><Icon name="arrow-down" size={110} weight="bold" /></In>
    </Stage>;
  },
  // «وإنت، أي لهجة بتحب نجربها على نموذج أكبر؟ اكتبلي بالتعليقات»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const C: [string, number][] = [['خليجي', 112.2], ['مغربي', 112.55], ['عراقي', 112.9], ['سوداني', 113.25]];
    return <Stage>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, width: 900}}>
        {C.map(([l, t], i) => <In key={l} at={T(t)} pop rot={i % 2 ? 12 : -12}><Chip label={l} size={54} /></In>)}
      </div>
      <In at={T(113.84)} pop style={{marginTop: 50}}><div style={{display: 'flex', alignItems: 'center', gap: 22, ...ltr}}>
        <Tile size={150} r={0.5}><Logo name="qwen" size={95} /></Tile><span style={{fontWeight: 800, fontSize: 90, ...goldText}}>72B</span></div></In>
      <In at={T(114.71)} pop style={{marginTop: 46}}><Pill dark size={56}><Icon name="chat-circle-dots" size={54} />بالتعليقات</Pill></In>
    </Stage>;
  },
  // «وتابعني، لأنه بكرة بنحوّل نص فوضوي لبيانات نظيفة»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(116.5) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 110, padding: '10px 80px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={130} color="#fff" /></div>
      </div></In>
      <In at={T(117.11)} style={{marginTop: 110}}>
        <div style={{width: 820, borderRadius: 36, padding: '30px 44px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontWeight: 800, fontSize: 46, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>4</span></div>
            <Tile size={96} r={0.3}><Icon name="brackets-curly" size={60} /></Tile>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 18, ...ltr}}>
            <span style={{fontFamily: 'monospace', fontSize: 34, color: '#9b9078', textDecoration: 'line-through'}}>{'"مبلغ ١٢٥٠ دولار…"'}</span>
            <Icon name="arrow-right" size={50} weight="bold" />
            <span style={{fontFamily: 'monospace', fontSize: 34, color: GOLD_LT}}>{'{"amount": 1250}'}</span>
          </div>
        </div></In>
      <Sequence from={Math.round(T(120.09) * FPS)} durationInFrames={60}><Confetti /></Sequence>
    </Stage>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
