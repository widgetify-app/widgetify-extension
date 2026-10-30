import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
sys.path.insert(0, os.path.join(HERE, "..", "..", "pro-tab", "art"))
import common as c

c.HERE = HERE
W, H = 1040, 520
WHITE = "#ffffff"
SHADOW = {"kind": "dropShadow", "params": {"color": "#1e2a8a", "opacity": 26, "distance": 14, "size": 26, "angle": 90}}


def rr(x, y, w, h, r, fill, opacity=None, shadow=False):
    steps = [["shape.create", {"kind": "roundedRect", "rect": [x, y, w, h], "radii": r, "fill": fill}]]
    if shadow:
        steps += [["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    if opacity is not None:
        steps += [["layer.setProps", {"opacity": opacity}]]
    return steps


def dot(cx, cy, r, fill):
    return [["shape.create", {"kind": "ellipse", "rect": [cx - r, cy - r, r * 2, r * 2], "fill": fill}]]


steps = [["gradient.fill.create", {"from": [0, 0], "to": [W, H], "stops": [[0, "#4a63f5"], [1, "#3346d6"]]}]]
steps += c.glow("#8b9cff", 300, 280, 520, 0.45)

steps += rr(90, 150, 250, 230, 40, WHITE, shadow=True)
steps += [["shape.create", {"kind": "path", "fill": "#536dfe", "path": {"subpaths": [{"closed": True, "knots": [
    [140, 215], [195, 215], [215, 235], [290, 235], [290, 320], [140, 320]]}]}}]]
steps += rr(152, 250, 126, 58, 10, "#dfe4ff")
for k, color in enumerate(["#ff627d", "#fcb700", "#00d390"]):
    steps += dot(178 + k * 38, 279, 11, color)

for x, y in [(380, 262), (410, 262), (440, 262)]:
    steps += dot(x, y, 7, WHITE)
steps += [["layer.setProps", {"opacity": 0.85}]]

steps += rr(500, 120, 470, 290, 30, WHITE, opacity=0.14)
steps += rr(530, 160, 120, 40, 20, "#fcb700")
steps += rr(552, 174, 70, 12, 6, "#7a4a00", opacity=0.55)
for k in range(3):
    x = 530 + k * 140
    steps += rr(x, 220, 128, 150, 18, WHITE, shadow=True)
    steps += dot(x + 30, 252, 13, ["#ff627d", "#536dfe", "#00d390"][k])
    steps += rr(x + 52, 245, 58, 12, 6, "#dfe4ff")
    steps += rr(x + 20, 290, 88, 10, 5, "#eef1ff")
    steps += rr(x + 20, 312, 64, 10, 5, "#eef1ff")
steps += rr(530, 380, 408, 8, 4, "#fcb700")

steps += [["shape.create", {"kind": "path", "fill": WHITE, "path": {"subpaths": [{"closed": True, "knots": [
    [300, 330], [300, 392], [315, 378], [326, 402], [338, 396], [327, 372], [347, 372]]}]}}],
          ["layer.layerStyle.replace", {"effects": [
              {"kind": "stroke", "params": {"size": 4, "color": "#1e2a8a", "position": "outside"}}, SHADOW]}]]
for r, op in [(34, 0.35), (52, 0.18)]:
    steps += [["shape.create", {"kind": "ellipse", "rect": [300 - r, 330 - r, r * 2, r * 2], "fill": None,
                                "stroke": {"width": 3, "color": WHITE, "opacity": 100}}],
              ["layer.setProps", {"opacity": op}]]
steps += c.grain(3)
c.run("group-open", W, H, steps)
