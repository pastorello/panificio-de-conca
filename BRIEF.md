# Brief per Claude Code — Sito vetrina "Panificio De Conca" (Gaeta)

Versione 1.0 · 30 settembre 2026 · Da usare come `BRIEF.md` nella root del repository, accanto a `CLAUDE.md`.

---

## 0. In una frase

Un sito statico di sette pagine (più note legali e 404) in italiano, inglese e tedesco per un panificio di Gaeta fondato nel 1922, che deve comparire quando qualcuno cerca "tiella di Gaeta", "bakery Gaeta" o "Bäckerei Gaeta" e portare la persona a telefonare o a entrare in negozio. Niente e-commerce, niente moduli, niente cookie, niente CMS.

## 1. Contesto

- **Attività**: Panificio De Conca (marchio "Il Fornaio De Conca dal 1922"), ragione sociale De Conca Alessandro e C. S.n.c., P.IVA 01960040598, REA LT-135120.
- **Indirizzo**: Lungomare Giovanni Caboto `[[CIVICO: probabilmente 640 (logo, PagineBianche, Virgilio); Google dice 632; da confermare]]`, 04024 Gaeta (LT), angolo Salita Porta di Terra, quartiere medievale, di fronte alla base della Marina USA.
- **Telefono**: +39 0771 460651 (fisso; è l'unico canale di ordine e deve restare tale).
- **Orari** `[[da confermare]]`: lun–sab 7:30–13:15 e 16:30–20:00 (giovedì pomeriggio 17:00–20:00); domenica chiuso; aperture straordinarie nei weekend delle luminarie (date diverse ogni anno, nell'edizione 2026-27 dal 9 novembre all'11 gennaio: vanno in `special_hours`) e nelle feste.
- **Storia**: fondato il 4 aprile 1922 da Almerindo De Conca, tornato dall'America, con la moglie Annunziata Di Schino; dal 1958 "Il Fornaio di De Conca Almerindo e figli" (Anna, Aida, Antonio, Alfonso); dal 1965 i "fratelli De Conca" Antonio e Alfonso; dal 2005 Alessandro, figlio di Alfonso. Il forno ha lavorato senza interruzioni tranne la breve pausa della guerra; nell'immediato dopoguerra offriva il pane anche a chi ne aveva bisogno, tra cui gli sfollati della caserma Cosenz. Centenario nel 2022 con pergamena del Comune di Gaeta, il cui testo ricorda che nel 1922 "gas e corrente elettrica dovevano ancora arrivare nelle nostre case e al forno si producevano pane e dolci con la legna"; Il Messaggero lo ha definito "il più antico della provincia" (fonti: [Il Messaggero, 5 giugno 2022](https://www.ilmessaggero.it/pay/gaeta_compie_un_secolo_il_panificio_de_conca_e_il_piu_antico_della_provincia-6733111.html), per abbonati; [Lazio Sette, 12 giugno 2022](https://www.arcidiocesigaeta.it/wp-content/uploads/sites/6/2022/06/13/Diocesane_Lazio7_Gaeta_20220612_E01.pdf)). La Sciusciata di Capodanno, la questua in costume della notte del 31 dicembre, parte ogni anno dal forno secondo i post dei gruppi di sciusciatori `[[da confermare con il titolare]]`.
- **Prodotti**: pane di giornata (pane senza lievito un giorno a settimana `[[GIORNO]]`), tiella di Gaeta (polpo, cipolla e altri ripieni), pizzette rosse, panini napoletani, calzoncini, frittatine di patate, focaccine, tozzi e tozzetti alle mandorle, freselle, taralli, ciambelline al vino, cornetti e colazione, maritozzi su prenotazione, torte, dolci delle feste (zeppole a Carnevale e San Giuseppe, pigna e casatiello a Pasqua, sciuscelle e mostaccioli a Natale).
- **Il fresco a sfornata e la regola delle prenotazioni**: calzoncini, frittatine di patate, focaccine, tielle e pizzette si producono in quantità decisa la mattina e o finiscono in pochi minuti o restano invenduti. Il negozio vuole che i clienti prenotino per telefono entro `[[ORA_LIMITE, es. le 19]]` per il giorno dopo, così da produrre su ordini. Il sito esiste soprattutto per questo: ogni pagina spinge a prenotare il giorno prima; biscotti, taralli e freselle invece durano e non hanno bisogno di prenotazione.
- **Pagamenti**: contanti, carte, contactless.
- **Chi gestisce il sito**: uno sviluppatore per conto del titolare; il titolare non usa computer. Ogni scelta tecnica deve ridurre la manutenzione a quattro aggiornamenti l'anno.
- **Piano di marketing completo**: documento "Panificio De Conca — Piano di visibilità e vendite" nel Progetto Claude (sezioni 4 e 5 riguardano il sito).

## 2. Vincoli non negoziabili

1. **Zero raccolta dati**: nessun modulo, nessun cookie, nessun font o script caricato da terze parti che tracci. Statistiche solo con Cloudflare Web Analytics (beacon senza cookie). Così non serve il cookie banner.
2. **Nessun ordine online**: ogni invito all'azione porta al telefono (`tel:+390771460651`) o alle indicazioni stradali, e chiede di prenotare entro l'ora limite del giorno prima.
3. **Tre lingue vere**: i testi in inglese e tedesco sono in questo brief, scritti da persona; non usare traduzione automatica per riempire buchi. Se una traduzione manca, la pagina in quella lingua non si pubblica.
4. **Verità verificabile**: solo fatti presenti in questo brief. Mai "il più antico" senza la fonte; mai "senza glutine"; mai prezzi inventati (i prezzi arrivano dai segnaposti).
5. **Mobile first**: il 70% delle visite arriverà da telefoni di turisti in strada. Ogni pagina deve essere leggibile a una mano, con Chiama e Indicazioni sempre raggiungibili.
6. **Prestazioni**: Lighthouse mobile ≥ 95 su tutte le voci, LCP < 1,5 s su 4G, peso totale della home < 600 KB immagini comprese.
7. **Accessibilità**: WCAG 2.1 AA (contrasto, focus visibile, alt su ogni foto, navigazione da tastiera, `lang` corretto per pagina).
8. **Nessun CMS, nessun database**: i contenuti vivono in file Markdown/JSON nel repository.

## 3. Stack

- **Astro 5** (output statico), TypeScript, **i18n nativo** di Astro (`defaultLocale: 'it'`, `locales: ['it','en','de']`, `routing.prefixDefaultLocale: false`), `site` letto da `SITE_URL`, `trailingSlash: 'always'`.
- **Slug tradotti**: Astro non li gestisce da solo; una mappa `routes.ts` (`{ story: { it: 'storia', en: 'our-story', de: 'geschichte' }, … }`) alimenta menu, selettore lingua, hreflang e sitemap.
- **Sitemap**: `@astrojs/sitemap` **senza** l'opzione `i18n` (raggruppa le alternate solo per path identico e con gli slug tradotti collegherebbe solo Home e Tiella); le alternate le porta l'HTML con i `<link hreflang>`. Se si vuole anche nella sitemap, usare `serialize(item)` per impostare `item.links` dalla mappa `routes.ts`.
- **CSS**: Tailwind 4 oppure CSS puro con custom properties; nessun framework di componenti pesante. Font di sistema o un solo font variabile self-hosted (nessuna chiamata a Google Fonts).
- **Immagini**: `astro:assets` con generazione WebP/AVIF e `srcset`; originali in `src/assets/photos/`.
- **Contenuti**: content collections tipizzate in `src/content/`:
  - `products/{it,en,de}/*.md` (una scheda per prodotto, con `category`, `season`, `price`, `order_notice`)
  - `story/{it,en,de}.md` (timeline)
  - `site/{it,en,de}.json` (stringhe di interfaccia, meta title/description per pagina)
  - `business.json` (dati unici: indirizzo, telefono, coordinate, orari, orari speciali, social)
- **Hosting**: Cloudflare Pages via integrazione Git (branch `main` = produzione, altri branch = anteprime). DNS su Cloudflare. Dominio `panificiodeconca.it` (principale), `panificiodeconca.com` e `ilfornaiodeconca.it` in redirect 301.
- **Qualità**: ESLint + Prettier, `astro check`, test Lighthouse CI in GitHub Actions su ogni PR (soglia 95), test automatico che ogni pagina abbia hreflang reciproco e JSON-LD valido (uno script Node che legge `dist/`).

## 4. Mappa del sito e URL

| Pagina | IT | EN | DE |
| --- | --- | --- | --- |
| Home | `/` | `/en/` | `/de/` |
| La storia | `/storia/` | `/en/our-story/` | `/de/geschichte/` |
| La tiella di Gaeta | `/tiella-di-gaeta/` | `/en/tiella-di-gaeta/` | `/de/tiella-di-gaeta/` |
| Pane e prodotti | `/prodotti/` | `/en/bread-and-pastries/` | `/de/brot-und-gebaeck/` |
| Ordini e forniture | `/ordini/` | `/en/orders/` | `/de/bestellen/` |
| Dove siamo | `/dove-siamo/` | `/en/find-us/` | `/de/anfahrt/` |
| Contatti | `/contatti/` | `/en/contact/` | `/de/kontakt/` |
| Note legali e privacy | `/note-legali/` | `/en/legal/` | `/de/impressum/` |
| 404 | `/404` (trilingue, con link alle tre home) | | |

Regole:
- Ogni pagina ha `<link rel="alternate" hreflang="it|en|de">` verso le tre versioni **e** verso se stessa, più `hreflang="x-default"` che punta alla versione **inglese** (chi non è italiano né tedesco legge l'inglese).
- `canonical` = URL della pagina stessa, assoluto, con slash finale.
- Il selettore lingua in testata porta alla **stessa pagina** nell'altra lingua, mai alla home.
- Nessun redirect automatico in base alla lingua del browser: chi arriva su `/` resta su `/`.
- URL della versione tedesca senza umlaut (`gebaeck`, non `gebäck`).

## 5. Direzione di design

- **Tono**: un forno di paese con cento anni di storia, non una pasticceria di lusso. Caldo, concreto, senza aggettivi vuoti. Il lettore deve capire in tre secondi cosa vende, quando è aperto, dove si trova.
- **Colori**: rosso mattone del logo esistente (`[[campionare dal file Immagini/Logo]]`), crema/carta da pane per gli sfondi, marrone crosta per il testo. Un solo accento. Nessun gradiente, nessuna ombra "da app".
- **Tipografia**: un serif con carattere per i titoli (es. Fraunces o Source Serif, self-hosted) e un sans di sistema per il testo. Titoli grandi, testo 18 px su mobile.
- **Fotografia**: solo foto vere del negozio (lista in §9). Mai immagini d'archivio. Le foto sono il contenuto principale: la home apre con una foto a tutta larghezza del banco o del forno, non con un'illustrazione.
- **Foto d'epoca**: in bianco e nero, con didascalia e anno; sono la prova della storia.
- **Componenti** (tutti in `src/components/`):
  - `Header`: logo (porta alla home), menu a 6 voci, selettore lingua (IT · EN · DE), telefono cliccabile.
  - `CtaBar`: barra fissa in basso su mobile con due pulsanti, "Chiama e prenota" e "Indicazioni"; su desktop diventa una riga nella hero. Sotto il pulsante, in piccolo, la regola: "ordini entro le `[[ORA_LIMITE]]` per domani".
  - `OpenNow`: legge `business.json` e mostra "Aperto oggi 7:30–13:15 e 16:30–20:00" oppure "Oggi chiuso, riapre domani alle 7:30"; gli orari speciali hanno la precedenza. Calcolo lato client **sempre nel fuso `Europe/Rome`** (`Intl.DateTimeFormat` con `timeZone`), così un turista che guarda da casa vede lo stato reale del negozio; fallback statico senza JS (orari della settimana).
  - `ProductCard`: foto, nome, una riga, prezzo indicativo se presente, etichetta di stagione ("solo a Natale").
  - `StoryTimeline`: date a sinistra, testo a destra, foto d'epoca intervallate.
  - `Directions`: foto della facciata, indirizzo, due link (Google Maps, Apple Maps) e quattro paragrafi "da dove arrivi" (auto, treno, a piedi, barca). Nessun iframe di mappe (imposterebbe cookie).
  - `Footer`: ragione sociale, indirizzo, P.IVA, REA, telefono, link social, link alle note legali, selettore lingua ripetuto.
- **Link mappe** (coordinate `[[da verificare: 41.2132, 13.5778]]`):
  - Google: `https://www.google.com/maps/search/?api=1&query=41.2132,13.5778&query_place_id=[[PLACE_ID della scheda Google]]` (in attesa del Place ID: `?api=1&query=Panificio+De+Conca+Gaeta`)
  - Apple: `https://maps.apple.com/?q=Panificio+De+Conca&ll=41.2132,13.5778`

## 6. SEO tecnica

- `<title>` e `<meta name="description">` per pagina e lingua: testi in §8 (blocco "Meta").
- Open Graph e Twitter card con immagine 1200×630 per lingua (foto del banco con il logo in un angolo).
- **JSON-LD `Bakery`** nelle tre home e nelle tre pagine "Dove siamo", generato da `business.json`; le immagini citate stanno in `public/img/` con nome fisso (i file di `astro:assets` finiscono hashati in `/_astro/`):

```json
{
  "@context": "https://schema.org",
  "@type": "Bakery",
  "@id": "https://panificiodeconca.it/#bakery",
  "name": "Panificio De Conca",
  "alternateName": "Il Fornaio De Conca",
  "description": "Panificio artigianale a Gaeta dal 1922: pane, tiella di Gaeta, pizzette e dolci delle feste sul Lungomare Caboto.",
  "url": "https://panificiodeconca.it/",
  "telephone": "+390771460651",
  "priceRange": "€",
  "foundingDate": "1922-04-04",
  "image": ["https://panificiodeconca.it/img/facciata.jpg", "https://panificiodeconca.it/img/banco.jpg"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Lungomare Giovanni Caboto [[CIVICO]]",
    "addressLocality": "Gaeta",
    "addressRegion": "LT",
    "postalCode": "04024",
    "addressCountry": "IT"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 41.2132, "longitude": 13.5778 },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday","Saturday"], "opens": "07:30", "closes": "13:15" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday","Saturday"], "opens": "16:30", "closes": "20:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "07:30", "closes": "13:15" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "17:00", "closes": "20:00" }
  ],
  "paymentAccepted": "Cash, Credit Card, Debit Card, Contactless",
  "currenciesAccepted": "EUR",
  "sameAs": [
    "https://www.facebook.com/panificio.deconca/",
    "[[URL Instagram quando creato]]",
    "[[URL scheda Google Maps]]",
    "[[URL TripAdvisor]]"
  ]
}
```

  Regole: nessun `aggregateRating` (le recensioni non possono essere auto-dichiarate), nessun `menu`, nessun campo di cui non si abbia il dato. Validare con il Rich Results Test prima della pubblicazione.
- `sitemap-index.xml` con le tre lingue; `robots.txt` che consente tutto e indica la sitemap.
- Pagina 404 trilingue con link e telefono.
- `<html lang>` corretto per pagina; `dir="ltr"`.
- Testo alternativo di ogni foto scritto in ogni lingua (nei file di contenuto, non hardcoded).
- Nessun testo importante dentro le immagini.

## 7. Struttura dei contenuti (per ogni pagina)

Ogni pagina ha, in quest'ordine: H1 · sottotitolo di una riga · CTA (Chiama/Indicazioni) · sezioni con H2 · blocco finale "Vieni a trovarci" con orari e indirizzo. Massimo 400 parole per pagina, tranne Storia e Tiella (fino a 700).

## 8. Copy completo

I segnaposti `[[...]]` vanno compilati con i dati del titolare prima della pubblicazione (elenco in §10). Il tono è lo stesso in tutte le lingue: frasi corte, fatti, nessun superlativo non documentato. I testi tedeschi sono scritti in registro formale ("Sie"); i testi inglesi in registro neutro. Prima della pubblicazione far rileggere tedesco e inglese a una persona madrelingua: le correzioni si fanno nei file di contenuto.

### 8.1 Stringhe di interfaccia (`site/*.json`)

| Chiave | IT | EN | DE |
| --- | --- | --- | --- |
| nav.home | Home | Home | Start |
| nav.story | La storia | Our story | Geschichte |
| nav.tiella | La tiella | The tiella | Die Tiella |
| nav.products | Pane e prodotti | Bread & pastries | Brot & Gebäck |
| nav.orders | Ordini | Orders | Bestellen |
| nav.findus | Dove siamo | Find us | Anfahrt |
| nav.contact | Contatti | Contact | Kontakt |
| cta.call | Chiama e prenota | Call to order | Anrufen und bestellen |
| cta.rule | Ordini entro le {time} per domani | Order by {time} for tomorrow | Bestellungen bis {time} Uhr für morgen |
| cta.sold_out | Il fresco finisce presto: prenotalo | Fresh items sell out fast: order ahead | Frisches ist schnell weg: bitte vorbestellen |
| cta.directions | Indicazioni | Directions | Route |
| hours.open_today | Aperto oggi {ranges} | Open today {ranges} | Heute geöffnet {ranges} |
| hours.closed_today | Oggi chiuso · riapre {next} | Closed today · opens {next} | Heute geschlossen · öffnet {next} |
| hours.closed_sunday | Domenica chiuso | Closed on Sundays | Sonntags geschlossen |
| hours.special | Orari delle feste | Holiday hours | Feiertagsöffnungszeiten |
| visit.title | Vieni a trovarci | Come and see us | Besuchen Sie uns |
| footer.legal | Note legali e privacy | Legal & privacy | Impressum & Datenschutz |
| footer.since | Panificio a Gaeta dal 1922 | Bakery in Gaeta since 1922 | Bäckerei in Gaeta seit 1922 |
| lang.switch | Lingua | Language | Sprache |
| season.christmas | Solo a Natale | Christmas only | Nur zu Weihnachten |
| season.easter | Solo a Pasqua | Easter only | Nur zu Ostern |
| season.carnival | Carnevale e San Giuseppe | Carnival and St Joseph's Day | Karneval und Josefstag |
| season.order | Su prenotazione | Made to order | Auf Vorbestellung |
| price.from | da | from | ab |

### 8.2 Meta title e description

| Pagina | IT | EN | DE |
| --- | --- | --- | --- |
| Home | **Panificio De Conca – Forno a Gaeta dal 1922, sul lungomare** / Pane, tiella di Gaeta, pizzette e dolci delle feste. Tre generazioni nello stesso forno sul Lungomare Caboto, di fronte al mare. Orari e telefono. | **Panificio De Conca – Bakery in Gaeta since 1922** / Bread, tiella di Gaeta, pizzette and holiday sweets from a family bakery on the Gaeta seafront, three generations in the same shop. Hours and phone. | **Panificio De Conca – Bäckerei in Gaeta seit 1922** / Brot, Tiella di Gaeta, Pizzette und Festtagsgebäck aus einer Familienbäckerei an der Uferpromenade von Gaeta, drei Generationen im selben Laden. Öffnungszeiten und Telefon. |
| Storia | **La storia del Panificio De Conca, Gaeta 1922** / Dal ritorno dall'America di Almerindo De Conca al centenario del 2022: cento anni di pane nello stesso locale del quartiere medievale. | **Our story: a Gaeta bakery since 1922** / From Almerindo De Conca's return from America to the 2022 centenary: a hundred years of bread in the same shop in Gaeta's medieval quarter. | **Unsere Geschichte: Bäckerei in Gaeta seit 1922** / Von Almerindo De Concas Rückkehr aus Amerika bis zum 100-jährigen Jubiläum 2022: hundert Jahre Brot im selben Laden in der Altstadt von Gaeta. |
| Tiella | **Tiella di Gaeta: dove comprarla e cos'è – Panificio De Conca** / La tiella di Gaeta secondo un forno del 1922: polpo, cipolla e gli altri ripieni, quando la trovi, quanto costa, come portarla via. | **Tiella di Gaeta: what it is and where to buy it** / Gaeta's stuffed pie from a bakery founded in 1922: octopus, onion and the other fillings, when to find it, prices and how to take it away. | **Tiella di Gaeta: was das ist und wo man sie bekommt** / Die gefüllte Teigspezialität aus Gaeta von einer Bäckerei aus dem Jahr 1922: Oktopus, Zwiebel und andere Füllungen, wann es sie gibt, Preise und Mitnahme. |
| Prodotti | **Pane, pizzette e dolci – Panificio De Conca Gaeta** / Pane di giornata, pane senza lievito, pizzette rosse, ciambelline al vino, tozzetti, cornetti e i dolci delle feste di Gaeta. | **Bread, pizzette and pastries – Panificio De Conca** / Fresh bread daily, yeast-free bread, red pizzette, wine ring biscuits, almond tozzetti, croissants and Gaeta's holiday sweets. | **Brot, Pizzette und Gebäck – Panificio De Conca** / Frisches Brot vom Tag, hefefreies Brot, rote Pizzette, Weinkringel, Mandel-Tozzetti, Croissants und das Festtagsgebäck aus Gaeta. |
| Ordini | **Ordini per telefono e forniture – Panificio De Conca** / Tielle intere, torte, maritozzi e cesti si ordinano per telefono. Forniture per bar, ristoranti, B&B, hotel e barche. | **Orders by phone and wholesale – Panificio De Conca** / Whole tielle, cakes, maritozzi and gift baskets are ordered by phone. Supplies for bars, restaurants, B&Bs, hotels and boats. | **Bestellungen per Telefon und Lieferungen – Panificio De Conca** / Ganze Tielle, Torten, Maritozzi und Geschenkkörbe bestellen Sie telefonisch. Belieferung von Bars, Restaurants, B&Bs, Hotels und Booten. |
| Dove siamo | **Dove siamo: Lungomare Caboto, Gaeta – Panificio De Conca** / Nel quartiere medievale, di fronte alla base, con parcheggio sul lungomare. Come arrivare da Formia, da Roma e da Napoli. | **Find us: Lungomare Caboto, Gaeta** / In the medieval quarter, opposite the naval base, with parking on the seafront. How to get here from Formia station, Rome and Naples. | **Anfahrt: Lungomare Caboto, Gaeta** / In der Altstadt, gegenüber dem Marinestützpunkt, mit Parkplätzen an der Promenade. Anreise vom Bahnhof Formia, aus Rom und Neapel. |
| Contatti | **Contatti – Panificio De Conca, Gaeta** / Telefono, orari e indirizzo del Panificio De Conca, Lungomare Caboto, Gaeta. | **Contact – Panificio De Conca, Gaeta** / Phone, opening hours and address of Panificio De Conca, Lungomare Caboto, Gaeta. | **Kontakt – Panificio De Conca, Gaeta** / Telefon, Öffnungszeiten und Adresse der Bäckerei Panificio De Conca, Lungomare Caboto, Gaeta. |

### 8.3 Home

**IT**

- H1: Il forno del lungomare di Gaeta, dal 1922
- Sottotitolo: Pane, tiella di Gaeta, pizzette e dolci delle feste. Tre generazioni, stesso forno, stesso locale di fronte al mare.
- [OpenNow] · [Chiama] [Indicazioni]
- H2: Cosa trovi al banco
  - Pane di giornata — sfornato al mattino e nel pomeriggio; il pane senza lievito ogni `[[GIORNO]]`.
  - Tiella di Gaeta — con il polpo, con la cipolla e gli altri ripieni della tradizione; a fette o intera.
  - Pizzette rosse — le "storiche" pizzette del forno, buone anche fredde.
  - Ciambelline al vino e tozzetti alle mandorle — i biscotti che i clienti portano a casa dopo le vacanze.
  - Cornetti e colazione — produzione giornaliera dalle 7:30.
  - Dolci delle feste — zeppole a Carnevale, pigna a Pasqua, sciuscelle e mostaccioli a Natale.
  - Link: Tutti i prodotti →
- H2: Dal 1922, nello stesso locale
  - Almerindo De Conca tornò dall'America e il 4 aprile 1922 aprì il forno con la moglie Annunziata, all'angolo di Salita Porta di Terra. Da allora tre generazioni hanno impastato qui: Almerindo, i figli (i "fratelli De Conca") e oggi Alessandro. Nel 2022 il Comune di Gaeta ha festeggiato con noi i cento anni.
  - Link: Leggi la storia →
- H2: Prenota oggi, ritira domani
  - Calzoncini, frittatine di patate, focaccine, tielle e pizzette escono dal forno in quantità decisa il giorno prima: chi telefona entro le `[[ORA_LIMITE]]` al `0771 460651` li trova pronti all'ora che chiede; chi passa senza prenotare li trova se ne sono rimasti. Tielle intere, torte, maritozzi e cesti si prenotano con `[[ANTICIPO]]` di anticipo. Nessun modulo, nessuna app: risponde il negozio.
  - Link: Come prenotare →
- H2: Vieni a trovarci
  - Lungomare Caboto `[[CIVICO]]`, Gaeta, nel quartiere medievale, di fronte alla base. Parcheggio sul lungomare. [Orari completi] [Indicazioni]

**EN**

- H1: Gaeta's seafront bakery, since 1922
- Sub: Bread, tiella di Gaeta, pizzette and holiday sweets. Three generations, one oven, the same shop facing the sea.
- [OpenNow] · [Call us] [Directions]
- H2: What you'll find at the counter
  - Daily bread — baked in the morning and again in the afternoon; yeast-free bread every `[[GIORNO]]`.
  - Tiella di Gaeta — Gaeta's stuffed pie, with octopus, with onion and the other traditional fillings; by the slice or whole.
  - Red pizzette — the bakery's signature little tomato pizzas, good cold too.
  - Wine ring biscuits and almond tozzetti — the biscuits our customers take home after their holiday.
  - Croissants and breakfast — baked fresh every day from 7:30.
  - Holiday sweets — zeppole at Carnival, pigna at Easter, sciuscelle and mostaccioli at Christmas.
  - Link: See all products →
- H2: Since 1922, in the same shop
  - Almerindo De Conca came back from America and on 4 April 1922 opened this bakery with his wife Annunziata, on the corner of Salita Porta di Terra. Three generations have kneaded here since: Almerindo, his children (the "De Conca brothers") and today Alessandro. In 2022 the town of Gaeta celebrated our first hundred years with us.
  - Link: Read our story →
- H2: Order today, collect tomorrow
  - Calzoncini, potato frittatine, focaccine, tielle and pizzette are baked in quantities decided the day before: call `+39 0771 460651` by `[[ORA_LIMITE]]` and they'll be ready at the time you ask for; walk in without ordering and you'll get them if any are left. Whole tielle, cakes, maritozzi and gift baskets need `[[ANTICIPO]]` notice. No forms, no apps: the shop answers.
  - Link: How to order →
- H2: Come and see us
  - Lungomare Caboto `[[CIVICO]]`, Gaeta, in the medieval quarter, opposite the naval base. Parking on the seafront. [Full hours] [Directions]

**DE**

- H1: Die Bäckerei an der Uferpromenade von Gaeta, seit 1922
- Sub: Brot, Tiella di Gaeta, Pizzette und Festtagsgebäck. Drei Generationen, ein Ofen, derselbe Laden mit Blick aufs Meer.
- [OpenNow] · [Anrufen] [Route]
- H2: Das finden Sie an der Theke
  - Tägliches Brot — morgens und nachmittags frisch gebacken; hefefreies Brot jeden `[[GIORNO]]`.
  - Tiella di Gaeta — die gefüllte Teigspezialität aus Gaeta, mit Oktopus, mit Zwiebeln und anderen traditionellen Füllungen; stückweise oder ganz.
  - Rote Pizzette — die kleinen Tomatenpizzen, für die unsere Bäckerei bekannt ist, auch kalt ein Genuss.
  - Weinkringel und Mandel-Tozzetti — das Gebäck, das unsere Kunden nach dem Urlaub mit nach Hause nehmen.
  - Croissants und Frühstück — täglich frisch ab 7:30 Uhr.
  - Festtagsgebäck — Zeppole zu Karneval, Pigna zu Ostern, Sciuscelle und Mostaccioli zu Weihnachten.
  - Link: Alle Produkte →
- H2: Seit 1922 im selben Laden
  - Almerindo De Conca kehrte aus Amerika zurück und eröffnete am 4. April 1922 mit seiner Frau Annunziata diese Bäckerei an der Ecke Salita Porta di Terra. Seitdem haben hier drei Generationen den Teig geknetet: Almerindo, seine Kinder (die „Brüder De Conca“) und heute Alessandro. 2022 hat die Stadt Gaeta mit uns das hundertjährige Bestehen gefeiert.
  - Link: Unsere Geschichte →
- H2: Heute bestellen, morgen abholen
  - Calzoncini, Kartoffel-Frittatine, Focaccine, Tielle und Pizzette werden in einer Menge gebacken, die am Vortag festgelegt wird: Wer bis `[[ORA_LIMITE]]` Uhr unter `+39 0771 460651` anruft, findet sie zur gewünschten Uhrzeit bereit; wer ohne Bestellung vorbeikommt, bekommt sie, solange der Vorrat reicht. Ganze Tielle, Torten, Maritozzi und Geschenkkörbe brauchen `[[ANTICIPO]]` Vorlauf. Kein Formular, keine App: im Laden geht jemand ans Telefon.
  - Link: So bestellen Sie →
- H2: Besuchen Sie uns
  - Lungomare Caboto `[[CIVICO]]`, Gaeta, in der Altstadt, gegenüber dem Marinestützpunkt. Parkplätze an der Promenade. [Alle Öffnungszeiten] [Route]

### 8.4 La storia

**IT**

- H1: Cento anni di pane sul lungomare
- Sottotitolo: Dal 4 aprile 1922 il forno non ha mai cambiato indirizzo.
- Timeline:
  - **1922** — Almerindo De Conca torna dall'America e, con la moglie Annunziata Di Schino, apre il forno all'angolo tra il Lungomare Caboto e Salita Porta di Terra, nel quartiere medievale. Gas e corrente elettrica non sono ancora arrivati nelle case: pane e dolci si fanno con la legna.
  - **Dopoguerra** — Il forno riapre dopo la breve interruzione della guerra. Nell'immediato dopoguerra il pane va anche a chi ne ha bisogno, tra cui gli sfollati della caserma Cosenz.
  - **1958** — L'insegna diventa "Il Fornaio di De Conca Almerindo e figli": Anna, Aida, Antonio e Alfonso lavorano con il padre.
  - **1965** — Antonio e Alfonso prendono in mano il forno. Per due generazioni di gaetani sono "i fratelli De Conca": pane, tielle di tutti i tipi, pizze, pizzette, tozzi, biscotti, rustici, torte e dolci delle feste.
  - **2005** — Alessandro, figlio di Alfonso, subentra alla guida. Le ricette restano quelle; accanto arrivano nuovi prodotti.
  - **2022** — Il centenario. Il Comune di Gaeta consegna una pergamena "a tre generazioni che dall'aprile 1922 hanno investito capacità, sforzi e sacrifici nel Panificio De Conca, uno dei punti di riferimento della gastronomia gaetana". `[[Foto della pergamena]]`
  - **Oggi** — Stesso locale, stesso forno, stessa famiglia. E la Sciusciata di Capodanno, la tradizione gaetana di canti e auguri della notte del 31 dicembre, che ogni anno parte da qui `[[da confermare con il titolare]]`.
- Riquadro fonti: [Il Messaggero, 5 giugno 2022, "Gaeta, compie un secolo il panificio De Conca: è il più antico della provincia"](https://www.ilmessaggero.it/pay/gaeta_compie_un_secolo_il_panificio_de_conca_e_il_piu_antico_della_provincia-6733111.html) (per abbonati) · [Lazio Sette, 12 giugno 2022, "Lo storico forno «De Conca» di Gaeta da un secolo fa il pane sul lungomare"](https://www.arcidiocesigaeta.it/wp-content/uploads/sites/6/2022/06/13/Diocesane_Lazio7_Gaeta_20220612_E01.pdf).
- Chiusura: [Vieni a trovarci]

**EN**

- H1: A hundred years of bread on the seafront
- Sub: The bakery has not changed address since 4 April 1922.
- Timeline:
  - **1922** — Almerindo De Conca comes back from America and, with his wife Annunziata Di Schino, opens the bakery on the corner of Lungomare Caboto and Salita Porta di Terra, in the medieval quarter. Gas and electricity have not yet reached the houses: bread and sweets are baked with wood.
  - **After the war** — The bakery reopens after the brief wartime closure. In the years right after the war, bread also goes to those in need, including the evacuees housed in the Cosenz barracks.
  - **1958** — The sign becomes "Il Fornaio di De Conca Almerindo e figli": Anna, Aida, Antonio and Alfonso work alongside their father.
  - **1965** — Antonio and Alfonso take over. For two generations in Gaeta they are "the De Conca brothers": bread, tielle of every kind, pizzas, pizzette, tozzi, biscuits, savoury pastries, cakes and holiday sweets.
  - **2005** — Alessandro, Alfonso's son, takes the helm. The recipes stay the same; new products join them.
  - **2022** — The centenary. The town of Gaeta presents a certificate "to three generations who, since April 1922, have invested skill, effort and sacrifice in Panificio De Conca, one of the cornerstones of Gaeta's food tradition". `[[Photo of the certificate]]`
  - **Today** — Same shop, same oven, same family. And the Sciusciata, Gaeta's New Year's Eve tradition of songs and wishes, which sets off from here every 31 December `[[to confirm with the owner]]`.
- Sources box: [Il Messaggero, 5 June 2022](https://www.ilmessaggero.it/pay/gaeta_compie_un_secolo_il_panificio_de_conca_e_il_piu_antico_della_provincia-6733111.html) (subscribers only, in Italian) · [Lazio Sette, 12 June 2022](https://www.arcidiocesigaeta.it/wp-content/uploads/sites/6/2022/06/13/Diocesane_Lazio7_Gaeta_20220612_E01.pdf) (in Italian).
- Closing: [Come and see us]

**DE**

- H1: Hundert Jahre Brot an der Uferpromenade
- Sub: Seit dem 4. April 1922 hat die Bäckerei ihre Adresse nie gewechselt.
- Timeline:
  - **1922** — Almerindo De Conca kehrt aus Amerika zurück und eröffnet mit seiner Frau Annunziata Di Schino die Bäckerei an der Ecke Lungomare Caboto / Salita Porta di Terra in der Altstadt. Gas und Strom gibt es in den Häusern noch nicht: Brot und Gebäck werden mit Holz gebacken.
  - **Nachkriegszeit** — Nach der kurzen Unterbrechung durch den Krieg öffnet die Bäckerei wieder. In den ersten Nachkriegsjahren gibt es Brot auch für die, die es brauchen, darunter die in der Kaserne Cosenz untergebrachten Evakuierten.
  - **1958** — Die Ladenaufschrift lautet nun „Il Fornaio di De Conca Almerindo e figli“: Anna, Aida, Antonio und Alfonso arbeiten mit ihrem Vater.
  - **1965** — Antonio und Alfonso übernehmen den Betrieb. Für zwei Generationen in Gaeta sind sie „die Brüder De Conca“: Brot, Tielle in allen Varianten, Pizza, Pizzette, Tozzi, Kekse, herzhaftes Gebäck, Torten und Festtagsgebäck.
  - **2005** — Alessandro, der Sohn von Alfonso, übernimmt die Leitung. Die Rezepte bleiben; neue Produkte kommen dazu.
  - **2022** — Das hundertjährige Jubiläum. Die Stadt Gaeta überreicht eine Urkunde „an drei Generationen, die seit April 1922 Können, Einsatz und Opfer in das Panificio De Conca investiert haben, eine der festen Größen der Gaetaner Gastronomie“. `[[Foto der Urkunde]]`
  - **Heute** — Derselbe Laden, derselbe Ofen, dieselbe Familie. Und die Sciusciata, der Gaetaner Silvesterbrauch mit Liedern und Glückwünschen, der jedes Jahr am 31. Dezember hier beginnt `[[mit dem Inhaber zu bestätigen]]`.
- Quellenkasten: [Il Messaggero, 5. Juni 2022](https://www.ilmessaggero.it/pay/gaeta_compie_un_secolo_il_panificio_de_conca_e_il_piu_antico_della_provincia-6733111.html) (nur für Abonnenten, auf Italienisch) · [Lazio Sette, 12. Juni 2022](https://www.arcidiocesigaeta.it/wp-content/uploads/sites/6/2022/06/13/Diocesane_Lazio7_Gaeta_20220612_E01.pdf) (auf Italienisch).
- Abschluss: [Besuchen Sie uns]

### 8.5 La tiella di Gaeta

**IT**

- H1: La tiella di Gaeta
- Sottotitolo: Due sfoglie sottili, un ripieno di mare o di orto, il forno. La facciamo dal 1922.
- H2: Cos'è
  - La tiella è la pizza ripiena di Gaeta: due dischi di pasta sottile chiusi sul bordo, cotti in teglia rotonda. Nasce come pasto dei pescatori e dei contadini, da portare in barca o nei campi, e si mangia a temperatura ambiente. Dal 2005 ha la Denominazione Comunale d'Origine (De.Co.) del Comune di Gaeta ed è tra i prodotti tradizionali del Lazio.
- H2: I nostri ripieni
  - Polpo, con olive di Gaeta e pomodoro — la più richiesta.
  - Cipolla — dolce, con olive e un po' di pecorino.
  - `[[Altri ripieni del forno: scarola, alici, zucchine, baccalà… da confermare con il titolare]]`
  - Etichetta: "I ripieni cambiano con la stagione e con il pescato: chiedi al banco cosa c'è oggi."
- H2: Quando la trovi e quanto costa
  - Tutti i giorni di apertura `[[fasce orarie della tiella]]`. A fetta `[[PREZZO_FETTA]]`, intera `[[PREZZO_INTERA]]` (`[[diametro/peso]]`, `[[porzioni]]`).
  - Le tielle intere si prenotano per telefono con `[[ANTICIPO]]` di anticipo, anche per la spiaggia, la barca o il viaggio di ritorno.
- H2: Come portarla via
  - Si mangia a temperatura ambiente e regge bene `[[ORE DI CONSERVAZIONE: da confermare]]`; incartata e in una borsa termica arriva a Roma o a Napoli intatta. `[[Se attiva: "Su richiesta la confezioniamo sottovuoto: dura 10 giorni in frigo."]]`
- CTA: [Chiama per prenotare] [Indicazioni]

**EN**

- H1: Tiella di Gaeta
- Sub: Two thin sheets of dough, a filling from the sea or the garden, the oven. We have baked it since 1922.
- H2: What it is
  - The tiella is Gaeta's stuffed pie: two thin discs of dough sealed at the edge and baked in a round tin. It began as the meal of fishermen and farmers, carried onto boats and into the fields, and it is eaten at room temperature. Since 2005 it has carried the town's own designation of origin (De.Co.) and it is listed among the traditional products of Lazio.
- H2: Our fillings
  - Octopus, with Gaeta olives and tomato — the most popular.
  - Onion — sweet, with olives and a little pecorino.
  - `[[Other fillings: escarole, anchovies, courgettes, salt cod… to confirm]]`
  - Label: "Fillings change with the season and the catch: ask at the counter what's in today."
- H2: When to find it and what it costs
  - Every day we're open, `[[time slots]]`. By the slice `[[PRICE_SLICE]]`, whole `[[PRICE_WHOLE]]` (`[[size]]`, serves `[[portions]]`).
  - Whole tielle can be ordered by phone with `[[ANTICIPO]]` notice — for the beach, the boat or the journey home.
- H2: Taking it away
  - It is eaten at room temperature and keeps well for `[[HOURS: to confirm]]`; wrapped and in a cool bag it reaches Rome or Naples intact. `[[If active: "On request we vacuum-pack it: it keeps 10 days in the fridge."]]`
- CTA: [Call to order] [Directions]

**DE**

- H1: Tiella di Gaeta
- Sub: Zwei dünne Teigplatten, eine Füllung aus dem Meer oder dem Garten, der Ofen. Wir backen sie seit 1922.
- H2: Was das ist
  - Die Tiella ist die gefüllte Teigspezialität aus Gaeta: zwei dünne Teigscheiben, am Rand verschlossen und in einer runden Form gebacken. Sie war das Essen der Fischer und Bauern, das mit aufs Boot oder aufs Feld kam, und wird bei Zimmertemperatur gegessen. Seit 2005 trägt sie die kommunale Herkunftsbezeichnung (De.Co.) der Stadt Gaeta und zählt zu den traditionellen Produkten Latiums.
- H2: Unsere Füllungen
  - Oktopus, mit Gaeta-Oliven und Tomate — die beliebteste.
  - Zwiebel — süßlich, mit Oliven und etwas Pecorino.
  - `[[Weitere Füllungen: Endivie, Sardellen, Zucchini, Klippfisch … zu bestätigen]]`
  - Hinweis: „Die Füllungen wechseln mit der Saison und dem Fang: Fragen Sie an der Theke, was es heute gibt.“
- H2: Wann es sie gibt und was sie kostet
  - An allen Öffnungstagen, `[[Zeitfenster]]`. Als Stück `[[PREIS_STÜCK]]`, ganz `[[PREIS_GANZ]]` (`[[Größe]]`, für `[[Portionen]]` Personen).
  - Ganze Tielle können Sie mit `[[ANTICIPO]]` Vorlauf telefonisch bestellen — für den Strand, das Boot oder die Heimreise.
- H2: Zum Mitnehmen
  - Sie wird bei Zimmertemperatur gegessen und hält sich gut `[[STUNDEN: zu bestätigen]]`; eingewickelt und in einer Kühltasche kommt sie unversehrt in Rom oder Neapel an. `[[Falls aktiv: „Auf Wunsch vakuumieren wir sie: so hält sie 10 Tage im Kühlschrank.“]]`
- CTA: [Anrufen und bestellen] [Route]

### 8.6 Pane e prodotti

Struttura: H1, sottotitolo, poi una griglia di `ProductCard` per categoria; ogni scheda = nome, una riga, prezzo indicativo, etichetta di stagione. Testi delle schede (`products/*/`):

| Categoria | Prodotto | IT (una riga) | EN | DE |
| --- | --- | --- | --- | --- |
| Pane | Pane di giornata | Filoni e pagnotte sfornati due volte al giorno; al chilo. | Loaves baked twice a day; sold by weight. | Brote und Laibe, zweimal täglich frisch; nach Gewicht. |
| Pane | Pane senza lievito | Solo il `[[GIORNO]]`, una volta a settimana: prenotalo. | Every `[[GIORNO]]`, once a week: order ahead. | Jeden `[[GIORNO]]`, einmal pro Woche: bitte vorbestellen. |
| Pane | Freselle e taralli | Secchi, per la barca, la spiaggia e la valigia. | Twice-baked bread rings and taralli: for the boat, the beach and the suitcase. | Zwieback-Kringel und Taralli: fürs Boot, den Strand und den Koffer. |
| Salato | Pizzette rosse | Le pizzette "storiche" del forno, con il pomodoro. | The bakery's signature little tomato pizzas. | Die kleinen Tomatenpizzen, für die die Bäckerei bekannt ist. |
| Salato | Panini napoletani | Con salumi e formaggio nell'impasto; pranzo in una mano. | Bread rolls baked with cured meats and cheese inside; lunch in one hand. | Brötchen mit eingebackener Wurst und Käse; Mittagessen aus der Hand. |
| Salato | Calzoncini e rustici | Con le verdure di stagione, ricotta e salumi; sfornata delle `[[ORA_SFORNATA]]`, meglio prenotare. | With seasonal vegetables, ricotta and cured meats; out of the oven at `[[ORA_SFORNATA]]`, best ordered ahead. | Mit Gemüse der Saison, Ricotta und Wurst; frisch um `[[ORA_SFORNATA]]` Uhr, am besten vorbestellen. |
| Salato | Frittatine di patate | Le frittatine di patate del forno: finiscono in pochi minuti, prenotale il giorno prima. | The bakery's potato frittatine: gone in minutes, so order the day before. | Die Kartoffel-Frittatine der Bäckerei: in Minuten ausverkauft, am Vortag bestellen. |
| Salato | Focaccine | Piccole focacce da spuntino; a sfornata, su prenotazione sicura. | Small snack focaccias, baked in batches; ordering ahead guarantees yours. | Kleine Focaccia zum Snacken, schubweise gebacken; Vorbestellung sichert Ihre. |
| Salato | Tiella di Gaeta | A fette o intera; vedi la pagina dedicata. | By the slice or whole; see its own page. | Als Stück oder ganz; siehe eigene Seite. |
| Colazione | Cornetti | Semplici e ripieni, ogni mattina dalle 7:30. | Plain and filled, every morning from 7:30. | Pur und gefüllt, jeden Morgen ab 7:30 Uhr. |
| Colazione | Maritozzi | Con la panna, fatti al momento: su prenotazione. | With whipped cream, made to order. | Mit Sahne, frisch auf Bestellung. |
| Biscotti | Ciambelline al vino | Il biscotto da portare via: durano settimane. | Wine ring biscuits: the ones to take home, since they keep for weeks. | Weinkringel: das Gebäck zum Mitnehmen, wochenlang haltbar. |
| Biscotti | Tozzi e tozzetti alle mandorle | Da inzuppare nel vino o nel caffè. | For dunking in wine or coffee. | Zum Eintunken in Wein oder Kaffee. |
| Biscotti | Biscottoni e crostatine | Con le visciole e la marmellata. | With sour cherries and jam. | Mit Sauerkirschen und Marmelade. |
| Dolci | Torte e plumcake | Torta di mele, torte su prenotazione per feste e compleanni. | Apple cake; cakes to order for parties and birthdays. | Apfelkuchen; Torten auf Bestellung für Feste und Geburtstage. |
| Feste | Zeppole | Carnevale e San Giuseppe (19 marzo). | Carnival and St Joseph's Day (19 March). | Karneval und Josefstag (19. März). |
| Feste | Pigna e casatiello | Pasqua: la pigna dolce e il casatiello salato. | Easter: the sweet pigna and the savoury casatiello. | Ostern: die süße Pigna und der herzhafte Casatiello. |
| Feste | Sciuscelle e mostaccioli | Natale: i dolci di Gaeta, anche confezionati per regalo. | Christmas: Gaeta's own sweets, also gift-wrapped. | Weihnachten: das Gaetaner Gebäck, auch als Geschenk verpackt. |

Testo introduttivo IT: "Tutto quello che vendiamo esce dal nostro forno. La lista cambia con le stagioni e con le feste: quello che vedi qui è quello che trovi di solito; per il resto chiedi al banco." (EN: "Everything we sell comes out of our own oven. The list changes with the seasons and the holidays: what you see here is what you usually find; for the rest, ask at the counter." DE: "Alles, was wir verkaufen, kommt aus unserem eigenen Ofen. Das Angebot wechselt mit den Jahreszeiten und den Festen: Was Sie hier sehen, finden Sie in der Regel; alles Weitere erfragen Sie bitte an der Theke.")

### 8.7 Ordini e forniture

**IT**

- H1: Si ordina per telefono
- Sottotitolo: Chiama il `0771 460651` negli orari di apertura. Risponde il negozio, non un centralino.
- H2: Il fresco si prenota il giorno prima
  - Calzoncini, frittatine di patate, focaccine, tielle e pizzette si preparano ogni giorno nella quantità prenotata più poco altro. Regola semplice: **chiami entro le `[[ORA_LIMITE]]`, ritiri domani all'ora che vuoi**. Sfornate: `[[ORARI_SFORNATE, es. calzoncini e frittatine alle 11, pizzette alle 17]]`. Se un prodotto è finito, al banco te lo mettono da parte per il giorno dopo.
- H2: Cosa si prenota
  - Tielle intere, torte, maritozzi, pane senza lievito, vassoi di pizzette e rustici, cesti regalo. Anticipo consigliato: `[[ANTICIPO]]`; per le feste (Natale, Pasqua) entro le date del listino stagionale `[[LINK PDF/immagine del listino]]`.
- H2: Feste e ricorrenze
  - Ogni anno prepariamo il listino delle feste: Natale (sciuscelle, mostaccioli, cesti), Carnevale e San Giuseppe (zeppole), Pasqua (pigna, casatiello). Lo trovi in negozio e qui sotto.
- H2: Bar, ristoranti, B&B e hotel
  - Forniamo pane, pizzette, cornetti e tielle ad attività di Gaeta e del Golfo, con consegna `[[ORARIO DI CONSEGNA: da confermare]]`. Chiama per un listino e una prova.
- H2: Barche
  - Per chi è ormeggiato a Gaeta: pane, pizzette e tielle per la cambusa, ordinati entro `[[ORA LIMITE: da confermare]]` per il giorno dopo, pronti all'ora che ci dici.
- H2: Spedizioni
  - `[[Se attive: "Spediamo in Italia ciambelline, tozzetti, taralli e tielle sottovuoto: chiama per il box del forno."]]` `[[Se non attive: "Non spediamo ancora: per ora viaggia tutto in valigia. Chiedi al banco il pacchetto da valigia."]]`
- CTA: [Chiama]

**EN**

- H1: Orders are taken by phone
- Sub: Call `+39 0771 460651` during opening hours. The shop answers, not a call centre. We speak `[[LINGUE_AL_BANCO]]`.
- H2: Fresh items are ordered the day before
  - Calzoncini, potato frittatine, focaccine, tielle and pizzette are baked each day in the quantity ordered, plus a little extra. Simple rule: **call by `[[ORA_LIMITE]]`, collect tomorrow at the time you choose**. Baking times: `[[ORARI_SFORNATE]]`. If something has sold out, the counter will set it aside for you for the next day.
- H2: What you can order
  - Whole tielle, cakes, maritozzi, yeast-free bread, trays of pizzette and savoury pastries, gift baskets. Suggested notice: `[[ANTICIPO]]`; for Christmas and Easter, by the dates on the seasonal price list `[[LINK]]`.
- H2: Holidays
  - Every year we prepare a holiday price list: Christmas (sciuscelle, mostaccioli, baskets), Carnival and St Joseph's Day (zeppole), Easter (pigna, casatiello). You'll find it in the shop and below.
- H2: Bars, restaurants, B&Bs and hotels
  - We supply bread, pizzette, croissants and tielle to businesses in Gaeta and the Gulf, delivered `[[DELIVERY TIME: to confirm]]`. Call for a price list and a trial order.
- H2: Boats
  - Moored in Gaeta? Bread, pizzette and tielle for the galley, ordered by `[[CUT-OFF TIME: to confirm]]` for the next day, ready at the time you choose.
- H2: Shipping
  - `[[If active: "We ship wine ring biscuits, tozzetti, taralli and vacuum-packed tielle within Italy: call for the bakery box."]]` `[[If not: "We don't ship yet: for now everything travels in your suitcase. Ask at the counter for the suitcase pack."]]`
- CTA: [Call us]

**DE**

- H1: Bestellungen nehmen wir telefonisch entgegen
- Sub: Rufen Sie während der Öffnungszeiten `+39 0771 460651` an. Es antwortet der Laden, keine Zentrale. Wir sprechen `[[LINGUE_AL_BANCO]]`.
- H2: Frisches wird am Vortag bestellt
  - Calzoncini, Kartoffel-Frittatine, Focaccine, Tielle und Pizzette backen wir jeden Tag in der bestellten Menge plus einer kleinen Reserve. Einfache Regel: **bis `[[ORA_LIMITE]]` Uhr anrufen, morgen zur Wunschzeit abholen**. Backzeiten: `[[ORARI_SFORNATE]]`. Ist etwas ausverkauft, legt es die Theke für Sie für den nächsten Tag zurück.
- H2: Was Sie bestellen können
  - Ganze Tielle, Torten, Maritozzi, hefefreies Brot, Platten mit Pizzette und herzhaftem Gebäck, Geschenkkörbe. Empfohlener Vorlauf: `[[ANTICIPO]]`; zu Weihnachten und Ostern bis zu den Terminen der Festtagsliste `[[LINK]]`.
- H2: Feiertage
  - Jedes Jahr stellen wir eine Festtagsliste zusammen: Weihnachten (Sciuscelle, Mostaccioli, Körbe), Karneval und Josefstag (Zeppole), Ostern (Pigna, Casatiello). Sie liegt im Laden aus und steht hier unten.
- H2: Bars, Restaurants, B&Bs und Hotels
  - Wir beliefern Betriebe in Gaeta und am Golf mit Brot, Pizzette, Croissants und Tielle, Lieferung `[[LIEFERZEIT: zu bestätigen]]`. Rufen Sie an für eine Preisliste und eine Probelieferung.
- H2: Boote
  - Ihr Boot liegt in Gaeta? Brot, Pizzette und Tielle für die Kombüse, bis `[[BESTELLSCHLUSS: zu bestätigen]]` für den nächsten Tag bestellt, fertig zur gewünschten Uhrzeit.
- H2: Versand
  - `[[Falls aktiv: „Wir versenden Weinkringel, Tozzetti, Taralli und vakuumierte Tielle innerhalb Italiens: Rufen Sie an für die Bäckerei-Box.“]]` `[[Falls nicht: „Wir versenden noch nicht: Vorerst reist alles im Koffer mit. Fragen Sie an der Theke nach dem Kofferpaket.“]]`
- CTA: [Anrufen]

### 8.8 Dove siamo

**IT**

- H1: Sul lungomare, nel quartiere medievale
- Indirizzo: Lungomare Giovanni Caboto `[[CIVICO]]`, 04024 Gaeta (LT) — angolo Salita Porta di Terra, di fronte alla base della Marina. [Google Maps] [Apple Maps]
- H2: In auto — Parcheggio lungo il Lungomare Caboto `[[note su strisce blu/ZTL estiva da confermare]]`. Da Roma: A1 uscita Cassino, poi SS 630 verso Formia e Gaeta, 1h40; oppure Pontina e Flacca. Da Napoli: A1 uscita Caianello o Capua, poi Formia, 1h15.
- H2: In treno — Stazione di Formia-Gaeta (Intercity e regionali da Roma Termini in 1h10, da Napoli in 50 minuti), poi bus Cotral per Gaeta (fermata `[[FERMATA più vicina]]`) o taxi, 10 km.
- H2: A piedi — Dal Santuario della Montagna Spaccata e dalla spiaggia di Serapo, `[[minuti]]` lungo il mare; dal Castello e dal Duomo, cinque minuti in discesa.
- H2: In barca — Dalla Base Nautica Flavio Gioia e dal porto turistico, dieci minuti a piedi lungo il lungomare.

**EN**

- H1: On the seafront, in the medieval quarter
- Address: Lungomare Giovanni Caboto `[[CIVICO]]`, 04024 Gaeta (LT), Italy — corner of Salita Porta di Terra, opposite the naval base. [Google Maps] [Apple Maps]
- H2: By car — Parking along Lungomare Caboto `[[parking notes]]`. From Rome: A1 motorway, exit Cassino, then SS 630 towards Formia and Gaeta, about 1 h 40; or the Pontina and Flacca coastal road. From Naples: A1, exit Caianello or Capua, then Formia, about 1 h 15.
- H2: By train — Formia-Gaeta station (Intercity and regional trains from Rome Termini in 1 h 10, from Naples in 50 minutes), then the Cotral bus to Gaeta (stop `[[STOP]]`) or a taxi, 10 km.
- H2: On foot — From the Montagna Spaccata sanctuary and Serapo beach, `[[minutes]]` along the sea; from the castle and the cathedral, five minutes downhill.
- H2: By boat — From Base Nautica Flavio Gioia and the marina, ten minutes on foot along the seafront.

**DE**

- H1: An der Promenade, in der Altstadt
- Adresse: Lungomare Giovanni Caboto `[[CIVICO]]`, 04024 Gaeta (LT), Italien — Ecke Salita Porta di Terra, gegenüber dem Marinestützpunkt. [Google Maps] [Apple Karten]
- H2: Mit dem Auto — Parkplätze entlang des Lungomare Caboto `[[Hinweise zum Parken]]`. Aus Rom: Autobahn A1, Ausfahrt Cassino, dann SS 630 Richtung Formia und Gaeta, ca. 1 Std. 40; oder über Pontina und die Küstenstraße Flacca. Aus Neapel: A1, Ausfahrt Caianello oder Capua, dann Formia, ca. 1 Std. 15.
- H2: Mit dem Zug — Bahnhof Formia-Gaeta (Intercity und Regionalzüge ab Rom Termini in 1 Std. 10, ab Neapel in 50 Minuten), dann mit dem Cotral-Bus nach Gaeta (Haltestelle `[[HALTESTELLE]]`) oder mit dem Taxi, 10 km.
- H2: Zu Fuß — Vom Wallfahrtsort Montagna Spaccata und vom Strand Serapo `[[Minuten]]` am Meer entlang; von der Burg und dem Dom fünf Minuten bergab.
- H2: Mit dem Boot — Von der Base Nautica Flavio Gioia und dem Yachthafen zehn Minuten zu Fuß an der Promenade entlang.

### 8.9 Contatti

Tutte le lingue, stesso schema: H1 (Contatti / Contact / Kontakt) · telefono grande e cliccabile · orari settimanali con gli orari speciali in evidenza · indirizzo con i due link mappe · social (Facebook, Instagram) · nota: "Non abbiamo un modulo di contatto: al telefono siamo più veloci." (EN: "We have no contact form: we're quicker on the phone." DE: "Wir haben kein Kontaktformular: am Telefon sind wir schneller.") · e-mail `[[EMAIL]]` solo se il titolare la legge.

### 8.10 Note legali e privacy

- IT: ragione sociale, sede, P.IVA 01960040598, REA LT-135120, telefono, e-mail/PEC `[[PEC]]`. Informativa privacy breve: il sito non usa cookie né raccoglie dati personali; le statistiche di visita sono aggregate e anonime (Cloudflare Web Analytics); i link a Google Maps, Apple Maps, Facebook e Instagram portano a servizi con le proprie informative. Titolare del trattamento: De Conca Alessandro e C. S.n.c.
- EN/DE: stesso contenuto tradotto; la versione tedesca si intitola "Impressum & Datenschutz" e riporta gli stessi dati societari.

## 9. Lista delle foto da scattare

Telefono recente, luce naturale, orizzontale, senza filtri, niente persone riconoscibili senza consenso. Nomi file in minuscolo con trattini.

| # | Soggetto | Uso |
| --- | --- | --- |
| 1 | Facciata con insegna, di mattina, dal lungomare | hero home, Dove siamo, OG image |
| 2 | Insegna storica "Fornaio F.lli De Conca" se ancora presente, o l'insegna attuale in dettaglio | Storia |
| 3 | Banco pieno, ore 8 | hero alternativa, Prodotti |
| 4 | Tiella intera appena sfornata | Tiella, OG |
| 5 | Tiella a fette, dettaglio del ripieno di polpo | Tiella |
| 6 | Tiella con la cipolla, dettaglio | Tiella |
| 7 | Pizzette rosse sul vassoio | Home, Prodotti |
| 8 | Pane di giornata, filoni e pagnotte | Prodotti |
| 9 | Pane senza lievito | Prodotti |
| 10 | Ciambelline al vino in sacchetto | Prodotti, Ordini (pacchetto valigia) |
| 11 | Tozzetti alle mandorle | Prodotti |
| 12 | Cornetti al mattino | Prodotti |
| 13 | Maritozzi con la panna | Prodotti |
| 14 | Forno acceso, pale, impasto in lavorazione (mani) | Storia, Home |
| 15 | Laboratorio all'alba | Storia |
| 16 | Dolci di Natale confezionati (a novembre) | Prodotti, Ordini |
| 17 | Pigna e casatiello (a Pasqua) | Prodotti |
| 18 | Zeppole (a Carnevale) | Prodotti |
| 19 | Vetrina con il cartello degli orari | Contatti |
| 20 | La famiglia davanti al forno (con consenso) | Storia |
| 21 | Foto d'epoca scansionate: fondatori, fratelli, insegna anni '60 (3 o più) | Storia |
| 22 | Pergamena del centenario | Storia |
| 23 | Ritaglio dell'articolo del Messaggero | Storia |
| 24 | Vista del lungomare con la base sullo sfondo | Dove siamo |

Le circa 90 foto già scaricate dalla pagina Facebook (cartella `Immagini/` del progetto) servono da riferimento e da riempitivo temporaneo, non come foto definitive: risoluzione bassa e tagli verticali.

## 10. Dati da confermare prima della pubblicazione

- [ ] Civico ufficiale (632 o 640)
- [ ] Orari invernali ed estivi, giorno di chiusura, orari delle feste e delle luminarie
- [ ] Giorno del pane senza lievito
- [ ] Prezzi indicativi: tiella a fetta e intera, pizzetta, pane al kg, ciambelline, tozzetti, cornetto
- [ ] Ripieni di tiella effettivamente prodotti
- [ ] Anticipo richiesto per gli ordini
- [ ] Ora limite per gli ordini del giorno dopo e orari delle sfornate (calzoncini, frittatine di patate, focaccine, pizzette, tielle)
- [ ] Lingue parlate al banco
- [ ] Spedizioni attive sì/no; sottovuoto sì/no
- [ ] E-mail e PEC dell'attività
- [ ] Fermata Cotral più vicina; note sul parcheggio
- [ ] Minuti a piedi da Montagna Spaccata e Serapo
- [ ] Coordinate GPS verificate sul posto e Place ID della scheda Google
- [ ] Consenso alle foto delle persone
- [ ] La Sciusciata del 31 dicembre parte davvero dal forno ogni anno
- [ ] Orario di consegna delle forniture e ora limite per gli ordini "cambusa"
- [ ] Quante ore si conserva la tiella a temperatura ambiente

## 11. Messa online

1. Registrare `panificiodeconca.it`, `panificiodeconca.com`, `ilfornaiodeconca.it` presso un registrar che gestisce il .it (Cloudflare Registrar non lo supporta: [OVH](https://www.ovhcloud.com/it/domains/) o [Aruba](https://hosting.aruba.it/domini.aspx)); puntare i nameserver a Cloudflare.
2. Repository Git (privato) con `main` protetto; Cloudflare Pages collegato al repository; variabile `SITE_URL=https://panificiodeconca.it`.
3. Redirect 301 dai domini secondari e da `www` al dominio principale; HTTPS forzato; HSTS.
4. Cloudflare Web Analytics attivato dal pannello (snippet senza cookie).
5. Verifica del dominio in Google Search Console e Bing Webmaster Tools; invio della sitemap.
6. Aggiunta dell'URL nella scheda Google Business Profile, su Facebook, Instagram, TripAdvisor, [Apple Business](https://business.apple.com/) (ex Business Connect), [Bing Places](https://www.bing.com/forbusiness), Yelp.
7. Checklist pre-lancio: Lighthouse ≥ 95 mobile su ogni pagina; Rich Results Test verde; hreflang validato; tutte le pagine nelle tre lingue; nessun segnaposto `[[...]]` residuo (aggiungere un test che fallisca se `[[` compare in `dist/`); 404 funzionante; link `tel:` testato su iPhone e Android; contrasto AA verificato; alt su ogni immagine.

## 12. Manutenzione (quattro volte l'anno)

| Quando | Cosa | Dove |
| --- | --- | --- |
| Metà marzo | Listino di Pasqua, orari di Pasqua, foto pigna/casatiello | `products/`, `business.json` (special_hours), `public/listini/` |
| Fine maggio | Orari estivi, pacchetto valigia, eventuali spedizioni, foto nuove | `business.json`, `orders` |
| Fine ottobre | Orari delle luminarie, listino di Natale, dolci di Natale | `business.json`, `products/`, `public/listini/` |
| Metà gennaio | Orari invernali, rimozione contenuti natalizi, bilancio statistiche | `business.json`, `products/` |

Ogni aggiornamento è un commit su un branch, anteprima su Cloudflare Pages, merge su `main`.

## 13. Prompt di partenza per Claude Code

> Leggi `BRIEF.md` per intero. Crea un progetto Astro 5 con i18n nativo (it predefinito senza prefisso, en e de con prefisso), content collections come descritto in §3, i componenti di §5 e le pagine di §4 nelle tre lingue con i testi di §8 copiati letteralmente, segnaposti inclusi. Genera JSON-LD, hreflang, sitemap, OG. Aggiungi lo script di verifica che fallisce se in `dist/` restano segnaposti `[[` o se manca un hreflang reciproco. Non inventare prezzi, orari o testi non presenti nel brief. Alla fine esegui build e Lighthouse e riporta i punteggi.
