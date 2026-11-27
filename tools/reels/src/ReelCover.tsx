import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arch, Dark, GOLD, GOLD_LT, INK, Icon, Logo, Sky, glossy, goldText} from './brand';

// أغلفة ريلز الصوت بنفس عناصر الريل: أشعة، قوس الصورة، مربعات لامعة، تدرّج ذهبي.
// light = سماء (اليوم 2)، dark = أسود وذهبي (اليوم 3). البيانات بـ COVERS تحت.
// المحتوى المهم داخل 1080×1440 بالنص (قصّ شبكة إنستغرام).
const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};

const Tile: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{...glossy, width: size, height: size, borderRadius: size * 0.28}}>{children}</div>
);

const StaticRays: React.FC<{dark?: boolean}> = ({dark}) => (
  <div style={{position: 'absolute', left: '50%', top: '44%', width: 2600, height: 2600, borderRadius: '50%', transform: 'translate(-50%,-50%) rotate(6deg)',
    background: `repeating-conic-gradient(from 0deg,${dark ? 'rgba(232,192,102,.16)' : 'rgba(255,255,255,.55)'} 0deg 6deg,transparent 6deg 18deg)`,
    WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)'}} />
);

const Piece: React.FC<{icon: string; en: string; dark?: boolean}> = ({icon, en, dark}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
    <Tile size={150}><Icon name={icon} size={92} weight="duotone" /></Tile>
    <div style={{fontWeight: 800, fontSize: 38, color: dark ? '#fff' : INK, direction: 'rtl'}}>{en}</div>
  </div>
);
const Bar: React.FC = () => (
  <div style={{fontFamily: 'monospace', fontWeight: 900, fontSize: 96, lineHeight: 1, marginBottom: 56, ...goldText, filter: 'drop-shadow(0 4px 10px rgba(143,106,31,.35))'}}>|</div>
);

type CoverData = {day: number; dark: boolean; phase: string; logo: string; logoLabel: string; line1: string; pre: string; hl: string; post: string;
  pieces: [string, string][]; sep?: 'bar' | 'none'};
export const COVERS: Record<number, CoverData> = {
  2: {day: 2, dark: false, phase: 'أسبوع الأساسيات', logo: 'langchain', logoLabel: 'LangChain', line1: 'كود طويل…', pre: 'ولا', hl: 'سطر واحد', post: '؟',
    pieces: [['chat-text', 'Prompt'], ['brain', 'LLM'], ['list-checks', 'Parser']], sep: 'bar'},
  3: {day: 3, dark: true, phase: 'أسبوع الأساسيات', logo: 'langchain', logoLabel: 'Prompt Template', line1: 'طلبت 3 لهجات…', pre: 'طلعوا', hl: 'كلهم مصري', post: '!',
    pieces: [['chat-circle-text', 'فلسطيني'], ['chat-circle-text', 'شامي'], ['chat-circle-text', 'مصري']], sep: 'none'},
  4: {day: 4, dark: false, phase: 'أسبوع الأساسيات', logo: 'pydantic', logoLabel: 'Pydantic', line1: 'سألت عن رقم…', pre: 'جاوبني', hl: 'بفقرة كاملة', post: '!',
    pieces: [['chat-teardrop-text', 'حكي'], ['brackets-curly', 'Schema'], ['table', 'بيانات']], sep: 'none'},
  5: {day: 5, dark: true, phase: 'أسبوع الأساسيات', logo: 'langchain', logoLabel: 'Chat Memory', line1: 'البوت ما بيتذكرك…', pre: 'إلا', hl: 'بالدفتر', post: '!',
    pieces: [['robot', 'النموذج'], ['bookmark-simple', 'الدفتر'], ['lock-key', 'session_id']], sep: 'none'},
  6: {day: 6, dark: false, phase: 'أسبوع الراغ', logo: 'langchain', logoLabel: 'RAG · Chunking', line1: 'مش بالنموذج…', pre: 'المشكلة', hl: 'بالمقص', post: '!',
    pieces: [['file-pdf', 'PDF عربي'], ['scissors', 'تقطيع'], ['stack', 'بطاقات']], sep: 'none'},
};

export const ReelCover: React.FC<{day: number}> = ({day}) => {
  const c = COVERS[day]; const dk = c.dark; const fg = dk ? '#fff' : INK;
  return (
  <AbsoluteFill style={{fontFamily: 'Cairo', overflow: 'hidden', background: dk ? '#000' : undefined}}>
    {dk ? <Dark /> : <Sky />}
    <StaticRays dark={dk} />
    <AbsoluteFill style={{background: dk ? 'radial-gradient(ellipse 620px 520px at 50% 40%,rgba(201,162,75,.22) 0,rgba(201,162,75,0) 70%)' : 'radial-gradient(ellipse 620px 520px at 50% 40%,rgba(255,255,255,.85) 0,rgba(255,255,255,0) 70%)'}} />

    <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl'}}>
        <div style={{fontWeight: 800, fontSize: 36, padding: '8px 34px', borderRadius: 99, ...(dk ? {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK} : {background: INK, color: '#F6DE9C'})}}>{c.phase}</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 36, padding: '8px 30px 8px 16px', borderRadius: 99,
          ...(dk ? {background: INK, color: GOLD_LT, border: `3px solid ${GOLD_LT}`} : {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK, border: '3px solid #F6DE9C'})}}>
          <Logo name={c.logo} size={40} color={dk ? 'gold' : INK} /><span style={ltr}>{c.logoLabel}</span>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'baseline', gap: 26, direction: 'rtl', marginTop: 26}}>
        <div style={{fontWeight: 800, fontSize: 78, color: fg}}>اليوم</div>
        <div style={{fontWeight: 800, fontSize: 210, lineHeight: 0.95, ...ltr, ...goldText, filter: 'drop-shadow(0 6px 14px rgba(143,106,31,.35))'}}>{String(c.day).padStart(2, '0')}</div>
      </div>

      <div style={{direction: 'rtl', textAlign: 'center', fontWeight: 800, color: fg, marginTop: 18}}>
        <div style={{fontSize: 96, lineHeight: 1.25}}>{c.line1}</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 22, fontSize: (c.pre + c.hl + c.post).length > 14 ? 88 : 104, lineHeight: 1.2, marginTop: 10}}>
          <span>{c.pre}</span>
          <span style={{borderRadius: 26, padding: '2px 34px 14px', ...(dk ? {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK} : {background: INK, boxShadow: `0 18px 40px rgba(30,20,5,.3), 0 0 0 4px ${GOLD_LT}`})}}>
            <span style={dk ? {} : goldText}>{c.hl}</span></span>
          <span>{c.post}</span>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 56, direction: c.sep === 'bar' ? 'ltr' : 'rtl'}}>
        {c.pieces.map(([ic, en], i) => <React.Fragment key={i}>{i > 0 && c.sep === 'bar' ? <Bar /> : null}<Piece icon={ic} en={en} dark={dk} /></React.Fragment>)}
      </div>
    </div>

    <div style={{position: 'absolute', top: 1220, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Arch w={300} h={390} glow={0.8} />
    </div>

    <div style={{position: 'absolute', bottom: 236, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 26, letterSpacing: 6, color: dk ? '#e9e2cf' : INK, ...ltr}}>
      30 DAYS OF LLM APPS<b style={{color: GOLD, margin: '0 12px'}}>•</b>MOHAMMED ABU SAADA
    </div>
  </AbsoluteFill>);
};
