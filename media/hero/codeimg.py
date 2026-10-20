#!/usr/bin/env python3
"""Extract the example sources from the SmarkForm docs and typeset them as
syntax-highlighted transparent PNGs (work/code/*.png) for the code crawls.

Sources (read-only):
  docs/_component_types/type_image.md  -> image_basic_html / image_basic_css
  docs/_about/showcase.md              -> school_groups_example,
                                          nested_schedule_table + period_item_tpl
                                          + schedule_row_tpl
"""
import os, re
from PIL import Image, ImageDraw, ImageFont
from pygments.lexers import HtmlLexer, CssLexer, JavascriptLexer
from pygments.token import Token

DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "docs")
os.makedirs("work/code", exist_ok=True)

FONT = ImageFont.truetype("assets/fonts/Hack-Regular.ttf", 30)
FONT_B = ImageFont.truetype("assets/fonts/Hack-Bold.ttf", 30)
EMOJI = ImageFont.truetype("assets/fonts/NotoColorEmoji.ttf", 109)
LINE_H = 42
CHAR_W = FONT.getlength("M")

# Palette tuned to the brand blue/cyan on a dark navy background.
COLORS = [
    (Token.Comment, (110, 125, 160), False),
    (Token.Name.Tag, (36, 198, 211), True),
    (Token.Name.Attribute, (122, 182, 255), False),
    (Token.Literal.String, (255, 203, 107), False),
    (Token.Name.Builtin, (36, 198, 211), False),
    (Token.Name.Class, (255, 203, 107), True),
    (Token.Name.Function, (130, 220, 160), False),
    (Token.Name.Decorator, (199, 146, 234), False),
    (Token.Keyword, (199, 146, 234), True),
    (Token.Literal.Number, (247, 140, 108), False),
    (Token.Operator, (137, 221, 255), False),
    (Token.Punctuation, (170, 180, 205), False),
    (Token.Name, (225, 230, 245), False),
]
DEFAULT = (225, 230, 245)


def style(tok):
    for t, c, b in COLORS:
        if tok in t:
            return c, b
    return DEFAULT, False


def capture(md, name):
    src = open(os.path.join(DOCS, md), encoding="utf-8").read()
    m = re.search(r"\{%\s*capture " + name + r"\s*-?%\}(.*?)\{%-?\s*endcapture", src, re.S)
    if not m:
        raise SystemExit(f"capture {name} not found in {md}")
    txt = m.group(1)
    txt = txt.replace('{{""}}', "").replace("myForm$$", "myForm").replace("█", "")
    return txt.strip("\n")


def is_emoji(ch):
    o = ord(ch)
    return o >= 0x2190 and not (0x2500 <= o <= 0x257F) and ch not in "→…·"


def emoji_img(ch, size):
    im = Image.new("RGBA", (140, 140))
    ImageDraw.Draw(im).text((0, 0), ch, font=EMOJI, embedded_color=True)
    bb = im.getbbox() or (0, 0, 1, 1)
    im = im.crop(bb)
    s = size / max(im.size)
    return im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS)


def render(text, lexer, out, pad=40):
    text = text.expandtabs(4)
    lines = text.split("\n")
    width = int(max(len(l) for l in lines) * CHAR_W + pad * 2 + 80)
    height = len(lines) * LINE_H + pad * 2
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x, y = pad, pad
    for tok, val in lexer.get_tokens(text):
        color, bold = style(tok)
        font = FONT_B if bold else FONT
        for i, part in enumerate(val.split("\n")):
            if i:
                x, y = pad, y + LINE_H
            for ch in part:
                if ch == "\ufe0f" or ch == "\u200d":
                    continue
                if is_emoji(ch):
                    e = emoji_img(ch, 30)
                    img.alpha_composite(e, (int(x), int(y + (LINE_H - e.height) / 2 - 2)))
                    x += CHAR_W * 2
                else:
                    d.text((x, y), ch, font=font, fill=color + (255,))
                    x += CHAR_W
    img.save(out)
    print(out, img.size, f"{len(lines)} lines")


# ---- sources -------------------------------------------------------------
profile_html = capture("_component_types/type_image.md", "image_basic_html")
profile_css = capture("_component_types/type_image.md", "image_basic_css")
students_html = capture("_about/showcase.md", "school_groups_example")

period_tpl = capture("_about/showcase.md", "period_item_tpl")
# Keep the optional date-prefill <script> recognisable but short: it is
# example-specific sugar, not something SmarkForm needs.
period_tpl = re.sub(r"(<script>\n)(.*?)(\n\s*</script>)",
                    lambda m: m.group(1) + "\n".join(m.group(2).split("\n")[:3]) +
                    "\n    // … optional: smart date defaults for new periods …" + m.group(3),
                    period_tpl, flags=re.S)
hotel_html = capture("_about/showcase.md", "nested_schedule_table")
hotel_html = hotel_html.replace("{{ period_item_tpl }}", period_tpl)
hotel_html = hotel_html.replace("{{ schedule_row_tpl }}",
                                capture("_about/showcase.md", "schedule_row_tpl"))
assert "{{" not in hotel_html and "{%" not in hotel_html

INIT_JS = 'const myForm = new SmarkForm(\n    document.getElementById("myForm")\n);'

render(profile_html, HtmlLexer(), "work/code/profile.html.png")
render(profile_css, CssLexer(), "work/code/profile.css.png")
render(students_html, HtmlLexer(), "work/code/students.html.png")
render(hotel_html, HtmlLexer(), "work/code/hotel.html.png")
open("work/code/init.js", "w").write(INIT_JS)
for name, txt in [("profile.html", profile_html), ("profile.css", profile_css),
                  ("students.html", students_html), ("hotel.html", hotel_html)]:
    open(f"work/code/{name}", "w").write(txt)
