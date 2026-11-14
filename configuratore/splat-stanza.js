// [Officina] Scenario con uno splat (scansione 3D a gaussiane): lo disegna Spark in un canvas DIETRO quello del simulatore.
// Il simulatore usa three.js r128 (script classico); Spark vuole three.js recente (modulo ES). Le due versioni non si possono mescolare
// in una scena sola, quindi lo splat ha il suo renderer e la sua camera, che a ogni fotogramma copia quella del simulatore.
// Il canvas del simulatore sta sopra, con lo sfondo trasparente: le bolle si vedono dentro lo splat.
// Limite noto: le due scene non condividono la profondità, quindi lo splat non può nascondere una bolla (un pilastro davanti a una bolla
// non la copre). Le pareti del simulatore (la «pianta» della stanza) restano quelle che fermano le bolle.
// Caricato da index.html con import('./splat-stanza.js'), dopo aver scritto la importmap con three e Spark (versioni fissate là).
import * as THREE from 'three';
import { SparkRenderer, SplatMesh, SplatEdit, SplatEditSdf, SplatEditSdfType, SplatEditRgbaBlendMode } from '@sparkjsdev/spark';

let renderer = null, scena = null, camera = null, spark = null, mesh = null, canvasSim = null, contenitore = null;
let largo = 0, alto = 0;

// ---- Pareti viste da dietro: come il «backface culling» del materiale, ma per gli splat ----
// Uno splat non ha facce. Quando la camera sta fuori da una parete, gli splat dal suo lato (la parete e quello che c'è subito dietro)
// si rendono trasparenti, e si vede dentro la stanza. Ogni parete è una SCATOLA (SplatEditSdf BOX) lunga come il muro, alta come la stanza e profonda
// PROF metri verso l'esterno: Spark azzera l'opacità degli splat dentro la scatola. Le scatole, e non piani infiniti, perché in un chiostro un piano
// nasconderebbe anche gli altri bracci. Le forme sono valutate in coordinate del mondo (dopo la trasformazione dello splat).
// Con più forme nella stessa modifica Spark dà a ogni splat i valori della forma PIÙ VICINA (distanza con segno minima), non l'unione: le forme spente
// vanno quindi lontanissimo (distanza sempre molto positiva), altrimenti vincerebbero su quelle accese.
const N_MURI = 12, INSET = 0.3, PROF = 3, ALTO_SCATOLA = 10;
let modifica = null, scatole = [], soffitto = null;
const vTmp = new THREE.Vector3(), mTmp = new THREE.Matrix4(), ASSE_Z = new THREE.Vector3(0, 0, 1);
function preparaMuri(m) {
  modifica = new SplatEdit({ rgbaBlendMode: SplatEditRgbaBlendMode.MULTIPLY, sdfSmooth: 0, softEdge: 0 });
  scatole = [];
  for (let i = 0; i < N_MURI; i++) scatole.push(new SplatEditSdf({ type: SplatEditSdfType.BOX, opacity: 1, color: new THREE.Color(1, 1, 1), radius: 0 }));
  soffitto = new SplatEditSdf({ type: SplatEditSdfType.PLANE, opacity: 1, color: new THREE.Color(1, 1, 1) });
  modifica.sdfs = [...scatole, soffitto]; m.edits = [modifica];
}
function spegni(s) {   // lontanissimo e senza effetto
  s.position.set(0, -1e5, 0); s.quaternion.identity(); s.scale.set(0.01, 0.01, 0.01); s.opacity = 1;
}
function scatolaSu(s, w) {   // la scatola della parete w: da INSET dentro il muro a PROF verso fuori, lunga L (+ un po' agli angoli), alta ALTO_SCATOLA
  const X = vTmp.set(w.nz, 0, -w.nx);   // asse x = y × n: la base (x, y, z=n) è destrorsa
  mTmp.makeBasis(X, new THREE.Vector3(0, 1, 0), new THREE.Vector3(w.nx, 0, w.nz));
  s.quaternion.setFromRotationMatrix(mTmp);
  const prof = PROF + INSET, c = prof / 2 - INSET;   // metà dello spessore, centro spostato verso fuori
  s.position.set(w.mx + w.nx * c, ALTO_SCATOLA / 2 - 1, w.mz + w.nz * c);
  s.scale.set(w.L / 2 + 0.15, ALTO_SCATOLA / 2, prof / 2);
  s.opacity = 0;
}
// muri: { muri: [{ mx, mz, nx, nz, L, acceso }] (centro del tratto, normale verso l'esterno, lunghezza, da nascondere o no), H } oppure null
function aggiornaMuri(cam, muri) {
  if (!scatole.length) return;
  let k = 0;
  if (muri) for (const w of muri.muri) { if (k >= N_MURI) break; if (w.acceso) scatolaSu(scatole[k++], w); }
  for (; k < N_MURI; k++) spegni(scatole[k]);
  // il soffitto a volta: guardando da sopra si toglie (dai ~1 m sotto l'altezza dei controlli in su), altrimenti nasconderebbe tutto
  if (muri && cam.position.y > muri.H + 1.8) {
    soffitto.position.set(0, muri.H - 1, 0); soffitto.quaternion.setFromUnitVectors(ASSE_Z, vTmp.set(0, -1, 0)); soffitto.scale.set(1, 1, 1); soffitto.opacity = 0;   // il +z locale guarda in basso: si nasconde ciò che sta sopra
  } else { soffitto.position.set(0, -1e5, 0); soffitto.quaternion.setFromUnitVectors(ASSE_Z, vTmp.set(0, 1, 0)); soffitto.opacity = 1; }
}

export async function caricaSplat(url) {   // scarica e prepara lo splat, senza ancora mostrarlo (resta qui finché non è pronto)
  const m = new SplatMesh({ url });
  await m.initialized;
  return m;
}

export function scartaSplat(m) { try { m && m.dispose && m.dispose(); } catch (e) {} }

function crea() {
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });   // antialias spento: con gli splat non serve e pesa
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x1b1e22, 1);   // dove lo splat non copre niente (oltre le pareti) un grigio scuro neutro
  Object.assign(renderer.domElement.style, { position: 'absolute', left: '0', top: '0', zIndex: '-1', pointerEvents: 'none' });   // sotto tutto il resto del contenitore (che è isolato, vedi mettiSplat)
  scena = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.05, 400);
  spark = new SparkRenderer({ renderer });
  scena.add(spark);
}

// Mette in scena lo splat caricato (toglie quello di prima) e apre il canvas dietro quello del simulatore.
export function mettiSplat(m, cont, cvSim) {
  if (!renderer) crea();
  contenitore = cont; canvasSim = cvSim;
  if (renderer.domElement.parentNode !== cont) cont.insertBefore(renderer.domElement, cvSim);
  cont.style.isolation = 'isolate';   // il contenitore diventa un contesto a sé: lo splat (z-index −1) sta sotto il canvas del simulatore e le sue etichette, senza finire dietro lo sfondo della pagina
  if (mesh) { scena.remove(mesh); scartaSplat(mesh); }
  mesh = m; scena.add(mesh); preparaMuri(mesh);
  renderer.domElement.style.display = 'block'; largo = alto = 0;
}

// Via lo splat: il canvas si nasconde e la memoria si libera.
export function togliSplat() {
  if (mesh) { scena.remove(mesh); scartaSplat(mesh); mesh = null; modifica = null; scatole = []; soffitto = null; }
  if (renderer) { renderer.domElement.style.display = 'none'; renderer.domElement.style.filter = ''; }
  if (contenitore) contenitore.style.isolation = '';
}

// A ogni fotogramma, dopo il disegno del simulatore: copia la camera del simulatore, mette lo splat dove sta la «stanza» e lo disegna.
// cam: la camera del simulatore (three r128); p: { x, z, rot (gradi), luce, w, h, muri, nascondiMuri } della stanza e dello spazio disponibile.
export function disegnaSplat(cam, p) {
  if (!renderer || !mesh) return;
  if (p.w !== largo || p.h !== alto) { largo = p.w; alto = p.h; renderer.setSize(p.w, p.h); }
  camera.position.set(cam.position.x, cam.position.y, cam.position.z);
  camera.quaternion.set(cam.quaternion.x, cam.quaternion.y, cam.quaternion.z, cam.quaternion.w);
  camera.fov = cam.fov; camera.near = cam.near; camera.far = cam.far; camera.aspect = cam.aspect; camera.zoom = cam.zoom;
  const v = cam.view;
  if (v && v.enabled) camera.setViewOffset(v.fullWidth, v.fullHeight, v.offsetX, v.offsetY, v.width, v.height); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  mesh.position.set(p.x, 0, p.z); mesh.rotation.y = p.rot * Math.PI / 180;   // come il gruppo della stanza nel simulatore
  aggiornaMuri(camera, p.nascondiMuri === false ? null : (p.muri || null));   // nascondiMuri === false: pareti sempre visibili (per i confronti)
  const f = p.luce === 1 ? '' : `brightness(${p.luce})`;
  if (renderer.domElement.style.filter !== f) renderer.domElement.style.filter = f;
  renderer.render(scena, camera);
}
