# genera i nastri di carta del tema (cartella tema/), come foto: grana crespata, estremità strappate a fibre,
# pieghe, un po' di trasparenza e un'ombra leggera. Più varianti, perché nessun nastro sia uguale all'altro.
#   nastro-1/2/3.webp       le strisce dei campi X, Y, Z e dei fogli del modellino
#   nastro-largo.webp       sopra il foglio giallo dei materiali
#   angolo-alto-1/2/3.webp, angolo-basso-1/2/3.webp   le L sugli angoli dei pannelli
import os, math
import numpy as np
from PIL import Image, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(31)
TONI = [(238, 222, 182), (234, 214, 166), (241, 211, 168), (232, 220, 190)]   # crema, paglia, pesca, grigio carta

def rumore(h, w, ch, cw):
    # rumore morbido 0..1: una griglia a caso (ch × cw celle) ingrandita
    g = Image.fromarray(rng.random((max(2, ch), max(2, cw))).astype(np.float32), "F")
    return np.asarray(g.resize((w, h), Image.BICUBIC), np.float32)

def strappo(n, amp):
    # il profilo di un'estremità strappata: un'onda lenta, i denti e qualche fibra più lunga
    lento = np.cumsum(rng.normal(0, 1, n)); lento -= np.linspace(lento[0], lento[-1], n); lento *= amp * 0.35 / (np.abs(lento).max() + 1e-6)
    denti = np.repeat(rng.normal(0, amp * 0.28, n // 3 + 2), 3)[:n]
    inclina = np.linspace(0, rng.uniform(-amp, amp), n)
    return lento + denti + inclina + rng.normal(0, amp * 0.08, n)

def striscia(L, T, tono, op=0.9):
    # una striscia orizzontale lunga L e larga T (in pixel), RGBA, con margine per strappi e ombra
    m = 14; Hh, Ww = T + 2 * m, L + 2 * m
    yy, xx = np.mgrid[0:Hh, 0:Ww].astype(np.float32)
    # i bordi lunghi: dritti, appena mossi; le due estremità strappate
    alto = m + rumore(1, Ww, 1, 6)[0] * 1.2; basso = m + T - rumore(1, Ww, 1, 6)[0] * 1.2
    sx = m + 4 + strappo(Hh, 7); dx = m + L - 4 - strappo(Hh, 7)
    dentro = np.minimum.reduce([yy - alto[None, :], basso[None, :] - yy, xx - sx[:, None], dx[:, None] - xx])
    a = np.clip(dentro + 0.5, 0, 1)
    # le fibre: peli di carta che escono dagli strappi
    fuori = np.minimum(np.abs(xx - sx[:, None]), np.abs(xx - dx[:, None]))
    fib = (rumore(Hh, Ww, Hh // 2, Ww // 2) > 0.62) & (fuori < 3.2) & (yy > alto[None, :]) & (yy < basso[None, :])
    a = np.maximum(a, fib * 0.45)
    # il colore: crespatura di traverso, grana, pieghe, luce lungo il nastro
    cresp = rumore(Hh, Ww, max(2, T // 22), Ww // 3) - 0.5                       # righine fitte di traverso
    cresp += 0.5 * (rumore(Hh, Ww, max(2, T // 10), Ww // 2) - 0.5)
    grana = np.asarray(Image.fromarray(rng.normal(0, 1, (Hh, Ww)).astype(np.float32), "F").resize((Ww, Hh)), np.float32)
    luce = 1 + 0.035 * (rumore(Hh, Ww, 2, 4) - 0.5) * 2
    pieghe = np.zeros((Hh, Ww), np.float32)
    for _ in range(rng.integers(1, 4)):
        cx = rng.uniform(m + 10, m + L - 10); ang = math.pi / 2 + rng.normal(0, 0.5)
        d = (xx - cx) * math.cos(ang + math.pi / 2) + (yy - Hh / 2) * math.sin(ang + math.pi / 2)
        w = rng.uniform(5, 12); k = rng.uniform(0.018, 0.04) * rng.choice([-1, 1])
        pieghe += k * np.sign(d) * np.exp(-np.abs(d) / w)                      # un lato in luce, l'altro in ombra
    f = luce * (1 + 0.045 * cresp + 0.012 * grana + pieghe)
    bordo = np.clip(np.minimum(yy - alto[None, :], basso[None, :] - yy) / 2.0, 0, 1)
    f *= 0.92 + 0.08 * bordo                                                   # il taglio dei bordi lunghi, un filo più scuro
    rgb = np.stack([tono[0] * f, tono[1] * f, tono[2] * f], -1)
    alpha = a * (op + 0.06 * (rumore(Hh, Ww, 3, 8) - 0.5))                     # non è opaco uguale dappertutto
    nastro = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8), "RGBA")
    # l'ombra leggera sotto il nastro
    ombra = Image.new("RGBA", nastro.size, (40, 30, 15, 0))
    ombra.putalpha(Image.fromarray((a * 60).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3)).transform(nastro.size, Image.AFFINE, (1, 0, -1.5, 0, 1, -2.5)))
    return Image.alpha_composite(ombra, nastro)

def gira(im, gradi):
    return im.rotate(gradi, Image.BICUBIC, expand=True)

def salva(im, nome, w=None, h=None):
    if w: im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(D, nome), "WEBP", quality=86, method=6)
    print(nome, im.size, os.path.getsize(os.path.join(D, nome)))

# le strisce dei campi (si allungano a tutta la casella): poco storte
for i in range(3):
    s = gira(striscia(rng.integers(560, 620), rng.integers(104, 118), TONI[i], 0.9), rng.uniform(-1.4, 1.4))
    salva(s, f"nastro-{i + 1}.webp", 640, 128)
salva(gira(striscia(440, 118, TONI[3], 0.88), rng.uniform(-2, 2)), "nastro-largo.webp", 480, 132)

# gli angoli: due strisce a L, la seconda sopra la prima (dove si sovrappongono la carta è più fitta)
def angolo(alto, n):
    W, H, t = 260, 480, 58
    tela = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    toni = [TONI[(n + k) % 3] for k in range(2)]
    orizz = gira(striscia(rng.integers(200, 236), t, toni[0], 0.84), rng.uniform(-4, 4))
    vert = gira(striscia(rng.integers(400, 450), t, toni[1], 0.84), 90 + rng.uniform(-3, 3))
    if alto:   # orizzontale in alto, verticale sul lato destro
        tela.alpha_composite(vert, (int(W - vert.width - rng.uniform(10, 26)), int(rng.uniform(-6, 10))))
        tela.alpha_composite(orizz, (int(rng.uniform(-20, 0)), int(rng.uniform(4, 18))))
    else:      # verticale sul lato sinistro, orizzontale in basso
        tela.alpha_composite(orizz, (int(rng.uniform(0, 14)), int(H - orizz.height - rng.uniform(26, 46))))
        tela.alpha_composite(vert, (int(rng.uniform(8, 24)), int(H - vert.height - rng.uniform(4, 20))))
    return tela
for n in range(3):
    salva(angolo(True, n), f"angolo-alto-{n + 1}.webp")
    salva(angolo(False, n), f"angolo-basso-{n + 1}.webp")
