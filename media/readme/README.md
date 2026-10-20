# README animations — sources & build

Small animations embedded in the repository `README.md`, which GitHub and npm
display as images (`<video>` is stripped there). Outputs go to `docs/assets/readme/`.

| output | README section | source |
|--------|----------------|--------|
| `field_model.svg` | *Everything is a field* | `field_model.py` |
| `nested_data.gif` | *Nested data and dynamic lists* | `nested_data.html` + `nested_data.mjs` |

## `field_model.svg`

An animated SVG version of the ASCII diagram. Nodes light up in the same order
the README text explains them, then the "forms and lists are fields too" loop
closes the cycle (15 s, looping).

- Text is converted to vector paths with fontTools (Lato/Hack from
  `../hero/assets/fonts/`). Images in `<img>` can't load web fonts, so this keeps
  the rendering identical on GitHub, npm and the docs.
- It uses its own dark card, so it works on light and dark themes.
- It's pure CSS animation (no SMIL, no script), so it survives GitHub's image
  proxy. It also honours `prefers-reduced-motion`.

## `nested_data.gif`

A real browser capture of the **README snippet itself**, running against the
built `dist/SmarkForm.umd.js`. The only additions are placeholders and styling.
A scripted user fills in a school, adds a student and a second group, and the
right pane shows `form.export()` live, with changed lines briefly highlighted.
It complements the hero video's *students* scene with a different angle (the
JSON updating live), rather than repeating it.

`nested_data.mjs` screenshots continuously and records real timestamps; ffmpeg
rebuilds a constant 10 fps animation from them. The cursor is a synthetic overlay
(headless browsers draw none). Frames live in the git-ignored `work/`.

## Rebuild

```bash
npm run build                 # at the repo root, if dist/ is missing or stale
./build.sh                    # both, or: ./build.sh field | ./build.sh nested
node svg_stills.mjs ../../docs/assets/readme/field_model.svg /tmp/f 3 11.5   # QA stills
```

`build.sh` uses `node` from `PATH` (override with `NODE=/path/to/node`).
Playwright resolves its browsers from `PLAYWRIGHT_BROWSERS_PATH` if they are not
in the default cache.
