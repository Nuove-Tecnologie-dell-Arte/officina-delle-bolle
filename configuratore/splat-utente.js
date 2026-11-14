// [Officina] Lo splat «tuo»: caricato dalla pagina misura-splat.html e usato come scenario del simulatore.
// Sta nel browser (IndexedDB), non va su nessun server. Script classico, caricato sia dalla pagina di misura sia dal sito e dal simulatore (stessa origine).
// Un solo splat salvato: { nome, blob, misura: { alto, scala, alza }, par: { pianta, W, P, H, ... }, vista: { cam, mira }, data }.
window.SplatUtente = (() => {
  const DB = 'officina-splat', ST = 's', CH = 'utente';
  const apri = () => new Promise((ok, no) => {
    if (!window.indexedDB) { no(new Error('Questo browser non può salvare lo splat.')); return; }
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(ST);
    r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error);
  });
  const op = (modo, f) => apri().then(db => new Promise((ok, no) => {
    const t = db.transaction(ST, modo), q = f(t.objectStore(ST));
    t.oncomplete = () => { db.close(); ok(q && q.result); }; t.onerror = t.onabort = () => { db.close(); no(t.error); };
  }));
  return {
    salva: d => op('readwrite', s => s.put(Object.assign({ data: Date.now() }, d), CH)),
    leggi: () => op('readonly', s => s.get(CH)).then(d => d || null, () => null),
    togli: () => op('readwrite', s => s.delete(CH)),
  };
})();
