import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon} from './brand';

// بطاقة حساب إنستغرام بتطلع وقت التعريف، ومؤشر بيضغط «متابعة» فبتصير «تتم المتابعة».
// at = الإطار اللي بتطلع فيه البطاقة (نسبةً لبداية الـ Sequence).
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const FollowCard: React.FC<{at?: number; hold?: number; top?: number}> = ({at = 0, hold = 120, top = 300}) => {
  const f = useCurrentFrame() - at; const {fps} = useVideoConfig();
  if (f < 0 || f > hold + 20) return null;
  const inn = spring({frame: f, fps, config: {damping: 14, stiffness: 160}});
  const out = interpolate(f, [hold, hold + 14], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const click = 46;                                  // لحظة الضغطة
  const cur = interpolate(f, [14, click - 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const press = f >= click && f < click + 6;
  const done = f >= click + 2;
  const pulse = spring({frame: f - click, fps, config: {damping: 8, stiffness: 220}});
  const ring = (f * 3) % 360;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 60, right: 60, top, transform: `translateY(${(1 - inn) * -80 - out * 120}px) scale(${0.9 + 0.1 * inn})`, opacity: Math.min(1, inn * 1.4) * (1 - out)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '26px 26px', borderRadius: 40, direction: 'rtl',
          background: 'linear-gradient(150deg,rgba(38,38,38,.96),rgba(10,10,10,.96))', border: `3px solid ${GOLD_LT}`,
          boxShadow: '0 30px 70px rgba(0,0,0,.55), 0 0 60px rgba(232,192,102,.25)'}}>
          {/* الصورة بحلقة ذهبية متحركة زي حلقة القصص */}
          <div style={{width: 150, height: 150, borderRadius: '50%', padding: 7, flexShrink: 0,
            background: `conic-gradient(from ${ring}deg,#FFF1C4,#E8C066,#8F6A1F,#E8C066,#FFF1C4)`}}>
            <div style={{width: '100%', height: '100%', borderRadius: '50%', padding: 5, background: '#111', overflow: 'hidden'}}>
              <Img src={staticFile('profile.png')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', transform: 'scale(1.32)', transformOrigin: '50% 42%'}} />
            </div>
          </div>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 40, color: '#fff', direction: 'ltr', textAlign: 'right', whiteSpace: 'nowrap'}}>eng_mohammed_saada</div>
            <div style={{fontFamily: 'Cairo', fontWeight: 800, fontSize: 28, color: '#d9cfb3', marginTop: 2, whiteSpace: 'nowrap'}}>محمد أبو سعادة · مهندس ومدرّب AI</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontFamily: 'Cairo', fontWeight: 800, fontSize: 24, color: GOLD_LT, whiteSpace: 'nowrap'}}>
              <Icon name="sparkle" size={24} />سلسلة 30 يوم · تطبيقات AI</div>
          </div>
          {/* الزر */}
          <div style={{flexShrink: 0, position: 'relative', transform: `scale(${press ? 0.9 : done ? 1 + 0.08 * Math.max(0, 1 - pulse) : 1})`}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 236, fontFamily: 'Cairo', fontWeight: 800, fontSize: 32, padding: '14px 0', borderRadius: 22,
              ...(done ? {background: '#2a2a2a', color: '#fff', border: '3px solid #555'} : {background: 'linear-gradient(150deg,#FFF1C4,#E8C066 45%,#C9A24B)', color: INK, border: `3px solid ${GOLD_LT}`, boxShadow: '0 0 30px rgba(232,192,102,.5)'})}}>
              {done ? <><Icon name="check" size={34} color="#fff" weight="bold" />تتم المتابعة</> : <><Icon name="user-plus" size={34} color={INK} />متابعة</>}
            </div>
            {/* موجة الضغطة */}
            {f >= click && f < click + 18 ? <div style={{position: 'absolute', left: '50%', top: '50%', width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: '50%',
              border: `5px solid ${GOLD_LT}`, transform: `scale(${1 + (f - click) / 5})`, opacity: 1 - (f - click) / 18}} /> : null}
            {/* المؤشر */}
            <div style={{position: 'absolute', left: 40 + (1 - cur) * -260, top: 46 + (1 - cur) * 260, transform: `scale(${press ? 0.85 : 1})`, opacity: cur > 0 && f < click + 30 ? 1 : 0}}>
              <Icon name="hand-pointing" size={92} color="#fff" />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// معاينة: البطاقة جوّا إطار فيديو (خلفية البراند + كابشن)
export const FollowCardDemo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%,#232323 0,#111 55%,#050505 100%)', fontFamily: 'Cairo'}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 200}}>
        <div style={{width: 520, height: 520, borderRadius: 60, background: 'linear-gradient(150deg,#FFF1C4,#E8C066 40%,#C9A24B 70%,#8F6A1F)', opacity: 0.18}} />
      </AbsoluteFill>
      <FollowCard at={10} hold={110} />
      <div style={{position: 'absolute', top: 1300, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 96, direction: 'rtl',
        color: f > 40 && f < 80 ? GOLD_LT : '#fff', textShadow: '0 6px 20px rgba(0,0,0,.6)'}}>
        {['أنا', 'محمد', 'أبو سعادة', 'مهندس', 'ومدرّب', 'AI'][Math.min(5, Math.floor(f / 22))]}
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 9, width: `${(f / 150) * 100}%`, background: GOLD}} />
    </AbsoluteFill>
  );
};
