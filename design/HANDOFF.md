# Consegna del design — Panificio De Conca

Versione 1.0 · 13 ottobre 2026 · Da leggere dopo `BRIEF.md` (cosa dice il sito) e `DESIGN.md` (come appare). Questo file dice come usare i file della cartella `design/` e cosa i PNG non mostrano.

## 1. Sorgenti

| Materiale | Dove vive | Esportato in |
| --- | --- | --- |
| Design system (token, componenti, font, icone, logo) | [Design System "Panificio De Conca"](https://claude.ai/artifact/22CZGyjpAihmsETVJvHHoh) | `tokens.json`, `tokens.css`, `design-system.md`, `components/`, `fonts/`, `icons/`, `logo/` |
| Wireframe (bassa fedeltà) | [Design "Wireframe Panificio De Conca"](https://claude.ai/artifact/3nZD59mPw5Pv59c5TD24AB) | `wireframes/` (PNG e HTML) |
| Mockup (alta fedeltà) | [Design "Mockup Panificio De Conca"](https://claude.ai/artifact/GoyYUeeTEmasgLTGv6RR7R) | `mockups/` (PNG a 2×, HTML, foto) |

I PNG sono screenshot a scala 2 delle tavole; gli HTML in `mockups/html/` sono le tavole stesse, rese autonome: si aprono nel browser (anche con `npx serve design/mockups/html`) e sono la fonte più precisa per spaziature, colori e markup. Quando PNG e HTML sembrano differire, vale l'HTML.

## 2. Cosa c'è nella cartella

```
design/
├── HANDOFF.md                 ← questo file
├── tokens.json                ← i token del design system (fonte)
├── tokens.css                 ← gli stessi token come custom property, pronti per src/styles/tokens.css
├── design-system.md           ← README del design system: regole, tono, tipografia, stati
├── components/
│   ├── bundle.css             ← CSS di tutti i componenti, prefisso dc-, solo var(--…) di tokens.css
│   ├── preview.css            ← stile delle sole pagine di anteprima (non va nel sito)
│   └── <Nome>/README.md + preview.html   ← 17 componenti: cosa fornisce chi li usa, varianti, stati
├── fonts/                     ← Fraunces variabile (latin), con licenza SIL OFL
├── icons/                     ← 11 icone Lucide in SVG con il tratto in ink
├── logo/                      ← logo "Il Fornaio De Conca" (file Facebook, 953 px)
├── mockups/
│   ├── index.html             ← indice delle tavole
│   ├── manifest.json          ← tavola → html → png → dimensioni
│   ├── mobile/*.png           ← 9 pagine + Home e Ordini in tedesco, 390 px
│   ├── desktop/*.png          ← Home (varianti A e B), Prodotti, Storia, Tiella, Dove siamo, 1440 px
│   ├── states.png · og-template.png · icon-512.png
│   └── html/                  ← le tavole in HTML + assets/ (le foto usate nei mockup, con nomi parlanti)
├── wireframes/                ← stessa struttura dei mockup, in bassa fedeltà (riferimento, non vincolante)
└── foto-provvisorie/          ← l'archivio delle foto Facebook per tema (bassa risoluzione, da sostituire)
```

## 3. Tabella delle schermate

| Schermata | PNG | HTML | Larghezza × altezza | Componenti | Note |
| --- | --- | --- | --- | --- | --- |
| Home · mobile | `mockups/mobile/home.png` | `mobile-home.html` | 390 × 4440 | Header, Figure 3:2, OpenNow, ProductCard ×6, Figure d'epoca, OrderRule, VisitBlock, Footer, CtaBar | Foto sopra l'H1 solo qui; H1 in `brand` |
| La storia · mobile | `mobile/storia.png` | `mobile-storia.html` | 390 × 4832 | StoryTimeline ×7, Figure b/n ×4, SourcesBox, VisitBlock | Anni in Fraunces 28 px `brand-deep` |
| La tiella · mobile | `mobile/tiella.png` | `mobile-tiella.html` | 390 × 3800 | Figure 3:2, griglia 2 col., Callout, OrderRule, VisitBlock | Prezzi come segnaposto |
| Pane e prodotti · mobile | `mobile/prodotti.png` | `mobile-prodotti.html` | 390 × 6142 | Ancore di categoria, ProductCard ×18 (6 categorie), SeasonTag, OrderRule | Card text-only per Frittatine di patate, Maritozzi, Biscottoni e crostatine |
| Ordini e forniture · mobile | `mobile/ordini.png` | `mobile-ordini.html` | 390 × 3800 | Telefono grande (`number`), OrderRule con bottone, 6 sezioni H2 | Listino PDF come bottone secondario |
| Dove siamo · mobile | `mobile/dove-siamo.png` | `mobile-dove-siamo.html` | 390 × 3400 | Figure, Directions (indirizzo + MapLinks + 4 sezioni con icone), VisitBlock | Nessuna mappa incorporata |
| Contatti · mobile | `mobile/contatti.png` | `mobile-contatti.html` | 390 × 2700 | Telefono grande, OpenNow, HoursTable, MapLinks, social | Riga "oggi" evidenziata |
| Note legali · mobile | `mobile/note-legali.png` | `mobile-note-legali.html` | 390 × 2100 | Solo testo | Nessun VisitBlock |
| 404 · mobile | `mobile/404.png` | `mobile-404.html` | 390 × 1600 | Tre blocchi IT/EN/DE, telefono | Nessun VisitBlock |
| Start · Deutsch | `mobile/home-de.png` | `mobile-home-de.html` | 390 × 4755 | Come Home | Prova delle stringhe lunghe: nulla si tronca |
| Bestellen · Deutsch | `mobile/ordini-de.png` | `mobile-ordini-de.html` | 390 × 4300 | Come Ordini | Idem |
| Home · desktop A | `desktop/home-a.png` | `desktop-home-a.html` | 1440 × 3463 | Header desktop, hero a due colonne, card ×6 a 3 col., Footer a 3 col. | **Variante scelta** (§5) |
| Home · desktop B | `desktop/home-b.png` | `desktop-home-b.html` | 1440 × 3802 | Hero a tutta larghezza, max 55 vh | Alternativa, da riconsiderare con la foto vera della facciata |
| Pane e prodotti · desktop | `desktop/prodotti.png` | `desktop-prodotti.html` | 1440 × 5132 | Card a 4 colonne | |
| La storia · desktop | `desktop/storia.png` | `desktop-storia.html` | 1440 × 4685 | Colonna anni 160 px + testo 560 px | |
| La tiella · desktop | `desktop/tiella.png` | `desktop-tiella.html` | 1440 × 3619 | Colonna di testo 720 px | |
| Dove siamo · desktop | `desktop/dove-siamo.png` | `desktop-dove-siamo.html` | 1440 × 3361 | Colonna di testo 720 px | |
| Scheda degli stati | `states.png` | `states.html` | 1200 × 1701 | Button ×3 varianti × 4 stati, OpenNow ×5 stati, NavSheet aperto, HoursTable, SeasonTag ×4, ProductCard senza foto | |
| Open Graph | `og-template.png` | `og-template.html` | 1200 × 630 | Foto del banco + logo su campo paper in basso a destra | Da rifare con la foto vera; stessa composizione |
| Icona | `icon-512.png` | `icon-512.html` | 512 × 512 | Marchio (arco, spiga, pani) in ink su paper, margine 12 % | Marchio ricavato dal logo Facebook: provvisorio |

Le pagine desktop non disegnate (Ordini, Contatti, Note legali, 404) seguono il template "colonna di testo 720 px centrata" di `desktop-tiella.html`.

## 4. Comportamenti che i PNG non mostrano

- **CtaBar.** Nei mockup è `position: absolute; top: 760px` dentro una tavola alta quanto la pagina, per simulare la barra fissa al fondo di un viewport di 844 px. Nel sito è `position: fixed; bottom: 0` con `padding-bottom: env(safe-area-inset-bottom)`; il `body` ha `padding-bottom` pari a `--ctabar`; in stampa la barra è nascosta; da `--bp-desktop` in su sparisce e i due bottoni stanno nella riga CTA della hero e nel VisitBlock.
- **Header.** Non fisso. "Menu" apre il NavSheet (`<dialog>` modale: chiusura con ✕, Esc e tocco fuori, focus intrappolato); senza JavaScript il bottone è un link a `#menu`, cioè la navigazione ripetuta nel footer. Skip link "Vai al contenuto" come primo elemento focusabile.
- **OpenNow.** Cinque stati (scheda degli stati, riga 1–5). Il calcolo avviene lato client nel fuso `Europe/Rome` (`Intl.DateTimeFormat` con `timeZone`), legge `business.json` (orari settimanali e `special_hours`, che hanno la precedenza); senza JavaScript resta lo stato 5 (fasce della settimana, statico). `aria-live="polite"` solo al primo aggiornamento.
- **HoursTable.** La riga "oggi" è calcolata nello stesso fuso; senza JavaScript nessuna riga è evidenziata. Il blocco "Orari delle feste" compare sopra la tabella solo se ci sono `special_hours` in vigore o imminenti.
- **Bottone Indicazioni.** Un solo link, Google Maps universale (`https://www.google.com/maps/search/?api=1&query=…`); con JavaScript, su iOS e iPadOS l'`href` diventa `https://maps.apple.com/?q=…`. Nella pagina Dove siamo e in Contatti i due link restano entrambi visibili (MapLinks).
- **Selettore lingua.** Porta alla stessa pagina nell'altra lingua (mappa `routes.ts`), mai alla home; voce corrente con `aria-current` e sottolineata; ogni voce ha `lang` e `hreflang`.
- **Ancore di categoria in Prodotti.** Link a `#pane`, `#salato`… con `scroll-margin-top`; non sono tab.
- **Card prodotto.** Non sono link, tranne la Tiella (freccia "→" e `href` alla pagina dedicata). Nessun hover sulle card senza link.
- **Focus e hover.** Anello `--focus` 3 px con offset 2 px su ogni elemento interattivo; transizioni solo di colore ≤ 150 ms; `prefers-reduced-motion` rispettato. Gli stati sono nella scheda `states.html`, dove hover/focus/attivo sono mostrati con classi gemelle (`.is-hover`, `.is-focus`, `.is-active`): nel sito sono le pseudo-classi vere.
- **Segnaposti `[[...]]`.** Nei mockup sono in corsivo (`.pl`). Nel sito: in fase di anteprima (`SITE_PHASE=preview`) vanno resi come `<mark class="todo">[[CIVICO]]</mark>` — sfondo `paper-deep`, corsivo, nessun colore in più — così il titolare vede cosa manca; in fase live (`SITE_PHASE=live`) un segnaposto residuo in `dist/` fa fallire la build (`DESIGN.md` §9.3).
- **Foto d'epoca.** Già in bianco e nero nei file; nessun `filter` CSS.
- **Prima foto della pagina** con `fetchpriority="high"`, le altre `loading="lazy"`.

## 5. Differenze volute tra mockup e sito

| Nei mockup | Nel sito | Perché |
| --- | --- | --- |
| Link tra tavole (`mobile-storia.html`…) | Rotte di `routes.ts` nelle tre lingue | I mockup sono file statici |
| Hero desktop in due varianti | **Variante A** (due colonne, foto 4:3) | Tiene l'H1 sopra la piega a 1440 × 900 e regge una foto a bassa risoluzione; la B si riconsidera quando esiste la foto vera della facciata (brief §9, n. 1) |
| Foto Facebook ritagliate a mano (`mockups/html/assets/`) | Le stesse foto da `src/assets/photos/`, con gli stessi nomi, finché non arrivano gli scatti del brief §9 | Sostituire un file con lo stesso nome basta a cambiare la foto ovunque |
| CtaBar assoluta a 760 px | Fissa in basso | Vedi §4 |
| Stati con classi gemelle | Pseudo-classi | Vedi §4 |
| Segnaposti in corsivo | `<mark class="todo">` in anteprima, errore di build in live | Vedi §4 |
| Icona dal marchio ricavato dal logo Facebook | Icona dal file originale della tipografia, quando arriva | Risoluzione |
| OG con la foto del banco di Facebook | OG con la foto vera del banco, stessa composizione | Risoluzione |
| Classi `dc-*` di `bundle.css` | Stesse classi, senza prefisso o con, a scelta di chi costruisce; stessi nomi dei token | `bundle.css` è già scritto sui token: si può riprendere quasi alla lettera in `src/styles/components.css` e far emettere ai componenti Astro lo stesso markup di `components/<Nome>/preview.html` |

Decisioni confermate durante la build (13 ottobre 2026):

| Nei mockup o nel design | Nel sito | Perché |
| --- | --- | --- |
| Riga della CtaBar e della riga CTA «Prenota il giorno prima e dicci a che ora passi», assente dal brief (che ha `cta.rule`, «Ordini entro le {time} per domani») | La riga dei mockup, chiave `cta.day_before`: tedesco dalla scheda CtaBar, inglese proposto; `cta.rule` resta nei contenuti ma la barra non la usa | Scelta confermata: la frase chiede anche l'ora del ritiro |
| Testi d'interfaccia solo in italiano o assenti: skip link, «Menu», «Chiudi il menu», etichette dei menu e del telefono, riga di anteprima del footer, «P.IVA»/«REA», meta di Note legali e 404 | In `src/content/site/*.json` (`ui.*`, `meta.legal`, `meta.notFound`), inglese e tedesco proposti | Da far rileggere a madrelingua con gli altri testi (brief §8) |
| `--font-display` senza «Fraunces Fallback», definito ma non usato | `src/styles/tokens.css` lo inserisce prima di Georgia | Limita il salto dei titoli mentre Fraunces si carica |
| Header desktop su una riga (solo in italiano) | In tedesco a 1440 la navigazione va su due righe e l'header passa da 72 a 92 px | Come lo schema di `DESIGN.md` §5.1; nessuna etichetta accorciata |
| Paragrafo «Prenota oggi, ritira domani» della Home con un testo diverso dal brief | Testo del brief §8.3 | Per i contenuti vale il brief |
| OpenNow senza JavaScript: «giovedì pomeriggio 17:00–20:00» | «giovedì 7:30–13:15 e 17:00–20:00», generato da `business.json` | «pomeriggio» non ha traduzione nel brief |

Decisioni confermate durante la build (14 ottobre 2026, componenti):

| Nei mockup o nel design | Nel sito | Perché |
| --- | --- | --- |
| OpenNow nel periodo delle feste: «Aperto oggi …» con il chip «Orari delle feste» | Finché gli orari delle feste non sono confermati (`pending` in `business.json`): il chip e il segnaposto, senza «Aperto oggi» | «Aperto oggi» non sarebbe verificato |
| Fasce orarie spezzate a metà quando vanno a capo («16:30–» / «20:00») | Si va a capo solo tra una fascia e l'altra («7:30–13:15 ·» / «16:30–20:00») | Una fascia spezzata si legge male |
| Scheda SeasonTag: il chip sta su una riga | Nelle card il chip va a capo se non entra | «KARNEVAL UND JOSEFSTAG» a 390 px veniva tagliato |
| Timeline desktop: «Dopoguerra» esce dalla colonna degli anni e copre il punto rosso | «Dopoguerra» va su due righe dentro la colonna | Nessun testo sopra il punto |
| Contatti: riquadro delle feste con la frase del mockup («Luminarie, dal 9 novembre all'11 gennaio: aperture straordinarie nei weekend …») | «9 novembre – 11 gennaio: [[…]]», costruito da `business.json` | Date e fasce vengono dai dati; la frase del mockup non è nel brief |
| Scheda ProductCard: nella card della tiella è link solo «La tiella →» | Tutta la card è un link, come nel mockup | Bersaglio più grande; la freccia resta |
| Scheda MapLinks: «Google Maps» e «Apple Maps» non si traducono | «Apple Karten» in tedesco | Per i contenuti vale il brief §8.8 |
| Frasi degli stati di OpenNow e HoursTable solo in italiano nella scheda degli stati | `hours.closed_now`, `hours.next_today`, `hours.next_tomorrow`, `hours.next_day`, `hours.closed`, `hours.today`, `hours.table_caption` in `src/content/site/*.json`; inglese e tedesco proposti | Da far rileggere a madrelingua con gli altri testi (brief §8) |

Decisioni confermate durante la build (14 ottobre 2026, pagine):

| Nei mockup o nel design | Nel sito | Perché |
| --- | --- | --- |
| Tiella: riquadro finale «Prenota il giorno prima e dicci a che ora passi», assente dal brief | Il riquadro del mockup: titolo `cta.day_before`, testo = seconda frase di «Quando la trovi» con il telefono; inglese e tedesco proposti | C'è nel mockup e in DESIGN.md §5.4; la regola della prenotazione resta in ogni pagina |
| Prodotti e Ordini: riquadro «Il fresco si prenota il giorno prima» con un testo del mockup («si preparano la notte prima… meglio due») | Testo del brief §8.7; Prodotti lo legge da `src/content/pages/<lingua>/orders.json` | Per i contenuti vale il brief; un solo testo da mantenere |
| Prodotti: righe di «Calzoncini e rustici» e «Focaccine» diverse dal brief | Righe del brief §8.6 | Per i contenuti vale il brief |
| Contatti senza «Vieni a trovarci» (mockup, DESIGN.md §5.8, §3 qui sopra), contro DESIGN.md §6.5 | Senza il blocco | La pagina è già orari e indirizzo; «Orari completi» porterebbe alla pagina stessa |
| Contatti: riga «Orari [[da confermare]]; estivi e invernali possono cambiare.» | Assente | Non è nel brief |
| Note legali: informativa in tre frasi | Le parole del brief §8.10 | Per i contenuti vale il brief |
| Bottone di chiamata: [Chiama], [Call us], [Anrufen] nel brief di Home e Ordini | `cta.call` («Chiama e prenota»), come la CtaBar e i mockup; in Tiella «Chiama per prenotare» (brief e mockup) | Una sola etichetta per la stessa azione |
| Storia: foto dell'insegna «Fornaio F.lli De Conca» sotto il 1958 (DESIGN.md §5.6, mockup) | Sotto il 1965 | Nel 1958 l'insegna era «Il Fornaio di De Conca Almerindo e figli»; i «fratelli» sono del 1965 |
| Voci del brief «nome — riga» (card della Home, schede prodotto, ripieni della tiella) | Nome e riga separati, riga con la maiuscola iniziale, come nei mockup | Struttura della ProductCard |
| §3 qui sopra: card dei maritozzi senza foto | Segnaposto della foto 13, come nel mockup | La foto è nella lista del brief §9 |
| Brief §10: prezzi indicativi da raccogliere (pizzetta, pane al chilo, ciambelline, tozzetti, cornetto) | Nessun prezzo né segnaposto nelle card finché non arrivano; il campo `price` c'è | Il brief §8.6 non li mette nelle schede; DESIGN.md §6.5: prezzo solo se nel contenuto |
| Testi assenti dal brief | Alt e didascalie di tutte le foto (l'italiano dai mockup); nomi dei prodotti e titoli delle categorie in inglese e tedesco, «Categorie»; H1 di Prodotti in inglese e tedesco dai meta title; titoli delle sezioni di Contatti in inglese e tedesco, «Come arrivare», «E-mail»; «Fonti»; link della 404 (dal mockup); etichette dei dati societari, «Informativa privacy» e Note legali intere in inglese e tedesco | Proposti e accettati; da far rileggere a madrelingua (brief §8 e §2.3). Ogni file di contenuto li elenca nel campo `_review` |

Decisioni confermate durante la build (14 ottobre 2026, verifica):

| Nei mockup o nel brief | Nel sito | Perché |
| --- | --- | --- |
| Riquadri delle foto mancanti «Foto 5 — …» senza parentesi; didascalia della foto 1 in Dove siamo in tondo | «[[Foto 5 — …]]» con `<mark>`, in corsivo | Sono segnaposti: una build live non può pubblicarli (`Figure.astro`) |
| Footer: «[[Instagram, quando creato]]» | «[[URL Instagram quando creato]]», uguale nelle tre lingue | Valore di `business.json`, dal `sameAs` del brief §6 |
| Footer tedesco: «04024 Gaeta (LT), Italien» | Senza «Italien», come in italiano e inglese | L'indirizzo del footer viene da `business.json`, uguale nelle tre lingue |
| Anfahrt: «10 km» | Può andare a capo tra numero e unità («10 / km.») | Testo del brief invariato |
| Segnaposti su fondo `paper-deep` (card, riquadri, footer) | Il `<mark>` non si distingue dal fondo, resta il corsivo | È un segnaposto, sparisce con il dato vero |
| `nav.home` tedesco «Start» (brief §8.1) | «Startseite» | Lighthouse considera «Start» un testo di link generico: SEO 89 sulle pagine tedesche |
| Composti tedeschi spezzati dalla sillabazione automatica nei titoli e nelle etichette («Uferpro-menade», «Promena-de», «Kastenku-chen», «VORBESTEL-LUNG») | Trattini morbidi (U+00AD, `­`) ai giunti nei file di contenuto («Ufer-promenade»); i titoli e le etichette tedesche vanno a capo solo lì; nel testo corrente sillabazione automatica con almeno 3 lettere per parte | Nessuna parola cambia; `npm run test:e2e` elenca le parole spezzate e fallisce se qualcosa sborda |
| OpenNow: stato del mockup già al primo disegno | Con JavaScript la riga statica della settimana viene sostituita dopo il primo disegno: piccolo spostamento (CLS 0,006–0,057) | Sotto la soglia di 0,1; nessun punto perso in Lighthouse |

## 6. Foto usate nei mockup

Tutte in `mockups/html/assets/`, bassa risoluzione (800 × 600 le card, 780 × 520 e 960 × 720 le hero, 900 × 600 le foto d'epoca). Nome → soggetto → numero nella lista foto del brief §9:

| File | Soggetto | Brief §9 | Dove |
| --- | --- | --- | --- |
| `banco-hero-mobile-3x2.jpg` | Il banco con pizzette, focacce e la bilancia | 3 (provvisoria per la 1, facciata) | Hero mobile, Dove siamo |
| `banco-hero-desktop-4x3.jpg` | Idem, ritaglio 4:3 | 3 | Hero desktop A |
| `banco-hero-desktop-largo.jpg` | Idem, ritaglio largo | 3 | Hero desktop B |
| `pane-di-giornata.jpg` | Pagnotte e filoni | 8 | Home, Prodotti |
| `tiella-card.jpg` | Tielle sul vassoio | 4 | Home, Prodotti |
| `tielle-intere.jpg` | Tielle intere appena sfornate | 4 | Tiella |
| `pizzette-rosse.jpg` | Pizzette rosse e focaccine | 7 | Home, Prodotti |
| `ciambelline-al-vino.jpg` | Ciambelline al vino | 10 | Home, Prodotti |
| `cornetti.jpg` | Cornetti e focacce nel banco del mattino | 12 | Home, Prodotti |
| `dolci-di-natale.jpg` | Cesti di dolci di Natale confezionati | 16 | Home |
| `pane-tagliato.jpg` | Un pane tagliato a metà | 9 (provvisoria) | Prodotti |
| `taralli.jpg` | Taralli sulla teglia | — | Prodotti (card Freselle e taralli) |
| `panino-napoletano.jpg` | Panino con salumi e formaggio | — | Prodotti |
| `calzoncino-scarola.jpg` | Calzoncino con scarola e olive | — | Prodotti |
| `focaccine.jpg` | Focaccine sul vassoio | — | Prodotti |
| `tozzetti.jpg` | Tozzetti alle mandorle | 11 | Prodotti |
| `torta.jpg` | Torta con zucchero a velo | — | Prodotti |
| `zeppole.jpg` | Zeppole con crema e amarena | 18 | Prodotti |
| `pigna-di-pasqua.jpg` | Pigna di Pasqua glassata | 17 | Prodotti |
| `mostaccioli.jpg` | Mostaccioli al cioccolato | 16 | Prodotti |
| `epoca-fornai-in-laboratorio-bn.jpg` | I fornai al lavoro, b/n | 21 | Home, Storia |
| `epoca-manifesto-tre-ritratti-bn.jpg` | Manifesto con tre ritratti, b/n | 21 | Storia |
| `epoca-insegna-fornaio-flli-de-conca-bn.jpg` | Insegna "Fornaio F.lli De Conca", b/n | 2 | Storia |
| `famiglia-dietro-il-banco.jpg` | La famiglia dietro il banco | 20 | Storia |
| `logo-192.jpg`, `logo-512.jpg` | Logo | — | Header, Footer, OG |
| `marchio-arco-spiga-pani.png` | Il marchio scontornato (721 × 389) | — | Icona |
| `banco-og-1200x630.jpg` | Composizione OG già pronta | — | Open Graph |

Le foto che il brief chiede e che ancora non esistono (facciata di mattina, tiella a fette con il polpo, tiella con la cipolla, pane senza lievito, maritozzi, forno acceso, laboratorio all'alba, vetrina con gli orari, pergamena, ritaglio del Messaggero, lungomare con la base) restano rettangoli `paper-deep` con il numero della lista, come nei mockup. L'archivio completo di Facebook è in `foto-provvisorie/`, diviso per tema, per chi vuole scegliere un'immagine diversa.

## 7. Come usare questi file in Claude Code

1. `tokens.css` → `src/styles/tokens.css` così com'è (correggere solo il percorso del font). Nessun colore, dimensione o spaziatura fuori da quel file.
2. `components/bundle.css` → `src/styles/components.css`, riletto componente per componente mentre si scrivono i file `.astro`; `components/<Nome>/preview.html` è il markup di riferimento di ogni componente con le sue varianti; `components/<Nome>/README.md` dice quali dati riceve.
3. `fonts/fraunces-latin-full-normal.woff2` → `public/fonts/` (o `src/assets/fonts/`): 120 KB, sopra l'obiettivo degli 80 KB del piano; se Lighthouse lo segnala, ridurlo ai soli pesi 600–700 con un sottoinsieme statico.
4. `icons/*.svg` → incollati inline nei componenti con `stroke="currentColor"`.
5. `mockups/html/assets/*` → `src/assets/photos/` con gli stessi nomi; `foto-provvisorie/` resta in `design/` e non entra nel build.
6. Per ogni pagina: screenshot Playwright a 390 × 844 e a 1440 × 900 (pagina intera) da confrontare con `mockups/mobile/*.png` e `mockups/desktop/*.png`; le differenze non elencate in §5 si correggono prima di passare alla pagina successiva.
