# Prova unita · Piano di lavoro

> **Per chi esegue:** sotto-skill obbligatoria: superpowers:subagent-driven-development (consigliata) oppure superpowers:executing-plans. Si lavora un blocco alla volta, e ogni passo ha una casella (`- [ ]`) da spuntare.

**Obiettivo:** dare alla prova estetica, già nel branch `prova-unita`, le funzioni più complete della prova semplice, e togliere il conto delle persone.

**Come:**
- Tutto il lavoro è in `index.html` (la pagina a tappe dell'estetica), in `motore.js` e in `configuratore/index.html` (l'Abbofficina).
- Il codice della semplice si porta a mano e si adatta allo stato dell'estetica:
  - `PR` è il progetto, con `PR.bolle`, `PR.aree` e `PR.att`;
  - `S` è la bolla scelta;
  - `cur` è la bolla costruita;
  - `TAPPE` e `vai(t)` sono le tappe.
- La pagina parla con due iframe:
  - `#vetrina` (`?vetrina=1`), che c'è già;
  - `#simTutta` (`?incorporata=1`), nuovo, che si apre con ↗.

**Strumenti:**
- HTML, CSS e JS senza librerie nella pagina; three.js r128 nell'Abbofficina.
- Prove con puppeteer-core e @sparticuz/chromium.

**Progetto:** `docs/superpowers/specs/2026-11-11-prova-unita-design.md`.

**Codice della semplice da cui si copia:** `C:\Users\ASUS\Desktop\bolla-d20-semplice` (branch `interfaccia-semplice`, commit `b6172f7`).

## Regole per tutto il lavoro

- Testi, commenti e messaggi dei commit in italiano.
- Nella pagina le aggiunte si segnano `[Unita]`, nell'Abbofficina `[Officina]`.
- Le modifiche all'Abbofficina si scrivono anche in `configuratore/MODIFICHE.md`.
- `MODIFICHE.md` alla radice si crea nel blocco 1 e cresce di una sezione a ogni blocco.
- Il nastro magnetico non torna.
- Tra le chiusure delle porte e dei collegamenti nella pagina ci sono solo Zip e Velcro. Le zip impermeabile e stagna restano solo nell'Abbofficina.
- La pagina resta solo in tema chiaro, compresa la vetrina.
- Un commit per blocco, con messaggio `Prova unita, blocco N: …`, che finisce con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Si fa il push solo quando lo dice l'utente.
- Nei commit non vanno `.claude/`, `.gitignore` e `.impeccable/`.
- I file salvati nel browser con l'estetica (`bolle|progetti`) si devono riaprire senza errori.

## Prove

- **Server:** in `C:\Users\ASUS\Desktop\bolla-d20\.claude\launch.json` si aggiunge `unita`: `python -m http.server 8010 --bind 127.0.0.1 --directory C:\Users\ASUS\Desktop\bolla-d20-unita` (porta 8010). Si avvia con `preview_start {name:"unita"}`.
- **Cartella delle prove** (qui la chiamiamo `T`): `C:\Users\ASUS\AppData\Local\Temp\claude\C--Users-ASUS-Desktop-bolla-d20\833a6f3d-227f-423b-8daf-7c2f5eb64b91\scratchpad\pacchetto\progetto-bolle\test`.
  - Ci sono già `node_modules` con puppeteer-core, @sparticuz/chromium e three.
  - Lo schema di partenza è `_b1.js`: lancio, intercettazione di three.js in locale, raccolta degli errori.
- **`T\unita_lib.js`** (si crea nel blocco 1) esporta:
  - `apri(viewport) -> { b, pg, errs }`: apre `http://localhost:8010/index.html` con `localStorage` vuoto e three.js servito in locale;
  - `scegli(pg, id)`: Cominciamo → Progetta → linguetta Forme → tessera `id`; aspetta 1,5 s;
  - `vetrina(pg) -> Frame`: il frame di `#vetrina`.
- **Le prove dei blocchi:** ogni blocco ha `T\uN.js`. Stampa `OK <nome>` o `NO <nome>: <motivo>` per ogni controllo, e in fondo `ERRORI <n>`. Passa quando non c'è nessun `NO` e c'è `ERRORI 0`.
- **L'Abbofficina da sola:** si rilancia `scratchpad/suite.sh` con `BOLLE_HTML='C:/Users/ASUS/Desktop/bolla-d20-unita/configuratore/index.html'`. Devono passare tutti gli 11 test.

## Attenzione: casi che nessun test di blocco copre da solo

1. **Progetto già salvato con l'estetica** (`bolle|progetti` con `dim` scritte a mano e `lock:false`): si deve riaprire uguale, senza tornare alle misure di base. La prova sta in `u1.js` («riapre progetto vecchio»).
2. **Più bolle e ↗**: con ↗ aperto sulla Bolla 2, una misura cambiata là deve cambiare la Bolla 2 e non la bolla scelta prima. La prova sta in `u4.js` («↗ segue la bolla scelta»).
3. **Senza internet** (three.js che non arriva): pagina, Schema, dime, lista e cantiere devono funzionare. La lista dice «La lista con i prezzi arriva dal simulatore» invece di restare vuota. La prova sta in `u3.js` («senza simulatore»).
4. **Telefono (390 px):**
   - cursori, foglio dei materiali, tabella dei prezzi (scorre dentro il suo riquadro, la pagina no), schede delle dime e cantiere senza scorrimento orizzontale della pagina;
   - prova in ogni `uN.js`: `document.documentElement.scrollWidth <= 390`.
5. **File aperto con un progetto diverso** mentre ci sono le spunte: le spunte del progetto vecchio non devono finire su quello nuovo. La prova sta in `u7.js` («apri file sostituisce spunte»).

---

### Task 1: Blocco 1 · Motore e niente conto delle persone

**File:**
- Modifica:
  - `motore.js`: si prende quello della semplice e si rimettono le modifiche dell'estetica;
  - `index.html`;
  - `configuratore/index.html` (`FORME_OFF`).
- Crea:
  - `MODIFICHE.md`;
  - `T\unita_lib.js`;
  - `T\u1.js`.

**Cosa usa e cosa produce:**
- **Produce `buildShape(def, p, opt)`:** con `opt.size = { x, y, z }` (in metri, tutte > 0) la forma si allunga o si schiaccia fino a quelle misure. Il risultato ha `sc = [sx, sy, sz]` e `floorArea` e `volume` già riscalati. Senza `opt.size` resta come prima.
- **Produce `costruisci(id, p, dim)` nella pagina:** stessa firma e stesso risultato di adesso (`m` con `an`, `H`, `W`, `D`, `id`), ma dentro chiama `buildShape(def(id), p, { ...optBase(def(id)), size: dim })`.
- **Produce `dimIniziali(id, p)`:** le misure di base della forma (`base(id, p)`: `w`, `d`, `h`), rimpicciolite con `scalaDim` se non entrano nell'area.
- **Toglie** `persone`, `M2P`, `#nAdatta` e `.riga-persone`. Gli altri blocchi non devono più usarli.

**I passi:**

- [ ] **Passo 1: scrivere `T\unita_lib.js` e `T\u1.js`.**

  Controlli di `u1.js`:
  - `nomi`: dopo `scegli(pg,'d20')` la tessera scelta e la testata dicono «Icosaedro»; `calcio` dice «Icosaedro troncato».
  - `partenza`: la forma `d20` parte con `S.dim` uguale a `w`, `d`, `h` del lato da 2,2 m (alta 3,028 m, ±0,01).
  - `area`: con un'area di lavoro X=3, Y=3, Z=2,5 la forma `d20` appena scelta ha `S.dim.z <= 2,5` e la base entra.
  - `niente persone`: non ci sono `#nAdatta`, `.persone-n` e la pill «persone» sopra il simulatore. Il testo di `#fondo` non contiene «ci stanno». Il giudizio del pavimento non contiene «persone». Le FAQ non hanno la domanda «Quante persone possono entrare?».
  - `stessa forma`: per `d20` con `dim` {4, 4, 3}, i vertici di `costruisci` sono uguali (±1e-6) a quelli di `buildShape` con `size`.
  - `riapre progetto vecchio`: si mette in `localStorage` un `bolle|progetti` dell'estetica con `dim:{x:5,y:3,z:2.5}` e `lock:false` su `box`; ricaricando, `S.dim` è ancora {5, 3, 2,5}.
  - `riapre progetto vecchio`: c'è anche un `bolle|progetti` con `shape:"d20"` salvato con il nome vecchio (si salva il codice, non il nome) e si riapre.
- [ ] **Passo 2: lanciare `node u1.js`.** Ci si aspetta `NO nomi`, `NO partenza`, `NO niente persone`.
- [ ] **Passo 3: `motore.js`.** Si parte da quello della semplice (`git show interfaccia-semplice:motore.js`).
  - Nel giudizio, la frase del pavimento diventa solo `Pavimento di X m²` (piccolo, medio o grande come adesso, con le soglie 1,5 e 4), senza persone.
  - `M2_PERSONA` non si mette.
  - In `configuratore/index.html` si mette `FORME_OFF` come nella semplice.
- [ ] **Passo 4: `index.html`.**
  - `costruisci` usa `opt.size`.
  - `dimIniziali` parte dalle misure di base.
  - Si tolgono `persone`, `M2P`, il blocco «Falla per» (HTML e gestore), la cella persone in `#dati`, la pill persone in `simulatore()`, «ci stanno…» in `fondo()` e le frasi sulle persone in `risolvi()`.
  - Risolvi sceglie con il costo che ha già, senza persone.
  - Nel glossario, «pavimento» diventa «La parte che appoggia a terra.»
  - La FAQ «Quante persone…» si toglie.
  - «Tempo e persone» nei Materiali resta: parla di chi lavora.
  - `nomeForma` legge i nomi nuovi.
- [ ] **Passo 5: rilanciare `node u1.js`.** Deve dare tutti `OK` ed `ERRORI 0`. Poi si guardano Progettazione e Costruzione nel browser, sia sul computer sia sul telefono.
- [ ] **Passo 6: scrivere `MODIFICHE.md`.** Un'intestazione che spiega la prova unita e la sezione «Blocco 1».
- [ ] **Passo 7: commit.**

  ```bash
  git -C /c/Users/ASUS/Desktop/bolla-d20-unita add index.html motore.js configuratore/index.html configuratore/MODIFICHE.md MODIFICHE.md docs
  git -C /c/Users/ASUS/Desktop/bolla-d20-unita commit -m "Prova unita, blocco 1: nomi geometrici, misure del motore, niente conto delle persone"
  ```

  Il messaggio finisce con la riga `Co-Authored-By`.

### Task 2: Blocco 2 · Misure: cursori con il motore e misure tipiche

**File:**
- Modifica: `index.html` (`costruisciMisure`, `aggiornaCursori`, `cambiaAsse`, `linguetta`).
- Crea: `T\u2.js`.

**Cosa usa e cosa produce:**
- **Usa** `costruisci`, `dimIniziali` e `buildShape` con `opt.size` (blocco 1).
- **Produce `SEMPLICI`:** copiato dalla semplice (`index.html` 1483–1505) e indicizzato per id della forma. Ogni voce è `{ xyz: [chiavi], perc: { chiave: [rif, etichetta] }, tecnici: [chiavi] }`.
- **Produce `percDi(id, key) -> [rif, etichetta] | null`.**
- **Produce `rendiTipiche()`:** sotto i cursori disegna le misure tipiche della forma.
  - Le misure in `perc` si scrivono in %. Il valore vero è `p[rif] * v / 100`, con `rif` misurato sulla forma di base.
  - Le misure in `xyz` non si mostrano: le danno i cursori.
- **Produce `#paramsTec`:** dentro «Altre opzioni» della linguetta Misure, con le misure in `tecnici` e quelle per cui `dettaglio(q)` è vero.

**I passi:**

- [ ] **Passo 1: scrivere `T\u2.js`.** Controlli:
  - `cursori`: con `d20` e «Mantieni le proporzioni», portare X a 5 porta anche Y e Z in proporzione; `cur.an.types.length` resta 2.
  - `libera`: senza il blocco, Z a 2 lascia X e Y come sono; le facce restano piane (`analyze` non dà errori) e cambiano Schema e vetrina. Il messaggio `bolle-officina` ha `dim.z` = 2.
  - `tipiche`: con `star` c'è «Raggio interno (% delle punte)»; portarlo da 50 a 30 cambia `cur.V`. Con `banana` c'è «Lunghezza del picciolo (% del corpo)».
  - `tecnici`: con `banana`, «Spicchi» o `N` stanno in `#paramsTec` e non sotto i cursori.
  - `pianta e immagine`: `pianta` e `foto` mostrano i controlli di prima (la griglia, «Ritocca l'ultima»).
  - `telefono`: a 390 px `scrollWidth <= 390`.
- [ ] **Passo 2: lanciare la prova.** Ci si aspetta `NO tipiche` e `NO tecnici`.
- [ ] **Passo 3: aggiungere `SEMPLICI`, `percDi`, `rendiTipiche`, `#paramsTec`.** Nelle figure regolari `cambiaAsse` resta quello dell'estetica: con il blocco cambia tutto, senza il blocco solo l'asse. Risolvi resta com'è.
- [ ] **Passo 4: rilanciare la prova e guardare nel browser.**
- [ ] **Passo 5: sezione «Blocco 2» in `MODIFICHE.md` e commit** `Prova unita, blocco 2: cursori X, Y, Z con il motore e misure tipiche della forma`.

### Task 3: Blocco 3 · Materiali del lab e lista con i prezzi

**File:**
- Modifica:
  - `index.html` (`rendiMateriali` e il foglio `#materiali`);
  - `configuratore/index.html` (blocco `if (VETRINA)`).
- Crea: `T\u3.js`.

**Cosa usa e cosa produce:**
- **Nell'Abbofficina, `mandaStato()`:** copiata dalla semplice. Manda `{ tipo:'stato', D, opz, righe, totale, mancano, kgTelo, teloLordo }`.
  - Il nome `manda` c'è già nel blocco VETRINA: si usa quello, senza definirne un secondo.
  - In vetrina si chiama dopo `mostra(M)` e dopo ogni messaggio `materiali` o `prezzo`.
  - Messaggi accettati, senza il campo `bolle:1`: `{ tipo:'vetrina-materiali', D }` e `{ tipo:'vetrina-prezzo', id, v }`, con lo stesso effetto della semplice (`D[k]`, `aggiornaSpessore`, `prezzi`, `salvaBudget`).
  - In vetrina `salvaBudget` salva: i prezzi sono di chi usa il computer, non della composizione.
- **Nella pagina, `PR.mat = { mat, gsm, giunti, adW, adLati, porte, coll }`.**
  - Partenza: `{ mat:'PVC', gsm:20, giunti:'adesivo', adW:48, adLati:2, porte:'cerniera', coll:'cerniera' }`.
  - Si salva con il progetto e si manda a ogni `vetrina-pronta` e a ogni cambio.
- **Nella pagina, `mostraMateriali(m)` e `mostraLista(m)`:** copiate dalla semplice e adattate agli id nuovi:
  - `#mTelo`, `#mGsm`, `#mGiunti`, `#mAdW`, `#mAdL`, `#mPorte`, `#mColl`;
  - `#listaRighe`, `#listaTot`, `#listaNota`.

  Si tolgono `cernieraImp` e `cernieraStagna` e la riga `energia`. Il totale si chiama «Totale materiali».
- **Il rotolo:** resta il campo dell'estetica (`bolle|rotolo`).

**I passi:**

- [ ] **Passo 1: scrivere `T\u3.js`.** Controlli:
  - `scelte`: il foglio Materiali ha le cinque scelte, e le chiusure sono solo «Zip» e «Velcro».
  - `vanno alla vetrina`: scegliere Velcro per le porte porta la vetrina ad avere `cfg.D.porte === 'velcro'`.
  - `lista`: dopo `scegli('d20')`, `#listaRighe` ha almeno 5 righe, nessuna «Energia»; `#listaTot` comincia con «Totale materiali».
  - `prezzo andata`: un prezzo scritto nella pagina sulla prima riga si ritrova nel `prezzi` della vetrina.
  - `prezzo ritorno`: un prezzo cambiato con `cfg` nella vetrina (`mandaStato`) si ritrova nella pagina.
  - `due bolle`: con due bolle il telo della lista è più grande che con una.
  - `senza simulatore`: con three.js bloccato, il foglio dei materiali si vede e `#listaNota` dice «La lista con i prezzi arriva dal simulatore».
  - `telefono`: la tabella scorre dentro `.tablewrap` e `scrollWidth <= 390`.
- [ ] **Passo 2: lanciare la prova.** Ci si aspetta tutti `NO`.
- [ ] **Passo 3: l'Abbofficina.** `mandaStato` e i due messaggi nel blocco VETRINA, con le righe in `configuratore/MODIFICHE.md`.
- [ ] **Passo 4: la pagina.** Le scelte sul foglio giallo, prima del resoconto, con lo stile del tema. Poi la tabella dei prezzi sotto il resoconto. Il resoconto usa `PR.mat`: il nastro si conta solo con `giunti === 'adesivo'`, e si usano «zip» o «velcro» nelle righe delle porte.
- [ ] **Passo 5: rilanciare `u3.js`, `u1.js`, `u2.js` e la suite dell'Abbofficina.** Poi si guarda nel browser.
- [ ] **Passo 6: `MODIFICHE.md` e commit** `Prova unita, blocco 3: materiali del lab e lista con i prezzi`.

### Task 4: Blocco 4 · Simulatore: vetrina + ↗ con l'Abbofficina completa

**File:**
- Modifica:
  - `index.html` (la finestra a destra, un pulsante `#simGrande` e un iframe `#simTutta`);
  - `configuratore/index.html` (modo `INCORPORATA`, dalla semplice).
- Crea: `T\u4.js`.

**Cosa usa e cosa produce:**
- **Nell'Abbofficina, dalla semplice:** `INCORPORATA`, il CSS di `body.piccola` e `body.incorporata`, `preparaPacco`, `legata`, `formaDallaPagina`, `cambiataQui`, il gestore dei messaggi con `bolle:1` e l'Esc che manda `esci`.
  - Il blocco `if (INCORPORATA)` usa una sua funzione `mandaP = m => parent.postMessage({ bolle:1, ...m }, '*')`, per non scontrarsi con `manda` della vetrina.
  - `stanzaDallaPagina` non si porta: la pagina non ha più «La stanza».
- **Nella pagina, `apriTutta(si: boolean)`:**
  - **Alla prima apertura** crea `#simTutta` con `src="configuratore/index.html?incorporata=1"`, in un riquadro fisso a tutto schermo (`.simTutta`, sopra la testata).
  - **Quando arriva `pronta`**, manda `{ bolle:1, tipo:'grande', si:true }`, poi `{ bolle:1, tipo:'materiali', D: PR.mat }` e `{ bolle:1, tipo:'forma', pacco }`.
    - Il pacco è `{ v:1, nome: nomeBolla(PR.att), tipo:'officina', d:{ mesh:{ v, f }, k:1, off:S.shape } }`, con le misure di `cur` al millimetro.
  - **Con `si:false`** nasconde il riquadro (l'iframe resta caricato) e ridà il fuoco a `#simGrande`.
- **Nella pagina, `daTutta(m)`:**
  - `misure` con `tipoB === 'officina'` e `d.k`: `S.dim = scalaDim(S.dim, d.k)`, poi `cambiato()`.
  - `stato`: `mostraMateriali` e `mostraLista`.
  - `esci`: `apriTutta(false)`.
- **Si apre e si chiude** con ↗ sopra la finestra, accanto a Simulatore e Schema. Si chiude con ↙ o con Esc.
- **Cambiando bolla** mentre è aperta: si manda il pacco della nuova bolla.

**I passi:**

- [ ] **Passo 1: scrivere `T\u4.js`.** Controlli:
  - `apre`: ↗ mostra `#simTutta` a tutto schermo. Dentro, `body` non ha `piccola` e la composizione «Officina · Bolla 1» ha una bolla `legato`.
  - `torna`: ↙ e Esc (dato all'iframe) chiudono e il fuoco torna su ↗.
  - `misura ritorno`: nell'iframe la bolla legata si ingrandisce di 1,2 con `cfg`; nella pagina `S.dim.x` cresce di 1,2 (±0,01) e la vetrina si aggiorna.
  - `↗ segue la bolla scelta`: con due bolle, si apre ↗ sulla Bolla 2 e se ne cambia la misura; cambia solo `PR.bolle[1].dim`.
  - `vetrina intatta`: dopo la chiusura, nella vetrina le bolle si trascinano ancora (`vetrina-posizioni` arriva) e le aree sono ancora lì.
  - `nessun salvataggio doppio`: la vetrina non scrive `bolle-comp`, solo l'incorporata.
- [ ] **Passo 2: lanciare la prova.** Ci si aspetta tutti `NO`.
- [ ] **Passo 3: l'Abbofficina.** Si portano le aggiunte della semplice, con `mandaP` e `if (!INCORPORATA && !VETRINA)` dove serve (scelte all'avvio). Si scrivono in `configuratore/MODIFICHE.md`.
- [ ] **Passo 4: la pagina.** `#simGrande`, `apriTutta`, `daTutta` e il gestore dei messaggi con `e.source === $('simTutta').contentWindow`.
- [ ] **Passo 5: rilanciare `u1.js`…`u4.js` e la suite.** Poi si guarda nel browser, sul computer e sul telefono (a 390 px ↗ apre comunque tutto lo schermo).
- [ ] **Passo 6: `MODIFICHE.md` e commit** `Prova unita, blocco 4: ↗ apre l'Abbofficina completa sulla bolla scelta`.

### Task 5: Blocco 5 · Dime più complete

**File:**
- Modifica: `index.html` (`dimaSVG`, `schedaDima`, `rendiDime`, `disegnaSchema` e il tocco nello Schema).
- Crea: `T\u5.js`.

**Cosa usa e cosa produce:**
- **Produce `PR.unita: 'bolla' | 'modellino'`:** è l'interruttore `#unitaDime`, con partenza `'bolla'`. In Modellino le misure sono `x * 100 / cur.stampa.scala` in cm, con una cifra decimale; in Bolla sono `cm()` come adesso.
- **Produce `dimaSVG(C, colore, stampa, unita)`:**
  - le scritte del disegno vanno da 13 a 19 px sullo schermo (in unità del pezzo, le dimensioni della semplice: altezze e AB 5,6, piedi 4,8, lettere 6), in grassetto, con il bordo scuro `paint-order: stroke`;
  - più spazio intorno al disegno.
- **Produce `schedaDima(t, i, perStampa)`:**
  - in pagina è un `<details class="dima" data-t="i">`;
  - chiusa (`summary`) mostra la sagoma piccola (`sagomaSvg` della semplice), `nomeDima(i)`, «× N» e le spunte fatte su quelle da fare;
  - per la stampa è sempre aperta.
- **Produce `apriTutteDime(si)`:** è il pulsante «Apri tutte / Chiudi tutte».
- **Produce «Azzera le spunte delle dime»:** separato dagli altri pulsanti, dice quante spunte ha tolto e ha «Annulla» per 6 s.
- **Produce `pzCard`:** copiato dalla semplice (`apriPezzo`, `svgPezzo`, `latiPezzo`, `.pzCard`) e attaccato al `pointerup` di `#cvSchema` senza trascinamento.
  - Un primo tocco su una faccia apre il riquadro con il nome della dima.
  - Un secondo tocco sulla stessa dima, o «Vai alla dima ›», porta alla tappa Dima e apre `details[data-t]`.
  - Per sapere quale faccia si tocca si usa la proiezione già usata da `disegna()`: si sceglie la faccia davanti più vicina che contiene il punto.

**I passi:**

- [ ] **Passo 1: scrivere `T\u5.js`.** Controlli:
  - `interruttore`: con `d20`, P2 dice «323,5 cm» in Bolla, e in Modellino `323.5 / scala` cm (un decimale).
  - `leggibili`: il `font-size` delle scritte del disegno, misurato sullo schermo, è almeno 13 px a 1440 px.
  - `schede`: all'inizio le schede sono chiuse; «Apri tutte» le apre; le spunte di una scheda restano dopo un ricaricamento.
  - `azzera`: «Azzera le spunte delle dime» toglie le spunte, e «Annulla» le rimette.
  - `tocco schema`: in Costruzione, un clic al centro di una faccia di `#cvSchema` apre `.pzCard` con «P»; il secondo clic porta alla tappa Dima con quella scheda aperta.
  - `stampa`: «Stampa le schede delle dime» mette in `#stampa` tutte le schede aperte.
  - `telefono`: a 390 px `scrollWidth <= 390`.
- [ ] **Passo 2: lanciare la prova.** Ci si aspetta `NO interruttore`, `NO schede`, `NO tocco schema`, `NO leggibili`.
- [ ] **Passo 3: fare le modifiche** dei «Cosa usa e cosa produce» qui sopra.
- [ ] **Passo 4: rilanciare `u1.js`…`u5.js`** e guardare nel browser.
- [ ] **Passo 5: `MODIFICHE.md` e commit** `Prova unita, blocco 5: dime con Bolla | Modellino, misure grandi, schede e tocco nello Schema`.

### Task 6: Blocco 6 · Cantiere e stampa del cartamodello

**File:**
- Modifica: `index.html` (HTML `#site`, CSS «modalità cantiere» dalla semplice).
- Crea: `T\u6.js`.

**Cosa usa e cosa produce:**
- **Usa** `fatte()` (le spunte: `dime`, `tagli`, `giunte`), `dimaSVG(..., unita)` (blocco 5) e `coppiaSVG` del montaggio.
- **Produce `apriCantiere(tipo: 'dime' | 'giunte')`** e `chiudiCantiere()`:
  - si apre da «Modalità cantiere» nella tappa Dima (dime) e nella tappa Costruzione (giunte);
  - mostra un passo alla volta: una dima con il suo disegno e «Fatta», oppure una giunzione con `coppiaSVG` e «Fatta»;
  - poi ‹ ›;
  - F segna «Fatto», le frecce vanno avanti e indietro, Esc esce;
  - il fuoco resta dentro (Tab gira tra i pulsanti);
  - le spunte sono quelle di `fatte()`, quindi la pagina le vede subito.
- **Produce `#bStampaNet`:** «Stampa il cartamodello» accanto a `#bStampaModello`. Stampa solo i fogli del modellino (`cur.stampa.pagine`) con `stampa(html)`. Se `#bStampaModello` fa già solo questo, si rinomina il pulsante e non si aggiunge niente.

**I passi:**

- [ ] **Passo 1: scrivere `T\u6.js`.** Controlli:
  - `apre dime`: «Modalità cantiere» nella tappa Dima mostra `#site` a tutto schermo con «P1».
  - `F`: il tasto F segna la dima P1 come fatta nella pagina.
  - `giunte`: in Costruzione il cantiere mostra «Giunzione 1 di 25» per `d20`; F + → porta alla 2; lo Schema mostra la 1 come fatta.
  - `esc`: Esc chiude e il fuoco torna sul pulsante.
  - `stampa`: `#bStampaNet` mette in `#stampa` solo i fogli `svg` del modellino, senza schede delle dime.
  - `telefono`: a 390 px il cantiere non scorre di lato.
- [ ] **Passo 2: lanciare la prova.** Ci si aspetta tutti `NO`.
- [ ] **Passo 3: fare le modifiche** dei «Cosa usa e cosa produce» qui sopra.
- [ ] **Passo 4: rilanciare `u1.js`…`u6.js`** e guardare nel browser.
- [ ] **Passo 5: `MODIFICHE.md` e commit** `Prova unita, blocco 6: modalità cantiere e stampa del cartamodello`.

### Task 7: Blocco 7 · Salva / Apri file e ricerca

**File:**
- Modifica: `index.html` (testata: lente; fondo della Progettazione: «Salva su file» e «Apri da file»).
- Crea: `T\u7.js`.

**Cosa usa e cosa produce:**
- **Produce `progettoFile() -> { v: 'unita-1', PR }`:** con `PR` copiato senza i campi calcolati.
  - Ci sono `bolle` (`shape`, `base`, `dim`, `lock`, `pos`, `areaId`, `fatte`, `t`), `aree`, `mat`, `unita` e `scenario`. Gli scenari da file restano fuori.
  - Il nome del file è `bolla-<nome della prima bolla>-AAAA-MM-GG.json`.
- **Produce `apriProgetto(json)`:**
  - **`v: 'unita-1'`:** sostituisce `PR` (passando da `sistemaBolla`), salva, va alla tappa della bolla scelta e manda tutto alla vetrina.
  - **File di una bolla sola della semplice** (`{ shape, params, opt }` come lo scrive `projFileSave`): diventa una bolla nuova. `base` è uguale a `params`; `dim` viene da `opt.size`, oppure da `dimIniziali`.
  - **File che non si legge:** avviso «Questo file non è un progetto delle bolle» e niente cambia.
- **Produce `cerca(q) -> [{ t, dove, vai }]` e la finestra `#cerca`** (`role="dialog"`, `#cercaIn` combobox, `#cercaLista`).
  - Si apre con la lente, Ctrl+K, ⌘K o «/» fuori dai campi.
  - L'indice è costruito come `INDICE` della semplice. Contiene:
    - le forme;
    - le tappe e le loro parti (Prendi le misure, Progetta, Forme, Misure, Materiali, Modellino, Dime, Montaggio, Si gonfia, FAQ);
    - i campi X, Y, Z e le misure tipiche;
    - le scelte dei materiali e il rotolo;
    - la lista dei prezzi;
    - P1…Pn;
    - «giunzione N»;
    - Risolvi;
    - cantiere;
    - stampa;
    - Salva e Apri.
  - `vai()` chiama `vai(t)`, apre la linguetta, la scheda o il `details`, scorre fino all'elemento e lo mette in evidenza per 1,5 s (`.trovato`).
  - Le voci che cancellano (eliminare una bolla, azzerare le spunte) si mostrano soltanto, non si premono.

**I passi:**

- [ ] **Passo 1: scrivere `T\u7.js`.** Controlli:
  - `salva e riapre`: si crea un progetto con due bolle (d20 e box), un'area X=10 e la spunta di P1. Si salva su file (lo scaricamento si intercetta con `page.on('response')` oppure leggendo il blob da `URL.createObjectURL`), poi si svuota `localStorage`, si ricarica e si apre il file: due bolle, area 10 e P1 spuntata.
  - `file della semplice`: aprire `{ shape:'d6', params:{s:2}, opt:{ size:{x:2,y:2,z:2} } }` aggiunge una bolla «Cubo» 2×2×2.
  - `file sbagliato`: `{ "ciao": 1 }` mostra l'avviso e lascia il progetto com'era.
  - `apri file sostituisce spunte`: con P1 spuntata sulla bolla d20, aprire un file con un'altra forma lascia la nuova bolla senza spunte.
  - `ricerca`: Ctrl+K apre `#cerca`. «P3» porta alla tappa Dima con P3 aperta. «rotolo» porta al campo del rotolo e lo evidenzia. «giunzione 12» porta alla Costruzione sulla giunzione 12. «elimina» mostra il pulsante senza eliminare (le bolle restano 2).
  - `telefono`: a 390 px `#cerca` sta nello schermo.
- [ ] **Passo 2: lanciare la prova.** Ci si aspetta tutti `NO`.
- [ ] **Passo 3: fare le modifiche** dei «Cosa usa e cosa produce» qui sopra.
- [ ] **Passo 4: rilanciare tutto.** `u1.js`…`u7.js` e la suite dell'Abbofficina. Poi il percorso completo nel browser (computer e telefono): Prendi le misure → Progetta → Materiali → Dima/Modellino → Costruzione fino all'ultima giunzione → Si gonfia, con due bolle in due aree.
- [ ] **Passo 5: chiudere.**
  - `MODIFICHE.md`.
  - `README.md` riscritto per la prova unita: tappe, finestra a destra con ↗, materiali e prezzi, dime, cantiere, file, ricerca.
  - Commit `Prova unita, blocco 7: salva e apri il progetto su file, ricerca`.

---

## Seconda parte (11 novembre, dopo la prova): più compatta, come la semplice

Le scelte dell'utente:
- struttura ibrida: restano le tappe, ma la Progettazione è compatta;
- lo Schema va nella pagina;
- dalla semplice si prendono la galleria compatta e «toccare una misura»;
- niente cursori: tre caselle e le frecce X, Y, Z nello Schema;
- Materiali e lista come nella semplice.

Si lavora come prima: per ogni blocco una prova `T\uN.js` che fallisce, la modifica, la prova che passa, il controllo nel browser, `MODIFICHE.md` e un commit.

### Task 8: Blocco A · Progettazione compatta
- «Prendi le misure» in poco spazio: titolo piccolo, le caselle X, Y, Z in una riga, la nota in una riga.
- Le linguette Forme | Misure spariscono: la galleria sta sopra e le misure sotto, sempre in vista. Scelta una forma, la pagina scende alle misure se non si vedono.
- La galleria compatta: 4 forme per cominciare (Icosaedro, Cubo, Sfera geodetica, Icosaedro troncato), poi «Altre forme (N)» che si apre (aperta da sola se la forma scelta è lì dentro), poi «Parti da un'immagine».
- Prova `u9.js`: niente linguette, galleria e misure in vista, le 4 forme fuori da «Altre forme», l'immagine dopo la galleria, «Prendi le misure» più basso di 300 px, telefono.

### Task 9: Blocco B · Riquadro «Misure bolla» con lo Schema
- Lo Schema (`#cvSchema`) esce dalla finestra di destra: nella Progettazione sta in cima al riquadro «Misure bolla», nella Costruzione accanto alla giunzione. A destra resta solo il simulatore, senza linguette.
- Nello Schema, le frecce X, Y, Z con le misure.
- Le schede Misure | Numeri | Altre opzioni:
  - Misure: le caselle Larghezza, Profondità, Altezza al posto dei cursori (figure regolari: una misura trascina le altre; le altre forme: ogni misura libera) e le misure tipiche in %;
  - Numeri: il verdetto con Risolvi, i numeri, i controlli;
  - Altre opzioni: le misure tecniche, la pianta, l'immagine.
- Sotto le schede, sempre in vista, il verdetto in breve.
- «Mantieni le proporzioni» non c'è più: per Risolvi la regola è quella della forma.
- Prova `u10.js`.

### Task 10: Blocco C · Toccare una misura
- Toccando una casella delle misure, nello Schema le facce che cambiano si colorano e la forma si muove piano tra la misura e la misura un po' cambiata; sotto c'è una riga che spiega la misura.
- «Annulla» sulle misure, anche con Ctrl+Z fuori dai campi.
- Prova `u11.js`.

### Task 11: Blocco D · Materiali e lista come nella semplice
- «Materiali bolla vera» e «Lista materiali e prezzi» diventano due riquadri che si aprono e si chiudono. Sono chiusi all'inizio e il browser ricorda se li avete aperti (`bolle|aperto|…`).
- Chiusi, mostrano una riga di riassunto: per i materiali telo, giunti e porte; per la lista il totale.
- La tabella dei prezzi è come quella della semplice.
- Si aprono da soli quando ci si arriva dalla ricerca.
- Prova `u12.js`.

---

## Terza parte (12 novembre): forma intera, scala, galleria, modellino, cantiere, simulatore

Le scelte dell'utente:
- la scala del modellino si scrive (all'inizio 1:20), e c'è anche «Trova la scala dal modellino»;
- il simulatore resta la vetrina, con più comandi.

| Blocco | Prova | Che cosa |
|---|---|---|
| Task 12 · E | `u14` | Forma intera: «Come appoggia a terra», «Taglia la parte bassa» e «Altezza del taglio» in Altre opzioni (`S.opt` per ogni bolla). |
| Task 13 · F | `u15` | Scala del modellino in Altre opzioni (1:20 all'inizio) e «Trova la scala dal modellino». |
| Task 14 · G | `u16` | Immagini della galleria piene, come nella semplice, in toni di rosso. |
| Task 15 · H | `u17` | Il cartamodello a schermo intero, un foglio alla volta. |
| Task 16 · I | `u18` | Cantiere: le scritte non si sovrappongono alla forma. |
| Task 17 · J | `u19` | Il simulatore più ricco: Costruisci/Prova, stato, materiali, Griglia, Oggetti 3D. |
