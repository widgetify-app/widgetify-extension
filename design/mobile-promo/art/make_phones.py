import os
import json
import subprocess
import sys


S = os.environ["PROMO_WORK"]
PC = os.path.expanduser("~/.claude/skills/photocraft/scripts/pc.py")

W, H = 360, 740
PX, PY, PW, PH = 24, 16, 312, 660
BEZEL = 8
SW, SH = PW - 2 * BEZEL, PH - 2 * BEZEL
SCALE = 34.7


def recipe(name):
    cx = PX + PW / 2
    cy = PY + BEZEL + 323
    return {
        "new": {"width": W, "height": H, "background": "transparent"},
        "steps": [
            ["shape.create", {"kind": "roundedRect", "rect": [PX + PW - 3, PY + 150, 8, 72], "radii": 4, "fill": "#1a1c25", "name": "side-button"}],
            ["shape.create", {"kind": "roundedRect", "rect": [PX - 5, PY + 120, 8, 44], "radii": 4, "fill": "#1a1c25", "name": "volume-up"}],
            ["shape.create", {"kind": "roundedRect", "rect": [PX - 5, PY + 176, 8, 44], "radii": 4, "fill": "#1a1c25", "name": "volume-down"}],
            ["shape.create", {
                "kind": "roundedRect", "rect": [PX, PY, PW, PH], "radii": 56, "name": "bezel",
                "fill": {"gradient": {"stops": [[0, "#3a3d4c"], [1, "#171921"]], "angle": 90}},
            }],
            ["layer.layerStyle.replace", {"effects": [
                {"kind": "dropShadow", "params": {"color": "#1d2a78", "opacity": 38, "angle": 90, "distance": 16, "size": 26, "useGlobalLight": False}},
                {"kind": "stroke", "params": {"size": 2, "position": "inside", "color": "#6d7186", "opacity": 70}},
            ]}],
            ["shape.create", {"kind": "roundedRect", "rect": [PX + BEZEL, PY + BEZEL, SW, SH], "radii": 48, "fill": "#ffffff", "name": "screen"}],
            ["file.placeEmbedded", {"path": f"{S}/shots/screen-{name}.png", "scale": SCALE, "center": [cx, cy], "smartObject": False}],
            ["layer.createClippingMask", {}],
            ["shape.create", {"kind": "roundedRect", "rect": [cx - 40, PY + BEZEL + 12, 80, 22], "radii": 11, "fill": "#0d0e13", "name": "island"}],
        ],
        "keep": f"{S}/out/phone-{name}.psd",
        "out": f"{S}/out/phone-{name}.png",
    }


for n in sys.argv[1:]:
    path = f"{S}/out/recipe-{n}.json"
    json.dump(recipe(n), open(path, "w", encoding="utf-8"), ensure_ascii=False)
    r = subprocess.run([sys.executable, PC, path], capture_output=True, text=True, encoding="utf-8")
    print(n, r.returncode, r.stdout[-600:], r.stderr[-600:])
