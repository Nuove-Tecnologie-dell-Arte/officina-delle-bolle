# Officina delle Bolle

Un generatore di guide per costruire bolle gonfiabili in plastica fatte di pannelli piatti: cupola, cubo, prismi, piramidi, forme a L e a C, tunnel, barca, ciambella, figure (balena, fungo, razzo, tartaruga…), frutti (banana, ananas, pera, uva) e piante disegnate a mano.

Si sceglie la forma e la misura, e la pagina prepara tutto il resto:
- le misure della bolla vera e del modellino in scala;
- i pezzi da tagliare, passo per passo, senza compasso (regola 3-4-5 e metodo dei due metri);
- lo sviluppo da stampare per il modellino in carta;
- l'ordine delle giunzioni, con la vista 3D;
- la modalità cantiere, a schermo intero, da usare con il telefono mentre si lavora a terra.

Il sito è un unico file, `index.html`, che non ha bisogno di un server: basta aprirlo nel browser.

## Configuratore Bolle

Nella cartella `configuratore/` c'è il **Configuratore Bolle**, fatto da un altro gruppo del lab (Alfredo). Simula un'installazione di più bolle collegate: aria e pressione, gonfiatori del lab, porte, persone, materiali e costi.

- Si apre da `configuratore/` sullo stesso sito, oppure dal pulsante "Apri nel configuratore" del passo 2 dell'Officina. Il pulsante passa la forma con le sue misure, e **tutte le forme** arrivano montate così come sono: quelle che il configuratore ha già (cubo, prisma, piramide, stella, piante dritte) con i suoi tipi, le altre (cupola, tubi, figure…) come forma vera in 3D.
- Nella scheda "Bolle" del configuratore ci sono anche le forme dell'Officina che il configuratore non aveva (cupola, dodecaedro, L, C, freccia, tubi, figure e frutti…), con le loro misure. Il configuratore le costruisce con il motore dell'Officina, letto da `index.html` tra `// ENGINE START` e `// ENGINE END`: non cambiate quei due segnaposto.
- **Stanza di sfondo** (barra Vista → Stanza): mette le bolle dentro uno spazio vero, da una foto 360° equirettangolare (anche HDR) o da un modello GLB. Si vedono solo le facce interne, come il backface culling del materiale in Blender, così le pareti verso di te spariscono.
- Per aggiornarlo con una loro nuova versione: si sostituisce `configuratore/index.html` con il loro file unico e si riaggiungono le parti segnate `[Officina]`. L'elenco è in `configuratore/MODIFICHE.md`.
