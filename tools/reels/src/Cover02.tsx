import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arch, GOLD, GOLD_LT, INK, Icon, Logo, Sky, glossy, goldText} from './brand';

// غلاف ريل اليوم 2 — لايت مود (سماء) بنفس عناصر الريل: أشعة، قوس الصورة، مربعات لامعة، تدرّج ذهبي.
// المحتوى المهم داخل 1080×1440 بالنص (قصّ شبكة إنستغرام).
const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};

const Tile: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <div style={{...glossy, width: size, height: size, borderRadius: size * 0.28}}>{children}</div>
);

const StaticRays: React.FC = () => (
  <div style={{position: 'absolute', left: '50%', top: '44%', width: 2600, height: 2600, borderRadius: '50%', transform: 'translate(-50%,-50%) rotate(6deg)',
    background: 'repeating-conic-gradient(from 0deg,rgba(255,255,255,.55) 0deg 6deg,transparent 6deg 18deg)',
    WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 25%,transparent 55%)'}} />
);

const Piece: React.FC<{icon: string; en: string}> = ({icon, en}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
    <Tile size={150}><Icon name={icon} size={92} weight="duotone" /></Tile>
    <div style={{fontWeight: 800, fontSize: 38, color: INK, ...ltr}}>{en}</div>
  </div>
);
const Bar: React.FC = () => (
  <div style={{fontFamily: 'monospace', fontWeight: 900, fontSize: 96, lineHeight: 1, marginBottom: 56, ...goldText, filter: 'drop-shadow(0 4px 10px rgba(143,106,31,.35))'}}>|</div>
);

export const Cover02: React.FC = () => (
  <AbsoluteFill style={{fontFamily: 'Cairo', overflow: 'hidden'}}>
    <Sky />
    <StaticRays />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 620px 520px at 50% 40%,rgba(255,255,255,.85) 0,rgba(255,255,255,0) 70%)'}} />

    {/* المحتوى: بين 240 و 1680 */}
    <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl'}}>
        <div style={{fontWeight: 800, fontSize: 36, padding: '8px 34px', borderRadius: 99, background: INK, color: '#F6DE9C'}}>أسبوع الأساسيات</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 36, padding: '8px 30px 8px 16px', borderRadius: 99,
          background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK, border: '3px solid #F6DE9C'}}>
          <Logo name="langchain" size={40} color={INK} /><span style={ltr}>LangChain</span>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'baseline', gap: 26, direction: 'rtl', marginTop: 26}}>
        <div style={{fontWeight: 800, fontSize: 78, color: INK}}>اليوم</div>
        <div style={{fontWeight: 800, fontSize: 210, lineHeight: 0.95, ...ltr, ...goldText, filter: 'drop-shadow(0 6px 14px rgba(143,106,31,.35))'}}>02</div>
      </div>

      <div style={{direction: 'rtl', textAlign: 'center', fontWeight: 800, color: INK, marginTop: 18}}>
        <div style={{fontSize: 96, lineHeight: 1.25}}>كود طويل…</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 22, fontSize: 104, lineHeight: 1.2, marginTop: 10}}>
          <span>ولا</span>
          <span style={{background: INK, borderRadius: 26, padding: '2px 34px 14px', boxShadow: `0 18px 40px rgba(30,20,5,.3), 0 0 0 4px ${GOLD_LT}`}}><span style={goldText}>سطر واحد</span></span>
          <span>؟</span>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'flex-end', gap: 26, marginTop: 56, ...ltr}}>
        <Piece icon="chat-text" en="Prompt" /><Bar /><Piece icon="brain" en="LLM" /><Bar /><Piece icon="list-checks" en="Parser" />
      </div>
    </div>

    {/* الصورة بقوس ذهبي، تحت بالنص */}
    <div style={{position: 'absolute', top: 1220, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Arch w={300} h={390} glow={0.8} />
    </div>

    <div style={{position: 'absolute', bottom: 236, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 26, letterSpacing: 6, color: INK, ...ltr}}>
      30 DAYS OF LLM APPS<b style={{color: GOLD, margin: '0 12px'}}>•</b>MOHAMMED ABU SAADA
    </div>
  </AbsoluteFill>
);
