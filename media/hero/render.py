#!/usr/bin/env python3
"""Frame-by-frame compositor for the SmarkForm hero video.

  python3 render.py <scene_id> [...]          -> work/scenes/<id>.mp4
  python3 render.py --still <scene_id> <t>... -> work/stills/<id>_<t>.png

Every scene starts and ends on the shared animated background (a function of
the *global* time) so scenes concatenate seamlessly.
"""
import json, math, os, subprocess, sys
from functools import lru_cache

import numpy as np
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from timeline import BLUE, CYAN, CLIPS, FPS, H, SCENES, W, scene_starts

STARTS, TOTAL = scene_starts()
SCN = {s["id"]: s for s in SCENES}
F = "assets/fonts/"


# ------------------------------------------------------------------ easing
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_in(x):
    x = clamp(x)
    return x ** 3


def smooth(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def lerp(a, b, k):
    return a + (b - a) * k


def window(t, t0, t1, fin=0.45, fout=0.35):
    """0..1 envelope: ease in after t0, ease out before t1."""
    return ease_out((t - t0) / fin) * (1 - ease_in((t - (t1 - fout)) / fout))


# ------------------------------------------------------------------ text
@lru_cache(None)
def font(name, size):
    return ImageFont.truetype(F + name, size)


@lru_cache(None)
def cmap(name):
    return TTFont(F + name).getBestCmap()


@lru_cache(None)
def emoji(ch, size):
    big = ImageFont.truetype(F + "NotoColorEmoji.ttf", 109)
    im = Image.new("RGBA", (160, 160))
    ImageDraw.Draw(im).text((0, 0), ch, font=big, embedded_color=True)
    im = im.crop(im.getbbox())
    s = size / max(im.size)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def runs(text, fname):
    """Split text into (is_emoji, str) runs based on the font's cmap."""
    cm, out = cmap(fname), []
    for ch in text:
        if ch in "\ufe0f\u200d":
            continue
        e = ord(ch) not in cm
        if out and out[-1][0] == e and not e:
            out[-1][1] += ch
        else:
            out.append([e, ch])
    return out


def text_size(text, fname, size, tracking=0):
    f, w = font(fname, size), 0
    for e, s in runs(text, fname):
        w += size * 1.1 if e else f.getlength(s) + tracking * len(s)
    asc, desc = f.getmetrics()
    return int(math.ceil(w)), asc + desc


def text_img(text, fname, size, fill=(255, 255, 255), tracking=0, gradient=None):
    """Render a single line to a tight RGBA image (optionally gradient-filled)."""
    w, h = text_size(text, fname, size, tracking)
    pad = int(size * 0.25)
    im = Image.new("RGBA", (w + 2 * pad, h + 2 * pad))
    mask = Image.new("L", im.size)
    d = ImageDraw.Draw(mask)
    f, x = font(fname, size), pad
    emojis = []
    for e, s in runs(text, fname):
        if e:
            emojis.append((x, s))
            x += size * 1.1
        elif tracking:
            for ch in s:
                d.text((x, pad), ch, font=f, fill=255)
                x += f.getlength(ch) + tracking
        else:
            d.text((x, pad), s, font=f, fill=255)
            x += f.getlength(s)
    if gradient:
        g = np.linspace(0, 1, im.width)[None, :, None]
        c = (np.array(gradient[0]) * (1 - g) + np.array(gradient[1]) * g)
        col = np.broadcast_to(c, (im.height, im.width, 3)).astype(np.uint8)
        fillim = Image.fromarray(col, "RGB").convert("RGBA")
    else:
        fillim = Image.new("RGBA", im.size, fill + (255,))
    im.paste(fillim, (0, 0), mask)
    asc = f.getmetrics()[0]
    for x0, ch in emojis:
        em = emoji(ch, int(size * 0.95))
        im.alpha_composite(em, (int(x0), int(pad + asc - em.height + size * 0.1)))
    return im


def with_alpha(im, a):
    if a >= 0.999:
        return im
    im = im.copy()
    al = im.getchannel("A").point(lambda v: int(v * a))
    im.putalpha(al)
    return im


def paste(canvas, im, x, y, a=1.0):
    if a <= 0.003 or im is None:
        return
    canvas.alpha_composite(with_alpha(im, a), (int(round(x)), int(round(y))))


# ------------------------------------------------------------------ background
def _radial(size, color, strength):
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    r = np.hypot(x - size / 2, y - size / 2) / (size / 2)
    a = np.clip(1 - r, 0, 1) ** 2.2 * strength
    return np.dstack([np.full_like(a, c) for c in color] + [a * 255]).astype(np.uint8)


class Background:
    def __init__(self):
        y = np.linspace(0, 1, H)[:, None]
        x = np.linspace(0, 1, W)[None, :]
        top, bot = np.array([10, 14, 32]), np.array([5, 7, 16])
        k = np.clip(y * 0.8 + x * 0.2, 0, 1)[..., None]
        base = top * (1 - k) + bot * k
        # faint dot grid
        grid = np.zeros((H, W), np.float32)
        grid[::48, ::48] = 1
        grid = np.array(Image.fromarray((grid * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))) / 255.0
        base = base + grid[..., None] * 14
        self.base = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")
        self.g1 = Image.fromarray(_radial(1500, BLUE, 0.30))
        self.g2 = Image.fromarray(_radial(1300, CYAN, 0.22))
        self.g3 = Image.fromarray(_radial(1100, (120, 80, 220), 0.16))
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2))
        vig = (np.clip(r - 0.55, 0, 1) * 0.75 * 255).astype(np.uint8)
        self.vig = Image.fromarray(np.dstack([np.zeros_like(vig)] * 3 + [vig]))

    def frame(self, T):
        c = self.base.copy()
        for g, (ax, ay, fx, fy, ph, cx, cy) in (
            (self.g1, (380, 220, .071, .053, 0.0, 0.30, 0.35)),
            (self.g2, (420, 260, .049, .067, 2.0, 0.75, 0.70)),
            (self.g3, (300, 200, .037, .043, 4.0, 0.60, 0.20)),
        ):
            x = W * cx + ax * math.sin(2 * math.pi * fx * T + ph) - g.width / 2
            y = H * cy + ay * math.cos(2 * math.pi * fy * T + ph) - g.height / 2
            c.alpha_composite(g, (int(x), int(y))) if 0 <= x and 0 <= y and x + g.width <= W and y + g.height <= H \
                else _paste_clip(c, g, int(x), int(y))
        c.alpha_composite(self.vig)
        return c


def _paste_clip(canvas, im, x, y):
    x0, y0 = max(0, -x), max(0, -y)
    x1, y1 = min(im.width, W - x), min(im.height, H - y)
    if x1 > x0 and y1 > y0:
        canvas.alpha_composite(im.crop((x0, y0, x1, y1)), (x + x0, y + y0))


# ------------------------------------------------------------------ 3D cards
def project(w, h, cx, cy, s=1.0, rx=0.0, ry=0.0, rz=0.0, f=2200.0):
    """Corners (TL, TR, BR, BL) of a w×h card rotated in 3D, centered at cx,cy."""
    rx, ry, rz = map(math.radians, (rx, ry, rz))
    pts = []
    for x, y in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)):
        x, y = x * s, y * s
        x, y = x * math.cos(rz) - y * math.sin(rz), x * math.sin(rz) + y * math.cos(rz)
        x, z = x * math.cos(ry), x * math.sin(ry)
        y, z = y * math.cos(rx) - z * math.sin(rx), y * math.sin(rx) + z * math.cos(rx)
        k = f / (f + z)
        pts.append((cx + x * k, cy + y * k))
    return pts


def persp_coeffs(dst, src):
    """PIL PERSPECTIVE coefficients mapping output points dst -> input src."""
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return np.linalg.solve(np.array(A, float), np.array(b, float)).tolist()


def warp(img, quad, canvas_size=(W, H)):
    """Warp RGBA img onto quad; returns (layer, x0, y0) cropped to the bbox."""
    xs, ys = [p[0] for p in quad], [p[1] for p in quad]
    x0, y0 = max(0, int(min(xs)) - 2), max(0, int(min(ys)) - 2)
    x1, y1 = min(canvas_size[0], int(max(xs)) + 3), min(canvas_size[1], int(max(ys)) + 3)
    if x1 <= x0 or y1 <= y0:
        return None, 0, 0
    dst = [(x - x0, y - y0) for x, y in quad]
    src = [(0, 0), (img.width, 0), (img.width, img.height), (0, img.height)]
    out = img.transform((x1 - x0, y1 - y0), Image.PERSPECTIVE, persp_coeffs(dst, src), Image.BICUBIC)
    return out, x0, y0


@lru_cache(None)
def round_mask(w, h, r):
    m = Image.new("L", (w * 2, h * 2))
    ImageDraw.Draw(m).rounded_rectangle((0, 0, w * 2 - 1, h * 2 - 1), r * 2, fill=255)
    return m.resize((w, h), Image.LANCZOS)


def card_texture(frame, w, h, radius=22, border=True):
    """Resize a frame to w×h, round the corners, add a hairline border."""
    im = frame.convert("RGB").resize((w, h), Image.LANCZOS).convert("RGBA")
    im.putalpha(round_mask(w, h, radius))
    if border:
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, w - 1, h - 1), radius, outline=(255, 255, 255, 90), width=2)
    return im


def draw_card(canvas, tex, quad, alpha=1.0, shadow=0.55):
    layer, x0, y0 = warp(tex, quad)
    if layer is None:
        return
    if shadow > 0:
        a = layer.getchannel("A")
        m, k = 12, 8                      # margin (small px), downscale factor
        sw, sh = max(1, a.width // k), max(1, a.height // k)
        small = Image.new("L", (sw + 2 * m, sh + 2 * m))
        small.paste(a.resize((sw, sh), Image.BILINEAR), (m, m))
        small = small.filter(ImageFilter.GaussianBlur(5))
        big = small.resize((small.width * k, small.height * k), Image.BILINEAR)
        big = big.point(lambda v: int(v * shadow * alpha))
        sh_img = Image.new("RGBA", big.size, (0, 0, 6, 255))
        sh_img.putalpha(big)
        _paste_clip(canvas, sh_img, x0 - m * k + 16, y0 - m * k + 44)
    _paste_clip(canvas, with_alpha(layer, alpha), x0, y0)


# ------------------------------------------------------------------ clip reader
class ClipReader:
    def __init__(self, cid):
        meta = json.load(open(f"work/clips/{cid}.json"))
        self.w, self.h = meta["size"]
        self.n = int(round(meta["duration"] * FPS))
        self.proc = subprocess.Popen(
            ["ffmpeg", "-v", "error", "-i", f"work/clips/{cid}.mp4", "-f", "rawvideo",
             "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
        self.idx, self.last = -1, None

    def get(self, i):
        i = min(i, self.n - 1)
        while self.idx < i:
            buf = self.proc.stdout.read(self.w * self.h * 3)
            if len(buf) < self.w * self.h * 3:
                break
            self.last = Image.frombuffer("RGB", (self.w, self.h), buf, "raw", "RGB", 0, 1)
            self.idx += 1
        return self.last


def still(cid, t):
    out = f"work/stills_src_{cid}_{t}.png"
    if not os.path.exists(out):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f"work/clips/{cid}.mp4",
                        "-frames:v", "1", out], check=True)
    im = Image.open(out).convert("RGB")
    os.remove(out)
    return im


# ------------------------------------------------------------------ UI pieces
def wrap(text, fname, size, maxw):
    lines, cur = [], ""
    for wd in text.split(" "):
        tryl = (cur + " " + wd).strip()
        if cur and text_size(tryl, fname, size)[0] > maxw:
            lines.append(cur)
            cur = wd
        else:
            cur = tryl
    return lines + [cur]


def hint_pill(text):
    """Left-column feature callout: dark glass card with a brand gradient bar."""
    lines = [text_img(l, "Lato-Black.ttf", 50)
             for para in text.split("\n")
             for l in ([para] if "\n" in text else wrap(para, "Lato-Black.ttf", 50, 620))]
    lh = 62
    t = Image.new("RGBA", (max(l.width for l in lines), lh * (len(lines) - 1) + lines[-1].height))
    for i, l in enumerate(lines):
        t.alpha_composite(l, (0, i * lh))
    pw, ph = t.width + 74, t.height + 34
    im = Image.new("RGBA", (pw, ph))
    m = round_mask(pw, ph, 20)
    bg = Image.new("RGBA", (pw, ph), (12, 18, 38, 225))
    im.paste(bg, (0, 0), m)
    bar = text_img(" ", "Lato-Bold.ttf", 10)  # placeholder to keep API symmetric
    g = np.linspace(0, 1, ph)[:, None, None]
    col = (np.array(BLUE) * (1 - g) + np.array(CYAN) * g).astype(np.uint8)
    barim = Image.fromarray(np.broadcast_to(col, (ph, 8, 3)).copy(), "RGB").convert("RGBA")
    barmask = Image.new("L", (pw, ph))
    ImageDraw.Draw(barmask).rounded_rectangle((0, 0, 30, ph - 1), 20, fill=255)
    barmask = barmask.crop((0, 0, 8, ph))
    im.paste(barim, (0, 0), barmask)
    ImageDraw.Draw(im).rounded_rectangle((0, 0, pw - 1, ph - 1), 20, outline=(255, 255, 255, 40), width=2)
    im.alpha_composite(t, (38, (ph - t.height) // 2 - 2))
    del bar
    return im


@lru_cache(None)
def hint_cached(text):
    return hint_pill(text)


def draw_hints(canvas, hints, t, x=84, yc=600):
    for t0, t1, text in hints:
        if t0 - 0.05 <= t <= t1 + 0.05:
            k = window(t, t0, t1, 0.45, 0.3)
            dx = (1 - ease_out((t - t0) / 0.5)) * -60
            dy = -40 * ease_in((t - (t1 - 0.3)) / 0.3)
            im = hint_cached(text)
            xx = (W - im.width) / 2 if x == "center" else x + dx
            yy = yc - im.height / 2 + dy + (0 if x != "center" else (1 - ease_out((t - t0) / 0.5)) * 30)
            paste(canvas, im, xx, yy, k)


@lru_cache(None)
def label_img(text):
    return text_img(text.upper(), "Lato-Bold.ttf", 26, fill=(160, 175, 210), tracking=4)


def draw_label(canvas, text, t, dur):
    k = window(t, 0.1, dur, 0.5, 0.4)
    im = label_img(text)
    d = ImageDraw.Draw(canvas)
    d.rectangle((90, 92, 90 + 46 * k, 96), fill=CYAN + (int(255 * k),))
    paste(canvas, im, 84, 104, k)


@lru_cache(None)
def chip_img(text):
    t = text_img(text, "Hack-Bold.ttf", 54, gradient=(BLUE, CYAN))
    return t


@lru_cache(None)
def logo(width):
    im = Image.open("assets/smarkform_dark.png").convert("RGBA")
    return im.resize((width, int(im.height * width / im.width)), Image.LANCZOS)


# ------------------------------------------------------------------ scenes
class Scene:
    def __init__(self, s):
        self.s, self.id = s, s["id"]
        self.t0, self.dur = STARTS[self.id]

    def draw(self, canvas, t):
        pass


def floating_cards(canvas, T, k, pieces):
    """Decorative depth layer: still cards drifting slowly in 3D."""
    for i, (tex, cx, cy, s, ry, rx, ph) in enumerate(pieces):
        q = project(tex.width, tex.height,
                    cx + 30 * math.sin(T * 0.35 + ph), cy + 22 * math.cos(T * 0.3 + ph),
                    s * (1 + 0.03 * math.sin(T * 0.25 + ph)),
                    rx + 3 * math.sin(T * 0.4 + ph), ry + 5 * math.cos(T * 0.33 + ph))
        draw_card(canvas, tex, q, alpha=k, shadow=0.35)


def deco_pieces(dim=0.32):
    def tex(cid, t, h):
        f = still(cid, t)
        w = int(f.width * h / f.height)
        im = card_texture(f, w, h)
        im = im.filter(ImageFilter.GaussianBlur(2.6))
        dark = Image.new("RGBA", im.size, (8, 12, 28, 255))
        dark.putalpha(im.getchannel("A").point(lambda v: int(v * (1 - dim))))
        im.alpha_composite(dark)
        return im
    return [
        (tex("profile", 8.5, 330), 250, 230, 1.0, 32, 10, 0.0),
        (tex("hotel", 6.0, 560), 1730, 560, 1.0, -34, 6, 1.7),
        (tex("students", 18.5, 340), 290, 860, 1.0, 30, -8, 3.1),
    ]


class Hero(Scene):
    def __init__(self, s):
        super().__init__(s)
        self.pieces = deco_pieces(0.74)
        self.l1 = text_img(s["title"], "Lato-Black.ttf", 110)
        self.l2 = text_img(s["title2"], "Lato-Black.ttf", 110, gradient=(BLUE, CYAN))
        self.meet = text_img("Meet", "Lato-Light.ttf", 56, fill=(190, 200, 225))
        self.chips = [self._chip(c) for c in s["chips"]]

    def _chip(self, text):
        t = text_img(text, "Lato-Bold.ttf", 34, fill=(225, 235, 255))
        pw, ph = t.width + 56, 72
        im = Image.new("RGBA", (pw, ph))
        ImageDraw.Draw(im).rounded_rectangle((0, 0, pw - 1, ph - 1), 36, fill=(20, 30, 60, 200),
                                             outline=CYAN + (150,), width=2)
        im.alpha_composite(t, (28, (ph - t.height) // 2 - 2))
        return im

    def draw(self, c, t):
        T = self.t0 + t
        floating_cards(c, T, window(t, 0.0, self.dur + 0.4, 1.4, 0.8) * 0.9, self.pieces)
        # Act 1: the promise, two lines
        out1 = 1 - smooth((t - 3.9) / 0.6)
        for i, (im, ts) in enumerate(((self.l1, 0.35), (self.l2, 1.55))):
            k = ease_out((t - ts) / 0.7) * out1
            y = 360 + i * 150 + (1 - ease_out((t - ts) / 0.7)) * 50 - (1 - out1) * 60
            paste(c, im, (W - im.width) / 2, y, k)
        # Act 2: logo reveal
        kl = ease_out((t - 4.35) / 0.9) * (1 - smooth((t - (self.dur - 0.6)) / 0.6))
        if kl > 0:
            s = 0.88 + 0.12 * ease_out((t - 4.35) / 1.2) + 0.015 * (t - 4.35)
            lw = int(1100 * s)
            lg = logo(1100).resize((lw, int(logo(1100).height * s)), Image.LANCZOS) if abs(s - 1) > .002 else logo(1100)
            paste(c, self.meet, (W - self.meet.width) / 2, 300, kl)
            paste(c, lg, (W - lg.width) / 2, 395 - (lg.height - logo(1100).height) / 2, kl)
            # light sweep across the logo
            sx = lerp(-300, W + 300, smooth((t - 4.7) / 1.1))
            if 4.7 < t < 5.8:
                sweep = Image.new("RGBA", (220, 340))
                g = (np.sin(np.linspace(0, math.pi, 220)) ** 3 * 70).astype(np.uint8)
                sweep.putalpha(Image.fromarray(np.broadcast_to(g, (340, 220)).copy()))
                sweep = sweep.rotate(-18, expand=True)
                _paste_clip(c, sweep, int(sx), 330)
            # chips
            total = sum(ch.width for ch in self.chips) + 30 * (len(self.chips) - 1)
            x = (W - total) / 2
            for i, ch in enumerate(self.chips):
                ts = 5.2 + 0.25 * i
                k = ease_out((t - ts) / 0.5) * (1 - smooth((t - (self.dur - 0.6)) / 0.6))
                paste(c, ch, x, 680 + (1 - ease_out((t - ts) / 0.5)) * 30, k)
                x += ch.width + 30


class Title(Scene):
    def __init__(self, s):
        super().__init__(s)
        self.num = text_img(s["num"], "Lato-Black.ttf", 230, gradient=(BLUE, CYAN))
        self.title = text_img(s["title"], "Lato-Black.ttf", 92)
        self.sub = text_img(s["sub"], "Lato-Regular.ttf", 46, fill=(170, 185, 215))

    def draw(self, c, t):
        d = self.dur
        out = 1 - smooth((t - (d - 0.45)) / 0.45)
        x = 230
        k = ease_out(t / 0.6) * out
        paste(c, self.num, x - 40 + (1 - ease_out(t / 0.6)) * -80, 300, k * 0.95)
        kt = ease_out((t - 0.15) / 0.6) * out
        tx = x + self.num.width - 10
        paste(c, self.title, tx + (1 - ease_out((t - 0.15) / 0.6)) * 60, 316, kt)
        ks = ease_out((t - 0.4) / 0.6) * out
        paste(c, self.sub, tx + 6, 498 + (1 - ease_out((t - 0.4) / 0.6)) * 20, ks)
        lw = int((W - tx - 200) * ease_out((t - 0.25) / 0.9))
        if lw > 0:
            bar = Image.new("RGBA", (lw, 4), CYAN + (int(200 * out),))
            c.alpha_composite(bar, (tx + 30, 488))


class Demo(Scene):
    def __init__(self, s):
        super().__init__(s)
        self.reader = ClipReader(s["clip"])
        ch = s["card_h"]
        self.ch, self.cw = ch, int(self.reader.w * ch / self.reader.h)
        self.cx = W - 140 - self.cw / 2 if self.cw < 1000 else W - 90 - self.cw / 2
        self.cx = min(self.cx, 1240)

    def dolly(self, t):
        return self._interp(self.s.get("dolly", [(0, 1.0, 0)]), t)

    def camera(self, t):
        return self._interp(self.s["camera"], t)

    @staticmethod
    def _interp(cam, t):
        if t <= cam[0][0]:
            return cam[0][1:]
        for a, b in zip(cam, cam[1:]):
            if a[0] <= t <= b[0]:
                k = smooth((t - a[0]) / max(1e-6, b[0] - a[0]))
                return tuple(lerp(x, y, k) for x, y in zip(a[1:], b[1:]))
        return cam[-1][1:]

    def draw(self, c, t):
        s, d = self.s, self.dur
        T = self.t0 + t
        fr = self.reader.get(int(t * FPS))
        z, fx, fy = self.camera(t)
        if z > 1.001:
            cw, chh = fr.width / z, fr.height / z
            x0 = clamp(fx * fr.width - cw / 2, 0, fr.width - cw)
            y0 = clamp(fy * fr.height - chh / 2, 0, fr.height - chh)
            fr = fr.crop((int(x0), int(y0), int(x0 + cw), int(y0 + chh)))
        tex = card_texture(fr, self.cw, self.ch)
        kin = ease_out(t / 0.9)
        kout = ease_in((t - (d - 0.55)) / 0.55)
        ry = s["ry"] - 22 * (1 - kin) + 18 * kout + 2.2 * math.sin(T * 0.45)
        rx = s["rx"] + 1.2 * math.sin(T * 0.37 + 1)
        cx = self.cx + 260 * (1 - kin) - 160 * kout
        dm, dy = self.dolly(t)
        cy = H / 2 + 24 + 10 * math.sin(T * 0.3) + dy
        sc = (0.93 + 0.07 * kin) * (1 + 0.025 * t / d) * (1 - 0.06 * kout) * dm
        q = project(self.cw, self.ch, cx, cy, sc, rx, ry)
        draw_card(c, tex, q, alpha=clamp(t / 0.45) * (1 - kout))
        draw_label(c, s["label"], t, d)
        draw_hints(c, s["hints"], t)


class Code(Scene):
    TEXW = 1600

    def __init__(self, s):
        super().__init__(s)
        code = Image.open(f"work/code/{s['code']}.png")
        k = min(self.TEXW / code.width, 1.25)
        code = code.resize((int(code.width * k), int(code.height * k)), Image.LANCZOS)
        self.win = 1500                            # texture rows visible at once
        tex = Image.new("RGBA", (self.TEXW, code.height + 2 * self.win))
        tex.alpha_composite(code, ((self.TEXW - code.width) // 2 if code.width < self.TEXW else 0, self.win))
        self.tex = tex
        self.travel = code.height + self.win
        # vertical fade: transparent at the horizon, opaque near the viewer
        y = np.linspace(0, 1, H)
        fade = (np.clip((y - 0.10) / 0.42, 0, 1) ** 1.6 * 255).astype(np.uint8)
        self.fade = Image.fromarray(np.broadcast_to(fade[:, None], (H, W)).copy(), "L")
        self.chip = chip_img(s["chip"])

    def draw(self, c, t):
        s, d = self.s, self.dur
        k = clamp((t - 0.15) / (d - 0.3))
        off = self.travel * (0.08 + 0.92 * k) if s["lang"] != "css" else self.travel * k
        off = self.travel * k
        top = int(off)
        part = self.tex.crop((0, top, self.TEXW, top + self.win))
        # tilted plane ("crawl"), leaning slightly to the right
        cx = 1200
        quad = [(cx - 330, 60), (cx + 400, 40), (cx + 760, 1190), (cx - 680, 1215)]
        layer, x0, y0 = warp(part, quad)
        if layer is not None:
            full = Image.new("RGBA", (W, H))
            _paste_clip(full, layer, x0, y0)
            a = np.minimum(np.array(full.getchannel("A"), np.uint16),
                           np.array(self.fade, np.uint16) + 0)
            a = (a * np.array(self.fade, np.uint16) // 255).astype(np.uint8)
            env = window(t, 0, d, 0.3, 0.3)
            if env < 1:
                a = (a * env).astype(np.uint8)
            full.putalpha(Image.fromarray(a))
            c.alpha_composite(full)
        kc = window(t, 0.05, d, 0.45, 0.35)
        paste(c, self.chip, 84 + (1 - ease_out(t / 0.5)) * -40, 150, kc)
        draw_label(c, s["label"], t, d)
        draw_hints(c, s["hints"], t)


JS_TOKENS = [
    [("const ", (199, 146, 234)), ("myForm", (225, 230, 245)), (" = ", (137, 221, 255)),
     ("new ", (199, 146, 234)), ("SmarkForm", (255, 203, 107)), ("(", (170, 180, 205))],
    [("    document", (225, 230, 245)), (".", (170, 180, 205)), ("getElementById", (130, 220, 160)),
     ("(", (170, 180, 205)), ('"myForm"', (255, 203, 107)), (")", (170, 180, 205))],
    [(");", (170, 180, 205))],
]


def draw_js(c, x, y, size, nchars, cursor=True, alpha=1.0):
    f = font("Hack-Regular.ttf", size)
    lh = int(size * 1.45)
    cw = f.getlength("M")
    d = ImageDraw.Draw(c)
    left, cx, cy = nchars, x, y
    for li, line in enumerate(JS_TOKENS):
        cx, cy = x, y + li * lh
        for txt, col in line:
            show = txt[:max(0, left)]
            if show:
                d.text((cx, cy), show, font=f, fill=col + (int(255 * alpha),))
            cx += cw * len(show)
            left -= len(txt)
            if left <= 0:
                break
        if left <= 0:
            break
        left -= 1  # newline
    if cursor:
        d.rectangle((cx + 4, cy + 6, cx + 4 + size * 0.5, cy + size * 1.2), fill=CYAN + (int(220 * alpha),))


JS_LEN = sum(len(t) for line in JS_TOKENS for t, _ in line) + len(JS_TOKENS) - 1


class Init(Scene):
    def __init__(self, s):
        super().__init__(s)
        self.chip = chip_img(s["chip"])
        self.one = text_img("1", "Lato-Black.ttf", 420, gradient=(BLUE, CYAN))
        self.cap = text_img("statement", "Lato-Light.ttf", 46, fill=(170, 185, 215))

    def draw(self, c, t):
        s, d = self.s, self.dur
        env = window(t, 0, d, 0.4, 0.45)
        n = int(JS_LEN * clamp((t - 0.35) / 1.3))
        blink = (int(t * 2.2) % 2 == 0) or n < JS_LEN
        bw = font("Hack-Regular.ttf", 58).getlength("M") * 38
        draw_js(c, (W - bw) / 2, 360, 58, n, cursor=blink, alpha=env)
        kc = window(t, 0.05, d, 0.45, 0.35)
        paste(c, self.chip, 84 + (1 - ease_out(t / 0.5)) * -40, 150, kc)
        draw_label(c, s["label"], t, d)
        draw_hints(c, s["hints"], t, x="center", yc=800)


class Outro(Scene):
    def __init__(self, s):
        super().__init__(s)
        self.pieces = deco_pieces(0.76)
        self.tag = text_img(s["tagline"], "Lato-Bold.ttf", 54, gradient=(BLUE, CYAN))
        self.inst = self._pill("$ " + s["install"], "Hack-Bold.ttf", 40, (225, 235, 255))
        self.url = self._pill(s["url"], "Lato-Bold.ttf", 42, (225, 235, 255))

    def _pill(self, text, fname, size, col):
        t = text_img(text, fname, size, fill=col)
        pw, ph = t.width + 70, int(size * 2.0)
        im = Image.new("RGBA", (pw, ph))
        ImageDraw.Draw(im).rounded_rectangle((0, 0, pw - 1, ph - 1), ph // 2, fill=(14, 22, 46, 230),
                                             outline=BLUE + (170,), width=2)
        im.alpha_composite(t, (35, (ph - t.height) // 2 - 2))
        return im

    def draw(self, c, t):
        d = self.dur
        T = self.t0 + t
        floating_cards(c, T, window(t, 0.0, d, 1.2, 1.0) * 0.9, self.pieces)
        out = 1 - smooth((t - (d - 0.8)) / 0.8)
        kl = ease_out((t - 0.2) / 1.0) * out
        s = 0.9 + 0.1 * ease_out((t - 0.2) / 1.2)
        lg = logo(1000)
        lgs = lg.resize((int(lg.width * s), int(lg.height * s)), Image.LANCZOS)
        paste(c, lgs, (W - lgs.width) / 2, 250 + (lg.height - lgs.height) / 2, kl)
        kt = ease_out((t - 1.2) / 0.7) * out
        paste(c, self.tag, (W - self.tag.width) / 2, 540 + (1 - kt) * 20, kt)
        ki = ease_out((t - 2.2) / 0.6) * out
        ku = ease_out((t - 2.5) / 0.6) * out
        gap = 40
        tw = self.inst.width + gap + self.url.width
        x = (W - tw) / 2
        paste(c, self.inst, x, 700 + (1 - ki) * 25, ki)
        paste(c, self.url, x + self.inst.width + gap, 700 + (1 - ku) * 25, ku)


class More(Scene):
    """'…and there's much more': 3x3 feature tiles on a gently tilted plane."""
    TW, TH, GX, GY = 560, 150, 34, 30          # tile size and gaps
    COLS = 3

    def __init__(self, s):
        super().__init__(s)
        self.head = text_img(s["title"], "Lato-Black.ttf", 76)
        self.tiles = [self._tile(t) for t in s["tiles"]]
        gw = self.COLS * self.TW + (self.COLS - 1) * self.GX
        rows = math.ceil(len(self.tiles) / self.COLS)
        gh = rows * self.TH + (rows - 1) * self.GY
        self.gw, self.gh = gw, gh
        self.pos = [((i % self.COLS) * (self.TW + self.GX), (i // self.COLS) * (self.TH + self.GY))
                    for i in range(len(self.tiles))]

    def _tile(self, t):
        w, h = self.TW, self.TH
        im = Image.new("RGBA", (w, h))
        bg = Image.new("RGBA", (w, h), (14, 21, 44, 235))
        im.paste(bg, (0, 0), round_mask(w, h, 22))
        g = np.linspace(0, 1, h)[:, None, None]
        col = (np.array(BLUE) * (1 - g) + np.array(CYAN) * g).astype(np.uint8)
        bar = Image.fromarray(np.broadcast_to(col, (h, 7, 3)).copy(), "RGB").convert("RGBA")
        m = Image.new("L", (w, h))
        ImageDraw.Draw(m).rounded_rectangle((0, 0, 40, h - 1), 22, fill=255)
        im.paste(bar, (0, 0), m.crop((0, 0, 7, h)))
        ImageDraw.Draw(im).rounded_rectangle((0, 0, w - 1, h - 1), 22,
                                             outline=(255, 255, 255, 42), width=2)
        icon = emoji(t["icon"].replace("\ufe0f", ""), 64)
        im.alpha_composite(icon, (34 + (64 - icon.width) // 2, (h - icon.height) // 2))
        title = text_img(t["title"], "Lato-Black.ttf", 38)
        sub = text_img(t["sub"], "Lato-Regular.ttf", 28, fill=(160, 178, 214))
        x = 128
        im.alpha_composite(title, (x - 9, 26 - 9))
        im.alpha_composite(sub, (x - 7, 82 - 7))
        return im

    def draw(self, c, t):
        s, d = self.s, self.dur
        T = self.t0 + t
        out = smooth((t - (d - 0.9)) / 0.9)
        # heading
        kh = ease_out((t - 0.15) / 0.7) * (1 - out)
        paste(c, self.head, (W - self.head.width) / 2,
              104 + (1 - ease_out((t - 0.15) / 0.7)) * 30 - out * 40, kh)
        # tiles on a flat layer, then tilted as a whole
        layer = Image.new("RGBA", (self.gw + 80, self.gh + 80))
        for i, (tile, (x, y), spec) in enumerate(zip(self.tiles, self.pos, s["tiles"])):
            k = ease_out((t - spec["at"]) / 0.55)
            if k <= 0:
                continue
            kx = 1 - smooth((t - (d - 0.95 + 0.04 * i)) / 0.5)   # staggered exit
            a = k * kx
            if a <= 0.003:
                continue
            sc = 0.86 + 0.14 * k
            tw, th = int(self.TW * sc), int(self.TH * sc)
            im = tile if sc > 0.999 else tile.resize((tw, th), Image.BILINEAR)
            dy = (1 - k) * 46 - (1 - kx) * 60
            # freshly revealed tile: brief cyan glow ring
            glow = clamp(1 - (t - spec["at"]) / 1.2)
            if glow > 0:
                ring = Image.new("RGBA", (tw + 20, th + 20))
                ImageDraw.Draw(ring).rounded_rectangle((0, 0, tw + 19, th + 19), 30,
                                                       outline=CYAN + (int(150 * glow * a),), width=4)
                ring = ring.filter(ImageFilter.GaussianBlur(3))
                layer.alpha_composite(ring, (int(40 + x + (self.TW - tw) / 2 - 10),
                                             int(40 + y + (self.TH - th) / 2 + dy - 10)))
            paste(layer, im, 40 + x + (self.TW - tw) / 2, 40 + y + (self.TH - th) / 2 + dy, a)
        ry = -5 + 2.0 * math.sin(T * 0.4)
        rx = 7 + 1.0 * math.sin(T * 0.33 + 1)
        sc = 0.97 + 0.03 * smooth(t / d)
        q = project(layer.width, layer.height, W / 2, 268 + layer.height / 2 + 8, sc, rx, ry)
        warped, x0, y0 = warp(layer, q)
        if warped is not None:
            _paste_clip(c, warped, x0, y0)


KINDS = dict(hero=Hero, title=Title, demo=Demo, code=Code, init=Init, more=More, outro=Outro)


def make(sid):
    s = SCN[sid]
    return KINDS[s["kind"]](s)


def compose(bg, scene, t):
    c = bg.frame(scene.t0 + t)
    scene.draw(c, t)
    T = scene.t0 + t
    if T < 0.5:                                  # global fade in from black
        c = Image.blend(Image.new("RGBA", (W, H), (0, 0, 0, 255)), c, smooth(T / 0.5))
    if T > TOTAL - 0.6:                          # global fade out to black
        c = Image.blend(c, Image.new("RGBA", (W, H), (0, 0, 0, 255)), smooth((T - TOTAL + 0.6) / 0.6))
    return c.convert("RGB")


def render_scene(sid):
    os.makedirs("work/scenes", exist_ok=True)
    bg, sc = Background(), make(sid)
    n = int(round(sc.dur * FPS))
    out = f"work/scenes/{sid}.mp4"
    enc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
         "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "14", "-preset", "medium",
         "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(n):
        enc.stdin.write(compose(bg, sc, i / FPS).tobytes())
    enc.stdin.close()
    enc.wait()
    print(f"{sid}: {n} frames -> {out}", flush=True)


def render_stills(sid, times):
    os.makedirs("work/stills", exist_ok=True)
    bg, sc = Background(), make(sid)
    for t in sorted(times):
        p = f"work/stills/{sid}_{t:05.2f}.png"
        compose(bg, sc, t).save(p)
        print(p)


if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "--still":
        render_stills(a[1], [float(x) for x in a[2:]])
    else:
        for sid in a:
            render_scene(sid)
