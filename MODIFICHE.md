# Interfaccia semplice (branch `interfaccia-semplice`)

Il sito in una pagina sola, con tre sezioni, dai disegni del quaderno (pagine 23–26). Funzioni e calcoli restano quelli di prima (`motore.js`, `immagine.js`, forme, pezzi, distinta, simulazione): cambia come sono presentati. Le parti nuove sono segnate `[Semplice]` nel codice.

## Sezione 1 · Officina delle Bolle

- **Una pagina sola**: niente più passi da 1 a 6. La barra in alto porta alle tre sezioni (Officina, Pezzi, Cartamodello e montaggio) e scorre la pagina fino a lì (`showStep`, `goStep`, `mostraRiquadro`). Tolti i pulsanti «Indietro / Avanti» in fondo ai passi e il passaggio Officina / Abbofficina in alto. La figura in alto non cambia più forma da sola (vetrina ferma).
- **In alto**: titolo, testo breve e la figura con la persona da 1,75 m e le quote, come prima.
- **Scegli forma**: la galleria di prima, con «Altre forme» e «Oppure partite da un'immagine».
- **Misure bolla** (`#rqMisure`), tre schede (`attivaScheda`):
  - *Misure*: anteprima 3D e campi; le misure sono sempre della bolla vera, in metri (`campiModello()` è sempre falso: il Modellino sta nelle sezioni 2 e 3);
  - *Numeri*: i riquadri dei numeri, gli avvisi sulla porta e i consigli per la bolla vera (prima al Passo 2);
  - *Altre opzioni*: pavimento, taglio e orientamento, scala dal modellino.
  - Restano nascosti, perché non servono più: «Mostra insieme bolla vera e modellino», il passaggio all'Abbofficina e la tabella di tutte le misure.
- **Simulazione** (`#rqSim`): l'Abbofficina dentro il riquadro (`configuratore/index.html?incorporata=1`). Nel riquadro piccolo si vede solo la scena (Costruisci e Prova); con ↗ va a tutto schermo con tutte le sue schede (Aria, Materiali, Dati…), e ↙ o Esc tornano alla pagina.
  - **Si parlano** con dei messaggi (`postMessage`): cambiando misure o forma, la pagina manda la forma come faceva il pulsante «Porta la forma nell'Abbofficina» (`inviaSim`, stesso pacchetto di `perConfiguratore`); la bolla «legata» nella simulazione cambia subito. Cambiando quella bolla nella simulazione, le misure tornano nella pagina (`daSimulazione`: cubo, poligono, piramide, stella; per le forme vere la scala).
  - Nella simulazione si possono aggiungere altre bolle; Pezzi e Montaggio restano sulla bolla delle misure.
- **Materiali bolla vera** (`#prepara`): telo e grammatura, giunti (con larghezza e lati del nastro), porte, collegamenti, larghezza del rotolo. Partono dai valori del lab e vanno anche alla simulazione. Sotto, apribili: telo e attrezzi per tracciare e tagliare, materiale per il modellino, l'ordine del lavoro.
- **Lista materiali e prezzi** (`#rqLista`): la distinta della simulazione, con le stesse quantità e gli stessi prezzi. Un prezzo scritto qui vale anche nella simulazione, e viceversa.
- Progetti salvati e «Salva su file» restano in fondo alla sezione.

### Nell'Abbofficina (`configuratore/index.html`)

- `?incorporata`: classi `incorporata` e `piccola` sul body. Nel riquadro piccolo spariscono intestazione, pannelli laterali e suggerimenti; a schermo intero torna tutto, tranne il passaggio Officina / Abbofficina. Niente finestra «Con che cosa la costruite?»: i materiali si scelgono nella pagina.
- `preparaPacco`: il controllo della forma che arriva dall'Officina (prima dentro `daOfficina`), usato anche dai messaggi.
- `formaDallaPagina`: la forma arriva nella composizione «Officina · …» (`c.pagina`), sulla bolla `legato` (si salva con la composizione).
- `cambiataQui` (dopo ogni `strutturaCambiata`) e `mandaStato`: misure della bolla legata, materiali scelti e distinta con i prezzi vanno alla pagina. Messaggi accettati: `forma`, `materiali`, `prezzo`, `grande`; mandati: `pronta`, `misure`, `stato`, `esci`.

## Sezione 2 · Pezzi

- In alto «Pezzi» e «Come disegnare i pezzi per la bolla», con quanti pezzi e quanti tipi (`#piecesTitle`).
- **Interruttore «Bolla | Modellino»** solo per questa sezione (gli stessi pulsanti `data-u` di prima): Bolla dà i passi in metri, con rotolo e margine; Modellino in centimetri, con la scala accanto all'interruttore (`.scalaSez`, l'`#scale` che prima stava al Passo 1). La scala vale anche per la sezione 3. Le misure della sezione 1 restano della bolla vera.
- **Una scheda per tipo di pezzo**: chiusa mostra numero, la sagoma del pezzo (`sagomaSvg`), nome e uso, **«× N»** (quanti pezzi uguali) e le spunte fatte; aperta mostra il disegno con le misure e i passi con metro e squadra, come prima. Le schede partono chiuse. Le spunte restano salvate.
- Restano «Altro» (apri o chiudi tutti i pezzi, azzera le spunte), «Modalità cantiere» e «Come si traccia un pezzo senza compasso?». Tolti l'elenco riassuntivo dei tipi sopra le schede (le schede chiuse fanno già da elenco) e il vecchio bollino «× N».

## Sezione 3 · Cartamodello e montaggio

- I vecchi Passi 5 e 6 sono una sezione sola (`#modellino`; il montaggio è il riquadro `#montaggio` dentro la sezione).
- **Interruttore «Bolla | Modellino»** solo per questa sezione (`setS3`, ricordato in `bolle|sez3`), indipendente da quello dei pezzi. Parte da Modellino.
- **Modellino**: lo sviluppo da ritagliare in grande, con sopra la legenda delle linee (taglio, piega, codice, giunzione), «Ingrandisci» e il nuovo **«Stampa il cartamodello»** (stampa solo lo sviluppo, `body.stampaNet`). La scala sta accanto all'interruttore (`#scala3`) ed è la stessa della sezione 2. Sotto, apribile, «Come si costruisce il modellino». Niente montaggio passo passo per il modellino: il modellino «a pezzi separati» non c'è più (`setBuild` è sempre `net`).
- **Bolla**: il montaggio della bolla vera, come prima: a sinistra «Giunzione 1 di N» con i pezzi da unire (per esempio «P2-1 con P1-1»), «Fatta» e ‹ ›; a destra la bolla in 3D con la giunzione evidenziata; sopra quante ne avete fatte e la modalità cantiere; sotto «Elenco di tutte le giunzioni» e «Come si monta?», che si aprono e si chiudono.
- Corretto anche per la sezione 2: il messaggio di errore della scala ora trova il suo posto accanto all'interruttore (`segnaCampo`).

## Una pagina sola, senza la guida a parte

- Eliminata `guida.html`, la guida per cominciare: con la pagina semplice non serve più una seconda pagina. Con lei sono andati il riquadro «Prima volta qui? Apri la guida» e il link «Nuovi del progetto? Cominciate dalla guida passo passo» sotto il titolo (e il loro codice e stile). `motore.js` e `immagine.js` non cambiano: li usano la pagina e l'Abbofficina.
- Tolti dai Materiali bolla vera «Per il modellino» (`#matModel`, anche dalla ricerca) e «L'ordine del lavoro». Resta «Telo e attrezzi per tracciare e tagliare».
- In «Misure bolla» l'anteprima 3D sta sopra le schede (`.rq-forma`), quindi la forma resta in vista anche in Numeri e in Altre opzioni.

## Meno testo, e niente più «Passi»

- **I vecchi passi**: tolti tutti i «Passo 1…6» rimasti nei testi (avvisi, consigli, messaggi sulla forma, annuncio per lo screen reader) e nella barra di ricerca, che ora parla di Scegli forma, Misure bolla, Numeri, Materiali, Pezzi, Cartamodello e Montaggio. `nelPasso` usa `goStep`, che apre anche la scheda o il riquadro giusto. Tolte dalla ricerca le voci di cose che non ci sono più (portare la forma nell'Abbofficina, le viste bolla / modellino / insieme, la tabella di tutte le misure, il modellino a pezzi separati, il secondo campo del rotolo).
- **Misure bolla**: via i cerchietti 1, 2, 3 dei vecchi blocchi e il titolo «Altre opzioni» ripetuto dentro la scheda Altre opzioni. «Trovate la scala dal modellino» sta ora nella sezione 3, sotto lo sviluppo.
- **In alto**: via «Persona da 1,75 m», «Colora per tipo di pezzo» e «Trascinate per girarla…» (la persona resta sempre). Nel riquadro dell'immagine restano titolo e pulsante.
- **Lista materiali e prezzi**: senza l'energia elettrica (resta nella simulazione); il totale è «Totale materiali».
- **Materiali**: tra porte e collegamenti restano Zip e Velcro (zip impermeabile e stagna solo nella simulazione; una composizione che le usava passa alla zip).
- **Rotolo**: solo in Materiali bolla vera; nei Pezzi il campo è nascosto e segue quello.
- **Tolti**: la descrizione della forma in fondo alla sezione 1, la riga «Uso… area… nel disegno: dove va» nelle schede chiuse dei pezzi, la frase sulla scala e la didascalia lunga sotto lo sviluppo, la nota finale «Calcoli fatti dalla pagina…».

## Attraversare la pagina

- **La barra in alto segue lo scorrimento** (`segnaNav`): si accende la sezione in cui si è, non solo quella cliccata; in fondo alla pagina si accende l'ultima.
- **Il nome in alto** («Officina delle Bolle» e la forma scelta) è un collegamento che riporta a «Scegli forma» (`a.brand`, `#gallery`).
- **Materiali bolla vera e Lista materiali e prezzi partono chiusi** (`.riquadro.apribile`, `apriRiquadro`): si aprono e si chiudono toccando il titolo, e il browser ricorda la scelta (`bolle|aperto|…`). Chiusi mostrano una riga di riassunto (materiali: telo, giunti e porte, `#matSintesi`; lista: il totale). Si aprono da soli quando ci si arriva dalla ricerca.

## La simulazione ferma a destra, niente «profondità»

- **La simulazione ferma a destra** (`.conSim`): sotto «Scegli forma» la pagina ha due colonne. A sinistra Misure bolla, Materiali bolla vera, Lista materiali e prezzi, Salva e riapri e la sezione Pezzi; a destra la simulazione, che resta ferma in vista (`position: sticky`) mentre si scorre la colonna di sinistra e finisce prima di Cartamodello e montaggio. Sul telefono la colonna è una sola e la simulazione sta sotto Misure bolla. (Una prima prova con una finestra in basso a destra è stata tolta.)
- **Tolta la scritta «profondità»** sotto la larghezza, nelle figure con la persona: non aveva freccia e cambiava a ogni giro della forma, quindi confondeva. Restano altezza e larghezza con le loro frecce; la profondità del pavimento resta nella scheda Numeri.

## Misure dei pezzi leggibili

- **Le scritte nel disegno di ogni pezzo sono più grandi e più leggibili** (`pieceSVG`): altezze e AB da 3,3 a 5,6 (in centesimi del pezzo), piedi da 2,9 a 4,8 e scuri invece che grigi, lettere degli angoli da 4,6 a 6, tutte in grassetto e con un bordo scuro più largo dietro. Più spazio ai lati e sotto, così non escono dal disegno. Sullo schermo passano da circa 8 px a 13–19 px.
- **Nella colonna dei Pezzi il disegno sta sopra i passi** (fino a 460 px di larghezza), invece che di fianco: nella colonna più stretta accanto alla simulazione era troppo piccolo.
- Corretto: scegliendo una forma la pagina non scendeva più alle misure, perché cercava il riquadro Misure al vecchio posto (`versoMisure` ora cerca `#rqMisure`).

## La stanza

- **Nuovo riquadro «La stanza»** (`#rqStanza`), tra «Scegli forma» e Misure bolla: larghezza, lunghezza e altezza del soffitto della stanza in cui andrà la bolla, in metri. Il browser le ricorda (`bolle|stanza|…`); «Senza stanza» le cancella.
- **La pagina controlla che la bolla ci stia** (`controllaStanza`, a ogni cambio di misure della bolla o della stanza). Il messaggio (`#stEsito`) esce in Misure bolla, sotto le caselle delle misure, così si vede mentre si cambiano. Confronta altezza e ingombro a terra della bolla con la stanza (il lato lungo con il lato lungo):
  - **Ci sta** (bordo verde): restano almeno 30 cm sopra e 50 cm intorno;
  - **Ci sta di poco** (bordo giallo): meno di 30 cm sopra o meno di 50 cm intorno, perché gonfiandosi la bolla si allarga un po';
  - **Non ci sta** (bordo rosso): più alta del soffitto o più grande della stanza a terra, con il consiglio di rimpicciolirla.
- **La stessa stanza nella simulazione** (`inviaStanza` → messaggio `stanza`; nell'Abbofficina `stanzaDallaPagina`): una stanza semplice a pareti chiare con quelle misure, con la bolla al centro. Pareti e soffitto contano come per le stanze vere: se la bolla non ci sta, nella simulazione diventa rossa. Con «Senza stanza» la stanza sparisce anche dalla simulazione.
- **La stanza nell'anteprima di Misure bolla**: quando ci sono tutte e tre le misure, intorno alla bolla c'è una scatola tratteggiata con le misure della stanza (`stanzaDisegno`, `o.stanza` in `renderView`), appoggiata al pavimento e girata con il lato lungo come quello della bolla, come nel controllo. Gira insieme alla bolla; gli spigoli dietro sono più chiari. Il colore segue il messaggio: chiara se ci sta, gialla se ci sta di poco, rossa se non ci sta. L'inquadratura si allarga per farci stare la stanza intera.

## Tolto «Come si traccia un pezzo senza compasso?»

- Via il riquadro in fondo alla sezione Pezzi (il metodo, la regola 3-4-5, i due metri a nastro, i pezzi speculari), con il disegno della regola 3-4-5 (`rule345`), il suo stile (`.method`) e la sua voce nella ricerca. Ogni pezzo ha già i suoi passi.

## Toccare un pannello: prima le misure, poi il pezzo

- **Primo tocco** su un pannello della bolla (nella figura di Misure bolla e in quella grande in alto): si apre un piccolo riquadro con solo le misure del pezzo (`apriPezzo`, `.pzCard`). In alto il numero e il nome del pezzo e quanti ne servono; poi il disegno del pezzo con le lettere degli angoli (`svgPezzo`) e la lunghezza dei lati, con i lati uguali insieme (`latiPezzo`: «Tutti i lati 2,200 m», «AB, CD 1,800 m»…). Il pannello toccato resta acceso e la figura smette di girare.
- **Secondo tocco** su un pannello dello stesso pezzo, o il pulsante «Vai al pezzo ›»: la pagina va a quel pezzo nella sezione Pezzi e lo apre (`goToPiece`). Toccando un altro pezzo il riquadro passa a quello.
- Il riquadro si chiude con ×, con Esc, toccando fuori, girando la figura o cambiando le misure. Dove la figura è stretta (telefono, colonna di Misure bolla) il riquadro sta sotto la figura; nella figura grande in alto sta nell'angolo lontano dal tocco.
- Prima un tocco portava subito al pezzo.

## Corretto: la simulazione a tutto schermo non si chiudeva

- Sul computer, a tutto schermo, la barra in alto della pagina copriva il pulsante ↙ per tornare: la colonna ferma della simulazione (`position: sticky`) la teneva sotto la barra. A tutto schermo la colonna non è più ferma (`body.simGrande .cs-sim .simCasa`), e il pulsante si vede e funziona. Esc funzionava già.

## Nomi delle forme: la figura esatta

- Dove la forma è una figura geometrica, il nome è quello esatto, così non ci sono equivoci (`motore.js`, e gli stessi nell'elenco dell'Abbofficina, `FORME_OFF`):
  - Cupola (20 triangoli) → **Icosaedro** (20 triangoli): anche perché nell'Abbofficina «Cupola» è un'altra forma, la mezza sfera;
  - Sfera geodetica (tipo d100) → **Sfera geodetica** (80, 180 o 320 triangoli);
  - Sfera di triangoli uguali → **Esacisicosaedro** (120 triangoli uguali; con 48 è l'esacisottaedro);
  - Sfera di triangoli piccoli → **Esacisicosaedro suddiviso** (480 o 1080 triangoli);
  - Pallone (pentagoni ed esagoni) → **Icosaedro troncato** (12 pentagoni e 20 esagoni);
  - Piramide senza punta (tronco) → **Tronco di piramide**;
  - Ciambella → **Toro** (ciambella).
- Cubo, Dodecaedro, Prisma, Piramide e Parallelepipedo avevano già il nome esatto. Le forme a pianta (L, C, freccia, stella), i tubi e le figure (barca, banana, balena…) non sono figure geometriche con un nome: restano come prima. I gruppi restano.
- Le forme si salvano con il codice (`d20`, `geo`…), non con il nome: forme e progetti salvati si riaprono come prima.
