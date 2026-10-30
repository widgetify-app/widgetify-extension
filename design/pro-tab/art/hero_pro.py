from PIL import Image

from common import ASSETS, HERE, grain, run

width, height = 1664, 500

icon = Image.open(f"{ASSETS}/pro-icon.png").convert("RGBA")
icon.resize((icon.width * 6, icon.height * 6), Image.LANCZOS).save(f"{HERE}/pro-icon-6x.png")


def place(scale, cx, cy, opacity=None, shadow=True):
    steps = [["file.placeEmbedded", {"path": f"{HERE}/pro-icon-6x.png", "scale": scale, "smartObject": False, "center": [cx, cy]}]]
    if shadow:
        steps += [["layer.layerStyle.replace", {"effects": [
            {"kind": "dropShadow", "params": {"color": "#1e2a8a", "opacity": 28, "distance": 16, "size": 28, "angle": 90}}]}]]
    if opacity is not None:
        steps += [["layer.setProps", {"opacity": opacity}]]
    return steps


steps = [["gradient.fill.create", {"from": [0, 0], "to": [width, height], "stops": [[0, "#4a63f5"], [1, "#3346d6"]]}]]
steps += place(120, 260, 300, opacity=0.1, shadow=False)
steps += place(26, 470, 200)
steps += grain(3)
run("hero-pro", width, height, steps)
