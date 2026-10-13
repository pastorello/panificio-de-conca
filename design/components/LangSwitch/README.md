# LangSwitch

Il selettore lingua è la riga «IT · EN · DE»: tre codici, niente bandiere, niente menu a tendina. Compare tre volte, con lo stesso markup: nell'header desktop (15 px), nel NavSheet (18 px, con l'etichetta «Lingua») e nel footer (15 px, con l'etichetta nella lingua della pagina: «Lingua», «Language», «Sprache»).

## Regole

- Ogni voce porta alla **stessa pagina** nell'altra lingua, mai alla home, usando la mappa degli slug tradotti.
- Ogni voce ha `lang` e `hreflang` del proprio codice; la lingua corrente ha `aria-current="page"`, grassetto e sottolineatura 2 px `ink`.
- Il `<nav>` ha `aria-label` nella lingua della pagina. Bersagli 44 × 44 (`target`) anche se i codici sono corti; i puntini separatori sono `aria-hidden`.

## Cosa fornisce chi lo usa

Il codice della lingua corrente e i tre URL della pagina corrente.
