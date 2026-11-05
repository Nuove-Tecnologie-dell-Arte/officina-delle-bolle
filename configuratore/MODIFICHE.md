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


## Un pannello solo e una barra sola (5 novembre)

Interfaccia semplificata (opzione C): la scena è più grande e ogni cosa sta in un posto solo (`[Officina]` nel markup, nel CSS dopo "Interfaccia sistemata" e nello script).
- **Un pannello solo, a destra.** I due pannelli laterali stanno nella stessa colonna (`grid-column: 2`) e se ne vede uno alla volta:
  - senza nessuna bolla scelta si vede **Aggiungi** (`aside.sx`);
  - toccando una bolla si vede **la bolla** (`aside.dx`). `ispettore()` mette o toglie la classe `conPezzo` su `#vCostruisci`;
  - in cima al pannello della bolla c'è **"← Aggiungi"** (`#iIndietro`), che toglie la scelta; lo fa anche un tocco nel vuoto della scena, come prima;
  - mentre una bolla è scelta i "+" nella scena non si vedono (`#vCostruisci.conPezzo #sovra .piu`).
  - Sotto i 980 px il pannello va sotto la scena (`order: 2`).
- **Una linguetta sola** (`#lingDx`), che chiude e riapre il pannello (`MENU.pan`, classe `chiusoPan`). La linguetta di sinistra (`#lingSx`) è tolta.
- **Una barra sola, in basso sulla scena** (`.sinistra`, ora con `bottom: 12px`): Play, persone, stato, materiali e il nuovo **menu Vista** (`#bVista`, `#menuVista`, si apre verso l'alto). Nel menu Vista:
  - la visuale (occhi di Sonny, `#selPov`, spostato qui dalla barra);
  - **Riquadro della pressione** (`#vPress`, `MENU.press`): il riquadro in alto a destra ora parte spento e si accende da qui; la sua × lo rispegne;
  - **Stanza di sfondo…** (`#bStanza`, prima nella barra Vista);
  - la legenda dei gonfiatori.

  La barra Vista (`#barraScena`) e le × delle barre (`X_PAN('persone')`, `X_PAN('vista')`) sono tolte. Il pulsante `#bNotte`, già nascosto, resta nella scena.
- **Niente pulsante "Menu"** nell'intestazione (`#bMenu`, `#menuMenu`, `mNascondi`, `mMostra` tolti): con un pannello solo non serve più nascondere i menu uno per uno.
- **"Simulazione" si chiama "Prove"** (`#bProve`). Anche la guida e la nota in fondo ad Aria lo dicono.
- **Gonfiatori della bolla nuova scelti dalla pagina** (`gonfNuovoAuto`, `testoGonf`): nel pannello Aggiungi non ci sono più i −/+, ma una riga che dice quali gonfiatori ha scelto `gonfConsigliati` (i meno potenti che la tengono su; il risultato resta in `cacheGonf` per forma e misure). Si cambiano dopo, nel pannello della bolla. Se nessuna combinazione basta, restano quelli di `TIPI` e la riga lo dice.
- **"Fai scoppiare" tolto dal pannello della bolla**: lo scoppio si prova da Prove → Esplodi. Nel pannello, se la bolla è scoppiata, resta "Ripara lo strappo" (`#iScoppia`).
- **"Aggiungi separato · nuovo sistema"** si chiama **"Aggiungi da sola · staccata dalle altre"** (`#bSeparato`, stessa funzione).
- **Guida** riscritta per il pannello a destra, la barra in basso e il menu Vista.
- La visuale "Occhi di Sonny" (`#povInfo`) ora sta in alto, per non coprire la barra.
- **Prove automatiche:** chi cliccava `#bMenu`, `#lingSx`, `[data-m]` o `#barraScena` deve usare `#lingDx`, `#bVista` e `#vPress`. Per vedere il pannello Aggiungi non deve esserci nessuna bolla scelta (`cfg` → `selezionato = null`, oppure `#iIndietro`).

## Pannello, forme, Aria e Dati più semplici (5 novembre)

Quattro ritocchi dopo "Un pannello solo" (`[Officina]` nel markup, nel CSS prima di "gruppi di forme" e nello script).
- **Pannello della bolla con tre schede: Stato · Forma · Collega.**
  - La quarta scheda, Aspetto, ora è in fondo a Forma, chiusa: `details.aspetto`, con Colore e Soffitto stellato. Resta aperta o chiusa passando da una bolla all'altra (`ispAspetto`). Se qualcosa chiede `tabIsp = 'aspetto'`, si apre Forma.
  - La riga in cima dice "Gruppo A · 3 collegati insieme" oppure "Senza collegamenti", più "è l'ingresso". Prima diceva "Sistema A · 1 modulo da solo · ingresso".
  - **"Sistema" diventa "Gruppo"** dappertutto: `nomeSistema()` (anche nelle porte di Aria e nel riquadro della pressione), "Ruota tutto il gruppo", "2 bolle in 2 gruppi". Nel codice le variabili restano `sistemi` e `p.sistema`.
- **Forme in gruppi apribili** nel pannello Aggiungi, scheda Bolle (`GRUPPI_FORME`, `gruppiAperti`, in `disegnaTipi`):
  - **Semplici**: le 5 del configuratore;
  - **Dall'Officina**: cupola, dodecaedro, L, C, freccia, serpente, ciambella, tunnel;
  - **Figure e frutti**: le altre forme dell'Officina.

  All'inizio è aperto solo Semplici. Il gruppo della forma scelta si apre da solo, e i gruppi restano come li si lascia. Se c'è un gruppo solo (configuratore aperto senza l'Officina) e nei Corridoi, la griglia è quella di prima (`#tipi` senza la classe `aGruppi`).
- **Aria più leggibile:**
  - **Una scheda per bolla** (`costruisciManometri`). Contiene il manometro, la pressione di adesso, "a regime", "si gonfia in" e cosa fare ("Va bene", il consiglio di `valuta()`, o "Scoppiata"). Il limite delle cuciture è nel `title` della scheda. Il titolo della sezione ora è "Bolle".
  - **La tabella completa sta sotto "Dettagli"**, chiusa (`details.dettagliBolle`). La sua colonna "Stanza" ora si chiama "Bolla".
  - **Il nastro magnetico non è più nei riquadri in cima** (`#kNastro` tolto: resta in Materiali). "moduli" diventa "bolle".
- **Dati: il materiale del lab in alto, i numeri chiusi sotto.**
  - In alto, "Il materiale del lab", con tre schede:
    - Telo: la tendina del materiale e un riassunto (`#riassTelo`);
    - Chiusure: porte, cornici e giunti, più il riassunto del nastro (`#riassNastro`);
    - Gonfiatori del lab, in sola lettura (`#riassGonf`).

    I riassunti si aggiornano in `riassuntoLab()`, chiamata da `tabellaChiusure()`.
  - **"Avanzate"**, chiusa: tutti i cursori di prima (gonfiatori, telo, nastro, tabella delle chiusure e "Maniche e aria", che prima si chiamava "Altro"). Contiene anche il pulsante **"Rimetti i valori del lab"** (`#bValoriLab`), che rimette `D` e i dati dei gonfiatori ai valori scritti nel codice (`D_LAB`, `GONF_LAB`, presi all'avvio) dopo una conferma.
  - **"Schemi delle chiusure"**, chiusa: gli schemi di prima, con gli stessi id.
  - Sul telefono le schede vanno a capo, la tabella delle chiusure scorre dentro la sua scheda e gli schemi stanno uno sotto l'altro.
- **Prove automatiche:**
  - la tabella di Aria è dentro `details.dettagliBolle`: per vederla va aperta;
  - `#kNastro` non c'è più;
  - nel pannello della bolla non c'è più `[data-sc="aspetto"]`: colore e stelle sono in `details.aspetto`, dentro la scheda Forma;
  - i bottoni delle forme sono sempre `#tipi button[data-t]`, ma quelli dei gruppi chiusi non si vedono.

## Più leggera e più veloce, e la barra di ricerca (5 novembre)

Tutte le parti sono segnate `[Officina]`. Le misure sono fatte prima e dopo, nelle stesse condizioni.
- **Sonny compresso senza perdite** (`const SONNY`, `inflaRaw`, `sbloccaSonny`, in `costruisciSonny`):
  - posizioni, uv, normali, ossa e triangoli sono compressi con deflate. Per posizioni, uv e indici i numeri a 16 bit sono salvati come differenze dal precedente, con i byte bassi separati da quelli alti;
  - il campo `zip` dice, per ogni dato, quanti byte ha e se va ricostruito;
  - `inflaRaw` è un lettore deflate in JavaScript, sincrono perché Sonny serve subito all'avvio;
  - provato byte per byte: i dati decompressi sono identici a quelli di prima;
  - il file passa da 2,32 a 1,79 MB (da 1,31 a 1,17 MB scaricati con gzip). L'avvio costa circa 30 ms in più per decomprimere;
  - se si cambia Sonny, va ricompresso: senza il campo `zip`, `costruisciSonny` legge anche i dati non compressi di prima.
- **GLTFLoader e RGBELoader solo quando servono** (`LETTORI`, `lettore()`): non sono più nei `<script>` in fondo alla pagina (109 KB a ogni apertura). Si scaricano quando si apre il pannello Stanza, o quando si carica un GLB o un HDR. Il Corridoio, che è un JPG, non ne ha bisogno.
- **`stimaRegime` e `stimaSingola` si fermano a regime** (`regimeRaggiunto`):
  - smettono di simulare quando, per 10 s simulati, nessuna bolla cambia il suo volume d'aria di più di un miliardesimo;
  - la parte del blackout si ferma anche quando tutte le bolle hanno il loro tempo `tB`;
  - confrontati con la versione di prima su 4 composizioni da 8 bolle e su 20 bolle singole, `tF` e `tB` sono identici e la pressione differisce al massimo di 0,0000003 Pa;
  - `strutturaCambiata` (a ogni ritocco) con 8 bolle passa da circa 146 a 63–91 ms; `stimaSingola` (anteprima e gonfiatori scelti da soli) da 59 a 16 ms per 20 bolle.
- **Barra di ricerca** (`#bCerca`, `#cerca`, `vociCerca`, `filtraCerca`, `apriCerca`; CSS "barra di ricerca"):
  - si apre con il pulsante "Cerca" in alto, con ⌘K / Ctrl+K, oppure con / quando non si sta scrivendo in un campo;
  - si sceglie con le frecce e Invio, si chiude con Esc o con un clic fuori;
  - trova le schede, le forme da aggiungere, le bolle della composizione, le schede della bolla scelta, le prove, persone e vista, le composizioni salvate, e le sezioni di Aria, Materiali e Dati;
  - ogni voce usa i pulsanti e le funzioni che ci sono già (per esempio `$('bBlack').click()`, `sceltaCat`, `mostra`). L'opzione trovata viene evidenziata con un contorno (classe `.trovato`);
  - l'elenco si ricostruisce a ogni apertura, così contiene le bolle e le composizioni del momento;
  - non conta maiuscole e accenti: "velocita 20" trova "Velocità ×20";
  - le sezioni Avanzate e Schemi di Dati ora hanno un id (`#avanzate`, `#schemiChiusure`).
- **Nell'Officina** (`../index.html`, fuori dal motore) i colori del tema per i disegni dei pezzi si leggono una volta sola (`cssMemo`, che `themeChange` svuota), e i numeri si formattano con un `Intl.NumberFormat` per ogni numero di decimali (`fmtNF`). Il risultato è identico; il cambio di forma per la pera e la scolopendra è circa due volte più veloce.

## Oggetti 3D, di nuovo (5 novembre)

La sezione Oggetti tolta il 2 novembre è stata riscritta, più leggera (`[Officina]`, blocco `OGGETTI 3D` prima della barra di ricerca; CSS "oggetti 3D"):
- **Dove:** menu Vista → **Oggetti 3D…** (`#bOggetti`), che apre il pannello `#pannelloO` a sinistra della scena. Stanza di sfondo e oggetti non si aprono insieme. La ricerca trova "Oggetti 3D", "Carica un modello 3D" e ogni oggetto per nome.
- **Formati:** GLB, OBJ, STL e PLY, anche con i colori dei vertici. Un PLY senza facce diventa una nuvola di punti, con la grandezza dei punti calcolata dalla densità.
  - `OBJLoader`, `STLLoader`, `PLYLoader` e `TransformControls` si scaricano solo quando servono (aggiunti a `LETTORI`, con `lettore()`).
  - Lo splat e la scena Municipalità_4 di prima non ci sono.
- **Misure:**
  - alla prima apertura, un modello lungo più di 300 unità viene considerato in millimetri e uno lungo più di 30 in centimetri (`primaScala`);
  - poi si regola con "Altezza dell'oggetto", o con "Lato più lungo" per le cose piatte, in metri;
  - "Alzalo (gira di 90°)" raddrizza le scansioni che arrivano sdraiate (asse Z in alto);
  - ogni oggetto è centrato in pianta e appoggiato a terra, quindi ruota su se stesso (gerarchia `g` → `off` → `perno` → `mod`).
- **Spostare:**
  - con le maniglie (Sposta, Ruota, Scala): la rotazione è solo attorno all'asse verticale e la scala resta uguale nelle tre direzioni;
  - il quadratino centrale e le maniglie orizzontali fanno scorrere l'oggetto sul pavimento;
  - oppure con i campi del pannello;
  - toccando un oggetto nella scena lo si sceglie, se è più vicino delle bolle (`toccaOggetto`, chiamata nel `pointerdown` della scena);
  - toccando il vuoto, o una bolla, l'oggetto scelto si lascia; anche con Esc.
- **Duplica e Togli.** Le copie usano le stesse geometrie. Togli cancella anche il file dal browser, se nessun'altra composizione lo usa.
- **Con la composizione:**
  - le misure stanno in `dati.oggetti` (scritto da `fotografa` con `statoOggetti`, letto alla fine di `carica` con `applicaOggetti`);
  - il file sta in IndexedDB (`bolle-stanza`, chiave `oggetto:` + composizione + `:` + oggetto);
  - ogni oggetto ricorda in `fileDi` la composizione che ha il suo file: aprendo una copia, o una composizione importata, il file si copia sotto quella nuova;
  - **Elimina** cancella i file della composizione che non servono più ad altre (`togliFileOggetti`); **Nuova** parte senza oggetti;
  - come per la stanza, il file non viaggia con Esporta: se manca, l'oggetto resta in elenco con "Scegli il file…".
- **Avvio:** `oggettiPronti` e `oggettiAttesi` sono `var` senza valore iniziale, perché all'avvio `carica()` e `fotografa()` arrivano prima che il blocco sia letto.
- **Avatar:** `window.oggetti.elenco()` dà il centro `c` e il raggio `r` di ogni oggetto, e `occupato()` dice se si sta usando una maniglia. Così torna la situazione "Attorno agli oggetti", quando un oggetto è dentro una bolla.
- Il legame tra i pezzi del modello e il loro oggetto sta in una `WeakMap` (`oggettoDi`), non in `userData`: `clone()` copia `userData` come testo, e il legame è circolare.
