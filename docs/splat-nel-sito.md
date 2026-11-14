# Uno splat nel simulatore: come funziona e come cambiarlo

Lo scenario «Corridoio dell'Accademia (splat)» mette le bolle dentro una scansione 3D (uno splat) invece che dentro la foto 360°. Questa pagina spiega come è fatto e come aggiungere o cambiare uno splat.

## Cambiare o aggiungere uno splat

Servono: lo splat (`splat.ply`, da Spirula con `splat-lab` di `lab-tools`), `python3` e `splat-transform` (vedi sotto). Tutto il resto è in questo repo.

1. **Misura in Spirula.** Con «scala per distanza» su due punti a distanza nota (per esempio i quadrati del pavimento) lo splat esce in metri, con il pavimento a z=0. Senza questo, la pianta e le bolle non hanno la scala giusta.
2. **Ricava la pianta:**

```bash
python3 -I strumenti/splat-pianta.py splat.ply
```

Stampa il pavimento e l'altezza dei controlli, una mappa dall'alto, le pareti dritte, i corridoi, il contorno, l'eventuale buco (il cortile di un chiostro), la riga di conversione e la voce per `STANZE`. Con `--origine X,Z` scegli tu il punto da mettere nell'origine (dove partono le bolle). Funziona per stanze, corridoi e chiostri ad angoli retti; per altre forme si legge la mappa e si scrive il poligono a mano.

3. **Converti** con la riga che stampa lo strumento (di `lab-tools`, oppure `splat-transform` direttamente):

```bash
splat-lab sog splat.ply -o configuratore/stanze/NOME.sog -r 90,0,0 -t -X,0,Z
```

`-r 90,0,0` porta l'alto da z a y. Con `-t`, l'asse x è specchiato (per +10 m in x si scrive `-t -10,0,0`); le azioni vanno dopo il file di ingresso. SOG **v2**, non v3: in Spark il v3 ha bordi striati.

4. **Controlla.** Apri `prova-splat.html?file=stanze/NOME.sog` (serve un server dalla radice del repo: `python3 -m http.server 8000`): la griglia verde da 2,95 m deve coincidere con i giunti del pavimento, il pavimento essere piatto e il soffitto in alto. Poi rilancia `splat-pianta.py` sul `.ply` riconvertito dal `.sog` (`splat-transform NOME.sog PROVA.ply`): le pareti devono stare dove scritto nella voce.
5. **Aggiungi la voce** in `STANZE` (`configuratore/index.html`): `id`, `nome`, `splat` (il file), `mini` (una miniatura), `vista` (dove sta la camera quando si sceglie), `par` con `pianta`, `buchi` (se c'è un cortile) e `H`. Poi la voce `<option>` nel menu Scenario di `index.html` (la radice) e, se vuoi che si salvi, la riga che accetta il valore.
6. **Ricarica con Ctrl+Shift+R**: il browser tiene in cache il `.sog` vecchio.

## Come funziona

- Il simulatore usa three.js r128; Spark vuole un three.js recente. Le due versioni non si mescolano, quindi lo splat ha un suo canvas **dietro** quello del simulatore (`configuratore/splat-stanza.js`), con una camera che a ogni fotogramma copia quella del simulatore, compreso `setViewOffset`. Il canvas del simulatore ha `alpha: true` e lo sfondo nullo quando c'è lo splat.
- Il modulo si carica con `import()` solo se si sceglie lo scenario. La importmap (`three`, `three/addons/`, Spark) si scrive al primo uso, con le versioni in `SPLAT_LIB` (`configuratore/index.html`). Senza `three/addons/` Spark non parte.
- Serve un server HTTP: i moduli ES non si leggono da `file://`.
- **Pianta:** `pianta` è il contorno della stanza e `buchi` i suoi anelli interni, dove le bolle non possono stare (`pareteStanza`, `dentroStanza`, `nelMuro`). La forma della stanza viene sempre dallo scenario, non dalla composizione salvata.
- **Pareti viste da dietro** (come il backface culling della foto): `splatMuri()` calcola le pareti; `splat-stanza.js` rende trasparente, con una scatola `SplatEditSdf BOX` per parete, la parete se la camera è fuori dalla stanza, dal suo lato esterno, e senza altre pareti in mezzo. Spark valuta le forme in coordinate del mondo e, tra più forme, sceglie la più vicina: le scatole spente vanno lontanissimo. Il riquadro «Si vedono solo le facce interne» lo accende e spegne.
- Guardando da sopra (camera sopra `H` + 1,8 m) si toglie anche la volta.

## Limiti

- Lo splat non copre le bolle: le due scene non condividono la profondità, quindi un pilastro dello splat non nasconde una bolla che gli sta davanti.
- Il metodo di `splat-pianta.py` cerca pareti parallele agli assi.
- Il Firefox senza finestra non ha WebGL: la verifica a occhio va fatta in un browser vero.
- Un file `.sog` pesa decine di MB (43 MB il chiostro): è il costo di caricamento quando si sceglie lo scenario.

## Installare splat-transform

```bash
sudo apt install nodejs npm
npm install -g --prefix ~/.local @playcanvas/splat-transform
```

La seconda riga non richiede `sudo`; `~/.local/bin` deve essere nel `PATH`.
