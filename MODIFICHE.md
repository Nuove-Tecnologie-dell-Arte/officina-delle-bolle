# Prova unita (branch `prova-unita`)

La prova unita parte dall'ultimo commit della prova estetica di Simone e Andrea (`prova-estetica-simone-andrea`, `35a7d29`).

- **Dall'estetica resta l'interfaccia:**
  - tema «cellophane e nastro di carta»;
  - tappe Progettazione → Dima / Modellino → Costruzione → Si gonfia;
  - simulatore in vetrina e Schema a destra;
  - più bolle;
  - aree di lavoro e scenari;
  - Risolvi;
  - FAQ.
- **Dalla prova semplice (`interfaccia-semplice`) arrivano, un blocco alla volta, le funzioni più complete:**
  - nomi geometrici e misure del motore;
  - misure tipiche;
  - materiali del lab con la lista dei prezzi;
  - ↗ con l'Abbofficina completa;
  - dime con Bolla | Modellino;
  - cantiere;
  - stampa del cartamodello;
  - salvataggio su file e ricerca.

Il progetto è in `docs/superpowers/specs/2026-11-11-prova-unita-design.md`, il piano in `docs/superpowers/plans/2026-11-11-prova-unita.md`. Le aggiunte nella pagina sono segnate `[Unita]`, quelle nell'Abbofficina `[Officina]` (e scritte in `configuratore/MODIFICHE.md`).

## Blocco 1 · Motore e niente conto delle persone

- **Motore:** `motore.js` è quello della semplice.
  - `buildShape` accetta `opt.size = { x, y, z }` e allunga o schiaccia la forma fino a quelle misure, con le facce piane. Mette `sc` nel risultato.
  - Le forme hanno il nome geometrico esatto: Icosaedro, Sfera geodetica, Esacisicosaedro, Esacisicosaedro suddiviso, Icosaedro troncato, Tronco di piramide, Toro.
  - Nella pagina cambiano anche i nomi semplici dell'estetica: «Cupola» → Icosaedro, «Pallone» → Icosaedro troncato, «Casetta» → Parallelepipedo, «Piramide senza punta» → Tronco di piramide, «Ciambella» → Toro, «Sfera di triangoli» → Esacisicosaedro.
  - L'elenco delle forme dell'Abbofficina (`FORME_OFF`) usa gli stessi nomi.
  - Le forme si salvano con il codice (`d20`, `calcio`…), quindi i progetti salvati si riaprono come prima.
- **Niente più conto delle persone.** Sono spariti:
  - «N persone» sopra il simulatore, nel verdetto (`.persone-n`) e nella barra in basso, che ora dice «Icosaedro · alta 3,03 m»;
  - «Falla per … persone · Adatta»;
  - la frase di Risolvi sulle persone;
  - la FAQ «Quante persone possono entrare?».

  Nel motore la frase del pavimento dice solo i m² («Pavimento di 3,2 m²: piccolo, ci si sta stretti» sotto i 4 m²). Nel glossario, «Pavimento» è «La parte che appoggia a terra». Resta «Tempo e persone» nei Materiali, perché parla di chi lavora.
- **La partenza:** una forma appena scelta parte con le misure di base del motore (per esempio l'icosaedro con il lato da 2,2 m, alto 3,03 m), non più «grande per 12 persone». Se non entra nell'area di lavoro si rimpicciolisce, come prima (`dimIniziali`).
- **`costruisci` non cambia:** allunga la forma di base già costruita fino a X, Y, Z. È lo stesso calcolo di `opt.size` del motore (la prova `stessa forma` lo controlla), ma più veloce per Risolvi, che prova molte misure.
- **Telefono:**
  - La pagina era più larga dello schermo, perché la colonna del simulatore cresceva con la nota sotto la scena. Ora la colonna resta larga quanto lo schermo, e la nota e la testata del simulatore vanno a capo.
  - Anche i nastri sugli angoli dei pannelli (`.nastrato::before`) uscivano dallo schermo: ora si tagliano sul bordo (`overflow-x: clip` su `html` e `body`, in `tema.css`).
  - Sul telefono, sopra il simulatore resta il verdetto e si nasconde l'altezza. Prima si nascondeva la seconda etichetta, che senza le persone sarebbe stata il verdetto.
- **Per le prove automatiche** la pagina espone `window.unita`, in sola lettura: `S`, `PR`, `cur`, `base`, `costruisci`, `optBase`, `dimIniziali`, `nomeForma`, `FAQ`.

## Blocco 2 · Misure: cursori con il motore e misure tipiche

- **I cursori:** restano X, Y, Z dell'estetica con «Mantieni le proporzioni». La forma che danno è la stessa del motore con `opt.size` (blocco 1), e la vetrina la riceve con le stesse misure.
- **Sotto i cursori, in «La forma»:**
  - le opzioni di prima: lati della base, punte, appoggio…;
  - **le misure tipiche della forma**, come nella semplice (`SEMPLICI`, `percDi(id, key)`): si scrivono in % di un'altra misura, così seguono la grandezza. Per esempio «Raggio interno (% delle punte)» della stella, o «Lunghezza del picciolo (% del corpo)» della banana. Il valore vero è la misura di riferimento × la % (`data-pk` sul campo).
- **In «Altre opzioni»** (`details.altreOpz`, con `#paramsTec`, chiuso all'inizio) vanno le misure tecniche: quelle segnate `tecnici` in `SEMPLICI` e i lati, spicchi, segmenti e facce del tubo (`dettaglio`).
- Le altre lunghezze della forma restano nascoste come prima, perché la grandezza la danno X, Y, Z.

## Blocco 3 · Materiali del lab e lista con i prezzi

- **Le scelte del lab sul foglio giallo dei Materiali** (`#scelteMat`), prima del resoconto, come nei «Materiali bolla vera» della semplice:
  - telo (PVC, Polietilene, TPU) e grammatura;
  - pezzi uniti con nastro adesivo, saldatura, zip o velcro;
  - per il nastro, la larghezza (48 mm all'inizio) e se va dentro e fuori o da un lato solo;
  - porte e collegamenti tra due bolle: **solo Zip e Velcro** (la zip impermeabile e quella stagna restano nell'Abbofficina).
- **Le scelte sono le stesse per tutte le bolle del progetto** (`PR.mat`): si salvano con il progetto e vanno al simulatore (`vetrina-materiali`). Un progetto vecchio con una zip impermeabile o stagna passa alla zip.
- **Il resoconto segue le scelte:** «Nastro adesivo da 48 mm» (il doppio se va dentro e fuori), oppure Saldatura, Zip o Velcro per le giunzioni; «Zip per la porta» o «Velcro per la porta»; il telo con il suo materiale e la grammatura. Il rotolo resta dove era, nella voce del telo.
- **Sotto, la lista materiali e prezzi** (`#rqLista`):
  - è la distinta del simulatore per tutte le bolle del progetto, con le stesse quantità e gli stessi prezzi, senza l'energia elettrica;
  - il totale è «Totale materiali»;
  - un prezzo scritto qui va al simulatore (`vetrina-prezzo`), che lo salva come i suoi;
  - senza simulatore (niente internet) la lista dice che arriva dal simulatore, e tutto il resto della pagina funziona;
  - sul telefono la tabella scorre dentro il suo riquadro.

## Blocco 4 · Simulatore: vetrina + ↗ con l'Abbofficina completa

- **Il pulsante ↗** (`#simGrande`), accanto a Simulatore e Schema, apre a tutto schermo l'Abbofficina completa (`configuratore/index.html?incorporata=1&grande=1`, iframe `#simTutta` dentro `#simTuttaBox`) sulla bolla scelta, con tutte le sue schede: Costruisci e Prova, Aria, Materiali, Dati.
  - L'iframe si crea alla prima apertura, e chiudendolo resta caricato.
  - Nel riquadro a destra resta la vetrina dell'estetica, con le bolle che si spostano, le aree e lo scenario.
- **La bolla:** arriva come «forma dell'Officina» (`{ tipo: 'forma', pacco }`, con la mesh alle misure vere). Nell'Abbofficina va nella composizione «Officina · Bolla N», sulla bolla legata. Se la bolla cambia nel sito mentre ↗ è aperto, o se si sceglie un'altra scheda, si manda di nuovo.
- **Quello che si cambia nell'Abbofficina torna nel sito:**
  - **l'ingrandimento della bolla** (`misure`, con `k`) cambia X, Y, Z della bolla che si era mandata, anche se intanto in alto se ne è scelta un'altra;
  - **i materiali** (`stato`) tornano nel foglio dei Materiali, tranne la zip impermeabile e quella stagna;
  - **i prezzi scritti là:** chiudendo ↗ la vetrina li rilegge (`vetrina-ricarica-prezzi`) e la lista del sito si aggiorna; riaprendo, è l'Abbofficina a rileggere quelli scritti nel sito (`ricarica-prezzi`).
- **Si torna** con «↙ Torna al sito» (in alto al centro, sul telefono in basso a destra), con Esc nella pagina o con Esc dentro l'Abbofficina (`esci`). Il fuoco torna su ↗.
- La vetrina non salva composizioni. Quella della pagina («Officina · …») la salva solo l'Abbofficina completa, una volta.

## Blocco 5 · Dime più complete

- **Le dime P1, P2… e il loro metodo restano.** Sopra le dime c'è una barra:
  - **Bolla | Modellino 1:20** (`#unitaDime`, `PR.unita`, si salva con il progetto): in Bolla le misure della bolla vera in cm, in Modellino quelle del modellino in scala (`misDima`). Valgono nel disegno, nella tabella dei lati, nella stampa e nel riquadro dello Schema;
  - **Apri tutte / Chiudi tutte**;
  - **Azzera le spunte**: dice quante ne ha tolte, e «↶ Annulla» le rimette.
- **Le dime si leggono meglio:**
  - sono in una colonna sola, larghe, con «Come tracciare una dima» sopra;
  - le scritte del disegno sono più grandi (altezze e AB 17, piedi 16, lettere 19, sullo schermo da 14 a 27 px), in grassetto e con il bordo chiaro dietro;
  - i piedi sono scuri, non più grigi;
  - la riga della misura AB si ferma prima della scritta (prima si leggeva «AB-220,0-cm»).
- **Ogni dima è una scheda che si apre e si chiude** (`details.dima`, chiusa all'inizio). Chiusa mostra la sagoma del pezzo (`sagomaSvg`), P e il numero, «× N» e le spunte fatte («✓ tracciata · ✓ 15 tagliate»). Le schede aperte restano aperte quando la pagina le ridisegna.
- **Toccare un pannello nello Schema** (come nella semplice):
  - **il primo tocco** apre un riquadro con il nome della dima, quante ne servono, il disegno con le lettere degli angoli e i lati (quelli uguali insieme: «Tutti i lati 220,0 cm»);
  - **il secondo tocco** sullo stesso pezzo, o «Vai alla dima ›», porta alla tappa Dima con quella scheda aperta;
  - il riquadro si chiude con ×, con Esc, toccando fuori o girando lo Schema;
  - lo Schema ricorda dove ha disegnato ogni faccia (`cv._facce`), così si sa quale si è toccata.

## Blocco 6 · Cantiere e stampa del cartamodello

- **La modalità cantiere** (`#site`, come nella semplice) si apre da «Modalità cantiere» nella tappa Dima (le dime) e nella Costruzione (le giunzioni). È a schermo intero, per il telefono mentre si lavora a terra.
  - **Le dime:** una alla volta, con il disegno grande, le misure (Bolla o Modellino, come nella pagina) e i lati.
  - **Le giunzioni:** una alla volta, con i due pezzi accostati lungo il lato rosso e la sua lunghezza.
  - «Fatta» (o il tasto F) mette la spunta e passa alla successiva. ‹ › e le frecce vanno avanti e indietro; Esc o «✕ Esci» chiudono e il fuoco torna sul pulsante. Il fuoco resta dentro mentre è aperta.
  - Le spunte sono le stesse della pagina, e lo Schema mostra subito le giunzioni fatte. Uscendo dal cantiere delle giunzioni, la pagina resta sulla giunzione a cui si era arrivati.
- **«Stampa il cartamodello»:** è il pulsante che prima si chiamava «Stampa il modellino». Stampava già solo i fogli dello sviluppo, quindi è cambiato solo il nome. Le schede delle dime si stampano con il loro pulsante.
- La frase sulla porta, alla fine del montaggio, dice «la zip» o «il velcro», secondo i materiali scelti (prima diceva «la cerniera»).
