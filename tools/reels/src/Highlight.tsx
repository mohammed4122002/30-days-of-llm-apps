import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {HL_ICONS} from './hlIcons';

// أغلفة هايلايت إنستغرام بهوية السلسلة: حلقة ذهبية وأيقونة بتدرّج ذهبي.
// dark = خلفية سوداء (زي الأغلفة الحالية)، light = خلفية سماء، عشان تقدر تبادل بينهم.
// المحتوى بالدايرة اللي بالنص (إنستغرام بيقص دايرة من وسط الصورة).

export type HL = {id: string; label: string; icon?: string; text?: string};
export const HIGHLIGHTS: HL[] = [
  {id: 'about', label: 'عني', icon: 'user'},
  {id: '30days', label: '30 يوم', text: '30'},
  {id: 'projects', label: 'مشاريع', icon: 'briefcase'},
  {id: 'agents', label: 'وكلاء AI', icon: 'robot'},
  {id: 'reviews', label: 'آراء', icon: 'quotes'},
  {id: 'work', label: 'اشتغل معي', icon: 'handshake'},
  {id: 'tips', label: 'نصائح', icon: 'lightbulb'},
  {id: 'sahihly', label: 'صحيحلي', icon: 'seal-check'},
];

const GOLD = 'linear-gradient(150deg,#FFF1C4 0%,#E8C066 35%,#C9A24B 65%,#8F6A1F 100%)';

const DEEP = 'linear-gradient(150deg,#C9A24B 0%,#A9812E 45%,#7A5716 100%)';   // ذهبي غامق للنسخة اللايت

const GoldIcon: React.FC<{name: string; size: number; deep?: boolean}> = ({name, size, deep}) => {
  const id = 'g' + useId().replace(/[^a-zA-Z0-9]/g, '');
  let s = HL_ICONS[`${name}:fill`] ?? '';
  s = s.replace('fill="currentColor"', `fill="url(#${id})" width="${size}" height="${size}"`)
    .replace(/(<svg[^>]*>)/, `$1<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${deep ? '<stop offset="0" stop-color="#D4AE55"/><stop offset=".5" stop-color="#A9812E"/><stop offset="1" stop-color="#6E4E12"/>' : '<stop offset="0" stop-color="#FFF1C4"/><stop offset=".4" stop-color="#E8C066"/><stop offset=".75" stop-color="#C9A24B"/><stop offset="1" stop-color="#8F6A1F"/>'}</linearGradient></defs>`);
  return <span style={{display: 'inline-flex', filter: deep ? 'drop-shadow(0 4px 8px rgba(110,78,18,.25))' : 'drop-shadow(0 6px 14px rgba(0,0,0,.35))'}} dangerouslySetInnerHTML={{__html: s}} />;
};

export const Highlight: React.FC<{id: string; light?: boolean}> = ({id, light}) => {
  const h = HIGHLIGHTS.find((x) => x.id === id)!;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: 'Cairo',
      background: light ? 'linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)'
        : 'radial-gradient(circle at 50% 50%,#262626 0,#111 55%,#050505 100%)'}}>
      {/* أشعة خفيفة ورا الدايرة */}
      <div style={{position: 'absolute', width: 1600, height: 1600, borderRadius: '50%',
        background: `repeating-conic-gradient(from 0deg,${light ? 'rgba(255,255,255,.55)' : 'rgba(232,192,102,.13)'} 0deg 6deg,transparent 6deg 18deg)`,
        WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.5) 28%,transparent 55%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.5) 28%,transparent 55%)'}} />
      {/* الحلقة الذهبية */}
      <div style={{position: 'relative', zIndex: 1, width: 900, height: 900, borderRadius: '50%', padding: 34, background: GOLD,
        boxShadow: light ? '0 0 0 22px rgba(255,255,255,.75), 0 20px 60px rgba(143,106,31,.35)' : '0 0 0 22px rgba(201,162,75,.18), 0 0 90px rgba(232,192,102,.35)'}}>
        <div style={{width: '100%', height: '100%', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: light ? 'radial-gradient(circle at 32% 22%,#ffffff 0,#fbf3e2 55%,#f1e2bd 100%)' : 'radial-gradient(circle at 32% 22%,#4a4a4a 0,#1a1a1a 55%,#050505 100%)',
          boxShadow: light ? 'inset 0 6px 0 rgba(255,255,255,.9), inset 0 -12px 30px rgba(169,129,46,.25)' : 'inset 0 6px 0 rgba(255,255,255,.18), inset 0 -10px 30px rgba(0,0,0,.6)'}}>
          {h.text ? (
            <span style={{fontWeight: 800, fontSize: 420, lineHeight: 1, background: light ? DEEP : GOLD, WebkitBackgroundClip: 'text', color: 'transparent', direction: 'ltr',
              filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.35))', marginTop: -20}}>{h.text}</span>
          ) : <GoldIcon name={h.icon!} size={470} deep={light} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};
