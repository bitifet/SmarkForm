#!/usr/bin/env python3
"""Normalize the screencasts: cut, crop (drop editor chrome), retime, 30 fps,
join parts with a short crossfade.  Output: work/clips/<id>.mp4 (+ .json with
the resulting duration and part boundaries)."""
import json, subprocess, sys, os
from timeline import CLIPS, FPS, XFADE

os.makedirs("work/clips", exist_ok=True)


def build(cid):
    c = CLIPS[cid]
    cw, ch, cx, cy = c["crop"]
    cw, ch = cw - cw % 2, ch - ch % 2
    chains, durs = [], []
    dl = c.get("delogo")
    delogo = f",delogo=x={dl[0]}:y={dl[1]}:w={dl[2]}:h={dl[3]}" if dl else ""
    for i, (a, b, sp) in enumerate(c["parts"]):
        chains.append(
            f"[0:v]trim=start={a}:end={b},setpts=(PTS-STARTPTS)/{sp},"
            f"fps={FPS},crop={cw}:{ch}:{cx}:{cy}{delogo},setsar=1,format=yuv420p[p{i}]")
        durs.append(round((b - a) / sp * FPS) / FPS)
    last, acc, bounds = "p0", durs[0], [0.0]
    for i in range(1, len(durs)):
        off = acc - XFADE
        bounds.append(round(off, 3))
        chains.append(f"[{last}][p{i}]xfade=transition=fade:duration={XFADE}:offset={off:.3f}[x{i}]")
        last, acc = f"x{i}", acc + durs[i] - XFADE
    graph = ";".join(chains)
    out = f"work/clips/{cid}.mp4"
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", f"src/{c['src']}", "-filter_complex", graph,
           "-map", f"[{last}]", "-an", "-c:v", "libx264", "-crf", "12", "-preset", "medium",
           "-pix_fmt", "yuv420p", out]
    subprocess.run(cmd, check=True)
    meta = dict(duration=round(acc, 3), size=[cw, ch], bounds=bounds)
    json.dump(meta, open(f"work/clips/{cid}.json", "w"))
    print(cid, meta)


for cid in (sys.argv[1:] or CLIPS):
    build(cid)
