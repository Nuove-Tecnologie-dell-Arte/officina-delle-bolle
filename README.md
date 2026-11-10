# Officina delle Bolle

Un generatore di guide per costruire bolle gonfiabili in plastica fatte di pannelli piatti: cupola, cubo, prismi, piramidi, forme a L e a C, tunnel, barca, ciambella, figure (balena, fungo, razzo, tartaruga…), frutti (banana, ananas, pera) e piante disegnate a mano.

**I file**: `index.html` (la pagina, con dentro la simulazione), `motore.js` (il motore delle forme, usato dalla pagina e dall'Abbofficina), `immagine.js` (la finestra «bolla da un'immagine») e `configuratore/` (l'Abbofficina, che la pagina completa mostra nel riquadro Simulazione).

## La pagina

Una pagina sola, con tre sezioni una sotto l'altra. La barra in alto porta a ciascuna: **Officina**, **Pezzi**, **Cartamodello e montaggio**. Forma e misure si salvano da sole in questo browser.

### 1 · Officina delle Bolle

- **In alto** il titolo, due righe di presentazione e la figura della forma scelta, con una persona alta 1,75 m e le quote di altezza e larghezza, così si capisce subito quanto è grande.
- **Scegli forma**: 4 forme per cominciare (cupola, cubo, sfera liscia, pallone da calcio); le altre si aprono con «Altre forme» e si aprono da sole se la forma scelta è una di quelle. Ogni forma dice quanti tipi di pezzo ha. Sotto, il riquadro per partire da un'immagine.
- **La stanza**: larghezza, lunghezza e altezza del soffitto della stanza in cui va la bolla. La pagina dice se la bolla ci sta, ci sta di poco o non ci sta, e nella simulazione la bolla appare dentro quella stanza.
- **Misure bolla**, in tre schede:
  - *Misure*: l'anteprima 3D e i campi, sempre della bolla vera, in metri. Toccando un campo, nell'anteprima la parte che cambia si colora e si muove, e una riga spiega che cosa vuol dire. Sotto l'anteprima si legge quanto lavoro chiede la forma. Un valore fuori misura si dice sul campo («Minimo 0,10 m: resta 2,20 m»); «Annulla» (o Ctrl+Z) torna indietro di un cambiamento alla volta. Per la pianta disegnata a mano compare qui la griglia per disegnarla.
  - *Numeri*: altezza, pavimento, persone e gli altri numeri principali, l'avviso se la porta da 1,80 m non ci sta e i consigli per la bolla vera.
  - *Altre opzioni*: adattare la forma a un pavimento, taglio e orientamento, e «Trovate la scala dal modellino».
- **Simulazione**, accanto: l'Abbofficina con la stessa bolla, i gonfiatori del lab, Sonny e l'aria. Nel riquadro si vede la scena con Costruisci e Prova; il pulsante ↗ la apre a tutto schermo con tutte le sue schede (Aria, Materiali, Dati…), e ↙ o Esc tornano alla pagina. I due riquadri si parlano: cambiando misure o forma, la bolla nella simulazione cambia subito; cambiando quella bolla nella simulazione, le misure tornano nei campi. Nella simulazione si possono aggiungere altre bolle e collegarle; i pezzi e il montaggio restano sulla bolla delle misure.
- **Materiali bolla vera**: telo e grammatura, con che cosa si uniscono i pezzi (nastro adesivo, con larghezza e lati), porte, collegamenti tra bolle e larghezza del rotolo. Partono dai valori del lab e valgono anche nella simulazione. Sotto, apribili: telo e attrezzi per tracciare e tagliare (quanti metri di rotolo e quali pezzi vanno fatti con più strisce), il materiale per il modellino e l'ordine del lavoro.
- **Lista materiali e prezzi**, accanto: la stessa distinta della simulazione, con quantità, prezzi e totale. I prezzi si scrivono qui o nella simulazione e sono gli stessi nei due posti.
- In fondo alla sezione la descrizione della forma e i **progetti**: «Salva su file» scarica un `.json` con forma, misure, scala e nome, e «Apri da file» lo ricarica, per passarsi una forma tra persone o computer.

### 2 · Pezzi

Come disegnare i pezzi per la bolla. In alto l'interruttore **Bolla | Modellino**, solo per questa sezione: con Bolla i passi sono in metri, con il rotolo e il margine per saldare o cucire; con Modellino in centimetri, con la scala accanto all'interruttore (la stessa della sezione 3). Una scheda per tipo di pezzo: chiusa mostra il numero, la sagoma, nome e uso, **«× N»** (quanti pezzi uguali servono) e le spunte fatte; aperta mostra il disegno con le misure e i passi con metro e squadra, senza compasso. Le spunte restano salvate. «Altro» apre o chiude tutte le schede e azzera le spunte (con «Annulla»); la **modalità cantiere** mostra un pezzo alla volta a schermo intero, per il telefono mentre si lavora a terra. In fondo, «Come si traccia un pezzo senza compasso?» (regola 3-4-5, metodo dei due metri, pezzi speculari).

### 3 · Cartamodello e montaggio

Un altro interruttore **Bolla | Modellino**, solo per questa sezione.

- **Modellino**: lo sviluppo da ritagliare in grande, con sopra la legenda delle linee (taglio, piega, codice del pezzo, numero della giunzione), «Ingrandisci» e «Stampa il cartamodello», che stampa solo lo sviluppo. La scala è accanto all'interruttore. Sotto, «Come si costruisce il modellino».
- **Bolla**: il montaggio della bolla vera, una giunzione alla volta dal pavimento verso l'alto. A sinistra «Giunzione 1 di N» con i due pezzi da unire e le lettere degli angoli (per esempio «P2-1 A–B con P1-1 E–D»), lunghezza e angolo, «Fatta» e ‹ ›; a destra la bolla in 3D con la giunzione in rosso. Sopra, quante ne avete fatte e la modalità cantiere; sotto, «Elenco di tutte le giunzioni» e «Come si monta?». All'ultima giunzione la bolla si gonfia nella pagina.

### Per tutta la pagina

- **Barra di ricerca**: la lente in alto (o ⌘K / Ctrl+K, o il tasto /) apre una casella in cui si scrive cosa si cerca, per esempio "cupola", "rotolo", "cantiere", "pezzo 3" o "giunzione 12", e la pagina ci porta. I pulsanti che cancellano vengono solo mostrati, non premuti.
- **Avvisi**: se la bolla è troppo bassa per una porta da 1,80 m la pagina lo dice; l'altezza si misura dove va davvero la porta (30 cm dentro, e senza un soffitto basso sopra la soglia), con lo stesso calcolo dell'Abbofficina. Se una forma ha più di 40 tipi di pezzo, la pagina suggerisce le scelte che li riducono.
- **Tastiera e telefono**: sul telefono i riquadri affiancati vanno uno sotto l'altro. Ricerca e cantiere tengono il focus, Esc chiude; in cantiere il tasto F segna «Fatto».
- **Server**: `index.html` si apre anche con un doppio clic, con accanto `motore.js` e `immagine.js`. Per la simulazione completa serve però un server, anche solo locale (`python -m http.server`): l'Abbofficina legge il motore con una richiesta, e senza server non ha le forme dell'Officina nel suo elenco.
- I dettagli di che cosa è cambiato rispetto ai sei passi di prima sono in `MODIFICHE.md`.

## Bolla da un'immagine

Nella sezione 1, dopo le forme, c'è il riquadro **Crea una bolla da un'immagine**. Si carica una foto, un disegno, uno schizzo o una sagoma: si può anche trascinare l'immagine sulla pagina o incollarla con Ctrl+V. Tutto succede nel browser, senza server.
- **La sagoma**, in tre modi:
  - **Intelligente** (si parte da qui): un modello di intelligenza artificiale riconosce il soggetto, senza ombra e sfondo. È SAM («Segment Anything», di Meta, licenza Apache 2.0), nella versione leggera SlimSAM, eseguito nel browser con Transformers.js (`@xenova/transformers@2.17.2` da jsdelivr, modello `Xenova/slimsam-77-uniform` da Hugging Face).
    - Si scarica solo la prima volta (circa 13 MB), poi resta nel browser.
    - Gira in un worker, così la pagina non si blocca; se il browser non lo permette, gira nella pagina.
    - Il modello tocca da solo il punto più interno del soggetto. Ogni tocco «+ È soggetto» o «− È sfondo» (anche col tasto destro o con Maiusc) corregge la sagoma in mezzo secondo.
    - Senza internet il pulsante si spegne e la pagina passa ad Automatico.
  - **Automatico**, senza internet: uno scontorno sul modello di GrabCut, scritto dentro la pagina.
    - Soggetto e sfondo hanno ciascuno un modello dei colori, così uno sfondo a puntini come il sughero conta come un unico sfondo.
    - La luce pesa poco, così un'ombra è sfondo più scuro e non un oggetto.
    - I pixel vicini e simili stanno dalla stessa parte, e una chiusura leggera toglie le fessure lungo il bordo.
    - Per aiutarlo si trascina un riquadro attorno al soggetto e si usano gli stessi tocchi «+» e «−». Con un PNG trasparente il contorno viene dalla trasparenza.
  - **Punti a mano**, per quando serve la massima precisione (vedi sotto).
- **Punti a mano:** per le foto difficili (oggetti lucidi, sfondi pieni di cose, ombre) il contorno lo mettete voi. Si tocca l'immagine attorno alla forma, un punto dopo l'altro; toccando vicino a un lato il punto va lì. I punti si trascinano, e con doppio clic (o il dito tenuto premuto) si tolgono; ci sono Annulla e Ricomincia da zero. «Parti dal contorno automatico» trasforma il contorno trovato in punti da correggere, e «Specchia» copia la metà sinistra da quella destra, per gli oggetti simmetrici.
- **Forme geometriche:** cerchi, ovali, rettangoli, poligoni regolari e stelle vengono resi precisi, così i pezzi sono di pochi tipi.
- **Come la legge**, scelto da sola e cambiabile con un clic:
  - **oggetto tondo** visto di lato (vaso, fungo, pera): gira attorno all'asse, a fasce di trapezi uguali;
  - **sagoma con spessore** vista di lato (animale, lettera);
  - **pianta** vista dall'alto, con pareti e tetto piatto, a punta o a cupola.

  Se la lettura scelta non si può costruire, la pagina ne propone un'altra.
- **Anteprima e giudizio** si aggiornano a ogni ritocco: il modellino 3D con le quote e una persona per la scala, e un giudizio «Si può fare / con qualche accorgimento (o «con molti accorgimenti», se sono almeno 4) / Così non si può fare» (l'esito si legge anche in fondo alla finestra, senza scorrere) che guarda porta da 1,80 m, pavimento, tipi di pezzo, lati troppo corti, punte strette, stabilità, modellino, telo e giunzioni.
- **Usa questa forma** la mette nell'Officina come «Forma da un'immagine»: misure, pezzi, modellino, giunzioni, cantiere e Abbofficina come per le altre forme, e il giudizio resta nella scheda della forma. La sagoma si salva con il progetto (anche su file); l'ultima immagine resta in questo browser per «Ritocca l'ultima immagine».

## Sfera liscia (sfera geodetica)

Fra i solidi regolari c'è la **Sfera liscia (tanti triangoli)**, cioè la sfera geodetica: un icosaedro con ogni triangolo diviso in triangoli più piccoli, spinti fuori fino alla sfera.
- **Quanto è tonda:** 80 triangoli (la più vicina a un d100), 180 o 320. Più triangoli, più pezzi.
- **Taglio:** si parte da circa tre quarti di sfera, tagliata a un quarto dell'altezza; il taglio si cambia in «Altre opzioni».
- **Misure di partenza:** con 4 m di diametro e 80 triangoli è alta 3,05 m, ha un pavimento di 8,2 m² e 71 pezzi di 4 tipi.

## Sfera a triangoli uguali

Fra i solidi regolari c'è anche la **Sfera a triangoli uguali**: 120 triangoli (o 48) tutti uguali, con tre lati diversi.
- **La dima:** metà dei triangoli sono lo stesso triangolo rovesciato, quindi basta una dima, girata.
- **Il taglio di partenza** toglie circa un quinto dell'altezza. Con 5 m di diametro è alta 3,94 m, ha 11,7 m² di pavimento e una porta che arriva fino a 3,11 m. Dei triangoli rimasti, 92 sono uguali; i 16 dell'ultimo giro, tagliati dal pavimento, hanno 4 forme diverse.
- **Tagliata esattamente a metà** («Altre opzioni» → Altezza del taglio) il taglio passa lungo gli spigoli e restano 60 triangoli tutti uguali più il pavimento. Ma vicino al bordo il soffitto scende, e la porta arriva solo a 1,06 m.
- **Perché:** con un solo triangolo non si può fare di meglio. Un pavimento piatto che non spezzi nessun triangolo c'è solo tagliando a metà.

## Pallone

Fra i solidi regolari c'è anche il **Pallone (pentagoni ed esagoni)**, la palla da calcio: 12 pentagoni e 20 esagoni regolari, tutti con lo stesso lato.
- **Senza taglio:** appoggiato su un esagono non va tagliato, e il pavimento è uno degli esagoni. I pezzi da tracciare sono solo due, il pentagono e l'esagono.
- **Misure di partenza:** con 6 m di diametro è alto 5,49 m, ha 3,8 m² di pavimento e il lato è di 1,21 m.
- **Per più pavimento** si può tagliarlo in basso («Altre opzioni»), ma i pezzi tagliati diventano di forme diverse.

## Abbofficina

Nella cartella `configuratore/` c'è l'**Abbofficina** (prima si chiamava Configuratore Bolle), fatta da un altro gruppo del lab (Alfredo). Simula un'installazione di più bolle collegate: aria e pressione, gonfiatori del lab, porte, persone, materiali e costi.

- **Come si usa:** sopra la scena si sceglie **Costruisci** (forme, pannello, «+» e stanza) o **Prova** (anche persone, pressione e simulazione). C'è un pannello solo, a sinistra: è «Aggiungi» finché non si tocca un pezzo, poi diventa la scheda di quel pezzo. Le forme partono dalle sei più usate, e le altre sono in «Altre forme». «Annulla» (Ctrl+Z) disfa le ultime modifiche, e porte e gonfiatori della prossima bolla sono in «Più opzioni». Sul telefono il pannello sta sotto la scena, e il manico lo allarga o lo riduce.
- **Pannello della bolla** in tre schede, Stato, Forma e Collega; colore e soffitto stellato sono in «Aspetto», in fondo a Forma. Le bolle collegate tra loro si chiamano **gruppo** (prima «sistema»).
- **Aria** mostra una scheda per bolla, con il manometro e i numeri principali; la tabella completa è sotto «Dettagli». **Dati** mostra in alto il materiale del lab (telo, chiusure, gonfiatori), con tutti i numeri della simulazione sotto «Avanzate» e il pulsante «Rimetti i valori del lab».
- **Barra di ricerca**: la lente in alto (o ⌘K / Ctrl+K, o il tasto /) apre una casella in cui si scrive cosa si cerca, per esempio "blackout", "cupola", "telo" o "prezzi", e si arriva subito a quell'opzione, con le frecce e Invio. Se l'opzione sta in Prova o in Costruisci, la pagina ci passa da sola.
- **Nella pagina completa** l'Abbofficina sta nel riquadro Simulazione (`configuratore/index.html?incorporata=1`) e riceve la forma con dei messaggi; i dettagli sono in `MODIFICHE.md`. Aperta da sola (`configuratore/`), funziona come prima.
- Aperta da sola, si passa da una parte all'altra con il selettore **Officina | Abbofficina** in alto, nella stessa scheda: l'Officina ricorda l'ultima forma e l'Abbofficina l'ultima composizione. Il pulsante "Porta la forma nell'Abbofficina" dell'Officina la manda nell'Abbofficina; da lì, "Officina" riporta a quella forma con le sue misure, e rimandandola dopo un ritocco si aggiorna la stessa composizione. Con "Aggiungi alla composizione aperta" la forma va invece nell'ultima composizione su cui si stava lavorando, accanto alle altre bolle, così se ne mettono insieme più di una. Se l'Abbofficina ingrandisce la forma per avere porte da 1,80 m, tornando all'Officina un avviso dice di quanto. Le composizioni dell'Abbofficina si passano con Esporta / Importa.
- Si apre anche da `configuratore/` sullo stesso sito: la cartella e l'indirizzo hanno tenuto il nome di prima, così i link già condivisi funzionano ancora. Il pulsante passa la forma con le sue misure, e **tutte le forme** arrivano montate così come sono: quelle che l'Abbofficina ha già (cubo, prisma, piramide, stella, piante dritte) con i suoi tipi, le altre (cupola, tubi, figure…) come forma vera in 3D.
- Nella scheda "Bolle" dell'Abbofficina ci sono anche le forme dell'Officina che non aveva (cupola, sfera liscia, sfera a triangoli uguali, pallone da calcio, palla di 12 pentagoni, L, C, freccia, tubi, figure e frutti…), con le loro misure. L'Abbofficina le costruisce con il motore dell'Officina, letto da `motore.js` tra `// ENGINE START` e `// ENGINE END`: non cambiate quei due segnaposto.
- **Stanza di sfondo** (barra Vista → Stanza): mette le bolle dentro uno spazio vero, da una foto 360° equirettangolare (anche HDR) o da un modello GLB. Si vedono solo le facce interne, come il backface culling del materiale in Blender, così le pareti verso di te spariscono. C'è già pronto il Corridoio dell'Accademia, ricostruito in 3D dalla foto: l'angolo del chiostro con i due bracci, in cui si può girare e guardare lungo i corridoi. Le pareti della stanza contano: le bolle non ci si possono mettere né trascinare dentro, e quelle più alte del soffitto diventano rosse. Ogni composizione ha la sua stanza, o nessuna: aprendone una si parte senza stanza, e se l'avevate lasciata con una stanza, la stanza torna.
- **Oggetti 3D** (barra Vista → Oggetti 3D): scansioni e modelli in GLB, OBJ, STL o PLY, anche nuvole di punti, da mettere nella scena e spostare, ruotare e scalare con le maniglie o con i numeri. Le misure in centimetri o millimetri vengono riconosciute, e le scansioni sdraiate si alzano con un clic. Si salvano con la composizione, in questo browser. Un oggetto messo dentro una bolla fa radunare le persone attorno a lui.
- Per aggiornarla con una loro nuova versione: si sostituisce `configuratore/index.html` con il loro file unico e si riaggiungono le parti segnate `[Officina]`. L'elenco è in `configuratore/MODIFICHE.md`.
