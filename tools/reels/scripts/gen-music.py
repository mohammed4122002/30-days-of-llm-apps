"""موسيقى أصلية للريل 0، مؤلّفة ومولّدة بالكامل بالكود (بدون عينات خارجية، فلا مشاكل حقوق).
متزامنة مع توقيت المشاهد في src/Reel0.tsx.  الاستخدام:  python3 scripts/gen-music.py
الناتج: public/audio/reel0.wav (48kHz ستيريو)."""
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 48000
FPS = 30
SCENES = [150, 165, 150, 135, 180, 105, 165]
TR = 18
starts = [0]
for d in SCENES[:-1]:
    starts.append(starts[-1] + d - TR)
END = starts[-1] + SCENES[-1]
ST = [s / FPS for s in starts]          # بداية كل مشهد بالثواني
DUR = END / FPS
N = int(DUR * SR) + SR
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def t(n): return np.arange(n) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l * 1.414
    R[i:i + len(sig)] += sig * gain * r * 1.414
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e

# ── الآلات ─────────────────────────────────────────
def pad(midis, dur, bright=2400):
    n = int(dur * SR); x = t(n); s = np.zeros(n)
    for m in midis:
        for det in (-0.08, 0.0, 0.09):
            f = hz(m + det)
            vib = 1 + 0.002 * np.sin(2 * np.pi * 5.2 * x)
            for k, a in ((1, 1), (2, .45), (3, .25), (4, .12), (5, .07)):
                s += a * np.sin(2 * np.pi * f * k * x * vib)
    s = lp(s, bright) / (len(midis) * 3 * 1.9)
    return s * env(n, 0.7, 0.9)

def pluck(m, dur=0.5, decay=0.22, bright=1.0):
    n = int(dur * SR); x = t(n); f = hz(m)
    s = (np.sin(2 * np.pi * f * x) + .5 * bright * np.sin(4 * np.pi * f * x) + .25 * bright * np.sin(6 * np.pi * f * x) + .1 * bright * np.sin(8 * np.pi * f * x))
    s *= np.exp(-x / decay) * env(n, 0.004, 0.05)
    return np.tanh(s * 1.2) * .6

def piano(m, dur=2.2):
    n = int(dur * SR); x = t(n); f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * k * x) * np.exp(-x * (1.2 + k * .7)) for k, a in ((1, 1), (2, .5), (3, .28), (4, .14), (5, .08)))
    return s * env(n, 0.003, 0.2) * .55

def bell(m, dur=1.6):
    n = int(dur * SR); x = t(n); f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * p * x) * np.exp(-x * d) for p, a, d in ((1, 1, 2.4), (2.76, .5, 3.6), (5.4, .25, 5.5), (8.9, .12, 8)))
    return s * env(n, 0.002, 0.1) * .45

def kick(gain=1.0):
    n = int(.45 * SR); x = t(n)
    f = 45 + 80 * np.exp(-x * 28)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7.5)
    s += lp(rng.standard_normal(n), 3000) * np.exp(-x * 120) * .25
    return np.tanh(s * 1.6) * .9 * gain

def clap():
    n = int(.35 * SR); x = t(n); nz = bp(rng.standard_normal(n), 900, 3200)
    e = np.zeros(n)
    for o in (0, .011, .022):
        i = int(o * SR); e[i:] += np.exp(-(x[: n - i]) * 34)
    return nz * e * .32

def hat(open_=False):
    n = int((.18 if open_ else .06) * SR); x = t(n)
    return hp(rng.standard_normal(n), 7500) * np.exp(-x * (18 if open_ else 70)) * .22

def whoosh(dur=0.55, up=True):
    n = int(dur * SR); x = t(n); nz = rng.standard_normal(n); out = np.zeros(n); ch = 1024
    for i in range(0, n, ch):
        p = i / n; c = (300 + 6000 * p ** 2) if up else (6000 - 5600 * p)
        seg = nz[i:i + ch]
        out[i:i + ch] = bp(seg, max(80, c * .6), min(c * 1.6, SR / 2 - 100), 1)
    shape = (x / dur) ** 2.2 if up else np.exp(-x / dur * 4)
    return out * shape * env(n, 0.0, 0.04) * .5

def impact(gain=1.0):
    n = int(2.2 * SR); x = t(n)
    f = 38 + 50 * np.exp(-x * 9)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 2.6)
    s += lp(rng.standard_normal(n), 900) * np.exp(-x * 9) * .5
    return np.tanh(s * 1.3) * .8 * gain

def riser(dur=1.3):
    n = int(dur * SR); x = t(n)
    f = 220 * (6 ** (x / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * .18
    return (whoosh(dur, True) * 1.2 + tone * (x / dur) ** 2) * env(n, 0, 0.02)

def tick(m):
    n = int(.05 * SR); x = t(n)
    return np.sin(2 * np.pi * hz(m) * x) * np.exp(-x * 90) * .35

# ── التأليف ────────────────────────────────────────
BPM = 96; BEAT = 60 / BPM; BAR = BEAT * 4
PROG = [(50, [62, 65, 69, 74]), (46, [58, 62, 65, 70]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67])]  # Dm Bb F C
nbars = int(DUR / BAR) + 2
S_N8N, S_LES, S_Q, S_CH, S_DATE, S_CTA = ST[1], ST[2], ST[3], ST[4], ST[5], ST[6]

for b in range(nbars):
    t0 = b * BAR; root, ch = PROG[b % 4]
    if t0 > DUR: break
    dark = S_Q <= t0 < S_CH - BAR * .1
    # طبقة الأوتار
    add(pad(ch, BAR + .9, 1300 if dark else 2600), t0, .55 if dark else .5, -.15)
    add(pad([c + 12 for c in ch[1:3]], BAR + .9, 3200), t0, .12 if not dark else .05, .3)
    # البيس
    for k in range(4 if t0 >= S_N8N - .2 else 0):
        bt = t0 + k * BEAT
        if bt >= DUR - .8: break
        add(pluck(root - 12, .6, .32, .5), bt, .55 if not dark else .35)
    # بيانو الافتتاحية
    if t0 < S_N8N:
        for k, m in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[3] + 12]):
            add(piano(m), t0 + k * BEAT, .5, (-.4, .3, -.2, .4)[k])
    # أربيجيو
    if S_N8N - .2 <= t0 and not dark and t0 < DUR - 1.5:
        div = 4 if t0 >= S_CH - .2 else 2
        seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12, ch[1] + 12, ch[3] + 12, ch[2] + 24]
        for k in range(4 * div):
            at = t0 + k * BEAT / div
            if at >= DUR - 1.2: break
            add(pluck(seq[k % len(seq)], .4, .16 if div == 4 else .22), at, .22 if div == 4 else .26, .45 if k % 2 else -.45)
    # الطبول
    for k in range(4):
        bt = t0 + k * BEAT
        if bt >= DUR - 1.6: break
        if S_N8N <= bt < S_Q and k in (0, 2): add(kick(.8), bt, .9)
        if S_CH <= bt < S_CTA: add(kick(1.0), bt, 1.0)
        if S_CTA <= bt and k in (0, 2): add(kick(.7), bt, .8)
        if S_CH <= bt < S_CTA and k in (1, 3): add(clap(), bt, .9, .1)
        if S_LES <= bt < S_Q:
            add(hat(), bt + BEAT / 2, .8, .3)
        if S_CH <= bt < S_CTA:
            add(hat(), bt, .6, .3); add(hat(k == 3), bt + BEAT / 2, .9, -.3)
    # نبضة عميقة بمشهد السؤال
    if dark:
        for k in (0, 2):
            add(kick(.55), t0 + k * BEAT, .55)

# ── المؤثرات المتزامنة مع المشاهد ──────────────────
add(impact(.6), 0.0, .7)
add(bell(86), 0.05, .35, .4)
for i, m in enumerate([81, 86, 88, 93]):                       # لمعة عند إبراز «والجاية أكبر»
    add(bell(m, 1.4), 56 / FPS + i * .06, .28, (-.5, -.1, .2, .5)[i])
for s in ST[1:]:                                                # نسمة قبل كل انتقال
    w = whoosh(.6, True); add(w, s - .55, .7, -.3); add(w, s - .55, .7, .3)
    add(impact(.35), s, .4)
# عدّاد 0→30: تكّات تتصاعد
c0, c1 = (starts[1] + 24) / FPS, (starts[1] + 72) / FPS
for i in range(30):
    p = i / 29; at = c0 + (c1 - c0) * (1 - (1 - p) ** 3)
    add(tick(84 + int(p * 12)), at, .55, .2)
add(bell(93, 2.0), (starts[1] + 74) / FPS, .5)                  # علامة الصح
add(bell(86, 2.0), (starts[1] + 74) / FPS, .35, -.3)
for i in range(3):                                              # بطاقات n8n
    add(whoosh(.25, False), (starts[1] + 84 + i * 9) / FPS, .35, -.4)
for i in range(3):                                              # بطاقات الدروس
    add(pluck(74 + i * 3, .6, .25), (starts[2] + 16 + i * 16) / FPS, .35)
add(whoosh(.9, True)[::-1] * .8, S_Q - .9, .5)                  # سحبة عكسية قبل السؤال
add(impact(1.0), S_Q, .9)
for i, m in enumerate([74, 77, 81, 84, 86]):                    # محطات المسار تصعد
    add(bell(m + 12, 1.2), (starts[4] + 30 + i * 26) / FPS, .32, (-.4, .4, -.2, .2, 0)[i])
add(riser(1.3), S_DATE - 1.3, .8)                               # تصاعد نحو «الثلاثاء»
add(impact(1.0), S_DATE, 1.0)
add(bell(98, 2.4), S_DATE + .02, .3)
for i in range(4):                                              # أزرار الدعوة
    add(tick(91 + i * 2), (starts[6] + 56 + i * 6) / FPS, .5)
for i, m in enumerate([62, 69, 74, 81, 86]):                    # لمعة الختام
    add(bell(m + 12, 2.6), DUR - 3.2 + i * .12, .25, (-.5, -.2, 0, .2, .5)[i])

# ── المكس النهائي ──────────────────────────────────
def reverb(x, secs=1.9, wet=.22):
    n = int(secs * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir = lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
    return x + fftconvolve(x, ir)[: len(x)] * wet
L2, R2 = reverb(L), reverb(R)
mix = np.stack([L2, R2], 1)[: int(DUR * SR)]
fade = int(1.4 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
mix[: int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR))[:, None]
mix = hp(mix.T, 30).T
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4)
mix = mix / np.max(np.abs(mix)) * 10 ** (-1 / 20)
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'reel0.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print('saved', os.path.abspath(out), f'{DUR:.2f}s')
