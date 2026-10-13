# StoryTimeline

La timeline della pagina La storia: un `<ol>` di `TimelineItem`, ciascuno con l'anno (o «Dopoguerra», «Oggi») in Fraunces 28 px `brand-deep`, il testo e, dove c'è, una `Figure` d'epoca in bianco e nero con didascalia. La linea verticale è 2 px `line`; ogni voce ha un punto pieno di 12 px in `brand`: è una delle poche apparizioni del rosso fuori dai bottoni, quindi niente altro rosso nella pagina oltre ai link.

## Varianti

- **TimelineItem con foto** e **senza foto**: la figura sta sotto il testo, nella colonna del testo.
- **Mobile**: linea a 24 px dal bordo (`space-5`), testo rientrato di 48 px (`space-7`), 48 px tra le voci.
- **Desktop** (`dc-timeline--desktop`, da `bp-desktop`): colonna degli anni a sinistra da 160 px allineata a destra, testo e foto a destra in 560 px; la linea sta tra le due colonne.

## Regole

- Le date e i testi sono quelli del brief §8.4, letterali, con i segnaposti `[[...]]` dove la conferma manca.
- Le foto d'epoca sono convertite in bianco e nero nei file, non con un filtro; la didascalia dice soggetto e anno.
- Sotto la timeline va il `SourcesBox` con le due fonti.

## Cosa fornisce chi lo usa

La lista delle voci da `story/{it,en,de}.md`: etichetta dell'anno, testo, eventuale foto con alt e didascalia.
