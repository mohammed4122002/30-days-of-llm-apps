import React from 'react';
import {Sequence, interpolate, random, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, goldText} from './brand';
import {Confetti, Shake, Sign, clamp} from './EnergyReel';
import {Big, Code, FPS, Float, In, Kind, Leak, Pill, SceneFC, Slash, Stage, Tile, ltr} from './voiceKit';
import {Stamp, Term} from './VoiceDay02';

// ريل اليوم 4 (مخرجات منظمة: Pydantic + PydanticOutputParser).
// القاعدة: الكابشن بيحمل كلام محمد، والمشهد بيضيف معلومة جديدة بالحركة.
// كل زمن بالثواني من بداية صوت محمد بعد القص (voiceDay04.json).

export const KIND4: Record<string, Kind> = {
  hook: 'dark', paragraph: 'sky', number: 'gold', inbox: 'dark', table: 'sky', chatty: 'dark', solution: 'gold', schema: 'dark',
  airport: 'sky', letsgo: 'gold', code: 'dark', parser: 'sky', input: 'dark', run: 'dark', result: 'sky', currency: 'gold',
  lesson: 'dark', allowed: 'sky', golden: 'gold', github: 'dark', ask: 'sky', next: 'dark', outro: 'dark',
};

// الكود الحقيقي (day-04/app.py)
const CODE = [
  'class Invoice(BaseModel):',
  '    vendor: str      # اسم الشركة',
  '    total: float     # المبلغ',
  '    currency: str    # العملة',
  '',
  'parser = PydanticOutputParser(pydantic_object=Invoice)',
];
// جزء حقيقي من تعليمات الصيغة اللي بيولّدها البارسر (get_format_instructions)
const FMT = [
  'The output should be formatted as a JSON',
  'instance that conforms to the JSON schema:',
  '{"properties": {',
  '  "vendor":   {"type": "string"},',
  '  "total":    {"type": "number"},',
  '  "currency": {"type": "string"}},',
  ' "required": ["vendor", "total", "currency"]}',
];
const INPUT = 'فاتورة من شركة النور بمبلغ 1250.5 دولار';   // حرفيًا من الكود
// رد شات بوت "عادي" (توضيحي، مش من الكود)
const CHATTY = 'بكل سرور! بعد مراجعة الفاتورة المرفقة بعناية، يسعدني إبلاغك بأن المبلغ الإجمالي المذكور فيها هو ألف ومئتان وخمسون دولارًا ونصف، صادرة عن شركة النور. وإذا احتجت أي مساعدة إضافية فأنا هنا دائمًا. شكرًا جزيلًا على سؤالك الرائع!';

const Paper: React.FC<{children: React.ReactNode; w?: number; rot?: number}> = ({children, w = 620, rot = 0}) => (
  <div style={{width: w, background: '#fffdf7', borderRadius: 22, padding: '30px 36px', border: `4px solid ${INK}`, boxShadow: `12px 12px 0 ${GOLD_LT}`, transform: `rotate(${rot}deg)`, direction: 'rtl'}}>{children}</div>
);
const Line: React.FC<{w: number; dark?: boolean}> = ({w, dark}) => <div style={{height: 14, width: `${w}%`, borderRadius: 7, background: dark ? '#3a3220' : '#d9d1bd', marginTop: 14}} />;

// صف بخانة (اسم + نوع + قيمة)
const Field: React.FC<{name: string; type: string; icon: string; value?: React.ReactNode; at: number; vAt?: number; ok?: boolean; okAt?: number; dark?: boolean}> =
  ({name, type, icon, value, at, vAt, ok, okAt, dark}) => {
    const f = useCurrentFrame(); const show = (t?: number) => (t == null ? 0 : interpolate(f, [t * FPS, t * FPS + 8], [0, 1], clamp));
    const v = show(vAt); const k = show(okAt);
    return <In at={at} x={160} y={0}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl', width: 900, background: dark ? 'linear-gradient(150deg,#2a2a2a,#0d0d0d)' : '#fff', border: `4px solid ${dark ? GOLD_LT : INK}`,
        borderRadius: 26, padding: '18px 24px', boxShadow: dark ? '0 20px 40px rgba(0,0,0,.4)' : `8px 8px 0 ${GOLD_LT}`}}>
        <Tile size={86} r={0.3}><Icon name={icon} size={52} weight="duotone" /></Tile>
        <div style={{width: 190}}>
          <div style={{fontWeight: 800, fontSize: 40, color: dark ? '#fff' : INK}}>{name}</div>
          <div style={{fontFamily: 'monospace', fontWeight: 700, fontSize: 26, color: dark ? GOLD_LT : '#8a6a1f', ...ltr, textAlign: 'right'}}>{type}</div>
        </div>
        <div style={{flex: 1, minHeight: 74, borderRadius: 16, border: `3px dashed ${v > 0.5 ? 'transparent' : dark ? '#6d6450' : '#bfb49b'}`, display: 'flex', alignItems: 'center', padding: '0 20px',
          background: v > 0.5 ? (dark ? '#151310' : '#fffaf0') : 'transparent'}}>
          <span style={{fontWeight: 800, fontSize: 46, color: dark ? '#fff' : INK, opacity: v, transform: `scale(${0.7 + 0.3 * v})`, display: 'inline-block'}}>{value}</span>
        </div>
        {okAt != null ? <div style={{opacity: k, transform: `scale(${0.4 + 0.6 * k})`}}><Icon name={ok ? 'check-circle' : 'x-circle'} size={70} color={ok ? (dark ? 'gold' : INK) : GOLD_LT} weight="fill" /></div> : null}
      </div></In>;
  };

export const S4: Record<string, SceneFC> = {
  // «سألت الذكاء الاصطناعي: كم مبلغ هاي الفاتورة؟»
  hook: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const pulse = 1 + Math.sin(f / 4) * 0.08;
    return <Stage>
      <In at={0} pop rot={-8}><Paper w={640} rot={-3}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}><Icon name="receipt" size={64} color={INK} /><span style={{fontWeight: 800, fontSize: 52, color: INK}}>فاتورة</span></div>
        <Line w={90} /><Line w={70} /><Line w={80} />
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, borderTop: `3px dashed ${INK}`, paddingTop: 18}}>
          <span style={{fontWeight: 800, fontSize: 44, color: INK}}>المبلغ</span>
          <In at={T(2.07)} pop><span style={{display: 'inline-block', fontWeight: 800, fontSize: 90, color: INK, background: GOLD_LT, borderRadius: 18, padding: '0 30px', transform: `scale(${pulse})`}}>؟</span></In>
        </div>
      </Paper></In>
      <In at={T(1.0)} pop style={{marginTop: 50}}><Float amp={10}><Tile size={170} r={0.5}><Icon name="robot" size={110} weight="duotone" /></Tile></Float></In>
    </Stage>;
  },
  // «وجاوبني بفقرة كاملة، وشكرني على سؤالي كمان» — الفقرة بتنكتب وبتطوّل
  paragraph: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const n = Math.floor(interpolate(f, [T(3.8) * FPS, T(7.9) * FPS], [0, CHATTY.length], clamp));
    const thanks = CHATTY.indexOf('شكرًا'); const shown = CHATTY.slice(0, n);
    return <Stage>
      <In at={0} x={200} y={0}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, direction: 'ltr'}}>
          <div style={{width: 760, background: '#fff', color: INK, fontWeight: 800, fontSize: 40, lineHeight: 1.55, padding: '26px 34px', borderRadius: '36px 36px 8px 36px', border: `4px solid ${INK}`, direction: 'rtl', boxShadow: `10px 10px 0 ${GOLD_LT}`, minHeight: 300}}>
            {n > thanks ? <>{shown.slice(0, thanks)}<span style={{background: GOLD_LT, borderRadius: 8, padding: '0 6px'}}>{shown.slice(thanks)}</span></> : shown}
            {n < CHATTY.length ? <span style={{color: GOLD}}>▌</span> : null}
          </div>
          <Tile size={110} r={0.5}><Icon name="robot" size={70} weight="duotone" /></Tile>
        </div></In>
      <In at={T(6.0)} pop style={{marginTop: 40}}><Pill dark size={46}><Icon name="ruler" size={42} /><span style={ltr}>{Math.min(42, Math.round(n / 6))}</span> كلمة… لسؤال برقم</Pill></In>
    </Stage>;
  },
  // «وأنا كل اللي بدي إياه: رقم واحد»
  number: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const glow = 30 + Math.sin(f / 5) * 14;
    return <Stage>
      <In at={T(10.23)} pop><div style={{background: INK, borderRadius: 40, padding: '10px 70px', boxShadow: `0 0 ${glow}px rgba(232,192,102,.6)`}}>
        <div style={{fontWeight: 800, fontSize: 230, lineHeight: 1.1, ...goldText, ...ltr}}>1250.5</div></div></In>
      <In at={T(10.5)} pop style={{marginTop: 40}}><Pill size={50}><Icon name="check-circle" size={46} color={INK} />بس هيك</Pill></In>
    </Stage>;
  },
  // «تخيل عندك مية فاتورة واصلة على الإيميل، ومديرك بدو جدول إكسل»
  inbox: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cnt = Math.floor(interpolate(f, [T(12.6) * FPS, T(14.6) * FPS], [0, 100], clamp));
    return <Stage>
      <div style={{position: 'relative', width: 880, height: 560}}>
        {Array.from({length: 7}).map((_, i) => {
          const st = T(12.6) * FPS + i * 4; const k = interpolate(f, [st, st + 10], [0, 1], clamp);
          return <div key={i} style={{position: 'absolute', left: 60 + i * 18, top: 40 + i * 50, opacity: k, transform: `translateX(${(1 - k) * 500}px) rotate(${(random('r' + i) - 0.5) * 6}deg)`}}>
            <div style={{width: 680, display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `3px solid ${GOLD}`, borderRadius: 18, padding: '14px 22px', direction: 'rtl'}}>
              <Icon name="file-pdf" size={44} /><span style={{fontWeight: 800, fontSize: 34, color: '#fff'}}>فاتورة</span>
              <span style={{fontFamily: 'monospace', fontSize: 26, color: '#9b9078', ...ltr}}>{`invoice_${String(i * 13 + 7).padStart(3, '0')}.pdf`}</span></div></div>;
        })}
        <In at={T(12.73)} pop style={{position: 'absolute', right: 0, top: -30}}><div style={{background: GOLD_LT, color: INK, fontWeight: 800, fontSize: 64, borderRadius: 99, padding: '4px 34px', ...ltr}}>{cnt}</div></In>
      </div>
      <In at={T(15.87)} pop style={{marginTop: 10}}><div style={{display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl'}}>
        <Tile size={120}><Icon name="table" size={78} weight="duotone" /></Tile><Big size={76} gold style={ltr}>Excel</Big></div></In>
    </Stage>;
  },
  // «مين الشركة، وكم المبلغ، وبأي عملة» — أعمدة الجدول بتطلع
  table: ({t0}) => {
    const T = (s: number) => s - t0;
    const cols: [string, number][] = [['الشركة', 17.28], ['المبلغ', 18.31], ['العملة', 19.46]];
    return <Stage>
      <In at={0}><div style={{width: 900, border: `5px solid ${INK}`, borderRadius: 24, overflow: 'hidden', background: '#fff', boxShadow: `14px 14px 0 ${GOLD_LT}`, direction: 'rtl'}}>
        <div style={{display: 'flex', background: INK}}>{cols.map(([c, t]) => <div key={c} style={{flex: 1, padding: '20px 0', textAlign: 'center'}}>
          <In at={T(t)} pop><span style={{fontWeight: 800, fontSize: 48, color: GOLD_LT}}>{c}</span></In></div>)}</div>
        {[0, 1, 2, 3].map((r) => <div key={r} style={{display: 'flex', borderTop: '3px solid #e5dccb'}}>{cols.map(([c], i) => <div key={c} style={{flex: 1, height: 84, borderRight: i ? '3px solid #e5dccb' : 'none'}} />)}</div>)}
      </div></In>
      <In at={T(19.8)} pop style={{marginTop: 40}}><Pill dark size={46}><Icon name="table" size={42} />جدول فاضي… بدو يتعبّى</Pill></In>
    </Stage>;
  },
  // «النموذج بيفهم الفاتورة تمام، بس بيرد عليك بحكي… والحكي ما بينحط داخل جدول»
  chatty: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const hit = T(25.64) * FPS; const k = interpolate(f, [hit - 14, hit], [0, 1], clamp); const back = interpolate(f, [hit, hit + 10], [0, 1], clamp);
    const x = k * 1 - back * 0.55;
    return <Shake power={16} frames={8}><Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'rtl', height: 560}}>
        <div style={{transform: `translateX(${-x * 260}px) rotate(${x * -8}deg)`}}>
          <In at={T(22.32)} pop><div style={{width: 360, background: '#fff', color: INK, fontWeight: 800, fontSize: 30, lineHeight: 1.5, padding: '20px 24px', borderRadius: '28px 28px 28px 6px', border: `4px solid ${INK}`}}>
            {CHATTY.slice(0, 70)}…</div></In></div>
        <In at={T(24.81)} pop><div style={{width: 330, border: `5px solid ${GOLD_LT}`, borderRadius: 18, overflow: 'hidden'}}>
          <div style={{background: GOLD_LT, color: INK, fontWeight: 800, fontSize: 32, padding: '8px 0', textAlign: 'center'}}>المبلغ</div>
          <div style={{height: 110, background: '#151310', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {back > 0.2 ? <Icon name="x" size={80} color={GOLD_LT} weight="bold" /> : null}</div></div></In>
      </div>
      <In at={T(26.23)} pop rot={-18}><Stamp rot={-5} size={74}>حكي ≠ بيانات</Stamp></In>
    </Stage></Shake>;
  },
  // «الحل: بدل ما تخليه يجاوب على كيفه، بتعطيه الشكل اللي لازم يجاوب فيه»
  solution: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const draw = interpolate(f, [T(31.92) * FPS, T(33.4) * FPS], [0, 1], clamp);
    return <>
      <Leak seed={3} frames={36} />
      <Stage>
        <div style={{display: 'flex', alignItems: 'center', gap: 50, direction: 'rtl'}}>
          <In at={T(29.36)} pop><div style={{position: 'relative', textAlign: 'center'}}>
            <Tile size={210}><Icon name="chat-teardrop-text" size={130} weight="duotone" /></Tile>
            <div style={{fontWeight: 800, fontSize: 40, color: INK, marginTop: 16}}>على كيفه</div><Slash at={T(30.9)} color={INK} /></div></In>
          <In at={T(31.92)} pop><Icon name="arrow-left" size={80} color={INK} weight="bold" /></In>
          <In at={T(31.92)} pop><div style={{textAlign: 'center'}}>
            <div style={{width: 230, height: 230, borderRadius: 40, padding: 18, border: `6px dashed ${INK}`, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', background: 'rgba(255,255,255,.55)'}}>
              {[0, 1, 2].map((i) => <div key={i} style={{height: 34, borderRadius: 10, background: INK, width: `${Math.min(1, draw * 3 - i) * 100}%`}} />)}</div>
            <div style={{fontWeight: 800, fontSize: 40, color: INK, marginTop: 16}}>شكل ثابت</div></div></In>
        </div>
      </Stage>
    </>;
  },
  // «هاد الشكل اسمه سكيما»
  schema: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={T(36.37)} pop><Tile size={230}><Icon name="brackets-curly" size={150} weight="duotone" /></Tile></In>
      <In at={T(36.37)} style={{marginTop: 40}}><Big size={130} gold style={ltr}>Schema</Big></In>
      <In at={T(36.9)} pop style={{marginTop: 20}}><Pill size={50}>شكل الجواب، خانة خانة</Pill></In>
    </Stage>;
  },
  // «زي استمارة المطار: كل خانة إلها اسم وإلها نوع… وما في مكان لحكي زيادة»
  airport: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Paper w={900}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}><Icon name="paper-plane-tilt" size={60} color={INK} /><span style={{fontWeight: 800, fontSize: 48, color: INK}}>استمارة الوصول</span></div>
          <span style={{fontFamily: 'monospace', fontSize: 30, color: '#8a6a1f', ...ltr}}>ARRIVAL</span></div>
        {[['الاسم', 'حروف', 'text-aa', 41.8, 'MOHAMMED'], ['المبلغ', 'أرقام', 'list-numbers', 43.68, '1250.5']].map(([n, ty, ic, t, val]) => (
          <In key={n as string} at={T(t as number)} x={120} y={0}><div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 26}}>
            <Icon name={ic as string} size={48} color={INK} /><span style={{fontWeight: 800, fontSize: 42, color: INK, width: 150}}>{n}</span>
            <div style={{flex: 1, display: 'flex', gap: 6, ...ltr}}>{(val as string).split('').map((c, i) => <div key={i} style={{width: 50, height: 66, border: `3px solid ${INK}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 800, fontSize: 38, color: INK}}>{c}</div>)}</div>
            <span style={{fontWeight: 800, fontSize: 30, background: INK, color: GOLD_LT, borderRadius: 99, padding: '2px 16px'}}>{ty}</span></div></In>))}
      </Paper></In>
      <In at={T(46.48)} pop rot={-15} style={{marginTop: 46}}><div style={{position: 'relative'}}><Pill dark size={46}><Icon name="chat-text" size={42} />مكان للحكي الزيادة</Pill><Slash at={T(47.6)} /></div></In>
    </Stage>;
  },
  // «تعالوا نشوف عملي. بفتح في إس كود»
  letsgo: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} pop><Tile size={230}><Icon name="file-code" size={140} weight="duotone" /></Tile></In>
      <In at={T(51.33)} pop style={{marginTop: 40}}><Big size={110} color={INK} style={ltr}>VS Code</Big></In>
      <In at={T(51.6)} style={{marginTop: 26}}><Pill dark size={48}><Logo name="python" size={44} /><span style={ltr}>day-04/app.py</span></Pill></In>
    </Stage>;
  },
  // «وبكتب السكيما بمكتبة اسمها بايدانتك: فاتورة فيها ثلاث خانات… وبعطيها لأداة اسمها بارسر»
  code: ({t0}) => {
    const T = (s: number) => s - t0;
    const B: [string, number][] = [['نص', 59.25], ['رقم', 60.16], ['نص', 61.4]];
    return <Stage>
      <In at={T(53.67)} x={200} y={0}><Pill size={46}><Logo name="pydantic" size={44} color={INK} /><span style={ltr}>Pydantic</span></Pill></In>
      <In at={0.3} style={{marginTop: 40}}><Code lines={CODE} from={T(55.5)} to={T(64.6)} hl="Invoice" title="app.py" /></In>
      <div style={{display: 'flex', gap: 20, marginTop: 34, direction: 'rtl'}}>
        {B.map(([b, t], i) => <In key={i} at={T(t)} pop><Pill dark size={40}><span style={{...ltr, fontFamily: 'monospace'}}>{['str', 'float', 'str'][i]}</span> = {b}</Pill></In>)}
      </div>
      <In at={T(64.45)} pop style={{marginTop: 20}}><Pill size={44}><Icon name="funnel" size={40} color={INK} /><span style={ltr}>Parser</span></Pill></In>
    </Stage>;
  },
  // «وهي بتكتب للنموذج تعليمات الشكل لحالها، ما بكتبها أنا»
  parser: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const total = FMT.join('').length; let n = Math.floor(interpolate(f, [T(66.2) * FPS, T(69.6) * FPS], [0, total], clamp));
    return <Stage>
      <div style={{display: 'flex', alignItems: 'center', gap: 24, direction: 'rtl'}}>
        <In at={0} pop><Tile size={130}><Icon name="funnel" size={84} weight="duotone" /></Tile></In>
        <In at={T(67.18)} x={-100} y={0}><Big size={64} color={INK}>تعليمات الشكل <span style={{fontSize: 44}}>(تلقائي)</span></Big></In>
      </div>
      <In at={0.2} style={{marginTop: 40}}>
        <div style={{width: 940, borderRadius: 26, background: '#0b0b0b', border: `3px solid ${GOLD}`, padding: '24px 28px', fontFamily: 'monospace', fontSize: 27, lineHeight: 1.55, color: '#e9e2cf', whiteSpace: 'pre', ...ltr, minHeight: 360}}>
          {FMT.map((l, i) => { const sh = l.slice(0, Math.max(0, n)); n -= l.length; return <div key={i} style={{color: l.includes('"type"') ? GOLD_LT : '#e9e2cf'}}>{sh}</div>; })}
        </div></In>
      <In at={T(68.87)} pop style={{marginTop: 34}}><div style={{position: 'relative'}}><Pill dark size={44}><Icon name="pencil-simple" size={40} />كتابة يدوية</Pill><Slash at={T(69.5)} /></div></In>
    </Stage>;
  },
  // «وبعطيه الفاتورة: فاتورة من شركة النور، بمبلغ 1250.5 دولار» (الكابشن مخفي — النص على الشاشة)
  input: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const words = INPUT.split(' '); const n = Math.floor(interpolate(f, [T(71.82) * FPS, T(76.2) * FPS], [0, words.length], clamp));
    return <Stage>
      <In at={0} y={-60}><Pill dark size={44}><Icon name="receipt" size={42} />النص اللي بعطيه للنموذج</Pill></In>
      <In at={0.15} style={{marginTop: 50}}><Paper w={920}>
        <div style={{fontWeight: 800, fontSize: 70, lineHeight: 1.5, color: INK, textAlign: 'center'}}>
          {words.map((w, i) => <span key={i} style={{display: 'inline-block', margin: '0 10px', opacity: i < n ? 1 : 0.15, ...(w === '1250.5' ? {...ltr, background: i < n ? GOLD_LT : 'transparent', borderRadius: 12, padding: '0 10px'} : {})}}>{w}</span>)}
        </div></Paper></In>
    </Stage>;
  },
  // «بشغّل، وهاي النتيجة»
  run: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const cmd = '$ python day-04/app.py'; const typed = cmd.slice(0, Math.floor(interpolate(f, [T(76.8) * FPS, T(77.9) * FPS], [0, cmd.length], clamp)));
    const p = interpolate(f, [T(78.0) * FPS, T(79.8) * FPS], [0, 1], clamp);
    return <Stage>
      <In at={0}><Term>
        <div style={{fontFamily: 'monospace', fontSize: 38, color: GOLD_LT, ...ltr}}>{typed}<span style={{opacity: Math.floor(f / 8) % 2}}>_</span></div>
        <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 20, ...ltr}}><Logo name="qwen" size={56} /><span style={{fontFamily: 'monospace', fontSize: 32, color: '#bfb498'}}>Qwen2.5-3B (local)</span></div>
        <div style={{marginTop: 26, height: 18, borderRadius: 9, background: '#222', overflow: 'hidden'}}><div style={{height: '100%', width: `${p * 100}%`, background: 'linear-gradient(90deg,#8F6A1F,#E8C066,#FFF1C4)'}} /></div>
      </Term></In>
    </Stage>;
  },
  // «الشركة: شركة النور، صح. المبلغ 1250.5، ورقم حقيقي بتقدر تجمعه وتحسب عليه، صح. والعملة؟»
  result: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const sum = interpolate(f, [T(86.6) * FPS, T(89.4) * FPS], [0, 1], clamp);
    return <Stage>
      <In at={0} y={-60}><Pill dark size={42}><Icon name="brackets-curly" size={40} />النتيجة</Pill></In>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40, alignItems: 'center'}}>
        <Field name="الشركة" type="vendor: str" icon="text-aa" value="شركة النور" at={0.1} vAt={T(80.63)} ok okAt={T(81.52)} />
        <Field name="المبلغ" type="total: float" icon="list-numbers" value={<span style={ltr}>1250.5</span>} at={0.25} vAt={T(81.88)} ok okAt={T(89.94)} />
        <Field name="العملة" type="currency: str" icon="coins" value="؟" at={0.4} vAt={T(90.33)} />
      </div>
      <In at={T(86.55)} pop style={{marginTop: 30}}><div style={{display: 'flex', alignItems: 'center', gap: 16, background: INK, borderRadius: 20, padding: '10px 28px', fontFamily: 'monospace', fontSize: 40, color: '#fff', ...ltr}}>
        <Icon name="calculator" size={44} /> 1250.5 × 100 = <span style={{color: GOLD_LT}}>{Math.round(125050 * sum).toLocaleString('en-US')}</span></div></In>
    </Stage>;
  },
  // «كتبها: شَرطة، دولار، بالإنجليزي. يعني الشكل صح مية بالمية، بس القيمة نفسها مش نظيفة»
  currency: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const r = interpolate(f, [T(92.37) * FPS, T(92.37) * FPS + 10], [0, 1], clamp);
    return <Shake power={22} frames={12}><Stage>
      <In at={0} pop><div style={{background: INK, borderRadius: 34, padding: '30px 60px', textAlign: 'center', border: `5px solid ${GOLD_LT}`}}>
        <div style={{fontWeight: 800, fontSize: 40, color: '#e9e2cf'}}>العملة</div>
        <div style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 150, color: '#fff', ...ltr, opacity: r, transform: `scale(${0.6 + 0.4 * r})`}}>
          <span style={{color: GOLD_LT}}>'</span><span style={{background: GOLD_LT, color: INK, borderRadius: 14, padding: '0 10px'}}>-</span>dollar<span style={{color: GOLD_LT}}>'</span></div></div></In>
      <In at={T(93.5)} pop rot={-15} style={{marginTop: 34}}><Stamp rot={-4} size={56}>مش USD</Stamp></In>
      <div style={{display: 'flex', gap: 26, marginTop: 40, direction: 'rtl'}}>
        <In at={T(94.64)} pop><Pill dark size={48}><Icon name="check-circle" size={44} />الشكل <span style={ltr}>100%</span></Pill></In>
        <In at={T(96.52)} pop><Pill dark size={48}><Icon name="x-circle" size={44} />القيمة</Pill></In>
      </div>
    </Stage></Shake>;
  },
  // «وهون أهم درس اليوم: السكيما بتضمنلك الشكل، بس ما بتضمنلك إنه الجواب صح»
  lesson: ({t0}) => {
    const T = (s: number) => s - t0;
    return <Stage>
      <In at={0} y={-60}><Pill size={42}><Icon name="lightbulb" size={40} color={INK} />أهم درس</Pill></In>
      <div style={{display: 'flex', gap: 40, marginTop: 60, direction: 'rtl'}}>
        <In at={T(102.25)} pop><div style={{width: 400, textAlign: 'center', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, borderRadius: 34, padding: '34px 16px'}}>
          <Tile size={150} r={0.5}><Icon name="shield-check" size={100} /></Tile>
          <div style={{fontWeight: 800, fontSize: 52, color: '#fff', marginTop: 20}}>الشكل</div><div style={{fontWeight: 800, fontSize: 36, color: GOLD_LT}}>مضمون</div></div></In>
        <In at={T(104.41)} pop><div style={{width: 400, textAlign: 'center', background: '#fff', border: `4px solid ${INK}`, borderRadius: 34, padding: '34px 16px'}}>
          <Tile size={150} r={0.5}><Icon name="shield-warning" size={100} /></Tile>
          <div style={{fontWeight: 800, fontSize: 52, color: INK, marginTop: 20}}>الصح</div><div style={{fontWeight: 800, fontSize: 36, color: '#8a6a1f'}}>مش مضمون</div></div></In>
      </div>
    </Stage>;
  },
  // «حدد القيم المسموحة: دولار أو يورو أو شيكل… وإذا كتب إشي برا القائمة، البارسر بيرفضه، وإنت بتعرف فورًا»
  allowed: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    const rej = T(118.44) * FPS; const k = interpolate(f, [rej - 16, rej], [0, 1], clamp); const bounce = interpolate(f, [rej, rej + 12], [0, 1], clamp);
    const V: [string, string, number][] = [['USD', 'دولار', 112.89], ['EUR', 'يورو', 114.06], ['ILS', 'شيكل', 115.11]];
    return <Stage>
      <In at={0}><div style={{width: 640, background: '#fff', border: `5px solid ${INK}`, borderRadius: 30, padding: '24px 30px', boxShadow: `12px 12px 0 ${GOLD_LT}`, direction: 'rtl'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: 42, color: INK}}><Icon name="list-checks" size={48} color={INK} />القيم المسموحة للعملة</div>
        {V.map(([c, a, t]) => <In key={c} at={T(t)} x={120} y={0}><div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, background: '#fbf6ea', borderRadius: 16, padding: '10px 20px'}}>
          <span style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 48, color: INK}}>{c}</span><span style={{fontWeight: 800, fontSize: 40, color: '#5a4f38'}}>{a}</span></div></In>)}
      </div></In>
      <In at={T(115.89)} style={{marginTop: 40}}>
        <div style={{transform: `translateY(${(k - bounce * 1.2) * -120}px) rotate(${bounce * 14}deg)`, opacity: 1 - bounce * 0.35}}>
          <div style={{fontFamily: 'monospace', fontWeight: 800, fontSize: 70, color: '#fff', background: INK, borderRadius: 18, padding: '6px 36px', border: `4px solid ${GOLD_LT}`, ...ltr}}>'-dollar'</div></div></In>
      <In at={T(119.2)} pop rot={-20} style={{marginTop: 20}}><Stamp rot={-5} size={64}><Icon name="x-circle" size={56} color={INK} /> البارسر رفضه</Stamp></In>
      <In at={T(120.42)} pop style={{marginTop: 24}}><Pill dark size={44}><Icon name="warning-circle" size={40} />بتعرف فورًا</Pill></In>
    </Stage>;
  },
  // «الخلاصة: النموذج بيحكي، وإنت بدك بيانات. السكيما بتحوّل الحكي لبيانات، وإنت بتتأكد إنها صح»
  golden: ({t0}) => {
    const T = (s: number) => s - t0;
    return <>
      <Leak seed={7} frames={50} />
      <Stage>
        <In at={0} y={-60}><Pill dark size={40}><Icon name="sparkle" size={38} />خلاصة اليوم</Pill></In>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, marginTop: 60, direction: 'rtl'}}>
          <In at={T(122.34)} pop><div style={{textAlign: 'center'}}><Tile size={190}><Icon name="chat-teardrop-text" size={120} weight="duotone" /></Tile><div style={{fontWeight: 800, fontSize: 46, color: INK, marginTop: 14}}>حكي</div></div></In>
          <In at={T(125.3)} pop><div style={{textAlign: 'center'}}><div style={{background: INK, borderRadius: 24, padding: '8px 22px'}}><Big size={52} gold style={ltr}>Schema</Big></div>
            <Icon name="arrow-left" size={70} color={INK} weight="bold" /></div></In>
          <In at={T(126.62)} pop><div style={{textAlign: 'center'}}><Tile size={190}><Icon name="table" size={120} weight="duotone" /></Tile><div style={{fontWeight: 800, fontSize: 46, color: INK, marginTop: 14}}>بيانات</div></div></In>
        </div>
        <In at={T(127.33)} pop style={{marginTop: 50}}><div style={{background: INK, borderRadius: 26, padding: '4px 40px'}}><Big size={80} gold style={{whiteSpace: 'nowrap'}}>وإنت بتتأكد إنها صح.</Big></div></In>
      </Stage>
    </>;
  },
  // «الكود كامل على جيت هَب، والرابط بأول تعليق»
  github: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame();
    return <Stage>
      <In at={0} pop><Tile size={280} r={0.5}><Logo name="github" size={180} /></Tile></In>
      <In at={T(130.9)} style={{marginTop: 40}}><Pill dark size={52}><span style={ltr}>day-04/app.py</span></Pill></In>
      <In at={T(131.85)} style={{marginTop: 30}}><Pill size={56}><Icon name="chat-centered-dots" size={54} color={INK} />أول تعليق</Pill></In>
      <In at={T(132.7)} style={{marginTop: 20, transform: `translateY(${Math.abs(Math.sin(f / 5)) * 26}px)`}}><Icon name="arrow-down" size={110} weight="bold" /></In>
    </Stage>;
  },
  // «شو أكثر نص فوضوي بتتعامل معه بشغلك؟ فواتير؟ سير ذاتية؟ إيميلات زبائن؟ اكتبلي بالتعليقات»
  ask: ({t0}) => {
    const T = (s: number) => s - t0;
    const C: [string, string, number][] = [['receipt', 'فواتير', 137.81], ['user-circle', 'سير ذاتية', 138.98], ['chat-circle-text', 'إيميلات زبائن', 140.21]];
    return <Stage>
      <In at={0} pop><Tile size={200} r={0.5}><Icon name="question" size={130} weight="duotone" /></Tile></In>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 50}}>
        {C.map(([ic, l, t], i) => <In key={l} at={T(t)} pop rot={i % 2 ? 10 : -10}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: `4px solid ${INK}`, borderRadius: '30px 30px 30px 6px', padding: '14px 34px', boxShadow: `8px 8px 0 ${GOLD_LT}`, direction: 'rtl'}}>
            <Icon name={ic} size={54} color={INK} /><span style={{fontWeight: 800, fontSize: 54, color: INK}}>{l}</span></div></In>)}
      </div>
      <In at={T(141.93)} pop style={{marginTop: 46}}><Pill dark size={54}><Icon name="chat-circle-dots" size={50} />بالتعليقات</Pill></In>
    </Stage>;
  },
  // «وتابعني، لأنه بكرة بنعمل بوت بيتذكرك، وبيتذكر شو حكيتله»
  next: ({t0}) => {
    const T = (s: number) => s - t0; const f = useCurrentFrame(); const click = T(144.6) * FPS; const pressed = f > click && f < click + 8;
    return <Stage>
      <In at={0} pop><div style={{position: 'relative'}}>
        <div style={{fontWeight: 800, fontSize: 110, padding: '10px 80px', borderRadius: 40, background: pressed ? GOLD : 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, transform: `scale(${pressed ? 0.92 : 1})`, boxShadow: '0 0 80px rgba(232,192,102,.5)'}}>تابعني</div>
        <div style={{position: 'absolute', right: -40, bottom: -70, transform: `translate(${interpolate(f, [0, click], [140, 0], clamp)}px,${interpolate(f, [0, click], [140, 0], clamp)}px)`}}><Icon name="hand-pointing" size={130} color="#fff" /></div>
      </div></In>
      <In at={T(145.71)} style={{marginTop: 110}}>
        <div style={{width: 820, borderRadius: 36, padding: '30px 44px', background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', border: `4px solid ${GOLD_LT}`, direction: 'rtl', boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontWeight: 800, fontSize: 46, color: '#e9e2cf'}}>بكرة: اليوم <span style={ltr}>5</span></div>
            <Tile size={96} r={0.3}><Icon name="brain" size={60} weight="duotone" /></Tile>
          </div>
          <div style={{fontWeight: 800, fontSize: 60, color: '#fff', marginTop: 12}}>بوت <span style={goldText}>بيتذكرك</span></div>
        </div></In>
      <Sequence from={Math.round(T(148.3) * FPS)} durationInFrames={60}><Confetti /></Sequence>
    </Stage>;
  },
  outro: () => <><Leak seed={11} frames={40} /><Sign start={6} /></>,
};
