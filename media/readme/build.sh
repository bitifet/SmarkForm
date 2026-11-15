#!/usr/bin/env bash
# Build the README animations into docs/assets/readme/.
#
#   ./build.sh            both
#   ./build.sh field      field_model.svg   (animated SVG, ~0.3 s)
#   ./build.sh nested     nested_data.gif + nested_data-poster.png (capture + GIF, ~1 min)
#
# Requires: python3 + fontTools, ffmpeg, Node with the repo's Playwright
# (npm install at the repo root) and a built dist/SmarkForm.umd.js.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../../docs/assets/readme
mkdir -p "$OUT"
NODE=${NODE:-node}

field() { python3 field_model.py; }

nested() {
  [ -f ../../dist/SmarkForm.umd.js ] || { echo "run 'npm run build' first"; exit 1; }
  "$NODE" nested_data.mjs
  # variable-rate screenshots -> constant 10 fps -> 2-pass palette GIF
  ffmpeg -v error -y -f concat -safe 0 -i work/nested_data/frames.txt -filter_complex \
    "fps=10,scale=880:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    "$OUT/nested_data.gif"
  # Use a populated form/JSON frame as the static 404 and reduced-motion poster.
  ffmpeg -v error -y -i "$OUT/nested_data.gif" -vf "select='eq(n,180)'" \
    -vsync 0 -frames:v 1 "$OUT/nested_data-poster.png"
  ls -la "$OUT/nested_data.gif" "$OUT/nested_data-poster.png"
}

case "${1:-all}" in
  all)    field; nested ;;
  field)  field ;;
  nested) nested ;;
  *) echo "unknown target $1"; exit 1 ;;
esac
