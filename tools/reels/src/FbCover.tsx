import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {GOLD_LT, INK, Logo, glossy, goldText} from './brand';

// غلاف فيسبوك 1640×624 بهوية البراند (أسود وذهبي).
// المحتوى المهم بالنص (فيسبوك بيقص الأطراف عالموبايل)، والزاوية تحت يمين فاضية لصورة البروفايل.
export const FB_W = 1640;
export const FB_H = 624;

const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};
const LOGOS = ['n8n', 'langchain', 'python', 'huggingface', 'langgraph', 'fastapi'];

const Tile: React.FC<{name: string}> = ({name}) => (
  <div style={{...glossy, width: 92, height: 92, borderRadius: 26, boxShadow: '0 0 0 4px #D9B25E,0 0 0 10px rgba(201,162,75,.18),0 18px 30px rgba(0,0,0,.5),inset 0 3px 0 rgba(255,255,255,.18)'}}>
    <Logo name={name} size={52} />
  </div>
);

export const FbCover: React.FC = () => (
  <AbsoluteFill style={{fontFamily: 'Cairo', overflow: 'hidden',
    background: 'radial-gradient(ellipse 900px 520px at 50% 30%,rgba(201,162,75,.30) 0,rgba(201,162,75,0) 70%),radial-gradient(circle at 50% 50%,#1f1f1f 0,#0c0c0c 60%,#000 100%)'}}>
    {/* أشعة ذهبية */}
    <div style={{position: 'absolute', left: '50%', top: '30%', width: 2600, height: 2600, borderRadius: '50%', transform: 'translate(-50%,-50%) rotate(4deg)',
      background: 'repeating-conic-gradient(from 0deg,rgba(232,192,102,.11) 0deg 5deg,transparent 5deg 15deg)',
      WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 22%,transparent 50%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 22%,transparent 50%)'}} />
    {/* جزيئات */}
    {Array.from({length: 60}).map((_, i) => {
      const r = 2 + random('r' + i) * 4;
      return <div key={i} style={{position: 'absolute', left: random('x' + i) * FB_W, top: random('y' + i) * FB_H, width: r, height: r, borderRadius: '50%',
        background: GOLD_LT, opacity: 0.25 + random('o' + i) * 0.5, boxShadow: `0 0 ${r * 3}px ${GOLD_LT}`}} />;
    })}
    {/* خطوط شبكة/دارة خفيفة على الأطراف */}
    <svg width={FB_W} height={FB_H} style={{position: 'absolute', inset: 0, opacity: 0.22}}>
      {[[60, 120, 260], [80, 300, 200], [40, 470, 300], [1340, 110, 250], [1380, 320, 200], [1300, 500, 300]].map(([x, y, w], i) => (
        <g key={i} stroke="#C9A24B" strokeWidth={2} fill="none">
          <path d={`M${x} ${y} h${w * 0.5} l30 30 h${w * 0.5}`} /><circle cx={x} cy={y} r={5} fill="#C9A24B" /><circle cx={x + w + 30} cy={y + 30} r={5} fill="#C9A24B" />
        </g>))}
    </svg>

    {/* المحتوى */}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 44}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: INK, padding: '6px 26px', borderRadius: 99,
        background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', ...ltr}}>AI AGENT ENGINEER</div>
      <div style={{fontWeight: 800, fontSize: 78, lineHeight: 1.25, color: '#fff', direction: 'rtl', textAlign: 'center', marginTop: 20}}>
        أبني <span style={goldText}>موظفين ذكاء اصطناعي</span><br />يشتغلوا بدلك
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 30, ...ltr}}>
        {LOGOS.map((l) => <Tile key={l} name={l} />)}
      </div>
      <div style={{marginTop: 22, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: '#e9e2cf', ...ltr}}>
        n8n <b style={{color: GOLD_LT, margin: '0 10px'}}>•</b> RAG <b style={{color: GOLD_LT, margin: '0 10px'}}>•</b> MCP <b style={{color: GOLD_LT, margin: '0 10px'}}>•</b> LLM APPS
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
