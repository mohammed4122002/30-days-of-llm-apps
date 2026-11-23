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
day = int(sys.argv[1]) if sys.argv[1:] else 1
P = json.load(open(os.path.join(REELS, 'src', f'voiceDay{day:02d}.json'), encoding='utf-8'))
OFF, END = P['off'], P['end']
SC = {k: (a + OFF, b + OFF) for k, a, b in P['scenes']}
v = lambda s: s + OFF                                      # من زمن الصوت لزمن الفيديو

# ── الصوت ──
sr, vo = wavfile.read(os.path.join(REELS, 'public', 'audio', 'voice', f'day-{day:02d}-voice.wav'))
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
    intro = at < SC['four'][0]; outro = at > SC['outro'][0] + .3
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

# ── المؤثرات: أصوات uisfx (CC0) من public/sfx + بوم وخربشة أسطوانة مصنوعين هون ──
X = Track(END, seed=99 + day)
_cache = {}
def S(name):
    if name not in _cache:
        r, y = wavfile.read(os.path.join(REELS, 'public', 'sfx', name + '.wav'))
        y = y.astype(np.float64) / 32768; _cache[name] = y / (np.max(np.abs(y)) + 1e-9)
    return _cache[name]
def put(name, at, g=.5, pan=0): X.add(S(name), at, g, pan)
def boom(at, g=.8):                                       # بوم كوميدي عميق
    n = int(1.6 * SR); x = t(n); f = 55 * np.exp(-x * 1.2) + 30
    y = np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 2.2) * 3) * .9
    y += lp(X.noise(n), 1500) * np.exp(-x * 25) * .4
    X.add(y, at, g)
def scratch(at, g=.5):                                    # خربشة أسطوانة
    n = int(.45 * SR); x = t(n); sp_ = np.sin(2 * np.pi * 3.2 * x) * .5 + .5
    ph = np.cumsum(300 + 1800 * sp_) / SR; y = (2 * (ph % 1) - 1) * .5 + X.noise(n) * .25
    y = lp(hp(y, 300), 4500) * env(n, .005, .08); X.add(y, at, g)
def ting(at, g=.5): X.add(X.bell(93, 1.6), at, g, -.3); X.add(X.bell(100, 1.8), at + .07, g * .8, .3)
def typing(a, b, g=.35):
    tt = a
    while tt < b: put('studio-typing', tt, g * X.rng.uniform(.7, 1), X.rng.uniform(-.4, .4)); tt += X.rng.uniform(.06, .11)
for k, (a, b) in SC.items():
    if k not in ('hook', 'outro'): put('cinematic-swipe', a - .12, .35, -.2)
ting(OFF, .45); boom(OFF, .55)
boom(v(3.9), .75)                                          # للبيع: كلية وحدة
scratch(v(6.1), .55); put('arcade-bonus', v(7.94), .45)    # السعر انشطب + أربع سطور
typing(v(6.4), v(9.3), .25)
put('glass-expand', v(9.8), .4)
put('cinematic-receive', v(14.38), .5)
for i in range(11): put('glass-snap', v(14.5) + i * .2, .22)
put('cinematic-blocked', v(16.9), .7)
put('cinematic-unlock', v(21.3), .7); put('cinematic-achievement', v(24.8), .55)
put('glass-expand', v(27.25), .4)
put('cinematic-reward', v(32.4), .35)
put('cinematic-blocked', v(35.7), .6); put('arcade-error', v(36.3), .45)
for i in range(3): put('glass-check', v(42.5) + i * .35, .35)
put('glass-reaction', v(45.2), .5); boom(v(45.36), .35)
for tt in (46.85, 65.15, 75.55): put('cinematic-badge', v(tt), .45)
put('cinematic-unlock', v(51.5), .5); typing(v(54.9), v(55.8), .3)
typing(v(57.1), v(58.9))
put('cinematic-warning', v(59.6), .65); boom(v(59.6), .45)
scratch(v(61.95), .35); boom(v(62.0), .6)                  # أنا حكيتلك
typing(v(65.7), v(71.4))
put('cinematic-reward', v(72.0), .5)
for i in range(3): put('glass-snap', v(74.6) + i * .15, .35)
typing(v(75.6), v(77.1))
put('cinematic-success', v(77.2), .55)
put('cinematic-level-up', v(79.55), .6); boom(v(79.55), .55)
put('cinematic-send', v(80.6), .5); put('cinematic-receive', v(84.4), .5); typing(v(84.7), v(88.6), .18)
put('glass-check', v(86.0), .45); put('glass-check', v(87.4), .45)
put('cinematic-achievement', v(90.3), .6); scratch(v(91.6), .35); put('arcade-bonus', v(92.2), .5)
put('cinematic-open', v(96.0), .5); put('cinematic-notification', v(98.6), .5)
for i, tt in enumerate((101.4, 102.0, 102.55, 103.1, 103.6)): put('cinematic-reaction', v(tt), .4, (-.4, .4, -.2, .2, 0)[i])
put('cinematic-notification', v(104.4), .45)
put('glass-select', v(105.9), .6); put('cinematic-streak', v(106.9), .55)
put('cinematic-complete', SC['outro'][0] + .2, .55); ting(SC['outro'][0] + .25, .45)
sfx = X.master(END, wet=.12)

# ── الماستر ──
L = min(len(music), len(sfx), len(voice))
mix = voice[:L, None] * 1.0 + music[:L] * .30 + sfx[:L] * .55
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .89
tmp = os.path.join(REELS, 'public', 'audio', 'voice', f'day-{day:02d}-mix-pre.wav')
out = os.path.join(REELS, 'public', 'audio', 'voice', f'day-{day:02d}-mix.wav')
wavfile.write(tmp, SR, (mix * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9', '-ar', '48000', out], check=True)
os.remove(tmp)
print('mix', out, round(L / SR, 2), 's')
