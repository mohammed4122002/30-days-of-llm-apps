"""نسخة الترند القصيرة من ريل صوتي: بتقص مقاطع من صوت محمد (على حدود المشاهد) وبتعيد توقيت المشاهد والكابشن.
الاستخدام:  python3 scripts/make-short.py 2
بيقرأ: src/voiceDayNN.json و public/audio/voice/day-NN-voice.wav
بيكتب: src/voiceDayNNs.json و public/audio/voice/day-NNs-voice.wav
بعدها:  python3 scripts/gen-voice-mix.py 2s"""
import os, sys, json
import numpy as np
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__)); REELS = os.path.join(HERE, '..')
day = int(sys.argv[1]) if sys.argv[1:] else 2
# المقاطع بزمن الصوت الأصلي (لكل يوم)، والمشاهد اللي بتغطيها
CUTS = {
    2: [(0.0, 9.23), (28.54, 37.02), (55.98, 67.81), (76.23, 84.59), (88.56, 94.27)],
    3: [(0.0, 12.59), (34.65, 46.69), (70.23, 79.95), (84.56, 90.03), (96.44, 103.31), (111.56, 116.78)],
    4: [(0.0, 11.23), (27.12, 38.9), (79.9, 100.31), (100.31, 107.32), (144.42, 149.45)],
    7: [(0.0, 23.7), (60.6, 87.2), (125.3, 132.5), (150.3, 155.78)],
    6: [(0.0, 23.92), (121.27, 145.41), (160.96, 166.99), (189.34, 194.21)],
    5: [(0.0, 6.73), (14.71, 22.64), (28.57, 39.75), (73.73, 85.99), (89.15, 101.22), (147.03, 152.59), (174.29, 175.84)],
}[day]
TAIL = 2.6   # الختام (توقيع محمد)

P = json.load(open(os.path.join(REELS, 'src', f'voiceDay{day:02d}.json'), encoding='utf-8'))
sr, vo = wavfile.read(os.path.join(REELS, 'public', 'audio', 'voice', f'day-{day:02d}-voice.wav'))
vo = vo.astype(np.float64) / 32768

segs, parts, t = [], [], 0.0
fade = int(0.02 * sr)
for a, b in CUTS:
    x = vo[int(a * sr):int(b * sr)].copy()
    x[:fade] *= np.linspace(0, 1, fade); x[-fade:] *= np.linspace(1, 0, fade)
    parts.append(x); segs.append([a, b, round(t, 3)]); t += len(x) / sr
voice = np.concatenate(parts)
wavfile.write(os.path.join(REELS, 'public', 'audio', 'voice', f'day-{day:02d}s-voice.wav'), sr, (voice * 32767).astype(np.int16))

def remap(s):
    for a, b, n in segs:
        if a - 1e-6 <= s < b - 1e-6: return round(n + (s - a), 3)
    return None

scenes = []
for k, a, b in P['scenes']:
    if k == 'outro': continue
    na = remap(a)
    if na is None: continue
    seg = next(sg for sg in segs if sg[0] - 1e-6 <= a < sg[1])
    nb = round(seg[2] + (min(b, seg[1]) - seg[0]), 3)
    scenes.append([k, na, nb, a])
# المشاهد الأقصر من 1.2ث بتندمج باللي قبلها
merged = []
for sc in scenes:
    if merged and sc[2] - sc[1] < 1.2: merged[-1][2] = sc[2]
    else: merged.append(sc)
scenes = merged
end_voice = round(t, 3)
scenes.append(['outro', end_voice, round(end_voice + TAIL, 3), P['scenes'][-1][1]])
pages = []
for pg in P['pages']:
    s0 = remap(pg['s'])
    if s0 is None: continue
    ws = [[w, remap(tt)] for w, tt in pg['w'] if remap(tt) is not None]
    e = remap(min(pg['e'], next(sg[1] for sg in segs if sg[0] - 1e-6 <= pg['s'] < sg[1]) - 0.001))
    pages.append({'s': s0, 'e': e, 'w': ws})
hits = [remap(h) for h in P.get('hits', []) if remap(h) is not None]
out = {'nocap': P.get('nocap', []), 'sound': P.get('sound'), 'captionStyle': P.get('captionStyle'), 'goldWords': P.get('goldWords', []), 'follow': P.get('follow'), 'off': P['off'], 'voiceDur': end_voice, 'end': round(end_voice + P['off'] + TAIL, 3), 'pro': P.get('pro', False),
       'segments': segs, 'scenes': scenes, 'pages': pages, 'hits': hits}
json.dump(out, open(os.path.join(REELS, 'src', f'voiceDay{day:02d}s.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('short', end_voice, 's voice,', len(scenes), 'scenes,', len(pages), 'pages')
for sc in scenes: print('  ', sc)
