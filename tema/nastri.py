# genera i nastri di carta e il foglio giallo del tema (cartella tema/)
import random
import os
D = os.path.dirname(os.path.abspath(__file__))   # la cartella tema/
random.seed(5)
def frange(x, y0, y1, verso, passi=9, amp=6):
    # un'estremità strappata: zig-zag irregolare da y0 a y1 attorno a x
    pts = []
    for i in range(passi + 1):
        y = y0 + (y1 - y0) * i / passi
        pts.append((x + verso * random.uniform(0, amp), y))
    return pts
def striscia(x0, y0, x1, y1, amp=6):   # orizzontale, con le due estremità strappate
    return frange(x0, y0, y1, 1, amp=amp) + frange(x1, y1, y0, -1, amp=amp)
def strisciaV(x0, y0, x1, y1, amp=6):  # verticale
    pts = striscia(y0, x0, y1, x1, amp); return [(b, a) for a, b in pts]
poly = lambda pts: " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
def grinze(x0, y0, x1, y1, n, orizz=True):
    s = ""
    for _ in range(n):
        if orizz:
            x = random.uniform(x0 + 8, x1 - 8); s += f'<path d="M{x:.0f},{y0} q{random.uniform(-6, 6):.0f},{(y1 - y0) / 2:.0f} {random.uniform(-4, 4):.0f},{y1 - y0:.0f}" stroke="{random.choice(["#fff", "#7a5a1a"])}" stroke-opacity="{random.uniform(.08, .22):.2f}" stroke-width="{random.uniform(1, 3):.1f}" fill="none"/>'
        else:
            y = random.uniform(y0 + 8, y1 - 8); s += f'<path d="M{x0},{y:.0f} q{(x1 - x0) / 2:.0f},{random.uniform(-6, 6):.0f} {x1 - x0:.0f},{random.uniform(-4, 4):.0f}" stroke="{random.choice(["#fff", "#7a5a1a"])}" stroke-opacity="{random.uniform(.08, .22):.2f}" stroke-width="{random.uniform(1, 3):.1f}" fill="none"/>'
    return s
def nastro(nome, colore, op, w=320, h=64):
    pts = striscia(2, 4, w - 2, h - 4, amp=9)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="none">
<!-- Officina delle Bolle: una striscia di nastro di carta (generata). -->
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
<clipPath id="c"><polygon points="{poly(pts)}"/></clipPath></defs>
<g clip-path="url(#c)"><rect width="{w}" height="{h}" fill="{colore}" fill-opacity="{op}"/><rect width="{w}" height="{h}" fill="url(#g)"/>{grinze(0, 0, w, h, 14)}</g>
</svg>'''
    open(os.path.join(D, nome), "w", encoding="utf-8").write(svg)
nastro("nastro.svg", "#e2b95a", .88)           # i campi X, Y, Z
nastro("nastro-oliva.svg", "#cdb658", .9, 240, 70)   # sopra il foglio dei materiali
def angolo(nome, alto):
    # due strisce arancio chiaro, trasparenti, a L: in alto a destra (orizzontale sopra, verticale sul lato) o in basso a sinistra
    W, H, t = 130, 240, 30
    if alto: a = striscia(0, 10, 118, 10 + t, 7); b = strisciaV(84, 0, 84 + t, H, 7)
    else: a = strisciaV(12, 0, 12 + t, H - 12, 7); b = striscia(4, H - 40, 126, H - 40 + t, 7)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<!-- Officina delle Bolle: nastro di carta a L sull'angolo di un pannello (generato). -->
<g fill="#f4c690" fill-opacity=".78"><polygon points="{poly(a)}"/><polygon points="{poly(b)}"/></g>
<g fill="#fff" fill-opacity=".14"><polygon points="{poly(a)}"/></g>
</svg>'''
    open(os.path.join(D, nome), "w", encoding="utf-8").write(svg)
angolo("angolo-alto.svg", True); angolo("angolo-basso.svg", False)
# il foglio giallo, con il bordo destro strappato e un po' di grana (si allunga con il contenuto)
random.seed(9)
dx = []; y = 0
while y < 1000: dx.append((random.uniform(948, 975), y)); y += random.uniform(8, 26)
dx.append((960, 1000))
pts = [(0, 0), (958, 0)] + dx + [(0, 1000)]
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
<!-- Officina delle Bolle: il foglio giallo dei materiali, con il bordo destro strappato (generato). -->
<defs><filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .18  0 0 0 .22 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<linearGradient id="v" x1="0" x2="1"><stop offset="0" stop-color="#efe2a4"/><stop offset=".08" stop-color="#f6ebb6"/><stop offset=".9" stop-color="#f4e7ad"/><stop offset="1" stop-color="#e9d996"/></linearGradient></defs>
<polygon points="{poly(pts)}" fill="url(#v)"/>
<polygon points="{poly(pts)}" fill="#000" filter="url(#n)"/>
<polyline points="{poly(dx)}" fill="none" stroke="#fffbe6" stroke-width="5" stroke-opacity=".8"/>
</svg>'''
open(os.path.join(D, "carta.svg"), "w", encoding="utf-8").write(svg)
print("ok")
