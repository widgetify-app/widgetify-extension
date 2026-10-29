from common import glow, grain, hills, run

width, height = 1040, 640
steps = [["gradient.fill.create", {"from": [0, 0], "to": [0, height], "stops": [[0, "#2c3fc4"], [0.5, "#536dfe"], [1, "#a9b6ff"]]}]]
steps += glow("#dfe4ff", 760, 300, 240, 0.9) + glow("#9fb0ff", 760, 300, 620, 0.55)
steps += hills(width, height, [
    (420, 34, 3.0, 0.4, "#7d8ff5", "#6b7ef0"),
    (480, 40, 2.2, 2.1, "#4f63e6", "#4357d8"),
    (560, 30, 1.6, 4.0, "#2f40b8", "#28379f"),
])
steps += grain(4)
run("stage", width, height, steps)
