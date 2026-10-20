# SmarkForm — Hero video storyboard

1920×1080 · 30 fps · ≈120 s · narrated (Piper `en_US-lessac-high`) + SRT.
**Source of truth: `timeline.py`.** This file mirrors it for review; if they
disagree, `timeline.py` wins.

## Visual language

- Deep-navy animated background (slow brand-blue / cyan / violet glows, faint
  dot grid, vignette). Every scene starts and ends on it, so scenes chain
  seamlessly. The video fades in from black and fades out to black.
- Fonts: **Lato** (Black/Bold/Light) for titles and callouts, **Hack** for code.
- Palette from the logo: blue `#2497f3` → cyan `#24c6d3` gradient accents.
- Forms appear as floating **3D cards** (perspective, slow drift, soft shadow)
  on the right side. The left column holds the section label (top) and the
  feature **callouts** (middle).
- Code is **re-typeset from the docs sources** (crisp at 1080p) and crawls
  **bottom → top on a tilted plane** until it leaves the frame.
- All editor chrome (tabs, Notes, page text) is cropped away. The OS file picker
  and the browser autocomplete popups (one shows a personal email) are cut
  out. A browser-extension badge on the JSON editor is removed with `delogo`.

## Scenes

| # | id | dur (s) | content |
|---|----|---------|---------|
| 1 | hero | 8.0 | Blurred form cards drift in depth. "**Complex HTML forms.**" / "**Without complex JavaScript.**" (gradient) → "Meet" + SmarkForm logo with a light sweep → chips: *Markup-driven* · *JSON in · JSON out* · *No framework · No dependencies* |
| 2 | t1 | 2.6 | **01** — "A profile form, in plain HTML" / "Text, email… and an image field" |
| 3 | profile | 14.0 | Profile_form_with_export: typing (2.2×), avatar set (picker cut), Export, JSON (1.4×); camera pushes toward the JSON |
| 4 | profile_html | 6.0 | HTML crawl (type_image.md `image_basic_html`) |
| 5 | profile_css | 4.2 | CSS crawl (`image_basic_css`) |
| 6 | init | 5.2 | The one JS statement, typed out large |
| 7 | t2 | 2.6 | **02** — "Nested data, at any depth" / "Groups → students → grades" |
| 8 | students | 19.9 | Students_grades: build group/students/grades (4×), fold/unfold (1.5×), drag Lisa from Class A to B, grades included (1.6×) |
| 9 | students_html | 6.0 | HTML crawl (showcase.md `school_groups_example`) |
| 10 | t3 | 2.6 | **03** — "Complex grids, zero tedium" / "Periods → services → time slots" |
| 11 | hotel | 20.7 | Hotel_schedules: ✨ duplicate period (1.1×), date pickers (7×), extra pool slot (3×), Export → JSON (2×); card dollies up to show the JSON |
| 12 | hotel_html | 6.5 | HTML crawl (`nested_schedule_table` + `#periodItem` + `#scheduleRow` templates; the optional date-prefill `<script>` body is abbreviated with a comment) |
| 13 | more | 13.6 | "…and there's much more to explore": nine feature tiles on a gently tilted plane, each revealed (with a brief cyan glow) as the narration names it; staggered exit |
| 14 | outro | 8.5 | Logo, "Easy to write. Cheap to maintain. Delightful to use.", `$ npm install smarkform`, smarkform.bitifet.net |

## On-screen text (callouts)

Scene-relative times: in → out.

- **profile**: 0.4–3.6 "Plain HTML fields, enhanced in place" · 3.8–6.9 "The `<img>` itself is the field" · 7.1–8.9 "Click, drop or paste a photo" · 9.1–13.7 "Export → one JSON payload, images included"
- **profile_html**: "Just markup + data-smark attributes"  (chip: HTML)
- **profile_css**: "Your own CSS. No imposed styles"  (chip: CSS)
- **init**: "That's all the JavaScript it takes"  (chip: JS)
- **students**: 0.4–8.2 "Lists inside forms inside lists" · 8.4–12.6 "Fold & unfold with native `<details>`" · 12.8–19.6 "Drag items across lists. Their data moves too"
- **students_html**: "Still just markup"
- **hotel**: 0.4–3.7 "✨ Duplicate an item. No retyping" · 3.9–7.4 "Native date & time pickers, for free" · 7.6–15.0 "Variable item counts at every level" · 15.3–20.4 "Export → the whole grid as clean JSON"
- **hotel_html**: "Repeated parts? Reusable `<template>` mixins"

Feature tiles in **more** (title / subtitle, reveal time):

| at | tile | subtitle |
|----|------|----------|
| 2.25 | 🎬 Audio, video & files | Embedded right in the JSON |
| 3.94 | ⌨️ Context-aware hotkeys | Hold Ctrl to reveal them |
| 5.56 | 🎭 Input masking | Plug in any mask library |
| 6.19 | 🎨 Nullable fields | Colors & radios can be unset |
| 7.39 | 🔗 Auto-wired triggers | By placement, or by context |
| 8.87 | ♿ Accessible by design | Keyboard-first, ARIA filled in |
| 9.40 | 🧭 Path-addressable | Like a filesystem: ../name, * |
| 9.93 | 🤖 AI Skills | Your coding agent speaks it |
| 10.98 | 📦 CDN or npm | Zero dependencies, any stack |

JS shown in the *init* scene:

```js
const myForm = new SmarkForm(
    document.getElementById("myForm")
);
```

## Narration (also in `out/SmarkForm_hero.en.srt`)

| scene | at | line |
|-------|----|------|
| hero | 0.6 | Complex HTML forms, without complex JavaScript. |
| hero | 4.6 | Meet SmarkForm. |
| t1 | 0.3 | Start with a simple profile form. |
| profile | 1.6 | Fill it in. The picture is a real field: click, drop, or paste an image. |
| profile | 8.8 | Then export everything, image included, as one single JSON payload. |
| profile_html | 0.5 | Behind it: plain HTML, with data smark attributes. |
| profile_css | 0.3 | Your own CSS. |
| init | 0.4 | And one single line of JavaScript. |
| t2 | 0.3 | Need nested data? |
| students | 0.8 | Lists nest inside forms, inside lists, to any depth. |
| students | 8.6 | Fold what you don't need. |
| students | 13.0 | Even drag a student to another group. Grades included. |
| students_html | 0.6 | Still, just markup. |
| t3 | 0.3 | Complex grids? |
| hotel | 0.6 | Duplicate a whole period in one click, and only change what differs. |
| hotel | 7.8 | Add as many time slots as you need, at every level. |
| hotel | 15.6 | It all exports as clean JSON. |
| hotel_html | 0.6 | Repeated parts are defined once, as reusable templates. |
| more | 0.3 | And there's much more to explore. |
| more | 2.5 | Audio and video fields, context-aware hotkeys, masking, nullable fields, auto-wired triggers, accessibility, AI skills, and zero dependencies. |
| outro | 0.8 | SmarkForm. Easy to write, cheap to maintain, delightful to use. |

("data smark" is spelled that way so the TTS says *data-smark* correctly.)
