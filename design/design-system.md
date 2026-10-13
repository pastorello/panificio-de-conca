Il sistema del sito vetrina del Panificio De Conca, un forno di Gaeta che fa il pane nello stesso locale dal 4 aprile 1922. Il tono è quello di **un forno di paese con cento anni di storia**: caldo e concreto, senza aggettivi vuoti. Non è una pasticceria di lusso, non è un'app. Tre lingue (italiano, inglese, tedesco), mobile first, nessun e-commerce: ogni pagina esiste per far squillare il telefono il giorno prima.

## Le tre regole fisse

1. **Un solo accento.** Il rosso del logo, `brand`, è l'unico colore oltre ai bruni e alle carte. Si usa per riempire il bottone primario, per i punti della timeline e per l'H1 della Home. Niente verde, niente grigio freddo, niente secondo accento.
2. **Niente gradienti, niente ombre.** La profondità la danno i bordi (`line`, 1 px) e i due toni di carta (`paper`, `paper-deep`). Nessun `box-shadow`, nessun `linear-gradient`, nessun vetro, nessun angolo oltre i 4 px.
3. **Il testo non sta mai sopra le foto.** Le foto restano intere, senza veli e senza testo sovrapposto; il testo sta sotto o accanto, su carta. Così il contrasto è sempre garantito.

E la **regola dei tre secondi**: chi arriva da Google deve capire subito cosa vende il negozio, se è aperto e dove si trova. Sopra la piega mobile (`fold`, 660 px) stanno H1, sottotitolo, lo stato `OpenNow` dove previsto e la `CtaBar` con *Chiama e prenota* e *Indicazioni*.

## Tono e contenuti

- Frasi corte, fatti, nessun superlativo senza fonte: «il più antico della provincia» esiste solo con il link al Messaggero. Mai «senza glutine», mai prezzi inventati.
- Usa solo i testi del brief, nelle tre lingue, copiati alla lettera; ciò che manca è un segnaposto `[[COSÌ]]`, in corsivo nei mockup, mai un testo di riempimento.
- Dai del tu in italiano («Prenota il giorno prima e dicci a che ora passi»), registro neutro in inglese, «Sie» in tedesco. Il tedesco è più lungo del 20–30 %: ogni componente regge «Anrufen und bestellen» e «Feiertagsöffnungszeiten» senza troncare; `hyphens: auto` con il `lang` corretto.
- Orari sempre in formato 24 h, con il trattino corto: «7:30–13:15 e 16:30–20:00». Domenica: «Domenica chiuso».
- Telefono scritto «0771 460651» in italiano e «+39 0771 460651» in inglese e tedesco, sempre con `href="tel:+390771460651"`.
- Prezzi solo se presenti nel contenuto, preceduti da «da» e nel formato della lingua («1,20 €» IT e DE, «€1.20» EN).
- Nessuna emoji, nessun punto esclamativo, nessuna maiuscola a scopo enfatico. I nomi dei prodotti in minuscolo dentro la frase («la tiella di Gaeta»), con l'iniziale maiuscola solo come titolo di card.
- Lo stato aperto/chiuso lo dicono le parole, non i colori: «Aperto oggi», «Chiuso ora · riapre oggi alle 16:30», «Oggi chiuso · riapre domani alle 7:30».

## Colori

Un tema solo, chiaro (`color-scheme: light`): le foto di pane su fondo nero perdono.

- Sfondo di pagina `paper`; card, note, footer, riga «oggi» e sezioni alternate `paper-deep`; bordi `line` a 1 px.
- Testo e titoli `ink`; didascalie, footer, microcopy e chip `ink-soft`. Entrambi passano AAA su `paper` e almeno AA su `paper-deep`.
- Accento `brand` solo come riempimento (bottone primario, punti della timeline) o come testo grande (H1 della Home, ≥ 24 px). Per link e testo rosso a 18 px usa `brand-deep`, sempre con sottolineatura: il colore da solo non basta.
- Sopra un riempimento `brand` o `brand-deep` il testo è `on-brand` (bianco), a 18 px grassetto. `on-brand` non è mai uno sfondo.
- Focus: anello `focus` da 3 px (`focus-ring`) con offset 2 px, su bottoni, link, voci del menu, selettore lingua. È uguale a `ink`, quindi si vede sia sul crema sia sul rosso.

## Tipografia

- Titoli in **Fraunces** (`display`), font variabile self-hosted dal file in `fonts/`, assi `opsz` automatico e `SOFT` a 50 (`font-variation-settings: "SOFT" 50`) per avvicinarsi alle lettere morbide del logo senza imitarle. Pesi 700 per gli H1, 600 per H2 e H3.
- Testo nel font di sistema (`text`): non costa nulla e non si carica da terze parti.
- Scala: `h1` 36 px mobile e `h1-desktop` 56 px; `h2` 28 e `h2-desktop` 36; `h3` 22 e `h3-desktop` 24; `body` 18 px / 1,55 ovunque; `small` 15 px per didascalie e footer; `micro` 13 px solo per la riga della CtaBar; `chip` 13 px maiuscolo per i SeasonTag; `number` 36 px per il telefono grande e gli anni, con cifre tabulari.
- Misura del testo corrente 60–65 caratteri (`max-width: 65ch`). Un solo H1 per pagina.
- Carica Fraunces con `font-display: swap` e un fallback con `size-adjust` per limitare il salto di layout.

## Spaziature, raggi, bordi

- Base 4 px: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 24 · `space-6` 32 · `space-7` 48 · `space-8` 64 · `space-9` 96. Tra le sezioni `space-7` su mobile e `space-9` su desktop.
- Raggi: `radius-md` 4 px su bottoni e card, `radius-sm` 2 px sui chip, `radius-none` sulle foto a tutta larghezza.
- Bordi: `border-hairline` 1 px `line` su card e tabelle; `border-rule` 2 px per il bottone secondario (`ink`) e la linea della timeline (`line`); `border-mark` 4 px `brand` sul fianco sinistro di `OrderRule`.
- Nessuna ombra, nessun gradiente, nessuna sfocatura.

## Layout e breakpoint

- Mobile sotto i 600 px: una colonna, card a 2 colonne, gutter `gutter-mobile` 20 px; si disegna a 390 × 844 e si verifica a 360 × 640.
- Tablet da `bp-tablet` (600 px): contenuto a `measure` 720 px, card a 3 colonne, gutter `gutter-tablet` 32 px.
- Desktop da `bp-desktop` (1024 px): contenitore `container` 1120 px (12 colonne da 75 px, gutter 20), card a 4 colonne, colonna di testo `measure` 720 px centrata; si disegna a 1440 × 900.
- Template unico: Header · [foto, solo in Home] · H1 · sottotitolo · [OpenNow] · riga CTA (desktop) · sezioni H2 · VisitBlock · Footer, più la CtaBar fissa su mobile. L'header non è fisso: scorre via per lasciare spazio al contenuto.
- Bersagli di tocco ≥ `target` 44 × 44 px con 8 px tra bersagli adiacenti; bottoni alti `control` 48 px; le due azioni principali stanno nella CtaBar in basso, mai nell'angolo in alto a sinistra.

## Fotografia

- Solo foto vere del negozio, orizzontali, in luce naturale, senza filtri: la facciata di mattina, il banco pieno, la tiella intera, il forno acceso. Mai immagini d'archivio.
- Rapporti fissi: 3:2 per hero e timeline, 4:3 per le card prodotto. Nessun ritaglio diverso nella stessa pagina.
- Le foto d'epoca sono convertite in bianco e nero nei file, non con un filtro CSS, e portano sempre didascalia e anno: sono la prova della storia.
- Dove la foto manca, un rettangolo `paper-deep` con il numero della lista foto del brief («Foto 4 — tiella intera»), mai un'illustrazione.
- La prima foto della pagina ha `fetchpriority="high"`; le altre `loading="lazy"`. Home sotto i 600 KB, foto comprese.

## Iconografia

- Undici icone [Lucide](https://lucide.dev/) (licenza ISC) a 24 px con tratto 1,75 px, come SVG inline in `ink`, mai come font: `phone`, `map-pin`, `clock`, `arrow-right`, `menu`, `x`, `languages` per l'interfaccia; `car`, `train-front`, `footprints`, `sailboat` per la pagina Dove siamo.
- Ogni icona ha un'etichetta testuale accanto o un `aria-label`; nessuna informazione passa solo per l'icona. Le icone decorative hanno `aria-hidden="true"`.
- I file in `assets/Icone/` hanno il tratto già in `ink` perché un `<img>` non eredita il colore; nel codice del sito incolla l'SVG inline con `stroke="currentColor"`.
- Nessuna emoji, nessuna bandiera per le lingue: il selettore è «IT · EN · DE».

## Stati, focus e movimento

- Bottone primario: `brand` → hover `brand-deep` → attivo `brand-deep` con bordo `ink`. Secondario: bordo 2 px `ink` su trasparente → hover `paper-deep` → attivo `line`. Link con freccia: `brand-deep` sottolineato → hover `ink`.
- La voce corrente del menu ha `aria-current="page"` e un trattino `brand` a sinistra; la lingua corrente è sottolineata e in grassetto.
- Solo transizioni di colore ≤ 150 ms; nessuna animazione d'ingresso, nessun carosello, nessun parallasse; `prefers-reduced-motion` rispettato.

## Componenti

Tutti i componenti sono HTML e CSS senza JavaScript obbligatorio: lo stile sta in `components/bundle.css`, con prefisso `dc-` e solo variabili di `tokens.css` (`var(--brand)`, `var(--space-4)`, `var(--font-display)`…). Ogni anteprima in `components/<Nome>/preview.html` mostra le varianti e gli stati; il README di ogni componente dice cosa fornisce chi lo usa.

- Azioni: `Button`, `CtaBar`, `MapLinks`.
- Navigazione: `Header`, `NavSheet`, `LangSwitch`, `Footer`.
- Orari e visita: `OpenNow`, `HoursTable`, `VisitBlock`, `OrderRule`.
- Contenuti: `ProductCard`, `SeasonTag`, `StoryTimeline`, `Figure`, `SourcesBox`, `Callout`.

Nel sito i token si scrivono una volta sola in `src/styles/tokens.css` con gli stessi nomi; nessun colore, dimensione o spaziatura fuori da quel file.

## Risorse

- Logo «Il Fornaio De Conca» in `assets/Logo/` (file Facebook a 953 px; il marchio scontornato per favicon e icona è da ricavare dal file originale della tipografia).
- Foto di riferimento in `assets/Foto/`: banco, pane di giornata, insegna storica in bianco e nero. Sono le foto di Facebook a bassa risoluzione, buone per i mockup, da sostituire con gli scatti della lista del brief.
- Fraunces: [Google Fonts](https://fonts.google.com/specimen/Fraunces) · [sorgente](https://github.com/undercasetype/Fraunces) (SIL OFL) · [Fontsource](https://fontsource.org/fonts/fraunces) per il file self-hosted.
- Contrasti verificati con [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) secondo [WCAG 2.1](https://www.w3.org/TR/WCAG21/) AA; bersagli secondo [WCAG 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html).
