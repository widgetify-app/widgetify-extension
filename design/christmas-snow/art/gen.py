"""Draws logo-decoration.png (144x144, transparent) for PhotoCraft.

Run: python gen.py out.png, then python ~/.claude/skills/photocraft/scripts/pc.py recipe.json,
then convert to lossless webp. The logo itself is not drawn; the hat sits on its top left rim.
"""
import json, math
S = 144
SC = 1.0
K = 0.5523

def rot(p, deg, o=(0, 0)):
    a = math.radians(deg)
    x, y = p[0] - o[0], p[1] - o[1]
    return (o[0] + x * math.cos(a) - y * math.sin(a), o[1] + x * math.sin(a) + y * math.cos(a))

def tx(p, deg, t):
    r = rot((p[0] * SC, p[1] * SC), deg)
    return [round(r[0] + t[0], 2), round(r[1] + t[1], 2)]

def knot(anchor, i=None, o=None, deg=0, t=(0, 0)):
    k = {"anchor": tx(anchor, deg, t)}
    if i: k["in"] = tx(i, deg, t)
    if o: k["out"] = tx(o, deg, t)
    return k

def ellipse(cx, cy, rx, ry, deg=0, t=(0, 0), rdeg=0):
    pts = [((cx + rx, cy), (cx + rx, cy - K * ry), (cx + rx, cy + K * ry)),
           ((cx, cy + ry), (cx + K * rx, cy + ry), (cx - K * rx, cy + ry)),
           ((cx - rx, cy), (cx - rx, cy + K * ry), (cx - rx, cy - K * ry)),
           ((cx, cy - ry), (cx - K * rx, cy - ry), (cx + K * rx, cy - ry))]
    knots = []
    c = (cx, cy)
    for a, i, o in pts:
        a2, i2, o2 = [rot(p, rdeg, c) for p in (a, i, o)]
        knots.append(knot(a2, i2, o2, deg, t))
    return {"subpaths": [{"closed": True, "knots": knots}], "fillRule": "nonzero"}

def poly(points, deg=0, t=(0, 0), closed=True):
    return {"subpaths": [{"closed": closed, "knots": [knot(p, None, None, deg, t) for p in points]}], "fillRule": "nonzero"}

def grad(top, bottom, angle=90):
    return {"gradient": {"stops": [[0, top], [1, bottom]], "angle": angle, "style": "linear"}}

steps = []
def shape(path, fill, name, stroke=None):
    d = {"kind": "path", "path": path, "fill": fill, "name": name}
    if stroke: d["stroke"] = stroke
    steps.append(["shape.create", d])
def shadow(op=22, dist=2, size=3):
    steps.append(["layer.layerStyle.replace", {"effects": [{"kind": "dropShadow", "params": {"opacity": op, "distance": dist, "size": size, "angle": 120, "color": "#7a1020"}}]}])

SC = 0.7
HAT_T = (37, 39)
HAT_R = -32
RED_TOP, RED_BOT = "#ff8f8f", "#e5383b"

cone = {"subpaths": [{"closed": True, "knots": [
    knot((-25, -4), None, (-22, -30), HAT_R, HAT_T),
    knot((-4, -43), (-14, -41), (8, -45), HAT_R, HAT_T),
    knot((36, -27), (24, -44), (40, -19), HAT_R, HAT_T),
    knot((27, -4), (36, -12), None, HAT_R, HAT_T),
]}], "fillRule": "nonzero"}
shape(cone, grad(RED_TOP, RED_BOT), "hat", {"width": 4.5, "color": RED_BOT, "join": "round", "cap": "round", "align": "center"})
shadow()
shape(ellipse(-8, -26, 2.6, 10, HAT_R, HAT_T, rdeg=22), [255, 255, 255, 80], "hat-gloss")
band = {"subpaths": [{"closed": True, "knots": [
    knot((-30, -4), None, None, HAT_R, HAT_T), knot((31, -4), None, None, HAT_R, HAT_T),
    knot((31, 9), None, None, HAT_R, HAT_T), knot((-30, 9), None, None, HAT_R, HAT_T)]}], "fillRule": "nonzero"}
shape(band, grad("#ffffff", "#dfe7fb"), "fur", {"width": 5, "color": "#f2f6ff", "join": "round", "cap": "round", "align": "center"})
shadow(18, 2, 3)
shape(ellipse(-9, 0, 3.2, 2, HAT_R, HAT_T), [255, 255, 255, 255], "fur-spot")
shape(ellipse(36, -22, 10, 10, HAT_R, HAT_T), grad("#ffffff", "#dfe7fb"), "pom")
shadow(18, 2, 3)
shape(ellipse(33, -26, 3, 2, HAT_R, HAT_T, rdeg=-30), [255, 255, 255, 255], "pom-spot")

SC = 1.0

def leaf(cx, cy, rx, ry, rdeg, name):
    shape(ellipse(cx, cy, rx, ry, 0, (0, 0), rdeg), grad("#7be0a2", "#1f9d55"), name, {"width": 3, "color": "#1f9d55", "join": "round", "align": "center"})
    shadow(16, 1, 2)
    hi = ellipse(cx - rx * 0.2, cy - ry * 0.35, rx * 0.35, ry * 0.2, 0, (0, 0), rdeg)
    shape(hi, [255, 255, 255, 120], name + "-gloss")

leaf(26, 112, 15, 7, -28, "leaf-1")
leaf(44, 124, 14, 7, 22, "leaf-2")
for i, (x, y) in enumerate([(33, 120), (42, 114), (39, 126)]):
    shape(ellipse(x, y, 6.5, 6.5), grad("#ff7b7b", "#d62b3a"), f"berry-{i}", {"width": 2, "color": "#d62b3a", "join": "round", "align": "center"})
    shadow(20, 1, 2)
    shape(ellipse(x - 2, y - 2.4, 1.8, 1.4), [255, 255, 255, 230], f"berry-{i}-spot")

def sparkle(cx, cy, r, color, name):
    steps.append(["shape.create", {"kind": "star", "rect": [cx - r, cy - r, 2 * r, 2 * r], "sides": 4, "starRatio": 0.32, "fill": color, "name": name, "cornerRadius": 1}])

sparkle(112, 22, 9, "#ffd95a", "sparkle-1")
sparkle(128, 54, 6, "#9fb4ff", "sparkle-2")
sparkle(118, 124, 6, "#ffd95a", "sparkle-3")
sparkle(12, 72, 5, "#9fb4ff", "sparkle-4")

import sys

out = sys.argv[1] if len(sys.argv) > 1 else "logo-decoration.png"
recipe = {"new": {"width": S, "height": S, "background": "transparent"}, "steps": steps, "out": out}
open("recipe.json", "w").write(json.dumps(recipe))
