import json
import math
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
ASSETS = os.path.join(HERE, "..", "assets").replace("\\", "/")
RUNNER = os.environ.get("PHOTOCRAFT_RECIPE_RUNNER", "")


def glow(color, x, y, size, opacity=0.8):
    return [
        ["shape.create", {"kind": "ellipse", "rect": [x - size / 2, y - size / 2, size, size], "fill": color}],
        ["shape.rasterize", {}],
        ["filter.blur.gaussianBlur", {"radius": size * 0.3}],
        ["layer.setProps", {"opacity": opacity}],
    ]


def grain(amount=4):
    return [
        ["layer.new.layer", {"name": "grain", "mode": "Overlay", "fillNeutral": True}],
        ["filter.noise.addNoise", {"amount": amount, "distribution": "gaussian", "monochromatic": True, "seed": 3}],
    ]


def ridge(width, height, base, amp, waves, phase, step=20):
    xs = list(range(0, width, step)) + [width]
    pts = [[x, base + amp * math.sin(x / width * math.pi * waves + phase) + amp * 0.4 * math.sin(x / width * math.pi * waves * 2.3 + phase * 1.7)] for x in xs]
    return pts + [[width, height], [0, height]]


def hills(width, height, layers, step=20):
    return [
        ["shape.create", {"kind": "path", "path": {"subpaths": [{"closed": True, "knots": ridge(width, height, base, amp, waves, phase, step)}]},
                          "fill": {"gradient": {"stops": [[0, top], [1, bottom]], "angle": -90}}}]
        for base, amp, waves, phase, top, bottom in layers
    ]


def run(name, width, height, steps, background="transparent"):
    recipe = os.path.join(HERE, f"{name}.json")
    with open(recipe, "w", encoding="utf-8") as f:
        json.dump({"new": {"width": width, "height": height, "background": background}, "steps": steps,
                   "out": f"{HERE}/{name}.png"}, f, ensure_ascii=False)
    result = subprocess.run([sys.executable, RUNNER, recipe], capture_output=True, text=True, encoding="utf-8")
    print(name, (result.stdout.strip().splitlines() or [result.stderr[-400:]])[-1])
