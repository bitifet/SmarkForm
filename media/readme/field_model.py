#!/usr/bin/env python3
"""Animated SVG of the README "Everything is a field" diagram.

Output: ../../docs/assets/readme/field_model.svg

- All text is converted to vector paths (fontTools), so the SVG renders the
  same everywhere: GitHub and npm show README images through <img>, where
  web fonts are not available.
- It has its own dark background, so it reads on light and dark themes.
- Nodes light up in the order the README text describes them, using CSS
  keyframes (one cycle = CYCLE seconds, looping forever).
"""
import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "hero", "assets", "fonts")
OUT = os.path.join(HERE, "..", "..", "docs", "assets", "readme", "field_model.svg")

W, H = 880, 560
CYCLE = 15.0
BLUE, CYAN = "#2497f3", "#24c6d3"
INK, CARD = "#0b1022", "#121a33"
TEXT, MUTED = "#e8edf8", "#9aa8c7"


class Font:
    def __init__(self, name):
        self.f = TTFont(os.path.join(FONTS, name))
        self.cmap = self.f.getBestCmap()
        self.gs = self.f.getGlyphSet()
        self.upm = self.f["head"].unitsPerEm
        self.hmtx = self.f["hmtx"]

    def width(self, text, size):
        s = size / self.upm
        return sum(self.hmtx[self.cmap.get(ord(c), self.cmap[ord("?")])][0] for c in text) * s

    def path(self, text, size, x, y, anchor="middle"):
        """SVG path data for `text` with its baseline at y."""
        s = size / self.upm
        w = self.width(text, size)
        x0 = x - w / 2 if anchor == "middle" else (x - w if anchor == "end" else x)
        pen = SVGPathPen(self.gs)
        cx = x0
        for c in text:
            g = self.cmap.get(ord(c), self.cmap[ord("?")])
            self.gs[g].draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
            cx += self.hmtx[g][0] * s
        return pen.getCommands()


BLACK, BOLD, REG = Font("Lato-Black.ttf"), Font("Lato-Bold.ttf"), Font("Lato-Regular.ttf")
MONO = Font("Hack-Bold.ttf")

# --------------------------------------------------------------- layout
# step: (time it lights up, ...) — the README order:
#  field → composite/value → form→{object} → list→[array] → value types →
#  nested JSON → "forms & lists are fields too" loop
els = []          # (svg markup, step time)


def text(t, font, size, x, y, fill, step, anchor="middle"):
    els.append((f'<path d="{font.path(t, size, x, y, anchor)}" fill="{fill}"/>', step))


def node(cx, cy, w, h, title, sub, step, accent=BLUE, font=BLACK, size=26, mono=False):
    r = h / 2 if h <= 60 else 16
    els.append((f'<rect x="{cx - w/2:.1f}" y="{cy - h/2:.1f}" width="{w}" height="{h}" rx="{r}" '
                f'fill="{CARD}" stroke="{accent}" stroke-width="2.5"/>', step))
    if sub:
        text(title, font, size, cx, cy - 2, TEXT, step)
        text(sub, REG, 16, cx, cy + 22, MUTED, step)
    else:
        f = MONO if mono else font
        text(title, f, size, cx, cy + size * 0.36, TEXT, step)


def edge(d, step, color=BLUE, dashed=False, marker=True):
    extra = ' stroke-dasharray="7 7" class="flow"' if dashed else ""
    m = ' marker-end="url(#arrow)"' if marker else ""
    els.append((f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2.5" '
                f'stroke-linecap="round"{extra}{m} pathLength="1"/>', step))


T = dict(field=0.6, split=1.8, form=3.0, list=4.2, v1=5.4, v2=6.0, v3=6.6, v4=7.2,
         nested=8.6, loop=10.0)

# heading
text("Everything is a field", BLACK, 30, W / 2, 50, TEXT, 0.0)

# root
node(W / 2, 112, 170, 50, "field", None, T["field"], accent=CYAN, size=28)

# branch nodes
LX, RX = 250, 650
edge(f"M{W/2 - 40},137 C{W/2 - 40},170 {LX},160 {LX},188", T["split"])
edge(f"M{W/2 + 40},137 C{W/2 + 40},170 {RX},160 {RX},188", T["split"])
node(LX, 220, 250, 62, "composite fields", "made of fields", T["split"])
node(RX, 220, 250, 62, "value fields", "a single value", T["split"])

# composite → form / list → object / array
FX, LIX = 170, 330
edge(f"M{LX - 30},251 C{LX - 30},275 {FX},270 {FX},292", T["form"])
node(FX, 316, 120, 46, "form", None, T["form"], size=24)
edge(f"M{FX},339 L{FX},364", T["form"], color=CYAN)
node(FX, 388, 140, 46, "{ object }", None, T["form"], accent=CYAN, size=21, mono=True)

edge(f"M{LX + 30},251 C{LX + 30},275 {LIX},270 {LIX},292", T["list"])
node(LIX, 316, 120, 46, "list", None, T["list"], size=24)
edge(f"M{LIX},339 L{LIX},364", T["list"], color=CYAN)
node(LIX, 388, 140, 46, "[ array ]", None, T["list"], accent=CYAN, size=21, mono=True)

# value types
vals = [("string · number · boolean", "v1"), ("ISO date / time strings", "v2"),
        ("\"#RRGGBB\"  or  null", "v3"), ("data URL / object  or  null", "v4")]
SX, PX, PW = RX - 105, RX - 85, 270          # spine x, pill left, pill width
prev = 251
for i, (label, k) in enumerate(vals):
    y = 300 + i * 50
    edge(f"M{SX},{prev} L{SX},{y} L{PX - 2},{y}", T[k], marker=True)
    prev = y
    els.append((f'<rect x="{PX}" y="{y - 19}" width="{PW}" height="38" rx="19" '
                f'fill="{CARD}" stroke="#3a4a72" stroke-width="2"/>', T[k]))
    text(label, BOLD, 18, PX + PW / 2, y + 6, TEXT, T[k])

# nested JSON
NY = 486
edge(f"M{FX},411 C{FX},450 {LX - 70},{NY - 10} {LX - 55},{NY - 6}", T["nested"], color=CYAN)
edge(f"M{LIX},411 C{LIX},450 {LX + 70},{NY - 10} {LX + 55},{NY - 6}", T["nested"], color=CYAN)
node(LX, NY + 18, 300, 62, "nested JSON data", "to any depth", T["nested"], accent=CYAN)

# the loop: forms and lists are fields too → nest to any depth
edge(f"M{LX - 150},{NY + 18} H58 Q36,{NY + 18} 36,{NY - 4} V134 Q36,112 58,112 H{W/2 - 90}",
     T["loop"], color=CYAN, dashed=True)
text("forms and lists are fields too", BOLD, 17, 58, 100, CYAN, T["loop"], anchor="start")

# --------------------------------------------------------------- animation
ON_FADE, HOLD_END, OFF_END = 0.5, CYCLE - 1.2, CYCLE - 0.3


def pct(t):
    return f"{100 * t / CYCLE:.3f}%"


steps = sorted({s for _, s in els})
css = [f"""
.s{{opacity:.14}}
.flow{{animation:flow 1.2s linear infinite}}
@keyframes flow{{to{{stroke-dashoffset:-14}}}}
@media (prefers-reduced-motion: reduce){{.s{{animation:none!important;opacity:1}}.flow{{animation:none}}}}
"""]
for i, s in enumerate(steps):
    a, b = max(0.0, s), min(s + ON_FADE, HOLD_END)
    css.append(
        f"@keyframes k{i}{{0%{{opacity:.14}}{pct(a)}{{opacity:.14}}{pct(b)}{{opacity:1}}"
        f"{pct(HOLD_END)}{{opacity:1}}{pct(OFF_END)}{{opacity:.14}}100%{{opacity:.14}}}}"
        f".k{i}{{animation:k{i} {CYCLE}s ease-in-out infinite}}")
    # a short glow pulse when a step lights up
    g1, g2 = pct(a), pct(min(a + 1.4, HOLD_END))
    css.append(
        f"@keyframes g{i}{{0%{{filter:none}}{g1}{{filter:none}}{pct(a + 0.35)}{{filter:url(#glow)}}"
        f"{g2}{{filter:none}}100%{{filter:none}}}}"
        f".g{i}{{animation:k{i} {CYCLE}s ease-in-out infinite,g{i} {CYCLE}s linear infinite}}")

groups = []
for i, s in enumerate(steps):
    body = "\n".join(m for m, st in els if st == s)
    cls = f"s k{i}" if s == 0.0 else f"s g{i}"
    groups.append(f'<g class="{cls}">\n{body}\n</g>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img"
 aria-labelledby="t d">
<title id="t">Everything is a field</title>
<desc id="d">Every SmarkForm component is a field. Composite fields are made of fields: a form returns an object and a list returns an array. Value fields return a single value: string, number, boolean, ISO date/time strings, a #RRGGBB color or null, a data URL/object or null. Forms and lists are fields too, so they nest into JSON data of any depth.</desc>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f1630"/><stop offset="1" stop-color="{INK}"/></linearGradient>
<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{BLUE}"/></marker>
<filter id="glow" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<style>{"".join(css)}</style>
</defs>
<rect width="{W}" height="{H}" rx="18" fill="url(#bg)"/>
{chr(10).join(groups)}
</svg>
'''
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w").write(svg)
print(OUT, f"{len(svg) / 1024:.1f} KB", f"{len(steps)} steps")
