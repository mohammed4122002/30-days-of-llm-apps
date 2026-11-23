"""صوت ريلز الأيام: تعليق صوتي (الافتتاحية، المشكلة، الدعوة) + موسيقى مؤلّفة + مؤثرات متزامنة مع حركات DayReel.tsx.
كمان بيمدّد مشاهد الكلام بـ src/dayTimings.json لتتسع للصوت.

الاستخدام:
  VOICE_MODEL=<ar_JO-kareem-medium.onnx> python3 scripts/gen-day-audio.py 1 8      # أيام محددة
  VOICE_MODEL=... python3 scripts/gen-day-audio.py all                             # الثلاثين
الناتج: public/audio/days/day-NN.wav"""
import os, sys, json, math, re, subprocess, tempfile
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly, butter, sosfilt
from synth import Track, SR

HERE = os.path.dirname(os.path.abspath(__file__))
REELS = os.path.join(HERE, '..')
FPS = 30; TR = 16
BASE = [180, 150, 216, 210, 150, 165, 180]
FLOW_START, FLOW_STEP, TYPE_START, TYPE_END_PAD = 26, 30, 22, 64   # نفس قيم DayReel.tsx
MODEL = os.environ['VOICE_MODEL']

NUM = ['', 'واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'تمانية', 'تسعة', 'عشرة', 'إحدعش', 'اطنعش', 'تلطعش', 'أربعطعش', 'خمسطعش',
       'ستطعش', 'سبعطعش', 'تمنطعش', 'تسعطعش', 'عشرين', 'واحد وعشرين', 'اتنين وعشرين', 'تلاتة وعشرين', 'أربعة وعشرين', 'خمسة وعشرين',
       'ستة وعشرين', 'سبعة وعشرين', 'تمانية وعشرين', 'تسعة وعشرين', 'تلاتين']
# نطق المصطلحات الإنجليزية بحروف عربية، عشان الصوت العربي يقرأها صح
TR_MAP = [('Prompt Injection', 'برومبت إنجكشن'), ('Hugging Face', 'هاغينغ فيس'), ('LangChain', 'لانغ تشين'), ('LangGraph', 'لانغ غراف'),
          ('LangSmith', 'لانغ سميث'), ('Embeddings', 'إمبيدينغز'), ('Dataset', 'داتاسيت'), ('dataset', 'داتاسيت'), ('prompt', 'برومبت'),
          ('Prompt', 'برومبت'), ('demo', 'ديمو'), ('LoRA', 'لورا'), ('RAG', 'راغ'), ('n8n', 'إن إيت إن'), ('AI', 'إيه آي'), ('API', 'إيه بي آي'),
          ('JSON', 'جيسون'), ('PDF', 'بي دي إف'), ('GPU', 'جي بي يو'), ('Agent', 'إيجنت'), ('Router', 'راوتر'), ('Gradio', 'غراديو'), ('Spaces', 'سبيسز'),
          ('FastAPI', 'فاست إيه بي آي'), ('GitHub', 'غيت هب'), ('Qwen', 'كوين'), ('Llama', 'لاما'), ('Chains', 'تشينز'), ('Graphs', 'غرافس'),
          ('Hybrid Search', 'هايبرد سيرتش'), ('BM25', 'بي إم خمسة وعشرين'), ('Python', 'بايثون'), ('Pydantic', 'بايدانتك'), ('FAISS', 'فايس'),
          ('Accuracy', 'أكيوريسي'), ('F1', 'إف ون'), ('Space', 'سبيس'), ('evaluator', 'إيفاليوايتر'), ('MMR', 'إم إم آر'), ('LLM', 'إل إل إم')]
def speakable(s):
    for a, b in TR_MAP: s = s.replace(a, b)
    s = re.sub(r'\b200\b', 'ميتين', s); s = re.sub(r'\b10\b', 'عشرة', s); s = re.sub(r'\b30\b', 'تلاتين', s); s = re.sub(r'\b4\b', 'أربعة', s)
    s = s.replace('«', '').replace('»', '')
    return re.sub(r'[A-Za-z]+', '', s).replace('  ', ' ')

def tts(text, speed=0.82):
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: path = f.name
    subprocess.run(['python3', '-m', 'piper', '-m', MODEL, '-f', path, '--length-scale', str(speed), '--sentence-silence', '0.12'], input=text.encode(), check=True, capture_output=True)
    sr, x = wavfile.read(path); os.remove(path)
    x = x.astype(np.float32) / 32768.0
    if x.ndim > 1: x = x.mean(1)
    x = resample_poly(x, SR, sr); idx = np.where(np.abs(x) > 0.01)[0]
    x = x[max(0, idx[0] - 600): idx[-1] + 2400] if len(idx) else x
    x = sosfilt(butter(2, 90, 'high', fs=SR, output='sos'), x)
    x = x + 0.35 * sosfilt(butter(2, [2500, 5000], 'band', fs=SR, output='sos'), x)
    e = np.convolve(np.abs(x), np.ones(480) / 480, 'same'); x = x * np.minimum(1, (0.12 / np.maximum(e, 1e-4)) ** 0.5)
    return x / (np.max(np.abs(x)) + 1e-9) * 0.9

def hl_frame(hook, hl, start, stagger):
    words = hook.split(' '); hw = hl.split(' '); b = -1
    for i in range(len(words) - len(hw) + 1):
        if words[i:i + len(hw)] == hw: b = i + len(hw) - 1
    return start + (b + 1) * stagger + 8 if b >= 0 else None

def build(day, D):
    d = D[day - 1]
    intro = tts(f'اليوم {NUM[day]}.')
    hook = tts(speakable(d['hook']))
    hook_delay = 1.0 + len(intro) / SR + 0.1
    lines = [(0, None, hook_delay), (1, speakable(d['problem']), 0.6),
             (6, speakable(d['cta']) + ('. وتابعني.' if day < 30 else '. شكرًا إنك كنت معي.'), 0.55)]
    clips = {0: hook, 1: tts(lines[1][1]), 6: tts(lines[2][1])}
    scenes = list(BASE)
    for i, _, delay in lines:
        tail = 1.4 if i == 6 else 0.45
        scenes[i] = max(BASE[i], math.ceil((delay + len(clips[i]) / SR + tail) * FPS) + (0 if i == 6 else TR))
    # كلمات النص بتظهر مع الصوت: بداية كل مشهد كلام (بالإطارات) والفاصل بين الكلمات
    texts = {0: d['hook'], 1: d['problem'], 6: d['cta']}
    sync = {str(i): {'start': round(delay * FPS), 'stagger': round(len(clips[i]) / SR * FPS * 0.9 / max(1, len(texts[i].split(' '))), 2)} for i, _, delay in lines}
    starts = [0]
    for s in scenes[:-1]: starts.append(starts[-1] + s - TR)
    end = starts[-1] + scenes[-1]; secs = end / FPS
    st = [s / FPS for s in starts]
    T = Track(secs, seed=day)
    key = [0, 2, -3, 5, -2, 3, -5][day % 7]
    PROG = [(50, [62, 65, 69, 74]), (46, [58, 62, 65, 70]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67])]
    PROG = [(r + key, [c + key for c in ch]) for r, ch in PROG]
    BEAT = 60 / 96; BAR = BEAT * 4
    sec = lambda tt: max(i for i in range(7) if st[i] <= tt + 1e-6)
    for b in range(int(secs / BAR) + 2):
        t0 = b * BAR
        if t0 > secs: break
        root, ch = PROG[b % 4]; s = sec(t0); dark = s in (1, 3)
        T.add(T.pad(ch, BAR + .9, 1300 if s == 1 else 2600), t0, .5, -.15)
        T.add(T.pad([c + 12 for c in ch[1:3]], BAR + .9, 3200), t0, .05 if dark else .12, .3)
        if s == 0:
            for k, m in enumerate([ch[0] + 12, ch[2] + 12, ch[1] + 12, ch[3] + 12]): T.add(T.piano(m), t0 + k * BEAT, .45, (-.4, .3, -.2, .4)[k])
        for k in range(4):
            bt = t0 + k * BEAT
            if bt >= secs - 1.4: break
            sk = sec(bt)
            if sk >= 2: T.add(T.pluck(root - 12, .6, .32, .5), bt, .5)
            if sk == 1 and k in (0, 2): T.add(T.kick(.55), bt, .5)
            if sk in (2, 6) and k in (0, 2): T.add(T.kick(.75), bt, .8)
            if sk in (3, 4, 5): T.add(T.kick(1.0), bt, .95)
            if sk in (4, 5) and k in (1, 3): T.add(T.clap(), bt, .85, .1)
            if sk in (3, 4, 5): T.add(T.hat(), bt + BEAT / 2, .8, .3)
            if sk in (4, 5): T.add(T.hat(), bt, .5, -.3)
            if sk in (2, 4, 5, 6):
                seq = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12]
                div = 4 if sk in (4, 5) else 2
                for q in range(div):
                    at = bt + q * BEAT / div
                    if at < secs - 1.2: T.add(T.pluck(seq[(k * div + q) % 4] + (12 if q % 2 else 0), .4, .16), at, .2, .4 if q % 2 else -.4)
    # المؤثرات
    T.add(T.whoosh(.7, False), 0, .5); T.add(T.impact(.9), 20 / FPS, .8)               # رقم اليوم بيوصل
    hf = hl_frame(d['hook'], d['hl'], sync['0']['start'], sync['0']['stagger'])
    if hf:
        for i, m in enumerate([81, 86, 88, 93]): T.add(T.bell(m + key, 1.3), hf / FPS + i * .06, .25, (-.5, -.1, .2, .5)[i])
    for s in st[1:]:
        w = T.whoosh(.55, True); T.add(w, s - .5, .6, -.3); T.add(w, s - .5, .6, .3); T.add(T.impact(.3), s, .35)
    T.add(T.whoosh(.9, False), st[1] + 8 / FPS, .35)                                    # خط المسح بالمشكلة
    for i in range(len(d['flow'])):
        T.add(T.bell(74 + key + [0, 3, 5, 7, 10][i] + 12, 1.1), st[2] + (FLOW_START + FLOW_STEP * i) / FPS, .3, (-.4, .4, -.2, .2, 0)[i])
    a, bq = st[3] + TYPE_START / FPS, st[3] + (scenes[3] - TYPE_END_PAD) / FPS
    tt = a
    while tt < bq:
        T.add(T.key(), tt, .35 + .25 * T.rng.random(), T.rng.uniform(-.4, .4)); tt += (2 + T.rng.integers(0, 2)) / FPS
    for i in range(3): T.add(T.whoosh(.3, False), st[4] + (14 + i * 14) / FPS, .4, (-.4, .4, -.4)[i])
    for i in range(8): T.add(T.tick(84 + i), st[5] + (10 + i * 5) / FPS, .35)
    T.add(T.bell(93 + key, 2.0), st[5] + 52 / FPS, .45); T.add(T.bell(86 + key, 2.0), st[5] + 52 / FPS, .3, -.3)
    if day == 30:
        T.add(T.impact(1.0), st[5] + 52 / FPS, .9)
        for i, m in enumerate([86, 90, 93, 98, 102]): T.add(T.bell(m, 2.4), st[5] + 52 / FPS + i * .08, .3, (-.6, -.3, 0, .3, .6)[i])
    for k in range(4): T.add(T.tick(91 + k * 2), st[6] + (46 + k * 6) / FPS, .45)
    for i, m in enumerate([62, 69, 74, 81]): T.add(T.bell(m + 12 + key, 2.4), secs - 2.8 + i * .12, .2, (-.5, -.2, .2, .5)[i])
    music = T.master(secs)
    # الصوت + خفض الموسيقى وقت الكلام
    total = len(music); voice = np.zeros(total)
    i0 = int(1.0 * SR); voice[i0:i0 + len(intro)] += intro
    for i, _, delay in lines:
        i0 = int((st[i] + delay) * SR); x = clips[i]; voice[i0:i0 + len(x)] += x[: total - i0]
    act = (np.convolve(np.abs(voice), np.ones(2400) / 2400, 'same') > 0.02).astype(np.float32)
    k = int(.25 * SR); act = np.convolve(act, np.ones(k) / k, 'same')
    music = music / (np.max(np.abs(music)) + 1e-9) * 0.7
    mix = music * (1 - 0.62 * np.clip(act, 0, 1))[:, None] + np.stack([voice, voice], 1) * 0.85
    mix = np.tanh(mix * 1.1); mix = mix / np.max(np.abs(mix)) * 10 ** (-1 / 20)
    out = os.path.join(REELS, 'public', 'audio', 'days', f'day-{day:02d}.wav'); os.makedirs(os.path.dirname(out), exist_ok=True)
    wavfile.write(out, SR, (mix * 32767).astype(np.int16))
    return scenes, secs, sync

if __name__ == '__main__':
    D = json.load(open(os.path.join(REELS, '..', '..', 'days.json'), encoding='utf-8'))
    dd = json.loads(subprocess.run(['node', '-e', "console.log(JSON.stringify(require(process.argv[1])))", os.path.join(REELS, '..', 'design_data.js')],
                                   capture_output=True, text=True, check=True).stdout)
    for i, d in enumerate(D): d['hl'] = dd['HL'][i + 1]; d['flow'] = dd['FLOW'][i + 1]
    days = list(range(1, 31)) if sys.argv[1:] == ['all'] else [int(a) for a in sys.argv[1:]]
    tpath = os.path.join(REELS, 'src', 'dayTimings.json')
    timings = json.load(open(tpath))
    for day in days:
        scenes, secs, sync = build(day, D)
        timings[str(day)] = {'scenes': scenes, 'audio': True, 'sync': sync}
        json.dump(timings, open(tpath, 'w'), indent=1)
        print(f'day {day:02d}: {secs:.1f}s scenes {scenes}')
