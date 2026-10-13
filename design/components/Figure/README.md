# Figure

Una foto con la sua didascalia: `<figure>` con l'immagine a tutta larghezza del contenitore, rapporto fisso e `figcaption` a 15 px in `ink-soft`. Le foto sono il contenuto principale del sito e non portano mai testo sopra: la didascalia sta sotto, su carta.

## Varianti

- **3:2** (`dc-figure--3x2`): hero della Home su mobile, foto della facciata in Dove siamo, foto della timeline.
- **4:3** (`dc-figure--4x3`): card prodotto, foto a destra nella hero desktop.
- **4:5** (`dc-figure--4x5`): riservato; non usarlo sopra la piega perché spinge l'H1 sotto i 660 px.
- **D'epoca** (`dc-figure--vintage`): file convertito in bianco e nero, mai `filter: grayscale()`; la didascalia dice soggetto e anno («L'insegna «Fornaio F.lli De Conca» sul lungomare, [[ANNO]]»).
- **Segnaposto** (`dc-figure__placeholder`): rettangolo `paper-deep` con bordo `line` e il numero della lista foto del brief, finché lo scatto non c'è.

## Regole

- Angoli vivi (`radius-none`), nessuna cornice, nessun filtro, nessun velo.
- `object-fit: cover` con il soggetto al centro; `width` e `height` sempre dichiarati per evitare salti di layout.
- La prima foto della pagina ha `fetchpriority="high"`; le altre `loading="lazy"`.
- Alt scritto nella lingua della pagina nei file di contenuto; mai testo importante dentro l'immagine.

## Cosa fornisce chi lo usa

Il file (WebP/AVIF via `astro:assets` con `srcset`), l'alt, la didascalia e il rapporto.
