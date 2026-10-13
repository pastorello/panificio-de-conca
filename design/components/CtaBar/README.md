# CtaBar

La barra delle due azioni che il sito esiste per far compiere: «Chiama e prenota» (primario, `tel:+390771460651`) e «Indicazioni» (secondario, link alle mappe), con sopra la riga della regola «Prenota il giorno prima e dicci a che ora passi». Su mobile è **fissa in basso** (`position: fixed`, 84 px `ctabar` più `env(safe-area-inset-bottom)`); su desktop non esiste: gli stessi due bottoni e la riga, qui sotto i bottoni, formano la **riga CTA** sotto il sottotitolo e nel VisitBlock.

## Misure

- Mobile: padding 6 px sopra, 8 sotto, gutter 20 ai lati; microcopy `micro` 13 px in `ink-soft` centrata; gap `space-1`; bottoni alti 48. I due bottoni dividono la larghezza con proporzione 3:2 ma senza larghezze fisse: ogni etichetta, anche «Anrufen und bestellen», resta su una riga.
- Nella barra i bottoni sono solo testo: a 390 px le due etichette con le icone non entrano. Le icone `phone` e `map-pin` tornano nella riga CTA desktop.
- Sfondo `paper`, bordo superiore 1 px `line`. In stampa la barra è nascosta.

## Comportamento

- Il `body` ha un `padding-bottom` pari all'altezza della barra, così footer e ultimo blocco restano leggibili.
- «Indicazioni» è un solo link Google Maps universale; con JavaScript, su iOS e iPadOS l'`href` diventa Apple Maps (vedi MapLinks).
- Presente su ogni pagina, Note legali e 404 comprese.

## Cosa fornisce chi lo usa

Le tre stringhe nella lingua della pagina (`cta.call`, `cta.directions`, `cta.rule`) e l'URL delle mappe.
