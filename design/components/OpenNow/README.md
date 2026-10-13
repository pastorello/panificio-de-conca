# OpenNow

Una riga che dice se il negozio è aperto adesso, calcolata sul posto nel fuso `Europe/Rome` così chi guarda dalla Germania vede lo stato vero: icona `clock` 24 px in `ink` e testo `body` 18 px, con la prima parte in grassetto. Nessun colore semantico, nessun punto verde o rosso: le parole bastano e si leggono anche in bianco e nero.

## I cinque stati

1. **Aperto oggi** 7:30–13:15 e 16:30–20:00 (`hours.open_today` con le fasce del giorno).
2. **Chiuso ora** · riapre oggi alle 16:30 (tra le due fasce).
3. **Oggi chiuso** · riapre domani alle 7:30 (`hours.closed_today`; la domenica e dopo la chiusura serale).
4. **Orari speciali in vigore**: chip «Orari delle feste» (`hours.special`) davanti al testo, quando `special_hours` è attivo; gli orari speciali hanno la precedenza sugli ordinari.
5. **Senza JavaScript**: le fasce della settimana, statiche, già nell'HTML («Lunedì–sabato 7:30–13:15 e 16:30–20:00, giovedì pomeriggio 17:00–20:00 · Domenica chiuso»).

## Regole

- Compare sopra la piega in Home, Contatti e Dove siamo, e nel VisitBlock di ogni pagina.
- `aria-live="polite"` solo al primo render; nessun aggiornamento animato.
- Orari in formato 24 h con il trattino corto; le stringhe vengono da `site/*.json` (`hours.*`), gli orari da `business.json`.

## Cosa fornisce chi lo usa

Gli orari settimanali, gli orari speciali con le date e le stringhe della lingua; il calcolo usa `Intl.DateTimeFormat` con `timeZone: "Europe/Rome"`.
