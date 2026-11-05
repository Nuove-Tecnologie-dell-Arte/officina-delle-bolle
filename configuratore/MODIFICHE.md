# Aggiunte al Configuratore Bolle

`index.html` è il file unico del Configuratore Bolle (`configuratore-bolle.html`, versione del 2 novembre 2026) con alcune aggiunte. Servono a due cose:
- farlo stare sullo stesso sito dell'Officina delle Bolle;
- fargli ricevere **tutte** le forme dell'Officina, montate così come sono.

Nel file sono tutte segnate `[Officina]`. Se arriva una versione nuova, basta rimetterle.

## Aspetto: lo stesso dell'Officina, chiaro o scuro come il computer
1. **Caratteri** (nel `<head>`): Bricolage Grotesque, IBM Plex Sans e IBM Plex Mono da Google Fonts, come nell'Officina.
2. **Blocco `[Officina] tema`** in fondo al `<style>`:
   - ridefinisce i colori del configuratore (`--bg`, `--card`, `--acc`…) con quelli dell'Officina, in versione chiara e scura (`prefers-color-scheme` e `data-theme`);
   - aggiunge `--acc-soft`, `--on-acc`, `--vetro` (pannelli sopra la scena), `--sez`, `--ombra` e i colori della scena 3D (`--s3d-a/b/c`, `--pav3d`);
   - assegna i caratteri;
   - sostituisce i colori scritti a mano: pulsanti attivi, pannelli trasparenti, righe selezionate.

   Gli schemi in sezione restano un foglio bianco anche col tema scuro.
3. **Intestazione**: al posto di `<div class="marchio">Bolle</div>` c'è il selettore `nav.app` "Officina | Configuratore", uguale a quello in cima all'Officina (vedi "Navigazione tra Officina e configuratore" più sotto).
4. **Script**, colori presi dal tema invece che scritti a mano:
   - `gaugeSVG` (manometri);
   - `disegnaGrafico` (grafico della pressione);
   - `sceltaPorte` (piantina delle porte).
5. **Scena 3D**:
   - `sfondo()` diventa `dipingiSfondo()`;
   - `temaScena()` colora cielo e pavimento con il tema e li ridipinge quando il computer passa da chiaro a scuro;
   - il verde dell'Officina (`0x2f9a74`) sostituisce il blu nelle cuciture selezionate e nell'anteprima di aggancio.

## Link e arrivo delle forme
1. **Funzione `daOfficina()`** (in fondo al primo script, prima di `window.cfg`), chiamata all'apertura:
   - legge `#officina=` dall'indirizzo, oppure `?officina=` per i link vecchi. Il dato è un JSON `{ "v": 1, "nome": "…", "tipo": "…", "d": { … } }` con le misure della bolla vera in metri;
   - porta le misure nei limiti di `TIPI`;
   - controlla la mesh, se c'è;
   - sceglie i gonfiatori con `gonfConsigliati`;
   - crea la composizione "Dall'Officina · nome" e mostra il giudizio;
   - toglie il dato dall'indirizzo.

## Nuovo tipo di pezzo `officina`: la forma vera
L'Officina manda un tipo del configuratore (cubo, prisma, piramide, stella, libera) solo se la forma ci entra senza ritocchi. Tutte le altre arrivano come tipo `officina`:
- `d = { mesh: { v: [[x, y, z]…], f: [[i, j, k…]…] }, k }`;
- la mesh è dell'Officina, in metri, con z in alto;
- `k` serve a ingrandirla.

Pezzi aggiunti:
- **`TIPI.officina` e `ICONE.officina`.** Non sta in `CAT`, quindi non compare in "Aggiungi".
- **`datiOfficina(mesh, k)`.** Si calcola una volta per ogni mesh e ingrandimento. Ricava:
  - la pianta a terra;
  - la mappa delle altezze, cioè il primo telo sopra ogni punto;
  - il centro, nel punto più lontano dalle zone basse (nella ciambella non è il buco);
  - volume, telo, cuciture;
  - l'ingombro visto dall'alto (`Vs`).
- **`fuoriOfficina()`** sposta porta, manica e gonfiatori lungo la normale del lato, finché toccano il telo.
- **`formaOfficina(d)`, chiamata all'inizio di `forma()`.** Restituisce gli stessi campi delle altre forme, più `mesh: true`. Per ogni lato aggiunge:
  - `hMax`, l'altezza libera appena dentro;
  - `fuori`, quanto sporge il telo.

  Le porte di partenza sono due, sui lati più lunghi e alti e lontani tra loro.
- **`gusciOfficina(F)`.** Il guscio 3D:
  - ogni pannello è diviso in triangoli;
  - si gonfia a cuscino (`st.gon`), si abbassa sgonfiandosi (`st.hk`) e fa pieghe quando è molle (`st.fl`);
  - i pannelli che guardano in su prendono il materiale del cielo stellato.

## Le forme dell'Officina nella griglia "Bolle"
Accanto a Stella, Cubo, Poligono, Cilindro e Piramide ci sono le 17 forme dell'Officina che il configuratore non aveva: Cupola, Dodecaedro, Forma a L, Forma a C, Freccia, Serpente, Ciambella, Tunnel, Barca, Banana, Scolopendra, Balena, Fungo, Razzo, Tartaruga, Ananas, Pera. Per ogni forma speciale `PORTE_OFF` dice dove si entra.
- **Motore.** `caricaMotoreOfficina()` legge `../index.html` (la pagina dell'Officina, stesso sito), prende il codice tra `// ENGINE START` e `// ENGINE END` e lo esegue. Non c'è codice copiato.
  - Se si cambiano o si tolgono quei due segnaposto nell'Officina, il configuratore non trova più le forme.
  - Aperto da solo, il configuratore mostra solo le bolle originali.
- **Tipi `of:<id>`.** Sono creati da `FORME_OFF`:
  - `par` sono i parametri numerici dell'Officina tradotti da `parOff()`;
  - `scelte` sono i parametri a scelta (posa, pinne…), mostrati con `sceltaRiga()` nel pannello Aggiungi e nella scheda Forma;
  - `f` sono i gonfiatori consigliati, calcolati la prima volta che servono.
- **`formaOff()`, chiamata da `forma()`.** Costruisce la mesh con `buildShape` dell'Officina, con le opzioni di partenza dell'Officina, e la passa a `formaOfficina()`.
  - La mesh resta in `d.mesh`, così le composizioni salvate si riaprono anche senza motore.
  - Con misure impossibili tiene la forma di prima e mostra il messaggio dell'Officina.
- **Altre aggiunte:** `ICONE['of:…']` (15 icone), `standard()` con le scelte, e una riga in `disegnaTipi()` e in `ispettore()` per le tendine.

## Porte realistiche (1,80 m)
- **Costanti.** `PORTA_MIN = 1.8` e `ALT_PORTA = 1.95`, cioè la porta più la cornice.
- **Altezze minime in `TIPI`.** `H` minima a 1,95 m per tutte le bolle e i corridoi. La piramide ha la porta al 55% dell'altezza, quindi minimo e partenza sono 3,3 m.
- **Maniche** alte almeno `PORTA_MIN` (in `collega()`).
- **Forme `of:…`.** `formaOff()` ingrandisce insieme tutte le misure in metri finché le porte arrivano a 1,95 m. `avvisaIngrandita()` lo dice e ridisegna i campi.
- **Forme mandate dall'Officina.** `daOfficina()` alza `d.k` (Ingrandisci) finché le porte arrivano a 1,95 m.

## Entrate nei punti giusti
- **`PORTE_OFF`** dice dove si entra in ogni forma speciale, presa dalle descrizioni dell'Officina:
  - la balena dalla bocca;
  - il fungo dal gambo;
  - il razzo tra le alette;
  - tartaruga, scolopendra e banana dai fianchi;
  - la barca dalla poppa;
  - tunnel e serpente dalle estremità.
- **`formaOfficina()`** sceglie i lati a terra più vicini a quelle direzioni. Il risultato si compone in `formaOfficinaFine()`.
- **Forme mandate dal pulsante dell'Officina.** L'Officina manda l'id della forma in `d.off`, così valgono le stesse regole.

## Interazioni nuove tra i Sonny
- **Gesti in `posaSonny()`:** `pugno`, `inchino`, `ballaCoppia`.
- **`COPPIE2`:**
  - pugno;
  - inchino, quando arriva qualcuno;
  - giro: ballo in coppia attorno al punto di mezzo, nella Festa;
  - guarda: uno indica un oggetto o un punto in alto e l'altro guarda e annuisce.
- **In `interazioni()`:** il saluto da lontano tra due Sonny liberi della stessa bolla, distanti più di 3,5 m.

## Menu che si tolgono
- **Linguette `#lingSx` e `#lingDx`** sui bordi della scena: chiudono e riaprono i pannelli laterali (`#vCostruisci.chiusoSx` / `.chiusoDx`, colonne fissate con `grid-column`).
- **`X_PAN()`** mette una × su Persone, Pressione (nell'intestazione del riquadro) e Vista.
- **Pulsante "Menu" (`#bMenu`, `#menuMenu`)** nell'intestazione: le spunte per ogni menu, più "Nascondi tutto" e "Mostra tutto".
- **Niente salvataggio.** I menu tolti tornano tutti a ogni caricamento della pagina. Le versioni di prima li ricordavano in `bolle-menu`, che ora si cancella all'avvio.
- **Scena.** `ridimensiona()` non sposta più la scena quando la Pressione è nascosta.

## Pulsante "Notte" nascosto
Il pulsante `#bNotte` della barra Vista ha `hidden`. La vista notte resta, e si accende da sola con "Guarda il soffitto da dentro" del soffitto stellato.

Funzioni originali ritoccate, una riga ciascuna, sempre con `[Officina]`:
- **`costruisciPezzo`**: il guscio al posto di pareti e soffitto, le stelle sul guscio, le linee delle cuciture vere. Non disegna le linee dello strappo.
- **`aggiornaPezzo`**: aggiorna guscio, stelle e linee; le cornici delle porte si spostano di `e.fuori`.
- **`puntoAnello`** e posizione dei gonfiatori: spostati di `e.fuori`.
- **`apertura`**: la porta è alta quanto `e.hMax − 0,15 m`.
- **`dentroB`**: le persone stanno solo dove sopra c'è abbastanza telo.
- **`raggioLibero`** usa `W2`.
- **`teloPezzo`** usa il telo vero (`F.sup`).
- **`sporgenza`** e **`scafo`** usano l'ingombro dall'alto `Vs`: i pezzi vicini non entrano nella pancia o nelle pinne.

Fisica, persone, materiali, budget, salvataggi e il resto dell'interfaccia sono quelli originali.

## Da segnalare all'altro gruppo
- Le prove in `test/` bloccano ogni richiesta a internet tranne Three.js, quindi anche i caratteri di Google Fonts, e lo segnano come errore in console ("Failed to load resource"). Basta rispondere vuoto a `fonts.googleapis.com` / `fonts.gstatic.com` nel gestore `pg.on('request', …)`: così tutte le prove passano.
- `test/povup.js` cerca `pg.$('canvas')`, che ora trova per prima l'anteprima nascosta di Forma da foto (`#ffCanvas`), e si ferma. Con `pg.$('#scena > canvas')` la prova passa.

## Stanza di sfondo (aggiunta da Alfredo nel repo, 2 novembre)
Non è una parte `[Officina]`: è una funzione nuova del configuratore, scritta direttamente qui. Se arriva una versione nuova del file unico, va tenuta anche questa.
- **Pulsante "Stanza"** nella barra Vista e pannello `#pannelloSt`.
- **Foto 360° equirettangolare** (JPG, PNG, WebP o HDR con `RGBELoader`, script aggiunto dopo `GLTFLoader`). Viene proiettata su una scatola dal punto di scatto con la stessa formula di Blender (`matEquirett`, coordinate Object + Equirectangular).
- **Modello GLB**: i materiali diventano `MeshBasicMaterial` con la loro texture.
- **Backface culling come in Blender**: le facce sono disegnate solo dal lato interno (`THREE.BackSide`), così le pareti rivolte verso la camera spariscono. La spunta "Pareti vicine trasparenti" passa a `DoubleSide`.
- **Stanze pronte** (`STANZE`): per ora il "Corridoio dell'Accademia", in `configuratore/stanze/` (`corridoio.jpg` 4096 × 2048 più la miniatura). Si caricano con `fetch`, quindi solo dal sito, non aprendo il file dal computer. È ricavato da `Corridoio.hdr` di Alfredo. Quell'HDR non ha valori sopra il bianco, quindi in JPG si vede uguale e pesa 0,9 MB invece di 54.
- **Corridoio ricostruito in 3D** (`ST.pianta`, `geoPianta`): il corridoio non è più una scatola. Dalla foto ho letto il bordo tra pavimento e pareti (la base dello zoccolo di marmo) a ogni angolo e ne ho ricavato la pianta vera: l'angolo del chiostro, con la parete della porta verde, quella della porta aperta, il pilastro d'angolo con le finestre e i due bracci lunghi circa 30 m. Le misure sono in multipli dell'altezza della fotocamera (stimata 0,90 m): cambiandola si ingrandisce tutta la stanza in proporzione. La foto è proiettata dal punto di scatto su pavimento, pareti e soffitto (piatto, 8 m), quindi anche spostandosi lontano dal punto di scatto lo zoccolo resta sull'attacco a terra e i corridoi hanno profondità. Le facce sono rivolte verso l'esterno, così con `BackSide` le pareti verso la camera spariscono come prima. Se si carica a mano un file che si chiama "corridoio" (anche l'HDR) usa la stessa pianta; le altre foto restano su una stanza a scatola.
- Gli HDR caricati a mano: se non superano il bianco diventano una texture a 8 bit (veloce e uguale a vedersi), altrimenti restano in mezzi float con il tone mapping.
- Il pavimento grigio ha un `polygonOffset` per non litigare con il pavimento della stanza. Un piano `ShadowMaterial` riceve le ombre di bolle e persone.
- La stanza resta salvata nel browser con IndexedDB (database `bolle-stanza`) e si ricarica all'apertura. Non entra nel JSON delle composizioni.
- Codice nel blocco `STANZA DI SFONDO`, prima di `window.cfg`. API: `cfg.ST`, `cfg.caricaStanza(file)`, `cfg.togliStanza()`, `cfg.aggiornaStanza()`.

## Sezione Oggetti tolta (2 novembre)

- Tolti il pulsante "Oggetti" della barra Vista, il suo pannello (`#pannelloO`) e tutto il secondo `<script>` che lo faceva funzionare: import di PLY, OBJ, STL e GLB, splat, la scena Municipalità_4 incorporata, ancoraggi e maniglie per spostare, ruotare e scalare. Il file passa da 3,8 a 2,3 MB.
- Non si caricano più `TransformControls`, `PLYLoader`, `OBJLoader` e `STLLoader`. Restano `GLTFLoader` e `RGBELoader`, che servono alla stanza di sfondo.
- Le situazioni degli avatar leggono gli oggetti da `window.oggetti`, che ora non c'è: "Attorno agli oggetti" non capita più, il resto funziona come prima.

## Navigazione tra Officina e configuratore (2 novembre)

- **Selettore in alto, uguale nelle due pagine** (`nav.app`): "Officina | Configuratore", con la parte in cui si è evidenziata. Nell'Officina sta nella barra dei passi, a destra; nel configuratore al posto del vecchio link "← Officina delle Bolle". Sugli schermi stretti si vede solo il pulsante per andare nell'altra parte.
- **Stessa scheda**: "Porta la forma nel configuratore" (prima "Apri nel configuratore") non apre più una scheda nuova ogni volta.
- **Niente si perde passando da una parte all'altra**:
  - l'Officina ricorda l'ultima forma, con misure, opzioni, scala e nome, in `localStorage` (`bolle|forma`), e la riprende quando si torna;
  - il configuratore riapre la composizione su cui si stava lavorando invece di partire da un cubo nuovo (il cubo d'esempio resta per chi non ha ancora composizioni), e salva l'ultima modifica anche uscendo dalla pagina (`pagehide`).
- **Ritorno alla forma giusta**: la forma mandata dall'Officina porta con sé le sue impostazioni (`src` nel `#officina=`), che il configuratore salva nella composizione (`officina`). Da quella composizione, "Officina" riapre l'Officina su quella forma, al passo Numeri (`../#apri={…}`).
- **Niente doppioni**: rimandando la stessa forma dopo un ritocco, il configuratore aggiorna la sua composizione "Dall'Officina · nome" invece di crearne un'altra, finché ha un pezzo solo. Se nel frattempo ci si sono aggiunte altre bolle, ne crea una nuova con "(2)", "(3)"…


## Correzioni dopo la prova generale (3 novembre)

- **Porte con le zip** (`[Officina]` in `D`): le porte partono come `porte: 'cerniera'`, perché nel lab finora sono fatte con le zip. Distinta e budget contano già cerniere e cursori. Collegamenti e giunture restano magnetici, in attesa di sapere come li fa il lab.
- **L'ingrandimento torna nell'Officina** (`[Officina]` in `daOfficina`): se la forma arrivata come pezzo vero in 3D è stata ingrandita per avere porte da 1,80 m (`d.k > 1`), il pacchetto `src` salvato nella composizione porta anche `ingrandita: k`; se invece sono state solo portate nei limiti alcune misure, porta `ritocchi` (al massimo 6 righe). Tornando con "Officina", l'Officina mostra un avviso che si chiude con la ×.
- **Aggiungere alla composizione aperta** (`[Officina]`, blocco `if (M.aggiungi)` in `daOfficina`): se il pacchetto `#officina=` ha `aggiungi: true` (pulsante "Aggiungi alla composizione aperta" dell'Officina), la forma non crea né aggiorna "Dall'Officina · nome", ma va nella composizione con dei pezzi modificata più di recente. Il pezzo viene messo a destra degli altri senza toccarli (`siToccano`), selezionato e salvato; l'avviso dice dove è finito. Se non c'è nessuna composizione con dei pezzi si comporta come prima.

## Seconda prova generale (3 novembre)

- **Altezza delle porte sul telo vero** (`[Officina]`, `altSopra` e `altezzaPorta`, usate in `formaOfficina`): l'altezza di una porta delle forme dell'Officina non si legge più dalla griglia delle altezze, ma dai triangoli del telo. È il primo telo 30 cm dentro la porta, e sopra la soglia (a 5 e 15 cm) non ci deve essere un soffitto quasi piano più basso. Così la barca non ha più una porta "da 2 m" su uno scafo di 1,6 m: il ponte sopra la poppa conta. **L'Officina fa lo stesso calcolo** (`porteOfficina` in `../index.html`, con una copia di `PORTE_OFF`): se si cambia uno, va cambiato anche l'altro.
- **Forme dell'Officina nelle composizioni salvate** (`[Officina]` in `carica`): la griglia "Bolle" si riempie solo quando il motore dell'Officina è letto, e prima le composizioni con quelle forme si riaprivano vuote. Ora, se il tipo `of:…` non c'è ancora ma il pezzo ha la sua mesh salvata, si crea un tipo provvisorio e il pezzo si riapre come forma fissa; arrivato il motore, torna con le sue misure. Vale anche per le forme tolte dall'Officina.
- **Uva tolta del tutto**: niente più icona `of:uva` né regola delle porte.
- **Stanza di sfondo come ostacolo** (`[Officina]`, `pareteStanza`, `nelMuro`, `postoLibero`, `mettiSeparato`, `avvisoStanza`): con una foto 360° (stanza a scatola o pianta ricostruita come il Corridoio) le pareti contano:
  - i "+" per attaccare un pezzo non compaiono dove finirebbe in una parete, e l'aggancio automatico non lo porta lì;
  - trascinando, una bolla si ferma contro la parete (se ci sta già dentro, si può spostare per tirarla fuori);
  - "Aggiungi separato", la forma da foto e "Aggiungi alla composizione aperta" mettono il pezzo nel primo posto libero dentro la stanza;
  - le bolle nelle pareti o più alte del soffitto diventano rosse come quelle sovrapposte, con un avviso;
  - cambiando misure o posizione della stanza, o togliendola, si ricontrolla tutto.
  Il modello GLB non ha pareti note: lì niente controlli. `pareteStanza` è dentro un `try`, perché all'avvio `ST` non è ancora dichiarata.

## Nuovo nome: Abbofficina (3 novembre)

- Il configuratore si chiama **Abbofficina** in tutto quello che si vede: titolo della scheda, selettore in alto ("Officina | Abbofficina"), avvisi. Nell'Officina cambiano allo stesso modo il selettore, il link in cima, il riquadro e i pulsanti del Passo 2 e gli avvisi.
- La cartella resta `configuratore/` e il codice (nomi delle funzioni, `#officina=`, commenti) non cambia, così i link già condivisi e le prove dell'altro gruppo funzionano come prima. Se arriva una loro versione nuova del file, vanno rimessi anche questi nomi.
- **Tendine leggibili nel tema scuro** (`[Officina]`, regola `select option` dopo i temi): le tendine con lo sfondo trasparente, come "Visuale libera / Occhi di Sonny", aprivano un elenco bianco con il testo chiaro. Ora le voci hanno lo sfondo e il colore del tema.

## Interfaccia sistemata (3 novembre)

Stesso aspetto e stessa disposizione, con meno disordine (`[Officina]`, blocco CSS prima di "menu che si tolgono"):
- **Intestazione nella finestra.** Prima, a 1280 px era larga 1460 e tutta la pagina scorreva di lato. Ora:
  - i pulsanti non vanno più a capo ("Forma da Foto" stava su due righe);
  - sotto i 1560 px "Forma da Foto" e "Menu" restano con la sola icona (il nome resta per i lettori di schermo, nella classe `.etH`), l'etichetta "Velocità" sparisce e gli spazi si stringono;
  - sotto i 1080 px scorre di lato solo l'intestazione, non la pagina.
- **Tendine dell'intestazione** (Composizioni, Simulazione, Menu): sotto i 1080 px si aprono fisse sotto l'intestazione, così non vengono tagliate, e il loro testo va a capo.
- **"Aggiungi separato"** su due righe volute: il nome in grassetto e sotto, più piccolo, "nuovo sistema".
- **Titoletti delle sezioni** (`h2`, `.gEt`, `.pannelloP h3`) a 11 px invece di 10,5, per leggerli meglio.

## Quattro categorie al posto di sei schede (3 novembre)

Le stesse cose stavano in più posti; ora ognuna sta in un posto solo (`[Officina]` nel markup, in `mostra`, nel CSS prima di "menu che si tolgono"):
- **Schede: Costruisci · Aria · Materiali · Dati.**
  - **Aria** è la vecchia scheda Pressione (stesso id `tabP` / `vPressione`), con dentro i manometri della vecchia scheda Manometri. Il riquadro di stato doppio dei manometri (`dotGlobM`, `txtGlobM`) non c'è più.
  - **Dati** ha in fondo gli schemi della vecchia scheda Schemi (porta, cornice, giunto), con il titolo "Schemi delle chiusure". `aggiornaSchemi` e `aggiornaManometri` ora controllano `vDati` e `vPressione`.
  - Le schede `tabM` e `tabS` e le sezioni `vManometri` e `vSchemi` sono tolte.
- **Simulazione** (era "Prove", `#bProve` / `#menuProve`): la velocità ×1 ×5 ×20 (prima a parte nell'intestazione), "Gonfiatori in automatico" (`#bAuto`, prima in Pressione → Azioni), "Sgonfia e rigonfia", "Blackout" ed "Esplodi". Sul pulsante si legge la velocità (`#velB`, colorata se più di ×1); cambiando velocità il menu resta aperto. I doppioni `bBlack2` e `bRigonfia2` sono tolti.
- **Gonfiatori di una bolla: solo nel pannello del pezzo** (`iGonf`). Nella tabella di Aria la colonna Gonfiatori mostra i numeri senza −/+. La sottoscheda "Gonfiatori" del pannello Aggiungi è tolta: ripeteva i modelli (in Dati), la bolla selezionata (nel pannello del pezzo), il prossimo pezzo (nella scheda Bolle) e il totale (in Aria). La funzione `disegnaGonfiatori` resta, ma non si vede più.
- **Una barra sola sulla scena:** "Tutto in ordine" (`#chipStato`, apre Aria) e "Materiali" (`#chipBudget`, apre Materiali) stanno nella barra delle persone. Il titolo "Pressione ›" del riquadro della pressione apre Aria.
- **Prove automatiche:** `test/ui.js` cliccava `[data-cat="gonf"]`, che non c'è più: quel clic va tolto.

## Situazioni da sole (3 novembre)

- **Niente più pulsante "Situazioni"** nella barra delle persone. Il pannello `#pannelloS` resta nel codice, ma non si apre più.
- **Niente residenti da soli** (`[Officina]`, `residentiVoluti`, usata da `syncResidenti`): le bolle nuove sono vuote. All'inizio (3 novembre) ogni bolla si riempiva da sola, come con "Popola tutte le bolle", ma non deve succedere (5 novembre). Le situazioni capitano con i visitatori di Play che si fermano in una bolla. Solo un `p.nRes` maggiore di 0, scritto dalle prove automatiche, mette dei residenti, lasciando almeno 6 posti liberi per i visitatori (massimo 24 avatar).
- **Situazioni a caso** (`situazioneDi`): la prima si sceglie a caso fra quelle possibili, e ogni 35–55 secondi ne arriva un'altra, mai la stessa due volte di fila. Prima andavano sempre nello stesso ordine.
- **Composizioni salvate:** riaprendole, situazione e residenti tornano automatici.
- **Prove automatiche:** `test/sit.js` e `test/multi.js` cliccavano `#bSit` e `#sPopola`. Al loro posto va messo `p.nRes` a mano su ogni pezzo, poi `cfg.syncResidenti()`.

## Una stanza per composizione (4 novembre)

Prima la stanza di sfondo era una sola, salvata nel browser e uguale per tutte le composizioni. Ora (`[Officina]`):
- **Aprendo una composizione si parte sempre senza stanza.** Se quella composizione era stata lasciata con una stanza, la stanza torna, con le sue misure, la posizione e la luce (`applicaStanza`, chiamata alla fine di `carica`).
- **Dove sta:**
  - le misure stanno nella composizione (`dati.stanza`, scritto da `fotografa` con `statoStanza`);
  - il file (foto 360° o GLB) sta in IndexedDB, una voce per composizione: `stanza:` + id;
  - le stanze pronte (il Corridoio) non salvano il file, perché si riprendono da `stanze/`.
- **Nuova** e le composizioni nuove dall'Officina partono senza stanza.
- **Duplica** tiene la stanza: il file si copia dalla composizione originale (`da`) la prima volta che si apre la copia. Rimandando la stessa forma dall'Officina, "Dall'Officina · …" tiene la sua stanza.
- **Elimina** cancella anche il file della stanza di quella composizione.
- **Importa:** una stanza pronta torna. Per una foto o un modello caricati da un altro browser compare un avviso: il file non viaggia con l'export, e va rimesso da «Stanza».
- **Cambi a metà:** se si cambia composizione mentre una stanza si sta caricando, quella stanza non arriva più (`genStanza`).
- **Pareti ricontrollate solo se serve:** aprendo una composizione, le pareti si ricontrollano contro le bolle solo se prima c'era una stanza. Una stanza nuova lo fa da sé quando arriva.
- **Stanza vecchia:** la voce unica `stanza` delle versioni di prima si cancella all'avvio.

## Interfaccia più semplice (5 novembre)

Per chi la apre la prima volta (oggi il lab, poi tutti gli studenti dell'Accademia). Tutto è segnato `[Officina]`, con il CSS in fondo allo `<style>`:
- **Modalità Costruisci / Prova** (`#modoScena`, `impostaModo`, classe `costr` su `#vCostruisci`).
  - Si parte da **Costruisci**: forme, pannello, «+», lo stato ("Tutto in ordine", "Materiali") e la barra Vista con la **Stanza**, che serve per costruire il percorso dentro lo spazio vero.
  - **Prova** aggiunge la barra delle persone (Play, Situazioni, Visuale), il riquadro Pressione e il menu **Simulazione** nell'intestazione.
  - Nelle altre schede (Aria, Materiali, Dati) Simulazione si vede sempre (`body.costrAttiva`).
- **Un pannello solo, a sinistra.** Senza niente selezionato è "Aggiungi". Toccando un pezzo diventa la sua scheda: `#ispettore` (aside.dx) prende la colonna 1 e aside.sx si nasconde, con la classe `conSel` messa da `ispettore()`.
  - In cima c'è «Aggiungi un altro pezzo» (`#iIndietro`); anche Esc torna indietro.
  - La colonna di destra e la sua linguetta non ci sono più; nel menu "Menu" resta solo "Pannello a sinistra".
- **Forme:** si parte dal **Cubo**, non più dalla Stella (`tipoScelto`, `dimNuovo`, `ultimoTipo`). `disegnaGriglia` mostra prima `PRIME_FORME` (Cubo, Cupola, Cilindro, Piramide, Tunnel, Forma a L), poi il pulsante «Altre forme (n)». Questo apre `GRUPPI_FORME`: Solidi, In pianta, Tubi e gallerie, e Forme speciali per tutto il resto. Se la forma scelta è fra le altre, il gruppo resta aperto.
- **Parole:**
  - "Pa adesso" → "pressione adesso (Pa)";
  - "a regime" → "quando è stabile" (pannello del pezzo, Aggiungi, colonna "Stabile" in Aria), con la spiegazione al passaggio del mouse;
  - "La manica" → "Il collegamento (una manica di telo)";
  - spiegazione di "Sistema" sulla riga in cima al pezzo.
- **Guida:** "Come si usa" non si apre più da sola. Finché non si attacca il primo pezzo, in Costruisci c'è un suggerimento nella scena (`#suggScena`: «Scegli una forma… Tocca un +…»). Sparisce al primo pezzo o con la ×, e si ricorda in `bolle-primo-pezzo`. Il testo di "Guida" parla delle modalità e del pannello unico.
- **Prove automatiche:** Play (`#bGiro`) e Simulazione (`#bProve`) si vedono solo in Prova: prima di cliccarli va cliccato `[data-modo="prova"]`. Con un pezzo selezionato il pannello Aggiungi è nascosto, quindi `[data-cat="corridoi"]` e `#attP` vanno cliccati via JavaScript (`element.click()`). La stella ora sta in «Altre forme».

## Annulla / Ripeti e pannello Aggiungi più corto (5 novembre)

- **Annulla e Ripeti** (`[Officina]`, `storia`, `registraStoria`, `passoStoria`, `annulla`, `ripeti`).
  - Sopra la scena, accanto a Costruisci / Prova, ci sono «Annulla» e la freccia di Ripeti. Da tastiera: Ctrl+Z, e Ctrl+Y o Ctrl+Maiusc+Z (dentro i campi di testo resta l'annulla del browser).
  - **Come funziona:** ogni modifica che arriva a `salvaPresto` lascia nella storia l'istantanea di prima, cioè `fotografa()` senza la stanza, che ha il suo pannello. Ne tiene al massimo 30.
  - Annullare ricarica l'istantanea con `carica(dati, { storia: true, sel })`: niente stanza, l'inquadratura resta, e il pezzo che era selezionato torna selezionato.
  - Ogni composizione ha la sua storia: aprendone un'altra si riparte da zero.
- **Elimina** mostra l'avviso «Cubo 3 eliminato.» con il pulsante «Annulla» (`avviso(t, ms, [etichetta, funzione])`).
- **Pannello Aggiungi più corto:** porte (con il verso ↺ ↻) e gonfiatori stanno in «Più opzioni» (`#piuOpz`, un `<details>` chiuso), perché i valori di partenza vanno già bene. Restano visibili forma, misure e i numeri della bolla.

