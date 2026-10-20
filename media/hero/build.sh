#!/usr/bin/env bash
# End-to-end build of the SmarkForm hero video.
#
#   ./setup.sh            once: venv with piper-tts + voice models (git-ignored)
#   ./build.sh            full build (prep -> code -> voice -> scenes -> master -> exports -> gif)
#   ./build.sh scenes hero profile   re-render only some scenes, then re-assemble
#   ./build.sh assemble   only concat + mux + exports + gif
#   ./build.sh gif        only the README GIF
#   ./build.sh publish    copy the deliverables to docs/assets/hero/
#
# Requires: ffmpeg, python3 (PIL, numpy, pygments, fontTools), .venv with piper-tts
set -euo pipefail
cd "$(dirname "$0")"
JOBS=${JOBS:-4}
ALL_SCENES=$(python3 -c "from timeline import SCENES; print(' '.join(s['id'] for s in SCENES))")

prep()   { python3 prep.py; }
code()   { python3 codeimg.py; }
voice()  { python3 voice.py; }

scenes() {
  local list="${*:-$ALL_SCENES}"
  mkdir -p work/scenes work/logs
  # longest scenes first for better parallel packing
  printf '%s\n' $list | xargs -P "$JOBS" -I{} sh -c 'python3 render.py {} > work/logs/{}.log 2>&1 || { echo "scene {} FAILED"; cat work/logs/{}.log; exit 1; }'
}

assemble() {
  mkdir -p out
  : > work/scenes/list.txt
  for s in $ALL_SCENES; do echo "file '$s.mp4'" >> work/scenes/list.txt; done
  # 1) silent master (stream copy of identical-parameter scene renders)
  ffmpeg -v error -y -f concat -safe 0 -i work/scenes/list.txt -c copy work/master_video.mp4
  # 2) master with narration
  ffmpeg -v error -y -i work/master_video.mp4 -i work/voice/narration.wav \
    -map 0:v -map 1:a -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 192k -shortest out/SmarkForm_hero.mp4
  # 3) silent master (for re-voicing / music later)
  ffmpeg -v error -y -i work/master_video.mp4 -map 0:v -c:v libx264 -crf 18 -preset slow \
    -pix_fmt yuv420p out/SmarkForm_hero_silent.mp4
  # 4) web exports
  ffmpeg -v error -y -i out/SmarkForm_hero.mp4 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart out/SmarkForm_hero_web.mp4
  ffmpeg -v error -y -i out/SmarkForm_hero.mp4 -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
    -deadline good -cpu-used 2 -c:a libopus -b:a 96k out/SmarkForm_hero.webm
  # 5) poster (logo reveal in the hero)
  ffmpeg -v error -y -ss 6.6 -i out/SmarkForm_hero.mp4 -frames:v 1 -update 1 out/poster.png
  gif
  ls -la out
}

# README GIF: 560x315, 8 fps, one global palette (GitHub/npm strip <video>).
gif() {
  mkdir -p out
  ffmpeg -v error -y -i work/master_video.mp4 -filter_complex \
    "fps=8,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    out/SmarkForm_hero.gif
}

publish() {
  local dst=../../docs/assets/hero
  mkdir -p "$dst"
  cp out/SmarkForm_hero.mp4 out/SmarkForm_hero_silent.mp4 out/SmarkForm_hero_web.mp4 \
     out/SmarkForm_hero.webm out/SmarkForm_hero.gif out/SmarkForm_hero.en.srt out/poster.png "$dst"/
  ls -la "$dst"
}

case "${1:-all}" in
  all)      prep; code; voice; scenes; assemble ;;
  gif)      gif ;;
  publish)  publish ;;
  prep)     prep ;;
  code)     code ;;
  voice)    voice ;;
  scenes)   shift; scenes "$@"; assemble ;;
  assemble) assemble ;;
  *) echo "unknown step $1"; exit 1 ;;
esac
