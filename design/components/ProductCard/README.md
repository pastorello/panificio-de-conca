# ProductCard

La scheda di un prodotto del banco: foto 4:3, nome in Fraunces 22 px (`h3`), una riga di testo a 15 px e, solo se il contenuto lo ha, il prezzo «da …» in grassetto. Le card non sono link e non contengono bottoni: non esistono pagine prodotto, si compra al banco. L'unica eccezione è la **Tiella di Gaeta**, che rimanda alla sua pagina e lo mostra con il link «La tiella →».

## Varianti

- **Con foto**: `<img>` 4:3 con `object-fit: cover`, `loading="lazy"`, alt scritto nella lingua della pagina.
- **Senza foto**: solo il corpo; freselle, maritozzi e altri prodotti senza scatto restano nella stessa famiglia visiva.
- **Con chip**: un `SeasonTag` sotto la riga («Solo a Natale», «Su prenotazione»).
- **Con link**: classe `dc-card--link`; al passaggio il bordo diventa `ink` e il nome `brand-deep`. Hover solo su questa variante.
- Senza la foto definitiva: un segnaposto `paper` con il numero della lista foto del brief («Foto 4 — tiella intera, 4:3»).

## Aspetto e griglia

Sfondo `paper-deep`, bordo 1 px `line`, raggio `radius-md`, padding del corpo 12/16 px. Griglia `dc-grid`: 2 colonne sotto i 600 px, 3 su tablet, 4 su desktop, gap `space-4`. In Home sei card, nella pagina Prodotti raggruppate nelle sei categorie del brief.

## Cosa fornisce chi lo usa

Nome, riga, categoria, eventuale `season` e `price` dalle content collections (`products/{it,en,de}/*.md`); il prezzo nel formato della lingua («1,20 €» IT e DE, «€1.20» EN) via `Intl.NumberFormat`.
