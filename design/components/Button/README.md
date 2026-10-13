# Button

Il bottone porta al telefono o alle indicazioni: il primario al massimo una volta per vista, sempre per «Chiama e prenota». Tre forme: **primario** (riempito `brand`, testo `on-brand` 18 px grassetto), **secondario** (bordo 2 px `ink`, testo `ink`, sfondo trasparente) e **link con freccia** (`brand-deep` sottolineato, icona `arrow-right`), per i rimandi «Tutti i prodotti →», «Leggi la storia →», «Come prenotare →».

## Misure

- Altezza `control` 48 px, padding orizzontale 20 px, larghezza minima `target` 44 px, raggio `radius-md`.
- Icona Lucide 24 px a sinistra dell'etichetta, gap `space-2`. Nei bottoni della CtaBar mobile l'icona non c'è: a 390 px le due etichette con le icone non entrano.
- Etichetta su una riga sola (`white-space: nowrap`): se la stringa tedesca non entra, è il contenitore a cambiare, non il bottone che va a capo.

## Stati

- Primario: normale `brand` → hover `brand-deep` → attivo `brand-deep` con bordo `ink`.
- Secondario: normale trasparente → hover `paper-deep` → attivo `line`.
- Link: normale `brand-deep` → hover `ink` → attivo `brand`.
- Focus: anello `focus` da 3 px con offset 2 px, su tutte le forme. Solo transizioni di colore, 150 ms.

## Cosa fornisce chi lo usa

Un `<a href>` vero (`tel:+390771460651`, il link alle mappe, l'ancora della pagina): mai un `<div>` cliccabile, mai un `<button>` per navigare. Classi: `dc-btn dc-btn--primary`, `dc-btn dc-btn--secondary`, `dc-link`; `dc-btn--block` per la larghezza piena.

## Non fare

Niente ombre, niente bottoni a pillola, niente bottone «Ordina online», niente icona senza etichetta, niente testo a 18 px in `brand` su crema (passa solo a 24 px e oltre).
