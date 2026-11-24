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

## ريلز الأيام الثلاثين (`DayReel`)
كل يوم 7 مشاهد من بيانات الكاروسيل نفسها: الافتتاحية مع صورتك ورقم اليوم، المشكلة، مخطط الفكرة بمسار بيترسم، الكود بينكتب حرف حرف، شو بنينا، الخلاصة مع حلقة التقدم، والدعوة.
الكلمات بتطلع مع الصوت (الافتتاحية والمشكلة والدعوة)، والموسيقى بتتغير من يوم ليوم.
```bash
FONTS_DIR=... ICONS_DIR=... npm run assets                                   # بيانات الأيام (src/days.ts) والأيقونات
VOICE_MODEL=... python3 scripts/gen-day-audio.py 8                            # صوت اليوم 8 وتوقيته (src/dayTimings.json)
npx remotion render src/index.ts Day08 out/day-08.mp4
# ضغط مناسب لإنستغرام (نفس الجودة المرئية، حجم أقل بتلات مرات)
ffmpeg -i out/day-08.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart day-08-ig.mp4
```
- `src/DayReel.tsx`: المشاهد والانتقالات. `scripts/synth.py`: الآلات والمؤثرات. `scripts/gen-day-audio.py`: الصوت والموسيقى والتزامن.
- ملفات الصوت المولّدة (`public/audio/days/`) مش محفوظة بـ git، بتنولّد من جديد بالأمر فوق.

## ريلز «الطاقة» (`EnergyReel`، النسخة المعتمدة)
حوالي 30 ثانية، كل شي على نبضة 120 بالدقيقة: كلمات بتنضرب على الشاشة، قفزات كاميرا، ومضات واهتزاز، وتبديل أسود/ذهبي/سماء.
بدون صوت آلي. موسيقى حماسية مؤلّفة بالكود (كيك، تصفيق، بيس، كوردات بتتنفس، أربيجيو، وانفجار بعد المقدمة).
```bash
python3 scripts/gen-energy.py 8            # الخطة الإيقاعية (src/energyPlan.json) والموسيقى
npx remotion render src/index.ts Energy08 out/energy-08.mp4
```

## ريلز الصوت «برو» (من اليوم 2)
نفس `VoiceReel` تبع اليوم الأول، وفوقه طبقة `src/voicePro.tsx` بتنفعّل بـ `"pro": true` بملف الخطة (`src/voiceDayNN.json`):
- دخول كل مشهد بـ `zoomBlur` + `chromaticAberration` من `@remotion/effects` (داخل `HtmlInCanvas`)، بيخفّوا خلال 9 إطارات.
- ضربات كاميرا على اللحظات القوية (`hits` بالخطة، بزمن الصوت): زووم سريع وانزياح ألوان.
- وهج ذهبي بينبض مع البيس (`useWindowedAudioData` + `visualizeAudio` من `@remotion/media-utils`).
- حبيبات فيلم خفيفة (`public/fx/grain-*.png`).

مشاهد كل يوم بملف لحاله (`src/VoiceDay02.tsx`)، والأدوات المشتركة بـ `src/voiceKit.tsx`.

### نسخة الترند القصيرة (~45 ثانية)
`scripts/make-short.py` بيقص مقاطع من الصوت على حدود المشاهد (القائمة `CUTS` جوّا السكربت) وبيعيد توقيت المشاهد والكابشن والمؤثرات.
```bash
python3 scripts/make-short.py 2          # src/voiceDay02s.json + day-02s-voice.wav
python3 scripts/gen-voice-mix.py 2       # المزج الكامل
python3 scripts/gen-voice-mix.py 2s      # مزج النسخة القصيرة
```

### الرندر
`HtmlInCanvas` بيحتاج متصفح Remotion نفسه (chrome-headless-shell) مع `--gl=swangle` (بدون GPU):
```bash
npx remotion browser ensure     # أو نزّله يدويًا من remotion.media
npx remotion render src/index.ts Voice02 out/voice-02.mp4 --gl=swangle
npx remotion render src/index.ts Voice02Short out/voice-02s.mp4 --gl=swangle
ffmpeg -i out/voice-02.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart day-02-ig.mp4
```
