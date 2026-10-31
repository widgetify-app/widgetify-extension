from common import glow, grain, run

width, height = 1600, 1000
steps = [["gradient.fill.create", {"from": [0, 0], "to": [0, height], "stops": [[0, "#3b2a7a"], [0.45, "#c2649a"], [0.75, "#f6a57c"], [1, "#ffd9a8"]]}]]
steps += glow("#fff1c9", 1050, 640, 300, 0.95) + glow("#ffb38a", 1050, 640, 700, 0.6)
steps += [
    ["layer.new.layer", {"name": "haze", "mode": "Screen", "opacity": 0.35}],
    ["tools.setColors", {"foreground": "#000000", "background": "#ffffff"}],
    ["select.all", {}], ["filter.render.clouds", {"seed": 21}], ["select.deselect", {}],
    ["filter.blur.motionBlur", {"angle": 0, "distance": 220}],
]
ranges = [
    ("#7b4a8f", "#a45a8c", [(0, 720), (180, 600), (360, 660), (560, 540), (760, 640), (980, 560), (1200, 650), (1420, 580), (1600, 640)]),
    ("#4b2f6e", "#6a3b78", [(0, 800), (240, 690), (470, 760), (700, 660), (940, 760), (1180, 690), (1400, 770), (1600, 720)]),
    ("#2a1b4a", "#3a2560", [(0, 880), (300, 800), (620, 860), (900, 790), (1220, 860), (1600, 800)]),
]
for top, bottom, points in ranges:
    knots = [[x, y] for x, y in points] + [[width, height], [0, height]]
    steps += [["shape.create", {"kind": "path", "path": {"subpaths": [{"closed": True, "knots": knots}]},
                                "fill": {"gradient": {"stops": [[0, top], [1, bottom]], "angle": -90}}}]]
steps += grain(5)
run("wallpaper", width, height, steps)
