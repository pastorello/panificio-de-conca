# MapLinks

I link alle mappe, sempre bottoni secondari con l'icona `map-pin`, mai una mappa incorporata (un iframe imposterebbe cookie). Due varianti: **due bottoni** nelle pagine Dove siamo e Contatti («Google Maps», «Apple Maps»); **un solo bottone** «Indicazioni» nella CtaBar e nella riga CTA.

## Regola del bottone unico

L'`href` è il link Google Maps universale, che funziona ovunque anche senza app; con JavaScript, su iOS e iPadOS l'`href` viene sostituito con il link Apple Maps (`data-apple-href`), l'app predefinita su iPhone. Niente foglio di scelta, niente `geo:` (non funziona su iOS).

## URL

- Google: `https://www.google.com/maps/search/?api=1&query=41.2132,13.5778&query_place_id=[[PLACE_ID]]`; in attesa del Place ID, `?api=1&query=Panificio+De+Conca+Gaeta`.
- Apple: `https://maps.apple.com/?q=Panificio+De+Conca&ll=41.2132,13.5778`.
- Coordinate `[[da verificare sul posto: 41.2132, 13.5778]]`.

## Cosa fornisce chi lo usa

Coordinate, Place ID e le etichette nella lingua della pagina (`cta.directions`); i nomi «Google Maps» e «Apple Maps» non si traducono.
