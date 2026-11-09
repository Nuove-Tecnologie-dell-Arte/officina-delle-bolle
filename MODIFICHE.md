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
