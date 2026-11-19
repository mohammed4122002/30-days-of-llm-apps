import evaluate

acc, f1 = evaluate.load("accuracy"), evaluate.load("f1")
y_true = [1, 0, 1, 1, 0, 0]
base_pred = [1, 1, 1, 0, 0, 1]
tuned_pred = [1, 0, 1, 1, 0, 1]
for name, pred in [("الأساسي", base_pred), ("المضبوط", tuned_pred)]:
    print(name, acc.compute(predictions=pred, references=y_true), f1.compute(predictions=pred, references=y_true))
