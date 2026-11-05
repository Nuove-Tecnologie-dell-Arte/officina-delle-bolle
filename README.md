# Officina delle Bolle

Un generatore di guide per costruire bolle gonfiabili in plastica fatte di pannelli piatti: cupola, cubo, prismi, piramidi, forme a L e a C, tunnel, barca, ciambella, figure (balena, fungo, razzo, tartaruga…), frutti (banana, ananas, pera) e piante disegnate a mano.

In cima, la figura mostra a turno tutte le forme, una ogni 5 secondi (si ferma mentre ci passate sopra o la girate a mano): cliccandola si sceglie quella che si sta vedendo. I numeri accanto restano sempre sulla forma scelta.

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

## Abbofficina

Nella cartella `configuratore/` c'è l'**Abbofficina** (prima si chiamava Configuratore Bolle), fatta da un altro gruppo del lab (Alfredo). Simula un'installazione di più bolle collegate: aria e pressione, gonfiatori del lab, porte, persone, materiali e costi.

- Si passa da una parte all'altra con il selettore **Officina | Abbofficina** in alto, nella stessa scheda: l'Officina ricorda l'ultima forma e l'Abbofficina l'ultima composizione. Il pulsante "Porta la forma nell'Abbofficina" dell'Officina la manda nell'Abbofficina; da lì, "Officina" riporta a quella forma con le sue misure, e rimandandola dopo un ritocco si aggiorna la stessa composizione. Con "Aggiungi alla composizione aperta" la forma va invece nell'ultima composizione su cui si stava lavorando, accanto alle altre bolle, così se ne mettono insieme più di una. Se l'Abbofficina ingrandisce la forma per avere porte da 1,80 m, tornando all'Officina un avviso dice di quanto. Le composizioni dell'Abbofficina si passano con Esporta / Importa.
- Si apre anche da `configuratore/` sullo stesso sito: la cartella e l'indirizzo hanno tenuto il nome di prima, così i link già condivisi funzionano ancora. Il pulsante passa la forma con le sue misure, e **tutte le forme** arrivano montate così come sono: quelle che l'Abbofficina ha già (cubo, prisma, piramide, stella, piante dritte) con i suoi tipi, le altre (cupola, tubi, figure…) come forma vera in 3D.
- Nella scheda "Bolle" dell'Abbofficina ci sono anche le forme dell'Officina che non aveva (cupola, dodecaedro, L, C, freccia, tubi, figure e frutti…), con le loro misure. L'Abbofficina le costruisce con il motore dell'Officina, letto da `index.html` tra `// ENGINE START` e `// ENGINE END`: non cambiate quei due segnaposto.
- **Interfaccia**: la scena con un pannello solo a destra, che mostra "Aggiungi" quando non è scelto niente e la bolla quando la si tocca ("← Aggiungi" riporta indietro), e una barra sola in basso con Play, persone, stato, materiali e il menu Vista (visuale, riquadro della pressione, stanza di sfondo). Le prove (velocità, blackout, scoppi) sono nel menu Prove in alto. Le forme sono divise in gruppi (Semplici, Dall'Officina, Figure e frutti), Aria mostra una scheda per bolla con i numeri principali (gli altri sotto "Dettagli"), e Dati mostra in alto il materiale del lab, con tutti i numeri della simulazione sotto "Avanzate".
- **Barra di ricerca**: il pulsante "Cerca" in alto (o ⌘K / Ctrl+K, o il tasto /) apre una casella in cui si scrive cosa si cerca, per esempio "blackout", "cupola", "telo" o "prezzi", e si arriva subito a quell'opzione, con le frecce e Invio.
- **Oggetti 3D** (menu Vista → Oggetti 3D): scansioni e modelli in GLB, OBJ, STL o PLY, anche nuvole di punti, da mettere nella scena e spostare, ruotare e scalare con le maniglie o con i numeri. Le misure in centimetri o millimetri vengono riconosciute, e le scansioni sdraiate si alzano con un clic. Si salvano con la composizione, in questo browser. Un oggetto messo dentro una bolla fa radunare le persone attorno a lui.
- **Stanza di sfondo** (menu Vista → Stanza di sfondo): mette le bolle dentro uno spazio vero, da una foto 360° equirettangolare (anche HDR) o da un modello GLB. Si vedono solo le facce interne, come il backface culling del materiale in Blender, così le pareti verso di te spariscono. C'è già pronto il Corridoio dell'Accademia, ricostruito in 3D dalla foto: l'angolo del chiostro con i due bracci, in cui si può girare e guardare lungo i corridoi. Le pareti della stanza contano: le bolle non ci si possono mettere né trascinare dentro, e quelle più alte del soffitto diventano rosse. Ogni composizione ha la sua stanza, o nessuna: aprendone una si parte senza stanza, e se l'avevate lasciata con una stanza, la stanza torna.
- Per aggiornarla con una loro nuova versione: si sostituisce `configuratore/index.html` con il loro file unico e si riaggiungono le parti segnate `[Officina]`. L'elenco è in `configuratore/MODIFICHE.md`.
