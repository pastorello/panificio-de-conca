# Header

La testata non è fissa: scorre via per lasciare il telefono al contenuto, perché le due azioni che contano stanno nella CtaBar in basso. Due varianti: **mobile** (56 px, `header-mobile`) con logo, nome, bottone telefono e bottone «Menu» con etichetta visibile; **desktop** (72 px, `header-desktop`, da `bp-desktop`) con logo, nome, le sei voci di navigazione, il selettore lingua «IT · EN · DE» e il telefono con icona.

## Contenuto

- Il logo (32 px su mobile, 40 su desktop) e il nome «Panificio De Conca» in Fraunces sono un unico link alla home della lingua corrente. Finché il marchio scontornato non c'è, si usa il file del logo ritagliato in un quadrato.
- Il bottone telefono è 44 × 44 (`target`) con `aria-label="Chiama il 0771 460651"` e `href="tel:+390771460651"`.
- «Menu» è testo più icona `menu`, apre il NavSheet; senza JavaScript è un link a `#menu`, la navigazione ripetuta nel footer.
- Lo skip link «Vai al contenuto» è il primo elemento focusabile della pagina e appare solo al focus.
- Le voci: La storia · La tiella · Pane e prodotti · Ordini · Dove siamo · Contatti (la Home è il logo). La voce corrente ha `aria-current="page"`, grassetto e una sottolineatura `brand` da 2 px.

## Stati

Menu chiuso o aperto (l'apertura è il NavSheet); hover delle voci su `paper-deep`; focus con l'anello `focus`. Sfondo `paper`, bordo inferiore 1 px `line`.

## Cosa fornisce chi lo usa

La lingua corrente, la mappa degli slug tradotti per il selettore lingua (stessa pagina, mai la home) e il percorso della pagina corrente per `aria-current`.
