/* Officina delle Bolle: il motore delle forme (geometria, pezzi, sviluppi).
   Lo usano index.html (la pagina completa), guida.html (la guida per cominciare) e configuratore/ (l'Abbofficina,
   che legge solo il codice tra i due segnaposto ENGINE: non cambiateli). Niente interfaccia qui dentro. */
// ENGINE START
const PHI = (1 + Math.sqrt(5)) / 2;
const V3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a) => Math.hypot(a[0], a[1], a[2]),
};
V3.norm = (a) => V3.mul(a, 1 / (V3.len(a) || 1));
const sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
const len2 = (a) => Math.hypot(a[0], a[1]);
const ek = (a, b) => (a < b ? a + "_" + b : b + "_" + a);

function newell(pts) {
  const n = [0, 0, 0];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return n;
}
const polyArea = (pts) => V3.len(newell(pts)) / 2;
const mean3 = (pts) => V3.mul(pts.reduce(V3.add, [0, 0, 0]), 1 / pts.length);

function dedupePoints(pts) {
  const seen = new Map();
  pts.forEach(p => { const k = p.map(c => Math.round(c * 1e6)).join(","); if (!seen.has(k)) seen.set(k, p); });
  return [...seen.values()];
}

/* inviluppo convesso 3D incrementale: restituisce triangoli orientati verso l'esterno */
function convexHull(P) {
  const n = P.length;
  let i0 = 0, i1 = -1, i2 = -1, i3 = -1;
  for (let i = 1; i < n; i++) if (V3.len(V3.sub(P[i], P[i0])) > 1e-7) { i1 = i; break; }
  for (let i = 1; i < n; i++) if (i !== i1 && V3.len(V3.cross(V3.sub(P[i1], P[i0]), V3.sub(P[i], P[i0]))) > 1e-7) { i2 = i; break; }
  const nn = V3.cross(V3.sub(P[i1], P[i0]), V3.sub(P[i2], P[i0]));
  for (let i = 1; i < n; i++) if (Math.abs(V3.dot(V3.norm(nn), V3.sub(P[i], P[i0]))) > 1e-7) { i3 = i; break; }
  if (i1 < 0 || i2 < 0 || i3 < 0) throw new Error("forma piatta");
  const cen = mean3([P[i0], P[i1], P[i2], P[i3]]);
  const mk = (a, b, c) => { const nr = V3.norm(V3.cross(V3.sub(P[b], P[a]), V3.sub(P[c], P[a]))); return { v: [a, b, c], n: nr, d: V3.dot(nr, P[a]) }; };
  const faces = [];
  const addO = (a, b, c) => { let f = mk(a, b, c); if (V3.dot(f.n, cen) - f.d > 0) f = mk(a, c, b); faces.push(f); };
  addO(i0, i1, i2); addO(i0, i1, i3); addO(i0, i2, i3); addO(i1, i2, i3);
  const used = new Set([i0, i1, i2, i3]);
  for (let p = 0; p < n; p++) {
    if (used.has(p)) continue;
    const vis = faces.map(f => V3.dot(f.n, P[p]) - f.d > 1e-9);
    if (!vis.some(Boolean)) continue;
    const edges = new Map();
    faces.forEach((f, k) => { if (!vis[k]) return; for (let j = 0; j < 3; j++) { const a = f.v[j], b = f.v[(j + 1) % 3]; edges.set(a + "," + b, [a, b]); } });
    const horizon = [];
    edges.forEach(([a, b]) => { if (!edges.has(b + "," + a)) horizon.push([a, b]); });
    const keep = faces.filter((f, k) => !vis[k]);
    faces.length = 0; faces.push(...keep);
    horizon.forEach(([a, b]) => faces.push(mk(a, b, p)));
  }
  return faces.map(f => f.v);
}

/* unisce i triangoli complanari vicini in poligoni */
function mergeCoplanar(P, tris) {
  const N = tris.map(t => V3.norm(V3.cross(V3.sub(P[t[1]], P[t[0]]), V3.sub(P[t[2]], P[t[0]]))));
  const parent = tris.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const em = new Map();
  tris.forEach((t, ti) => t.forEach((a, j) => { const k = ek(a, t[(j + 1) % 3]); (em.get(k) || em.set(k, []).get(k)).push(ti); }));
  em.forEach(list => { if (list.length === 2 && V3.dot(N[list[0]], N[list[1]]) > 1 - 1e-7) parent[find(list[0])] = find(list[1]); });
  const groups = new Map();
  tris.forEach((t, i) => { const r = find(i); (groups.get(r) || groups.set(r, []).get(r)).push(t); });
  const out = [];
  groups.forEach(ts => {
    const dir = new Set();
    ts.forEach(t => t.forEach((a, j) => dir.add(a + "," + t[(j + 1) % 3])));
    const next = new Map();
    dir.forEach(e => { const [a, b] = e.split(",").map(Number); if (!dir.has(b + "," + a)) next.set(a, b); });
    const start = next.keys().next().value;
    const poly = [start];
    let cur = next.get(start), guard = 0;
    while (cur !== start && guard++ < 1000) { poly.push(cur); cur = next.get(cur); }
    out.push(poly);
  });
  return out;
}

/* fonde i vertici doppi e toglie quelli non usati */
function weld(V, F) {
  const keys = new Map(), NV = [], map = [];
  V.forEach((p, i) => {
    const k = p.map(c => Math.round(c * 1e6)).join(",");
    if (!keys.has(k)) { keys.set(k, NV.length); NV.push(p); }
    map[i] = keys.get(k);
  });
  const NF = [];
  F.forEach(f => {
    const g = [];
    f.forEach(i => { const j = map[i]; if (g[g.length - 1] !== j) g.push(j); });
    while (g.length > 1 && g[0] === g[g.length - 1]) g.pop();
    if (g.length >= 3 && polyArea(g.map(i => NV[i])) > 1e-10) NF.push(g);
  });
  const used = new Map(), FV = [];
  NF.forEach(f => f.forEach(i => { if (!used.has(i)) { used.set(i, FV.length); FV.push(NV[i]); } }));
  return { V: FV, F: NF.map(f => f.map(i => used.get(i))) };
}

function signedVolume(V, F) {
  let vol = 0;
  F.forEach(f => { for (let j = 1; j < f.length - 1; j++) vol += V3.dot(V[f[0]], V3.cross(V[f[j]], V[f[j + 1]])); });
  return vol / 6;
}

/* rende coerente il verso di tutte le facce, con le normali verso l'esterno */
function orientMesh(V, F0) {
  const F = F0.map(f => f.slice());
  const em = new Map();
  F.forEach((f, fi) => f.forEach((a, j) => { const k = ek(a, f[(j + 1) % f.length]); (em.get(k) || em.set(k, []).get(k)).push(fi); }));
  const seen = new Array(F.length).fill(false);
  for (let s = 0; s < F.length; s++) {
    if (seen[s]) continue;
    seen[s] = true;
    const q = [s];
    while (q.length) {
      const fi = q.shift(), f = F[fi];
      for (let j = 0; j < f.length; j++) {
        const a = f[j], b = f[(j + 1) % f.length];
        for (const gi of em.get(ek(a, b))) {
          if (gi === fi || seen[gi]) continue;
          const g = F[gi], ja = g.indexOf(a);
          if (g[(ja + 1) % g.length] === b) g.reverse();
          seen[gi] = true; q.push(gi);
        }
      }
    }
  }
  if (signedVolume(V, F) < 0) F.forEach(f => f.reverse());
  return { V, F };
}

function rotFromTo(a, b) {
  a = V3.norm(a); b = V3.norm(b);
  const v = V3.cross(a, b), c = V3.dot(a, b);
  if (c < -0.999999) {
    const ax = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const k = V3.norm(V3.cross(a, ax));
    return p => V3.sub(V3.mul(k, 2 * V3.dot(k, p)), p);
  }
  const kk = 1 / (1 + c);
  return p => V3.add(V3.add(V3.mul(p, c), V3.cross(v, p)), V3.mul(v, V3.dot(v, p) * kk));
}

function hull2D(pts) {
  const P = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 1e-12) lo.pop(); lo.push(p); }
  for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 1e-12) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

/* taglia una forma convessa con il piano z = z0 e chiude il taglio con il pavimento */
function cutConvex(V, F, z0) {
  const eps = 1e-5, NV = [], keys = new Map(), ring = [];
  const snap = (p) => (Math.abs(p[2] - z0) <= eps ? [p[0], p[1], z0] : p);
  const id = (p) => { const k = p.map(c => Math.round(c * 1e6)).join(","); if (!keys.has(k)) { keys.set(k, NV.length); NV.push(p); } return keys.get(k); };
  const NF = [];
  for (const f of F) {
    const pts = f.map(i => snap(V[i])), out = [];
    for (let j = 0; j < pts.length; j++) {
      const a = pts[j], b = pts[(j + 1) % pts.length];
      if (a[2] >= z0 - eps) { out.push(a); if (a[2] === z0) ring.push(a); }
      if ((a[2] > z0 + eps && b[2] < z0 - eps) || (a[2] < z0 - eps && b[2] > z0 + eps)) {
        const t = (z0 - a[2]) / (b[2] - a[2]);
        const p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z0];
        out.push(p); ring.push(p);
      }
    }
    if (out.length >= 3 && polyArea(out) > 1e-10) NF.push(out.map(id));
  }
  const cap = hull2D(dedupePoints(ring).map(p => [p[0], p[1]])).reverse();
  NF.push(cap.map(p => id([p[0], p[1], z0])));
  return weld(NV, NF);
}

/* ---------- generatori di forme ---------- */
const signs = (v) => {
  let out = [[]];
  v.forEach(x => { out = out.flatMap(o => (x === 0 ? [[...o, 0]] : [[...o, x], [...o, -x]])); });
  return out;
};
const cyc = (p) => [[p[0], p[1], p[2]], [p[1], p[2], p[0]], [p[2], p[0], p[1]]];
const allCyc = (v) => signs(v).flatMap(cyc);
function unitEdge(pts) {
  pts = dedupePoints(pts);
  let m = Infinity;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const d = V3.len(V3.sub(pts[i], pts[j])); if (d > 1e-9 && d < m) m = d; }
  return pts.map(p => V3.mul(p, 1 / m));
}
const PTS = {
  tet: () => unitEdge([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]),
  cube: () => unitEdge(signs([1, 1, 1])),
  oct: () => unitEdge(allCyc([1, 0, 0])),
  dod: () => unitEdge([...signs([1, 1, 1]), ...allCyc([0, 1 / PHI, PHI])]),
  ico: () => unitEdge(allCyc([0, 1, PHI])),
  tico: () => unitEdge([...allCyc([0, 1, 3 * PHI]), ...allCyc([1, 2 + PHI, 2 * PHI]), ...allCyc([PHI, 2, 2 * PHI + 1])]),
};
function geodesicPoints(freq) {
  const ico = dedupePoints(allCyc([0, 1, PHI])).map(V3.norm);
  const tris = convexHull(ico);
  const pts = [];
  tris.forEach(([a, b, c]) => {
    const A = ico[a], B = ico[b], C = ico[c];
    for (let i = 0; i <= freq; i++) for (let j = 0; j <= freq - i; j++) {
      const p = V3.add(A, V3.add(V3.mul(V3.sub(B, A), i / freq), V3.mul(V3.sub(C, A), j / freq)));
      pts.push(V3.norm(p));
    }
  });
  return dedupePoints(pts);
}
/* punti di un solido a triangoli tutti uguali (disdiakis): vertici del solido di partenza, centri delle sue facce e metà dei suoi spigoli,
   tutti sulla sfera. Con l'icosaedro: 120 triangoli; con l'ottaedro: 48. I punti di metà spigolo vengono prima: appoggiato su uno di quelli,
   il piano a metà altezza è un piano di simmetria, passa lungo gli spigoli e taglia il solido in due metà senza spezzare nessun triangolo */
function catalanPoints(base) {
  const B = fromPoints(base.map(V3.norm)), cen = B.F.map(f => V3.norm(f.reduce((t, i) => V3.add(t, B.V[i]), [0, 0, 0]))), mid = [];
  B.F.forEach(f => f.forEach((a, i) => { const b = f[(i + 1) % f.length]; if (a < b) mid.push(V3.norm(V3.add(B.V[a], B.V[b]))); }));
  return [...mid, ...B.V.map(V3.norm), ...cen];
}
function ngon(n, R, z, rot) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = rot + 2 * Math.PI * i / n; out.push([R * Math.cos(a), R * Math.sin(a), z]); }
  return out;
}
const circumR = (n, s) => s / (2 * Math.sin(Math.PI / n));
const ngRot = (n) => -Math.PI / 2 - Math.PI / n;   // un lato parallelo all'asse x

function fromPoints(pts) {
  pts = dedupePoints(pts);
  const tris = convexHull(pts);
  return weld(pts, mergeCoplanar(pts, tris));
}

function extrude(outline, h, roof, roofH) {
  let o = outline.slice();
  let a2 = 0;
  o.forEach((p, i) => { const q = o[(i + 1) % o.length]; a2 += p[0] * q[1] - q[0] * p[1]; });
  if (a2 < 0) o.reverse();
  const n = o.length, V = [], F = [];
  o.forEach(p => V.push([p[0], p[1], 0]));
  o.forEach(p => V.push([p[0], p[1], h]));
  F.push([...Array(n).keys()].reverse());
  for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
  if (roof === "punta") {
    let cx = 0, cy = 0; o.forEach(p => { cx += p[0] / n; cy += p[1] / n; });
    V.push([cx, cy, h + roofH]);
    for (let i = 0; i < n; i++) F.push([n + i, n + (i + 1) % n, 2 * n]);
  } else {
    F.push([...Array(n).keys()].map(i => n + i));
  }
  return { V, F };
}

/* tubo che segue un percorso orizzontale, con giunti tagliati a metà angolo */
function sweep(path, closed, section) {
  const N = path.length, m = section.length, V = [], F = [];
  const nrm2 = (v) => { const l = len2(v) || 1; return [v[0] / l, v[1] / l]; };
  for (let i = 0; i < N; i++) {
    const hasPrev = closed || i > 0, hasNext = closed || i < N - 1;
    const din = hasPrev ? nrm2(sub2(path[i], path[(i - 1 + N) % N])) : null;
    const dout = hasNext ? nrm2(sub2(path[(i + 1) % N], path[i])) : null;
    const t = din && dout ? nrm2([din[0] + dout[0], din[1] + dout[1]]) : (din || dout);
    const lat = [-t[1], t[0]];
    const seg = din || dout, latSeg = [-seg[1], seg[0]];
    const k = 1 / dot2(lat, latSeg);
    section.forEach(([x, y]) => V.push([path[i][0] + lat[0] * x * k, path[i][1] + lat[1] * x * k, y]));
  }
  const segs = closed ? N : N - 1;
  for (let i = 0; i < segs; i++) {
    const i2 = (i + 1) % N;
    for (let j = 0; j < m; j++) { const j2 = (j + 1) % m; F.push([i * m + j, i * m + j2, i2 * m + j2, i2 * m + j]); }
  }
  if (!closed) { F.push([...Array(m).keys()]); F.push([...Array(m).keys()].map(j => (N - 1) * m + j)); }
  // ogni spicchio del tubo diventa una striscia a sé nello sviluppo
  const cluster = F.map((_, i) => (i < segs * m ? Math.floor(i / m) : "tappo" + i));
  return { V, F, cluster };
}
function tubeSection(m, d, flat) {
  const r = d / 2, off = flat ? -Math.PI / 2 + Math.PI / m : -Math.PI / 2;
  const pts = [];
  for (let j = 0; j < m; j++) { const a = off + 2 * Math.PI * j / m; pts.push([r * Math.cos(a), r * Math.sin(a)]); }
  const minY = Math.min(...pts.map(p => p[1]));
  return pts.map(p => [p[0], p[1] - minY]);
}

/* pianta disegnata a mano: punti in metri sulla griglia dell'editor (y verso il basso, come nello schermo) */
function hexPts(r) { const o = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + Math.PI * i / 3; o.push([Math.round(r * Math.cos(a) * 4) / 4, Math.round(r * Math.sin(a) * 4) / 4]); } return o; }
function planProblem(pts, peaked) {
  if (!Array.isArray(pts) || pts.length < 3) return "Servono almeno 3 punti.";
  const n = pts.length;
  const segX = (a, b, c, d) => { const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
  for (let i = 0; i < n; i++) {
    if (len2(sub2(pts[(i + 1) % n], pts[i])) < 1e-6) return "Due punti vicini sono uno sopra l'altro: spostatene uno.";
    for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (segX(pts[i], pts[(i + 1) % n], pts[j], pts[(j + 1) % n])) return "Due lati della pianta si incrociano: spostate i punti in modo che il contorno non si attraversi."; }
  }
  let a2 = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % n]; a2 += p[0] * q[1] - q[0] * p[1]; });
  if (Math.abs(a2) < 1e-6) return "La pianta non ha area: i punti sono tutti in fila.";
  if (peaked) {
    const c = [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
    for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; if (Math.sign(cross2(sub2(q, p), sub2(c, p))) !== Math.sign(a2)) return "Con questa pianta il tetto a punta non si può fare: dal centro non si vedono tutti i lati. Scegliete il tetto piatto o una pianta più raccolta."; }
  }
  return null;
}
function checkPlan(pts, peaked) { const e = planProblem(pts, peaked); if (e) throw new Error(e); }

const num = (key, label, def, min, step) => ({ key, label, def, min, step: step || 0.05, type: "num" });
const int = (key, label, def, min, max) => ({ key, label, def, min, max, type: "int" });
const pick = (key, label, options, def) => ({ key, label, options, def, type: "pick" });

// forma da un'immagine, prima di caricarne una: un vaso tondo (contorno con il lato più lungo uguale a 1, y in su)
const FOTO_ESEMPIO = (() => {
  const pr = [[0.36, 0], [0.45, 0.1], [0.48, 0.27], [0.44, 0.47], [0.33, 0.64], [0.2, 0.8], [0.09, 0.93], [0, 1]];
  const dx = pr.map(q => [0.48 + q[0], q[1]]), sx = pr.slice(0, -1).reverse().map(q => [0.48 - q[0], q[1]]);
  return dx.concat(sx).map(q => [+q[0].toFixed(4), +q[1].toFixed(4)]);
})();
const SHAPES = [
  { id: "d20", group: "Solidi regolari", name: "Cupola (20 triangoli)", kind: "convex", params: [num("s", "Lato (m)", 2.2, 0.1)], points: p => PTS.ico().map(v => V3.mul(v, p.s)), defOrient: "vertice" },
  { id: "d6", group: "Solidi regolari", name: "Cubo (6 quadrati)", kind: "convex", params: [num("s", "Lato (m)", 2, 0.1)], points: p => PTS.cube().map(v => V3.mul(v, p.s)), defOrient: "faccia" },
  { id: "geo", group: "Solidi regolari", name: "Sfera geodetica (tipo d100)", kind: "convex",
    params: [num("D", "Diametro (m)", 4, 0.5), pick("f", "Quanto è tonda", [["2", "80 triangoli"], ["3", "180 triangoli"], ["4", "320 triangoli"]], "2")],
    points: p => geodesicPoints(+p.f || 2).map(v => V3.mul(v, p.D / 2)), defOrient: "vertice", defCut: 0.25 },   // tagliata a un quarto: resta circa tre quarti di sfera
  { id: "sferaU", group: "Solidi regolari", name: "Sfera di triangoli uguali", kind: "convex",
    params: [num("D", "Diametro (m)", 5, 0.5), pick("n", "Triangoli (sfera intera)", [["120", "120 triangoli"], ["48", "48 triangoli"]], "120")],
    points: p => catalanPoints(p.n === "48" ? PTS.oct() : PTS.ico()).map(v => V3.mul(v, p.D / 2)), defOrient: "vertice", defCut: 0.2 },   // tagliata in basso, a un quinto: resta quasi tutta la sfera
  { id: "calcio", group: "Solidi regolari", name: "Pallone (pentagoni ed esagoni)", kind: "convex", params: [num("D", "Diametro (m)", 6, 0.5)],
    points: p => PTS.tico().map(v => V3.mul(V3.norm(v), p.D / 2)), defOrient: "faccia" },   // la palla da calcio: appoggiata su un esagono, senza taglio
  { id: "d12", group: "Solidi regolari", name: "Dodecaedro (12 pentagoni)", kind: "convex", params: [num("s", "Lato (m)", 1.2, 0.1)], points: p => PTS.dod().map(v => V3.mul(v, p.s)), defOrient: "faccia" },
  { id: "prism", group: "Prismi e piramidi", name: "Prisma (base con n lati)", kind: "convex", natural: true, params: [int("n", "Lati della base", 6, 3, 24), num("s", "Lato della base (m)", 1.5, 0.1), num("h", "Altezza (m)", 2, 0.1)], points: p => [...ngon(p.n, circumR(p.n, p.s), 0, ngRot(p.n)), ...ngon(p.n, circumR(p.n, p.s), p.h, ngRot(p.n))] },
  { id: "pyr", group: "Prismi e piramidi", name: "Piramide (base con n lati)", kind: "convex", natural: true, params: [int("n", "Lati della base", 4, 3, 24), num("s", "Lato della base (m)", 3, 0.1), num("h", "Altezza (m)", 3.3, 0.1)], points: p => [...ngon(p.n, circumR(p.n, p.s), 0, ngRot(p.n)), [0, 0, p.h]] },
  { id: "frus", group: "Prismi e piramidi", name: "Piramide senza punta (tronco)", kind: "convex", natural: true, params: [int("n", "Lati della base", 4, 3, 24), num("s", "Lato in basso (m)", 3, 0.1), num("t", "Lato in alto (m)", 1.2, 0.05), num("h", "Altezza (m)", 3.3, 0.1)], points: p => [...ngon(p.n, circumR(p.n, p.s), 0, ngRot(p.n)), ...ngon(p.n, circumR(p.n, p.t), p.h, ngRot(p.n))] },
  { id: "box", group: "Prismi e piramidi", name: "Parallelepipedo", kind: "convex", natural: true, params: [num("a", "Lunghezza (m)", 3, 0.1), num("b", "Larghezza (m)", 2, 0.1), num("h", "Altezza (m)", 2, 0.1)], points: p => signs([p.a / 2, p.b / 2, 1]).map(v => [v[0], v[1], v[2] > 0 ? p.h : 0]) },
  { id: "L", group: "Forme in pianta", name: "A forma di L", kind: "extrude", params: [num("a", "Lato lungo (m)", 5, 0.5), num("b", "Lato corto (m)", 4, 0.5), num("w", "Larghezza dei bracci (m)", 2, 0.3), num("h", "Altezza (m)", 2.2, 0.3)],
    outline: p => [[0, 0], [p.a, 0], [p.a, p.w], [p.w, p.w], [p.w, p.b], [0, p.b]] },
  { id: "C", group: "Forme in pianta", name: "A forma di C", kind: "extrude", params: [num("b", "Lunghezza della schiena (m)", 6, 1), num("a", "Lunghezza dei bracci (m)", 5, 0.5), num("w", "Larghezza di schiena e bracci (m)", 2, 0.3), num("h", "Altezza (m)", 2.2, 0.3)],
    outline: p => {
      if (2 * p.w >= p.b) throw new Error("La schiena è troppo corta per due bracci così larghi: allungate la schiena o stringete i bracci.");
      if (p.a <= p.w) throw new Error("I bracci devono essere più lunghi della loro larghezza.");
      return [[0, 0], [p.a, 0], [p.a, p.w], [p.w, p.w], [p.w, p.b - p.w], [p.a, p.b - p.w], [p.a, p.b], [0, p.b]];
    } },
  { id: "arrow", group: "Forme in pianta", name: "Freccia", kind: "extrude", params: [num("L", "Lunghezza totale (m)", 6, 1), num("w", "Larghezza dell'asta (m)", 2, 0.3), num("W", "Larghezza della punta (m)", 4, 0.5), num("Lh", "Lunghezza della punta (m)", 2, 0.3), num("h", "Altezza (m)", 2.2, 0.3)],
    outline: p => [[0, -p.w / 2], [p.L - p.Lh, -p.w / 2], [p.L - p.Lh, -p.W / 2], [p.L, 0], [p.L - p.Lh, p.W / 2], [p.L - p.Lh, p.w / 2], [0, p.w / 2]] },
  { id: "custom", group: "Forme in pianta", name: "Pianta disegnata da voi", kind: "extrude",
    params: [{ key: "pts", type: "pts", def: hexPts(3) }, num("h", "Altezza delle pareti (m)", 2.2, 0.3), pick("roof", "Tetto", [["piatto", "Piatto"], ["punta", "A punta"]], "piatto"), num("rh", "Altezza della punta del tetto (m)", 1, 0.1)],
    outline: p => { checkPlan(p.pts, p.roof === "punta"); return p.pts.map(q => [q[0], -q[1]]); } },
  { id: "star", group: "Forme in pianta", name: "Stella", kind: "extrude", params: [int("n", "Punte", 5, 3, 12), num("R", "Raggio delle punte (m)", 3, 0.5), num("r", "Raggio interno (m)", 1.4, 0.3), num("h", "Altezza delle pareti (m)", 2.2, 0.3), pick("roof", "Tetto", [["piatto", "Piatto"], ["punta", "A punta"]], "piatto"), num("rh", "Altezza della punta del tetto (m)", 1, 0.1)],
    outline: p => { const o = []; for (let i = 0; i < 2 * p.n; i++) { const a = Math.PI / 2 + Math.PI * i / p.n, r = i % 2 ? p.r : p.R; o.push([r * Math.cos(a), r * Math.sin(a)]); } return o; } },
  { id: "snake", group: "Tubi e gallerie", name: "Serpente (tubo a zig-zag)", kind: "sweep", params: [num("d", "Diametro del tubo (m)", 2.4, 0.3), int("m", "Lati del tubo", 6, 3, 16), num("s", "Lunghezza di ogni tratto (m)", 1, 0.2), int("c", "Numero di curve", 3, 1, 10), int("k", "Tratti per curva", 4, 1, 12), num("a", "Quanto gira ogni curva (gradi)", 120, 10, 5)],
    build: (p, flat) => {
      const path = [[0, 0]]; let hd = -p.a / 2 * Math.PI / 180; const dl = p.a / p.k * Math.PI / 180;
      for (let c = 0; c < p.c; c++) { const sg = c % 2 ? -1 : 1; for (let j = 0; j < p.k; j++) { const q = path[path.length - 1]; path.push([q[0] + p.s * Math.cos(hd), q[1] + p.s * Math.sin(hd)]); hd += sg * dl; } }
      return sweep(path, false, tubeSection(p.m, p.d, flat));
    } },
  { id: "torus", group: "Tubi e gallerie", name: "Ciambella", kind: "sweep", params: [num("D", "Diametro esterno (m)", 6, 1), num("d", "Diametro del tubo (m)", 2.4, 0.3), int("N", "Spicchi intorno", 12, 3, 32), int("m", "Lati del tubo", 6, 3, 16)],
    build: (p, flat) => {
      const sec = tubeSection(p.m, p.d, flat);
      const xmax = Math.max(...sec.map(q => q[0]));
      const Rm = (p.D / 2 - xmax) * Math.cos(Math.PI / p.N);
      if (Rm <= xmax / Math.cos(Math.PI / p.N) + 1e-6) throw new Error("Il buco al centro è troppo piccolo: aumentate il diametro esterno o riducete il diametro del tubo.");
      const path = []; for (let i = 0; i < p.N; i++) { const a = 2 * Math.PI * i / p.N; path.push([Rm * Math.cos(a), Rm * Math.sin(a)]); }
      return sweep(path, true, sec);
    } },
  { id: "tunnel", group: "Tubi e gallerie", name: "Tunnel (galleria ad arco)", kind: "build", floorToggle: true,
    params: [num("L", "Lunghezza (m)", 4, 0.5), num("w", "Larghezza (m)", 2.4, 0.5), num("hs", "Altezza delle pareti dritte (m)", 1, 0.05), int("k", "Spicchi dell'arco", 6, 2, 24)],
    build: (p) => {
      // sezione: due pareti dritte e un arco a mezzo cerchio, spinta per tutta la lunghezza
      const r = p.w / 2, sec = [[-r, 0], [-r, p.hs]];
      for (let j = 1; j < p.k; j++) { const a = Math.PI - Math.PI * j / p.k; sec.push([r * Math.cos(a), p.hs + r * Math.sin(a)]); }
      sec.push([r, p.hs], [r, 0]);
      return sweep([[0, 0], [p.L, 0]], false, sec);
    } },
  { id: "boat", group: "Forme speciali", name: "Barca (scafo con piramide)", kind: "build", floorToggle: true,
    params: [num("L", "Lunghezza (m)", 5, 1), num("W", "Larghezza del ponte (m)", 2.6, 0.5), num("Lp", "Lunghezza della prua (m)", 1.6, 0.2), num("h", "Altezza dello scafo (m)", 2, 0.3), int("f", "Fondo: larghezza in % del ponte", 60, 20, 100),
      pick("sail", "Piramide sul ponte", [["si", "Sì"], ["no", "No"]], "si"), num("a", "Lato della piramide (m)", 1.4, 0.2), num("hp", "Altezza della piramide (m)", 1.6, 0.2)],
    build: (p) => {
      if (p.Lp >= p.L - 0.2) throw new Error("La prua è lunga quanto tutta la barca: riducete la lunghezza della prua.");
      // ponte: poppa dritta e prua a punta; il fondo è lo stesso contorno rimpicciolito, così le fiancate sono trapezi piani
      const top = [[0, -p.W / 2], [p.L - p.Lp, -p.W / 2], [p.L, 0], [p.L - p.Lp, p.W / 2], [0, p.W / 2]];
      const cx = top.reduce((s, q) => s + q[0], 0) / top.length, k = p.f / 100;
      const V = [], F = [];
      top.forEach(q => V.push([cx + (q[0] - cx) * k, q[1] * k, 0]));
      top.forEach(q => V.push([q[0], q[1], p.h]));
      F.push([4, 3, 2, 1, 0]);
      for (let i = 0; i < 5; i++) F.push([i, (i + 1) % 5, 5 + (i + 1) % 5, 5 + i]);
      if (p.sail === "no") { F.push([5, 6, 7, 8, 9]); return { V, F }; }
      const sx = (p.L - p.Lp) / 2, ha = p.a / 2;
      if (p.a > Math.min(p.W, p.L - p.Lp) * 0.85) throw new Error("La piramide è troppo grande per il ponte: riducete il suo lato.");
      const sq = [[sx - ha, -ha], [sx + ha, -ha], [sx + ha, ha], [sx - ha, ha]];
      const s0 = V.length;
      sq.forEach(q => V.push([q[0], q[1], p.h]));
      V.push([sx, 0, p.h + p.hp]);
      for (let i = 0; i < 4; i++) F.push([s0 + i, s0 + (i + 1) % 4, s0 + 4]);
      // il ponte intorno alla piramide diventa 4 pezzi: ogni angolo della base si collega al vertice del ponte nella sua direzione
      const ang = (q) => Math.atan2(q[1], q[0] - sx);
      const near = sq.map(q => { let best = 0, bd = Infinity; top.forEach((t, j) => { const d = Math.abs(Math.atan2(Math.sin(ang(t) - ang(q)), Math.cos(ang(t) - ang(q)))); if (d < bd) { bd = d; best = j; } }); return best; });
      for (let i = 0; i < 4; i++) {
        const poly = [s0 + i];
        let j = near[i];
        poly.push(5 + j);
        while (j !== near[(i + 1) % 4]) { j = (j + 1) % 5; poly.push(5 + j); }
        poly.push(s0 + (i + 1) % 4);
        F.push(poly);
      }
      return { V, F };
    } },
  { id: "banana", group: "Forme speciali", name: "Banana", kind: "sweep",
    params: [num("L", "Lunghezza del corpo curvo (m)", 5, 1), num("d", "Spessore del corpo (m)", 2.8, 0.3), num("a", "Quanto è curva, da un capo all'altro (gradi)", 110, 10, 5),
      int("N", "Spicchi del corpo (dispari)", 5, 3, 15), int("m", "Facce del tubo (5 = come una banana vera)", 5, 4, 12),
      num("tl", "Lunghezza della punta (m)", 0.9, 0.2), num("sl", "Lunghezza del picciolo (m)", 1.1, 0.2), int("ps", "Spessore del picciolo (% del corpo)", 30, 10, 70),
      pick("pose", "Appoggio", [["giu", "Sdraiata, curva a terra"], ["su", "Con le punte all'insù"]], "giu")],
    build: (p, flat) => bananaMesh(p, flat) },
  { id: "scolo", group: "Forme speciali", name: "Scolopendra", kind: "sweep",
    params: [pick("body", "Corpo", [["onda", "Ondulato"], ["dritto", "Dritto"]], "onda"), int("N", "Segmenti del corpo", 9, 3, 21), num("s", "Lunghezza di ogni segmento (m)", 1, 0.2), num("d", "Larghezza del corpo (m)", 2, 0.3), num("h", "Altezza del corpo (m)", 2.2, 0.3), int("m", "Lati del tubo", 6, 4, 10),
      num("a", "Quanto ondeggia (gradi, solo corpo ondulato)", 25, 0, 5), int("e", "Una coppia di zampe ogni … segmenti", 1, 1, 5), num("lz", "Lunghezza delle zampe (m)", 1.4, 0.2),
      pick("ant", "Antenne", [["si", "Sì"], ["no", "No"]], "si"), num("la", "Lunghezza delle antenne (m)", 2, 0.2),
      pick("pin", "Pinze sulla coda", [["si", "Sì"], ["no", "No"]], "si"), num("lp", "Lunghezza delle pinze (m)", 1.6, 0.2)],
    build: (p, flat) => scoloMesh(p, flat) },
  { id: "balena", group: "Forme speciali", name: "Balena", kind: "build", floorToggle: true,
    params: [num("L", "Lunghezza del corpo (m)", 6.5, 2), num("W", "Larghezza massima (m)", 2.6, 0.5), num("H", "Altezza massima (m)", 2.6, 0.5), int("N", "Segmenti del corpo", 8, 4, 16), int("m", "Lati del tubo", 8, 5, 12),
      int("b", "Bocca: grandezza in % del corpo", 75, 40, 100), num("tl", "Lunghezza della coda (m)", 1.6, 0.3), pick("fin", "Pinne sul dorso e sui fianchi", [["si", "Sì"], ["no", "No"]], "si")],
    build: (p) => balenaMesh(p) },
  { id: "fungo", group: "Forme speciali", name: "Fungo", kind: "build", floorToggle: true,
    params: [int("n", "Lati", 8, 5, 16), num("dg", "Diametro del gambo (m)", 2.6, 0.5), num("hg", "Altezza del gambo (m)", 2.3, 0.3), num("dc", "Diametro del cappello (m)", 5, 1), num("hc", "Altezza del cappello (m)", 1.6, 0.3)],
    build: (p) => fungoMesh(p) },
  { id: "razzo", group: "Forme speciali", name: "Razzo", kind: "build", floorToggle: true,
    params: [int("n", "Lati (multiplo di 4)", 12, 8, 16), num("d", "Diametro (m)", 2.8, 0.5), num("H", "Altezza del corpo (m)", 3.6, 3.2), num("hp", "Altezza della punta (m)", 2, 0.3),
      pick("al", "Alette", [["si", "Sì"], ["no", "No"]], "si"), num("la", "Lunghezza delle alette (m)", 1.5, 0.2), pick("ob", "Oblò", [["si", "Sì"], ["no", "No"]], "si")],
    build: (p) => razzoMesh(p) },
  { id: "tarta", group: "Forme speciali", name: "Tartaruga", kind: "build", floorToggle: true, yaw: -0.6,
    params: [num("Lg", "Lunghezza del guscio (m)", 6, 1), num("D", "Larghezza del guscio (m)", 4.4, 1), num("H", "Altezza del guscio (m)", 2.8, 0.5), num("lt", "Lunghezza di collo e testa (m)", 2, 0.3), num("lz", "Lunghezza delle zampe (m)", 1.1, 0.2), num("lc", "Lunghezza della coda (m)", 0.7, 0.1)],
    build: (p) => tartaMesh(p) },
  { id: "ananas", group: "Forme speciali", name: "Ananas", kind: "build", floorToggle: true,
    params: [int("n", "Lati", 10, 8, 16), num("D", "Diametro (m)", 4, 1), num("H", "Altezza del corpo (m)", 3.4, 2.2), int("nf", "Foglie del ciuffo", 7, 3, 12), num("lf", "Lunghezza delle foglie (m)", 1.6, 0.3)],
    build: (p) => ananasMesh(p) },
  { id: "pera", group: "Forme speciali", name: "Pera", kind: "build", floorToggle: true,
    params: [int("n", "Lati", 14, 8, 20), num("D", "Diametro della pancia grande (m)", 4.4, 1), num("H", "Altezza (m)", 5.2, 3.5), num("dn", "Diametro della parte alta (m)", 2.5, 0.8), num("lp", "Lunghezza del picciolo (m)", 1.1, 0.3), pick("pos", "Forma", [["incl", "Inclinata (più naturale)"], ["dritta", "Dritta (molti meno tipi di pezzo)"]], "incl")],
    build: (p) => peraMesh(p) },
  // forma da un'immagine: la sagoma arriva dalla pagina (Passo 1 → "Crea da un'immagine"); i campi con "when" si vedono solo se servono
  { id: "foto", group: "Dalla vostra immagine", name: "Forma da un'immagine", kind: "build", floorToggle: true,
    params: [{ key: "sag", type: "sagoma", def: FOTO_ESEMPIO },
      pick("modo", "Come leggere l'immagine", [["tonda", "Vista di lato: oggetto tondo"], ["sagoma", "Vista di lato: sagoma con spessore"], ["pianta", "Vista dall'alto: è la pianta"]], "tonda"),
      { ...num("H", "Altezza totale (m)", 3.4, 1, 0.1), when: (p) => p.modo !== "pianta" },
      { ...num("L", "Larghezza della pianta (m)", 6, 1, 0.1), when: (p) => p.modo === "pianta" },
      { ...num("h", "Altezza delle pareti (m)", 2.2, 0.3), when: (p) => p.modo === "pianta" },
      { ...pick("roof", "Tetto", [["cupola", "A cupola"], ["punta", "A punta"], ["piatto", "Piatto"]], "cupola"), when: (p) => p.modo === "pianta" },
      { ...num("rh", "Altezza del tetto (m)", 1.2, 0.1), when: (p) => p.modo === "pianta" && p.roof !== "piatto" },
      { ...int("n", "Lati attorno", 10, 5, 24), when: (p) => p.modo === "tonda" },
      { ...num("s", "Spessore (m)", 2.4, 0.5, 0.1), when: (p) => p.modo === "sagoma" },
      { ...int("cut", "Taglio in basso (% dell'altezza)", 0, 0, 60), when: (p) => p.modo !== "pianta" },
      int("det", "Dettaglio del contorno (1-10)", 4, 1, 10)],
    build: (p) => fotoMesh(p) },
];

/* banana: corpo curvo a spicchi (giunti a metà angolo), da un capo il picciolo stretto e lungo, dall'altro una punta corta e tozza.
   Picciolo e punta sono tronchi di piramide dritti: i pannelli restano piani. */
function bananaMesh(p, flat) {
  const N = p.N % 2 ? p.N : p.N + 1;   // dispari: lo spicchio centrale è dritto
  const up = p.pose === "su";
  if (up && p.a > 300) throw new Error("Con le punte all'insù una curva così forte fa toccare le punte: scendete sotto i 300 gradi.");
  const s = p.L / N, dl = (p.a * Math.PI / 180) / (N - 1);
  const path = [[0, 0]];
  let hd = -dl * (N - 1) / 2;
  for (let j = 0; j < N; j++) { const q = path[path.length - 1]; path.push([q[0] + s * Math.cos(hd), q[1] + s * Math.sin(hd)]); hd += dl; }
  // sezione: sdraiata come il serpente; all'insù col lato piatto (o lo spigolo) sul fianco esterno della curva, che dopo la rotazione va a terra
  let sec;
  if (!up) sec = tubeSection(p.m, p.d, flat);
  else {
    const r = p.d / 2, off = Math.PI + (flat ? Math.PI / p.m : 0);
    sec = []; for (let j = 0; j < p.m; j++) { const a = off + 2 * Math.PI * j / p.m; sec.push([r * Math.cos(a), r * Math.sin(a)]); }
  }
  const P = path.length, m = sec.length;
  const { V, F, cluster } = sweep(path, false, sec);
  F.length -= 2; cluster.length -= 2;   // via i tappi piatti: al loro posto picciolo e punta
  const cx = sec.reduce((t, q) => t + q[0], 0) / m, cy = sec.reduce((t, q) => t + q[1], 0) / m;
  // allunga un capo con anelli sempre più stretti, dritti lungo l'ultimo tratto, poi lo chiude
  const grow = (i, i2, stages, tag) => {
    // "lat" va preso nel verso del percorso, come nello sweep, altrimenti l'anello nuovo risulta girato a specchio
    const dir = sub2(path[i], path[i2]), L = len2(dir), t = [dir[0] / L, dir[1] / L], fw = i === 0 ? [-t[0], -t[1]] : t, lat = [-fw[1], fw[0]];
    let ring = [...Array(m).keys()].map(j => i * m + j), along = 0;
    stages.forEach(([len, sc], k) => {
      along += len;
      const c = [path[i][0] + t[0] * along, path[i][1] + t[1] * along], start = V.length;
      sec.forEach(([x, y]) => { const xs = cx + (x - cx) * sc, ys = cy + (y - cy) * sc; V.push([c[0] + lat[0] * xs, c[1] + lat[1] * xs, ys]); });
      for (let j = 0; j < m; j++) { const j2 = (j + 1) % m; F.push([ring[j], ring[j2], start + j2, start + j]); cluster.push(tag + k); }
      ring = [...Array(m).keys()].map(j => start + j);
    });
    F.push(ring.slice()); cluster.push(tag + "-tappo");
  };
  const ps = p.ps / 100;
  grow(0, 1, [[p.sl * 0.35, ps * 1.25], [p.sl * 0.65, ps]], "picciolo");   // spalla che si stringe, poi il collo dritto
  grow(P - 1, P - 2, [[p.tl * 0.6, 0.55], [p.tl * 0.4, 0.22]], "punta");    // punta corta che si chiude quasi a cono
  if (up) {
    for (let k = 0; k < V.length; k++) { const [x, y, z] = V[k]; V[k] = [x, -z, y]; }
    const z0 = Math.min(...V.map(v => v[2]));
    for (let k = 0; k < V.length; k++) V[k][2] -= z0;
  }
  return { V, F, cluster };
}

/* tronco di piramide che spunta da una faccia: la punta è la stessa faccia rimpicciolita di k e spostata di len·dir,
   così ogni fianco resta un trapezio piano. La faccia di partenza finisce in "removed" e si toglie alla fine con dropFaces. */
function sproutFace(V, F, cluster, removed, fi, dir, len, k, tag) {
  const base = F[fi], fc = mean3(base.map(i => V[i])), start = V.length, n = base.length;
  base.forEach(i => V.push(V3.add(V3.add(fc, V3.mul(dir, len)), V3.mul(V3.sub(V[i], fc), k))));
  for (let j = 0; j < n; j++) { F.push([base[j], base[(j + 1) % n], start + (j + 1) % n, start + j]); cluster.push(tag); }
  F.push([...Array(n).keys()].map(j => start + j)); cluster.push(tag);
  removed.add(fi);
  return V3.add(fc, V3.mul(dir, len));
}
function dropFaces(V, F, cluster, removed) {
  const keep = F.map((_, i) => !removed.has(i));
  return { V, F: F.filter((_, i) => keep[i]), cluster: cluster.filter((_, i) => keep[i]) };
}
/* direzione verso "out" (in pianta) inclinata quanto basta perché la punta arrivi quasi a terra: se la toccasse con tutto
   il bordo, il fianco sotto sarebbe sdraiato sul pavimento e verrebbe contato come pavimento */
function groundDir(V, face, out, len, k, gap) {
  const fc = mean3(face.map(i => V[i])), minRel = Math.min(...face.map(j => V[j][2] - fc[2]));
  const sn = Math.max(-0.3, Math.min(0.8, (fc[2] + k * minRel - gap) / len)), cs = Math.sqrt(1 - sn * sn), h = Math.hypot(out[0], out[1]) || 1;
  return [out[0] / h * cs, out[1] / h * cs, -sn];
}
/* solido "al tornio": anelli di poligoni regolari a n lati, uno per ogni [raggio, quota] dal basso verso l'alto.
   Due anelli vicini sono simili e allineati, quindi le facce fra loro sono trapezi piani; raggio 0 = punta.
   band(i, j) è la faccia j della fascia fra l'anello i e il successivo: con rot = -π/n la faccia 0 guarda avanti (+x). */
function lathe(profile, n, rot) {
  const V = [], F = [], cluster = [], rings = [], bands = [];
  profile.forEach(([r, z]) => {
    if (r < 1e-9) { rings.push([V.length]); V.push([0, 0, z]); return; }
    const s = V.length;
    for (let j = 0; j < n; j++) { const a = rot + 2 * Math.PI * j / n; V.push([r * Math.cos(a), r * Math.sin(a), z]); }
    rings.push([...Array(n).keys()].map(j => s + j));
  });
  if (rings[0].length > 1) { F.push(rings[0].slice().reverse()); cluster.push("base"); }
  for (let i = 0; i < rings.length - 1; i++) {
    const A = rings[i], B = rings[i + 1];
    bands.push([]);
    for (let j = 0; j < n; j++) {
      const j2 = (j + 1) % n;
      bands[i].push(F.length);
      F.push(B.length === 1 ? [A[j], A[j2], B[0]] : A.length === 1 ? [A[0], B[j2], B[j]] : [A[j], A[j2], B[j2], B[j]]);
      cluster.push("fascia" + i);
    }
  }
  const last = rings[rings.length - 1];
  if (last.length > 1) { F.push(last.slice()); cluster.push("cima"); }
  return { V, F, cluster, band: (i, j) => bands[i][((j % n) + n) % n] };
}
// direzione in pianta dal centro verso una faccia (per far spuntare zampe e alette verso l'esterno)
const outOf = (V, face) => { const c = mean3(face.map(i => V[i])), h = Math.hypot(c[0], c[1]) || 1; return [c[0] / h, c[1] / h, 0]; };

/* balena: corpo dritto a tunnel che si allarga dalla bocca e si stringe verso la coda. Gli anelli sono la stessa sezione
   ingrandita attorno al punto in basso al centro, così il pavimento resta piatto e i fianchi sono trapezi piani.
   Coda orizzontale (due tronchi di piramide indietro e in fuori), pinna sul dorso e pinne pettorali. */
function balenaMesh(p) {
  const N = p.N, m = p.m, b = p.b / 100;
  const sec0 = tubeSection(m, p.W, true), top0 = Math.max(...sec0.map(q => q[1]));
  const sec = sec0.map(([x, y]) => [x, y * p.H / top0]);
  const scale = (t) => t < 0.45 ? b + (1 - b) * Math.sin(Math.PI / 2 * t / 0.45) : 1 - 0.65 * Math.pow((t - 0.45) / 0.55, 1.3);
  const V = [], F = [], cluster = [];
  for (let i = 0; i <= N; i++) { const t = i / N, s = scale(t); sec.forEach(([x, y]) => V.push([-p.L * t, x * s, y * s])); }
  for (let i = 0; i < N; i++) for (let j = 0; j < m; j++) { const j2 = (j + 1) % m; F.push([i * m + j, i * m + j2, (i + 1) * m + j2, (i + 1) * m + j]); cluster.push(i); }
  F.push([...Array(m).keys()].reverse()); cluster.push("bocca");
  F.push([...Array(m).keys()].map(j => N * m + j)); cluster.push("coda");
  const removed = new Set();
  // la faccia del segmento i che punta di più nella direzione "want"
  const best = (i, want) => {
    const c = mean3([...Array(2 * m).keys()].map(j => V[i * m + j]));
    let bi = -1, bs = -Infinity;
    for (let j = 0; j < m; j++) { const fi = i * m + j, n = V3.norm(V3.sub(mean3(F[fi].map(k => V[k])), c)), sc = V3.dot(n, want); if (sc > bs) { bs = sc; bi = fi; } }
    return bi;
  };
  // coda: dai fianchi dell'ultimo segmento, indietro e in fuori, appena all'insù
  [1, -1].forEach(sd => sproutFace(V, F, cluster, removed, best(N - 1, [0, sd, 0]), V3.norm([-0.8, 0.6 * sd, 0.08]), p.tl, 0.35, "coda" + sd));
  if (p.fin === "si") {
    sproutFace(V, F, cluster, removed, best(Math.round(N * 0.5), [0, 0, 1]), V3.norm([-0.55, 0, 0.83]), 0.35 * p.H, 0.3, "dorso");
    [1, -1].forEach(sd => { const fi = best(Math.min(1, N - 2), V3.norm([0, sd, -0.6])); sproutFace(V, F, cluster, removed, fi, groundDir(V, F[fi], [-0.35, sd, 0], 0.45 * p.W, 0.4, 0.05 * p.H), 0.45 * p.W, 0.4, "pinna" + sd); });
  }
  return dropFaces(V, F, cluster, removed);
}

/* scolopendra: corpo a segmenti (dritto o a S), testa e coda che si stringono, zampe, antenne e pinze.
   Zampe, antenne e pinze sono tronchi di piramide che nascono da una faccia del tubo (sproutFace). */
function scoloMesh(p, flat) {
  const N = p.N, s = p.s, amp = (p.body === "onda" ? p.a : 0) * Math.PI / 180;
  const path = [[0, 0]];
  for (let i = 0; i < N; i++) { const hd = amp * Math.sin(2 * Math.PI * (i + 0.5) / N), q = path[i]; path.push([q[0] + s * Math.cos(hd), q[1] + s * Math.sin(hd)]); }
  // sezione larga d e alta h: il tubo si stira in verticale, così dentro ci si sta in piedi
  const sec0 = tubeSection(p.m, p.d, flat), top0 = Math.max(...sec0.map(q => q[1]));
  const sec = sec0.map(([x, y]) => [x, y * p.h / top0]), m = sec.length, P = path.length;
  const { V, F, cluster } = sweep(path, false, sec);
  F.length -= 2; cluster.length -= 2;   // via i tappi: al loro posto testa e coda
  const cx = sec.reduce((t, q) => t + q[0], 0) / m, cy = sec.reduce((t, q) => t + q[1], 0) / m;
  const ctr = (idx) => mean3(idx.map(i => V[i]));
  const norm2 = (v) => { const l = len2(v) || 1; return [v[0] / l, v[1] / l]; };
  // un anello più stretto oltre il capo i, poi il tappo; restituisce le facce del tratto nuovo (una per lato del tubo)
  const grow = (i, i2, len, sc, tag) => {
    const t = norm2(sub2(path[i], path[i2])), lat = i === 0 ? [t[1], -t[0]] : [-t[1], t[0]];
    const ring = [...Array(m).keys()].map(j => i * m + j), start = V.length, c = [path[i][0] + t[0] * len, path[i][1] + t[1] * len], faces = [];
    sec.forEach(([x, y]) => { const xs = cx + (x - cx) * sc, ys = cy + (y - cy) * sc; V.push([c[0] + lat[0] * xs, c[1] + lat[1] * xs, ys]); });
    for (let j = 0; j < m; j++) { const j2 = (j + 1) % m; faces.push(F.length); F.push([ring[j], ring[j2], start + j2, start + j]); cluster.push(tag); }
    F.push([...Array(m).keys()].map(j => start + j)); cluster.push(tag + "-tappo");
    return { faces, fw: [t[0], t[1], 0], center: ctr([...ring, ...[...Array(m).keys()].map(j => start + j)]) };
  };
  const removed = new Set(), tips = { L: [], R: [] };
  const sprout = (fi, dir, len, k, tag) => sproutFace(V, F, cluster, removed, fi, dir, len, k, tag);
  const unit = (v) => V3.norm(v);
  // sceglie, su ogni fianco, la faccia bassa (zampe, pinze) o alta (antenne)
  const pickSides = (faces, center, fw, low) => {
    const lat = [-fw[1], fw[0], 0], out = {};
    faces.forEach(fi => {
      const fc = ctr(F[fi]), o = V3.sub(fc, center), side = V3.dot(o, lat) > 0 ? "L" : "R";
      const n = unit(o), lateral = Math.abs(V3.dot(n, lat));
      if (lateral < 0.3) return;                    // fondo o tetto
      if (low ? n[2] > 0.05 : n[2] < -0.05) return;  // fianco basso o alto
      const score = low ? -n[2] + lateral * 0.01 : n[2] + lateral * 0.01;
      if (!out[side] || score > out[side].score) out[side] = { fi, fc, score, out: unit([o[0], o[1], 0]) };
    });
    return out;
  };
  const kz = 0.4;
  for (let i = 0; i < N; i++) {
    if ((N - 1 - i) % p.e) continue;
    const faces = [...Array(m).keys()].map(j => i * m + j), center = ctr([...Array(2 * m).keys()].map(j => i * m + j));
    const fw = [...norm2(sub2(path[i + 1], path[i])), 0];
    const sd = pickSides(faces, center, fw, true);
    ["L", "R"].forEach(side => {
      const f = sd[side];
      if (!f) return;
      tips[side].push(sprout(f.fi, groundDir(V, F[f.fi], f.out, p.lz, kz, 0.05 * Math.min(p.d, p.h)), p.lz, kz, "zampa" + side + i));
    });
  }
  // con il corpo troppo ondulato le zampe sul lato interno della curva si toccano
  ["L", "R"].forEach(side => tips[side].forEach((t, j) => {
    const u = tips[side][j + 1];
    if (u && Math.hypot(u[0] - t[0], u[1] - t[1]) < kz * s * p.e + 0.05) throw new Error("Le zampe sul lato interno della curva si toccano: riducete l'ondulazione, accorciate le zampe o mettetene una coppia ogni 2 segmenti.");
  }));
  const head = grow(P - 1, P - 2, s * 0.5, 0.75, "testa"), tail = grow(0, 1, s * 0.5, 0.6, "coda");
  if (p.ant === "si") {
    const sd = pickSides(head.faces, head.center, head.fw, false);
    ["L", "R"].forEach(side => { const f = sd[side]; if (f) sprout(f.fi, unit(V3.add(V3.add(V3.mul(head.fw, 0.8), V3.mul(f.out, 0.45)), [0, 0, 0.4])), p.la, 0.25, "antenna" + side); });
  }
  if (p.pin === "si") {
    const sd = pickSides(tail.faces, tail.center, tail.fw, true);
    ["L", "R"].forEach(side => { const f = sd[side]; if (f) sprout(f.fi, unit(V3.add(V3.add(V3.mul(tail.fw, 0.85), V3.mul(f.out, 0.45)), [0, 0, -0.05])), p.lp, 0.3, "pinza" + side); });
  }
  return dropFaces(V, F, cluster, removed);
}

/* fungo: gambo (la stanza) e cappello che sporge, con la tesa che scende sotto il bordo */
function fungoMesh(p) {
  const n = p.n, Rg = p.dg / 2, Rc = p.dc / 2, hg = p.hg, hc = p.hc;
  if (Rc * 0.92 < Rg * 0.9 + 0.3) throw new Error("Il cappello deve essere più largo del gambo di almeno 60 cm: aumentate il diametro del cappello.");
  if (hg < 1.9) throw new Error("Il gambo è troppo basso per passarci sotto: almeno 1,9 m.");
  const L = lathe([[Rg, 0], [Rg * 0.9, hg], [Rc * 0.92, hg - 0.25], [Rc, hg + 0.15], [Rc * 0.82, hg + 0.65 * hc], [Rc * 0.45, hg + 0.92 * hc], [0, hg + hc]], n, -Math.PI / n);
  return { V: L.V, F: L.F, cluster: L.cluster };
}

/* razzo: ugello stretto in basso che si allarga nel corpo, corpo tondo (tanti lati), ogiva arrotondata in quattro tratti,
   quattro alette grandi che scendono fino a terra e un oblò sporgente: così non sembra una matita */
function razzoMesh(p) {
  const n = p.n, R = p.d / 2, H = p.H, hp = p.hp;
  if (H < 3.2) throw new Error("Il corpo del razzo deve essere alto almeno 3,2 m: sotto ci sono l'ugello e le alette, sopra l'oblò.");
  if (n % 4) throw new Error("I lati devono essere un multiplo di 4, così le quattro alette stanno alla stessa distanza: 8, 12 o 16.");
  const L = lathe([[R * 0.82, 0], [R, 0.5], [R, 1.6], [R, 2.3], [R, 3.0], [R, H],
    [R * 0.94, H + 0.25 * hp], [R * 0.8, H + 0.5 * hp], [R * 0.55, H + 0.75 * hp], [R * 0.22, H + 0.93 * hp], [0, H + hp]], n, -Math.PI / n);
  const removed = new Set();
  if (p.al === "si") [0, 1, 2, 3].forEach(q => {
    const fi = L.band(1, q * n / 4), f = L.F[fi];
    sproutFace(L.V, L.F, L.cluster, removed, fi, groundDir(L.V, f, outOf(L.V, f), p.la, 0.18, 0.05), p.la, 0.18, "aletta" + q);
  });
  // oblò: un pannello che sporge poco, a metà fra due alette
  if (p.ob === "si") { const fi = L.band(3, Math.round(n / 8)), f = L.F[fi]; sproutFace(L.V, L.F, L.cluster, removed, fi, outOf(L.V, f), 0.08, 0.6, "oblò"); }
  return dropFaces(L.V, L.F, L.cluster, removed);
}

/* tartaruga: guscio ovale e basso che sporge sopra il corpo (la tesa), collo e testa ben fuori davanti, quattro zampe
   a pinna sotto il guscio, coda a punta. L'ovale è il guscio tondo allungato in avanti: allungare in una direzione
   lascia piatti i pannelli. I due fianchi restano liberi per le porte. */
function tartaMesh(p) {
  const R = p.D / 2, H = p.H, sk = 0.7, rim = 1.0;
  if (H < rim + 0.8) throw new Error("Il guscio è troppo basso per entrarci: almeno 1,8 m.");
  if (p.Lg < p.D) throw new Error("Il guscio deve essere lungo almeno quanto è largo.");
  const L = lathe([[0.8 * R, 0], [0.8 * R, sk], [R, sk + 0.15], [R, rim], [0.86 * R, rim + 0.4 * (H - rim)], [0.56 * R, rim + 0.78 * (H - rim)], [0.26 * R, H]], 8, -Math.PI / 8);
  const sx = p.Lg / p.D, V = L.V, F = L.F, C = L.cluster, removed = new Set();
  V.forEach(v => { v[0] *= sx; });
  // collo che sale in avanti, testa più grossa, muso che si stringe: ogni pezzo spunta dalla punta del precedente
  sproutFace(V, F, C, removed, L.band(0, 0), V3.norm([1, 0, 0.95]), p.lt * 0.5, 0.6, "collo");
  sproutFace(V, F, C, removed, F.length - 1, V3.norm([1, 0, 0.2]), p.lt * 0.3, 1.5, "testa");
  sproutFace(V, F, C, removed, F.length - 1, V3.norm([1, 0, -0.15]), p.lt * 0.2, 0.55, "muso");
  sproutFace(V, F, C, removed, L.band(0, 4), V3.norm([-1, 0, -0.1]), p.lc, 0.25, "coda");
  // zampe davanti un po' in avanti, dietro un po' indietro
  [[1, 0.6], [7, 0.6], [3, -0.5], [5, -0.5]].forEach(([j, fw]) => {
    const fi = L.band(0, j), o = outOf(V, F[fi]);
    sproutFace(V, F, C, removed, fi, groundDir(V, F[fi], [o[0] + fw, o[1], 0], p.lz, 0.5, 0.04), p.lz, 0.5, "zampa" + j);
  });
  return dropFaces(V, F, C, removed);
}

/* ananas: corpo a botte (stretto a terra, largo a metà, si richiude in alto) e un ciuffo di foglie lunghe e sottili:
   una al centro della cima, le altre dalla fascia più alta, girate tutte intorno. Si entra da due pannelli opposti in basso. */
function ananasMesh(p) {
  const n = p.n, R = p.D / 2, H = p.H;
  if (H < 2.2) throw new Error("Il corpo dell'ananas deve essere alto almeno 2,2 m per entrarci in piedi.");
  if (p.nf - 1 > n) throw new Error("Troppe foglie: al massimo una per lato, più quella al centro.");
  const L = lathe([[0.75 * R, 0], [0.93 * R, 0.18 * H], [R, 0.42 * H], [0.97 * R, 0.62 * H], [0.82 * R, 0.82 * H], [0.55 * R, 0.95 * H], [0.35 * R, H]], n, -Math.PI / n);
  const V = L.V, F = L.F, C = L.cluster, removed = new Set(), cima = F.length - 1;
  for (let k = 0; k < p.nf - 1; k++) {
    const fi = L.band(5, Math.round(k * n / (p.nf - 1))), o = outOf(V, F[fi]);
    sproutFace(V, F, C, removed, fi, V3.norm([o[0] * 0.55, o[1] * 0.55, 1]), p.lf * 0.85, 0.12, "foglia" + k);
  }
  sproutFace(V, F, C, removed, cima, [0, 0, 1], p.lf, 0.12, "foglia");
  return dropFaces(V, F, C, removed);
}

/* pera: due pance, come una pera vera. Quella grande in basso, una vita stretta e una pancia piccola e tonda in alto;
   tutta appena inclinata in avanti (spostare in x in proporzione all'altezza lascia piani i pannelli). Il picciolo esce
   dalla cima, stretto alla base e piegato in due tratti. Si entra da due pannelli opposti della pancia grande. */
function peraMesh(p) {
  const n = p.n, R = p.D / 2, H = p.H, rb = p.dn / 2, incl = 0.09;
  if (rb > 0.82 * R) throw new Error("La parte alta deve essere più stretta della pancia: riducete il diametro della parte alta.");
  if (H < 3.5) throw new Error("La pera deve essere alta almeno 3,5 m: sotto la vita si deve passare in piedi.");
  // pancia grande bassa e piena che rientra morbida; poi la parte alta, stretta e lunga, si affusola piano fino al picciolo (senza una seconda pancia)
  const L = lathe([[0.6 * R, 0], [0.88 * R, 0.05 * H], [R, 0.16 * H], [0.97 * R, 0.27 * H], [0.86 * R, 0.37 * H], [(0.86 * R + rb) / 2, 0.45 * H], [rb, 0.54 * H],
    [0.97 * rb, 0.64 * H], [0.9 * rb, 0.74 * H], [0.76 * rb, 0.83 * H], [0.54 * rb, 0.91 * H], [0.24 * rb, 0.97 * H]], n, -Math.PI / n);
  const V = L.V, F = L.F, C = L.cluster, removed = new Set();
  if (p.pos !== "dritta") V.forEach(v => { v[0] += incl * v[2]; });   // appena inclinata, come una pera vera (dritta: ogni anello ha i pezzi tutti uguali)
  sproutFace(V, F, C, removed, F.length - 1, V3.norm([0.25, 0, 1]), 0.12, 0.45, "picciolo");   // attacco stretto
  sproutFace(V, F, C, removed, F.length - 1, V3.norm([0.25, 0, 1]), 0.6 * p.lp, 0.95, "picciolo");
  sproutFace(V, F, C, removed, F.length - 1, V3.norm([0.75, 0, 0.66]), 0.4 * p.lp, 0.85, "picciolo");
  return dropFaces(V, F, C, removed);
}

/* forma da un'immagine. La sagoma è il contorno trovato nell'immagine: x a destra, y in su, il lato più lungo del riquadro vale 1.
   Tre letture: "tonda" gira il profilo attorno all'asse (fasce di trapezi uguali, come la pera dritta), "sagoma" la alza di
   uno spessore (pareti dritte), "pianta" la usa come pavimento con pareti dritte e un tetto piatto, a punta o a cupola.
   "det" sceglie quanti punti del contorno restano (più dettaglio, più pezzi). */
const fotoEps = (det) => 0.045 * Math.pow(0.7, det - 1);
function fotoDistSeg(p, a, b) {
  const ab = sub2(b, a), L2 = dot2(ab, ab);
  const t = L2 ? Math.max(0, Math.min(1, dot2(sub2(p, a), ab) / L2)) : 0;
  return len2(sub2(p, [a[0] + ab[0] * t, a[1] + ab[1] * t]));
}
function fotoDP(P, eps) {   // Douglas-Peucker su una linea aperta
  if (P.length < 3) return P.slice();
  const a = P[0], b = P[P.length - 1]; let im = 0, dm = -1;
  for (let i = 1; i < P.length - 1; i++) { const d = fotoDistSeg(P[i], a, b); if (d > dm) { dm = d; im = i; } }
  if (dm <= eps) return [a, b];
  return fotoDP(P.slice(0, im + 1), eps).slice(0, -1).concat(fotoDP(P.slice(im), eps));
}
const fotoArea2 = (P) => P.reduce((s, a, i) => { const b = P[(i + 1) % P.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
function fotoPulisci(P) {   // via i punti doppi e quelli quasi in fila
  for (let pass = 0; pass < 3; pass++) P = P.filter((q, i) => {
    if (P.length <= 3) return true;
    const a = P[(i - 1 + P.length) % P.length], b = P[(i + 1) % P.length], u = sub2(q, a), v = sub2(b, q);
    return len2(u) > 1e-4 && Math.abs(Math.atan2(cross2(u, v), dot2(u, v))) > 0.06;
  });
  return P;
}
// contorno chiuso semplificato, senza lati che si incrociano (se serve, con più dettaglio)
function fotoContorno(sag, eps) {
  for (let k = 0; k < 6; k++, eps *= 0.6) {
    let far = 0, dm = 0;
    sag.forEach((q, i) => { const d = len2(sub2(q, sag[0])); if (d > dm) { dm = d; far = i; } });
    let P = fotoDP(sag.slice(0, far + 1), eps).slice(0, -1).concat(fotoDP(sag.slice(far).concat([sag[0]]), eps).slice(0, -1));
    // i due punti da cui si è partiti restano vertici anche in mezzo a un lato: si tolgono se il lato senza di loro va bene lo stesso
    for (const j of [P.indexOf(sag[far]), 0].filter(j => j >= 0).sort((a, b) => b - a)) {
      if (P.length <= 3) break;
      const a = P[(j - 1 + P.length) % P.length], b = P[(j + 1) % P.length];
      if (fotoDistSeg(P[j], a, b) <= eps) P.splice(j, 1);
    }
    P = fotoPulisci(P);
    if (P.length >= 3 && !planProblem(P, false)) return fotoArea2(P) < 0 ? P.reverse() : P;
  }
  throw new Error("Il contorno dell'immagine si incrocia da solo: provate un'immagine più pulita o un dettaglio diverso.");
}
// larghezza della sagoma all'altezza y: dal primo all'ultimo punto in cui la linea orizzontale la attraversa
function fotoLarghezza(P, y) {
  let x0 = Infinity, x1 = -Infinity;
  P.forEach((a, i) => { const b = P[(i + 1) % P.length]; if ((a[1] > y) !== (b[1] > y)) { const x = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); x0 = Math.min(x0, x); x1 = Math.max(x1, x); } });
  return x1 > x0 ? { w: x1 - x0, m: (x0 + x1) / 2 } : { w: 0, m: 0 };
}
// la parte della sagoma sopra y0 (può dividersi in più pezzi: si tiene il più grande). P in senso antiorario.
function fotoTagliaSotto(P, y0) {
  if (P.some(q => Math.abs(q[1] - y0) < 1e-9)) y0 += 1e-7;
  const n = P.length, sopra = P.map(q => q[1] > y0);
  if (sopra.every(Boolean)) return P.slice();
  if (!sopra.some(Boolean)) return null;
  // catene sopra il taglio: dall'entrata (sale) all'uscita (scende)
  const X = (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0];
  const catene = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n; if (sopra[i] || !sopra[j]) continue;
    const c = [X(P[i], P[j])]; let k = j;
    while (sopra[k]) { c.push(P[k]); k = (k + 1) % n; }
    c.push(X(P[(k - 1 + n) % n], P[k]));
    catene.push(c);
  }
  // un'uscita si richiude con l'entrata più vicina verso destra (il dentro è a sinistra di chi cammina)
  const usata = new Array(catene.length).fill(false), pezzi = [];
  for (let s = 0; s < catene.length; s++) {
    if (usata[s]) continue;
    const pz = []; let c = s;
    for (let g = 0; g < catene.length && !usata[c]; g++) {
      usata[c] = true; pz.push(...catene[c]);
      const ex = catene[c][catene[c].length - 1][0]; let best = -1, bx = Infinity;
      catene.forEach((d, t) => { const x = d[0][0]; if (x > ex - 1e-12 && x < bx) { bx = x; best = t; } });
      if (best < 0) break; c = best;
    }
    if (pz.length >= 3) pezzi.push(pz);
  }
  pezzi.sort((a, b) => Math.abs(fotoArea2(b)) - Math.abs(fotoArea2(a)));
  return pezzi.length ? fotoPulisci(pezzi[0]) : null;
}
// tetto a cupola sopra una pianta: anelli che si stringono verso il centro (ogni pannello resta un trapezio piano)
function cupolaExtrude(o, h, rh) {
  const n = o.length, a2 = fotoArea2(o);
  let cx = 0, cy = 0;
  o.forEach((p, i) => { const q = o[(i + 1) % n], c = p[0] * q[1] - q[0] * p[1]; cx += (p[0] + q[0]) * c; cy += (p[1] + q[1]) * c; });
  const c = [cx / (3 * a2), cy / (3 * a2)];
  for (let i = 0; i < n; i++) if (cross2(sub2(o[(i + 1) % n], o[i]), sub2(c, o[i])) <= 1e-9)
    throw new Error("Con questa pianta la cupola non si può fare: dal centro non si vedono tutti i lati. Scegliete il tetto piatto.");
  const ang = [0, 32, 58, 78].map(d => d * Math.PI / 180), V = [], F = [];
  o.forEach(p => V.push([p[0], p[1], 0]));
  ang.forEach(t => { const s = Math.cos(t), z = h + rh * Math.sin(t); o.forEach(p => V.push([c[0] + (p[0] - c[0]) * s, c[1] + (p[1] - c[1]) * s, z])); });
  F.push([...Array(n).keys()].reverse());
  for (let r = 0; r < ang.length; r++) for (let i = 0; i < n; i++) { const A = r * n, B = (r + 1) * n; F.push([A + i, A + (i + 1) % n, B + (i + 1) % n, B + i]); }
  F.push([...Array(n).keys()].map(i => ang.length * n + i));
  return { V, F };
}
function fotoMesh(p) {
  const sag = p.sag, eps = fotoEps(p.det);
  if (!Array.isArray(sag) || sag.length < 3) throw new Error("Manca la sagoma: caricate un'immagine.");
  const ys = sag.map(q => q[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), alto = y1 - y0;
  if (p.modo === "pianta") {
    const o = fotoContorno(sag, eps), xs = o.map(q => q[0]), k = p.L / (Math.max(...xs) - Math.min(...xs));
    const pts = o.map(q => [q[0] * k, q[1] * k]);
    if (p.roof === "cupola") return cupolaExtrude(pts, p.h, p.rh);
    checkPlan(pts, p.roof === "punta");
    return extrude(pts, p.h, p.roof, p.rh);
  }
  if (alto < 1e-6) throw new Error("La sagoma non ha altezza.");
  // sempre almeno un taglio dell'1,5%: i piedi di un disegno non finiscono mai tutti alla stessa riga di pixel
  const zc = y0 + alto * Math.max(0.015, p.cut / 100), k = p.H / (y1 - zc);
  if (p.modo === "sagoma") {
    const P = fotoTagliaSotto(fotoContorno(sag, eps), zc);
    if (!P || P.length < 3) throw new Error("Dopo il taglio in basso non resta niente: abbassate il taglio.");
    const xs = P.map(q => q[0]), xm = (Math.min(...xs) + Math.max(...xs)) / 2;
    const { V, F } = extrude(P.map(q => [(q[0] - xm) * k, (q[1] - zc) * k]), p.s);
    return { V: V.map(v => [v[0], v[2] - p.s / 2, v[1]]), F };   // la sagoma in piedi, lo spessore in profondità
  }
  // tonda: la larghezza a ogni altezza dà il raggio; il profilo si semplifica come il contorno
  const N = 90, prof = [];
  for (let j = 0; j <= N; j++) {
    const y = zc + (y1 - zc) * (j === N ? 0.999 : j / N + (j ? 0 : 1e-4)), w = fotoLarghezza(sag, y).w / 2;
    prof.push([w, j ? y : zc]);   // la larghezza si misura appena sopra il taglio, ma l'anello di base sta a terra
  }
  const rMax = Math.max(...prof.map(q => q[0]));
  if (rMax < 1e-6) throw new Error("La sagoma non ha larghezza.");
  if (prof[0][0] < 0.08 * rMax) throw new Error("In basso la forma finisce a punta e non sta in piedi: alzate il taglio in basso.");
  prof[N] = prof[N][0] < 0.15 * rMax ? [0, y1] : [prof[N][0], y1];
  let pr = fotoDP(prof, eps * 0.8).filter((q, i, a) => !i || Math.hypot(q[0] - a[i - 1][0], q[1] - a[i - 1][1]) > 1e-6);
  pr = pr.map((q, i) => (q[0] < 0.02 * rMax && i < pr.length - 1 ? [0.02 * rMax, q[1]] : q));   // solo la cima può chiudersi in un punto
  if (pr.length < 2) throw new Error("Il profilo è troppo semplice: alzate il dettaglio.");
  const L = lathe(pr.map(q => [q[0] * k, (q[1] - zc) * k]), p.n, -Math.PI / p.n);
  return { V: L.V, F: L.F, cluster: L.cluster };
}

function orientOptions(def, V, F) {
  if (def.natural) return [{ id: "base", label: "Sulla base" }];
  const areas = F.map(f => polyArea(f.map(i => V[i])));
  const mx = Math.max(...areas), mn = Math.min(...areas);
  const o = [{ id: "faccia", label: mn < mx * 0.98 ? "Su una faccia grande" : "Su una faccia" }];
  if (mn < mx * 0.98) o.push({ id: "faccia-p", label: "Su una faccia piccola" });
  o.push({ id: "vertice", label: "Su un vertice (una punta in basso)" }, { id: "spigolo", label: "Su uno spigolo" });
  return o;
}

function buildShape(def, p, opt) {
  let V, F, levels = [], orients = [], cutUsed = false, cluster = null;
  if (def.kind === "convex") {
    ({ V, F } = fromPoints(def.points(p)));
    orients = orientOptions(def, V, F);
    const o = orients.find(x => x.id === opt.orient) || orients.find(x => x.id === def.defOrient) || orients[0];
    opt.orient = o.id;
    if (o.id !== "base") {
      const c = mean3(V);
      let feat;
      if (o.id === "vertice") feat = V[0];
      else if (o.id === "spigolo") feat = mean3([V[F[0][0]], V[F[0][1]]]);
      else {
        const areas = F.map(f => polyArea(f.map(i => V[i])));
        const target = o.id === "faccia" ? Math.max(...areas) : Math.min(...areas);
        const fi = areas.findIndex(a => Math.abs(a - target) < 1e-9 * Math.max(1, target));
        feat = mean3(F[fi].map(i => V[i]));
      }
      const R = rotFromTo(V3.sub(feat, c), [0, 0, -1]);
      V = V.map(v => R(V3.sub(v, c)));
    }
    const z0 = Math.min(...V.map(v => v[2]));
    V = V.map(v => [v[0], v[1], v[2] - z0]);
    const zs = [...new Set(V.map(v => Math.round(v[2] * 1e6) / 1e6))].sort((a, b) => a - b);
    const top = zs[zs.length - 1];
    if (V.filter(v => v[2] < 1e-6).length >= 3) levels.push({ z: 0, label: "Nessun taglio (appoggiata su una faccia)" });
    zs.slice(1, -1).forEach((z, i) => levels.push({ z, label: `Taglio ${i + 1}: toglie il ${Math.round(z / top * 100)}% dell'altezza` }));
    if (opt._nLev != null && opt._nLev !== levels.length) opt.level = null;   // cambiano i livelli (la sfera da 80 a 180 triangoli): si riparte dal taglio di partenza
    opt._nLev = levels.length;
    if (opt.level == null || opt.level >= levels.length) {
      if (def.defCut === "half" || typeof def.defCut === "number") { const zc = top * (def.defCut === "half" ? 0.5 : def.defCut); let best = 0; levels.forEach((L, i) => { if (Math.abs(L.z - zc) < Math.abs(levels[best].z - zc)) best = i; }); opt.level = best; }
      else opt.level = levels.length && levels[0].z === 0 && levels.length > 1 ? 1 : 0;
    }
    if (opt.cut && levels.length && levels[opt.level].z > 0) {
      ({ V, F } = cutConvex(V, F, levels[opt.level].z));
      const zm = Math.min(...V.map(v => v[2]));
      V = V.map(v => [v[0], v[1], v[2] - zm]);
      cutUsed = true;
    }
  } else if (def.kind === "extrude") {
    ({ V, F } = extrude(def.outline(p), p.h, p.roof, p.rh));
  } else {
    ({ V, F, cluster } = def.build(p, opt.cut));
  }
  const nBefore = F.length;
  ({ V, F } = weld(V, F));
  if (F.length !== nBefore) cluster = null;
  ({ V, F } = orientMesh(V, F));
  // centra in pianta
  let cx = 0, cy = 0;
  const xs = V.map(v => v[0]), ys = V.map(v => v[1]);
  cx = (Math.min(...xs) + Math.max(...xs)) / 2; cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  V = V.map(v => [v[0] - cx, v[1] - cy, v[2]]);
  const isFloor = (f) => { const n = V3.norm(newell(f.map(i => V[i]))); return n[2] < -0.9999 && f.every(i => V[i][2] < 1e-6); };
  let floorArea = 0;
  F.forEach(f => { if (isFloor(f)) floorArea += polyArea(f.map(i => V[i])); });
  let volume = signedVolume(V, F);
  let k = 1;
  if (opt.fit && floorArea > 1e-9 && opt.fitArea > 0) {
    k = Math.sqrt(opt.fitArea / floorArea);
    V = V.map(v => V3.mul(v, k));
    floorArea *= k * k; volume *= k * k * k;
  }
  let open = false;
  if ((def.kind === "extrude" || def.floorToggle) && !opt.cut) {
    const keep = F.map(f => !isFloor(f));
    F = F.filter((f, i) => keep[i]);
    if (cluster) cluster = cluster.filter((c, i) => keep[i]);
    const n0 = F.length;
    open = true; ({ V, F } = weld(V, F));
    if (F.length !== n0) cluster = null;
  }
  const floor = F.map(isFloor);
  return { V, F, floor, floorArea, volume, k, levels, orients, open, cutUsed, cluster };
}

/* ---------- pezzi ---------- */
function faceFrame(V, f) {
  const P = f.map(i => V[i]);
  const n = V3.norm(newell(P));
  const u = V3.norm(V3.sub(P[1], P[0]));
  const w = V3.cross(n, u);
  return P.map(p => { const d = V3.sub(p, P[0]); return [V3.dot(d, u), V3.dot(d, w)]; });
}
function polySig(pts) {
  const n = pts.length, ang = [], len = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n], cur = pts[i], next = pts[(i + 1) % n];
    const b = sub2(next, cur), a = sub2(prev, cur);
    let t = Math.atan2(cross2(b, a), dot2(b, a)); if (t < 0) t += 2 * Math.PI;
    ang.push(Math.round(t * 1800 / Math.PI));
    len.push(Math.round(len2(b) * 1000));
  }
  const best = (tok) => { let m = null; for (let r = 0; r < tok.length; r += 2) { const s = tok.slice(r).concat(tok.slice(0, r)).join(","); if (m === null || s < m) m = s; } return m; };
  const fwd = []; for (let i = 0; i < n; i++) fwd.push("a" + ang[i], "e" + len[i]);
  const rev = []; for (let i = n - 1; i >= 0; i--) rev.push("a" + ang[i], "e" + len[(i - 1 + n) % n]);
  const d = best(fwd), r = best(rev);
  return { sig: d < r ? d : r, direct: d };
}
function groupPieces(V, F, floor) {
  const groups = new Map();
  F.forEach((f, fi) => {
    const pts = faceFrame(V, f);
    const { sig, direct } = polySig(pts);
    if (!groups.has(sig)) groups.set(sig, { pts, faces: [], floors: 0, directs: new Set() });
    const g = groups.get(sig);
    g.faces.push(fi); if (floor[fi]) g.floors++; g.directs.add(direct);
  });
  return [...groups.values()].sort((a, b) => b.floors - a.floors || b.faces.length - a.faces.length);
}
/* coordinate per tracciare: lato più lungo sul bordo esterno come base AB, tutti i punti sopra */
function baselineCoords(pts) {
  const n = pts.length;
  let best = -1, bl = -1;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], e = sub2(b, a), L = len2(e);
    let ok = true;
    for (let j = 0; j < n; j++) if (cross2(e, sub2(pts[j], a)) < -1e-9 * L) { ok = false; break; }
    if (ok && L > bl + 1e-9) { bl = L; best = i; }
  }
  if (best < 0) best = 0;
  const a = pts[best], e = sub2(pts[(best + 1) % n], a), L = len2(e), u = [e[0] / L, e[1] / L];
  const out = [];
  for (let k = 0; k < n; k++) { const p = pts[(best + k) % n], d = sub2(p, a); out.push([dot2(d, u), cross2(u, d)]); }
  return out;
}

/* ---------- sviluppo ---------- */
function triangulate(poly) {
  const idx = poly.map((_, i) => i), tris = [];
  const inTri = (p, a, b, c) => cross2(sub2(b, a), sub2(p, a)) > 1e-12 && cross2(sub2(c, b), sub2(p, b)) > 1e-12 && cross2(sub2(a, c), sub2(p, c)) > 1e-12;
  let guard = 0;
  while (idx.length > 3 && guard++ < 5000) {
    let found = false;
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k - 1 + idx.length) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length];
      const a = poly[i0], b = poly[i1], c = poly[i2];
      if (cross2(sub2(b, a), sub2(c, a)) <= 1e-12) continue;
      let inside = false;
      for (const j of idx) { if (j === i0 || j === i1 || j === i2) continue; if (inTri(poly[j], a, b, c)) { inside = true; break; } }
      if (inside) continue;
      tris.push([i0, i1, i2]); idx.splice(k, 1); found = true; break;
    }
    if (!found) break;
  }
  if (idx.length === 3) tris.push(idx.slice());
  return tris;
}
function triOverlap(t1, t2, eps) {
  for (const t of [t1, t2]) for (let i = 0; i < 3; i++) {
    const a = t[i], b = t[(i + 1) % 3];
    let ax = [a[1] - b[1], b[0] - a[0]]; const L = len2(ax); ax = [ax[0] / L, ax[1] / L];
    let n1 = Infinity, x1 = -Infinity, n2 = Infinity, x2 = -Infinity;
    t1.forEach(p => { const d = dot2(p, ax); n1 = Math.min(n1, d); x1 = Math.max(x1, d); });
    t2.forEach(p => { const d = dot2(p, ax); n2 = Math.min(n2, d); x2 = Math.max(x2, d); });
    if (x1 <= n2 + eps || x2 <= n1 + eps) return false;
  }
  return true;
}
function unfold(V, F, floor, cluster) {
  const frames = F.map(f => faceFrame(V, f));
  const tri = frames.map(triangulate);
  const edgeFaces = new Map();
  F.forEach((f, fi) => f.forEach((a, j) => { const k = ek(a, f[(j + 1) % f.length]); (edgeFaces.get(k) || edgeFaces.set(k, []).get(k)).push(fi); }));
  const elens = []; F.forEach(f => f.forEach((a, j) => elens.push(V3.len(V3.sub(V[a], V[f[(j + 1) % f.length]])))));
  elens.sort((a, b) => a - b);
  const med = elens[Math.floor(elens.length / 2)], eps = med * 1e-6;
  const placed = new Array(F.length).fill(null), tree = new Set(), islands = [];
  const areas = F.map(f => polyArea(f.map(i => V[i])));
  const order = F.map((_, i) => i).sort((a, b) => (floor[b] - floor[a]) || (areas[b] - areas[a]));
  for (const root of order) {
    if (placed[root]) continue;
    const isl = { faces: [], tris: [] };
    islands.push(isl);
    const put = (fi, pts) => { placed[fi] = { island: islands.length - 1, pts }; isl.faces.push(fi); tri[fi].forEach(t => isl.tris.push(t.map(i => pts[i]))); };
    put(root, frames[root]);
    const q = [root];
    while (q.length) {
      const fi = q.shift(), f = F[fi], P = placed[fi].pts;
      for (let j = 0; j < f.length; j++) {
        const a = f[j], b = f[(j + 1) % f.length], key = ek(a, b);
        for (const gi of edgeFaces.get(key)) {
          if (gi === fi || placed[gi]) continue;
          if (cluster && cluster[gi] !== cluster[fi]) continue;
          const g = F[gi], Q = frames[gi];
          const ga = g.indexOf(a), gb = g.indexOf(b);
          const Pa = P[j], Pb = P[(j + 1) % f.length];
          const ang = Math.atan2(Pa[1] - Pb[1], Pa[0] - Pb[0]) - Math.atan2(Q[ga][1] - Q[gb][1], Q[ga][0] - Q[gb][0]);
          const c = Math.cos(ang), s = Math.sin(ang);
          const pts = Q.map(q0 => { const d = sub2(q0, Q[gb]); return [Pb[0] + c * d[0] - s * d[1], Pb[1] + s * d[0] + c * d[1]]; });
          const newT = tri[gi].map(t => t.map(i => pts[i]));
          let clash = false;
          for (const t1 of newT) { for (const t2 of isl.tris) if (triOverlap(t1, t2, eps)) { clash = true; break; } if (clash) break; }
          if (clash) continue;
          put(gi, pts); tree.add(key); q.push(gi);
        }
      }
    }
  }
  // gira ogni gruppo in modo che occupi il rettangolo più piccolo, disteso in orizzontale
  islands.forEach(isl => {
    const pts = isl.faces.flatMap(fi => placed[fi].pts);
    const angs = [];
    isl.faces.slice(0, 40).forEach(fi => { const q = placed[fi].pts; q.forEach((p, i) => { const r = q[(i + 1) % q.length]; angs.push(-Math.atan2(r[1] - p[1], r[0] - p[0])); }); });
    let best = 0, bestA = Infinity, bestWide = true;
    angs.forEach(t => {
      const c = Math.cos(t), sn = Math.sin(t);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      pts.forEach(p => { const x = c * p[0] - sn * p[1], y = sn * p[0] + c * p[1]; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
      const A = (x1 - x0) * (y1 - y0);
      if (A < bestA - 1e-9) { bestA = A; best = t; bestWide = x1 - x0 >= y1 - y0; }
    });
    if (!bestWide) best += Math.PI / 2;
    const c = Math.cos(best), sn = Math.sin(best);
    isl.faces.forEach(fi => { placed[fi].pts = placed[fi].pts.map(p => [c * p[0] - sn * p[1], sn * p[0] + c * p[1]]); });
  });
  const seams = [];
  edgeFaces.forEach((list, key) => { if (list.length === 2 && !tree.has(key)) seams.push({ key, faces: list }); });
  return { placed, islands, tree, seams, edgeFaces, med };
}


/* ---------- lettere, codici dei pezzi e giunzioni ---------- */
function matchLetters(pts, C) {
  const n = pts.length, size = Math.max(...C.map(p => Math.hypot(p[0], p[1]))) || 1, tol = size * 2e-3;
  for (const dir of [1, -1]) for (let s = 0; s < n; s++) {
    const idx = (k) => (((s + dir * k) % n) + n) % n;
    const a = pts[idx(0)], e = sub2(pts[idx(1)], a), L = len2(e), u = [e[0] / L, e[1] / L];
    let ok = true;
    for (let k = 0; k < n && ok; k++) {
      const d = sub2(pts[idx(k)], a), x = dot2(d, u), y = dir * cross2(u, d);
      if (Math.abs(x - C[k][0]) > tol || Math.abs(y - C[k][1]) > tol) ok = false;
    }
    if (ok) { const letters = []; for (let k = 0; k < n; k++) letters[idx(k)] = k; return { letters, mirror: dir === -1 }; }
  }
  return { letters: pts.map((_, i) => i), mirror: false, fail: true };
}
function minWidth(C) {
  const H = hull2D(C);
  let best = { w: Infinity, l: 0 };
  for (let i = 0; i < H.length; i++) {
    const a = H[i], e = sub2(H[(i + 1) % H.length], a), L = len2(e), u = [e[0] / L, e[1] / L];
    let x0 = Infinity, x1 = -Infinity, y1 = 0;
    C.forEach(p => { const d = sub2(p, a); const x = dot2(d, u), y = Math.abs(cross2(u, d)); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    if (y1 < best.w) best = { w: y1, l: x1 - x0 };
  }
  return best;
}
function analyze(V, F, floor) {
  const cz = F.map(f => mean3(f.map(i => V[i])));
  const types = groupPieces(V, F, floor).map(g => ({
    C: baselineCoords(g.pts), faces: g.faces.slice(), floors: g.floors,
    zmin: Math.min(...g.faces.map(fi => cz[fi][2])),
  }));
  types.sort((a, b) => ((b.floors > 0) - (a.floors > 0)) || (a.zmin - b.zmin) || (b.faces.length - a.faces.length));
  const faceInfo = [];
  const az = (p) => Math.atan2(p[1], p[0]);
  types.forEach((t, ti) => {
    t.faces.sort((a, b) => (Math.round(cz[a][2] * 1000) - Math.round(cz[b][2] * 1000)) || (az(cz[a]) - az(cz[b])));
    t.mirrorCount = 0;
    t.faces.forEach((fi, k) => {
      const m = matchLetters(faceFrame(V, F[fi]), t.C);
      if (m.mirror) t.mirrorCount++;
      faceInfo[fi] = { type: ti, copy: k, id: `P${ti + 1}-${k + 1}`, letters: m.letters, mirror: m.mirror };
    });
  });
  const N = F.map(f => V3.norm(newell(f.map(i => V[i]))));
  const em = new Map();
  F.forEach((f, fi) => f.forEach((a, j) => { const b = f[(j + 1) % f.length], k = ek(a, b); (em.get(k) || em.set(k, []).get(k)).push({ fi, a, b }); }));
  const seams = [], rims = [];
  em.forEach((list, key) => {
    const A = V[list[0].a], B = V[list[0].b], len = V3.len(V3.sub(A, B)), mid = V3.mul(V3.add(A, B), 0.5);
    if (list.length !== 2) { rims.push({ key, len, side: list[0] }); return; }
    const [p, q] = list;
    const th = Math.acos(Math.max(-1, Math.min(1, V3.dot(N[p.fi], N[q.fi]))));
    const conv = V3.dot(N[p.fi], V3.sub(cz[q.fi], A)) < 0;
    const dih = th < 1e-6 ? 180 : (conv ? 180 - th * 180 / Math.PI : 180 + th * 180 / Math.PI);
    seams.push({ key, len, zmid: mid[2], az: az(mid), p, q, dih, floor: !!(floor[p.fi] || floor[q.fi]) });
  });
  seams.sort((x, y) => ((y.floor - x.floor)) || (Math.round(x.zmid * 1000) - Math.round(y.zmid * 1000)) || (x.az - y.az));
  seams.forEach((s, i) => { s.no = i + 1; });
  const seamNo = new Map(seams.map(s => [s.key, s.no]));
  return { types, faceInfo, seams, rims, seamNo };
}
// ENGINE END

/* ---------- fuori dai segnaposto: servono alle pagine (index.html, guida.html), non all'Abbofficina ---------- */

/* porte realistiche: per una porta da 1,80 m la bolla deve essere alta almeno 1,95 m dove c'è la porta (come chiede il configuratore).
   Nelle piramidi la porta sta su una faccia inclinata: conta il 55% dell'altezza (72% con la cima piatta), come nel configuratore. */
/* dove vanno le porte e quanto possono essere alte: lo stesso calcolo del configuratore (formaOfficina, altezzaPorta e PORTE_OFF
   in configuratore/index.html), così l'avviso qui e l'ingrandimento là dicono la stessa cosa. Se si cambia lì, va cambiato anche qui. */
const PORTE_FORME = {   // direzioni: x avanti, y a sinistra; il terzo valore 1 vuol dire "a metà del corpo"
  balena: [[1, 0], [-0.5, 1]], fungo: [[1, 0], [-1, 0]], razzo: [[1, 1], [-1, -1]], tarta: [[0, 1, 1], [0, -1, 1]], scolo: [[0, 1, 1], [0, -1, 1]],
  boat: [[-1, 0]], banana: [[0, -1, 1], [0, 1, 1]], tunnel: [[1, 0], [-1, 0]], snake: [[1, 0], [-1, 0]], torus: [[1, 0], [-1, 0]],
  arrow: [[-1, 0], [0, 1, 1]], ananas: [[1, 0], [-1, 0]], pera: [[1, 0], [-1, 0]],
};
// le porte: n quante, h il soffitto più basso sopra la soglia (la porta vera è 0,15 m meno, per la cornice); null se non appoggia a terra
function porteForma(V, F, id) {
  const basso = (i) => V[i][2] < 1e-4, chiave = (a, b) => (a < b ? a + "-" + b : b + "-" + a);
  // facce: normale (Newell) e piano, per sapere a che altezza passa il telo sopra un punto del pavimento
  const facce = F.map((f) => { const P = f.map((i) => V[i]), n = V3.norm(newell(P)); return { f, P, n, d: V3.dot(n, P[0]), pav: f.every(basso) && n[2] < -0.99 }; });
  const altSopra = (x, y, soloPiani) => {   // il telo più basso sopra (x, y); Infinity se non c'è niente
    let h = Infinity;
    for (const Fc of facce) { if (Fc.pav || Math.abs(Fc.n[2]) < (soloPiani ? 0.7 : 1e-3)) continue;
      let dentro = false; const P = Fc.P;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) dentro = !dentro;
      if (!dentro) continue;
      const z = (Fc.d - Fc.n[0] * x - Fc.n[1] * y) / Fc.n[2]; if (z > 0.05 && z < h) h = z; }
    return h;
  };
  // pianta: il bordo del pavimento, o (fondo aperto) gli spigoli a terra che stanno in una faccia sola; via i punti allineati
  const haPav = facce.some((Fc) => Fc.pav), conta = new Map();
  for (const Fc of facce) { if (haPav && !Fc.pav) continue;
    Fc.f.forEach((a, i) => { const b = Fc.f[(i + 1) % Fc.f.length]; if (!haPav && !(basso(a) && basso(b))) return; conta.set(chiave(a, b), (conta.get(chiave(a, b)) || 0) + 1); }); }
  const adj = new Map(), bordo = [...conta].filter(([, n]) => n === 1).map(([c]) => c.split("-").map(Number));
  for (const [a, b] of bordo) { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); }
  const usati = new Set(), anelli = [];
  for (const [a0, b0] of bordo) { if (usati.has(chiave(a0, b0))) continue; usati.add(chiave(a0, b0));
    const an = [a0]; let prec = a0, c = b0;
    for (let g = 0; g < 1e5 && c !== a0; g++) { an.push(c); const nx = (adj.get(c) || []).find((x) => x !== prec && !usati.has(chiave(x, c))); if (nx == null) break; usati.add(chiave(nx, c)); prec = c; c = nx; }
    if (an.length >= 3) anelli.push(an.map((i) => [V[i][0], V[i][1]])); }
  const areaP = (P) => P.reduce((s, a, i) => { const b = P[(i + 1) % P.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0) / 2;
  let pianta = anelli.sort((A, B) => Math.abs(areaP(B)) - Math.abs(areaP(A)))[0];
  if (!pianta || Math.abs(areaP(pianta)) < 0.3) return null;
  for (let pass = 0; pass < 3; pass++) pianta = pianta.filter((q, i, P) => { const a = P[(i - 1 + P.length) % P.length], b = P[(i + 1) % P.length];
    const u = [q[0] - a[0], q[1] - a[1]], w = [b[0] - q[0], b[1] - q[1]]; return P.length <= 3 || (Math.hypot(...u) > 0.01 && Math.abs(Math.atan2(u[0] * w[1] - u[1] * w[0], u[0] * w[0] + u[1] * w[1])) > 0.01); });
  const verso = Math.sign(areaP(pianta)) || 1, cx = pianta.reduce((s, q) => s + q[0], 0) / pianta.length, cy = pianta.reduce((s, q) => s + q[1], 0) / pianta.length;
  const E = pianta.map((a, i) => {
    const b = pianta[(i + 1) % pianta.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); let n = [(b[1] - a[1]) / L, -(b[0] - a[0]) / L]; if (verso < 0) n = [-n[0], -n[1]];   // n verso fuori
    let h = Infinity;
    for (const u of [0.35, 0.5, 0.65]) { const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u, dentro = altSopra(x - n[0] * 0.3, y - n[1] * 0.3, false);
      h = Math.min(h, dentro === Infinity ? 0 : dentro, altSopra(x - n[0] * 0.05, y - n[1] * 0.05, true), altSopra(x - n[0] * 0.15, y - n[1] * 0.15, true)); }
    return { L, n, m: [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cy], h };
  });
  const Rc = Math.max(...pianta.map((q) => Math.hypot(q[0] - cx, q[1] - cy))) || 1, H = Math.max(...V.map((v) => v[2]));
  const regola = PORTE_FORME[id]; let conn = [];
  if (regola) {
    const hTop = Math.max(...E.map((e) => e.h));
    for (const r of regola) {
      const ld = Math.hypot(r[0], r[1]), u = [r[0] / ld, r[1] / ld], perp = [-u[1], u[0]]; let best = -1, bs = -1e9;
      E.forEach((e, i) => { if (conn.includes(i) || e.L < 0.45 || e.h < 0.5 * hTop) return;
        const s = e.n[0] * u[0] + e.n[1] * u[1] + 0.35 * (e.m[0] * u[0] + e.m[1] * u[1]) / Rc - (r[2] ? 0.6 * Math.abs(e.m[0] * perp[0] + e.m[1] * perp[1]) / Rc : 0);
        if (s > bs) { bs = s; best = i; } });
      if (best >= 0) conn.push(best);
    }
  }
  if (!conn.length) {   // come nel configuratore: la porta sul lato più lungo abbastanza alto, poi quello più lontano
    const hPorta = Math.min(1.75, 0.8 * H), buoni = E.map((e, i) => i).filter((i) => E[i].L >= 0.75 && E[i].h >= hPorta).sort((i, j) => E[j].L - E[i].L);
    conn = buoni.length ? [buoni[0]] : [E.map((e, i) => i).sort((i, j) => E[j].L * E[j].h - E[i].L * E[i].h)[0]];
    const lont = buoni.filter((i) => i !== conn[0]).sort((i, j) => Math.hypot(E[j].m[0] - E[conn[0]].m[0], E[j].m[1] - E[conn[0]].m[1]) - Math.hypot(E[i].m[0] - E[conn[0]].m[0], E[i].m[1] - E[conn[0]].m[1]))[0];
    if (lont != null) conn.push(lont);
  }
  return { h: Math.min(...conn.map((i) => E[i].h)), n: conn.length };
}

// numeri all'italiana per i testi del giudizio (le pagine hanno i loro, più ricchi)
const gFmt = (x, d) => Number(x.toFixed(d)).toLocaleString("it-IT", { minimumFractionDigits: d, maximumFractionDigits: d });
const gMetri = (x) => (Math.abs(x) < 1 ? gFmt(x * 100, 0) + " cm" : gFmt(x, 2) + " m");
const gPlur = (n, uno, tanti) => `${n} ${n === 1 ? uno : tanti}`;
/* si può fare? Porta, pavimento, quantità di lavoro, pezzi difficili, stabilità, modellino; le stesse soglie dell'Abbofficina dove ci sono.
   m: una forma costruita (buildShape + an = analyze); p: i suoi parametri; o: { scala del modellino, id della forma (per le porte) }.
   Ogni voce ha c (ok, mid, ko, info), t (il testo) e k (di che cosa parla: porta, pavimento, tipi, lato, punta, stabile, sporge, lunga, alta, modellino, telo). */
function giudizioForma(m, p, o) {
  o = o || {};
  const voci = [], add = (c, t, k) => voci.push({ c, t, k }), an = m.an, V = m.V, H = Math.max(...V.map(v => v[2]));
  const foto = p && p.modo != null, sc = o.scala || 20;
  const P = porteForma(V, m.F, o.id || (foto ? "foto" : ""));
  if (!P) add("ko", foto ? "Non appoggia bene a terra: manca un pavimento abbastanza grande. Alzate il taglio in basso o scegliete un'altra lettura." : "Non appoggia bene a terra: manca un pavimento abbastanza grande.", "porta");
  else {
    const hp = Math.max(0, P.h - 0.15);
    if (hp >= 1.8 - 0.005) add("ok", `Ci si entra in piedi: la porta può essere alta ${gMetri(Math.min(hp, 2))}.`, "porta");
    else if (hp >= 1.2) add("mid", `La porta può essere alta al massimo ${gMetri(hp)}: si entra chinandosi. Per una porta da 1,80 m fatela più alta.`, "porta");
    else add("ko", `La porta può essere alta solo ${gMetri(hp)}: non ci si entra. Fatela più alta o più grande.`, "porta");
  }
  const A = m.floorArea || 0;
  if (A < 1.5) add("ko", `Pavimento di ${gFmt(A, 1)} m²: troppo piccolo per entrarci.`, "pavimento");
  else add(A < 4 ? "mid" : "ok", `Pavimento di ${gFmt(A, 1)} m²: ci stanno in piedi circa ${Math.max(1, Math.floor(A / 0.8))} persone.`, "pavimento");
  const nt = an.types.length, nf = m.F.length, meno = !foto ? "i lati o gli spicchi (meno pezzi diversi)" : p.modo === "tonda" ? "il dettaglio o i lati attorno" : "il dettaglio del contorno";
  if (nt <= 25) add("ok", `${gPlur(nf, "pezzo", "pezzi")} di ${gPlur(nt, "tipo", "tipi")}: un lavoro alla portata.`, "tipi");
  else add("mid", `${gPlur(nf, "pezzo", "pezzi")} di ${nt} tipi diversi: ogni tipo è una sagoma da tracciare a parte. Per meno lavoro abbassate ${meno}.`, "tipi");
  let lmin = Infinity, amin = 180;
  an.types.forEach(t => { const C = t.C, n = C.length; C.forEach((a, i) => {
    const b = sub2(C[(i + 1) % n], a), c = sub2(C[(i - 1 + n) % n], a); lmin = Math.min(lmin, len2(b));
    amin = Math.min(amin, Math.atan2(Math.abs(cross2(b, c)), dot2(b, c)) * 180 / Math.PI); }); });
  if (lmin < 0.15) add("mid", `Il lato più corto di un pezzo è ${gMetri(lmin)}: è difficile da saldare. Abbassate ${meno} o ingrandite la bolla.`, "lato");
  if (amin < 15) add("mid", `Un pezzo ha una punta di ${gFmt(amin, 0)}°: lì il telo fa pieghe e la giunzione viene difficile.`, "punta");
  const terra = V.filter(v => v[2] < 1e-4).map(v => [v[0], v[1]]), ha = (Q) => { const h = hull2D(Q); return Math.abs(fotoArea2(h)) / 2; };
  if (terra.length >= 3) {
    const fw = minWidth(terra).w, sporge = ha(V.map(v => [v[0], v[1]])) / Math.max(1e-6, ha(terra));
    if (H > 2.4 * fw) add("mid", `È alta ${gMetri(H)} su una base larga ${gMetri(fw)}: tende a piegarsi, va ancorata bene a terra.`, "stabile");
    if (sporge > 2.6) add("mid", "La parte alta sporge molto oltre il pavimento: si regge solo con la bolla ben gonfia, e conviene ancorarla.", "sporge");
  }
  const xs = V.map(v => v[0]), ys = V.map(v => v[1]), lungo = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  if (lungo > 12) add("mid", `È lunga ${gMetri(lungo)}: va fatta con più teli uniti e più gonfiatori.`, "lunga");
  if (H > 7) add("mid", `È alta ${gMetri(H)}: per montarla serve una scala e ci vogliono più gonfiatori.`, "alta");
  const lm = lmin * 1000 / sc, sct = gFmt(sc, Math.abs(sc - Math.round(sc)) > 0.005 ? 2 : 0);
  if (lm < 6) add("mid", `Nel modellino 1:${sct} il lato più corto è ${gFmt(lm, 1)} mm: per il modellino scegliete una scala più grande, per esempio 1:10.`, "modellino");
  else add("ok", `Il modellino 1:${sct} è alto ${gFmt(H * 100 / sc, 1)} cm: si fa con cartoncino e nastro.`, "modellino");
  let telo = 0; m.F.forEach(f => { telo += polyArea(f.map(i => V[i])); });
  add("info", `Telo: circa ${gFmt(telo, 0)} m² con il pavimento, ${gFmt(an.seams.reduce((s, x) => s + x.len, 0), 0)} m di giunzioni, ${gFmt(Math.abs(m.volume || 0), 1)} m³ d'aria.`, "telo");
  const c = voci.some(v => v.c === "ko") ? "ko" : voci.some(v => v.c === "mid") ? "mid" : "ok";
  return { c, titolo: c === "ok" ? "Si può fare" : c === "mid" ? "Si può fare, con qualche accorgimento" : "Così non si può fare", voci, porta: P ? Math.max(0, P.h - 0.15) : 0, lmin };
}
