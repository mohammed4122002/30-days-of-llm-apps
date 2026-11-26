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
INTRO_END = P['scenes'][1][1] + OFF
SOFT = P.get('sound') == 'soft'                           # ملف صوت ناعم: موسيقى أهدى ومؤثرات أقل وأنعم                       # الإيقاع بيدخل بعد ثاني مشهد (الخطّاف)

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
        if SOFT:   # كيك ناعم ببداية كل مازورة، وبدون تصفيق، وهاي هات خفيف، وبيانو بدل النقر
            if q % 4 == 0 and not intro: T.add(T.kick(.45), at, .5)
            T.add(T.hat(), at + BEAT / 2, .18, .3)
            if not intro and q % 2 == 0: T.add(T.piano(root + 12, 1.6), at, .32, -.15)
        else:
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
        T.add(T.pluck(seq[q % 4], .35, .12, .6 if SOFT else 1.0), at + BEAT / 2, .09 if SOFT else .16, .4 if q % 2 else -.4)
T.L += bed * .7; T.R += bed * .7
music = T.master(END, wet=.25)

# ── ducking: الموسيقى بتنزل لما محمد يحكي ──
win = int(.03 * SR); e = np.sqrt(np.convolve(voice ** 2, np.ones(win) / win, 'same'))
e = np.convolve(e, np.ones(int(.25 * SR)) / int(.25 * SR), 'same'); e = e / (e.max() + 1e-9)
duck = 1 - (.72 if SOFT else .62) * np.clip(e * 3.5, 0, 1)
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
    if k not in ('hook',):
        if SOFT: w = lp(X.whoosh(.6, True), 3500); X.add(w, a - .55, .16, -.3); X.add(w, a - .55, .16, .3)   # نسمة ناعمة
        else: w = X.whoosh(.35, True); X.add(w, a - .33, .32, -.3); X.add(w, a - .33, .32, .3)
ting(OFF, .3 if SOFT else .45); X.add(lp(X.impact(.6), 300) if SOFT else X.impact(.6), OFF, .35 if SOFT else .55)
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
elif day == 3:   # النسخة 2 (سكريبت مدقق)
    pop(v(0.3), 79, .3)                                                             # الروبوت
    w = X.whoosh(.35, True); X.add(w, v(3.05) - .3, .3); keys(v(3.1), v(4.3))       # جملة بالفصحى
    X.add(X.impact(.6), v(5.98), .5); X.add(X.bell(88, 1.2), v(6.0), .3)           # 3 لهجات
    for tt, m in ((7.13, 84), (8.0, 88), (8.58, 91)): pop(v(tt), m, .34)           # فلسطيني شامي مصري
    for i in range(3): X.add(X.tick(70 + i * 3), v(10.06) + i * .12, .55)
    X.add(X.impact(.9), v(11.88), .65); ting(v(11.95), .3)                          # 3 من 3 مصري
    keys(v(13.74), v(16.3))                                                         # الجملة بتنكتب
    X.add(X.bell(84, 1.0), v(17.18), .28); X.add(X.tick(80), v(19.79), .5)         # المتوقّع
    X.add(X.bell(88, 1.0), v(21.43), .28); X.add(X.tick(80), v(22.56), .5); X.add(X.tick(84), v(23.89), .5)
    X.add(X.riser(.9), v(26.54) - .9, .3); X.add(X.impact(.55), v(26.54), .45)     # ورا الكواليس
    for i in range(3): pop(v(29.9) + i * .85, 79 + i * 4, .32)                      # 3 برومبتات
    X.add(X.impact(.6), v(36.87), .5); ting(v(36.9), .3)                            # الفراغ
    X.add(X.riser(1.0), v(39.67) - 1.0, .35); X.add(X.impact(.75), v(39.67), .55)  # Prompt Template
    for i in range(10): X.add(X.tick(76 + (i % 3) * 3), v(43.67) + i * .3, .35)    # الفراغ بيتبدّل
    pop(v(46.02), 88, .32)
    keys(v(48.4), v(54.3)); pop(v(53.71), 91, .3)                                   # الكود
    for i in range(3): w = X.whoosh(.25, True); X.add(w, v(57.0) + i * .45 - .2, .25, (-.3, 0, .3)[i])   # الأمثلة
    X.add(X.impact(.65), v(61.06), .5); ting(v(61.1), .3)                           # Few-shot
    pop(v(63.23), 86, .3); X.add(X.tick(40), v(64.7), .6)
    keys(v(66.3), v(67.6)); X.add(X.tick(60), v(67.7), .7)                          # python app.py ⏎
    X.add(X.riser(2.0), v(68.0), .25); X.add(X.bell(91, 1.0), v(70.1), .3)         # generating… done
    X.add(X.impact(.8), v(75.11), .6); pop(v(75.5), 84, .3)                         # عايزك = مصري
    pop(v(78.0), 88, .3)
    X.add(X.impact(.8), v(82.96), .6); pop(v(83.6), 88, .3)                         # هيبقى = مصري
    X.add(X.bell(88, 1.0), v(84.93), .3); X.add(X.impact(.7), v(87.26), .55)       # القالب ✓ النموذج ✗
    pop(v(90.2), 79, .3); X.add(X.tick(52), v(93.59), .5)                           # 3B
    X.add(X.riser(1.3), v(96.44) - 1.3, .45); X.add(X.impact(.9), v(96.44), .6); ting(v(96.5), .3)   # الخلاصة
    X.add(X.bell(91, 1.0), v(98.5), .3); X.add(X.impact(.6), v(100.12), .5)
    pop(v(105.08), 86, .32); pop(v(106.02), 89, .32)
    pop(v(107.5), 84, .3)                                                           # جيت هَب
    for tt in (112.2, 112.55, 112.9, 113.25): pop(v(tt), 84 + int((tt * 10) % 7), .3)
    X.add(X.impact(.6), v(113.84), .5)                                              # 72B
    X.add(X.tick(52), v(116.5), .7); pop(v(116.52), 79, .35)                        # تابعني
    X.add(X.riser(1.0), v(117.11) - 1.0, .3); X.add(X.impact(.7), v(117.11), .5)   # بكرة
    for i, m in enumerate([86, 90, 93, 98]): X.add(X.bell(m, 1.4), v(120.09) + i * .06, .2, (-.5, -.2, .2, .5)[i])
elif day == 4:   # ملف صوت ناعم: أجراس ونغمات خفيفة بس باللحظات المهمة
    def soft_hit(at, g=.3): X.add(lp(X.impact(.5), 220), at, g)                       # دقة ناعمة واطية (بدون صدمة)
    def chime(at, m=88, g=.22): X.add(X.bell(m, 1.4), at, g)
    def note(at, m=84, g=.2, pan=0): X.add(X.pluck(m, .35, .14, .45), at, g, pan)
    chime(v(2.07), 86)                                                                # ؟ على المبلغ
    note(v(5.83), 79, .16)                                                            # "شكرًا على سؤالك"
    soft_hit(v(10.23), .35); chime(v(10.25), 93, .25)                                 # 1250.5
    for i in range(5): note(v(12.6) + i * .35, 79 + i * 2, .1, (-.4, -.2, 0, .2, .4)[i])   # الإيميلات بتوصل
    chime(v(15.87), 84, .18)                                                          # Excel
    for tt, m in ((17.28, 81), (18.31, 84), (19.46, 88)): note(v(tt), m, .16)       # أعمدة الجدول
    soft_hit(v(25.64), .28)                                                           # الحكي ما بينحط
    chime(v(31.92), 88, .2)                                                           # الشكل الثابت
    soft_hit(v(36.37), .3); chime(v(36.4), 93, .22)                                   # Schema
    note(v(41.8), 84, .15); note(v(43.68), 88, .15)                                   # خانات الاستمارة
    chime(v(51.33), 86, .16)                                                          # VS Code
    for tt, m in ((59.25, 81), (60.16, 84), (61.4, 88)): note(v(tt), m, .15)        # str float str
    chime(v(64.45), 91, .16)                                                          # Parser
    w = lp(X.whoosh(1.2, True), 2500); X.add(w, v(66.2), .12)                         # التعليمات بتنكتب لحالها
    chime(v(74.27), 88, .18)                                                          # 1250.5 بالنص
    note(v(77.9), 76, .18)                                                            # ⏎
    chime(v(81.52), 88, .22); chime(v(89.94), 91, .22)                                # ✓ ✓
    soft_hit(v(92.37), .38); X.add(X.bell(79, 1.8), v(92.4), .2)                      # '-dollar'
    chime(v(102.25), 86, .2); chime(v(104.41), 81, .18)                               # الشكل مضمون / الصح لا
    for tt, m in ((112.89, 84), (114.06, 88), (115.11, 91)): note(v(tt), m, .16)    # USD EUR ILS
    soft_hit(v(119.2), .32)                                                           # البارسر رفضه
    X.add(X.riser(1.2) * .5, v(121.52) - 1.2, .25); chime(v(121.55), 93, .25)        # الخلاصة
    chime(v(126.62), 88, .2)                                                          # بيانات
    for tt, m in ((137.81, 84), (138.98, 88), (140.21, 91)): note(v(tt), m, .16)    # فواتير، سير، إيميلات
    note(v(144.6), 79, .2); chime(v(145.71), 88, .2)                                  # تابعني / بكرة
    for i, m in enumerate([86, 90, 93, 98]): X.add(X.bell(m, 1.4), v(148.3) + i * .07, .13, (-.5, -.2, .2, .5)[i])
elif day == 5:   # ملف صوت ناعم (نفس اليوم 4): أجراس ونغمات خفيفة باللحظات المهمة
    def soft_hit(at, g=.3): X.add(lp(X.impact(.5), 220), at, g)
    def chime(at, m=88, g=.22): X.add(X.bell(m, 1.4), at, g)
    def note(at, m=84, g=.18, pan=0): X.add(X.pluck(m, .35, .14, .45), at, g, pan)
    chime(v(0.71), 84, .2)                                                            # سر
    for i in range(4): note(v(1.6) + i * .3, 79 + i * 3, .14, (-.4, .4, -.3, .3)[i])   # فقاعات الذكريات
    soft_hit(v(3.98), .3); X.add(X.bell(76, 1.6), v(4.0), .16)                        # ما بيتذكرك
    w = lp(X.whoosh(.5, False), 2500); X.add(w, v(5.72), .25)                         # ولا كلمة (بتختفي)
    note(v(10.14), 88, .2); note(v(11.33), 81, .2); soft_hit(v(12.14), .3)           # أهلًا يا أحمد / معقول؟
    for i in range(3): X.add(X.bell(96 + i * 2, .9), v(15.0) + i * .9, .06)           # Zzz
    chime(v(16.84), 91, .2); for_q = [note(v(18.0) + i * .17, 86 + i * 3, .16) for i in range(3)]   # بيصحى / ؟؟؟
    note(v(19.98), 84, .16); note(v(21.48), 79, .16)
    for tt in (24.81, 26.12, 27.22): note(v(tt), 84, .16)                             # أول رسالة
    chime(v(31.76), 93, .22)                                                          # فكرة
    soft_hit(v(33.82), .25); chime(v(33.85), 88, .24)                                  # الدفتر
    X.add(X.riser(.8) * .5, v(35.0), .18); chime(v(35.8), 96, .16)                    # طلع الصبح
    w = lp(X.whoosh(.4, True), 3000); X.add(w, v(37.9), .16); chime(v(38.5), 91, .2) # فتح الدفتر
    note(v(43.06), 84, .16); note(v(48.11), 88, .16)                                  # رسائل
    for tt in (45.69, 49.2): w = lp(X.whoosh(.45, True), 2800); X.add(w, tt + OFF - .2 if False else v(tt) - .2, .16)
    for i in range(8): X.add(X.tick(80 + (i % 3) * 2), v(52.74) + i * .2, .18)        # بيقرأ بسرعة
    chime(v(66.04), 88, .2)                                                           # = الدفتر
    for i in range(3): note(v(68.6) + i * .8, 81 + i * 3, .14)                       # أسطر بتنكتب
    note(v(75.3), 81, .18); note(v(78.31), 84, .18)
    for i in range(6): X.add(X.tick(84), v(80.4) + i * .4, .12)                       # الرد بينكتب
    chime(v(83.52), 93, .26); chime(v(83.6), 98, .18)                                 # تذكّرني!
    soft_hit(v(86.21), .25); chime(v(87.51), 88, .2)
    for i in range(6): note(v(91.8) + i * .12, 79 + (i % 4) * 2, .08, (i % 3 - 1) * .4)   # ألف مستخدم
    chime(v(94.63), 86, .18); note(v(96.73), 88, .2); soft_hit(v(97.47), .32)         # مين محمد؟!
    for i in range(3): note(v(102.28) + i * .4, 81 + i * 4, .16)                     # الدفاتر
    chime(v(105.65), 91, .2); for_l = [X.add(X.tick(70), v(113.95) + i * .15, .3) for i in range(3)]   # أقفال
    note(v(121.85), 84, .16); w = lp(X.whoosh(1.4, False), 2000); X.add(w, v(123.9), .2)   # ممحاة
    for i in range(8): X.add(X.pluck(72 + i, .25, .1, .3), v(128.0) + i * .4, .09)     # الدفتر بيتخن
    note(v(131.63), 76, .18); note(v(132.91), 84, .16); note(v(133.71), 88, .16)
    w = lp(X.whoosh(.6, True), 2500); X.add(w, v(140.0), .16); chime(v(141.66), 86, .2)   # قاعدة بيانات
    chime(v(144.29), 91, .2)
    X.add(X.riser(1.3) * .5, v(147.03) - 1.3, .22); chime(v(147.05), 93, .26)        # الخلاصة
    chime(v(150.93), 88, .22); for_c = [note(v(152.59) + i * .15, 84 + i * 2, .14) for i in range(5)]   # أسبوع ✓
    chime(v(156.95), 88, .2); w = lp(X.whoosh(.5, True), 3000); X.add(w, v(157.5), .18)   # احفظ / ابعت
    note(v(162.43), 84, .16)
    note(v(167.86), 84, .18); note(v(169.82), 79, .18); soft_hit(v(171.98), .25)
    note(v(174.5), 79, .2); chime(v(175.35), 88, .2)
    for i, m in enumerate([86, 90, 93, 98]): X.add(X.bell(m, 1.4), v(180.9) + i * .07, .13, (-.5, -.2, .2, .5)[i])
ting(SC['outro'][0] + .25, .5)
sfx = X.master(END, wet=.18)

# ── الماستر ──
L = min(len(music), len(sfx), len(voice))
mix = voice[:L, None] * 1.0 + music[:L] * (.26 if SOFT else .30) + sfx[:L] * (.42 if SOFT else .55)
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .89
tmp = os.path.join(REELS, 'public', 'audio', 'voice', f'day-{NN}-mix-pre.wav')
out = os.path.join(REELS, 'public', 'audio', 'voice', f'day-{NN}-mix.wav')
wavfile.write(tmp, SR, (mix * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9', '-ar', '48000', out], check=True)
os.remove(tmp)
print('mix', out, round(L / SR, 2), 's')
