import json
import subprocess
import sys

import os

S = os.environ["PROMO_WORK"]
PC = os.path.expanduser("~/.claude/skills/photocraft/scripts/pc.py")

W, H = 656, 400


def phone(name, scale, cx, cy, rotate):
    steps = [["file.placeEmbedded", {"path": f"{S}/out/phone-{name}.png", "scale": scale, "center": [cx, cy], "smartObject": False}]]
    if rotate:
        steps.append(["edit.transform", {"rotate": rotate}])
    return steps


def spark(x, y, r, name):
    return ["shape.create", {"kind": "star", "rect": [x - r, y - r, 2 * r, 2 * r], "sides": 4, "starRatio": 0.3, "cornerRadius": 2, "fill": "#7388fb", "name": name}]


steps = []
steps += phone("habits", 66, 128, 342, -8)
steps += phone("friends", 66, 528, 342, 8)
steps += phone("today", 80, 328, 314, 0)
steps += [spark(40, 52, 14, "spark-a"), spark(618, 40, 11, "spark-b"), spark(600, 150, 7, "spark-c")]

recipe = {
    "new": {"width": W, "height": H, "background": "transparent"},
    "steps": steps,
    "keep": f"{S}/out/hero.psd",
    "out": f"{S}/out/hero.png",
}

path = f"{S}/out/recipe-hero.json"
json.dump(recipe, open(path, "w", encoding="utf-8"))
r = subprocess.run([sys.executable, PC, path], capture_output=True, text=True, encoding="utf-8")
print(r.returncode, r.stdout[-800:], r.stderr[-800:])
