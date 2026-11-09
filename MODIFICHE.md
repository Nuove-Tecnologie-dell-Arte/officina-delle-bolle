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
