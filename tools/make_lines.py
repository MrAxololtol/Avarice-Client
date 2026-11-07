"""Regenerates theme/discord/lines.svg (the seamless contour-line tile). Run from the kit folder:  python tools/make_lines.py
Then run tools/build_theme_css.py to embed it in the theme."""
import math
W, H, SP = 1600, 1152, 48          # H = 24 * SP so lines line up when tiled vertically
kx, ky = 2*math.pi/W, 2*math.pi/H  # all terms periodic in x (W) and y (H) -> seamless both ways
def field(x, y):
    return (74*math.sin(2*kx*x + 1*ky*y) +
            46*math.sin(3*kx*x - 2*ky*y + 1.3) +
            24*math.sin(6*kx*x + 1*ky*y + 2.1))
paths=[]
for base in range(-288, H+288, SP):
    pts=[f"{x} {round(base+field(x,base))}" for x in range(0, W+1, 16)]
    paths.append("M"+" L".join(pts))
svg=(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
     f'<path fill="none" stroke="#fff" stroke-width="1.3" d="{" ".join(paths)}"/></svg>')
open("theme/discord/lines.svg","w").write(svg)
print(len(svg))
