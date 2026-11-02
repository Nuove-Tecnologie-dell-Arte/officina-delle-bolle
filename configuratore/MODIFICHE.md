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
- **Salvataggio.** Lo stato si salva in `bolle-menu`.
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

