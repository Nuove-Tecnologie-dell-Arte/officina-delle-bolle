# genera il foglio giallo dei materiali (tema/carta.svg). I nastri di carta li fa nastri_carta.py.
import random
import os
D = os.path.dirname(os.path.abspath(__file__))   # la cartella tema/
poly = lambda pts: " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
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
