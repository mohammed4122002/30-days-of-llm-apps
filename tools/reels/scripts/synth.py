"""أدوات توليد الصوت المشتركة للريلز: آلات ومؤثرات مؤلّفة بالكود بالكامل (بدون عينات خارجية)."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000


class Track:
    def __init__(self, seconds, seed=7):
        self.n = int(seconds * SR) + SR
        self.L = np.zeros(self.n); self.R = np.zeros(self.n)
        self.rng = np.random.default_rng(seed)

    def add(self, sig, at, gain=1.0, pan=0.0):
        i = int(at * SR)
        if i >= self.n or i < 0: return
        sig = sig[: self.n - i]
        l = np.cos((pan + 1) * np.pi / 4) * 1.414; r = np.sin((pan + 1) * np.pi / 4) * 1.414
        self.L[i:i + len(sig)] += sig * gain * l; self.R[i:i + len(sig)] += sig * gain * r

    # ── الآلات ──
    def noise(self, n): return self.rng.standard_normal(n)

    def pad(self, midis, dur, bright=2600):
        n = int(dur * SR); x = t(n); s = np.zeros(n)
        for m in midis:
            for det in (-0.08, 0.0, 0.09):
                f = hz(m + det); vib = 1 + 0.002 * np.sin(2 * np.pi * 5.2 * x)
                for k, a in ((1, 1), (2, .45), (3, .25), (4, .12), (5, .07)):
                    s += a * np.sin(2 * np.pi * f * k * x * vib)
        return lp(s, bright) / (len(midis) * 3 * 1.9) * env(n, 0.7, 0.9)

    def pluck(self, m, dur=0.5, decay=0.22, bright=1.0):
        n = int(dur * SR); x = t(n); f = hz(m)
        s = (np.sin(2 * np.pi * f * x) + .5 * bright * np.sin(4 * np.pi * f * x) + .25 * bright * np.sin(6 * np.pi * f * x) + .1 * bright * np.sin(8 * np.pi * f * x))
        return np.tanh(s * np.exp(-x / decay) * env(n, 0.004, 0.05) * 1.2) * .6

    def piano(self, m, dur=2.2):
        n = int(dur * SR); x = t(n); f = hz(m)
        s = sum(a * np.sin(2 * np.pi * f * k * x) * np.exp(-x * (1.2 + k * .7)) for k, a in ((1, 1), (2, .5), (3, .28), (4, .14), (5, .08)))
        return s * env(n, 0.003, 0.2) * .55

    def bell(self, m, dur=1.6):
        n = int(dur * SR); x = t(n); f = hz(m)
        s = sum(a * np.sin(2 * np.pi * f * p * x) * np.exp(-x * d) for p, a, d in ((1, 1, 2.4), (2.76, .5, 3.6), (5.4, .25, 5.5), (8.9, .12, 8)))
        return s * env(n, 0.002, 0.1) * .45

    def kick(self, gain=1.0):
        n = int(.45 * SR); x = t(n); f = 45 + 80 * np.exp(-x * 28)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 7.5) + lp(self.noise(n), 3000) * np.exp(-x * 120) * .25
        return np.tanh(s * 1.6) * .9 * gain

    def clap(self):
        n = int(.35 * SR); x = t(n); nz = bp(self.noise(n), 900, 3200); e = np.zeros(n)
        for o in (0, .011, .022):
            i = int(o * SR); e[i:] += np.exp(-(x[: n - i]) * 34)
        return nz * e * .32

    def hat(self, open_=False):
        n = int((.18 if open_ else .06) * SR); x = t(n)
        return hp(self.noise(n), 7500) * np.exp(-x * (18 if open_ else 70)) * .22

    def whoosh(self, dur=0.55, up=True):
        n = int(dur * SR); x = t(n); nz = self.noise(n); out = np.zeros(n); ch = 1024
        for i in range(0, n, ch):
            p = i / n; c = (300 + 6000 * p ** 2) if up else (6000 - 5600 * p)
            out[i:i + ch] = bp(nz[i:i + ch], max(80, c * .6), min(c * 1.6, SR / 2 - 100), 1)
        shape = (x / dur) ** 2.2 if up else np.exp(-x / dur * 4)
        return out * shape * env(n, 0.0, 0.04) * .5

    def impact(self, gain=1.0):
        n = int(2.2 * SR); x = t(n); f = 38 + 50 * np.exp(-x * 9)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 2.6) + lp(self.noise(n), 900) * np.exp(-x * 9) * .5
        return np.tanh(s * 1.3) * .8 * gain

    def riser(self, dur=1.3):
        n = int(dur * SR); x = t(n); f = 220 * (6 ** (x / dur))
        return (self.whoosh(dur, True) * 1.2 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .18 * (x / dur) ** 2) * env(n, 0, 0.02)

    def tick(self, m):
        n = int(.05 * SR); x = t(n)
        return np.sin(2 * np.pi * hz(m) * x) * np.exp(-x * 90) * .35

    def key(self):
        """نقرة كيبورد ناعمة"""
        n = int(.035 * SR); x = t(n)
        return bp(self.noise(n), 1800, 6000) * np.exp(-x * 160) * .5 + np.sin(2 * np.pi * 180 * x) * np.exp(-x * 120) * .2

    def master(self, seconds, wet=.22):
        L, R = reverb(self.L, self.rng, wet), reverb(self.R, self.rng, wet)
        mix = np.stack([L, R], 1)[: int(seconds * SR)]
        fade = int(1.2 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
        mix[: int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR))[:, None]
        mix = hp(mix.T, 30).T
        return mix


def t(n): return np.arange(n) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e
def reverb(x, rng, wet=.22, secs=1.9):
    n = int(secs * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir = lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
    return x + fftconvolve(x, ir)[: len(x)] * wet
