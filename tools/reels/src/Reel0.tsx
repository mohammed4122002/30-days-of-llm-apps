import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {pushCut} from '@remotion/transitions/push-cut';
import {iris} from '@remotion/transitions/iris';
import {wipe} from '@remotion/transitions/wipe';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {fade} from '@remotion/transitions/fade';
import {Arch, Chrome, Dark, GOLD, GOLD_LT, H, INK, Icon, Label, LightSweep, Logo, Marker, Particles, Pop, Rays, Rise, Safe, SlideIn, Sky, W, Words, glossy, goldText, useSpring} from './brand';

// ── المشهد 1: الافتتاحية ──
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const big = useSpring(0, {damping: 20, stiffness: 60});
  const arch = useSpring(6, {damping: 12, stiffness: 110});
  const float = Math.sin(f / 22) * 12;
  return (
    <AbsoluteFill>
      <Sky /><Rays y="34%" /><Particles n={26} light />
      <div style={{position: 'absolute', left: -60, top: 210, fontFamily: 'Cairo', fontWeight: 800, fontSize: 820, lineHeight: 0.8, color: 'transparent',
        WebkitTextStroke: '4px rgba(201,162,75,.32)', direction: 'ltr', opacity: big, transform: `scale(${1.35 - 0.35 * big})`, transformOrigin: 'left top'}}>30</div>
      <Safe>
        <div style={{display: 'flex', justifyContent: 'center', transform: `translateY(${float}px) scale(${0.5 + 0.5 * arch})`, opacity: Math.min(1, arch * 1.6)}}>
          <div style={{position: 'relative'}}>
            <Arch w={500} h={660} glow={0.8 + Math.sin(f / 15) * 0.2} />
            {[[-60, 80, 46], [520, 200, 36], [-30, 520, 30], [500, 600, 40]].map(([x, y, s], i) => (
              <div key={i} style={{position: 'absolute', left: x, top: y, transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(f / 12 + i))}) rotate(${f * 2}deg)`}}>
                <Icon name="sparkle" size={s} />
              </div>))}
          </div>
        </div>
        <div style={{marginTop: 70}}><Words text="30 يوم انتهت." start={22} size={124} /></div>
        <div style={{textAlign: 'center', fontSize: 124, fontWeight: 800, lineHeight: 1.3, direction: 'rtl'}}>
          <Rise delay={40}><Marker start={56}>والجاية أكبر.</Marker></Rise>
        </div>
      </Safe>
      <LightSweep delay={2} />
    </AbsoluteFill>
  );
};

// ── المشهد 2: 30 Days of n8n ──
const N8n: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [24, 72], [0, 30], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const check = useSpring(74, {damping: 9, stiffness: 170});
  const cards = [['01', 'ملخص Gmail يوصلك على Telegram كل صباح'], ['13', 'وكيل RAG بيجاوب من ملفات الشركة مع المصدر'], ['30', 'نظام بيرجّع طالب منقطع عن المدرسة لمساره']];
  return (
    <AbsoluteFill>
      <Dark />
      <Safe>
        <Label icon="flag" text="المحطة الأولى" dark />
        <div style={{display: 'flex', alignItems: 'center', gap: 30, direction: 'ltr', justifyContent: 'flex-end'}}>
          <Pop delay={8}><div style={{...glossy, width: 130, height: 130, borderRadius: 36}}><Logo name="n8n" size={80} /></div></Pop>
          <div>
            <Rise delay={12}><div style={{fontWeight: 800, fontSize: 70, color: '#fff', textAlign: 'right'}}>30 Days of n8n</div></Rise>
            <div style={{display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'flex-end'}}>
              <div style={{width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${check}) rotate(${(1 - check) * -90}deg)`}}><Icon name="check" weight="bold" size={52} color={INK} /></div>
              <div style={{fontWeight: 800, fontSize: 120, lineHeight: 1, ...goldText}}>{n}<span style={{fontSize: 56, color: '#e9e2cf', WebkitTextFillColor: '#e9e2cf'}}> / 30</span></div>
            </div>
          </div>
        </div>
        <div style={{height: 20, borderRadius: 99, background: '#3a3a3a', marginTop: 34, overflow: 'hidden', direction: 'ltr'}}>
          <div style={{height: '100%', width: `${(n / 30) * 100}%`, background: `linear-gradient(90deg,${GOLD},${GOLD_LT},#FFF1C4)`, boxShadow: '0 0 20px rgba(232,192,102,.8)'}} />
        </div>
        <div style={{fontSize: 34, color: '#e9e2cf', marginTop: 12, direction: 'rtl'}}>30 workflow حقيقية، منها:</div>
        {cards.map(([k, t], i) => (
          <SlideIn key={k} delay={84 + i * 9} from={-220}>
            <div style={{display: 'flex', alignItems: 'center', gap: 28, padding: '30px 34px', borderRadius: 30, fontWeight: 800, fontSize: 44, lineHeight: 1.35, marginTop: 24, direction: 'rtl',
              background: 'linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%)', color: INK, boxShadow: '0 20px 44px rgba(0,0,0,.45)'}}>
              <div style={{flex: 'none', fontSize: 92, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `3px ${INK}`, direction: 'ltr', width: 140, textAlign: 'center'}}>{k}</div>
              <div>{t}</div>
            </div>
          </SlideIn>))}
      </Safe>
      <LightSweep delay={74} />
    </AbsoluteFill>
  );
};

// ── المشهد 3: الدروس ──
const Lessons: React.FC = () => {
  const L: [string, boolean][] = [['الأتمتة مش أدوات. الأتمتة إنك تشوف المشكلة قبل غيرك.', false], ['الاستمرار أهم من الكمال.', true], ['المحتوى التقني العربي ناقص، ونحنا قادرين نعبّيه.', false]];
  return (
    <AbsoluteFill>
      <Sky />
      <Safe>
        <Label icon="lightbulb" text="3 دروس طلعت فيها" delay={4} />
        {L.map(([t, g], i) => {
          return (
            <Rise key={i} delay={16 + i * 16} dist={120}>
              <div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '38px 38px', borderRadius: 32, fontWeight: 800, fontSize: 50, lineHeight: 1.4, marginTop: 30, direction: 'rtl',
                boxShadow: '0 22px 46px rgba(30,22,5,.3)',
                ...(g ? {background: 'linear-gradient(150deg,#F6DE9C 0%,#E8C066 45%,#D4AE57 100%)', color: INK} : {background: 'linear-gradient(150deg,#363636 0%,#1c1c1c 60%,#111 100%)', color: '#fff'})}}>
                <div style={{flex: 'none', fontSize: 124, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: `3px ${g ? INK : GOLD}`, direction: 'ltr', width: 170, textAlign: 'center'}}>0{i + 1}</div>
                <div>{t}</div>
              </div>
            </Rise>);
        })}
      </Safe>
    </AbsoluteFill>
  );
};

// ── المشهد 4: السؤال ──
const Question: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.abs(Math.sin(f / 10));
  return (
    <AbsoluteFill>
      <Dark />
      <div style={{position: 'absolute', left: '50%', top: '46%', opacity: 0.16, transform: `translate(-50%,-50%) rotate(${f * 0.4}deg) scale(${1 + Math.sin(f / 20) * 0.04})`}}>
        <Icon name="brain" size={1350} weight="thin" />
      </div>
      <Safe>
        <Label icon="question" text="السؤال اللي ضل يلاحقني" dark delay={2} />
        <Words text="شو اللي بيصير" start={12} size={124} color="#fff" align="right" />
        <div style={{filter: `drop-shadow(0 0 ${30 * glow}px rgba(232,192,102,.7))`}}>
          <Words text="جوّا عقدة الـ AI؟" start={30} size={124} gold={['جوّا', 'عقدة', 'الـ', 'AI؟']} align="right" />
        </div>
        <Rise delay={58}><div style={{fontSize: 46, lineHeight: 1.6, color: '#e9e2cf', marginTop: 44, direction: 'rtl'}}>n8n علّمتني أربط الأدوات.<br />هلّق بدي أبني العقل نفسه.</div></Rise>
      </Safe>
    </AbsoluteFill>
  );
};

// ── المشهد 5: التحدي الجديد، ومسار يُرسم أمامك ──
const Challenge: React.FC = () => {
  const f = useCurrentFrame();
  const steps: [React.ReactNode, string, string][] = [
    [<Logo name="huggingface" size={56} />, 'Hugging Face', 'نماذج مفتوحة'],
    [<Logo name="langchain" size={54} />, 'LangChain', 'RAG وسلاسل'],
    [<Icon name="pulse" size={58} weight="duotone" />, 'LangSmith', 'تقييم بالأرقام'],
    [<Logo name="langgraph" size={54} />, 'LangGraph', 'وكلاء بيستأذنوا'],
    [<Icon name="rocket-launch" size={58} weight="duotone" />, 'النهاية', 'منتج منشور'],
  ];
  const top = 0, rowH = 186, len = rowH * (steps.length - 1);
  const draw = interpolate(f, [26, 26 + 26 * steps.length], [len, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Sky />
      <Safe justify="flex-start">
        <div style={{marginTop: 40}}><Label icon="rocket-launch" text="التحدي الجديد" delay={2} /></div>
        <Rise delay={10}><div style={{fontWeight: 800, fontSize: 84, direction: 'ltr', textAlign: 'right', marginBottom: 40}}>30 Days of <span style={goldText}>LLM Apps</span></div></Rise>
        <div style={{position: 'relative', height: rowH * steps.length}}>
          <svg width={W - 140} height={rowH * steps.length} style={{position: 'absolute', inset: 0}}>
            <line x1={(W - 140) / 2} y1={top + rowH / 2} x2={(W - 140) / 2} y2={top + rowH / 2 + len} stroke={GOLD} strokeWidth={6} strokeLinecap="round"
              strokeDasharray={`${len}`} strokeDashoffset={draw} />
          </svg>
          {steps.map(([ix, k, v], i) => {
            const left = i % 2 === 1;
            return (
              <div key={i} style={{position: 'absolute', top: i * rowH, height: rowH, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: left ? 'flex-start' : 'flex-end'}}>
                <Pop delay={30 + i * 26} style={{position: 'absolute', left: '50%', marginLeft: -20, width: 40, height: 40, borderRadius: '50%', background: GOLD, boxShadow: '0 0 0 9px rgba(201,162,75,.25),0 0 24px rgba(232,192,102,.8)'}}><span /></Pop>
                <SlideIn delay={34 + i * 26} from={left ? -120 : 120} style={{width: '46%'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '24px 26px', borderRadius: 30, fontWeight: 800, fontSize: 38, lineHeight: 1.25, direction: 'rtl',
                    background: 'rgba(255,255,255,.9)', border: '2px solid rgba(201,162,75,.5)', boxShadow: '0 18px 36px rgba(40,30,10,.2)'}}>
                    <div style={{...glossy, flex: 'none', width: 100, height: 100, borderRadius: 28, boxShadow: '0 0 0 3px #D9B25E,0 10px 20px rgba(0,0,0,.3)'}}>{ix}</div>
                    <div><div style={{fontSize: 26, color: GOLD}}>{k}</div>{v}</div>
                  </div>
                </SlideIn>
              </div>);
          })}
        </div>
      </Safe>
    </AbsoluteFill>
  );
};

// ── المشهد 6: الموعد ──
const DateScene: React.FC = () => {
  const flip = useSpring(4, {damping: 12, stiffness: 120});
  const day = useSpring(16, {damping: 14, stiffness: 120});
  return (
    <AbsoluteFill>
      <Sky /><Rays y="32%" />
      <Safe>
        <div style={{display: 'flex', justifyContent: 'center', perspective: 900}}>
          <div style={{...glossy, width: 250, height: 250, borderRadius: 66, transform: `rotateY(${(1 - flip) * 100}deg) scale(${0.6 + 0.4 * flip})`}}>
            <Icon name="calendar-check" size={150} weight="duotone" />
          </div>
        </div>
        <div style={{textAlign: 'center', direction: 'rtl', fontWeight: 800, fontSize: 180, lineHeight: 1.2, marginTop: 60, opacity: Math.min(1, day * 1.5),
          transform: `scale(${1.5 - 0.5 * day})`, filter: `blur(${(1 - Math.min(1, day)) * 14}px)`}}>الثلاثاء</div>
        <Rise delay={30}><div style={{textAlign: 'center', fontWeight: 800, fontSize: 160, lineHeight: 1.2, direction: 'rtl', ...goldText}}>9 الصبح</div></Rise>
      </Safe>
      <LightSweep delay={14} />
    </AbsoluteFill>
  );
};

// ── المشهد 7: الدعوة ──
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const beat = 1 + 0.08 * Math.max(0, Math.sin((f - 50) / 6));
  const rings = [0, 1, 2].map((k) => ((f + k * 20) % 60) / 60);
  return (
    <AbsoluteFill>
      <Dark />
      <Safe>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'relative'}}>
            {rings.map((p, k) => <div key={k} style={{position: 'absolute', left: '50%', top: '50%', width: 420, height: 420, borderRadius: '50%', border: `4px solid ${GOLD_LT}`,
              transform: `translate(-50%,-50%) scale(${1 + p * 0.7})`, opacity: (1 - p) * 0.5}} />)}
            <Pop delay={4}><Arch w={400} h={530} /></Pop>
          </div>
        </div>
        <div style={{marginTop: 70}}><Words text="ناوي تمشي معي؟" start={20} size={88} color="#fff" /></div>
        <Rise delay={38}>
          <div style={{textAlign: 'center', fontWeight: 800, fontSize: 88, color: '#fff', direction: 'rtl', lineHeight: 1.3}}>
            اكتب <span style={{display: 'inline-block', transform: `scale(${beat})`, ...goldText}}>معك</span> بالتعليقات
          </div>
        </Rise>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap', direction: 'rtl'}}>
          {[['heart', 'أعجبني'], ['repeat', 'شارك'], ['bookmark-simple', 'احفظ'], ['user-plus', 'تابعني']].map(([i, t], k) => (
            <Pop key={i} delay={56 + k * 6}>
              <span style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 36, padding: '14px 30px', borderRadius: 99,
                background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK}}><Icon name={i} size={36} color={INK} />{t}</span>
            </Pop>))}
        </div>
      </Safe>
    </AbsoluteFill>
  );
};

// ── التركيب ──
const TR = 18;
export const SCENES = [150, 165, 150, 135, 180, 105, 165];
export const REEL0_FRAMES = SCENES.reduce((a, b) => a + b, 0) - TR * (SCENES.length - 1);

export const Reel0: React.FC = () => (
  <AbsoluteFill style={{background: '#000', fontFamily: 'Cairo'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES[0]}><Hook /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={springTiming({config: {damping: 200}, durationInFrames: TR})} />
      <TransitionSeries.Sequence durationInFrames={SCENES[1]}><N8n /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({direction: 'from-right'})} timing={linearTiming({durationInFrames: TR})} />
      <TransitionSeries.Sequence durationInFrames={SCENES[2]}><Lessons /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={iris({width: W, height: H})} timing={linearTiming({durationInFrames: TR})} />
      <TransitionSeries.Sequence durationInFrames={SCENES[3]}><Question /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={pushCut()} timing={springTiming({config: {damping: 200}, durationInFrames: TR})} />
      <TransitionSeries.Sequence durationInFrames={SCENES[4]}><Challenge /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({width: W, height: H})} timing={linearTiming({durationInFrames: TR})} />
      <TransitionSeries.Sequence durationInFrames={SCENES[5]}><DateScene /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: TR})} />
      <TransitionSeries.Sequence durationInFrames={SCENES[6]}><Cta /></TransitionSeries.Sequence>
    </TransitionSeries>
    <Chrome total={REEL0_FRAMES} />
    {/* موسيقى أصلية مولّدة بـ scripts/gen-music.py ومتزامنة مع المشاهد */}
    <Audio src={staticFile('audio/reel0.wav')} />
  </AbsoluteFill>
);
