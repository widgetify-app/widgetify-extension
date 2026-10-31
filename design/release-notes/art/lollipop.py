import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
sys.path.insert(0, os.path.join(HERE, "..", "..", "pro-tab", "art"))
import common as c

c.HERE = HERE
W, H = 1472, 520
WHITE = "#ffffff"
PINK = "#ff627d"
YELLOW = "#fcb700"
GREEN = "#00d390"
BRAND = "#536dfe"
SHADOW = {"kind": "dropShadow", "params": {"color": "#1e2a8a", "opacity": 30, "distance": 18, "size": 30, "angle": 90}}


def spiral(cx, cy, turns, r0, r1, phase, steps=60):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        a = phase + t * turns * 2 * math.pi
        r = r0 + (r1 - r0) * t
        pts.append([round(cx + r * math.cos(a), 1), round(cy + r * math.sin(a), 1)])
    return pts


def stroke_path(points, color, width):
    return [["shape.create", {"kind": "path", "fill": None,
                              "stroke": {"width": width, "color": color, "opacity": 100, "cap": "round", "join": "round"},
                              "path": {"subpaths": [{"closed": False, "knots": points}]}}]]


def star(cx, cy, s, color=WHITE, opacity=0.9):
    return [["shape.create", {"kind": "star", "rect": [cx - s, cy - s, s * 2, s * 2], "sides": 4, "starRatio": 0.28, "fill": color}],
            ["layer.setProps", {"opacity": opacity}]]


def lollipop(cx, cy, r, tilt):
    sx = cx + math.sin(math.radians(tilt)) * (r + 230)
    sy = cy + math.cos(math.radians(tilt)) * (r + 230)
    steps = [["shape.create", {"kind": "path", "fill": None,
                               "stroke": {"width": 30, "color": "#f4f6ff", "opacity": 100, "cap": "round"},
                               "path": {"subpaths": [{"closed": False, "knots": [[cx, cy], [sx, sy]]}]}}],
             ["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    steps += [["shape.create", {"kind": "ellipse", "rect": [cx - r, cy - r, r * 2, r * 2], "fill": WHITE}],
              ["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    turns = 3
    width = (r - 16) / turns / 3 * 1.08
    for k, color in enumerate([PINK, BRAND, YELLOW]):
        steps += stroke_path(spiral(cx, cy, turns, 2, r - 14, k * 2 * math.pi / 3, 90), color, width)
    steps += [["shape.create", {"kind": "ellipse", "rect": [cx - r * 0.62, cy - r * 0.78, r * 0.55, r * 0.32], "fill": WHITE}],
              ["layer.setProps", {"opacity": 0.45}]]
    return steps


def build():
    steps = [["gradient.fill.create", {"from": [0, 0], "to": [W, H], "stops": [[0, "#4a63f5"], [1, "#3346d6"]]}]]
    steps += c.glow("#8b9cff", 380, 230, 620, 0.5)
    steps += lollipop(560, 210, 150, -24)
    steps += lollipop(300, 300, 92, 18)
    for x, y, s in [(140, 110, 16), (440, 450, 10), (90, 420, 9), (690, 80, 10)]:
        steps += star(x, y, s)
    for x, y, s, col in [(200, 200, 7, YELLOW), (690, 330, 6, PINK), (400, 90, 6, GREEN)]:
        steps += [["shape.create", {"kind": "ellipse", "rect": [x - s, y - s, s * 2, s * 2], "fill": col}]]
    c.run("lollipop", W, H, steps + c.grain(3))


build()
