# Analysis & QA contact sheets

Timestamps are burnt into every thumbnail. They document *why* the cuts in
`timeline.py` are where they are.

| sheet | purpose |
|-------|---------|
| `<Recording>.png` (6) | 20-thumbnail overview of each original screencast |
| `p_img.png` | profile 16–24 s: avatar click → OS file picker (blank frames, cut) → photo set |
| `p_exp.png` | profile 22–34 s: Export click and JSON scroll |
| `s_a.png`, `s_b.png` | students 0–61 s: building group/students/grades, fold/unfold (from the **redacted** source) |
| `s_move.png` | students 59–84 s: drag of Lisa Simpson from Class A to Class B |
| `s_pop.png` | students 0.8–4.8 s (cropped): when the autocomplete popup appears/closes |
| `s_bounds.png` | students: frames at every cut boundary, verified popup-free |
| `s_scan.png` | students prepared clip scanned at 5 fps: no autocomplete popup leaks |
| `h_clone.png`, `h_a.png` | hotel 0–64 s: period duplication (✨), date pickers, extra pool slot |
| `clip_*.png` | the three prepared clips after `prep.py` |
| `qa_profile.png` | rendered profile scene: entrance, callouts, JSON push-in, exit |
| `final.png` | the assembled v1 master, one frame every 2.5 s |

Note: `src/Students_grades.mp4` is a redacted copy of the raw recording — the
browser autocomplete popup (a personal e-mail) is blurred at 1.6–3.04 s,
13.8–15.95 s and 19.8–21.5 s. Those intervals are cut from the video anyway;
timestamps were preserved (`-fps_mode passthrough`) so the prepared clip is
identical (PSNR ≥ 48.9 dB vs. the raw source).
