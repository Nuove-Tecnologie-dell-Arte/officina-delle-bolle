/* Officina delle Bolle: «bolla da un'immagine». Dalla foto (o dal disegno) al contorno, poi a una forma vera dell'Officina.
   Lo usa index.html; serve motore.js caricato prima.
   La finestra e i suoi stili li crea questo file. La pagina passa:
   - disegna3d(canvas, modello, { yaw, pitch }): come disegnare il modellino 3D;
   - scala(): la scala del modellino (per il giudizio);
   - onUsa(parametri): che cosa fare con la forma scelta (i parametri della forma "foto" del motore);
   - errore(testo) e dopo(): facoltativi, per i messaggi e per sapere che c'è un'immagine da ritoccare.
   ImmagineBolla.carica(file, opz) apre un'immagine, ImmagineBolla.riapri(opz) riapre l'ultima, ImmagineBolla.giudizioHTML(g) scrive un giudizio. */
const ImmagineBolla = (function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtNF = [];
  const fmt = (x, d) => { const v = Number(x.toFixed(d)); return (fmtNF[d] || (fmtNF[d] = new Intl.NumberFormat("it-IT", { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v === 0 ? 0 : v); };
  const mR = (x) => (Math.abs(x) < 1 ? fmt(x * 100, 1) + " cm" : fmt(x, 3) + " m");
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((s, i) => (i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]))); ctx.closePath(); };
  let H = {};   // le scelte della pagina che usa la finestra

  // stili della finestra (usano i colori e i componenti del sito: .btn, .seg, .field, .hint, .check, …)
  const CSS = `
.fd { width: min(1080px, calc(100vw - 24px)); max-height: calc(100dvh - 24px); padding: 0; border: 0; border-radius: var(--r-l); background: var(--card); color: var(--ink); box-shadow: 0 20px 60px rgba(0,0,0,.35); }
.fd[open] { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; }
.fd::backdrop { background: rgba(10, 20, 16, .55); }
.fd-head, .fd-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--rule); }
.fd-foot { border-bottom: 0; border-top: 1px solid var(--rule); flex-wrap: wrap; }
.fd-x { font-size: 1.6rem; line-height: 1; width: 44px; height: 44px; border: 0; border-radius: var(--r-s); background: transparent; color: var(--ink); cursor: pointer; }
.fd-x:hover { background: var(--green-soft); }
.fd-body { overflow: auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 22px; padding: 18px 20px; }
.fd-col { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; align-content: start; min-width: 0; }
.fd-tit { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 700; }
.fd-tit i { font-style: normal; font-family: var(--mono); font-size: .75rem; width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; background: var(--green); color: var(--card); }
.fd-img { background: repeating-conic-gradient(var(--paper) 0 25%, var(--card) 0 50%) 0 0 / 18px 18px; border: 1px solid var(--rule); border-radius: var(--r-m); overflow: hidden; }
.fd-img canvas { display: block; width: 100%; max-height: 46vh; object-fit: contain; cursor: crosshair; }
.fd-ctl { display: grid; gap: 10px; }
.fd-seg { justify-self: start; max-width: 100%; }
.fd-seg button { padding: 10px 14px; }
@media (max-width: 420px) { .fd-seg button { padding: 8px 10px; font-size: .86rem; } }
.fd-stato { font-size: .86rem; padding: 8px 12px; border-radius: var(--r-s); background: var(--green-soft); color: var(--ink); }
.fd-stato.no { background: color-mix(in srgb, var(--cut) 10%, transparent); }
.fd-stato progress { width: 100%; height: 6px; display: block; margin-top: 6px; accent-color: var(--green); }
.fd-img canvas.punti { cursor: copy; touch-action: none; }
.fd input[type="range"] { width: 100%; accent-color: var(--green); min-height: 32px; }
.fd-modi { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.fd-modi button { display: grid; gap: 3px; align-content: start; text-align: left; padding: 10px 12px; border: 1px solid var(--rule); border-radius: var(--r-m); background: var(--paper); color: var(--ink); font: 400 .8rem/1.35 var(--body); cursor: pointer; min-height: 44px; }
.fd-modi button b { font: 700 .92rem var(--body); }
.fd-modi button span { color: var(--muted); }
.fd-modi button:hover { border-color: var(--green); }
.fd-modi button[aria-checked="true"] { border-color: var(--green); box-shadow: inset 0 0 0 2px var(--green); background: color-mix(in srgb, var(--green) 9%, var(--card)); }
.fd-modi button em { font-style: normal; font-family: var(--mono); font-size: .68rem; text-transform: uppercase; letter-spacing: .06em; color: var(--green); }
.fd-3d { margin: 0; display: grid; gap: 4px; }
.fd-3d canvas { width: 100%; aspect-ratio: 4 / 3; max-height: 40vh; display: block; background: var(--paper); border-radius: var(--r-m); cursor: grab; touch-action: none; }
.fd-giudizio, .giudizio { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.fd-giudizio .num { white-space: normal; }
.giudizio-t { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 800; font-size: 1.15rem; padding: 10px 14px; border-radius: var(--r-m); }
.giudizio-t.ok { background: color-mix(in srgb, var(--green) 14%, transparent); color: var(--green); }
.giudizio-t.mid { background: color-mix(in srgb, var(--t3) 16%, transparent); color: var(--t3); }
.giudizio-t.ko { background: color-mix(in srgb, var(--cut) 13%, transparent); color: var(--cut); }
.giudizio ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.giudizio li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; font-size: .9rem; line-height: 1.45; }
.giudizio li i { font-style: normal; font-weight: 700; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; color: var(--card); background: var(--muted); }
.giudizio li.ok i { background: var(--green); }
.giudizio li.mid i { background: var(--t3); }
.giudizio li.ko i { background: var(--cut); }
.fd-esito { font-weight: 650; font-size: .9rem; margin: 0; }
.fd-esito.mid { color: var(--avviso, var(--t3)); } .fd-esito.ok { color: var(--green); } .fd-esito.ko { color: var(--cut); }
@media (max-width: 860px) { .fd-body { grid-template-columns: minmax(0, 1fr); padding: 14px 16px; } .fd-modi { grid-template-columns: 1fr; } .fd-head, .fd-foot { padding: 12px 16px; } }
`;
  // la finestra
  const HTML = `
<dialog class="fd" id="fotoDlg" aria-labelledby="fdTit">
  <div class="fd-head"><h3 id="fdTit">Bolla da un'immagine</h3><button type="button" class="fd-x" id="fdX" aria-label="Chiudi">×</button></div>
  <div class="fd-body">
    <div class="fd-col">
      <div class="fd-tit"><i>1</i>La sagoma</div>
      <div class="seg fd-seg" role="group" aria-label="Come trovare il contorno" id="fdSeg"><button type="button" data-c="ia" aria-pressed="true" title="Un modello di intelligenza artificiale riconosce il soggetto (serve internet la prima volta)">Intelligente</button><button type="button" data-c="auto" aria-pressed="false" title="Dai colori dell'immagine, funziona anche senza internet">Automatico</button><button type="button" data-c="punti" aria-pressed="false" title="Il contorno lo mettete voi, punto per punto">Punti a mano</button></div>
      <p class="fd-stato" id="fdIaStato" hidden></p>
      <div class="fd-img"><canvas id="fdImg" aria-label="L'immagine caricata, con il contorno in verde."></canvas></div>
      <p class="hint" id="fdImgNota"></p>
      <div id="fdAutoCtl" class="fd-ctl">
        <div class="btnrow">
          <div class="seg fd-seg" role="group" aria-label="Che cosa fa un tocco sull'immagine" id="fdSegno"><button type="button" data-s="1" aria-pressed="true">+ È soggetto</button><button type="button" data-s="0" aria-pressed="false">− È sfondo</button></div>
          <button type="button" class="btn" id="fdTUndo">Annulla tocco</button>
          <button type="button" class="btn" id="fdTReset">Ricomincia</button>
        </div>
        <div class="field"><label for="fdDet">Dettaglio del contorno</label><input id="fdDet" type="range" min="1" max="10" step="1" value="4"></div>
      </div>
      <div id="fdPuntiCtl" class="fd-ctl" hidden>
        <div class="btnrow">
          <button type="button" class="btn" id="fdPUndo">Annulla</button>
          <button type="button" class="btn" id="fdPReset">Ricomincia da zero</button>
          <button type="button" class="btn" id="fdPAuto">Parti dal contorno trovato</button>
        </div>
        <label class="check"><input type="checkbox" id="fdPSpec"> <span>Specchia: mettete i punti solo sulla metà destra, l'altra metà si copia da sola (per oggetti simmetrici)</span></label>
      </div>
      <div class="btnrow"><button type="button" class="btn" id="fdAltra">Cambia immagine</button></div>
    </div>
    <div class="fd-col">
      <div class="fd-tit"><i>2</i>Come la leggo</div>
      <div class="fd-modi" id="fdModi" role="radiogroup" aria-label="Come leggere l'immagine">
        <button type="button" data-m="tonda" role="radio"><b>Oggetto tondo</b><span>visto di lato: si gira attorno al suo asse (vaso, fungo, pera)</span></button>
        <button type="button" data-m="sagoma" role="radio"><b>Sagoma con spessore</b><span>vista di lato, alzata come un'insegna (animale, lettera)</span></button>
        <button type="button" data-m="pianta" role="radio"><b>Pianta</b><span>vista dall'alto: è il pavimento, con pareti e tetto</span></button>
      </div>
      <div class="fields" id="fdMisure"></div>
      <div class="fd-tit"><i>3</i>Il modellino</div>
      <figure class="fd-3d"><canvas id="fd3d" aria-label="Anteprima 3D della bolla: trascinate per girarla."></canvas><figcaption class="hint" id="fd3dNota">Trascinate per girarla.</figcaption></figure>
      <div class="fd-giudizio" id="fdGiudizio" aria-live="polite"></div>
    </div>
  </div>
  <div class="fd-foot">
    <div><p class="fd-esito" id="fdEsito" aria-hidden="true"></p><p class="hint">Dopo potete cambiare tutto al Passo 1, come per le altre forme.</p></div>
    <div class="btnrow"><button type="button" class="btn" id="fdAnnulla">Annulla</button><button type="button" class="btn primary big" id="fdUsa">Usa questa forma</button></div>
  </div>
</dialog>
`;
  { const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st); }   // subito: il giudizio serve anche fuori dalla finestra
  function prepara() {
    if ($("fotoDlg")) return;
    document.body.insertAdjacentHTML("beforeend", HTML);
    collega();
  }
  const fileIn = document.createElement("input"); fileIn.type = "file"; fileIn.accept = "image/*";
  fileIn.addEventListener("change", e => { const f = e.target.files[0]; e.target.value = ""; if (f) fotoCarica(f); });

  const FD = { modoC: "auto", punti: [], undoP: [], spec: false, sagAuto: null, segni: [], undoS: [], rett: null, iaPunti: [], undoIa: [], iaRis: null, iaAuto: null, px: null, w: 0, h: 0, src: null, alpha: false, seed: null, sens: 1, inv: false, sag: null, raw: null, auto: null, p: null, toccati: new Set(), modello: null, errore: null, yaw: 0.6, pitch: 0.32 };
  const fotoDef = () => SHAPES.find(s => s.id === "foto");
  // si può fare? Il calcolo sta in motore.js (giudizioForma)
  const giudizioBolla = (m, p) => giudizioForma(m, p, { scala: H.scala ? H.scala() : 20, id: "foto" });
  function giudizioHTML(g) { return `<div class="giudizio"><div class="giudizio-t ${g.c}">${g.titolo}</div><ul>${g.voci.map(v => `<li class="${v.c}"><i aria-hidden="true">${{ ok: "✓", mid: "!", ko: "✕", info: "i" }[v.c]}</i><span>${v.t}</span></li>`).join("")}</ul></div>`; }

  function fotoErrore(t) { if (H.errore) H.errore(t || ""); else if (t) alert(t); }
  function fotoCarica(file) {
    if (!file || !/^image\//.test(file.type || "")) { fotoErrore("Questo file non è un'immagine: usate un JPG, un PNG o un'immagine incollata."); return; }
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { URL.revokeObjectURL(url); fotoErrore(""); fotoDaImmagine(im, true); };
    im.onerror = () => { URL.revokeObjectURL(url); fotoErrore("Non riesco ad aprire questa immagine: provate con un JPG o un PNG."); };
    im.src = url;
  }
  function fotoDaImmagine(im, nuova) {
    const iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height, k = Math.min(1, 420 / Math.max(iw, ih));
    const w = Math.max(8, Math.round(iw * k)), h = Math.max(8, Math.round(ih * k)), c = document.createElement("canvas");
    c.width = w; c.height = h; const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(im, 0, 0, w, h);
    Object.assign(FD, { src: c, w, h, px: g.getImageData(0, 0, w, h).data });
    let trasp = 0, nb = 0; for (let x = 0; x < w; x++) for (const y of [0, h - 1]) { nb++; if (FD.px[4 * (y * w + x) + 3] < 250) trasp++; }
    for (let y = 0; y < h; y++) for (const x of [0, w - 1]) { nb++; if (FD.px[4 * (y * w + x) + 3] < 250) trasp++; }
    FD.alpha = trasp > nb * 0.1;
    if (nuova) {
      // con un PNG trasparente il contorno è già nella trasparenza; altrimenti si parte dal modello intelligente (se si può)
      Object.assign(FD, { p: null, toccati: new Set(), yaw: 0.6, modoC: FD.alpha || IA.fallita ? "auto" : "ia", punti: [], undoP: [], spec: false, sagAuto: null,
        segni: [], undoS: [], rett: null, iaPunti: [], undoIa: [], iaRis: null, iaAuto: null });
      $("fdDet").value = 4; $("fdPSpec").checked = false;
      try { localStorage.setItem("bolle|foto-img", c.toDataURL("image/png")); } catch (e) { /* l'immagine resta solo per questa visita */ }
    }
    FD.orig = im; FD.imgId = (FD.imgId || 0) + 1; FD.iaRis = null;
    if (FD.modoC === "punti") fotoDaPunti(true); else fotoAnalizza();   // anche in modo intelligente: intanto il contorno dai colori
    if (FD.modoC === "ia") iaAvvia();
    if (H.dopo) H.dopo();
    if (!$("fotoDlg").open) { try { $("fotoDlg").showModal(); } catch (e) { $("fotoDlg").setAttribute("open", ""); } }
    requestAnimationFrame(() => { disegnaFotoImg(); disegnaFoto3d(); });
  }
  // 2) maschera della forma, contorno e sagoma normalizzata
  function fotoMaschera() {
    const { w, h, px } = FD, N = w * h;
    let fg;
    if (FD.alpha) {   // PNG trasparente: la forma è dove l'immagine è piena (i tocchi correggono)
      fg = new Uint8Array(N); for (let i = 0; i < N; i++) fg[i] = px[4 * i + 3] > 128 ? 1 : 0;
      segniSu(fg, w, h, FD.segni, (i, s) => { fg[i] = s ? 1 : 0; });
      return fotoRifinisci(fg, w, h);
    }
    fg = grabCut(px, w, h, FD.rett, FD.segni);
    return fotoRifinisci(fg, w, h, Math.round(Math.min(w, h) * 0.012));
  }
  // i tocchi «è soggetto» / «è sfondo»: un dischetto attorno a ogni tocco
  function segniSu(arr, w, h, segni, f) {
    const r = Math.max(3, Math.round(Math.min(w, h) * 0.025));
    (segni || []).forEach(s => { for (let y = Math.max(0, Math.round(s.y) - r); y <= Math.min(h - 1, Math.round(s.y) + r); y++) for (let x = Math.max(0, Math.round(s.x) - r); x <= Math.min(w - 1, Math.round(s.x) + r); x++) if ((x - s.x) ** 2 + (y - s.y) ** 2 <= r * r) f(y * w + x, s.fg); });
  }
  /* scontorno senza internet, sul modello di GrabCut (Rother, Kolmogorov e Blake, 2004), semplificato:
     - fuori dal riquadro è sfondo sicuro; i tocchi sono soggetto o sfondo sicuri;
     - soggetto e sfondo hanno ciascuno un modello dei colori (5 gruppi, con la loro varianza): così uno sfondo a puntini
       come il sughero è un solo «sfondo», non mille colori diversi;
     - i colori si misurano con la luce pesata poco: un'ombra è lo sfondo più scuro, non un oggetto;
     - pixel vicini e di colore simile tendono a stare dalla stessa parte (il contorno passa dove l'immagine cambia);
     - si ripete: con le parti nuove si rifanno i modelli, finché si assestano. */
  function grabCut(px, w, h, rett, segni) {
    const N = w * h, F = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const r = px[4 * i], g = px[4 * i + 1], b = px[4 * i + 2];
      F[3 * i] = (r - g) * 0.7071; F[3 * i + 1] = (r + g - 2 * b) * 0.4082; F[3 * i + 2] = (r + g + b) * 0.5774 * 0.45; }
    // 1 = sfondo sicuro, 2 = soggetto sicuro, 0 = da decidere
    const fisso = new Uint8Array(N), m = Math.max(2, Math.round(Math.min(w, h) * 0.02));
    const R = rett ? { x0: Math.max(0, Math.min(rett.x0, rett.x1)), x1: Math.min(w - 1, Math.max(rett.x0, rett.x1)), y0: Math.max(0, Math.min(rett.y0, rett.y1)), y1: Math.min(h - 1, Math.max(rett.y0, rett.y1)) }
      : { x0: m, y0: m, x1: w - 1 - m, y1: h - 1 - m };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x < R.x0 || x > R.x1 || y < R.y0 || y > R.y1) fisso[y * w + x] = 1;
    segniSu(fisso, w, h, segni, (i, s) => { fisso[i] = s ? 2 : 1; });
    let seme = 12345; const caso = () => { seme = (seme * 1103515245 + 12345) & 0x7fffffff; return seme / 0x7fffffff; };
    // modello dei colori: k-medie (partenza dai punti più lontani tra loro), poi media, varianza e peso di ogni gruppo
    const modello = (idx) => {
      const S = idx.length > 4000 ? Array.from({ length: 4000 }, () => idx[(caso() * idx.length) | 0]) : idx, K = Math.min(5, S.length);
      if (!K) return null;
      const C = [[F[3 * S[0]], F[3 * S[0] + 1], F[3 * S[0] + 2]]], dmin = new Float32Array(S.length).fill(Infinity);
      while (C.length < K) { const c = C[C.length - 1]; let bi = 0, bd = -1;
        S.forEach((s, j) => { const d = (F[3 * s] - c[0]) ** 2 + (F[3 * s + 1] - c[1]) ** 2 + (F[3 * s + 2] - c[2]) ** 2; if (d < dmin[j]) dmin[j] = d; if (dmin[j] > bd) { bd = dmin[j]; bi = j; } });
        C.push([F[3 * S[bi]], F[3 * S[bi] + 1], F[3 * S[bi] + 2]]); }
      const a = new Uint8Array(S.length);
      for (let it = 0; it < 6; it++) {
        S.forEach((s, j) => { let bk = 0, bd = Infinity; C.forEach((c, k) => { const d = (F[3 * s] - c[0]) ** 2 + (F[3 * s + 1] - c[1]) ** 2 + (F[3 * s + 2] - c[2]) ** 2; if (d < bd) { bd = d; bk = k; } }); a[j] = bk; });
        const sm = C.map(() => [0, 0, 0, 0]); S.forEach((s, j) => { const t = sm[a[j]]; t[0] += F[3 * s]; t[1] += F[3 * s + 1]; t[2] += F[3 * s + 2]; t[3]++; });
        sm.forEach((t, k) => { if (t[3]) C[k] = [t[0] / t[3], t[1] / t[3], t[2] / t[3]]; });
      }
      const st = C.map(() => [0, 0, 0, 0]); S.forEach((s, j) => { const t = st[a[j]], c = C[a[j]]; for (let d = 0; d < 3; d++) t[d] += (F[3 * s + d] - c[d]) ** 2; t[3]++; });
      return C.map((c, k) => { const n = st[k][3]; if (!n) return null; const v = [0, 1, 2].map(d => Math.max(16, st[k][d] / n)); return { c, v, k: 0.5 * Math.log(v[0] * v[1] * v[2]) - Math.log(n / S.length) }; }).filter(Boolean);
    };
    const nll = (M, i) => { let b = Infinity; for (const g of M) { const e = (F[3 * i] - g.c[0]) ** 2 / (2 * g.v[0]) + (F[3 * i + 1] - g.c[1]) ** 2 / (2 * g.v[1]) + (F[3 * i + 2] - g.c[2]) ** 2 / (2 * g.v[2]) + g.k; if (e < b) b = e; } return b; };
    // pesi tra vicini (destra e sotto): alti dove il colore è simile
    const wR = new Float32Array(N), wD = new Float32Array(N); let s2 = 0, n2 = 0;
    const d2 = (i, j) => (F[3 * i] - F[3 * j]) ** 2 + (F[3 * i + 1] - F[3 * j + 1]) ** 2 + (F[3 * i + 2] - F[3 * j + 2]) ** 2;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (x < w - 1) { s2 += d2(i, i + 1); n2++; } if (y < h - 1) { s2 += d2(i, i + w); n2++; } }
    const beta = 1 / (2 * Math.max(1, s2 / n2));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (x < w - 1) wR[i] = Math.exp(-beta * d2(i, i + 1)); if (y < h - 1) wD[i] = Math.exp(-beta * d2(i, i + w)); }
    // partenza: dentro il riquadro è soggetto quello che il modello dello sfondo spiega male (soglia di Otsu)
    const bgIdx0 = []; for (let i = 0; i < N; i++) if (fisso[i] === 1) bgIdx0.push(i);
    const Mb0 = modello(bgIdx0), p = new Float32Array(N), L = new Float32Array(N), dentro = [];
    for (let i = 0; i < N; i++) if (!fisso[i]) dentro.push(i);
    if (Mb0 && dentro.length && !rett) {   // con un riquadro trascinato da voi, invece, dentro si parte tutto «soggetto» (come in GrabCut)
      const v = dentro.map(i => Math.min(60, Math.max(0, nll(Mb0, i)))), ist = new Float64Array(256);
      v.forEach(x => { ist[Math.min(255, (x / 60 * 255) | 0)]++; });
      let sum = 0, sB = 0, wB = 0, best = -1, soglia = 128; for (let t = 0; t < 256; t++) sum += t * ist[t];
      for (let t = 0; t < 256; t++) { wB += ist[t]; if (!wB) continue; const wF = v.length - wB; if (!wF) break; sB += t * ist[t]; const q = wB * wF * (sB / wB - (sum - sB) / wF) ** 2; if (q > best) { best = q; soglia = t; } }
      dentro.forEach((i, j) => { p[i] = (v[j] / 60 * 255) > soglia ? 1 : 0; });
    } else dentro.forEach(i => { p[i] = 1; });
    for (let i = 0; i < N; i++) if (fisso[i]) p[i] = fisso[i] === 2 ? 1 : 0;
    const lambda = 2.2, q = new Float32Array(N);
    for (let giro = 0; giro < 5; giro++) {
      const fi = [], bi = []; for (let i = 0; i < N; i++) (p[i] > 0.5 && fisso[i] !== 1 ? fi : bi).push(i);
      if (fi.length < 20) break;
      const Mf = modello(fi), Mb = modello(bi);
      for (const i of dentro) { L[i] = Math.max(-30, Math.min(30, nll(Mb, i) - nll(Mf, i))); p[i] = 1 / (1 + Math.exp(-L[i])); }   // si riparte dai colori, poi i vicini
      for (let s = 0; s < 6; s++) {   // campo medio: ognuno guarda i vicini
        for (const i of dentro) {
          const x = i % w; let a = 0;
          if (x < w - 1) a += wR[i] * (2 * p[i + 1] - 1); if (x > 0) a += wR[i - 1] * (2 * p[i - 1] - 1);
          if (i + w < N) a += wD[i] * (2 * p[i + w] - 1); if (i >= w) a += wD[i - w] * (2 * p[i - w] - 1);
          q[i] = 1 / (1 + Math.exp(-(L[i] + lambda * a)));
        }
        for (const i of dentro) p[i] = q[i];
      }
    }
    const fg = new Uint8Array(N); for (let i = 0; i < N; i++) fg[i] = p[i] > 0.5 ? 1 : 0;
    return fg;
  }
  // dalla maschera grezza alla forma: via i puntini, buchi riempiti, la macchia più grande
  function fotoRifinisci(fg, w, h, chiudi) {
    const N = w * h;
    // chiusura (allarga e poi stringe): le fessure sottili lungo il bordo si chiudono, la forma resta grande uguale
    const r = chiudi != null ? chiudi : 0;
    if (r > 0) {
      const passa = (A, max) => { const B = new Uint8Array(N), C = new Uint8Array(N);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = max ? 0 : 1; for (let d = -r; d <= r; d++) { const X = Math.min(w - 1, Math.max(0, x + d)), a = A[y * w + X]; if (max ? a : !a) { v = max ? 1 : 0; break; } } B[y * w + x] = v; }
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let v = max ? 0 : 1; for (let d = -r; d <= r; d++) { const Y = Math.min(h - 1, Math.max(0, y + d)), a = B[Y * w + x]; if (max ? a : !a) { v = max ? 1 : 0; break; } } C[y * w + x] = v; }
        return C; };
      fg = passa(passa(fg, true), false);
    }
    // via i puntini: un pixel segue la maggioranza dei vicini
    const lis = new Uint8Array(N);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < w && Y < h) { n++; s += fg[Y * w + X]; } } lis[y * w + x] = 2 * s > n ? 1 : 0; }
    // tutto quello che dal bordo non si raggiunge passando per lo sfondo è forma (un contorno disegnato diventa pieno)
    const fuori = new Uint8Array(N), coda = [], metti = (i) => { if (!fuori[i] && !lis[i]) { fuori[i] = 1; coda.push(i); } };
    for (let x = 0; x < w; x++) { metti(x); metti((h - 1) * w + x); } for (let y = 0; y < h; y++) { metti(y * w); metti(y * w + w - 1); }
    while (coda.length) { const i = coda.pop(), x = i % w, y = (i / w) | 0; if (x > 0) metti(i - 1); if (x < w - 1) metti(i + 1); if (y > 0) metti(i - w); if (y < h - 1) metti(i + w); }
    const lab = new Int32Array(N); let mig = 0, migN = 0, nl = 0;
    for (let s = 0; s < N; s++) { if (fuori[s] || lab[s]) continue; nl++; let cnt = 0; const st = [s]; lab[s] = nl;
      while (st.length) { const i = st.pop(); cnt++; const x = i % w, y = (i / w) | 0;
        for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) if (j >= 0 && !fuori[j] && !lab[j]) { lab[j] = nl; st.push(j); } }
      if (cnt > migN) { migN = cnt; mig = nl; } }
    if (migN < N * 0.008) return { no: "Non trovo il soggetto. Toccatelo con «+ È soggetto», o trascinate un riquadro attorno (in Automatico)." };
    if (migN > N * 0.97) return { no: "Il soggetto sembra riempire tutta l'immagine: toccate lo sfondo con «− È sfondo», o trascinate un riquadro attorno al soggetto." };
    const M = new Uint8Array(N); for (let i = 0; i < N; i++) M[i] = lab[i] === mig ? 1 : 0;
    return { M, area: migN };
  }
  function fotoTraccia(M, w, h) {   // bordo esterno, Moore
    const s = M.indexOf(1), at = (x, y) => x >= 0 && y >= 0 && x < w && y < h && M[y * w + x];
    const dir = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const x0 = s % w, y0 = (s / w) | 0, out = [[x0, y0]]; let cx = x0, cy = y0, bx = x0 - 1, by = y0;
    for (let it = 0; it < w * h * 2; it++) {
      const k = dir.findIndex(([dx, dy]) => cx + dx === bx && cy + dy === by); let ok = false;
      for (let j = 1; j <= 8; j++) { const [dx, dy] = dir[(k + j) % 8]; if (at(cx + dx, cy + dy)) { const [qx, qy] = dir[(k + j + 7) % 8]; bx = cx + qx; by = cy + qy; cx += dx; cy += dy; ok = true; break; } }
      if (!ok || (cx === x0 && cy === y0)) break; out.push([cx, cy]);
    }
    return out;
  }
  // la maschera del metodo scelto: intelligente (l'ultima risposta del modello, se c'è) o automatico
  function fotoAnalizza() {
    const r = FD.modoC === "ia" && FD.iaRis ? FD.iaRis : fotoMaschera();
    if (!r.no) FD.mascheraColori = FD.modoC === "ia" && FD.iaRis ? FD.mascheraColori : r;   // da qui parte il primo tocco automatico del modello
    fotoDaMaschera(r);
  }
  function fotoDaMaschera(r) {
    FD.errore = r.no || null; FD.sag = null; FD.modello = null;
    if (r.no) { FD.raw = null; FD.sagAuto = null; fotoAggiorna(); return; }
    const { w, h } = FD, R = fotoTraccia(r.M, w, h);
    // contorno leggero (al massimo 400 punti), poi riquadro con il lato più lungo = 1 e y in su
    let P = R, eps = 0.6;
    for (let g = 0; g < 12; g++, eps *= 1.4) { let far = 0, dm = 0; R.forEach((q, i) => { const d = Math.hypot(q[0] - R[0][0], q[1] - R[0][1]); if (d > dm) { dm = d; far = i; } });
      P = fotoDP(R.slice(0, far + 1), eps).slice(0, -1).concat(fotoDP(R.slice(far).concat([R[0]]), eps).slice(0, -1)); if (P.length <= 400) break; }
    fotoNormalizza(P, 4);
    FD.sagAuto = FD.sag; FD.boxAuto = FD.box;   // per «Parti dal contorno automatico»
    fotoDopoSagoma(r.M, r.area, w, h);
  }
  // contorno in pixel → sagoma con il lato più lungo = 1 e y in su (e il riquadro per tornare ai pixel)
  function fotoNormalizza(P, dec) {
    const xs = P.map(q => q[0]), ys = P.map(q => q[1]), x0 = Math.min(...xs), y1 = Math.max(...ys), S = Math.max(Math.max(...xs) - x0, y1 - Math.min(...ys)) || 1;
    FD.raw = P; FD.box = { x0, y1, S };
    FD.sag = P.map(q => [+((q[0] - x0) / S).toFixed(dec), +((y1 - q[1]) / S).toFixed(dec)]);
    if (fotoArea2(FD.sag) < 0) FD.sag.reverse();
  }
  // dalla sagoma: forma esatta se è geometrica, lettura consigliata, misure di partenza
  function fotoDopoSagoma(M, area, w, h) {
    // a mano la lettura si sceglie di nuovo quando si aggiunge o si toglie un punto, non mentre se ne trascina uno
    const prima = FD.modoC === "punti" && FD.nScelta === FD.punti.length && FD.p ? FD.p.modo : null;
    if (FD.modoC === "punti") FD.nScelta = FD.punti.length;
    FD.reg = fotoRegolare(FD.sag);
    FD.auto = fotoLettura(M, area, w, h);
    fotoPartenza();
    if (FD.modoC === "punti") FD.p.det = 10;   // i punti messi a mano restano tutti
    // se la lettura consigliata non si può costruire, si consiglia la prima delle altre che si può fare
    if (!FD.toccati.has("modo") && !prima) {
      const voto = (modo) => { try { const p = { ...FD.p, modo, sag: fotoSag(modo) }, m = buildShape(fotoDef(), p, { cut: true }); m.an = analyze(m.V, m.F, m.floor); return { ok: 0, mid: 1, ko: 2 }[giudizioBolla(m, p).c]; } catch (e) { return 3; } };
      const v0 = voto(FD.auto);
      if (v0 >= 2) { const alt = ["tonda", "sagoma", "pianta"].filter(m => m !== FD.auto).map(m => ({ m, v: voto(m) })).sort((x, y) => x.v - y.v)[0]; if (alt.v < v0) { FD.auto = alt.m; FD.p.modo = alt.m; } }
    }
    if (prima) FD.p.modo = prima;
    fotoAggiorna();
  }
  // 3) che cosa rappresenta: simmetrie della macchia e quanto i lati sono dritti
  function fotoLettura(M, area, w, h) {
    let sx = 0, sy = 0;
    for (let i = 0; i < w * h; i++) if (M[i]) { sx += i % w; sy += (i / w) | 0; }
    const cx = sx / area, cy = sy / area; let sv = 0, so = 0;
    for (let i = 0; i < w * h; i++) if (M[i]) { const x = i % w, y = (i / w) | 0, mx = Math.round(2 * cx - x), my = Math.round(2 * cy - y);
      if (mx >= 0 && mx < w && M[y * w + mx]) sv++; if (my >= 0 && my < h && M[my * w + x]) so++; }
    const simV = sv / area, simO = so / area;
    let dritto = 0, tot = 0, C = FD.sag; try { C = fotoContorno(FD.sag, 0.012); } catch (e) { /* si guarda il contorno intero */ }
    C.forEach((a, i) => { const b = C[(i + 1) % C.length], L = len2(sub2(b, a)), t = Math.abs(Math.atan2(b[1] - a[1], b[0] - a[0])) % (Math.PI / 2); tot += L; if (Math.min(t, Math.PI / 2 - t) < 0.14) dritto += L; });
    const retto = dritto / (tot || 1);
    // angoli rientranti netti: tanti (stella, croce, ingranaggio) fanno pensare a una pianta, non a un oggetto che gira
    const rientri = C.filter((q, i) => { const a = C[(i - 1 + C.length) % C.length], b = C[(i + 1) % C.length]; return cross2(sub2(q, a), sub2(b, q)) < 0 && Math.abs(Math.atan2(cross2(sub2(q, a), sub2(b, q)), dot2(sub2(q, a), sub2(b, q)))) > 0.5; }).length;
    if (retto > 0.75 || FD.reg) return "pianta";
    if (simV > 0.95) return simO > 0.9 || rientri >= 3 ? "pianta" : "tonda";
    return "sagoma";
  }
  // forme geometriche riconosciute (cerchio, ovale, rettangolo, poligono regolare): si rendono esatte, così i pezzi sono pochi tipi
  function fotoRegolare(S) {
    const n0 = S.length; let A = 0, cx = 0, cy = 0, xx = 0, yy = 0, xy = 0;
    S.forEach((p, i) => { const q = S[(i + 1) % n0], c = p[0] * q[1] - q[0] * p[1]; A += c / 2; cx += (p[0] + q[0]) * c / 6; cy += (p[1] + q[1]) * c / 6;
      xx += (p[0] * p[0] + p[0] * q[0] + q[0] * q[0]) * c / 12; yy += (p[1] * p[1] + p[1] * q[1] + q[1] * q[1]) * c / 12; xy += (p[0] * q[1] + 2 * p[0] * p[1] + 2 * q[0] * q[1] + q[0] * p[1]) * c / 24; });
    cx /= A; cy /= A; xx = xx / A - cx * cx; yy = yy / A - cy * cy; xy = xy / A - cx * cy;
    const tr = (xx + yy) / 2, de = Math.sqrt(Math.max(0, ((xx - yy) / 2) ** 2 + xy * xy)), a = 2 * Math.sqrt(tr + de), b = 2 * Math.sqrt(Math.max(0, tr - de)), th = 0.5 * Math.atan2(2 * xy, xx - yy);
    const r4 = (q) => q;   // niente arrotondamenti: i lati uguali devono restare uguali al millimetro, o i tipi di pezzo si moltiplicano
    // ovale (o cerchio): ogni punto del contorno sta sull'ellisse dei momenti, a meno del 4%
    const ell = (p) => { const dx = p[0] - cx, dy = p[1] - cy, u = dx * Math.cos(th) + dy * Math.sin(th), v = -dx * Math.sin(th) + dy * Math.cos(th); return Math.hypot(u / a, v / b); };
    if (Math.abs(A / (Math.PI * a * b) - 1) < 0.05 && S.every(p => Math.abs(ell(p) - 1) < 0.045)) {
      const tondo = a / b < 1.06, n = tondo ? 12 : 16, R = (a + b) / 2;
      return { nome: tondo ? "un cerchio" : "un ovale", pts: Array.from({ length: n }, (_, i) => { const t = 2 * Math.PI * (i + 0.5) / n, u = (tondo ? R : a) * Math.cos(t), v = (tondo ? R : b) * Math.sin(t);
        return r4([cx + u * Math.cos(th) - v * Math.sin(th), cy + u * Math.sin(th) + v * Math.cos(th)]); }) };
    }
    let P; try { P = fotoContorno(S, 0.02); } catch (e) { return null; }
    const n = P.length; if (n < 3 || n > 16) return null;
    if (!S.every(p => Math.min(...P.map((q, i) => fotoDistSeg(p, q, P[(i + 1) % n]))) < 0.02)) return null;
    // stella: punte e rientri alternati, tutti alla stessa distanza dal centro e a passo regolare
    if (n % 2 === 0 && n >= 6) {
      const k = n / 2, c = [P.reduce((s, q) => s + q[0], 0) / n, P.reduce((s, q) => s + q[1], 0) / n], r = P.map(q => len2(sub2(q, c)));
      const pari = r.filter((_, i) => i % 2 === 0), disp = r.filter((_, i) => i % 2), mp = pari.reduce((s, x) => s + x, 0) / k, md = disp.reduce((s, x) => s + x, 0) / k;
      const f = P.map(q => Math.atan2(q[1] - c[1], q[0] - c[0])), passo = P.every((q, i) => { let d = f[(i + 1) % n] - f[i]; while (d < 0) d += 2 * Math.PI; return Math.abs(d - Math.PI / k) < 0.1; });
      if (passo && Math.abs(mp / md - 1) > 0.25 && pari.every(x => Math.abs(x / mp - 1) < 0.07) && disp.every(x => Math.abs(x / md - 1) < 0.07))
        return { nome: `una stella a ${k} punte`, pts: Array.from({ length: n }, (_, i) => { const R = i % 2 ? md : mp, t = f[0] + Math.PI * i / k; return [c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)]; }) };
    }
    if (n > 8) return null;
    const L = P.map((p, i) => len2(sub2(P[(i + 1) % n], p))), ang = P.map((p, i) => { const u = sub2(P[(i - 1 + n) % n], p), v = sub2(P[(i + 1) % n], p); return Math.atan2(Math.abs(cross2(u, v)), dot2(u, v)); });
    if (n === 4 && ang.every(t => Math.abs(t - Math.PI / 2) < 0.17)) {
      const e0 = sub2(P[1], P[0]), e2 = sub2(P[2], P[3]), u = [e0[0] + e2[0], e0[1] + e2[1]], lu = len2(u), uu = [u[0] / lu, u[1] / lu], vv = [-uu[1], uu[0]];
      const la = (L[0] + L[2]) / 4, lb = (L[1] + L[3]) / 4, c = [P.reduce((s, q) => s + q[0], 0) / 4, P.reduce((s, q) => s + q[1], 0) / 4];
      return { nome: Math.abs(la - lb) < 0.03 * (la + lb) ? "un quadrato" : "un rettangolo", pts: [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => r4([c[0] + s * la * uu[0] + t * lb * vv[0], c[1] + s * la * uu[1] + t * lb * vv[1]])) };
    }
    const mL = L.reduce((s, x) => s + x, 0) / n, ai = Math.PI * (n - 2) / n;
    if (L.every(x => Math.abs(x / mL - 1) < 0.08) && ang.every(t => Math.abs(t - ai) < 0.17)) {
      const c = [P.reduce((s, q) => s + q[0], 0) / n, P.reduce((s, q) => s + q[1], 0) / n], R = P.reduce((s, q) => s + len2(sub2(q, c)), 0) / n, f0 = Math.atan2(P[0][1] - c[1], P[0][0] - c[0]);
      const nomi = { 3: "un triangolo equilatero", 5: "un pentagono", 6: "un esagono", 7: "un ettagono", 8: "un ottagono" };
      return { nome: nomi[n] || "un poligono regolare", pts: Array.from({ length: n }, (_, i) => r4([c[0] + R * Math.cos(f0 + 2 * Math.PI * i / n), c[1] + R * Math.sin(f0 + 2 * Math.PI * i / n)])) };
    }
    return null;
  }
  // la sagoma che usa la bolla: quella resa esatta, tranne per gli oggetti tondi (lì conta la larghezza a ogni altezza)
  const fotoSag = (modo) => (FD.reg && modo !== "tonda" ? FD.reg.pts : FD.sag);
  // misure di partenza della lettura scelta (quelle già toccate a mano restano)
  function fotoPartenza() {
    const d = fotoDef(), base = {}; d.params.forEach(q => { base[q.key] = q.def; });
    const p = Object.assign(base, FD.p || {}), metti = (k, v) => { if (!FD.toccati.has(k)) p[k] = v; };
    metti("modo", FD.auto);
    p.sag = FD.sag; p.det = +$("fdDet").value;
    const xs = FD.sag.map(q => q[0]), ys = FD.sag.map(q => q[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys), r1 = (x) => Math.round(x * 10) / 10;
    // taglio in basso: dove la sagoma è larga almeno il 40% della sua larghezza massima (così appoggia bene)
    let wMax = 0; for (let j = 1; j < 60; j++) wMax = Math.max(wMax, fotoLarghezza(FD.sag, bh * j / 60).w);
    let cut = 0; while (cut < 60 && fotoLarghezza(FD.sag, bh * Math.max(0.015, cut / 100)).w < 0.4 * wMax) cut++;
    metti("cut", cut);
    const hv = bh * (1 - cut / 100);
    metti("H", Math.min(8, Math.max(3, r1(hv >= bw ? 5.5 : 5.5 * hv / bw))));
    metti("L", Math.max(2, r1(7 * bw / Math.max(bw, bh))));
    metti("rh", Math.min(2, Math.max(0.6, r1(0.22 * 7 * Math.min(bw, bh) / Math.max(bw, bh)))));
    let roof = "cupola"; try { cupolaExtrude(fotoContorno(fotoSag("pianta"), fotoEps(p.det)), 2, 1); } catch (e) { roof = "piatto"; }
    metti("roof", roof);
    FD.p = p;
  }
  /* punti a mano: il contorno lo mettete voi, toccando l'immagine. I punti sono in pixel dell'immagine (FD.punti).
     Con «Specchia» si mette solo la metà destra: l'asse passa per il punto più a sinistra, e il primo e l'ultimo punto ci stanno sopra. */
  function puntiPieni() {
    const P = FD.punti;
    if (!FD.spec || P.length < 2) return P.map(q => q.slice());
    const xa = Math.min(...P.map(q => q[0])), ch = P.map(q => q.slice()); ch[0][0] = xa; ch[ch.length - 1][0] = xa;
    return ch.concat(ch.slice(1, -1).reverse().map(q => [2 * xa - q[0], q[1]]));
  }
  function fotoDaPunti(subito) {
    FD.errore = null; FD.modello = null;
    const P = puntiPieni();
    if (P.length < 3) { FD.sag = null; FD.reg = null; FD.nScelta = -1; fotoAggiorna(); return; }
    fotoNormalizza(P, 5);
    if (!subito) { disegnaFotoImg(); presto(() => fotoDaPunti(true)); return; }   // mentre si trascina: prima il disegno, poi il calcolo
    // la lettura si sceglie come per il contorno automatico, da una maschera disegnata dai punti
    const n = 120, c = document.createElement("canvas"); c.width = c.height = n;
    const g = c.getContext("2d"), sc = (n - 4) / Math.max(1e-6, ...[0, 1].map(k => Math.max(...FD.sag.map(q => q[k]))));
    g.beginPath(); FD.sag.forEach((q, i) => (i ? g.lineTo : g.moveTo).call(g, 2 + q[0] * sc, n - 2 - q[1] * sc)); g.closePath(); g.fill();
    const a = g.getImageData(0, 0, n, n).data, M = new Uint8Array(n * n); let area = 0;
    for (let i = 0; i < n * n; i++) if (a[4 * i + 3] > 127) { M[i] = 1; area++; }
    if (!area) { FD.errMod = "I punti non racchiudono niente."; fotoAggiorna(); return; }
    fotoDopoSagoma(M, area, n, n);
  }
  // dove va un punto nuovo: su un lato se toccate vicino a un lato, altrimenti dopo l'ultimo
  function puntoNuovo(q, raggio) {
    const P = FD.punti, chiuso = !FD.spec && P.length >= 3, nl = chiuso ? P.length : P.length - 1;
    let best = -1, bd = raggio;
    for (let i = 0; i < nl; i++) { const d = fotoDistSeg(q, P[i], P[(i + 1) % P.length]); if (d < bd) { bd = d; best = i + 1; } }
    const at = best >= 0 ? best : P.length; P.splice(at, 0, q); return at;
  }
  function puntoVicino(q, raggio) { let best = -1, bd = raggio; FD.punti.forEach((p, i) => { const d = len2(sub2(p, q)); if (d < bd) { bd = d; best = i; } }); return best; }
  function puntiDalAuto() {   // il contorno automatico, semplificato, come punti da correggere
    if (!FD.sagAuto) return false;
    let C; try { C = fotoContorno(FD.sagAuto, 0.015); } catch (e) { C = FD.sagAuto; }
    const { x0, y1, S } = FD.boxAuto; FD.punti = C.map(q => [q[0] * S + x0, y1 - q[1] * S]); FD.spec = false; $("fdPSpec").checked = false; return true;
  }
  function modoContorno(m) {
    FD.modoC = m;
    if (m === "punti") { FD.nScelta = -1; fotoDaPunti(true); return; }
    fotoAnalizza();
    if (m === "ia") iaAvvia();
    iaStato();
  }

  /* ---------- scontorno intelligente: SAM («Segment Anything», Meta AI, licenza Apache 2.0) nella versione leggera SlimSAM,
     eseguito nel browser con Transformers.js. Si scarica la prima volta che serve (poi resta nella memoria del browser),
     gira in un worker per non bloccare la pagina; se il browser non permette il worker, gira nella pagina.
     Un tocco = un punto «è soggetto» (o «è sfondo»); il modello restituisce tre sagome possibili con un punteggio. ---------- */
  const IA = { w: null, stato: "spento", prog: {}, fallita: false, msg: "", codId: null, inCorso: null };
  const IA_LIB = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2", IA_MODELLO = "Xenova/slimsam-77-uniform";
  // il lavoro del modello: questa funzione gira nel worker (copiata come testo) o, in riserva, nella pagina
  async function iaGestore(m, post, S) {
    try {
      if (m.type === "carica") {
        if (!S.T) {
          S.T = await import(m.lib);
          S.T.env.allowLocalModels = false;
          try { if (typeof caches === "undefined") throw 0; await caches.open("officina-prova"); } catch (e) { S.T.env.useBrowserCache = false; }
        }
        const prog = (p) => { if (p.status === "progress") post({ type: "prog", file: p.file, loaded: p.loaded, total: p.total }); };
        S.model = S.model || await S.T.SamModel.from_pretrained(m.modello, { quantized: true, progress_callback: prog });
        S.proc = S.proc || await S.T.AutoProcessor.from_pretrained(m.modello, { progress_callback: prog });
        post({ type: "pronto" });
      } else if (m.type === "immagine") {
        const img = new S.T.RawImage(new Uint8ClampedArray(m.rgb), m.w, m.h, 3);
        S.inp = await S.proc(img);
        S.emb = await S.model.get_image_embeddings(S.inp);
        post({ type: "codificata", id: m.id });
      } else if (m.type === "punti") {
        const r = S.inp.reshaped_input_sizes[0], n = m.punti.length;
        const ip = new S.T.Tensor("float32", Float32Array.from(m.punti.flatMap(p => [p[0] * r[1], p[1] * r[0]])), [1, 1, n, 2]);
        const il = new S.T.Tensor("int64", BigInt64Array.from(m.etichette.map(x => BigInt(x))), [1, 1, n]);
        const out = await S.model({ ...S.emb, input_points: ip, input_labels: il });
        const mm = await S.proc.post_process_masks(out.pred_masks, S.inp.original_sizes, S.inp.reshaped_input_sizes);
        const t = mm[0][0], dati = Uint8Array.from(t.data);
        post({ type: "maschere", id: m.id, dims: t.dims, data: dati, scores: Array.from(out.iou_scores.data) }, [dati.buffer]);
      }
    } catch (e) { post({ type: "errore", msg: String((e && e.message) || e) }); }
  }
  function iaWorker() {
    if (IA.w) return IA.w;
    try {
      const src = `const S = {}; const g = ${iaGestore.toString()};\nself.onmessage = (e) => g(e.data, (x, t) => self.postMessage(x, t || []), S);`;
      IA.w = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })), { type: "module" });
      IA.w.onerror = (e) => { e.preventDefault && e.preventDefault(); iaRiserva(); };
    } catch (e) { iaRiserva(); }
    if (IA.w && !IA.w.riserva) IA.w.onmessage = (e) => iaMessaggio(e.data);
    return IA.w;
  }
  function iaRiserva() {   // niente worker: il modello gira nella pagina (la pagina si ferma un attimo mentre guarda l'immagine)
    if (IA.w && IA.w.riserva) return;
    try { IA.w && IA.w.terminate && IA.w.terminate(); } catch (e) { /* niente */ }
    const S = {}; IA.w = { riserva: true, postMessage: (m) => setTimeout(() => iaGestore(m, (x) => iaMessaggio(x), S), 30) };
    if (IA.stato === "carico") { IA.stato = "spento"; iaAvvia(); }
  }
  function iaAvvia() {
    if (IA.fallita) return;
    const w = iaWorker(); if (!w) return;
    if (IA.stato === "spento") { IA.stato = "carico"; IA.prog = {}; w.postMessage({ type: "carica", lib: IA_LIB, modello: IA_MODELLO }); }
    else if (IA.stato === "pronto") iaCodifica();
    iaStato();
  }
  function iaCodifica() {   // l'immagine al modello (al massimo 1024 px, come la vuole SAM)
    if (!FD.orig || IA.stato !== "pronto") return;
    if (IA.codId === FD.imgId) { iaDecodifica(); return; }
    if (IA.inCorso === FD.imgId) return;
    const im = FD.orig, iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height, k = Math.min(1, 1024 / Math.max(iw, ih));
    const W = Math.max(8, Math.round(iw * k)), H = Math.max(8, Math.round(ih * k)), c = document.createElement("canvas");
    c.width = W; c.height = H; const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); g.drawImage(im, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data, rgb = new Uint8Array(W * H * 3);
    for (let i = 0, j = 0; i < d.length; i += 4) { rgb[j++] = d[i]; rgb[j++] = d[i + 1]; rgb[j++] = d[i + 2]; }
    IA.inCorso = FD.imgId; IA.stato = "codifico"; iaStato();
    IA.w.postMessage({ type: "immagine", id: FD.imgId, rgb: rgb.buffer, w: W, h: H }, [rgb.buffer]);
  }
  // il punto più dentro la sagoma trovata dai colori: il primo tocco del modello, se non ne avete fatti
  function puntoInterno(r) {
    const { M } = r, w = FD.w, h = FD.h, D = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) D[i] = M[i] ? 1e9 : 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (!D[i]) continue; let v = D[i]; if (x) v = Math.min(v, D[i - 1] + 1); if (y) v = Math.min(v, D[i - w] + 1); if (x && y) v = Math.min(v, D[i - w - 1] + 1.4); if (x < w - 1 && y) v = Math.min(v, D[i - w + 1] + 1.4); D[i] = v; }
    let best = 0; for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) { const i = y * w + x; if (!D[i]) continue; let v = D[i]; if (x < w - 1) v = Math.min(v, D[i + 1] + 1); if (y < h - 1) v = Math.min(v, D[i + w] + 1); if (x < w - 1 && y < h - 1) v = Math.min(v, D[i + w + 1] + 1.4); if (x && y < h - 1) v = Math.min(v, D[i + w - 1] + 1.4); D[i] = v; if (v > D[best]) best = i; }
    return { x: best % w + 0.5, y: ((best / w) | 0) + 0.5, fg: true };
  }
  function iaDecodifica() {
    if (IA.codId !== FD.imgId || IA.stato !== "pronto") return;
    let pts = FD.iaPunti;
    if (!pts.length) { FD.iaAuto = FD.mascheraColori && !FD.mascheraColori.no ? puntoInterno(FD.mascheraColori) : { x: FD.w / 2, y: FD.h / 2, fg: true }; pts = [FD.iaAuto]; }
    else FD.iaAuto = null;
    IA.attesa = true; iaStato();
    IA.w.postMessage({ type: "punti", id: FD.imgId, punti: pts.map(p => [p.x / FD.w, p.y / FD.h]), etichette: pts.map(p => (p.fg ? 1 : 0)), solo: pts.length === 1 && pts[0].fg });
  }
  function iaMessaggio(m) {
    if (m.type === "prog") { IA.prog[m.file] = m; iaStato(); }
    else if (m.type === "pronto") { IA.stato = "pronto"; iaStato(); if (FD.modoC === "ia" && FD.orig) iaCodifica(); }
    else if (m.type === "codificata") { IA.inCorso = null; IA.stato = "pronto"; if (m.id === FD.imgId) { IA.codId = m.id; iaDecodifica(); } else iaCodifica(); iaStato(); }
    else if (m.type === "maschere") {
      IA.attesa = false;
      if (m.id !== FD.imgId) return;
      const [nm, H, W] = m.dims.slice(-3), area = [], pts = FD.iaPunti.length ? FD.iaPunti : [FD.iaAuto];
      for (let c = 0; c < nm; c++) { let a = 0; for (let i = c * H * W; i < (c + 1) * H * W; i++) a += m.data[i]; area.push(a); }
      // un tocco solo «è soggetto»: tra le sagome buone la più grande (il soggetto intero, non un suo pezzo); altrimenti la migliore
      const top = Math.max(...m.scores); let sc = m.scores.indexOf(top);
      // (le tre sagome vanno dal pezzo all'oggetto intero: con un tocco solo si vuole l'oggetto, per un pezzo si toglie il resto con «−»)
      if (pts.length === 1 && pts[0].fg) { let ba = -1; m.scores.forEach((s, c) => { if (s >= Math.min(0.6, top) && area[c] < 0.9 * H * W && area[c] > ba) { ba = area[c]; sc = c; } }); }
      const fg = new Uint8Array(FD.w * FD.h), off = sc * H * W;
      for (let y = 0; y < FD.h; y++) { const sy = Math.min(H - 1, Math.floor((y + 0.5) * H / FD.h)); for (let x = 0; x < FD.w; x++) fg[y * FD.w + x] = m.data[off + sy * W + Math.min(W - 1, Math.floor((x + 0.5) * W / FD.w))] ? 1 : 0; }
      FD.iaRis = fotoRifinisci(fg, FD.w, FD.h);
      if (FD.modoC === "ia") fotoDaMaschera(FD.iaRis);
      iaStato();
    } else if (m.type === "errore") {
      IA.attesa = false; IA.inCorso = null;
      if (IA.stato === "carico" || IA.stato === "spento") { IA.fallita = true; IA.stato = "errore"; IA.msg = m.msg; if (FD.modoC === "ia") { FD.modoC = "auto"; fotoAnalizza(); } }
      else { IA.stato = "pronto"; IA.msg = m.msg; }
      iaStato();
    }
  }
  function iaStato() {
    const el = $("fdIaStato"), ia = FD.modoC === "ia";
    let t = "", cl = "fd-stato";
    if (IA.stato === "errore") { t = "Il modello intelligente non si è potuto scaricare (serve internet la prima volta, poi resta nel browser): uso il metodo Automatico, che funziona senza rete."; cl += " no"; }
    else if (ia && IA.stato === "carico") {
      const f = Object.values(IA.prog), tot = f.reduce((s, x) => s + (x.total || 0), 0), car = f.reduce((s, x) => s + (x.loaded || 0), 0);
      t = tot ? `Scarico il modello intelligente (solo la prima volta): ${fmt(car / 1048576, 1)} di ${fmt(tot / 1048576, 1)} MB<progress max="${tot}" value="${car}"></progress>` : "Preparo il modello intelligente… (la prima volta lo scarica da internet)";
      t += " Intanto vedete il contorno dai colori.";
    } else if (ia && IA.stato === "codifico") t = "Il modello sta guardando l'immagine…";
    else if (ia && IA.attesa) t = "Il modello cerca il soggetto…";
    el.innerHTML = t; el.className = cl; el.hidden = !t || (!ia && IA.stato !== "errore") || (IA.stato === "errore" && FD.modoC === "punti");
    const b = $("fdSeg").querySelector('[data-c="ia"]'); b.disabled = IA.fallita; b.title = IA.fallita ? "Non disponibile: il modello non si è potuto scaricare" : "Un modello di intelligenza artificiale riconosce il soggetto (serve internet la prima volta)";
  }

  function fotoAggiorna() {
    const aMano = FD.modoC === "punti";
    iaStato();
    $("fdSeg").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.c === FD.modoC)));
    $("fdAutoCtl").hidden = aMano; $("fdPuntiCtl").hidden = !aMano; $("fdImg").classList.toggle("punti", aMano);
    $("fdPUndo").disabled = !(FD.undoP && FD.undoP.length); $("fdPReset").disabled = !FD.punti.length; $("fdPAuto").disabled = !FD.sagAuto;
    // lettura scelta e campi delle misure di questa lettura
    const p = FD.p;
    $("fdModi").querySelectorAll("button").forEach(b => {
      b.setAttribute("aria-checked", String(!!p && b.dataset.m === p.modo));
      const em = b.querySelector("em"); if (em) em.remove();
      if (FD.auto === b.dataset.m && FD.sag) b.insertAdjacentHTML("afterbegin", "<em>consigliata</em>");
    });
    const campi = p ? fotoDef().params.filter(q => q.when && q.when(p)) : [];
    $("fdMisure").innerHTML = campi.map(q => q.type === "pick"
      ? `<div class="field"><label for="fdp_${q.key}">${esc(q.label)}</label><select id="fdp_${q.key}" data-k="${q.key}">${q.options.map(([v, l]) => `<option value="${v}"${v === p[q.key] ? " selected" : ""}>${esc(l)}</option>`).join("")}</select></div>`
      : `<div class="field"><label for="fdp_${q.key}">${esc(q.label)}</label><input id="fdp_${q.key}" data-k="${q.key}" type="number" step="${q.type === "int" ? 1 : q.step || 0.1}" min="${q.min}"${q.max ? ` max="${q.max}"` : ""} value="${p[q.key]}"></div>`).join("");
    const tocchi = FD.modoC === "ia" ? FD.iaPunti : FD.segni;
    $("fdTUndo").disabled = !(tocchi && tocchi.length) && !(FD.modoC === "auto" && FD.rett); $("fdTReset").disabled = $("fdTUndo").disabled;
    $("fdImgNota").className = FD.errore ? "warn" : "hint";
    const reg = FD.reg && p && p.modo !== "tonda" ? ` È ${FD.reg.nome}: l'ho reso preciso, così i pezzi sono di pochi tipi.` : "";
    const notaMano = FD.punti.length < 3
      ? (FD.spec ? "Toccate l'immagine sulla metà destra della forma, dall'alto in basso: il primo e l'ultimo punto vanno sull'asse. L'altra metà si copia da sola." : "Toccate l'immagine attorno alla forma, un punto dopo l'altro, nell'ordine del contorno. Ne servono almeno 3.")
      : `${plural(FD.punti.length, "punto", "punti")}. Toccate per aggiungerne uno dopo l'ultimo, o vicino a un lato per metterlo lì; trascinate per spostare; doppio clic o dito tenuto premuto per togliere.`;
    const notaIa = IA.codId === FD.imgId
      ? (FD.iaPunti.length ? `In verde il soggetto trovato dal modello (${plural(FD.iaPunti.length, "tocco", "tocchi")}). Toccate ancora per aggiungere una parte (+) o toglierla (−).` : "In verde il soggetto che il modello ha trovato da solo. Se non è quello giusto, toccate il soggetto; con «− È sfondo» toccate quello che deve sparire.")
      : "In verde, per ora, il contorno dai colori. Quando il modello è pronto, trova il soggetto da solo.";
    const notaAuto = FD.alpha ? "In verde il contorno preso dalla trasparenza dell'immagine." : "In verde il contorno trovato dai colori, senza internet. Trascinate un riquadro attorno al soggetto per aiutarlo; toccate per dire cos'è soggetto (+) e cos'è sfondo (−).";
    $("fdImgNota").textContent = aMano ? notaMano + (FD.sag ? reg : "") : FD.errore || (FD.modoC === "ia" ? notaIa : notaAuto) + reg;
    if (aMano) $("fdImgNota").className = "hint";
    fotoCostruisci();
  }
  function fotoCostruisci() {
    FD.modello = null;
    if (FD.sag && FD.p) {
      FD.p.sag = fotoSag(FD.p.modo);
      try { const r = buildShape(fotoDef(), FD.p, { cut: true }); r.an = analyze(r.V, r.F, r.floor); FD.modello = r; FD.errMod = null; }
      catch (e) { FD.errMod = e.message || "Con queste misure la forma non si può costruire."; }
    }
    const g = $("fdGiudizio");
    if (FD.modello) {
      const m = FD.modello, H = Math.max(...m.V.map(v => v[2]));
      g.innerHTML = `<p class="num">Alta ${mR(H)} · pavimento ${fmt(m.floorArea || 0, 1)} m² · ${plural(m.F.length, "pezzo", "pezzi")} di ${plural(m.an.types.length, "tipo", "tipi")}</p>` + giudizioHTML(giudizioBolla(m, FD.p));
    } else g.innerHTML = FD.sag ? `<div class="giudizio"><div class="giudizio-t ko">Così non si può fare</div><p class="warn">${esc(FD.errMod || "")}</p></div>` : "";
    { const t = g.querySelector(".giudizio-t"), e = $("fdEsito"); e.textContent = t ? t.textContent : ""; e.className = "fd-esito " + (t ? [...t.classList].find(c => c !== "giudizio-t") || "" : ""); }   // l'esito si vede anche senza scorrere
    $("fdUsa").disabled = !FD.modello;
    disegnaFotoImg(); disegnaFoto3d();
  }
  // sopra il disegno: il riquadro (Automatico) e i tocchi, verdi «+» per il soggetto e rossi «−» per lo sfondo
  function disegnaFotoImg() {
    disegnaFotoBase();
    const cv = $("fdImg"); if (!FD.src || FD.modoC === "punti") return;
    const ctx = cv.getContext("2d"), k = cv.width / FD.w, px = cv.width / (cv.getBoundingClientRect().width || cv.width);
    const R = FD.rettTmp || (FD.modoC === "auto" ? FD.rett : null);
    if (R) { ctx.save(); ctx.setLineDash([8 * px, 6 * px]); ctx.lineWidth = 2.5 * px; ctx.strokeStyle = "#fff"; ctx.strokeRect(Math.min(R.x0, R.x1) * k, Math.min(R.y0, R.y1) * k, Math.abs(R.x1 - R.x0) * k, Math.abs(R.y1 - R.y0) * k);
      ctx.setLineDash([]); ctx.lineWidth = 1 * px; ctx.strokeStyle = "#000"; ctx.strokeRect(Math.min(R.x0, R.x1) * k, Math.min(R.y0, R.y1) * k, Math.abs(R.x1 - R.x0) * k, Math.abs(R.y1 - R.y0) * k); ctx.restore(); }
    const lista = (FD.modoC === "ia" ? FD.iaPunti : FD.segni || []).map(s => ({ ...s, vuoto: false }));
    if (FD.modoC === "ia" && !FD.iaPunti.length && FD.iaAuto && IA.codId === FD.imgId) lista.push({ ...FD.iaAuto, vuoto: true });
    lista.forEach(s => { const x = s.x * k, y = s.y * k, r = 10 * px;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = s.vuoto ? "rgba(255,255,255,.75)" : s.fg ? "#1f9d6e" : "#c22f57"; ctx.fill(); ctx.lineWidth = 2 * px; ctx.strokeStyle = s.vuoto ? "#1f9d6e" : "#fff"; ctx.stroke();
      ctx.strokeStyle = s.vuoto ? "#1f9d6e" : "#fff"; ctx.lineWidth = 2.4 * px; ctx.beginPath(); ctx.moveTo(x - r * 0.5, y); ctx.lineTo(x + r * 0.5, y); if (s.fg) { ctx.moveTo(x, y - r * 0.5); ctx.lineTo(x, y + r * 0.5); } ctx.stroke(); });
  }
  function disegnaFotoBase() {
    const cv = $("fdImg"); if (!FD.src) return;
    const k = 2, W = FD.w * k, H = FD.h * k; if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const ctx = cv.getContext("2d"); ctx.clearRect(0, 0, W, H); ctx.drawImage(FD.src, 0, 0, W, H);
    const lw = Math.max(W, H) / 150;   // spessori in proporzione: il disegno si rimpicciolisce nella finestra
    ctx.lineJoin = "round";
    const aMano = FD.modoC === "punti", modo = FD.p ? FD.p.modo : "sagoma";
    if (aMano) {   // i punti messi a mano: contorno (con la metà copiata, se si specchia) e maniglie numerate
      const P = puntiPieni().map(q => [q[0] * k, q[1] * k]);
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.18)"; ctx.fillRect(0, 0, W, H); ctx.restore();   // l'immagine un po' più scura: i punti si vedono meglio
      if (P.length >= 2) {
        poly(ctx, P); if (P.length >= 3) { ctx.fillStyle = "rgba(60,200,150,.25)"; ctx.fill(); }
        if (P.length === 2) { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); ctx.lineTo(P[1][0], P[1][1]); }
        ctx.strokeStyle = "#fff"; ctx.lineWidth = lw * 2.2; ctx.stroke(); ctx.strokeStyle = "#1f9d6e"; ctx.lineWidth = lw; ctx.stroke();
      }
      if (FD.spec && FD.punti.length) { const xa = Math.min(...FD.punti.map(q => q[0])) * k; ctx.save(); ctx.setLineDash([lw * 3, lw * 2.4]); ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = lw * 0.8; ctx.beginPath(); ctx.moveTo(xa, 0); ctx.lineTo(xa, H); ctx.stroke(); ctx.restore(); }
      // maniglie di grandezza fissa sullo schermo (circa 22 px), comode da prendere anche col dito
      const px = W / (cv.getBoundingClientRect().width || W), rM = 11 * px;
      ctx.font = `700 ${11 * px}px IBM Plex Mono, monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      FD.punti.forEach((q, i) => { const x = q[0] * k, y = q[1] * k, ult = i === FD.punti.length - 1;
        ctx.beginPath(); ctx.arc(x, y, rM, 0, 7); ctx.fillStyle = ult ? "#c22f57" : "#1f9d6e"; ctx.fill(); ctx.lineWidth = 2 * px; ctx.strokeStyle = "#fff"; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.fillText(String(i + 1), x, y + px); });
    }
    if (!FD.sag) return;
    const { x0, y1, S } = FD.box, toPx = (q) => [(q[0] * S + x0) * k, (y1 - q[1] * S) * k];
    if (!aMano) {
      let C; try { C = modo === "tonda" ? FD.sag : fotoContorno(FD.p.sag || FD.sag, fotoEps(FD.p.det)); } catch (e) { C = FD.sag; }
      ctx.fillStyle = "rgba(60,200,150,.22)"; poly(ctx, C.map(toPx)); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = lw * 2.2; ctx.stroke(); ctx.strokeStyle = "#1f9d6e"; ctx.lineWidth = lw; ctx.stroke();
      if (modo !== "tonda") C.forEach(q => { const s = toPx(q); ctx.beginPath(); ctx.arc(s[0], s[1], lw * 1.3, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.lineWidth = lw * 0.6; ctx.stroke(); });
    }
    if (!FD.p) return;
    const ys = FD.sag.map(q => q[1]), b0 = Math.min(...ys), b1 = Math.max(...ys);
    ctx.save(); ctx.setLineDash([lw * 3, lw * 2.4]); ctx.lineWidth = lw * 0.8;
    if (FD.p.modo === "tonda" && !(aMano && FD.spec)) {   // l'asse attorno a cui gira
      const xs = FD.sag.map(q => q[0]), xm = (Math.min(...xs) + Math.max(...xs)) / 2, a = toPx([xm, b1]), b = toPx([xm, b0]);
      ctx.strokeStyle = "rgba(60,60,60,.7)"; ctx.beginPath(); ctx.moveTo(a[0], a[1] - 10); ctx.lineTo(b[0], b[1] + 10); ctx.stroke();
    }
    if (FD.p.modo !== "pianta" && FD.p.cut > 0) {   // il taglio in basso: il pavimento
      const z = b0 + (b1 - b0) * FD.p.cut / 100, y = toPx([0, z])[1];
      ctx.strokeStyle = "#c22f57"; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      ctx.fillStyle = "rgba(194,47,87,.12)"; ctx.fillRect(0, y, W, H - y);
    }
    ctx.restore();
  }
  function disegnaFoto3d() {
    const cv = $("fd3d"); if (!cv) return;
    if (!FD.modello) { cv.getContext("2d").clearRect(0, 0, cv.width, cv.height); return; }
    if (H.disegna3d) H.disegna3d(cv, FD.modello, { yaw: FD.yaw, pitch: FD.pitch });
  }
  // la bolla dell'anteprima diventa la forma scelta: i parametri della forma "foto" vanno alla pagina
  function fotoUsa() {
    if (!FD.modello) return;
    const vals = {}; fotoDef().params.forEach(q => { vals[q.key] = q.type === "sagoma" ? FD.p[q.key].map(x => x.slice()) : FD.p[q.key]; });
    $("fotoDlg").close();
    if (H.onUsa) H.onUsa(vals, FD.modello);
  }
  let tFoto = 0; const presto = (f) => { clearTimeout(tFoto); tFoto = setTimeout(f, 70); };
  function collega() {   // i comandi della finestra (una volta sola, quando la finestra nasce)
    $("fdAltra").addEventListener("click", () => fileIn.click());
    $("fdX").addEventListener("click", () => $("fotoDlg").close());
    $("fdAnnulla").addEventListener("click", () => $("fotoDlg").close());
    $("fdUsa").addEventListener("click", fotoUsa);
    // tocchi e riquadro: «+ È soggetto» / «− È sfondo» (anche col tasto destro o con Maiusc), Annulla e Ricomincia
    let segnoFg = true;
    $("fdSegno").addEventListener("click", e => { const b = e.target.closest("button[data-s]"); if (!b) return; segnoFg = b.dataset.s === "1"; $("fdSegno").querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); });
    const fotoTocchiCambiati = () => { if (FD.modoC === "ia") { if (IA.codId === FD.imgId) iaDecodifica(); fotoAggiorna(); } else fotoAnalizza(); };
    $("fdTUndo").addEventListener("click", () => {
      if (FD.modoC === "ia") { const u = FD.undoIa.pop(); if (u) FD.iaPunti = u; }
      else { const u = FD.undoS.pop(); if (u) { FD.segni = u.segni; FD.rett = u.rett; } }
      fotoTocchiCambiati();
    });
    $("fdTReset").addEventListener("click", () => {
      if (FD.modoC === "ia") { FD.undoIa.push(FD.iaPunti.slice()); FD.iaPunti = []; }
      else { FD.undoS.push({ segni: FD.segni.slice(), rett: FD.rett }); FD.segni = []; FD.rett = null; }
      fotoTocchiCambiati();
    });
    $("fdDet").addEventListener("input", e => { if (FD.p) { FD.p.det = +e.target.value; presto(fotoCostruisci); } });
    $("fdModi").addEventListener("click", e => { const b = e.target.closest("button[data-m]"); if (!b || !FD.p) return; FD.p.modo = b.dataset.m; FD.toccati.add("modo"); fotoAggiorna(); });
    $("fdModi").addEventListener("keydown", e => {   // le tre letture si scelgono anche con le frecce
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
      const b = [...$("fdModi").querySelectorAll("button")], i = b.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); const n = b[(i + d + b.length) % b.length]; n.click(); n.focus();
    });
    $("fdMisure").addEventListener("input", e => {
      const t = e.target, k = t.dataset.k, q = k && fotoDef().params.find(x => x.key === k); if (!q) return;
      let v = q.type === "pick" ? t.value : parseFloat(t.value);
      if (q.type !== "pick") { if (!(v >= q.min) || (q.max && v > q.max)) return; if (q.type === "int") v = Math.round(v); }
      FD.p[k] = v; FD.toccati.add(k);
      if (q.type === "pick") fotoAggiorna(); else presto(fotoCostruisci);
    });
    { // sull'immagine: in automatico un tocco sceglie il colore della forma; a mano mette, sposta e toglie i punti
      const cv = $("fdImg"); let pd = null, tieni = 0;
      const aPixel = (e) => { const r = cv.getBoundingClientRect(); return { q: [Math.min(FD.w, Math.max(0, (e.clientX - r.left) / r.width * FD.w)), Math.min(FD.h, Math.max(0, (e.clientY - r.top) / r.height * FD.h))], s: FD.w / r.width }; };
      const salva = () => { FD.undoP.push(FD.punti.map(q => q.slice())); if (FD.undoP.length > 80) FD.undoP.shift(); };
      const togli = (i) => { if (i < 0) return; salva(); FD.punti.splice(i, 1); fotoDaPunti(true); };
      cv.addEventListener("pointerdown", e => {
        if (!FD.src) return;
        const { q, s } = aPixel(e);
        if (FD.modoC !== "punti") {   // tocco (o, in Automatico, riquadro trascinato)
          e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (er) { /* niente */ }
          pd = { tocco: true, q0: q, s, fg: segnoFg && !e.shiftKey && e.button !== 2 }; return;
        }
        e.preventDefault(); if (e.detail > 1) return;   // il secondo clic di un doppio clic serve solo a togliere
        try { cv.setPointerCapture(e.pointerId); } catch (er) { /* niente */ }
        const i = puntoVicino(q, 16 * s);
        salva();
        if (i >= 0) pd = { i, mosso: false };
        else { pd = { i: puntoNuovo(q, 10 * s), mosso: true }; fotoDaPunti(true); }
        clearTimeout(tieni);
        if (i >= 0 && e.pointerType !== "mouse") tieni = setTimeout(() => { if (pd && !pd.mosso) { const j = pd.i; pd = null; FD.undoP.pop(); togli(j); } }, 650);
      });
      cv.addEventListener("pointermove", e => {
        if (pd && pd.tocco) {
          const { q } = aPixel(e);
          if (FD.modoC === "auto" && Math.hypot(q[0] - pd.q0[0], q[1] - pd.q0[1]) > 8 * pd.s) { FD.rettTmp = { x0: pd.q0[0], y0: pd.q0[1], x1: q[0], y1: q[1] }; disegnaFotoImg(); }
          return;
        }
        if (!pd || FD.modoC !== "punti") return;
        const { q } = aPixel(e), p = FD.punti[pd.i]; if (!p || (Math.abs(p[0] - q[0]) < 0.3 && Math.abs(p[1] - q[1]) < 0.3)) return;
        pd.mosso = true; clearTimeout(tieni); FD.punti[pd.i] = q; fotoDaPunti(false);
      });
      const fine = (e) => {
        clearTimeout(tieni); if (!pd) return;
        if (pd.tocco) {
          const t = pd, R = FD.rettTmp; pd = null; FD.rettTmp = null;
          if (e && e.type === "pointercancel") { disegnaFotoImg(); return; }
          if (FD.modoC === "ia") { FD.undoIa.push(FD.iaPunti.slice()); FD.iaPunti.push({ x: t.q0[0], y: t.q0[1], fg: t.fg }); }
          else {
            FD.undoS.push({ segni: FD.segni.slice(), rett: FD.rett });
            if (R && Math.abs(R.x1 - R.x0) > 10 && Math.abs(R.y1 - R.y0) > 10) FD.rett = R; else FD.segni.push({ x: t.q0[0], y: t.q0[1], fg: t.fg });
          }
          fotoTocchiCambiati(); return;
        }
        if (!pd.mosso) FD.undoP.pop(); pd = null; fotoDaPunti(true);
      };
      cv.addEventListener("pointerup", fine); cv.addEventListener("pointercancel", fine);
      cv.addEventListener("contextmenu", e => { if (FD.modoC !== "punti") e.preventDefault(); });
      cv.addEventListener("dblclick", e => { if (FD.modoC !== "punti") return; const { q, s } = aPixel(e); togli(puntoVicino(q, 16 * s)); });
    }
    $("fdSeg").addEventListener("click", e => { const b = e.target.closest("button[data-c]"); if (b && b.dataset.c !== FD.modoC) modoContorno(b.dataset.c); });
    $("fdPUndo").addEventListener("click", () => { const p = FD.undoP.pop(); if (p) { FD.punti = p; fotoDaPunti(true); } });
    $("fdPReset").addEventListener("click", () => { if (!FD.punti.length) return; FD.undoP.push(FD.punti.map(q => q.slice())); FD.punti = []; fotoDaPunti(true); });
    $("fdPAuto").addEventListener("click", () => { FD.undoP.push(FD.punti.map(q => q.slice())); if (puntiDalAuto()) fotoDaPunti(true); });
    $("fdPSpec").addEventListener("change", e => { FD.spec = e.target.checked; fotoDaPunti(true); });
    { // girare il modellino trascinando
      const cv = $("fd3d"); let da = null;
      cv.addEventListener("pointerdown", e => { da = [e.clientX, e.clientY, FD.yaw, FD.pitch]; try { cv.setPointerCapture(e.pointerId); } catch (er) { /* niente */ } });
      cv.addEventListener("pointermove", e => { if (!da) return; FD.yaw = da[2] - (e.clientX - da[0]) * 0.01; FD.pitch = Math.max(-0.2, Math.min(1.3, da[3] + (e.clientY - da[1]) * 0.008)); disegnaFoto3d(); });
      const fine = () => { da = null; }; cv.addEventListener("pointerup", fine); cv.addEventListener("pointercancel", fine);
    }
    window.addEventListener("resize", () => { if ($("fotoDlg").open) disegnaFoto3d(); });
  }
  return {
    carica(file, opz) { if (opz) H = opz; prepara(); fotoCarica(file); },
    riapri(opz) {   // l'ultima immagine (di questa visita, o salvata nel browser)
      if (opz) H = opz; prepara();
      if (FD.src) { if (!$("fotoDlg").open) $("fotoDlg").showModal(); fotoAggiorna(); requestAnimationFrame(() => { disegnaFotoImg(); disegnaFoto3d(); }); return true; }
      let u = null; try { u = localStorage.getItem("bolle|foto-img"); } catch (e) { /* niente di salvato */ }
      if (!u) return false; const im = new Image(); im.onload = () => fotoDaImmagine(im, false); im.src = u; return true;
    },
    ultima() { try { return !!FD.src || !!localStorage.getItem("bolle|foto-img"); } catch (e) { return !!FD.src; } },
    scegli(opz) { if (opz) H = opz; fileIn.click(); },
    giudizioHTML,
  };
})();
