import React from 'react';
import {AbsoluteFill, HtmlInCanvas, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {zoomBlur} from '@remotion/effects/zoom-blur';
import {chromaticAberration} from '@remotion/effects/chromatic-aberration';
import {useWindowedAudioData, visualizeAudio} from '@remotion/media-utils';
import {FPS, Plan} from './voiceKit';

// طبقة «برو» لريلز الصوت (بتنفعّل بـ "pro": true بملف الخطة):
//  1) دخول كل مشهد: zoomBlur + انزياح ألوان (chromaticAberration) بيخفّوا خلال 9 إطارات
//  2) ضربات الكاميرا على اللحظات القوية (plan.hits): زووم سريع + انزياح ألوان
//  3) وهج ذهبي بينبض مع البيس تبع الموسيقى
//  4) حبيبات فيلم خفيفة فوق كل شي
// المؤثرات بتشتغل بس بلحظاتها (مش بكل إطار) عشان الرندر يضل سريع.
// الرندر: --gl=swangle مع متصفح Remotion (chrome-headless-shell) لأن HtmlInCanvas بيحتاجه.

const ENTRY = 9; // إطارات
const HIT = 7;

const fxAt = (plan: Plan & {hits?: number[]}, frame: number) => {
  const t = frame / FPS - plan.off;
  let entry = 0;
  plan.scenes.forEach(([k, a], i) => {
    if (i === 0 || k === 'outro') return;
    const d = (t - a) * FPS;
    if (d >= 0 && d < ENTRY) entry = Math.max(entry, 1 - d / ENTRY);
  });
  let hit = 0;
  for (const s of plan.hits ?? []) {
    const d = (t - s) * FPS;
    if (d >= 0 && d < HIT) hit = Math.max(hit, 1 - d / HIT);
  }
  return {entry: entry * entry, hit: hit * hit};
};

export const ProFx: React.FC<{plan: Plan & {hits?: number[]}; children: React.ReactNode}> = ({plan, children}) => {
  const f = useCurrentFrame(); const {width, height} = useVideoConfig();
  const {entry, hit} = fxAt(plan, f);
  const scale = 1 + 0.07 * entry + 0.045 * hit;
  const inner = <AbsoluteFill style={{transform: `scale(${scale})`}}>{children}</AbsoluteFill>;
  if (entry < 0.02 && hit < 0.02) return inner;
  return (
    <HtmlInCanvas width={width} height={height}
      effects={[zoomBlur({amount: Math.min(0.6, 0.45 * entry + 0.2 * hit)}), chromaticAberration({amount: 26 * entry + 16 * hit})]}>
      {inner}
    </HtmlInCanvas>
  );
};

// وهج ذهبي بينبض مع البيس (من ملف المزج النهائي)
export const BassGlow: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const {audioData, dataOffsetInSeconds} = useWindowedAudioData({src: staticFile(src), frame, fps, windowInSeconds: 20});
  if (!audioData) return null;
  const v = visualizeAudio({fps, frame, audioData, numberOfSamples: 32, optimizeFor: 'speed', dataOffsetInSeconds});
  const bass = Math.min(1, ((v[0] + v[1] + v[2]) / 3) * 2.2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.1 + bass * 0.45,
      background: 'radial-gradient(ellipse 760px 900px at 50% 42%,rgba(255,206,110,.55) 0,rgba(255,206,110,0) 70%)'}} />
  );
};

// حبيبات فيلم (4 صور بتتبدّل كل إطارين)
export const Grain: React.FC = () => {
  const f = useCurrentFrame(); const i = Math.floor(f / 2) % 4;
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.16}}>
    <Img src={staticFile(`fx/grain-${i}.png`)} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
  </AbsoluteFill>;
};
