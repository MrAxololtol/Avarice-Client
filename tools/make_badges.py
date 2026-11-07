"""Regenerates theme/badges/*.ico (taskbar unread badges). Run from the kit folder:  python tools/make_badges.py
Needs: pip install pillow"""
from PIL import Image, ImageDraw, ImageFont
import sys
OUT = "theme/badges"
FONT = "Inter-ExtraBold.otf"  # get Inter (free, rsms.me/inter) and point this at Inter-ExtraBold.otf
RED = (229, 57, 60, 255)
BLACK = (10, 10, 12, 255)
S = 512                     # draw big, downsample for crisp edges
BUBBLE = 0.66               # bubble diameter as share of the icon (was ~1.0)
RING = 0.075                # black ring thickness as share of the icon

def badge(label):
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    dia = S * BUBBLE
    ring = S * RING
    # anchored to the top-right corner, where Windows shows the badge
    x1, y0 = S, 0
    x0, y1 = x1 - dia - 2 * ring, y0 + dia + 2 * ring
    d.ellipse([x0, y0, x1, y1], fill=BLACK)
    d.ellipse([x0 + ring, y0 + ring, x1 - ring, y1 - ring], fill=RED)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    if label == "dot":
        r = dia * 0.2
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BLACK)
    else:
        size = dia * (0.78 if len(label) == 1 else 0.56)
        f = ImageFont.truetype(FONT, int(size))
        d.text((cx, cy + dia * 0.02), label, font=f, fill=BLACK, anchor="mm")
    return im

labels = {str(i): str(i) for i in range(1, 10)}
labels["10"] = "9+"
labels["11"] = "dot"
for name, lab in labels.items():
    big = badge(lab)
    sizes = [16, 20, 24, 32, 48, 64]
    big.save(f"{OUT}/{name}.ico", sizes=[(s, s) for s in sizes])

print("ok")
