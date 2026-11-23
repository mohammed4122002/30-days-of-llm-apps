"""ريلز «الطاقة»: خطة إيقاعية لكل يوم (120 نبضة بالدقيقة، 15 إطار للنبضة) + موسيقى حماسية متزامنة معها.
الخطة بتنكتب بـ src/energyPlan.json والفيديو (EnergyReel.tsx) بيقرأها، فالصورة والصوت على نفس النبضة.

الاستخدام:  python3 scripts/gen-energy.py 8      أو      python3 scripts/gen-energy.py all
الناتج: public/audio/energy/day-NN.wav"""
import os, sys, json, re, subprocess
import numpy as np
from scipy.io import wavfile
from synth import Track, SR, lp, hz, t, env

HERE = os.path.dirname(os.path.abspath(__file__)); REELS = os.path.join(HERE, '..')
FPS = 30; BPM = 120; BEAT = 60 / BPM; FPB = int(FPS * BEAT)   # 15 إطار للنبضة

def phrases(hook):
    parts = [p.strip() for p in re.split(r'(?<=[.،:؟?])\s+', hook) if p.strip()]
    out = []
    for p in parts:                                   # دمج القطع القصيرة جدًا
        if out and len(out[-1]) < 18: out[-1] += ' ' + p
        else: out.append(p)
    while len(out) > 3: out[-2] += ' ' + out.pop()
    return out

def plan(d):
    ph = phrases(d['hook']); k = len(d['flow'])
    secs = [['intro', 2, {}]]
    for i, p in enumerate(ph): secs.append(['phrase', 4 if len(p) < 45 else 6, {'text': p, 'i': i}])
    secs += [['problemTitle', 2, {}], ['problem', 6, {}], ['flow', k + 3, {}], ['code', 8, {}], ['built', 7, {}], ['progress', 4, {}], ['cta', 10, {}]]
    return secs

# ── آلات إضافية حماسية ──
def supersaw(T, midis, dur, cutoff=3200):
    n = int(dur * SR); x = t(n); s = np.zeros(n)
    for m in midis:
        for det in (-.12, -.05, 0, .06, .13):
            f = hz(m + det); ph = T.rng.random()
            s += 2 * ((x * f + ph) % 1) - 1
    return lp(s, cutoff) / (len(midis) * 5) * env(n, .005, .08)

def pump(n, beat_samples, depth=.75):
    """تنفّس الطبقات مع الكيك (sidechain)"""
    ph = (np.arange(n) % beat_samples) / beat_samples
    return 1 - depth * np.exp(-ph * 9)

def build(day, d):
    P = plan(d); total_beats = sum(b for _, b, _ in P); secs = total_beats * BEAT + 1.2
    T = Track(secs, seed=100 + day)
    key = [0, 2, -3, 5, -2, 3, -5][day % 7]
    PROG = [[62, 65, 69], [58, 62, 65], [65, 69, 72], [60, 64, 67]]          # Dm Bb F C
    ROOTS = [38, 34, 41, 36]
    starts = np.cumsum([0] + [b for _, b, _ in P])[:-1]
    kinds = {}
    for (kind, b, _), s0 in zip(P, starts):
        for q in range(b): kinds[s0 + q] = kind
    bs = int(BEAT * SR)
    bed_L = np.zeros(T.n); bed_R = np.zeros(T.n)
    for q in range(total_beats):
        at = q * BEAT; kind = kinds[q]; bar = q // 4; chord = [c + key for c in PROG[bar % 4]]; root = ROOTS[bar % 4] + key
        breakdown = kind in ('problemTitle', 'problem')
        intro = kind == 'intro'
        # كيك
        if not intro and not (breakdown and q % 2): T.add(T.kick(1.1 if not breakdown else .8), at, 1.0)
        # تصفيق
        if not intro and not breakdown and q % 2 == 1: T.add(T.clap(), at, 1.0, .1)
        # هاي هات
        if not intro and not breakdown:
            T.add(T.hat(True), at + BEAT / 2, .9, .3); T.add(T.hat(), at + BEAT / 4, .5, -.3); T.add(T.hat(), at + 3 * BEAT / 4, .5, -.3)
        # بيس ثُمنيات
        for e in range(2):
            m = root + (12 if e else 0)
            bass = T.pluck(m, .3, .12, .9)
            if not intro: T.add(bass, at + e * BEAT / 2, .9 if not breakdown else .5)
        # كوردات ضخمة (supersaw) بتتنفس مع الكيك
        if q % 2 == 0:
            st = supersaw(T, chord + [chord[0] + 12], BEAT * 2, 1200 if breakdown else (2000 if intro else 4200))
            i0 = int(at * SR); bed_L[i0:i0 + len(st)] += st[: T.n - i0]; bed_R[i0:i0 + len(st)] += st[: T.n - i0]
        # لحن أربيجيو سريع
        if kind in ('flow', 'code', 'built', 'progress', 'cta', 'phrase'):
            seq = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 24]
            for e in range(4): T.add(T.pluck(seq[e], .2, .08, 1.0), at + e * BEAT / 4, .22, .5 if e % 2 else -.5)
    pm = pump(T.n, bs, .7)
    T.L += bed_L * pm * .55; T.R += bed_R * pm * .55
    # مؤثرات على حدود الأقسام
    for (kind, b, _), s0 in zip(P, starts):
        at = s0 * BEAT
        if kind == 'intro':
            T.add(T.riser(.9), 0, .7)
        else:
            w = T.whoosh(.4, True); T.add(w, at - .38, .7, -.3); T.add(w, at - .38, .7, .3)
            T.add(T.impact(.7 if kind not in ('phrase',) else .5), at, .7)
        if kind == 'phrase' and _['i'] == 0: T.add(T.impact(1.2), at, 1.0)          # الانفجار بعد المقدمة
        if kind == 'problemTitle': T.add(T.impact(1.1), at, 1.0)
        if kind == 'flow':
            for i in range(len(d['flow'])): T.add(T.bell(86 + key + [0, 3, 5, 7, 10][i], .8), at + (1 + i) * BEAT, .35)
        if kind == 'code':
            tt = at + BEAT * .5
            while tt < at + BEAT * 6.5: T.add(T.key(), tt, .4, T.rng.uniform(-.5, .5)); tt += 1.5 / FPS
        if kind == 'progress':
            for i, m in enumerate([86, 90, 93, 98]): T.add(T.bell(m + key, 1.6), at + BEAT + i * .06, .35, (-.5, -.2, .2, .5)[i])
        if kind == 'cta':
            T.add(T.riser(BEAT * 2), at - BEAT * 2 + .05, .0)
    # لفّة طبول قبل الدعوة
    cta_at = starts[-1] * BEAT
    for i in range(8): T.add(T.clap(), cta_at - BEAT * 2 + i * BEAT / 4, .35 + i * .08)
    T.add(T.riser(BEAT * 4), starts[[k for k, _, _ in P].index('flow')] * BEAT - BEAT * 4, .6)
    mix = T.master(secs, wet=.16)
    mix = np.tanh(mix / (np.max(np.abs(mix)) + 1e-9) * 1.8)
    mix = mix / np.max(np.abs(mix)) * 10 ** (-.8 / 20)
    out = os.path.join(REELS, 'public', 'audio', 'energy', f'day-{day:02d}.wav'); os.makedirs(os.path.dirname(out), exist_ok=True)
    wavfile.write(out, SR, (mix * 32767).astype(np.int16))
    return P, total_beats

if __name__ == '__main__':
    D = json.load(open(os.path.join(REELS, '..', '..', 'days.json'), encoding='utf-8'))
    dd = json.loads(subprocess.run(['node', '-e', "console.log(JSON.stringify(require(process.argv[1])))", os.path.join(REELS, '..', 'design_data.js')], capture_output=True, text=True, check=True).stdout)
    for i, d in enumerate(D): d['hl'] = dd['HL'][i + 1]; d['flow'] = dd['FLOW'][i + 1]
    days = list(range(1, 31)) if sys.argv[1:] == ['all'] else [int(a) for a in sys.argv[1:]]
    path = os.path.join(REELS, 'src', 'energyPlan.json'); plans = json.load(open(path)) if os.path.exists(path) else {}
    for day in days:
        P, tb = build(day, D[day - 1])
        plans[str(day)] = {'sections': P, 'beats': int(tb)}
        json.dump(plans, open(path, 'w'), ensure_ascii=False, indent=1)
        print(f'day {day:02d}: {tb} beats = {tb * BEAT:.1f}s')
