from PIL import Image

from common import ASSETS, HERE, glow, grain, hills, run

width, height = 1664, 500
icon_w, icon_h = 140 * 2.1, 109 * 2.1
left, top = 230, 70
cx, cy = left + icon_w / 2, top + icon_h / 2

icon = Image.open(f"{ASSETS}/pro-icon.png").convert("RGBA")
icon.resize((icon.width * 4, icon.height * 4), Image.LANCZOS).save(f"{HERE}/pro-icon-4x.png")

steps = [["gradient.fill.create", {"from": [0, 0], "to": [0, height], "stops": [[0, "#2c3fc4"], [0.55, "#536dfe"], [1, "#a9b6ff"]]}]]
steps += glow("#dfe4ff", cx, cy, 260, 0.55) + glow("#9fb0ff", cx, cy, 760, 0.5)
steps += hills(width, height, [
    (360, 26, 3.2, 0.4, "#7d8ff5", "#6b7ef0"),
    (400, 30, 2.4, 2.1, "#4f63e6", "#4357d8"),
    (450, 22, 1.7, 4.0, "#2f40b8", "#28379f"),
], step=24)
steps += [
    ["file.placeEmbedded", {"path": f"{HERE}/pro-icon-4x.png", "scale": 52.5, "smartObject": False, "center": [cx, cy]}],
    ["layer.layerStyle.replace", {"effects": [
        {"kind": "dropShadow", "params": {"color": "#1e2a8a", "opacity": 30, "distance": 18, "size": 30, "angle": 90}}]}],
]
for sx, sy, s in [(150, 90, 12), (590, 120, 9), (560, 300, 13), (120, 300, 8), (900, 70, 7)]:
    steps += [
        ["shape.create", {"kind": "star", "rect": [sx - s, sy - s, s * 2, s * 2], "sides": 4, "starRatio": 0.25, "fill": "#ffffff"}],
        ["layer.setProps", {"opacity": 0.85}],
    ]
steps += grain(4)
run("hero-pro", width, height, steps)
