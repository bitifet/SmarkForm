#!/usr/bin/env bash
# One-time setup of the git-ignored, re-downloadable build dependencies:
#   .venv/           python venv with piper-tts (local neural TTS)
#   assets/voices/   Piper voice models (~115 MB each, from Hugging Face)
# System requirements: ffmpeg, python3 with PIL, numpy, pygments, fontTools
# (and gi + Rsvg only if you need to re-rasterise the logo).
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -x .venv/bin/piper ]; then
  python3 -m venv .venv
  .venv/bin/pip install -q piper-tts
fi
mkdir -p assets/voices
base=https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US
for v in lessac ryan; do
  for ext in onnx onnx.json; do
    f="assets/voices/en_US-$v-high.$ext"
    [ -s "$f" ] || curl -sSL -o "$f" "$base/$v/high/en_US-$v-high.$ext"
  done
done
python3 -c "import PIL, numpy, pygments, fontTools" && echo "setup OK"
