# Officina delle Bolle

Un generatore di guide per costruire bolle gonfiabili in plastica fatte di pannelli piatti: cupola, cubo, prismi, piramidi, forme a L e a C, tunnel, barca, ciambella, figure (balena, fungo, razzo, tartaruga…), frutti (banana, ananas, pera) e piante disegnate a mano.

In cima, la figura mostra a turno tutte le forme, una ogni 5 secondi (si ferma mentre ci passate sopra o la girate a mano): cliccandola si sceglie quella che si sta vedendo. I numeri accanto restano sempre sulla forma scelta. Appena si sceglie una forma (dalla galleria, cliccando la figura, con la ricerca, aprendo un progetto o un file, da un link o tornando dall'Abbofficina) il giro si ferma e la figura resta su quella, fino alla prossima visita.

Si sceglie la forma e la misura, e la pagina prepara tutto il resto:
- le misure della bolla vera e del modellino in scala;
- i pezzi da tagliare, passo per passo, senza compasso (regola 3-4-5 e metodo dei due metri);
- lo sviluppo da stampare per il modellino in carta;
- l'ordine delle giunzioni, con la vista 3D;
- la modalità cantiere, a schermo intero, da usare con il telefono mentre si lavora a terra.

Avvisi e consigli: se la bolla è troppo bassa per una porta da 1,80 m la pagina lo dice al Passo 2. L'altezza si misura dove va davvero la porta (30 cm dentro, e senza un soffitto basso sopra la soglia, come il ponte della barca), con lo stesso calcolo dell'Abbofficina; tutte le forme partono già con misure che vanno bene. Nel materiale si scrive la larghezza del rotolo di telo: la pagina dice quanti metri comprarne e quali pezzi vanno fatti con più strisce. Se una forma ha più di 40 tipi di pezzo al Passo 4 suggerisce le scelte che li riducono (per esempio la pera «Dritta»).

**Salva e riapri**: nella scheda dei progetti, "Salva su file" scarica un `.json` con forma, misure, scala e nome, e "Apri da file" lo ricarica. Funziona anche fuori da Claude, quindi è il modo per passarsi una forma tra persone o computer (i progetti del gruppo, invece, si salvano solo dentro Claude).

**Barra di ricerca**: la lente in alto, accanto ai passi (o ⌘K / Ctrl+K, o il tasto /), apre una casella in cui si scrive cosa si cerca, per esempio "cupola", "rotolo", "cantiere", "pezzo 3" o "giunzione 12". Si arriva subito a quell'opzione, anche se sta in un altro passo. I pulsanti che cancellano ("Azzera le spunte", "Azzera le giunzioni") vengono solo mostrati, non premuti.

Il sito è un unico file, `index.html`, che non ha bisogno di un server: basta aprirlo nel browser.

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
- Nella scheda "Bolle" dell'Abbofficina ci sono anche le forme dell'Officina che non aveva (cupola, sfera geodetica, sfera di triangoli uguali, pallone, dodecaedro, L, C, freccia, tubi, figure e frutti…), con le loro misure. L'Abbofficina le costruisce con il motore dell'Officina, letto da `index.html` tra `// ENGINE START` e `// ENGINE END`: non cambiate quei due segnaposto.
- **Stanza di sfondo** (barra Vista → Stanza): mette le bolle dentro uno spazio vero, da una foto 360° equirettangolare (anche HDR) o da un modello GLB. Si vedono solo le facce interne, come il backface culling del materiale in Blender, così le pareti verso di te spariscono. C'è già pronto il Corridoio dell'Accademia, ricostruito in 3D dalla foto: l'angolo del chiostro con i due bracci, in cui si può girare e guardare lungo i corridoi. Le pareti della stanza contano: le bolle non ci si possono mettere né trascinare dentro, e quelle più alte del soffitto diventano rosse. Ogni composizione ha la sua stanza, o nessuna: aprendone una si parte senza stanza, e se l'avevate lasciata con una stanza, la stanza torna.
- **Oggetti 3D** (barra Vista → Oggetti 3D): scansioni e modelli in GLB, OBJ, STL o PLY, anche nuvole di punti, da mettere nella scena e spostare, ruotare e scalare con le maniglie o con i numeri. Le misure in centimetri o millimetri vengono riconosciute, e le scansioni sdraiate si alzano con un clic. Si salvano con la composizione, in questo browser. Un oggetto messo dentro una bolla fa radunare le persone attorno a lui.
- Per aggiornarla con una loro nuova versione: si sostituisce `configuratore/index.html` con il loro file unico e si riaggiungono le parti segnate `[Officina]`. L'elenco è in `configuratore/MODIFICHE.md`.
