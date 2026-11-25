"""ريلز الصوت: موسيقى هادية تحت صوت محمد + مؤثرات على المشاهد + ducking تلقائي + ماستر نهائي.
الاستخدام:  python3 scripts/gen-voice-mix.py 1
بيقرأ: src/voiceDay01.json و public/audio/voice/day-01-voice.wav
بيكتب: public/audio/voice/day-01-mix.wav"""
import os, sys, json, subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly
from synth import Track, SR, lp, hp, hz, t, env

HERE = os.path.dirname(os.path.abspath(__file__)); REELS = os.path.join(HERE, '..')
arg = sys.argv[1] if sys.argv[1:] else '1'
day = int(arg.rstrip('s')); variant = 's' if arg.endswith('s') else ''   # 2s = نسخة الترند القصيرة
NN = f'{day:02d}{variant}'
P = json.load(open(os.path.join(REELS, 'src', f'voiceDay{NN}.json'), encoding='utf-8'))
OFF, END = P['off'], P['end']
SC = {sc[0]: (sc[1] + OFF, sc[2] + OFF) for sc in P['scenes']}
def v(s):                                                 # من زمن الصوت الأصلي لزمن الفيديو
    if 'segments' not in P: return s + OFF
    for a, b, n in P['segments']:                          # النسخة القصيرة: المؤثرات خارج المقاطع بتنشال
        if a - 1e-6 <= s < b: return n + (s - a) + OFF
    return -100.0
INTRO_END = P['scenes'][1][1] + OFF                       # الإيقاع بيدخل بعد ثاني مشهد (الخطّاف)

# ── الصوت ──
sr, vo = wavfile.read(os.path.join(REELS, 'public', 'audio', 'voice', f'day-{NN}-voice.wav'))
vo = vo.astype(np.float64) / (32768 if vo.dtype == np.int16 else 1)
if vo.ndim > 1: vo = vo.mean(1)
if sr != SR: vo = resample_poly(vo, SR, sr)
voice = np.zeros(int(END * SR) + SR); i0 = int(OFF * SR); voice[i0:i0 + len(vo)] = vo[: len(voice) - i0]

# ── الموسيقى: جروف تقني هادي 100 BPM ──
BPM = 100; BEAT = 60 / BPM
T = Track(END, seed=11 + day)
PROG = [[62, 65, 69], [58, 62, 65], [65, 69, 72], [60, 64, 67]]
ROOTS = [38, 34, 41, 36]
nb = int(END / BEAT)
bed = np.zeros(T.n)
for q in range(nb):
    at = q * BEAT; bar = q // 4; ch = PROG[bar % 4]; root = ROOTS[bar % 4]
    intro = at < INTRO_END; outro = at > SC['outro'][0] + .3
    if not outro:
        if q % 2 == 0 and not intro: T.add(T.kick(.75), at, .8)
        if q % 2 == 1 and not intro: T.add(T.clap(), at, .45, .1)
        T.add(T.hat(), at + BEAT / 2, .45, .3)
        if q % 4 == 3: T.add(T.hat(True), at + 3 * BEAT / 4, .35, -.3)
        if not intro: T.add(T.pluck(root, .5, .2, .7), at, .55)
    if q % 4 == 0:
        p = T.pad(ch + [ch[0] + 12], BEAT * 4.2, 1800 if intro else 2600)
        k = int(at * SR); bed[k:k + len(p)] += p[: T.n - k]
    if not intro and not outro and (bar % 2 == 1):
        seq = [ch[0] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12]
        T.add(T.pluck(seq[q % 4], .35, .12, 1.0), at + BEAT / 2, .16, .4 if q % 2 else -.4)
T.L += bed * .7; T.R += bed * .7
music = T.master(END, wet=.25)

# ── ducking: الموسيقى بتنزل لما محمد يحكي ──
win = int(.03 * SR); e = np.sqrt(np.convolve(voice ** 2, np.ones(win) / win, 'same'))
e = np.convolve(e, np.ones(int(.25 * SR)) / int(.25 * SR), 'same'); e = e / (e.max() + 1e-9)
duck = 1 - .62 * np.clip(e * 3.5, 0, 1)
music *= duck[: len(music), None] if len(duck) >= len(music) else np.pad(duck, (0, len(music) - len(duck)), constant_values=1)[:, None]

# ── المؤثرات ──
X = Track(END, seed=99 + day)
def ting(at, g=.5):                                       # توقيع محمد: جرسين ذهبيين
    X.add(X.bell(93, 1.6), at, g, -.3); X.add(X.bell(100, 1.8), at + .07, g * .8, .3)
def pop(at, m=84, g=.35, pan=0): X.add(X.pluck(m, .18, .05, 1.0), at, g, pan)
def keys(a, b):
    tt = a
    while tt < b: X.add(X.key(), tt, .32, X.rng.uniform(-.4, .4)); tt += X.rng.uniform(.045, .09)
for k, (a, b) in SC.items():
    if k not in ('hook',): w = X.whoosh(.35, True); X.add(w, a - .33, .32, -.3); X.add(w, a - .33, .32, .3)
ting(OFF, .45); X.add(X.impact(.6), OFF, .55)
if day == 1:
    X.add(X.impact(.7), v(6.14), .6); X.add(X.bell(88, 1.2), v(7.94), .35)          # أربع سطور
    keys(v(6.4), v(9.4))
    X.add(X.tick(40), v(16.9), .9); X.add(X.impact(.5), v(16.9), .45)                # قفل
    X.add(X.riser(1.3), v(21.25) - 1.3, .45); X.add(X.impact(.9), v(21.3), .7)       # فتح + Hugging Face
    for i, m in enumerate([86, 90, 93, 98]): X.add(X.bell(m, 1.4), v(21.35) + i * .06, .22, (-.5, -.2, .2, .5)[i])
    X.add(X.tick(36), v(36.12), .6)                                                   # باب المطبخ
    for i in range(3): pop(v(45.36) + i * .11, 96, .28, (-.4, 0, .4)[i])              # رشّة ملح
    X.add(X.bell(81, 1.0), v(49.04), .25); X.add(X.tick(52), v(51.54), .7)           # الحساب والمفتاح
    keys(v(57.0), v(58.9))
    X.add(X.impact(.8), v(59.6), .6)                                                  # تحذير
    for i in range(4): X.add(X.tick(88 if i % 2 else 83), v(60.5) + i * .16, .45)
    pop(v(62.14), 79, .4)
    keys(v(65.8), v(68.9)); keys(v(75.6), v(77.0))
    X.add(X.bell(91, 1.2), v(77.28), .35)                                             # خلصت
    X.add(X.impact(.7), v(79.6), .55); ting(v(79.62), .4)
    w = X.whoosh(.3, True); X.add(w, v(80.6), .3)                                     # إرسال السؤال
    pop(v(84.52), 88, .35); keys(v(84.7), v(88.2))
    X.add(X.impact(.9), v(90.4), .65); ting(v(90.45), .35)                            # الجملة الذهبية
    for tt in (101.4, 102.0, 102.55, 103.1, 103.6): pop(v(tt), 84 + int((tt * 10) % 7), .3)
    X.add(X.riser(1.4), v(106.98) - 1.4, .4); X.add(X.impact(.8), v(106.98), .55)
elif day == 2:
    keys(v(2.1), v(5.8)); X.add(X.impact(.45), v(3.0), .4)                       # جدار الكود + الختم
    X.add(X.impact(.75), v(8.2), .6); X.add(X.bell(88, 1.2), v(8.64), .35)         # سطر واحد
    for i in range(3): pop(v(11.6) + i * .15, 86 + i * 3, .3, (-.4, 0, .4)[i])     # 3 قطع
    X.add(X.bell(84, 1.0), v(12.23), .3)                                            # Prompt
    X.add(X.impact(.5), v(14.91), .45); X.add(X.tick(45), v(14.91), .6)            # LLM
    X.add(X.bell(88, 1.0), v(17.61), .3)                                            # Parser
    for i in range(2): w = X.whoosh(.12, False); X.add(w, v(25.0) + i * .13, .5, (-.3, .3)[i])   # شريط لاصق
    pop(v(26.14), 84, .35); X.add(X.impact(.6), v(27.31), .55)                      # بس مش مرتّب
    X.add(X.riser(1.2), v(28.54) - 1.2, .4); X.add(X.impact(.8), v(28.54), .6)     # لانغ تشين
    for i, m in enumerate([86, 90, 93]): X.add(X.bell(m, 1.2), v(28.6) + i * .06, .2, (-.4, 0, .4)[i])
    w = X.whoosh(.5, True); X.add(w, v(31.3), .3)                                   # اربطهم بخط
    for tt, m in ((32.7, 81), (33.74, 84), (34.46, 88)): pop(v(tt), m, .32)        # Prompt | LLM | Parser
    for tt in (33.48, 34.28): X.add(X.tick(76), v(tt), .6)
    X.add(X.impact(.85), v(35.95), .6); ting(v(36.0), .35)                          # pipe
    for i in range(3): pop(v(38.2) + i * .25, 79 + i * 4, .28, (-.4, 0, .4)[i])     # خط الإنتاج
    pop(v(42.55), 88, .35)                                                          # VS Code
    keys(v(45.3), v(54.2))                                                          # الكود بينكتب
    for tt, m in ((47.31, 84), (52.2, 88), (53.7, 91)): pop(v(tt), m, .3)
    keys(v(56.4), v(57.6)); X.add(X.tick(60), v(57.7), .7)                          # python app.py ⏎
    for i in range(3): pop(v(60.06) + i * .45, 86 + i * 2, .26)
    ting(v(61.33), .35)                                                             # 3 نقاط مرتبة
    pop(v(63.57), 84, .35); X.add(X.impact(.55), v(64.61), .5)                      # اعتذار
    X.add(X.bell(91, 1.2), v(66.28), .3)                                            # مؤدب زيادة
    X.add(X.tick(40), v(71.0), .7); ting(v(71.47), .3)                              # invoke → stream
    keys(v(71.6), v(73.0))
    pop(v(72.84), 86, .35); X.add(X.impact(.6), v(73.0), .5)                        # أقصر
    X.add(X.riser(1.4), v(76.23) - 1.4, .45); X.add(X.impact(.9), v(76.23), .65); ting(v(76.28), .35)   # الجملة الذهبية
    X.add(X.tick(40), v(79.74), .6); pop(v(80.46), 86, .3); X.add(X.impact(.7), v(82.1), .55)
    pop(v(84.95), 84, .3)                                                           # جيت هَب
    for tt in (90.2, 90.6, 91.0, 91.4): pop(v(tt), 84 + int((tt * 10) % 7), .3)   # أفكار
    X.add(X.bell(88, 1.0), v(92.11), .3)
    X.add(X.tick(52), v(93.9), .7); pop(v(93.92), 79, .35)                          # تابعني
    X.add(X.riser(1.2), v(94.74) - 1.2, .35); X.add(X.impact(.7), v(94.74), .5)    # بكرة
    for i, m in enumerate([86, 90, 93, 98]): X.add(X.bell(m, 1.4), v(97.78) + i * .06, .2, (-.5, -.2, .2, .5)[i])
elif day == 3:
    pop(v(0.4), 81, .3); pop(v(1.86), 84, .3)                                       # نفس النموذج / نفس الكود
    X.add(X.impact(.6), v(3.37), .5); X.add(X.bell(88, 1.2), v(3.86), .3)          # 3 لهجات
    for tt, m in ((4.45, 84), (5.45, 88), (6.27, 91)): pop(v(tt), m, .34)          # فلسطيني شامي مصري
    for i in range(3): X.add(X.tick(70 + i * 3), v(8.08) + i * .12, .55)
    X.add(X.impact(.85), v(9.1), .65); ting(v(9.15), .3)                            # كلهم مصري!
    for tt, m in ((10.86, 84), (11.19, 88), (11.98, 91)): pop(v(tt), m, .3)        # أساليب
    for tt, m in ((15.41, 79), (16.09, 83), (16.59, 86)): pop(v(tt), m, .34)       # 3 نسخ
    X.add(X.impact(.7), v(18.48), .55)                                              # تعب على الفاضي
    X.add(X.riser(1.2), v(21.47) - 1.2, .4); X.add(X.impact(.8), v(21.47), .6); ting(v(21.5), .3)   # Prompt Template
    X.add(X.bell(91, 1.2), v(23.48), .3)                                            # = قالب
    for tt in (30.0, 30.72, 31.53): pop(v(tt), 86 + int(tt) % 5, .34); X.add(X.tick(80), v(tt), .4)   # تعبئة الفراغات
    pop(v(36.49), 88, .35)                                                          # VS Code
    keys(v(37.6), v(44.8))                                                          # كتابة القالب
    pop(v(38.55), 84, .3); pop(v(41.97), 88, .3)
    for tt in (46.08, 47.17): w = X.whoosh(.3, True); X.add(w, v(tt) - .25, .3)    # الأمثلة
    X.add(X.impact(.6), v(49.08), .5); ting(v(49.1), .3)                            # Few-shot
    keys(v(54.7), v(55.9)); X.add(X.tick(60), v(56.0), .7)                          # python app.py ⏎
    for tt in (56.36, 59.39, 60.9): pop(v(tt), 86, .28)
    X.add(X.impact(.55), v(57.73), .5); X.add(X.impact(.55), v(60.59), .5)          # الختمين
    X.add(X.impact(.9), v(64.03), .65); ting(v(64.1), .35)                          # طلع مصري
    X.add(X.riser(1.3), v(65.37) - 1.3, .45); X.add(X.impact(.9), v(65.37), .6)    # الخلاصة
    X.add(X.bell(91, 1.0), v(67.56), .3); X.add(X.tick(40), v(69.31), .6)
    X.add(X.riser(1.0), v(78.56) - 1.0, .35); X.add(X.impact(.8), v(78.56), .55)   # نموذج أكبر
    pop(v(80.31), 84, .3)                                                           # جيت هَب
    for tt in (84.6, 84.95, 85.3, 85.65): pop(v(tt), 84 + int((tt * 10) % 7), .3)  # لهجات تانية
    X.add(X.bell(88, 1.0), v(86.41), .3)
    X.add(X.tick(52), v(88.3), .7); pop(v(88.32), 79, .35)                          # تابعني
    X.add(X.riser(1.0), v(89.38) - 1.0, .3); X.add(X.impact(.7), v(89.38), .5)     # بكرة
    for i, m in enumerate([86, 90, 93, 98]): X.add(X.bell(m, 1.4), v(92.3) + i * .06, .2, (-.5, -.2, .2, .5)[i])
ting(SC['outro'][0] + .25, .5)
sfx = X.master(END, wet=.18)

# ── الماستر ──
L = min(len(music), len(sfx), len(voice))
mix = voice[:L, None] * 1.0 + music[:L] * .30 + sfx[:L] * .55
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .89
tmp = os.path.join(REELS, 'public', 'audio', 'voice', f'day-{NN}-mix-pre.wav')
out = os.path.join(REELS, 'public', 'audio', 'voice', f'day-{NN}-mix.wav')
wavfile.write(tmp, SR, (mix * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9', '-ar', '48000', out], check=True)
os.remove(tmp)
print('mix', out, round(L / SR, 2), 's')
