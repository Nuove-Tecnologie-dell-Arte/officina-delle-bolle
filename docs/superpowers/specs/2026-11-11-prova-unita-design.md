# Prova unita: l'interfaccia dell'estetica con le funzioni della semplice

Data: 11 novembre 2026 · Branch `prova-unita` · Cartella `C:\Users\ASUS\Desktop\bolla-d20-unita`

## Obiettivo

Una prova sola che abbia:
- l'**interfaccia** e le funzioni più facili da usare della prova estetica (`prova-estetica-simone-andrea`, di Simone e Andrea);
- le **funzioni più complete** della prova semplice (`interfaccia-semplice`).

Funziona se:
- chi comincia segue le tappe dell'estetica senza perdersi;
- chi lavora al lab trova prezzi, salvataggio, ricerca, cantiere, stampa e dime complete come nella semplice;
- pagina e simulatore danno la stessa forma e gli stessi numeri.

## Punto di partenza e metodo

- Il branch `prova-unita` parte dall'ultimo commit dell'estetica (`35a7d29`).
- Le funzioni della semplice si portano **a mano**, adattate a com'è fatta l'estetica: lo stato `S`, più bolle, le tappe. Un merge diretto non va: Git dà conflitti in `index.html`, `configuratore/index.html`, `README.md` e `guida.html`.
- Si lavora un blocco alla volta, nell'ordine. Dopo ogni blocco:
  - verifica nel browser (computer e telefono, console senza errori, il resto non rotto);
  - aggiornamento di `MODIFICHE.md`;
  - un commit separato.

  Si fa il push solo quando lo dite voi.
- Le aggiunte nell'Abbofficina si segnano `[Officina]` e si scrivono in `configuratore/MODIFICHE.md`, come sempre.
- Il nastro magnetico non torna.

## Cosa resta dell'estetica

- **Aspetto:** il tema «cellophane e nastro di carta», solo chiaro (`tema/`).
- **Percorso:** le tappe Inizio → Progettazione (Prendi le misure, Progetta, Materiali) → Dima / Modellino → Costruzione → Si gonfia con le FAQ, con Indietro e Avanti.
- **Finestra a destra:** Simulatore (l'Abbofficina in vetrina) e Schema (la bolla che cresce durante il montaggio), con la tendina che si trascina.
- **Più bolle e spazio:**
  - più bolle a schede (Bolla 1, Bolla 2…), che si spostano e si girano nel simulatore;
  - le aree di lavoro (anche più di una), con le bolle che restano dentro la loro area;
  - gli scenari (Corridoio, foto 360°, GLB). Prendono il posto del riquadro «La stanza» della semplice, che non si porta.
- **Aiuti:** Risolvi, il glossario «Parole», la bolla da un'immagine, la pianta disegnata.
- **Modellino:** la scala scelta da sola e i fogli A4 al 100%.

## Cosa si toglie

- **Il conto delle persone, dappertutto:**
  - «N persone» sopra il simulatore, nel verdetto e nella barra in basso;
  - «Falla per … persone · Adatta»;
  - la frase del pavimento nel giudizio («ci stanno circa N persone»);
  - le frasi di Risolvi sulle persone.

  Risolvi non usa più le persone per scegliere. `M2_PERSONA` non serve più.
- **La partenza «grande per 12 persone»:** una forma appena scelta parte con le misure di base del motore (per esempio l'icosaedro con il lato da 2,2 m). Se non sta nell'area di lavoro si rimpicciolisce, come adesso.

## I blocchi

### Blocco 1 · Motore e niente conto delle persone

- **Il motore della semplice:**
  - `opt.size` in `buildShape`, che allunga o schiaccia la forma fino a X, Y, Z con le facce piane e mette `sc` nel risultato;
  - i nomi geometrici delle forme (Icosaedro, Sfera geodetica, Esacisicosaedro, Esacisicosaedro suddiviso, Icosaedro troncato, Tronco di piramide, Toro), gli stessi anche nell'elenco dell'Abbofficina (`FORME_OFF`).
- Le forme si salvano con il codice (`d20`, `geo`…): i progetti salvati si riaprono come prima.
- Il giudizio sul pavimento dice solo la superficie: piccolo / va bene.
- Il conto delle persone si toglie come scritto sopra.

### Blocco 2 · Misure

- **I cursori:** restano i tre cursori verticali X, Y, Z dell'estetica con «Mantieni le proporzioni».
- **Il calcolo:** il calcolo nella pagina (`scalaDim` e il resto) lascia il posto a `opt.size` del motore, quindi pagina, Schema e simulatore usano la stessa forma.
- **Figure regolari** (icosaedro, cubo, sfera geodetica, esacisicosaedro, dodecaedro, icosaedro troncato): con le proporzioni bloccate, una misura trascina le altre due e i pezzi restano tutti uguali.
- **Sotto i cursori:** le misure tipiche della forma (lati della base, punte della stella, curvatura della banana, zampe, antenne…). Quelle che dipendono dalla grandezza sono in % (`perc`), come nella semplice.
- **In «Altre opzioni»** vanno le misure tecniche (lati del tubo, spicchi, segmenti, triangoli delle sfere).
- **Restano come prima:** la pianta disegnata, la forma da un'immagine e Risolvi, che prova misure vicine con lo stesso calcolo.

### Blocco 3 · Materiali del lab e lista con i prezzi

- **Sul foglio giallo dei Materiali**, prima del resoconto, le scelte della semplice. Partono dai valori del lab e vanno anche al simulatore:
  - telo e grammatura;
  - giunti: nastro da pacchi da 48 mm, dentro e fuori;
  - porte e collegamenti: Zip o Velcro (zip impermeabile e stagna solo nell'Abbofficina);
  - larghezza del rotolo.
- **Il resoconto** (telo, nastro, cerniere, ventilatore, dime, tempo, attrezzi) segue quelle scelte.
- **Sotto, la lista materiali e prezzi:**
  - mostra le stesse quantità e gli stessi prezzi del simulatore, per tutte le bolle del progetto, senza energia elettrica;
  - il totale è «Totale materiali»;
  - un prezzo scritto qui vale anche nel simulatore, e viceversa.
- **Nell'Abbofficina:** anche in vetrina manda lo stato con la distinta e i prezzi (`mandaStato`), e accetta i messaggi `materiali` e `prezzo`.

### Blocco 4 · Simulatore: vetrina + ↗

- **Nel riquadro** resta la vetrina dell'estetica: solo la scena, bolle che si spostano, aree, scenario.
- **↗** apre a tutto schermo l'Abbofficina completa (`?incorporata=1`, come nella semplice) sulla bolla scelta, con tutte le sue schede (Aria, Materiali, Dati…).
- **↙ o Esc** tornano alla pagina:
  - le modifiche alla bolla fatte là (misure, materiali) tornano nella pagina (`daSimulazione`, messaggi `misure` e `stato`);
  - la vetrina si aggiorna.
- **Nell'Abbofficina** convivono i due modi, `vetrina` e `incorporata`, con le aggiunte della semplice (`preparaPacco`, `formaDallaPagina`, `cambiataQui`, `mandaStato`) portate sopra quelle dell'estetica.

### Blocco 5 · Dime più complete

- **Le dime:** restano P1, P2… con il metodo per tracciarle (base A–B, piede lungo la base, altezza a 90°) e la tabella dei lati.
- **Dalla semplice si aggiungono:**
  - l'interruttore **Bolla | Modellino** sulle dime: metri e cm della bolla vera, oppure cm del modellino in scala;
  - misure del disegno grandi e leggibili (13–19 px sullo schermo, in grassetto, con il bordo);
  - schede che si aprono e si chiudono. Chiuse mostrano la sagoma, P e il numero, «× N» e le spunte; tutte si aprono e si chiudono insieme, e le spunte si azzerano con «Annulla»;
  - nello Schema, un primo tocco su un pannello apre un riquadro con le misure del pezzo (lati, disegno con gli angoli) e «Vai alla dima ›». Il secondo tocco porta alla dima e la apre.

### Blocco 6 · Cantiere e stampa

- **Modalità cantiere**, a schermo intero, per il telefono mentre si lavora a terra:
  - le dime da tracciare e le giunzioni una alla volta;
  - «Fatto» (anche con il tasto F), avanti e indietro;
  - Esc per uscire.

  Le spunte sono le stesse della pagina.
- **Stampa:** «Stampa il cartamodello» stampa solo lo sviluppo del modellino; si aggiunge alla stampa delle schede delle dime, che c'è già.

### Blocco 7 · Salva / Apri file e ricerca

- **«Salva su file»** scarica un `.json` con tutto il progetto: bolle con forma, misure, opzioni e posto; aree di lavoro; scenario pronto; materiali; spunte e giunzioni.
- **«Apri da file»** lo ricarica. Si legge anche il file di una bolla sola della semplice.
- **La lente** (Ctrl+K, ⌘K o /) cerca forme, misure, materiali, dime («P3»), giunzioni («giunzione 12») e le parti delle tappe. Porta alla tappa giusta, apre la linguetta o la scheda e mette in evidenza l'opzione.
- I comandi che cancellano si mostrano soltanto, non si premono.

## Fuori da questo lavoro

- «Trovate la scala dal modellino» della semplice: non si porta, a meno che lo chiediate.
- Tema scuro, riquadro «La stanza», «Mostra insieme bolla vera e modellino»: non si portano.

## Verifica, a ogni blocco

- La pagina su un server locale (`localhost`): computer (1440 px) e telefono (390 px), console senza errori.
- **Percorso completo con una forma:**
  - Prendi le misure → Progetta → Materiali;
  - Dima / Modellino → Costruzione fino all'ultima giunzione → Si gonfia.
- **Più bolle:** due bolle in due aree, spostate e girate nel simulatore; lo Schema segue la bolla scelta.
- **Cosa controllare blocco per blocco:**
  - **Blocco 1:** nessuna parola «persone» nei testi della pagina, tranne le FAQ e il glossario se ne parlano.
  - **Blocco 2:** i cursori cambiano la forma nella pagina, nello Schema e nel simulatore allo stesso modo; le misure tipiche cambiano la forma.
  - **Blocco 3:** un prezzo cambiato nella pagina cambia nel simulatore e viceversa.
  - **Blocco 4:** ↗ apre l'Abbofficina completa; ↙ ed Esc tornano; una misura cambiata là torna nella pagina.
  - **Blocco 5:** Bolla | Modellino cambia le misure delle dime; i due tocchi nello Schema funzionano.
  - **Blocco 6:** il cantiere si apre, «Fatto» segna la stessa spunta della pagina; l'anteprima di stampa mostra solo lo sviluppo.
  - **Blocco 7:** salvare, cancellare il progetto e riaprire il file ridà tutto; la ricerca trova «P3», «rotolo», «giunzione 12».
- **Abbofficina da sola** (`configuratore/index.html`): passano i test della suite (`scratchpad/suite.sh`, adattata alla cartella nuova).
