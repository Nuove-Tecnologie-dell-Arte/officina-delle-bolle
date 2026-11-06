# Officina delle Bolle

Un generatore di guide per costruire bolle gonfiabili in plastica fatte di pannelli piatti: cupola, cubo, prismi, piramidi, forme a L e a C, tunnel, barca, ciambella, figure (balena, fungo, razzo, tartaruga…), frutti (banana, ananas, pera) e piante disegnate a mano.

## Guida per cominciare

**`guida.html`** è la porta d'ingresso per chi non ha mai fatto una bolla: studenti del lab, classi, ragazzi. Spiega che cos'è una bolla e accompagna passo passo fino alla bolla vera, una tappa per schermata, con «Avanti» e «Indietro» grandi e le parole tecniche spiegate (pulsante «Parole», o toccando le parole sottolineate). Si riprende da dove si era.
1. **Benvenuti**: che cos'è una bolla (pannelli piatti, uniti lato per lato, gonfiata da un ventilatore) e le cinque tappe.
2. **Forma**: 8 forme per cominciare (cupola, casetta, cubo, sfera geodetica, pallone, tunnel, fungo, balena) con l'etichetta Facile / Media / Impegnativa, oppure **la vostra immagine** (la stessa finestra della bolla da un'immagine).
3. **Grandezza**: «quante persone ci devono stare?» (circa 0,8 m² a persona) e le misure vengono da sole; se la porta è troppo bassa c'è il pulsante che la fa alta abbastanza. Le misure a mano sono sotto «Voglio scegliere io le misure».
4. **Si può fare?**: porta, pavimento, tipi di pezzo, stabilità, con un pulsante per ogni problema («Fatela più grande», «Meno dettaglio»).
5. **Modellino**: scala scelta da sola (alto circa 15 cm), sviluppo diviso in fogli A4 da stampare al 100%, con il segmento di controllo da 5 cm, le linee di taglio e di piega e i numeri dei bordi da chiudere.
6. **Materiale**, **Dime** (una scheda per tipo di pezzo, con lati, «piede» e altezza degli angoli, stampabili), **Montaggio** (una giunzione alla volta, con i due pezzi evidenziati in 3D e le lettere che combaciano) e **Si gonfia!** (la lista della sicurezza).

«Modalità completa» porta la stessa forma, con le stesse misure, nella pagina completa (`index.html`); dall'ultima tappa si può provarla nell'Abbofficina. In `index.html`, chi arriva la prima volta trova un riquadro che porta alla guida, e sotto il titolo c'è sempre il link.

**I file**: `index.html` (la pagina completa), `guida.html` (la guida per cominciare), `motore.js` (il motore delle forme, usato da tutte e due e dall'Abbofficina), `immagine.js` (la finestra «bolla da un'immagine», usata da tutte e due) e `configuratore/` (l'Abbofficina).

In cima, la figura mostra a turno tutte le forme, una ogni 5 secondi (si ferma mentre ci passate sopra o la girate a mano): cliccandola si sceglie quella che si sta vedendo. I numeri accanto restano sempre sulla forma scelta. Appena si sceglie una forma (dalla galleria, cliccando la figura, con la ricerca, aprendo un progetto o un file, da un link o tornando dall'Abbofficina) il giro si ferma e la figura resta su quella, fino alla prossima visita. Mentre la figura mostra un'altra forma, sotto i numeri c'è scritto «In vetrina: …» (i numeri sono di quella forma) e l'avviso della porta si nasconde; sulla vostra forma torna «Forma scelta».

**Passo 1**: in cima ci sono 4 forme per cominciare (cupola, cubo, sfera geodetica, pallone); le altre 24 si aprono con «Altre forme» (compresa la forma da un'immagine), e si aprono da sole se la forma scelta è una di quelle. I Progetti del gruppo stanno dopo «Avanti».

**Rotolo**: la larghezza del rotolo di telo è una sola, in metri. Si scrive al Passo 3 (materiale) o al Passo 4 (pezzi, con la bolla vera) e i due campi restano uguali.

Si sceglie la forma e la misura, e la pagina prepara tutto il resto:
- le misure della bolla vera e del modellino in scala;
- i pezzi da tagliare, passo per passo, senza compasso (regola 3-4-5 e metodo dei due metri);
- lo sviluppo da stampare per il modellino in carta;
- l'ordine delle giunzioni, con la vista 3D;
- la modalità cantiere, a schermo intero, da usare con il telefono mentre si lavora a terra.

Avvisi e consigli: se la bolla è troppo bassa per una porta da 1,80 m la pagina lo dice al Passo 2. L'altezza si misura dove va davvero la porta (30 cm dentro, e senza un soffitto basso sopra la soglia, come il ponte della barca), con lo stesso calcolo dell'Abbofficina; tutte le forme partono già con misure che vanno bene. Nel materiale si scrive la larghezza del rotolo di telo: la pagina dice quanti metri comprarne e quali pezzi vanno fatti con più strisce. Se una forma ha più di 40 tipi di pezzo al Passo 4 suggerisce le scelte che li riducono (per esempio la pera «Dritta»).

**Salva e riapri**: nella scheda dei progetti, "Salva su file" scarica un `.json` con forma, misure, scala e nome, e "Apri da file" lo ricarica. Funziona anche fuori da Claude, quindi è il modo per passarsi una forma tra persone o computer (i progetti del gruppo, invece, si salvano solo dentro Claude).

**Barra di ricerca**: la lente in alto, accanto ai passi (o ⌘K / Ctrl+K, o il tasto /), apre una casella in cui si scrive cosa si cerca, per esempio "cupola", "rotolo", "cantiere", "pezzo 3" o "giunzione 12". Si arriva subito a quell'opzione, anche se sta in un altro passo. I pulsanti che cancellano ("Azzera le spunte", "Azzera le giunzioni") vengono solo mostrati, non premuti.

Il sito non ha bisogno di un server: basta aprire `index.html` o `guida.html` nel browser, con accanto `motore.js` e `immagine.js` (l'Abbofficina invece legge il motore con una richiesta, quindi vuole il sito pubblicato o un server locale).

## Bolla da un'immagine

In cima al Passo 1 c'è il riquadro **Crea una bolla da un'immagine**. Si carica una foto, un disegno, uno schizzo o una sagoma: si può anche trascinare l'immagine sulla pagina o incollarla con Ctrl+V. Tutto succede nel browser, senza server.
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
- **Anteprima e giudizio** si aggiornano a ogni ritocco: il modellino 3D con le quote e una persona per la scala, e un giudizio «Si può fare / con qualche accorgimento / Così non si può fare» che guarda porta da 1,80 m, pavimento, tipi di pezzo, lati troppo corti, punte strette, stabilità, modellino, telo e giunzioni.
- **Usa questa forma** la mette nell'Officina come «Forma da un'immagine»: misure, pezzi, modellino, giunzioni, cantiere e Abbofficina come per le altre forme, e il giudizio resta nella scheda della forma. La sagoma si salva con il progetto (anche su file); l'ultima immagine resta in questo browser per «Ritocca l'ultima immagine».

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
