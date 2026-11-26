import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {GOLD_LT, INK, Logo, glossy, goldText} from './brand';

// غلاف يوتيوب 2560×1440. المنطقة الآمنة (بتبين عالموبايل والكمبيوتر) 1546×423 بالنص بالضبط.
// كل المحتوى المهم جوّاها؛ الباقي زخرفة بتبين بس عالتلفزيون.
export const YT_W = 2560;
export const YT_H = 1440;
const SAFE_W = 1546;
const SAFE_H = 423;

const ltr: React.CSSProperties = {direction: 'ltr', unicodeBidi: 'isolate'};
const LOGOS = ['n8n', 'langchain', 'python', 'huggingface', 'langgraph', 'fastapi'];

const Tile: React.FC<{name: string}> = ({name}) => (
  <div style={{...glossy, width: 74, height: 74, borderRadius: 22, boxShadow: '0 0 0 3px #D9B25E,0 0 0 8px rgba(201,162,75,.18),0 14px 24px rgba(0,0,0,.5),inset 0 3px 0 rgba(255,255,255,.18)'}}>
    <Logo name={name} size={42} />
  </div>
);

export const YtBanner: React.FC<{guide?: boolean}> = ({guide}) => (
  <AbsoluteFill style={{fontFamily: 'Cairo', overflow: 'hidden',
    background: 'radial-gradient(ellipse 1400px 700px at 50% 50%,rgba(201,162,75,.28) 0,rgba(201,162,75,0) 70%),radial-gradient(circle at 50% 50%,#1f1f1f 0,#0b0b0b 55%,#000 100%)'}}>
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 4200, height: 4200, borderRadius: '50%', transform: 'translate(-50%,-50%) rotate(4deg)',
      background: 'repeating-conic-gradient(from 0deg,rgba(232,192,102,.10) 0deg 5deg,transparent 5deg 15deg)',
      WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 18%,transparent 45%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.6) 18%,transparent 45%)'}} />
    {Array.from({length: 120}).map((_, i) => {
      const r = 2 + random('r' + i) * 5;
      return <div key={i} style={{position: 'absolute', left: random('x' + i) * YT_W, top: random('y' + i) * YT_H, width: r, height: r, borderRadius: '50%',
        background: GOLD_LT, opacity: 0.2 + random('o' + i) * 0.5, boxShadow: `0 0 ${r * 3}px ${GOLD_LT}`}} />;
    })}
    <svg width={YT_W} height={YT_H} style={{position: 'absolute', inset: 0, opacity: 0.2}}>
      {[[120, 560, 380], [160, 720, 300], [90, 880, 420], [2040, 560, 380], [2100, 720, 300], [2000, 880, 420]].map(([x, y, w], i) => (
        <g key={i} stroke="#C9A24B" strokeWidth={3} fill="none">
          <path d={`M${x} ${y} h${w * 0.5} l40 40 h${w * 0.5}`} /><circle cx={x} cy={y} r={7} fill="#C9A24B" /><circle cx={x + w + 40} cy={y + 40} r={7} fill="#C9A24B" />
        </g>))}
    </svg>

    {/* المنطقة الآمنة */}
    <div style={{position: 'absolute', left: (YT_W - SAFE_W) / 2, top: (YT_H - SAFE_H) / 2, width: SAFE_W, height: SAFE_H,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...(guide ? {outline: '4px dashed red'} : {})}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, ...ltr}}>
        <span style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 40, color: '#fff'}}>Mohammed Abu Saada</span>
        <span style={{fontWeight: 800, fontSize: 22, letterSpacing: 4, color: INK, padding: '4px 20px', borderRadius: 99, background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)'}}>AI AGENT ENGINEER</span>
      </div>
      <div style={{fontWeight: 800, fontSize: 76, lineHeight: 1.2, color: '#fff', direction: 'rtl', textAlign: 'center', marginTop: 10}}>
        أبني <span style={goldText}>موظفين ذكاء اصطناعي</span> يشتغلوا بدلك
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 22, ...ltr}}>
        <div style={{display: 'flex', gap: 16}}>{LOGOS.map((l) => <Tile key={l} name={l} />)}</div>
        <div style={{fontWeight: 800, fontSize: 24, letterSpacing: 3, color: '#e9e2cf'}}>
          n8n <b style={{color: GOLD_LT, margin: '0 8px'}}>•</b> RAG <b style={{color: GOLD_LT, margin: '0 8px'}}>•</b> MCP <b style={{color: GOLD_LT, margin: '0 8px'}}>•</b> LLM APPS
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
