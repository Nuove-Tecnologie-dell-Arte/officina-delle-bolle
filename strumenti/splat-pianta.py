#!/usr/bin/env python3
"""splat-pianta.py - ricava la pianta di una stanza da uno splat (.ply) per l'Abbofficina.

Uso:  python3 -I strumenti/splat-pianta.py FILE.ply [--alto z|y] [--passo N] [--cella M] [--json]

Legge le posizioni degli splat (solo Python, nessuna libreria) e stampa:
  - il pavimento, il soffitto e l'altezza prudente per i controlli (H);
  - una mappa dall'alto (# pareti, + pareti rade, . pavimento);
  - le pareti dritte trovate (segmenti lungo x e lungo z);
  - i corridoi (due pareti parallele vicine) e un punto da mettere nell'origine;
  - il contorno esterno e gli eventuali buchi (il cortile di un chiostro), come rettangoli;
  - la riga `-r 90,0,0 -t ...` per convertire lo splat e la voce da copiare in STANZE (configuratore/index.html).

Le coordinate stampate sono quelle del SITO, dopo la conversione con `-r 90,0,0` (alto sull'asse y):
x = x del file, z = -y del file (con `--alto z`, come esce da Spirula; con `--alto y` x e z sono quelle del file).
Il metodo cerca pareti dritte, parallele agli assi: va bene per stanze, corridoi e chiostri ad angoli retti. Per altre forme
guarda la mappa e scrivi il poligono a mano. Controlla sempre i numeri contro lo splat (griglia nella pagina prova-splat.html).
"""
import argparse, json, mmap, struct, sys
from collections import Counter, defaultdict

FMT = {'float': 'f', 'double': 'd', 'uchar': 'B', 'char': 'b', 'ushort': 'H', 'short': 'h', 'uint': 'I', 'int': 'i'}


def leggi(path, passo, alto):
    """Restituisce [(x, z, su)] nel sistema del sito, con opacità >= 0.5, e il numero totale di splat."""
    f = open(path, 'rb'); mm = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
    fine = mm.find(b'end_header\n')
    if fine < 0: sys.exit('splat-pianta: intestazione PLY non trovata')
    righe = mm[:fine].decode('latin-1').split('\n'); inizio = fine + len(b'end_header\n')
    if 'binary_little_endian' not in mm[:fine].decode('latin-1'): sys.exit('splat-pianta: serve un PLY binary_little_endian (come quello di Spirula)')
    n = 0; props = []
    for r in righe:
        if r.startswith('element vertex'): n = int(r.split()[2])
        elif r.startswith('element ') and n: break
        elif r.startswith('property') and n: props.append((r.split()[2], r.split()[1]))
    nomi = [p[0] for p in props]
    for k in ('x', 'y', 'z', 'opacity'):
        if k not in nomi: sys.exit(f'splat-pianta: manca la proprietà {k}')
    # una struct che salta le proprietà che non servono
    fmt, off, ordine = '<', 0, []
    for nome, tipo in props:
        c = FMT[tipo]; sz = struct.calcsize(c)
        if nome in ('x', 'y', 'z', 'opacity'): fmt += c; ordine.append(nome)
        else: fmt += f'{sz}x'
    S = struct.Struct(fmt); stride = struct.calcsize('<' + ''.join(FMT[t] for _, t in props))
    ix, iy, iz, io = (ordine.index(k) for k in ('x', 'y', 'z', 'opacity'))
    pts = []
    for i in range(0, n, passo):
        v = S.unpack_from(mm, inizio + i * stride)
        if v[io] < 0: continue
        if alto == 'z': pts.append((v[ix], -v[iy], v[iz]))   # sistema del sito dopo -r 90,0,0
        else: pts.append((v[ix], v[iz], v[iy]))
    return pts, n


def percentile(v, p):
    v = sorted(v); return v[min(len(v) - 1, max(0, int(len(v) * p)))]


def picchi(h, soglia, vicino):
    """Picchi locali di un istogramma {bin: conteggio}: bin >= soglia e massimo nei `vicino` bin intorno."""
    out = []
    for b, c in h.items():
        if c < soglia: continue
        if all(c >= h.get(b + d, 0) for d in range(-vicino, vicino + 1)): out.append(b)
    return sorted(out)


def segmenti(pm, asse, bin_, soglia_rel, lung_min, buco_max):
    """Pareti dritte: picchi lungo `asse` (0 = x, 1 = z); per ognuno i tratti continui lungo l'altro asse. -> [(pos, da, a, n)]"""
    h = Counter(round(p[asse] / bin_) for p in pm)
    if not h: return []
    mx = max(h.values())
    segs = []
    for b in picchi(h, soglia_rel * mx, 2):
        pos = b * bin_
        lungo = sorted(p[1 - asse] for p in pm if abs(p[asse] - pos) <= 0.3)
        if len(lungo) < 50: continue
        da = prec = lungo[0]; cnt = 1
        for q in lungo[1:] + [None]:
            if q is None or q - prec > buco_max:
                if prec - da >= lung_min: segs.append((pos, da, prec, cnt))
                if q is not None: da = q; cnt = 0
            cnt += 1; prec = q if q is not None else prec
    # unisce posizioni quasi uguali (picchi vicini sulla stessa parete): tiene il più denso
    segs.sort(key=lambda s: (s[1], s[0]))
    pul = []
    for s in sorted(segs, key=lambda s: -s[3]):
        if not any(abs(s[0] - t[0]) < 0.5 and not (s[2] < t[1] or s[1] > t[2]) for t in pul): pul.append(s)
    # tratti sulla stessa linea interrotti da porte o finestre (buchi fino a 10 m) diventano una parete sola
    uniti = []
    for s in sorted(pul, key=lambda s: (round(s[0] * 2), s[1])):
        t = uniti[-1] if uniti else None
        if t and abs(s[0] - t[0]) < 0.5 and s[1] - t[2] <= 10.0:
            uniti[-1] = (t[0] if t[3] >= s[3] else s[0], t[1], max(t[2], s[2]), t[3] + s[3])
        else: uniti.append(s)
    return sorted(uniti)


def main():
    ap = argparse.ArgumentParser(description='Ricava la pianta di una stanza da uno splat .ply')
    ap.add_argument('ply'); ap.add_argument('--alto', choices=['z', 'y'], default='z', help='asse verticale del file (Spirula: z)')
    ap.add_argument('--passo', type=int, default=2, help='legge uno splat ogni N (più alto = più veloce)')
    ap.add_argument('--cella', type=float, default=1.0, help='lato delle celle della mappa, in metri')
    ap.add_argument('--json', action='store_true', help='stampa solo la voce da copiare in STANZE')
    ap.add_argument('--origine', help='X,Z (coordinate stampate qui) da mettere nell\'origine; di default il mezzo del corridoio più lungo')
    a = ap.parse_args()
    pts, n = leggi(a.ply, a.passo, a.alto)
    if len(pts) < 1000: sys.exit('splat-pianta: troppo pochi splat letti')
    su = [p[2] for p in pts]
    # pavimento: il bin da 10 cm più popolato nel primo metro sopra il 2° percentile
    p2 = percentile(su, 0.02); h = Counter(round(s * 10) for s in su if p2 <= s <= p2 + 1.0)
    pav = max(h.items(), key=lambda kv: kv[1])[0] / 10; sof = percentile(su, 0.995)
    H = round(max(2.0, sof - pav - 1.5), 1)
    pm = [(x, z) for x, z, s in pts if pav + 0.6 <= s <= pav + 2.2]   # all'altezza dei muri
    pp = [(x, z) for x, z, s in pts if pav - 0.15 <= s <= pav + 0.15]   # sul pavimento
    out = []
    P = out.append
    P(f'File: {a.ply}  ({n} splat, letti {len(pts)} con opacità >= 0.5)')
    P(f'Pavimento a {pav:.2f} m, soffitto (99,5°) a {sof:.2f} m -> H prudente per i controlli: {H} m')
    if abs(pav) > 0.3: P(f'ATTENZIONE: il pavimento non è a 0 (è a {pav:.2f}): sposta lo splat in su/giù con -t 0,{-pav:.2f},0 [il segno di y non è verificato]')

    # mappa dall'alto
    c = a.cella; xs = [p[0] for p in pm]; zs = [p[1] for p in pm]
    x0, x1, z0, z1 = percentile(xs, 0.005), percentile(xs, 0.995), percentile(zs, 0.005), percentile(zs, 0.995)
    W = int((x1 - x0) / c) + 1; Hh = int((z1 - z0) / c) + 1
    muro = defaultdict(int); piano = defaultdict(int)
    for x, z in pm:
        if x0 <= x <= x1 and z0 <= z <= z1: muro[(int((x - x0) / c), int((z - z0) / c))] += 1
    for x, z in pp:
        if x0 <= x <= x1 and z0 <= z <= z1: piano[(int((x - x0) / c), int((z - z0) / c))] += 1
    mx = max(muro.values()) if muro else 1
    P(f'\nMappa dall\'alto: x da {x0:.0f} a {x1:.0f} (colonne), z da {z0:.0f} a {z1:.0f} (righe), celle da {c} m. # parete, + parete rada, . pavimento')
    for r in range(Hh):
        riga = ''
        for q in range(W):
            m = muro.get((q, r), 0)
            riga += '#' if m > 0.25 * mx else '+' if m > 0.06 * mx else '.' if piano.get((q, r), 0) > 3 else ' '
        P(f'{z0 + r * c:7.1f} |{riga}|')

    # pareti dritte
    vert = segmenti(pm, 0, 0.2, 0.3, 4.0, 3.0)   # x costante, si estendono in z
    oriz = segmenti(pm, 1, 0.2, 0.3, 4.0, 3.0)   # z costante, si estendono in x
    P('\nPareti dritte trovate (>= 4 m):')
    for pos, da, a_, k in vert: P(f'  x = {pos:7.2f}   z da {da:7.2f} a {a_:7.2f}   ({k} splat)')
    for pos, da, a_, k in oriz: P(f'  z = {pos:7.2f}   x da {da:7.2f} a {a_:7.2f}   ({k} splat)')

    # corridoi: due pareti parallele a 2,5-8 m che si sovrappongono per >= 10 m
    arms = []
    for lista, asse in ((vert, 'x'), (oriz, 'z')):
        for i, s in enumerate(lista):
            for t in lista[i + 1:]:
                d = abs(t[0] - s[0]); da = max(s[1], t[1]); a_ = min(s[2], t[2])
                if 2.5 <= d <= 8.0 and a_ - da >= 10: arms.append((a_ - da, asse, (s[0] + t[0]) / 2, d, da, a_))
    arms.sort(reverse=True)
    P('\nCorridoi (due pareti parallele a 2,5-8 m, in comune almeno 10 m):')
    if not arms: P('  nessuno: niente origine suggerita')
    for lung, asse, mezzo, d, da, a_ in arms[:8]:
        P(f'  lungo {"z" if asse == "x" else "x"}: asse {asse} = {mezzo:.2f}, larghezza {d:.2f} m, da {da:.1f} a {a_:.1f} ({lung:.0f} m)')

    # contorno esterno e buchi
    lunghe_v = [s for s in vert if s[2] - s[1] >= 15]; lunghe_o = [s for s in oriz if s[2] - s[1] >= 15]
    if len(lunghe_v) < 2 or len(lunghe_o) < 2:
        P('\nContorno: servono almeno due pareti lunghe lungo x e due lungo z: disegna il poligono a mano guardando la mappa.')
        print('\n'.join(out)); return
    ext = [min(s[0] for s in lunghe_v), max(s[0] for s in lunghe_v), min(s[0] for s in lunghe_o), max(s[0] for s in lunghe_o)]   # xmin xmax zmin zmax
    # buco: le pareti interne sono le più vicine al centro; è un cortile se tra la più interna a sinistra e quella a destra c'è molto spazio
    interne_v = sorted(s[0] for s in lunghe_v if ext[0] + 3.0 < s[0] < ext[1] - 3.0)
    interne_o = sorted(s[0] for s in lunghe_o if ext[2] + 3.0 < s[0] < ext[3] - 3.0)
    buco = None
    if len(interne_v) >= 1 and len(interne_o) >= 1:
        # le pareti vicine ai bordi (a meno di 8 m) delimitano gli anelli: il buco sta dentro
        xa = [p for p in interne_v if p - ext[0] <= 8.0]; xb = [p for p in interne_v if ext[1] - p <= 8.0]
        za = [p for p in interne_o if p - ext[2] <= 8.0]; zb = [p for p in interne_o if ext[3] - p <= 8.0]
        if xa and xb and za and zb: buco = (max(xa), min(xb), max(za), min(zb))
    # origine: il corridoio più lungo
    orig = None
    if arms:
        lung, asse, mezzo, d, da, a_ = arms[0]
        orig = (mezzo, (da + a_) / 2) if asse == 'x' else ((da + a_) / 2, mezzo)
    if a.origine: orig = tuple(float(v) for v in a.origine.split(','))
    ox, oz = orig if orig else ((ext[0] + ext[1]) / 2, (ext[2] + ext[3]) / 2)
    lungo_z = bool(arms) and arms[0][1] == 'x' and not a.origine   # il corridoio scelto corre lungo z (altrimenti lungo x)
    tx, tz = -ox, -oz   # sposta l'origine sul punto scelto
    mar = 0.05
    pian = [[ext[0] + mar, ext[2] + mar], [ext[1] - mar, ext[2] + mar], [ext[1] - mar, ext[3] - mar], [ext[0] + mar, ext[3] - mar]]
    r1 = lambda v: round(v, 2)
    P(f'\nContorno esterno: x da {ext[0]:.2f} a {ext[1]:.2f}, z da {ext[2]:.2f} a {ext[3]:.2f}')
    if buco: P(f'Buco (cortile): x da {buco[0]:.2f} a {buco[1]:.2f}, z da {buco[2]:.2f} a {buco[3]:.2f}')
    P(f'Origine: ({ox:.2f}, {oz:.2f}) = {"scelta con --origine" if a.origine else "il mezzo del corridoio più lungo" if arms else "il centro del contorno"}')
    # il segno di x di -t è specchiato: per spostare di +X in x si scrive -X; z è normale
    P(f'Conversione: splat-lab sog FILE.ply -o stanze/NOME.sog -r 90,0,0 -t {r1(-tx)},0,{r1(tz)}')
    P('  (con --alto z; -t ha l\'asse x specchiato. Dopo, rilancia questo strumento sul .sog riconvertito: le pareti devono stare dove scritto qui sotto.)')
    # voce per STANZE, già nel sistema spostato
    sp = lambda p: [r1(p[0] + tx), r1(p[1] + tz)]
    pian_s = [sp(p) for p in pian]
    entry = {'pianta': pian_s}
    if buco:
        bb = [[buco[0] - mar, buco[2] - mar], [buco[1] + mar, buco[2] - mar], [buco[1] + mar, buco[3] + mar], [buco[0] - mar, buco[3] + mar]]
        entry['buchi'] = [[sp(p) for p in bb]]
    entry['H'] = H
    # camera iniziale: 9 m indietro lungo il corridoio, a 2,4 m di altezza, un po' di lato
    vista = {'cam': [1.4, 2.4, -9.0] if lungo_z else [-9.0, 2.4, 1.4], 'mira': [0, 1.1, 0]}
    d = lambda v: json.dumps(v, separators=(', ', ': '))
    righe = [f"  vista: {d(vista)},", f"  par: {{ pianta: {d(entry['pianta'])},"]
    if 'buchi' in entry: righe.append(f"    buchi: {d(entry['buchi'])},")
    righe.append(f"    H: {entry['H']}, fy: 1, fx: 0, fz: 0, frot: 0, rot: 0, x: 0, z: 0, luce: 1, interne: true }}")
    voce = '\n'.join(righe)
    P('\nVoce da adattare in STANZE (configuratore/index.html), nel sistema dopo la conversione (origine sul corridoio):')
    P(voce)
    if a.json: print(voce); return
    print('\n'.join(out))


if __name__ == '__main__':
    main()
