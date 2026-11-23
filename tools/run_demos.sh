#!/usr/bin/env bash
# بيشغّل كود الأيام ويحفظ المخرجات الحقيقية في tools/demo_outputs/day-XX.txt (للسكريبتات والريلز)
# LLM_BACKEND=local: نموذج محلي مجاني.  LangSmith: LANGSMITH_API_KEY لازم يكون موجود.
ROOT=$(cd "$(dirname "$0")/.." && pwd); OUT=$ROOT/tools/demo_outputs; mkdir -p "$OUT"
export HF_HUB_DISABLE_XET=1 TOKENIZERS_PARALLELISM=false LLM_BACKEND=${LLM_BACKEND:-local} PYTHONWARNINGS=ignore
for d in "$@"; do
  cd "$ROOT/day-$d" || continue
  echo "== day $d start $(date +%T)"
  { echo "\$ python app.py"; printf '\n' | timeout 2400 python3 app.py 2>&1 | grep -vE "Warning|warn\(|warnings\.|it/s\]|Loading weights|^\s*$|unauthenticated|LangGraphDeprecated|create_react_agent|^\s+from |^\s+agent = |Downloading builder"; } > "$OUT/day-$d.txt"
  echo "== day $d done $(date +%T)"
done
echo ALLDONE
