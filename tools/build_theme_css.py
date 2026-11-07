"""Rebuilds theme/discord/avarice.theme.css from avarice.src.css + lines.svg.
Run from the kit folder after editing either file:  python tools/build_theme_css.py"""
import urllib.parse
svg = open("theme/discord/lines.svg", encoding="utf-8").read()
uri = "data:image/svg+xml," + urllib.parse.quote(svg, safe=" =:/,.-'")
src = open("theme/discord/avarice.src.css", encoding="utf-8").read()
open("theme/discord/avarice.theme.css", "w", encoding="utf-8").write(src.replace("__LINES__", uri))
print("wrote theme/discord/avarice.theme.css")
