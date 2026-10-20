"""Single source of truth for the SmarkForm hero video.

Every clip cut, scene duration, on-screen text and narration line lives here.
prep.py, codeimg.py, voice.py and render.py all import it, and STORYBOARD.md
mirrors it for human review.
"""

W, H, FPS = 1920, 1080, 30
VOICE = "en_US-lessac-high"      # piper voice in assets/voices/
VOICE_LENGTH_SCALE = 0.95        # <1 = slightly faster speech

# Brand palette (taken from assets/smarkform_dark.svg)
BLUE = (36, 151, 243)
CYAN = (36, 198, 211)
INK = (7, 11, 24)

# --------------------------------------------------------------------------
# Clips: cut ranges (seconds in the original), per-part speed, crop of the
# original frame (w, h, x, y).  Parts are joined with a short crossfade.
# --------------------------------------------------------------------------
XFADE = 0.30
CLIPS = {
    "profile": dict(
        src="Profile_form_with_export.mp4", crop=(654, 466, 6, 80),
        delogo=(617, 429, 27, 27),   # browser-extension badge (crop coords)
        parts=[(1.5, 17.9, 2.2),      # cleared form, typing name/email/bio, click avatar
               (21.95, 31.5, 1.4)],   # (OS file picker cut) photo set, Export, JSON scroll
    ),
    "students": dict(
        src="Students_grades.mp4", crop=(492, 462, 0, 0),
        parts=[(3.05, 13.0, 4.0),     # new group, tutor (popup before 3.0 cut)
               (16.0, 19.5, 4.0),     # first student   (autocomplete popups cut out)
               (22.6, 46.0, 4.0),     # second student, grades
               (45.5, 48.5, 1.5),     # fold / unfold students
               (61.5, 66.0, 1.5),     # unfold classes
               (66.0, 77.5, 1.6)],    # drag Lisa from Class A to Class B
    ),
    "hotel": dict(
        src="Hotel_schedules.mp4", crop=(664, 1062, 0, 0),
        delogo=(619, 1034, 27, 27),
        parts=[(3.6, 8.2, 1.1),       # duplicate period (sparkles button)
               (8.2, 36.0, 7.0),      # fast-forward: date pickers
               (36.0, 60.0, 3.0),     # extra pool interval
               (61.0, 72.0, 2.0)],    # Export -> JSON
    ),
}

# --------------------------------------------------------------------------
# Scenes (played back to back; each one fades through the shared background)
# Times inside a scene are scene-relative seconds.
# --------------------------------------------------------------------------
SCENES = [
    dict(id="hero", kind="hero", dur=8.0,
         title="Complex HTML forms.",
         title2="Without complex JavaScript.",
         chips=["Markup-driven", "JSON in · JSON out", "No framework · No dependencies"]),

    dict(id="t1", kind="title", dur=2.6, num="01",
         title="A profile form, in plain HTML",
         sub="Text, email… and an image field"),

    dict(id="profile", kind="demo", clip="profile", dur=None,   # dur = clip length
         label="01 · Profile form",
         card_h=680, ry=-14, rx=4,
         camera=[(0.0, 1.00, .5, .5), (9.0, 1.00, .5, .5),
                 (10.4, 1.22, .38, .70), (14.0, 1.22, .38, .70)],
         hints=[(0.4, 3.6, "Plain HTML fields,\nenhanced in place"),
                (3.8, 6.9, "The <img> itself\nis the field"),
                (7.1, 8.9, "Click, drop or paste\na photo"),
                (9.1, 13.7, "Export → one JSON\npayload, images included")]),

    dict(id="profile_html", kind="code", code="profile.html", lang="html", dur=6.0,
         label="01 · Profile form", chip="HTML",
         hints=[(0.4, 5.6, "Just markup +\ndata-smark attributes")]),

    dict(id="profile_css", kind="code", code="profile.css", lang="css", dur=4.2,
         label="01 · Profile form", chip="CSS",
         hints=[(0.3, 3.9, "Your own CSS.\nNo imposed styles")]),

    dict(id="init", kind="init", dur=5.2,
         label="01 · Profile form", chip="JS",
         hints=[(1.6, 4.9, "That's all the JavaScript\nit takes")]),

    dict(id="t2", kind="title", dur=2.6, num="02",
         title="Nested data, at any depth",
         sub="Groups → students → grades"),

    dict(id="students", kind="demo", clip="students", dur=None,
         label="02 · Student grades",
         card_h=840, ry=-13, rx=4,
         camera=[(0.0, 1.0, .5, .5)],
         hints=[(0.4, 8.2, "Lists inside forms\ninside lists"),
                (8.4, 12.6, "Fold & unfold with\nnative <details>"),
                (12.8, 19.6, "Drag items across lists.\nTheir data moves too")]),

    dict(id="students_html", kind="code", code="students.html", lang="html", dur=6.0,
         label="02 · Student grades", chip="HTML",
         hints=[(0.4, 5.6, "Still just markup")]),

    dict(id="t3", kind="title", dur=2.6, num="03",
         title="Complex grids, zero tedium",
         sub="Periods → services → time slots"),

    dict(id="hotel", kind="demo", clip="hotel", dur=None,
         label="03 · Hotel schedules",
         card_h=960, ry=-12, rx=3,
         camera=[(0.0, 1.0, .5, .5)],
         # (t, card scale multiplier, vertical offset px): lift the card to read the JSON
         dolly=[(0.0, 1.0, 0), (15.6, 1.0, 0), (17.0, 1.42, -300), (20.8, 1.42, -300)],
         hints=[(0.4, 3.7, "✨ Duplicate an item.\nNo retyping"),
                (3.9, 7.4, "Native date & time\npickers, for free"),
                (7.6, 15.0, "Variable item counts\nat every level"),
                (15.3, 20.4, "Export → the whole grid\nas clean JSON")]),

    dict(id="hotel_html", kind="code", code="hotel.html", lang="html", dur=6.5,
         label="03 · Hotel schedules", chip="HTML",
         hints=[(0.4, 6.1, "Repeated parts?\nReusable <template> mixins")]),

    dict(id="outro", kind="outro", dur=8.5,
         tagline="Easy to write. Cheap to maintain. Delightful to use.",
         install="npm install smarkform",
         url="smarkform.bitifet.net"),
]

# --------------------------------------------------------------------------
# Narration: (scene id, scene-relative start, text).  voice.py checks that no
# line overlaps the next one.
# --------------------------------------------------------------------------
NARRATION = [
    ("hero", 0.6, "Complex HTML forms, without complex JavaScript."),
    ("hero", 4.6, "Meet SmarkForm."),
    ("t1", 0.3, "Start with a simple profile form."),
    ("profile", 1.6, "Fill it in. The picture is a real field: "
                     "click, drop, or paste an image."),
    ("profile", 8.8, "Then export everything, image included, as one single JSON payload."),
    ("profile_html", 0.5, "Behind it: plain HTML, with data smark attributes."),
    ("profile_css", 0.3, "Your own CSS."),
    ("init", 0.4, "And one single line of JavaScript."),
    ("t2", 0.3, "Need nested data?"),
    ("students", 0.8, "Lists nest inside forms, inside lists, to any depth."),
    ("students", 8.6, "Fold what you don't need."),
    ("students", 13.0, "Even drag a student to another group. Grades included."),
    ("students_html", 0.6, "Still, just markup."),
    ("t3", 0.3, "Complex grids?"),
    ("hotel", 0.6, "Duplicate a whole period in one click, and only change what differs."),
    ("hotel", 7.8, "Add as many time slots as you need, at every level."),
    ("hotel", 15.6, "It all exports as clean JSON."),
    ("hotel_html", 0.6, "Repeated parts are defined once, as reusable templates."),
    ("outro", 0.8, "SmarkForm. Easy to write, cheap to maintain, delightful to use."),
]


def scene_durations():
    """Resolve demo-scene durations from the prepared clips' metadata."""
    import json
    out = []
    for s in SCENES:
        d = s["dur"]
        if d is None:
            d = json.load(open(f"work/clips/{s['clip']}.json"))["duration"]
        out.append(d)
    return out


def scene_starts():
    starts, t = {}, 0.0
    for s, d in zip(SCENES, scene_durations()):
        starts[s["id"]] = (round(t * FPS) / FPS, d)
        t += d
    return starts, t
