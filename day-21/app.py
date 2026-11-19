from transformers import pipeline

clf = pipeline("text-classification", model="CAMeL-Lab/bert-base-arabic-camelbert-da-sentiment")
for t in ["الخدمة ممتازة وسريعة", "تجربة سيئة جدًا ولن أكررها", "وصل الطلب أمس"]:
    print(t, "→", clf(t)[0])
