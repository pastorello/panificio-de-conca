# NavSheet

Il foglio di navigazione mobile: un `<dialog>` modale che scende da destra a tutto schermo con le sette voci, il selettore lingua e il telefono. Si apre dal bottone «Menu» dell'header; si chiude con ✕, con Esc e con un tocco fuori; il focus resta intrappolato dentro finché è aperto.

## Contenuto

- Testa alta 56 px: «Panificio De Conca» e il bottone ✕ (`x`, 44 × 44, `aria-label="Chiudi il menu"`).
- Sette voci in Fraunces 28 px (`h2`), righe da 56 px, a tutta larghezza: Home · La storia · La tiella · Pane e prodotti · Ordini · Dove siamo · Contatti. La voce corrente ha `aria-current="page"` e un trattino `brand` di 16 × 4 px a sinistra.
- Piede con bordo superiore `line`: «Lingua IT · EN · DE» (LangSwitch nella variante foglio) e il telefono «0771 460651» con icona `phone`.

## Stati

Aperto o chiuso. Senza JavaScript il bottone «Menu» è un link a `#menu`, la navigazione ripetuta nel footer: il foglio non serve.

## Cosa fornisce chi lo usa

Le voci con gli slug della lingua corrente, la pagina corrente e i link del selettore lingua verso la stessa pagina nelle altre lingue. Nel sito il `<dialog>` è posizionato `fixed` a tutto schermo; nell'anteprima è statico.
