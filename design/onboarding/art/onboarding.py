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
BRAND = "#536dfe"
YELLOW = "#fcb700"
SHADOW = {"kind": "dropShadow", "params": {"color": "#1e2a8a", "opacity": 26, "distance": 14, "size": 26, "angle": 90}}


def rr(x, y, w, h, r, fill, opacity=None, shadow=False, stroke=None):
    shape = {"kind": "roundedRect", "rect": [x, y, w, h], "radii": r, "fill": fill}
    if stroke:
        shape["stroke"] = stroke
    steps = [["shape.create", shape]]
    if shadow:
        steps += [["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    if opacity is not None:
        steps += [["layer.setProps", {"opacity": opacity}]]
    return steps


def dot(cx, cy, r, fill, opacity=None):
    steps = [["shape.create", {"kind": "ellipse", "rect": [cx - r, cy - r, r * 2, r * 2], "fill": fill}]]
    if opacity is not None:
        steps += [["layer.setProps", {"opacity": opacity}]]
    return steps


def ring(cx, cy, r, color, width, opacity):
    return [["shape.create", {"kind": "ellipse", "rect": [cx - r, cy - r, r * 2, r * 2], "fill": None,
                              "stroke": {"width": width, "color": color, "opacity": 100}}],
            ["layer.setProps", {"opacity": opacity}]]


def cursor(x, y, scale=1.0):
    pts = [[0, 0], [0, 62], [15, 48], [26, 72], [38, 66], [27, 42], [47, 42]]
    knots = [[x + px * scale, y + py * scale] for px, py in pts]
    return [["shape.create", {"kind": "path", "fill": WHITE, "path": {"subpaths": [{"closed": True, "knots": knots}]}}],
            ["layer.layerStyle.replace", {"effects": [
                {"kind": "stroke", "params": {"size": 4, "color": "#1e2a8a", "position": "outside"}}, SHADOW]}]]


def click(x, y):
    return ring(x, y, 30, WHITE, 3, 0.4) + ring(x, y, 48, WHITE, 3, 0.2)


def click_burst(x, y):
    steps = dot(x, y, 26, BRAND, 0.18) + ring(x, y, 26, BRAND, 4, 0.75) + ring(x, y, 42, BRAND, 3, 0.35)
    for dx, dy in [(-1, -1), (0, -1.3), (-1.3, 0), (1, -1), (-1, 1)]:
        steps += [["shape.create", {"kind": "path", "fill": None, "stroke": {"width": 5, "color": BRAND, "opacity": 100, "cap": "round"},
                                    "path": {"subpaths": [{"closed": False, "knots": [[x + dx * 52, y + dy * 52], [x + dx * 68, y + dy * 68]]}]}}]]
    return steps


def base():
    steps = [["gradient.fill.create", {"from": [0, 0], "to": [W, H], "stops": [[0, "#4a63f5"], [1, "#3346d6"]]}]]
    return steps + c.glow("#8b9cff", 520, 260, 640, 0.4)


def browser(x, y, w, h):
    steps = rr(x, y, w, h, 24, WHITE, shadow=True)
    steps += rr(x, y, w, 46, 24, SOFT)
    steps += rr(x, y + 30, w, 16, 0, SOFT)
    for k, color in enumerate(["#ff627d", YELLOW, "#00d390"]):
        steps += dot(x + 26 + k * 20, y + 23, 6, color)
    steps += rr(x + 100, y + 12, w - 140, 22, 11, WHITE)
    return steps


def menu(x, y, w, rows, active=None, icons=True):
    h = 20 + rows * 40
    steps = rr(x, y, w, h, 16, WHITE, shadow=True)
    for k in range(rows):
        ry = y + 10 + k * 40
        if k == active:
            steps += rr(x + 8, ry, w - 16, 36, 10, "#e3e8ff")
        if icons:
            steps += rr(x + w - 40, ry + 9, 18, 18, 5, BRAND if k == active else LINE)
            steps += rr(x + w - 52 - (w - 90) * (0.75 if k % 2 else 0.55), ry + 13, (w - 90) * (0.75 if k % 2 else 0.55), 10, 5, BRAND if k == active else LINE)
        else:
            steps += rr(x + 18, ry + 13, (w - 36) * (0.8 if k % 2 else 0.6), 10, 5, BRAND if k == active else LINE)
    return steps


def welcome():
    steps = base() + browser(170, 70, 700, 380)
    for k in range(3):
        steps += rr(210 + k * 140, 330, 120, 90, 20, SOFT)
    steps += rr(520, 128, 320, 180, 18, WHITE, shadow=True)
    steps += rr(548, 152, 170, 14, 7, "#c9d0e8")
    steps += rr(548, 180, 260, 10, 5, LINE)
    steps += rr(548, 200, 200, 10, 5, LINE)
    steps += rr(548, 246, 120, 40, 12, WHITE, stroke={"width": 2, "color": LINE, "opacity": 100})
    steps += rr(682, 246, 130, 40, 12, "#1a73e8")
    steps += rr(712, 261, 70, 10, 5, WHITE)
    steps += rr(674, 238, 146, 56, 18, None, stroke={"width": 4, "color": YELLOW, "opacity": 100})
    steps += cursor(752, 262)
    c.run("onboarding-welcome", W, H, steps + c.grain(3))


def privacy():
    steps = base()
    shield = [[300, 110], [400, 150], [400, 260], [300, 380], [200, 260], [200, 150]]
    steps += [["shape.create", {"kind": "path", "fill": WHITE, "path": {"subpaths": [{"closed": True, "knots": shield}]}}],
              ["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    steps += [["shape.create", {"kind": "path", "fill": None, "stroke": {"width": 18, "color": BRAND, "opacity": 100, "cap": "round", "join": "round"},
                                "path": {"subpaths": [{"closed": False, "knots": [[255, 245], [290, 280], [350, 210]]}]}}]]
    for k, on in enumerate([True, False]):
        y = 150 + k * 120
        steps += rr(480, y, 380, 96, 20, WHITE, shadow=True)
        steps += rr(510, y + 28, 180, 14, 7, "#c9d0e8")
        steps += rr(510, y + 54, 240, 10, 5, LINE)
        steps += rr(770, y + 30, 64, 36, 18, BRAND if on else "#cfd5ea")
        steps += dot(816 if on else 788, y + 48, 13, WHITE)
    c.run("onboarding-privacy", W, H, steps + c.grain(3))


def footer():
    steps = base() + browser(150, 50, 740, 420)
    for k, color in enumerate(["#4285f4", "#ea4335", "#fbbc04", "#34a853"]):
        steps += dot(472 + k * 32, 124, 13, color)
    steps += rr(330, 158, 380, 44, 22, WHITE, stroke={"width": 2, "color": LINE, "opacity": 100})
    steps += dot(358, 180, 7, "#c9d0e8")
    steps += rr(376, 176, 150, 8, 4, LINE)
    for k in range(5):
        x = 350 + k * 85
        steps += dot(x + 20, 248, 22, SOFT)
        steps += dot(x + 20, 248, 9, "#c9d0e8")
        steps += rr(x + 4, 280, 32, 7, 3.5, LINE)
    steps += rr(150, 414, 740, 56, 0, "#f1f3fb")
    steps += rr(150, 440, 740, 30, 24, "#f1f3fb")
    steps += rr(150, 414, 740, 2, 0, LINE)
    steps += rr(424, 434, 18, 18, 4, "#7b88c9")
    steps += rr(452, 438, 170, 10, 5, "#aab4dc")
    steps += rr(146, 410, 748, 64, 14, None, stroke={"width": 4, "color": YELLOW, "opacity": 100})
    steps += rr(540, 298, 300, 104, 14, WHITE, shadow=True)
    steps += rr(550, 308, 280, 40, 10, "#e3e8ff")
    steps += rr(566, 323, 200, 10, 5, BRAND)
    steps += rr(566, 369, 150, 10, 5, LINE)
    steps += click(548, 443) + cursor(540, 437)
    c.run("onboarding-footer", W, H, steps + c.grain(3))


def widget_menu():
    steps = base()
    steps += rr(180, 130, 320, 220, 30, WHITE, shadow=True)
    steps += rr(220, 175, 150, 46, 12, "#c9d0e8")
    steps += rr(220, 240, 230, 14, 7, LINE)
    steps += rr(220, 266, 170, 14, 7, LINE)
    steps += menu(560, 100, 290, 5, active=1)
    steps += click_burst(410, 268) + cursor(402, 262)
    c.run("onboarding-widget", W, H, steps + c.grain(3))


def layout_button():
    steps = base()
    steps += dot(620, 120, 44, WHITE)
    steps += [["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    for gx, gy in [(-12, -12), (12, -12), (-12, 12), (12, 12)]:
        steps += rr(620 + gx - 9, 120 + gy - 9, 18, 18, 5, BRAND)
    steps += ring(620, 120, 56, YELLOW, 5, 1)
    steps += menu(370, 190, 300, 4, active=0)
    steps += cursor(646, 140)
    c.run("onboarding-layout", W, H, steps + c.grain(3))


def profile_menu():
    steps = base()
    steps += dot(640, 110, 40, "#ffd7a8")
    steps += [["layer.layerStyle.replace", {"effects": [SHADOW]}]]
    steps += dot(640, 98, 14, "#c2410c") + rr(616, 116, 48, 26, 13, "#c2410c")
    steps += ring(640, 110, 52, YELLOW, 5, 1)
    steps += rr(360, 180, 320, 70, 18, WHITE, shadow=True)
    steps += dot(640, 215, 22, "#ffd7a8")
    steps += rr(460, 200, 150, 14, 7, "#c9d0e8") + rr(500, 222, 110, 10, 5, LINE)
    steps += menu(360, 262, 320, 4, active=2)
    steps += cursor(664, 128)
    c.run("onboarding-profile", W, H, steps + c.grain(3))


for name in sys.argv[1:] or ["welcome", "privacy", "footer", "widget_menu", "layout_button", "profile_menu"]:
    globals()[name]()
