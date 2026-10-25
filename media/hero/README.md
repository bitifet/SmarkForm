# SmarkForm hero video — sources & build pipeline

Everything needed to rebuild the landing-page hero video (and the README GIF)
from the raw screencasts. The published deliverables live in
`docs/assets/hero/`; this directory holds the sources, the scripts and the
intermediate artefacts.

## Layout

```
src/                original screencasts (Students_grades.mp4 is a redacted copy, see below)
assets/fonts/       Lato, Hack, Noto Color Emoji (+ LICENSES.md)
assets/*.svg|png    SmarkForm logo (from docs/assets/logo) and its rasterisation
timeline.py         SINGLE SOURCE OF TRUTH: cuts, scene timings, texts, narration
prep.py             cut / crop / retime / delogo the clips    -> work/clips/
codeimg.py          typeset example code from docs/            -> work/code/
voice.py            Piper TTS + timing check + mix + SRT       -> work/voice/, out/*.srt
render.py           frame compositor (PIL + numpy)             -> work/scenes/
build.sh            orchestrates everything (see below)
setup.sh            creates the git-ignored .venv + downloads voice models
STORYBOARD.md       human-readable plan (mirrors timeline.py)

work/clips/         prepared clips (+ .json with duration and part boundaries)
work/code/          syntax-highlighted code PNGs + the extracted source text
work/voice/         narration takes, content-addressed: take_<sha1(voice|speed|text)>.wav
work/voicetest/     the lessac vs. ryan voice A/B samples
work/sheets/        analysis & QA contact sheets (see work/sheets/INDEX.md)
```

Git-ignored (re-creatable): `.venv/`, `assets/voices/` (`./setup.sh`),
`work/scenes/`, `work/master_video.mp4`, `work/voice/narration.wav`, `out/`
(`./build.sh`).

## Rebuild

```bash
./setup.sh                          # once
./build.sh                          # everything (≈40 min on 4 cores; JOBS=4 parallel scenes)
./build.sh scenes hero outro        # re-render some scenes, then re-assemble (+ poster/social card/GIF)
./build.sh voice && ./build.sh assemble   # narration changes only
./build.sh gif                      # README GIF only (needs work/master_video.mp4)
./build.sh social                   # social-preview card only (needs out/poster.png)
./build.sh publish                  # copy out/* to docs/assets/hero/
python3 render.py --still hero 6.5  # QA stills -> work/stills/
```

Scene backgrounds are a function of the *global* time, so after inserting or
resizing a scene, re-render every scene that comes after it.

Change texts/timings in `timeline.py`. If you change clip cuts, run
`./build.sh prep` first and re-check hint times against the new clip durations
(printed by `prep.py`).

Narration takes are cached by content: editing one line only re-synthesises
that line. Piper is not bit-for-bit deterministic, which is why the approved
takes are committed. To swap the voice set `VOICE` in `timeline.py`
(`en_US-ryan-high` is also downloaded). For a human voice-over, use
`SmarkForm_hero_silent.mp4` and the SRT as script and timing reference.

## Deliverables (`out/` → `docs/assets/hero/`)

| file | what |
|------|------|
| `SmarkForm_hero.mp4` | master, H.264 CRF 18 + narration (AAC) |
| `SmarkForm_hero_silent.mp4` | same picture, no audio |
| `SmarkForm_hero_web.mp4` | web-optimised H.264 (`+faststart`), used by docs/index.md |
| `SmarkForm_hero.webm` | VP9 + Opus |
| `SmarkForm_hero.gif` | 560×315, 6 fps, used by the repository README |
| `SmarkForm_hero.en.srt` | narration subtitles |
| `poster.png` | poster frame (logo reveal) |
| `social-card.png` | 1280×640 social-preview card for the docs site and GitHub repository |

## Privacy redaction

The raw `Students_grades.mp4` showed a browser autocomplete popup containing a
personal e-mail address. The committed copy blurs that region at 1.6–3.04 s,
13.8–15.95 s and 19.8–21.5 s (all of them cut from the video anyway) and keeps
the original timestamps, so the prepared clip is unchanged. When recording new
screencasts, disable form autofill first and scan the recording before committing.
