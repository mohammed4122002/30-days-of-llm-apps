"""تعليق صوتي عربي للريل 0 بـ Piper (صوت ar_JO-kareem المفتوح المصدر)، ممزوج مع الموسيقى.
كل جملة بتبدأ مع مشهدها، وسرعتها بتتضبط لتخلص قبل الانتقال، والموسيقى بتنخفض تلقائيًا وقت الكلام.

الاستخدام:
  pip install piper-tts numpy scipy
  VOICE_MODEL=<مسار ar_JO-kareem-medium.onnx> python3 scripts/gen-voice.py
النموذج: https://huggingface.co/rhasspy/piper-voices/tree/main/ar/ar_JO/kareem/medium
الناتج: public/audio/reel0-vo.wav (الموسيقى + الصوت)، و public/audio/reel0-voice.wav (الصوت لحاله)."""
import os, subprocess, tempfile, json, math
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(HERE, '..', 'public', 'audio')
MODEL = os.environ['VOICE_MODEL']
SR = 48000; FPS = 30
TIMING = os.path.join(HERE, '..', 'src', 'timing.json')
BASE = [150, 165, 150, 135, 180, 105, 165]      # أقل مدة لكل مشهد (حركات المشهد محسوبة عليها)
TR = 18

# جملة لكل مشهد: (النص، تأخير بعد بداية المشهد بالثواني)
LINES = [
    ('ثلاثين يوم أتمتة، خلصت. والجاية أكبر.', 0.35),
    ('بنيت ثلاثين أتمتة حقيقية، من الإيميل للوكلاء الأذكياء.', 0.30),
    ('وأهم درس: الاستمرار أهمّ من الكمال.', 0.35),
    ('بس ضلّ سؤال براسي: شو بيصير جوّا الذكاء الاصطناعي؟', 0.25),
    ('عشان هيك بلّشت تحدّي جديد: ثلاثين يوم ذكاء اصطناعي، بالعربي.', 0.30),
    ('أول يوم: الثلاثاء، تسعة الصبح.', 0.30),
    ('إذا ناوي تمشي معي، اكتب معك بالتعليقات، وتابعني.', 0.40),
]

def tts(text, length_scale):
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: path = f.name
    subprocess.run(['python3', '-m', 'piper', '-m', MODEL, '-f', path, '--length-scale', str(length_scale), '--sentence-silence', '0.15'],
                   input=text.encode(), check=True, capture_output=True)
    sr, x = wavfile.read(path); os.remove(path)
    x = x.astype(np.float32) / 32768.0
    if x.ndim > 1: x = x.mean(1)
    x = resample_poly(x, SR, sr)
    # قصّ الصمت بالأطراف
    idx = np.where(np.abs(x) > 0.01)[0]
    return x[max(0, idx[0] - 600): idx[-1] + 2400] if len(idx) else x

def polish(x):
    x = sosfilt(butter(2, 90, 'high', fs=SR, output='sos'), x)                         # إزالة الهمهمة المنخفضة
    pres = sosfilt(butter(2, [2500, 5000], 'band', fs=SR, output='sos'), x)            # وضوح أكثر
    x = x + 0.35 * pres
    env = np.convolve(np.abs(x), np.ones(480) / 480, 'same')                           # ضاغط بسيط
    gain = np.minimum(1, (0.12 / np.maximum(env, 1e-4)) ** 0.5)
    x = x * gain
    return x / (np.max(np.abs(x)) + 1e-9) * 0.9

# 1) نولّد الجمل بسرعة طبيعية
SPEED = float(os.environ.get('VOICE_SPEED', '0.95'))
clips = [polish(tts(text, SPEED)) for text, _ in LINES]
# 2) نمدّد المشاهد لتتسع للكلام (المشهد لازم يخلص كلامه قبل ما يبلش الانتقال)
scenes = []
for i, ((text, delay), x) in enumerate(zip(LINES, clips)):
    tail = 1.3 if i == len(LINES) - 1 else 0.35
    need = math.ceil((delay + len(x) / SR + tail) * FPS) + (0 if i == len(LINES) - 1 else TR)
    scenes.append(max(BASE[i], need))
json.dump({'scenes': scenes, 'transition': TR}, open(TIMING, 'w'), indent=2)
starts = [0]
for d in scenes[:-1]: starts.append(starts[-1] + d - TR)
END = starts[-1] + scenes[-1]
print('scenes', scenes, f'total {END / FPS:.1f}s')
# 3) نعيد توليد الموسيقى على التوقيت الجديد
subprocess.run(['python3', os.path.join(HERE, 'gen-music.py')], check=True)
total = int(END / FPS * SR)
voice = np.zeros(total)
for i, ((text, delay), x) in enumerate(zip(LINES, clips)):
    i0 = int((starts[i] / FPS + delay) * SR); voice[i0:i0 + len(x)] += x[: total - i0]
    print(f'line {i + 1}: {len(x) / SR:.2f}s')

sr, music = wavfile.read(os.path.join(AUD, 'reel0.wav'))
music = music.astype(np.float32) / 32768.0
music = music[:total] if len(music) >= total else np.pad(music, ((0, total - len(music)), (0, 0)))

# خفض الموسيقى وقت الكلام (ducking) بانتقال ناعم
act = (np.convolve(np.abs(voice), np.ones(2400) / 2400, 'same') > 0.02).astype(np.float32)
k = int(0.25 * SR); act = np.convolve(act, np.ones(k) / k, 'same')
duck = 1 - 0.62 * np.clip(act, 0, 1)
v2 = np.stack([voice, voice], 1)
mix = music * duck[:, None] * 0.95 + v2 * 0.8
mix = np.tanh(mix * 1.1)
mix = mix / np.max(np.abs(mix)) * 10 ** (-1 / 20)
wavfile.write(os.path.join(AUD, 'reel0-vo.wav'), SR, (mix * 32767).astype(np.int16))
wavfile.write(os.path.join(AUD, 'reel0-voice.wav'), SR, (np.clip(voice, -1, 1) * 32767).astype(np.int16))
print('saved reel0-vo.wav and reel0-voice.wav')
