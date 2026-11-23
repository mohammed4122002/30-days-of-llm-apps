# ريلز إنستغرام (Remotion)

مشروع React لتوليد ريلز السلسلة بهوية Mohammed Abu Saada: فيديو عمودي 1080×1920، 30 إطار بالثانية.

## التشغيل
```bash
cd tools/reels
npm install
# مرة وحدة: نسخ الخطوط والصور وتجهيز الأيقونات
FONTS_DIR=<node_modules/@fontsource/> ICONS_DIR=<node_modules/> npm run assets
# معاينة تفاعلية بالمتصفح
npm run studio
# إخراج الريل 0
npx remotion render src/index.ts Reel0 out/reel-00.mp4
```
إذا ما في Chrome على الجهاز، Remotion بينزّل نسخته تلقائيًا. أو حدّد متصفح موجود بـ `--browser-executable=<المسار>`.

## الملفات
- `src/brand.tsx`: الهوية (الألوان، الخطوط، الأيقونات، الخلفيات، النص اللي بيطلع كلمة كلمة، الانتقالات الضوئية).
- `src/Reel0.tsx`: الريل 0 (منشور الانتقال)، 7 مشاهد مع انتقالات `@remotion/transitions`.
- `scripts/gen-music.py`: الموسيقى والمؤثرات.
- `scripts/gen-voice.py`: التعليق الصوتي والمزج.
- `src/timing.json`: مدة كل مشهد.
- `scripts/gen-assets.js`: بيولّد `src/assets.ts` (أيقونات Phosphor وشعارات Simple Icons) وبينسخ الخطوط والصور لـ `public/`.

## الصوت
`scripts/gen-music.py` بيألّف موسيقى أصلية بالكود (بدون عينات خارجية، فما في مشاكل حقوق نشر)، متزامنة مع توقيت المشاهد:
بيانو هادئ بالافتتاحية، إيقاع وأربيجيو مع n8n والدروس، انقطاع درامي بمشهد السؤال، ذروة بالتحدي الجديد، وخاتمة دافئة.
ومعها مؤثرات: نسمات (whoosh) بين المشاهد، تكّات العدّاد، رنين عند علامة الصح والإبراز، وتصاعد قبل «الثلاثاء».
```bash
pip install numpy scipy
python3 scripts/gen-music.py   # بيطلع public/audio/reel0.wav
```
## التعليق الصوتي
`scripts/gen-voice.py` بيقرأ جملة لكل مشهد بصوت عربي مفتوح المصدر (Piper، صوت `ar_JO-kareem`) بسرعة طبيعية،
وبيمدّد المشاهد بـ `src/timing.json` لتتسع للكلام، وبيعيد توليد الموسيقى على التوقيت الجديد، وبيخفّض الموسيقى وقت الكلام.
```bash
pip install piper-tts numpy scipy
# نزّل ar_JO-kareem-medium.onnx و .onnx.json من:
# https://huggingface.co/rhasspy/piper-voices/tree/main/ar/ar_JO/kareem/medium
VOICE_MODEL=<المسار>/ar_JO-kareem-medium.onnx python3 scripts/gen-voice.py
npx remotion render src/index.ts Reel0 out/reel-00.mp4
```
النصوص موجودة بـ `LINES` جوّا السكربت. ترخيص بيانات الصوت محدد بمصدره (https://github.com/AliMokhammad/arabicttstrain)، فراجعه قبل أي استخدام تجاري.

توقيت المشاهد بملف واحد `src/timing.json`، والفيديو والموسيقى والصوت كلهم بيقرؤوا منه.

## الترخيص
Remotion مجاني للأفراد والشركات الصغيرة (لحد 3 أشخاص). الشركات الأكبر بتحتاج رخصة: https://remotion.dev/license
