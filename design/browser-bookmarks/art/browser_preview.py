import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__)).replace("\\", "/")
sys.path.insert(0, os.path.join(HERE, "..", "..", "pro-tab", "art"))
import common as c

c.HERE = HERE
W, H = 1040, 520
WHITE = "#ffffff"
SOFT = "#eef1ff"
LINE = "#dfe4ff"
INK = "#3a3f5c"
MUTED = "#9aa1c2"
SHADOW = {"kind": "dropShadow", "params": {"color": "#1e2a8a", "opacity": 26, "distance": 14, "size": 26, "angle": 90}}

SITES = [
    ("N", "Daily News", "#ef4444"),
    ("R", "Recipe Box", "#f59e0b"),
    ("M", "Music Room", "#10b981"),
    ("T", "Travel Map", "#8b5cf6"),
]


def rr(x, y, w, h, r, fill, shadow=False):
    steps = [["shape.create", {"kind": "roundedRect", "rect": [x, y, w, h], "radii": r, "fill": fill}]]
    if shadow:
        steps += [["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    return steps


def text(x, y, value, size, color, style="Semibold", align="left"):
    return [["type.create", {"x": x, "y": y, "text": value, "font": "Segoe UI", "fontStyle": style, "size": size, "color": color, "align": align}]]


def folder(x, y, s, color):
    return rr(x, y, s * 0.45, s * 0.3, 5, color) + rr(x, y + s * 0.14, s, s * 0.72, 7, color)


def star(cx, cy, r, fill):
    return [["shape.create", {"kind": "star", "rect": [cx - r, cy - r, r * 2, r * 2], "sides": 5, "starRatio": 0.5, "fill": fill}]]


def preview():
    steps = [["gradient.fill.create", {"from": [0, 0], "to": [W, H], "stops": [[0, "#4a63f5"], [1, "#3346d6"]]}]]
    steps += c.glow("#8b9cff", 520, 260, 640, 0.4)

    steps += rr(690, 96, 250, 150, 22, WHITE, shadow=True)
    steps += folder(746, 122, 46, "#fcb700")
    steps += text(806, 154, "Work", 26, INK)
    for k, width in enumerate([160, 120]):
        steps += rr(746, 188 + k * 26, width, 12, 6, LINE)

    steps += rr(200, 70, 520, 380, 26, WHITE, shadow=True)
    steps += folder(232, 98, 40, BRAND_FOLDER)
    steps += text(286, 128, "Bookmarks bar", 26, INK, "Bold")
    steps += rr(232, 152, 456, 2, 1, SOFT)
    for k, (letter, name, color) in enumerate(SITES):
        y = 172 + k * 66
        if k == 0:
            steps += rr(220, y - 6, 480, 60, 14, "#e3e8ff")
        steps += rr(236, y + 2, 44, 44, 12, color)
        steps += text(258, y + 35, letter, 24, WHITE, "Bold", "center")
        steps += text(298, y + 33, name, 25, INK)
    steps += star(860, 340, 34, "#fcb700")
    steps += [["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    c.run("bookmark-preview", W, H, steps + c.grain(3))


BRAND_FOLDER = "#536dfe"
preview()
