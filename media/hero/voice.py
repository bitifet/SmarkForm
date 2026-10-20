#!/usr/bin/env python3
"""Synthesize every NARRATION line with Piper, verify timing, build the
narration track (work/voice/narration.wav) and subtitles (out/*.srt)."""
import hashlib, os, subprocess, json, wave
from timeline import NARRATION, VOICE, VOICE_LENGTH_SCALE, scene_starts

os.makedirs("work/voice", exist_ok=True)
os.makedirs("out", exist_ok=True)
starts, total = scene_starts()
PIPER = ".venv/bin/piper"
MODEL = f"assets/voices/{VOICE}.onnx"


def dur(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def fmt(t):
    h, m = int(t // 3600), int(t % 3600 // 60)
    return f"{h:02d}:{m:02d}:{t % 60:06.3f}".replace(".", ",")


lines, problems = [], []
for i, (sid, rel, text) in enumerate(NARRATION):
    # Takes are content-addressed (voice + speed + text), so editing or
    # inserting one line never re-synthesizes (and subtly changes) the others.
    key = f"{VOICE}|{VOICE_LENGTH_SCALE}|{text}"
    h = hashlib.sha1(key.encode()).hexdigest()[:12]
    wav, stamp = f"work/voice/take_{h}.wav", f"work/voice/take_{h}.txt"
    if not os.path.exists(wav):
        subprocess.run([PIPER, "-m", MODEL, "--length-scale", str(VOICE_LENGTH_SCALE), "-f", wav],
                       input=text.encode(), check=True, capture_output=True)
        open(stamp, "w").write(key)
    t0 = starts[sid][0] + rel
    lines.append(dict(t=t0, d=dur(wav), wav=wav, text=text, scene=sid))

for a, b in zip(lines, lines[1:]):
    gap = b["t"] - (a["t"] + a["d"])
    if gap < 0.15:
        problems.append(f"OVERLAP {gap:+.2f}s: '{a['text'][:40]}' -> '{b['text'][:40]}'")
if lines[-1]["t"] + lines[-1]["d"] > total:
    problems.append("last line runs past the end")

for l in lines:
    print(f"{l['t']:7.2f} +{l['d']:4.2f}  [{l['scene']}] {l['text']}")
print(f"total video {total:.2f}s")
for p in problems:
    print("!!", p)

# Narration track: each line delayed to its slot, mixed, padded to full length.
inputs, filt = [], []
for i, l in enumerate(lines):
    inputs += ["-i", l["wav"]]
    ms = int(l["t"] * 1000)
    filt.append(f"[{i}:a]aresample=48000,adelay={ms}|{ms}[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(lines)))
filt.append(f"{mix}amix=inputs={len(lines)}:normalize=0,apad,atrim=0:{total:.3f},"
            f"loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt),
                "-map", "[out]", "-ac", "2", "work/voice/narration.wav"], check=True)

with open("out/SmarkForm_hero.en.srt", "w") as f:
    for i, l in enumerate(lines, 1):
        f.write(f"{i}\n{fmt(l['t'])} --> {fmt(l['t'] + l['d'] + 0.2)}\n{l['text']}\n\n")
json.dump(lines, open("work/voice/lines.json", "w"), indent=1)
