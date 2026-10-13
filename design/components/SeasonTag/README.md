# SeasonTag

Il chip che dice quando un prodotto esiste o come si ottiene: «Solo a Natale», «Solo a Pasqua», «Carnevale e San Giuseppe», «Su prenotazione» (`season.*` in `site/*.json`). Testo `chip` 13 px maiuscolo con spaziatura .04em in `ink-soft`, bordo 1 px `line`, raggio `radius-sm` 2 px, sfondo `paper`, padding 2 px sopra e sotto e `space-2` ai lati. Nessun colore pieno, nessun colore per stagione: un solo accento nel sistema, e non è questo.

## Dove

Sotto la riga di una ProductCard (`dc-card__meta`); davanti allo stato OpenNow quando valgono gli orari speciali («Orari delle feste»); come etichetta di un Callout.

## Regole

- Mai più di un chip per card; mai un chip cliccabile.
- Sta su una riga (`white-space: nowrap`): le stringhe tedesche più lunghe («Karneval und Josefstag») entrano in una card a 2 colonne a 390 px.
- Nessuna emoji, nessuna icona dentro il chip.
