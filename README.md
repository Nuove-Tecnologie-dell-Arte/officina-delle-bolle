# Officina delle Bolle

Un sito per progettare e costruire bolle gonfiabili in plastica fatte di pannelli piatti: cupola, cubo, prismi, piramidi, forme a L e a C, tunnel, barca, ciambella, figure (balena, fungo, razzo, tartaruga…), frutti (banana, ananas, pera), piante disegnate a mano e forme ricavate da un'immagine.

## Il sito: le tappe e la finestra Simulatore / Schema

`index.html` è la pagina principale (la vecchia pagina completa non c'è più, e `guida.html` rimanda qui). Colori e caratteri sono quelli dell'Officina (chiaro e scuro). In alto le tappe (Progettazione, Dima / Modellino, Costruzione e, alla fine, Si gonfia); il selettore Officina | Abbofficina non c'è più. Si riprende da dove si era (nel browser, chiave `bolle|progetto`).

**A destra, sempre, una finestra con due linguette.** **Schema**: la bolla disegnata pezzo per pezzo, colorata per dima, con una persona da 1,75 m, la quota dell'altezza e l'area di lavoro; nella Costruzione si apre da sola e mostra la bolla che cresce: in colore i pezzi già montati, **in bianco i lati già uniti**, in rosso quello da fare, il resto grigio. **Simulatore**: è l'Abbofficina in «vetrina» (`configuratore/index.html?vetrina=1`, dentro un iframe). Riceve la bolla mentre la si progetta e la mostra con le cose belle da vedere: la bolla che si gonfia (da zero quando cambia la forma), i gonfiatori consigliati, i Sonny che camminano dentro, l'area di lavoro tratteggiata (rossa se la bolla non ci sta). Si gira la vista e ci si avvicina con la rotella; tutti i comandi tecnici dell'Abbofficina sono spenti, e in vetrina non si salva niente nelle sue composizioni. Sopra la scena: persone, altezza e «si può fare». three.js arriva da internet (tre CDN, una dopo l'altra, se una non risponde). Il sito aspetta il simulatore fino a 25 secondi, intanto c'è lo Schema; se arriva dopo torna da solo, e se non parte la linguetta Simulatore dice perché e offre «Riprova». La linguetta scelta si ricorda.

**Più bolle, una per scheda.** Sotto la testata ci sono le schede delle bolle (Bolla 1, Bolla 2…), come le finestre di un browser: quella in verde è quella che si modifica, «+ Nuova bolla» ne aggiunge un'altra, la × elimina quella scelta (chiede prima). Ogni bolla ha la sua forma, le sue misure, la sua tappa e le sue spunte; l'area di lavoro è una sola, per tutte. Nel **Simulatore** si vedono tutte insieme, separate, ognuna con il suo ingresso: si spostano trascinandole (il posto si ricorda), e un tocco su una bolla, o sul suo nome, apre la sua scheda. **Le aree di lavoro** sono una o più (Area 1, Area 2…, «+ Aggiungi un'area di lavoro» in «Prendi le misure»), ognuna con le sue X, Y, Z. Nel simulatore sono parallelepipedi tratteggiati fermi: la prima attorno alle bolle, le altre accanto; si spostano solo trascinandone il bordo o l'etichetta, e si portano dietro le bolle che hanno dentro. Una bolla che è dentro un'area **ci resta intrappolata**: trascinandola arriva fino al bordo e ci scivola lungo, senza passare in un'altra area (una bolla fuori da tutte si muove libera finché non entra). Ogni bolla si giudica con l'area in cui sta. Un'area è rossa se una bolla ne esce o è più alta; sotto il simulatore si dice quali bolle sono fuori. **Le bolle si girano** con ⟲ ⟳ sotto il nome della bolla scelta (15° alla volta), restando nella loro area e senza toccare le altre se c'è posto. Lo **Schema** mostra solo la bolla scelta. «Fai un'altra bolla», alla fine, apre una scheda nuova. Il progetto si salva nel browser (`bolle|progetti`; quello di una bolla sola di prima si riprende da sé).

**Lo scenario**, sotto il simulatore, è la stanza di sfondo dell'Abbofficina: nessuna, il Corridoio dell'Accademia, oppure una vostra foto 360° o un vostro modello 3D (GLB). **Con uno scenario con le pareti** (il Corridoio, una foto 360°) l'area di lavoro diventa lo spazio della stanza: le aree spariscono, le bolle restano dentro le pareti (quelle nelle pareti entrano da sole, se c'è posto) e il giudizio usa l'altezza della stanza; scegliendo «Nessuno» tornano le aree, dove erano. Un modello GLB non ha pareti note: lì valgono le aree. Lo scenario pronto si ricorda; il file vostro vale finché la pagina resta aperta. Il Corridoio funziona anche con il sito aperto come file: la foto c'è anche come testo in `configuratore/stanze/corridoio.js`.

**La tendina** tra le due metà si trascina per allargare o stringere il simulatore (anche con le frecce; doppio clic: metà e metà) e si ricorda. Sul telefono il simulatore sta in alto, fermo, e «Riduci» lo nasconde.

- **Inizio**: solo il titolo, due righe su che cos'è una bolla e «Cominciamo».
- **1 · Progettazione**, una pagina sola in tre parti:
  - **Prendi le misure**: X (lunghezza), Y (larghezza) e Z (altezza libera) dell'area di lavoro, in metri. Se ci sono, i cursori arrivano fin lì, il simulatore disegna l'area e il giudizio controlla che la bolla ci entri, anche girata di un quarto. Vuote vuol dire nessun limite.
  - **Progetta**: la cartella con due linguette. **Forme**: le 28 forme del motore per famiglia, con l'anteprima e Facile / Media / Impegnativa, più «Parti da un'immagine» (`immagine.js`) e «Disegnala tu» (la pianta su una griglia). **Misure**: tre cursori verticali X, Y, Z, «Mantieni le proporzioni» (acceso all'inizio: la forma resta quella del motore; spento si allunga o si schiaccia, e i pannelli restano piatti), le opzioni della forma e «Falla per … persone». Sotto, quante persone ci stanno (ognuna con almeno 1,5 m² di spazio vitale: `M2_PERSONA` in `motore.js`), altezza, ingombro, porta, il verdetto con **Risolvi** e la lista dei controlli.
  - **Materiali**: telo (con i metri di rotolo), nastro, cerniere, ventilatore, dime e pezzi, tempo, attrezzi, spazio.
- **2 · Dima / Modellino**: il modellino di carta (scala scelta da sola, fogli A4 al 100% con il segmento di controllo da 5 cm) e le dime. Ogni dima si chiama **P e il suo numero** (P1, P2, P3…), anche sui fogli del modellino. Il disegno di ogni dima dà le **misure semplificate**, anche per gli angoli non a 90°: la base A–B dritta (con la sua lunghezza sotto), e per ogni altro angolo quanto andare lungo la base partendo da A (sotto la linea; negativo = a sinistra di A) e quanto salire dritto a 90° (in verde), con la perpendicolare tratteggiata e il quadratino dell'angolo retto. Sotto, i lati per controllare. Le schede si stampano.
- **3 · Costruzione**: il montaggio una giunzione alla volta: il disegno dei due pezzi accostati lungo il lato rosso, con il nome della dima e «pezzo nuovo» / «già nella bolla» (niente lettere agli angoli), i pulsanti per andare avanti, e la spiegazione scritta dentro **Info**, che si apre con un clic. La bolla in 3D è nello Schema, a destra, e cresce giunzione dopo giunzione.
- **4 · Si gonfia**: la tappa finale, con i tre passi per gonfiarla e, sotto, le **FAQ**: i problemi più comuni (non si gonfia, pieghe, nastro che si stacca, strappi, porta, quante persone, sicurezza, caldo, corrente, vento, ventilatore rumoroso, modellino che si chiudeva ma la bolla no, come sgonfiarla e conservarla); cliccando una domanda si apre la soluzione.

**Come si fanno le misure X, Y, Z**: la forma si costruisce con il motore (con le sue opzioni) e poi si allunga in ogni direzione fino alle misure scelte, che restano precise (si arrotonda solo quello che si legge, così i pezzi uguali restano uguali). Una forma appena scelta parte grande per 12 persone e, se c'è l'area di lavoro, si rimpicciolisce finché ci sta; le forme disegnate in pianta si allargano solo in pianta.

**Risolvi** prova da solo tante misure vicine (tutta più grande o più piccola, solo più alta o più bassa, dentro l'area, meno lati o spicchi) e tiene quella con meno problemi e meno cambiamenti; dice che cosa ha cambiato e si può annullare. Con «Mantieni le proporzioni» prova prima a non cambiarle; se deve farlo spegne il blocco e lo scrive.

**Dall'Abbofficina**: il selettore in alto torna qui con `#apri={shape, params}` e la pagina riapre quella forma, con le sue misure vere.

**Il tema** («cellophane e nastro di carta») sta in `tema/`: `tema.css` ricopre lo stile della pagina; lo sfondo di plastica stropicciata (`plastica.svg`), i nastri di carta (`nastro.svg`, `nastro-oliva.svg`, `angolo-alto.svg`, `angolo-basso.svg`) e il foglio giallo dei materiali (`carta.svg`) sono disegni generati da `plastica.py` e `nastri.py` (si rigenerano con Python, senza altre librerie). Titoli in Bebas Neue rossi, testi in Barlow; pannelli grigi trasparenti con il nastro sugli angoli e la riga tratteggiata; campi X, Y, Z come strisce di nastro; le forme a fil di ferro su riquadri grigi. Il tema è solo chiaro, e anche il simulatore in vetrina resta chiaro.

**I file**: `index.html` (il sito), `motore.js` (il motore delle forme, usato anche dall'Abbofficina), `immagine.js` (la finestra «bolla da un'immagine»), `guida.html` (rimanda a `index.html`) e `configuratore/` (l'Abbofficina, anche in vetrina).

Il sito si apre anche senza server: basta aprire `index.html` nel browser. L'Abbofficina vera, aperta da sola, legge il motore con una richiesta, quindi vuole il sito pubblicato o un server locale; il simulatore in vetrina invece riceve la bolla già fatta e funziona anche così (serve internet per three.js).

## Bolla da un'immagine

In Progettazione, nella linguetta Forme, c'è il riquadro **Parti da un'immagine**. Si carica una foto, un disegno, uno schizzo o una sagoma: si può anche trascinare l'immagine sulla pagina o incollarla con Ctrl+V. Tutto succede nel browser, senza server.
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
- **Usa questa forma** la mette nel progetto come «La tua immagine»: misure, modellino, dime e montaggio come per le altre forme. L'ultima immagine resta in questo browser per «Ritocca l'ultima».

## Sfera geodetica

Fra i solidi regolari c'è la **Sfera geodetica (tipo d100)**: un icosaedro con ogni triangolo diviso in triangoli più piccoli, spinti fuori fino alla sfera.
- **Quanto è tonda:** 80 triangoli (la più vicina a un d100), 180 o 320. Più triangoli, più pezzi.
- **Taglio:** si parte da circa tre quarti di sfera, tagliata a un quarto dell'altezza; il taglio si cambia in «Altre opzioni».
- **Misure di partenza:** con 4 m di diametro e 80 triangoli è alta 3,05 m, ha un pavimento di 8,2 m² e 71 pezzi di 4 tipi.

## Sfera di triangoli uguali

Fra i solidi regolari c'è anche la **Sfera di triangoli uguali**: 120 triangoli (o 48) tutti uguali, con tre lati diversi.
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
- Si passa da una parte all'altra con il selettore **Officina | Abbofficina** in alto, nella stessa scheda: l'Officina ricorda l'ultima forma e l'Abbofficina l'ultima composizione. Il pulsante "Porta la forma nell'Abbofficina" dell'Officina la manda nell'Abbofficina; da lì, "Officina" riporta a quella forma con le sue misure, e rimandandola dopo un ritocco si aggiorna la stessa composizione. Con "Aggiungi alla composizione aperta" la forma va invece nell'ultima composizione su cui si stava lavorando, accanto alle altre bolle, così se ne mettono insieme più di una. Se l'Abbofficina ingrandisce la forma per avere porte da 1,80 m, tornando all'Officina un avviso dice di quanto. Le composizioni dell'Abbofficina si passano con Esporta / Importa.
- Si apre anche da `configuratore/` sullo stesso sito: la cartella e l'indirizzo hanno tenuto il nome di prima, così i link già condivisi funzionano ancora. Il pulsante passa la forma con le sue misure, e **tutte le forme** arrivano montate così come sono: quelle che l'Abbofficina ha già (cubo, prisma, piramide, stella, piante dritte) con i suoi tipi, le altre (cupola, tubi, figure…) come forma vera in 3D.
- Nella scheda "Bolle" dell'Abbofficina ci sono anche le forme dell'Officina che non aveva (cupola, sfera geodetica, sfera di triangoli uguali, pallone, dodecaedro, L, C, freccia, tubi, figure e frutti…), con le loro misure. L'Abbofficina le costruisce con il motore dell'Officina, letto da `motore.js` tra `// ENGINE START` e `// ENGINE END`: non cambiate quei due segnaposto.
- **Stanza di sfondo** (barra Vista → Stanza): mette le bolle dentro uno spazio vero, da una foto 360° equirettangolare (anche HDR) o da un modello GLB. Si vedono solo le facce interne, come il backface culling del materiale in Blender, così le pareti verso di te spariscono. C'è già pronto il Corridoio dell'Accademia, ricostruito in 3D dalla foto: l'angolo del chiostro con i due bracci, in cui si può girare e guardare lungo i corridoi. Le pareti della stanza contano: le bolle non ci si possono mettere né trascinare dentro, e quelle più alte del soffitto diventano rosse. Ogni composizione ha la sua stanza, o nessuna: aprendone una si parte senza stanza, e se l'avevate lasciata con una stanza, la stanza torna.
- **Oggetti 3D** (barra Vista → Oggetti 3D): scansioni e modelli in GLB, OBJ, STL o PLY, anche nuvole di punti, da mettere nella scena e spostare, ruotare e scalare con le maniglie o con i numeri. Le misure in centimetri o millimetri vengono riconosciute, e le scansioni sdraiate si alzano con un clic. Si salvano con la composizione, in questo browser. Un oggetto messo dentro una bolla fa radunare le persone attorno a lui.
- Per aggiornarla con una loro nuova versione: si sostituisce `configuratore/index.html` con il loro file unico e si riaggiungono le parti segnate `[Officina]`. L'elenco è in `configuratore/MODIFICHE.md`.
