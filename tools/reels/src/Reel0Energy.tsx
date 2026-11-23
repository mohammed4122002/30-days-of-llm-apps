import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {GOLD, GOLD_LT, INK, Icon, Logo, glossy, goldText} from './brand';
import {BG, FPB, Flash, Header, Punch, Rays, Shake, Shock, Sign, Slam, Streaks, fitSize, sp, clamp, PH_STYLES} from './EnergyReel';
import plans from './energyPlan.json';

// الريل 0 (منشور الانتقال) بأسلوب الطاقة
type Sec = [string, number, Record<string, any>];
const P0 = (): Sec[] => ((plans as any)['0']?.sections ?? []) as Sec[];
export const energy0Frames = () => Math.max(30, ((plans as any)['0']?.beats ?? 2) * FPB + 20);

const Arch: React.FC<{w: number; h: number; enter: number}> = ({w, h, enter}) => (
  <div style={{width: w, height: h, padding: 8, borderRadius: `${w / 2}px ${w / 2}px 36px 36px`, background: 'linear-gradient(160deg,#FFF1C4,#E8C066 35%,#C9A24B 65%,#8F6A1F)',
    boxShadow: '0 0 90px 18px rgba(255,200,90,.5)', transform: `translateY(${(1 - enter) * 400}px) rotate(${(1 - enter) * -12}deg)`, opacity: Math.min(1, enter * 2)}}>
    <Img src={staticFile('portrait.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', borderRadius: `${w / 2 - 8}px ${w / 2 - 8}px 28px 28px`, background: '#000'}} />
  </div>
);
const Center: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '300px 70px 440px', fontFamily: 'Cairo'}}>{children}</AbsoluteFill>
);

const Intro0: React.FC = () => {
  const f = useCurrentFrame(); const s = sp(f - 2, 9, 260); const s2 = sp(f - 10, 10, 220);
  return (
    <AbsoluteFill><BG kind="dark" /><Rays dark /><Streaks dark />
      <Shake power={30}><Center>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: s2, transform: `scale(${s2})`}}>
          <div style={{...glossy, width: 110, height: 110, borderRadius: 30}}><Logo name="n8n" size={70} /></div>
        </div>
        <div style={{fontWeight: 800, fontSize: 480, lineHeight: 1, direction: 'ltr', transform: `scale(${3.5 - 2.5 * Math.min(1, s)})`, opacity: Math.min(1, s * 2), ...goldText,
          filter: 'drop-shadow(0 0 40px rgba(232,192,102,.6))'}}>30</div>
        <div style={{fontWeight: 800, fontSize: 110, color: '#fff', opacity: s2, transform: `translateY(${(1 - s2) * 80}px)`}}>يوم</div>
      </Center></Shake>
      <Shock /><Flash frames={6} />
    </AbsoluteFill>
  );
};
const Text0: React.FC<{text: string; i: number; hl?: string; portrait?: boolean}> = ({text, i, hl, portrait}) => {
  const st = PH_STYLES[i % 3]; const f = useCurrentFrame(); const p = sp(f - 4, 12, 160);
  return (
    <AbsoluteFill><BG kind={st.bg} />{st.bg !== 'gold' && <Rays dark={st.bg === 'dark'} />}<Streaks dark={st.bg === 'dark'} />
      <Punch><Shake power={18} frames={8}><Center>
        {portrait && <div style={{marginBottom: 50}}><Arch w={320} h={410} enter={p} /></div>}
        <Slam text={text} size={fitSize(text, 160)} color={st.color} hl={hl} hlStyle={st.hl} start={2} stagger={4} />
      </Center></Shake></Punch>
      <Flash frames={4} color={st.bg === 'dark' ? GOLD_LT : '#fff'} />
    </AbsoluteFill>
  );
};
const N8nDone: React.FC = () => {
  const f = useCurrentFrame(); const n = Math.round(interpolate(f, [4, FPB * 3], [0, 30], {...clamp, easing: Easing.out(Easing.cubic)}));
  const c = sp(f - FPB * 3, 8, 260);
  return (
    <AbsoluteFill><BG kind="gold" /><Streaks />
      <Punch amt={0.03}><Center>
        <div style={{...glossy, width: 150, height: 150, borderRadius: 42, marginBottom: 30}}><Logo name="n8n" size={92} /></div>
        <div style={{fontWeight: 800, fontSize: 320, lineHeight: 1, color: INK, direction: 'ltr'}}>{n}</div>
        <div style={{fontWeight: 800, fontSize: 84, color: INK, direction: 'ltr', marginTop: -10}}>workflow</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 34, background: INK, color: GOLD_LT, fontWeight: 800, fontSize: 64, padding: '12px 40px', borderRadius: 20,
          transform: `scale(${c}) rotate(${(1 - Math.min(1, c)) * -20}deg)`}}><Icon name="check" weight="bold" size={60} color={GOLD_LT} />خلصت</div>
      </Center></Punch>
      <Flash frames={4} color="#fff" />
    </AbsoluteFill>
  );
};
const Q0: React.FC = () => {
  const f = useCurrentFrame(); const s = sp(f, 8, 300);
  return (
    <AbsoluteFill><BG kind="dark" /><Streaks dark />
      <Shake power={40} frames={14}><Center>
        <div style={{transform: `scale(${3 - 2 * Math.min(1, s)}) rotate(-5deg)`, opacity: Math.min(1, s * 2), fontWeight: 800, fontSize: 170, direction: 'rtl', textAlign: 'center', lineHeight: 1.2, ...goldText}}>بس في سؤال…</div>
      </Center></Shake>
      <Shock color="#fff" /><Flash frames={4} />
    </AbsoluteFill>
  );
};
const Q2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill><BG kind="dark" />
      <div style={{position: 'absolute', left: '50%', top: '50%', opacity: 0.16, transform: `translate(-50%,-50%) rotate(${f * 1.2}deg)`}}><Icon name="brain" size={1300} weight="thin" /></div>
      <Punch amt={0.03}><Center>
        <Slam text="شو بيصير جوّا الـ AI؟" size={140} color="#fff" hl="الـ AI؟" hlStyle={{background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK}} start={0} stagger={4} />
      </Center></Punch>
    </AbsoluteFill>
  );
};
const Tools0: React.FC = () => {
  const f = useCurrentFrame();
  const T: [React.ReactNode, string][] = [[<Logo name="huggingface" size={110} />, 'Hugging Face'], [<Logo name="langchain" size={100} />, 'LangChain'],
    [<Icon name="pulse" size={110} weight="duotone" />, 'LangSmith'], [<Logo name="langgraph" size={100} />, 'LangGraph']];
  return (
    <AbsoluteFill><BG kind="sky" /><Rays /><Streaks />
      <Punch amt={0.04}><Center>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40}}>
          {T.map(([ic, lab], i) => {const s = sp(f - FPB * (0.5 + i), 9, 260); return (
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: Math.min(1, s * 2), transform: `scale(${1.9 - .9 * Math.min(1, s)}) rotate(${(1 - Math.min(1, s)) * (i % 2 ? 14 : -14)}deg)`}}>
              <div style={{...glossy, width: 230, height: 230, borderRadius: 62}}>{ic}</div>
              <div style={{fontWeight: 800, fontSize: 44, color: INK, direction: 'ltr'}}>{lab}</div>
            </div>);})}
        </div>
      </Center></Punch>
      <Flash frames={4} color="#fff" />
    </AbsoluteFill>
  );
};
const Llm0: React.FC = () => {
  const f = useCurrentFrame(); const s = sp(f, 9, 240); const s2 = sp(f - FPB, 10, 220);
  return (
    <AbsoluteFill><BG kind="dark" /><Rays dark /><Streaks dark />
      <Shake power={26} frames={10}><Center>
        <div style={{fontWeight: 800, fontSize: 260, lineHeight: 1, direction: 'ltr', transform: `scale(${3 - 2 * Math.min(1, s)})`, opacity: Math.min(1, s * 2), ...goldText,
          filter: 'drop-shadow(0 0 40px rgba(232,192,102,.6))'}}>30</div>
        <div style={{fontWeight: 800, fontSize: 96, color: '#fff', direction: 'ltr', textAlign: 'center', lineHeight: 1.15, opacity: s2, transform: `translateY(${(1 - s2) * 120}px)`}}>Days of<br /><span style={goldText}>LLM Apps</span></div>
        <div style={{marginTop: 30, fontWeight: 800, fontSize: 50, color: INK, background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', padding: '8px 34px', borderRadius: 99, opacity: s2}}>بالعربي</div>
      </Center></Shake>
      <Shock /><Flash frames={5} color={GOLD_LT} />
    </AbsoluteFill>
  );
};
const Date0: React.FC = () => {
  const f = useCurrentFrame(); const s = sp(f, 10, 240); const s2 = sp(f - FPB, 9, 240);
  return (
    <AbsoluteFill><BG kind="sky" /><Rays /><Streaks />
      <Punch><Center>
        <div style={{...glossy, width: 200, height: 200, borderRadius: 56, transform: `rotateY(${(1 - Math.min(1, s)) * 90}deg)`, marginBottom: 40}}><Icon name="calendar-check" size={120} weight="duotone" /></div>
        <div style={{fontWeight: 800, fontSize: 190, color: INK, direction: 'rtl', transform: `scale(${2 - Math.min(1, s)})`, opacity: Math.min(1, s * 2)}}>الثلاثاء</div>
        <div style={{fontWeight: 800, fontSize: 150, direction: 'rtl', background: INK, color: GOLD_LT, padding: '0 34px', borderRadius: 26, transform: `scale(${s2})`}}>9 الصبح</div>
      </Center></Punch>
      <Flash frames={4} color="#fff" />
    </AbsoluteFill>
  );
};
const Cta0: React.FC = () => {
  const f = useCurrentFrame(); const beat = Math.exp(-((f % FPB) / FPB) * 6); const p = sp(f, 10, 200); const q = sp(f - FPB * 2, 9, 260);
  return (
    <AbsoluteFill><BG kind="dark" /><Rays dark /><Streaks dark />
      <Center>
        <div style={{position: 'relative', transform: `scale(${(0.4 + .6 * Math.min(1, p)) * (1 + .03 * beat)})`}}>
          {[0, 1].map((k) => {const r = ((f + k * 7) % FPB) / FPB; return <div key={k} style={{position: 'absolute', left: '50%', top: '50%', width: 340, height: 340, borderRadius: '50%',
            border: `5px solid ${GOLD_LT}`, transform: `translate(-50%,-50%) scale(${1 + r * .8})`, opacity: (1 - r) * .7}} />;})}
          <Arch w={300} h={390} enter={1} />
        </div>
        <div style={{marginTop: 40}}><Slam text="ناوي تمشي معي؟ اكتب معك بالتعليقات" size={72} color="#fff" hl="معك" hlStyle={{background: 'linear-gradient(150deg,#F6DE9C,#E8C066 50%,#C9A24B)', color: INK}} start={FPB} stagger={3} /></div>
        <div style={{marginTop: 26, fontWeight: 800, fontSize: 140, direction: 'rtl', transform: `scale(${(0.3 + .7 * Math.min(1, q)) * (1 + .08 * beat)})`, opacity: Math.min(1, q * 2), ...goldText,
          filter: 'drop-shadow(0 0 30px rgba(232,192,102,.7))'}}>تابعني</div>
      </Center>
      <Flash frames={6} color={GOLD_LT} />
      <Sign start={FPB * 8} />
    </AbsoluteFill>
  );
};

export const Reel0Energy: React.FC = () => {
  const P = P0(); let at = 0; const total = energy0Frames();
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Cairo'}}>
      {P.map(([, beats, x], i) => {
        const from = at; const dur = beats * FPB + (i === P.length - 1 ? 20 : 0); at += beats * FPB;
        const el = x.r === 'i0' ? <Intro0 /> : x.r === 't' ? <Text0 text={x.text} i={x.i} hl={x.hl} portrait={i === 1} /> : x.r === 'n8n' ? <N8nDone /> : x.r === 'q' ? <Q0 />
          : x.r === 'q2' ? <Q2 /> : x.r === 'tools' ? <Tools0 /> : x.r === 'llm' ? <Llm0 /> : x.r === 'date' ? <Date0 /> : <Cta0 />;
        return <Sequence key={i} from={from} durationInFrames={dur}>{el}</Sequence>;
      })}
      <Header total={total} />
      <Audio src={staticFile('audio/energy/day-00.wav')} />
    </AbsoluteFill>
  );
};
