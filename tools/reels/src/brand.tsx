import React, {useId} from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {ICONS, LOGOS} from './assets';

// ── الهوية ─────────────────────────────────────────────
export const GOLD = '#C9A24B';
export const GOLD_LT = '#E8C066';
export const INK = '#111111';
export const W = 1080;
export const H = 1920;

const AR = 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F';
const LA = 'U+0000-05FF,U+2000-206F,U+2190-2BFF';
loadFont({family: 'Cairo', url: staticFile('fonts/cairo-arabic-400-normal.woff2'), weight: '400', unicodeRange: AR});
loadFont({family: 'Cairo', url: staticFile('fonts/cairo-arabic-800-normal.woff2'), weight: '800', unicodeRange: AR});
loadFont({family: 'Cairo', url: staticFile('fonts/cairo-latin-400-normal.woff2'), weight: '400', unicodeRange: LA});
loadFont({family: 'Cairo', url: staticFile('fonts/cairo-latin-800-normal.woff2'), weight: '800', unicodeRange: LA});
loadFont({family: 'Playfair', url: staticFile('fonts/playfair-700.woff2'), weight: '700'});

export const goldText: React.CSSProperties = {
  background: 'linear-gradient(150deg,#FFF1C4 0%,#E8C066 35%,#C9A24B 65%,#8F6A1F 100%)',
  WebkitBackgroundClip: 'text', color: 'transparent',
};
export const glossy: React.CSSProperties = {
  background: 'radial-gradient(circle at 30% 18%,#4d4d4d 0,#1a1a1a 55%,#050505 100%)',
  boxShadow: '0 0 0 5px #D9B25E,0 0 0 13px rgba(201,162,75,.22),0 0 70px 14px rgba(255,200,90,.42),0 30px 60px rgba(30,20,5,.5),inset 0 3px 0 rgba(255,255,255,.2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const goldDefs = (id: string) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1C4"/><stop offset=".4" stop-color="#E8C066"/><stop offset=".75" stop-color="#C9A24B"/><stop offset="1" stop-color="#8F6A1F"/></linearGradient></defs>`;

// أيقونة Phosphor: color='gold' تعطي تدرّجًا معدنيًا
export const Icon: React.FC<{name: string; size?: number; color?: string; weight?: 'fill' | 'duotone' | 'thin' | 'bold'; style?: React.CSSProperties}> =
  ({name, size = 48, color = 'gold', weight = 'fill', style}) => {
    const id = 'i' + useId().replace(/[^a-zA-Z0-9]/g, '');
    let s = ICONS[`${name}:${weight}`] ?? '';
    const fill = color === 'gold' ? `url(#${id})` : color;
    s = s.replace('fill="currentColor"', `fill="${fill}" width="${size}" height="${size}"`).replace(/opacity="0.2"/g, 'opacity="0.38"');
    if (color === 'gold') s = s.replace(/(<svg[^>]*>)/, `$1${goldDefs(id)}`);
    return <span style={{display: 'inline-flex', ...style}} dangerouslySetInnerHTML={{__html: s}} />;
  };
export const Logo: React.FC<{name: string; size?: number; color?: string}> = ({name, size = 44, color = 'gold'}) => {
  const id = 'l' + useId().replace(/[^a-zA-Z0-9]/g, '');
  let s = LOGOS[name] ?? '';
  const fill = color === 'gold' ? `url(#${id})` : color;
  s = s.replace('<svg ', `<svg width="${size}" height="${size}" fill="${fill}" `);
  if (color === 'gold') s = s.replace(/(<svg[^>]*>)/, `$1${goldDefs(id)}`);
  return <span style={{display: 'inline-flex'}} dangerouslySetInnerHTML={{__html: s}} />;
};

// ── الخلفيات ───────────────────────────────────────────
export const Sky: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#bcd9f2 0%,#dcebf6 45%,#fbf1dc 100%)'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 700px 260px at ${15 + Math.sin(f / 60) * 4}% 10%,#fff 0,rgba(255,255,255,0) 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 800px 300px at ${85 - Math.sin(f / 70) * 5}% 28%,rgba(255,255,255,.9) 0,rgba(255,255,255,0) 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 1000px 560px at 90% 100%,rgba(255,214,140,${0.75 + Math.sin(f / 25) * 0.08}) 0,rgba(255,214,140,0) 70%)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 700px 400px at 0% 100%,rgba(170,200,130,.45) 0,rgba(170,200,130,0) 70%)'}} />
    </AbsoluteFill>
  );
};
export const Dark: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 900px 600px at 85% 8%,rgba(201,162,75,.3) 0,rgba(201,162,75,0) 70%),radial-gradient(ellipse 800px 500px at 10% 100%,rgba(201,162,75,.18) 0,rgba(201,162,75,0) 70%),radial-gradient(circle at 50% 40%,#232323 0,#111 55%,#050505 100%)'}}>
    <Particles n={46} />
  </AbsoluteFill>
);
export const Particles: React.FC<{n?: number; light?: boolean}> = ({n = 40, light}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: n}).map((_, i) => {
        const x = random(`px${i}`) * W, sp = 0.6 + random(`ps${i}`) * 1.8, r = 2 + random(`pr${i}`) * 5;
        const y = (((random(`py${i}`) * H - f * sp) % H) + H) % H;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 18 + i));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', background: light ? '#fff' : GOLD_LT, opacity: tw * (light ? 0.8 : 0.7), boxShadow: `0 0 ${r * 3}px ${light ? '#fff' : GOLD_LT}`}} />;
      })}
    </AbsoluteFill>
  );
};
export const Rays: React.FC<{y?: string; size?: number}> = ({y = '38%', size = 1700}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', left: '50%', top: y, width: size, height: size, borderRadius: '50%', transform: `translate(-50%,-50%) rotate(${f * 0.25}deg)`,
    background: 'repeating-conic-gradient(from 0deg,rgba(255,214,130,.36) 0deg 5deg,rgba(255,255,255,0) 5deg 15deg)',
    WebkitMaskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.5) 26%,transparent 56%)', maskImage: 'radial-gradient(circle,#000 0,rgba(0,0,0,.5) 26%,transparent 56%)'}} />;
};
// ومضة ضوء ذهبية تعبر المشهد عند بدايته
export const LightSweep: React.FC<{delay?: number}> = ({delay = 0}) => {
  const f = useCurrentFrame() - delay;
  const x = interpolate(f, [0, 22], [-60, 160], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(f, [0, 6, 18, 22], [0, 0.75, 0.75, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: o, background: `linear-gradient(105deg,transparent ${x - 18}%,rgba(255,236,180,.85) ${x}%,transparent ${x + 18}%)`, mixBlendMode: 'screen'}} />;
};

// ── حركة الدخول ─────────────────────────────────────────
export const useSpring = (delay: number, cfg = {damping: 14, stiffness: 150}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: cfg});
};
export const Rise: React.FC<{delay: number; children: React.ReactNode; dist?: number; style?: React.CSSProperties}> = ({delay, children, dist = 80, style}) => {
  const s = useSpring(delay);
  return <div style={{opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * dist}px)`, ...style}}>{children}</div>;
};
export const Pop: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay, children, style}) => {
  const s = useSpring(delay, {damping: 11, stiffness: 160});
  return <div style={{opacity: Math.min(1, s * 2), transform: `scale(${0.4 + 0.6 * s})`, ...style}}>{children}</div>;
};
export const SlideIn: React.FC<{delay: number; children: React.ReactNode; from?: number; style?: React.CSSProperties}> = ({delay, children, from = -160, style}) => {
  const s = useSpring(delay, {damping: 16, stiffness: 140});
  return <div style={{opacity: Math.min(1, s * 1.5), transform: `translateX(${(1 - s) * from}px)`, ...style}}>{children}</div>;
};

// نص يظهر كلمة كلمة، مع كلمات ذهبية اختيارية
export const Words: React.FC<{text: string; start: number; size: number; color?: string; gold?: string[]; stagger?: number; align?: 'center' | 'right'; lh?: number}> =
  ({text, start, size, color = INK, gold = [], stagger = 4, align = 'center', lh = 1.3}) => {
    const f = useCurrentFrame(); const {fps} = useVideoConfig();
    return (
      <div style={{direction: 'rtl', textAlign: align, fontSize: size, fontWeight: 800, lineHeight: lh, color}}>
        {text.split(' ').map((w, i) => {
          const s = spring({frame: f - start - i * stagger, fps, config: {damping: 13, stiffness: 150}});
          const g = gold.includes(w);
          return <span key={i} style={{display: 'inline-block', margin: `0 ${size * 0.11}px`, opacity: Math.min(1, s * 1.6),
            transform: `translateY(${(1 - s) * size * 0.55}px) scale(${0.82 + 0.18 * s})`, filter: `blur(${Math.max(0, 1 - s) * 10}px)`, ...(g ? goldText : {})}}>{w}</span>;
        })}
      </div>
    );
  };
// خط ذهبي يمتد تحت العبارة
export const Marker: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f - start, [0, 16], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <span style={{background: 'linear-gradient(180deg,transparent 58%,rgba(232,192,102,.95) 58%,rgba(232,192,102,.95) 92%,transparent 92%) no-repeat right', backgroundSize: `${p}% 100%`, padding: '0 12px'}}>{children}</span>;
};

// ── عناصر الهوية ────────────────────────────────────────
export const Arch: React.FC<{w: number; h: number; glow?: number}> = ({w, h, glow = 1}) => (
  <div style={{width: w, height: h, padding: 9, borderRadius: `${w / 2}px ${w / 2}px 48px 48px`,
    background: 'linear-gradient(160deg,#FFF1C4,#E8C066 35%,#C9A24B 65%,#8F6A1F)',
    boxShadow: `0 0 0 14px rgba(201,162,75,${0.18 * glow}),0 0 ${100 * glow}px ${24 * glow}px rgba(255,200,90,.45),0 40px 80px rgba(30,20,5,.45)`}}>
    <Img src={staticFile('portrait.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', borderRadius: `${w / 2 - 9}px ${w / 2 - 9}px 40px 40px`, background: '#000'}} />
  </div>
);
export const Label: React.FC<{icon: string; text: string; dark?: boolean; delay?: number}> = ({icon, text, dark, delay = 0}) => (
  <SlideIn delay={delay} from={160} style={{display: 'flex', justifyContent: 'flex-start', direction: 'rtl', marginBottom: 46}}>
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontWeight: 800, fontSize: 42, padding: '12px 36px 12px 24px', borderRadius: 99,
      ...(dark ? {background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK, border: '3px solid #F6DE9C'}
        : {background: 'linear-gradient(150deg,#2a2a2a,#0d0d0d)', color: '#fff', border: `3px solid ${GOLD}`})}}>
      <Icon name={icon} size={40} color={dark ? INK : 'gold'} />{text}
    </div>
  </SlideIn>
);
// رأس ثابت: صورتك واسمك، وشريط تقدم ذهبي بالأعلى
export const Chrome: React.FC<{total: number}> = ({total}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'rgba(0,0,0,.15)'}}>
        <div style={{height: '100%', width: `${(f / total) * 100}%`, background: 'linear-gradient(90deg,#8F6A1F,#E8C066,#FFF1C4)'}} />
      </div>
      <div style={{position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 18, direction: 'ltr',
        background: 'rgba(17,17,17,.82)', padding: '10px 32px 10px 10px', borderRadius: 99, border: '2px solid rgba(232,192,102,.6)', boxShadow: '0 10px 30px rgba(0,0,0,.25)'}}>
        <div style={{width: 76, height: 76, borderRadius: '50%', padding: 4, background: 'linear-gradient(145deg,#FFF1C4,#E8C066 40%,#C9A24B 70%,#8F6A1F)'}}>
          <Img src={staticFile('avatar.jpg')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff'}} />
        </div>
        <div>
          <div style={{fontFamily: 'Playfair', fontWeight: 700, fontSize: 30, color: '#fff', lineHeight: 1.1}}>Mohammed Abu Saada</div>
          <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 16, letterSpacing: 3, color: '#e9e2cf', marginTop: 4}}>AI Agent <b style={{color: GOLD}}>•</b> AI Engineer</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
// محتوى المشهد داخل المنطقة الآمنة (بعيدًا عن واجهة إنستغرام أعلى وأسفل)
export const Safe: React.FC<{children: React.ReactNode; justify?: 'center' | 'flex-start'}> = ({children, justify = 'center'}) => (
  <AbsoluteFill style={{padding: '270px 70px 430px', display: 'flex', flexDirection: 'column', justifyContent: justify, fontFamily: 'Cairo'}}>{children}</AbsoluteFill>
);
