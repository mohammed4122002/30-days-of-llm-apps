"""يبني carousel.pdf من صور الشرائح (slide-1.jpg ...) صفحة صورة كاملة لكل شريحة.
ليش؟ الـ PDF المطبوع من المتصفح فيه شفافية وظلال ناعمة، ولينكدإن بيرسمها بقع سودا.
الصور بتنحط بالـ PDF بدون إعادة ضغط (img2pdf)، فالجودة نفسها والحجم أصغر.
الاستخدام: python3 tools/pdf_from_slides.py <مجلد فيه assets/slide-*.jpg> [...]"""
import sys, os, re, img2pdf

for d in sys.argv[1:]:
    a = os.path.join(d, 'assets')
    slides = sorted((f for f in os.listdir(a) if re.fullmatch(r'slide-\d+\.jpg', f)), key=lambda f: int(re.findall(r'\d+', f)[0]))
    with open(os.path.join(d, 'carousel.pdf'), 'wb') as out:
        out.write(img2pdf.convert([os.path.join(a, s) for s in slides]))
    print(d, len(slides), 'pages')
