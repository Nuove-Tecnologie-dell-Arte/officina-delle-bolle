# genera tema/plastica.svg: cellophane stropicciato (faccette chiare, pieghe grigie, riflessi bianchi)
import random, math
random.seed(23)
W, H, P = 1600, 1000, 105
cols, rows = W // P + 2, H // P + 2
pts = [[((i - 0.5) * P + random.uniform(-0.42, 0.42) * P, (j - 0.5) * P + random.uniform(-0.42, 0.42) * P) for i in range(cols + 1)] for j in range(rows + 1)]
L = (-0.55, -0.62, 0.56)
def shade(a, b, c):
    # una normale a caso, un po' inclinata: la luce da in alto a sinistra
    nx, ny = random.gauss(0, 0.42), random.gauss(0, 0.42); nz = 1
    n = math.sqrt(nx * nx + ny * ny + nz * nz); d = (nx * L[0] + ny * L[1] + nz * L[2]) / n
    v = int(max(188, min(252, 220 + d * 44 + random.uniform(-6, 6))))
    return f"rgb({v},{v - 1},{v - 4})"
tri = []
for j in range(rows):
    for i in range(cols):
        a, b, c, d = pts[j][i], pts[j][i + 1], pts[j + 1][i + 1], pts[j + 1][i]
        if random.random() < 0.5: tri += [(a, b, c), (a, c, d)]
        else: tri += [(a, b, d), (b, c, d)]
f = lambda p: f"{p[0]:.0f},{p[1]:.0f}"
facce = "".join(f'<path d="M{f(a)}L{f(b)}L{f(c)}Z" fill="{shade(a, b, c)}"/>' for a, b, c in tri)
# le pieghe: tratti lunghi e storti; sotto l'ombra grigia, sopra il riflesso bianco
pieghe, luci, bande = [], [], []
for k in range(170):
    x, y = random.uniform(-100, W + 100), random.uniform(-100, H + 100)
    ang = random.uniform(0, math.pi); seg = random.randint(1, 4); path = [(x, y)]
    for s in range(seg):
        ang += random.uniform(-0.9, 0.9); l = random.uniform(40, 190)
        x += math.cos(ang) * l; y += math.sin(ang) * l; path.append((x, y))
    d = "M" + "L".join(f(p) for p in path)
    pieghe.append(f'<path d="{d}" stroke="#a9a6a1" stroke-opacity="{random.uniform(.25, .55):.2f}" stroke-width="{random.uniform(2, 5):.1f}" fill="none"/>')
    if random.random() < 0.8:
        if random.random() < 0.35: bande.append(f'<path d="{d}" stroke="#ffffff" stroke-opacity="{random.uniform(.35, .7):.2f}" stroke-width="{random.uniform(8, 22):.0f}" fill="none" stroke-linecap="round"/>')
        luci.append(f'<path d="{d}" transform="translate({random.uniform(2, 5):.1f},{random.uniform(-4, -1):.1f})" stroke="#ffffff" stroke-opacity="{random.uniform(.55, .95):.2f}" stroke-width="{random.uniform(1.2, 3.4):.1f}" fill="none" stroke-linecap="round"/>')
# qualche riflesso largo e morbido
chiazze = "".join(f'<ellipse cx="{random.uniform(0, W):.0f}" cy="{random.uniform(0, H):.0f}" rx="{random.uniform(60, 220):.0f}" ry="{random.uniform(10, 40):.0f}" transform="rotate({random.uniform(-80, 80):.0f})" fill="#fff" fill-opacity="{random.uniform(.25, .6):.2f}"/>' for _ in range(26))
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<!-- Officina delle Bolle: lo sfondo di cellophane stropicciato (generato: faccette chiare, pieghe grigie, riflessi bianchi). -->
<defs><filter id="m" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="p" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="b" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="l" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0.7"/></filter>
<filter id="c" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter></defs>
<rect width="100%" height="100%" fill="#e6e4e0"/>
<g filter="url(#m)">{facce}</g>
<g filter="url(#c)">{chiazze}</g>
<g filter="url(#b)" stroke-linejoin="round">{"".join(bande)}</g>
<g filter="url(#p)" stroke-linejoin="round">{"".join(pieghe)}</g>
<g filter="url(#l)" stroke-linejoin="round">{"".join(luci)}</g>
<rect width="100%" height="100%" fill="#f4f3f0" fill-opacity=".28"/>
</svg>'''
import os
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'plastica.svg'), 'w', encoding='utf-8').write(svg)
print(len(svg))
