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
- `scripts/gen-assets.js`: بيولّد `src/assets.ts` (أيقونات Phosphor وشعارات Simple Icons) وبينسخ الخطوط والصور لـ `public/`.

الفيديو بدون صوت عن قصد: الصوت (تعليقك الصوتي أو صوت رائج) بينضاف من تطبيق إنستغرام.

## الترخيص
Remotion مجاني للأفراد والشركات الصغيرة (لحد 3 أشخاص). الشركات الأكبر بتحتاج رخصة: https://remotion.dev/license
