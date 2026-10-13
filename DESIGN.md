# Piano UX/UI — Sito vetrina "Panificio De Conca" (Gaeta)

Versione 1.2 · 13 ottobre 2026 · È il file `DESIGN.md` nella root del repository, accanto a `BRIEF.md` e `CLAUDE.md`.

Il brief (`brief-sito-panificio-deconca.md`) resta la fonte unica per contenuti, copy nelle tre lingue, stack, SEO e dati da confermare. Questo documento copre il percorso di design che porta dal brief al sito costruito: **wireframe → design system → mockup in Claude Design → consegna a Claude Code**. Dove i due documenti si sovrappongono, vale il brief per *cosa* dice il sito e questo piano per *come* lo mostra.

---

## 0. In una frase

Un sito che un turista in strada capisce in tre secondi (cosa vende, se è aperto, dove si trova) e usa con un pollice (Chiama e Indicazioni sempre a portata), disegnato prima in Claude Design con un design system di pochi token e dieci componenti, e poi montato da Claude Code pagina per pagina confrontando il risultato con i mockup.

## 1. Il flusso di lavoro

| Fase | Cosa si produce | Dove | Stima |
| --- | --- | --- | --- |
| A. Fondamenta | Token verificati, scelta dei font, inventario di contenuti e foto per pagina, breakpoint | Questo documento (§6) | fatto, 1 h di verifica |
| B. Wireframe | 9 schermate mobile + 3 desktop in bassa fedeltà, con i testi veri; scheda dei componenti e dei loro stati | Claude Design (tipo "Design"), prompt §8.2 | fatto: `design/wireframes/` |
| C. Design system | Token, tipografia, componenti con stati e anteprime, regole d'uso | Claude Design (tipo "Design System"), prompt §8.1 | fatto: `design/tokens.*`, `design/components/` |
| D. Mockup | Le stesse schermate in alta fedeltà, con foto e copy del brief; due varianti per la hero desktop; una versione tedesca di prova | Claude Design (tipo "Design"), prompt §8.3–8.5 | fatto: `design/mockups/` |
| E. Revisione | Critica di design, verifica accessibilità, verifica dei contenuti sui mockup | Checklist §10, skill `design-critique` e `accessibility-review` | 2 h |
| F. Consegna e build | Cartella `design/` nel repository (token, mockup in PNG e HTML, `HANDOFF.md`), `CLAUDE.md`, prompt per Claude Code, pubblicazione in anteprima su Cloudflare, confronto pagina per pagina | §9 | consegna fatta; build: 1 sessione di scaffolding + 2–3 di rifinitura + 3 h di QA |

Totale indicativo: circa 20 ore di lavoro proprio distribuite su due o tre settimane, compatibile con la messa online prevista per novembre–dicembre 2026. Le fasi B, C e D sono chiuse; la fase E (revisione) si fa sui mockup esportati e può correre in parallelo alla build, perché le correzioni di design si applicano al codice; il sito si pubblica in anteprima appena costruito e passa online quando testi e foto sono definitivi (§9.3).

## 2. Lista delle cose da fare

Le voci già chiuse in questo documento sono spuntate; le altre indicano dove si fanno.

### A. Fondamenta

- [x] A1. Campionare il rosso e il bruno del logo (`Immagini/Logo`) e verificare i contrasti della palette (§6.1).
- [x] A2. Scegliere il font dei titoli: **Fraunces** (variabile, self-hosted), sans di sistema per il testo (§6.2).
- [x] A3. Definire scala tipografica, spaziature, raggi, griglia e breakpoint (§6.2–6.4).
- [x] A4. Mappare il copy del brief §8 sui blocchi di ogni pagina e fissare l'ordine dei blocchi (§5).
- [x] A5. Assegnare le foto del brief §9 ai riquadri di ogni pagina e scegliere le foto Facebook da usare come segnaposto nei mockup (§11).
- [x] A6. Prendere le decisioni di design che il brief lascia aperte (§7).
- [x] A7. Fraunces variabile in `design/fonts/` (sottoinsieme latino, 120 KB): sopra l'obiettivo degli 80 KB; se Lighthouse lo segnala, Claude Code lo riduce ai soli pesi 600–700 con un sottoinsieme statico.
- [ ] A8. Chiedere al titolare il file originale del logo (tipografia dell'insegna o dei sacchetti): l'icona dei mockup usa il marchio ricavato dal file Facebook (721 px) ed è provvisoria.

### B. Wireframe (Claude Design, bassa fedeltà)

- [x] B1. Scheda componenti in grigio: Header mobile (chiuso e con menu aperto), Header desktop, CtaBar, OpenNow nei cinque stati, ProductCard nelle quattro varianti, OrderRule, StoryTimeline (una voce con foto), Directions, HoursTable, Footer.
- [x] B2. Nove schermate mobile a 390 × 844: Home, La storia, La tiella, Pane e prodotti, Ordini, Dove siamo, Contatti, Note legali, 404. Testi italiani veri dal brief §8, foto come rettangoli numerati secondo il brief §9.
- [x] B3. Tre schermate desktop a 1440: Home, Pane e prodotti, La storia (le uniche dove il layout cambia davvero; le altre si riallineano su una colonna da 720 px).
- [ ] B4. Prova della piega: su ogni schermata mobile segnare la linea a 660 px dall'alto (altezza visibile tipica di un iPhone con la barra di Safari) e verificare che sopra ci siano H1, sottotitolo, OpenNow (dove previsto) e la CtaBar.
- [ ] B5. Prova del pollice: tutti i bersagli della metà inferiore dello schermo ≥ 44 × 44 px; nessun bersaglio essenziale nell'angolo in alto a sinistra.
- [ ] B6. Revisione con la checklist §10.1 e correzioni prima di passare ai mockup.

### C. Design system (Claude Design, tipo "Design System")

- [x] C1. Creare il design system "Panificio De Conca" con i token di §6 e impostarlo come predefinito dell'account, così le schermate successive lo usano senza chiederlo.
- [x] C2. Componenti con varianti e stati elencati in §6.5, ciascuno con anteprima e una riga di regole d'uso.
- [x] C3. README del design system con il tono ("un forno di paese con cento anni di storia"), le tre regole fisse (un solo accento, niente gradienti né ombre, testo mai sopra le foto) e la regola dei tre secondi.
- [x] C4. Set di icone (undici, da [Lucide](https://lucide.dev/), SVG inline): `phone`, `map-pin`, `clock`, `arrow-right`, `menu`, `x`, `languages` per l'interfaccia; `car`, `train-front`, `footprints`, `sailboat` per la pagina Dove siamo.

### D. Mockup (Claude Design, alta fedeltà)

- [x] D1. Le nove schermate mobile in alta fedeltà con le foto segnaposto di §11 e il copy del brief §8 (italiano).
- [x] D2. Home desktop in due varianti di hero (§7, decisione 4): A — due colonne, testo a sinistra e foto 4:3 a destra; B — foto a tutta larghezza con altezza massima 55 vh e testo sotto. Scelta la A.
- [x] D3. Le altre quattro schermate desktop: Pane e prodotti, La storia, La tiella, Dove siamo.
- [x] D4. Due schermate mobile in tedesco (Home e Ordini): sono i testi più lunghi e scoprono i titoli che vanno a capo male e le etichette che non entrano nei bottoni.
- [x] D5. Scheda degli stati in alta fedeltà: bottoni (normale, hover, focus, attivo), OpenNow (cinque stati), menu aperto, riga "oggi" nella tabella orari, chip di stagione, card senza foto.
- [x] D6. Immagine Open Graph 1200 × 630 (foto del banco, logo nell'angolo in basso a destra su campo crema, nessun testo) e favicon/icona 512 px dal marchio scontornato.

### E. Revisione

- [ ] E1. Critica di design sulle schermate (checklist §10.2); correggere e aggiornare i mockup.
- [ ] E2. Verifica di accessibilità sui mockup (checklist §10.3), in particolare contrasto dei testi sul crema scuro e dimensione dei bersagli.
- [ ] E3. Verifica dei contenuti: ogni testo nei mockup esiste nel brief §8 o è un segnaposto `[[...]]`; nessun prezzo, orario o superlativo inventato dal mockup.
- [ ] E4. Stima del peso di ogni pagina contando le immagini (§6.6) prima che Claude Code la costruisca.

### F. Consegna a Claude Code e pubblicazione

- [x] F1. Esportato da Claude Design: ogni tavola in PNG a 2× e in HTML autonomo, i token come CSS (`design/tokens.css`), le anteprime dei componenti (`design/components/`), font, icone, logo e foto dei mockup con nomi parlanti.
- [x] F2. Scritto `design/HANDOFF.md` con la tabella schermata → file, i comportamenti non visibili nei PNG e le differenze volute (§9.1).
- [x] F3. `BRIEF.md`, `DESIGN.md`, `CLAUDE.md` e la cartella `design/` nel repository.
- [ ] F4. Comprare i domini (`panificiodeconca.it`, `.com`, `ilfornaiodeconca.it`) e portare i nameserver su Cloudflare; non collegarli ancora al sito (§9.3).
- [ ] F5. Lanciare Claude Code con il prompt di §9.2: repository GitHub, fondamenta, componenti, pagine una alla volta con confronto screenshot-vs-mockup, verifiche, push.
- [ ] F6. Nel pannello Cloudflare collegare il repository (Workers Builds), impostare `SITE_URL` e `SITE_PHASE=preview`, pubblicare in anteprima e dare l'indirizzo `workers.dev` al titolare (passi in §9.3).
- [ ] F7. Raccogliere i dati del brief §10 e scattare le foto del brief §9; sostituire segnaposti e foto con commit normali; far rileggere inglese e tedesco a persone madrelingua.
- [ ] F8. Passare alla fase online: `SITE_PHASE=live`, dominio collegato, redirect dai domini secondari, checklist del brief §11 e §10.4 di questo documento.
- [ ] F9. Dopo la build, riportare i componenti reali nel design system con `/design-sync` (§9.4).

## 3. Principi di design (regole misurabili)

Ogni principio ha un criterio che si può verificare su un mockup o su una pagina costruita.

1. **Un solo lavoro.** Il sito esiste per far squillare il telefono il giorno prima. Criterio: su ogni pagina "Chiama e prenota" è visibile senza scorrere, e la regola della prenotazione compare almeno una volta in forma di frase intera.
2. **Tre secondi.** Chi arriva da Google deve capire cosa vende, se è aperto e dove si trova. Criterio: sopra la piega mobile (660 px) ci sono H1, sottotitolo e, in Home, Contatti e Dove siamo, lo stato OpenNow.
3. **Una mano.** Il 70 % delle visite arriva da telefoni in strada. Criterio: le due azioni principali stanno nella CtaBar fissa in basso; nessun bersaglio essenziale sopra i 2/3 dello schermo; bersagli ≥ 44 × 44 px ([WCAG 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)).
4. **Contenuto prima della cornice.** Niente caroselli, niente animazioni d'ingresso, niente banner. Criterio: il primo elemento dopo l'header è contenuto (foto o H1), mai un elemento decorativo.
5. **Il testo non sta mai sopra le foto.** Così non servono gradienti o veli, il contrasto è garantito e le foto restano intere. Criterio: nessun layer di testo sovrapposto a un'immagine in nessun mockup.
6. **Tre lingue, uno stesso layout.** Il tedesco è più lungo del 20–30 % e ha parole lunghe (`Feiertagsöffnungszeiten`). Criterio: ogni componente regge la stringa tedesca più lunga senza troncare né uscire dal contenitore; `hyphens: auto` attivo con `lang` corretto.
7. **Le parole, non i colori, portano l'informazione.** Nessun verde/rosso per aperto/chiuso. Criterio: ogni stato è leggibile anche in bianco e nero.
8. **Un accento, nessun effetto.** Rosso del logo come unico accento; niente gradienti, ombre, vetri, angoli morbidi oltre 4 px. Criterio: la scheda token non contiene ombre né gradienti.
9. **Budget di peso.** Home < 600 KB, LCP < 1,5 s su 4G. Criterio: §6.6, conteggio immagini per pagina fatto sui mockup.
10. **Accessibilità AA** ([WCAG 2.1](https://www.w3.org/TR/WCAG21/)). Criterio: contrasto ≥ 4,5:1 per il testo normale e ≥ 3:1 per il testo grande e per i bordi dei controlli; focus visibile su ogni elemento interattivo; ordine di tabulazione uguale all'ordine visivo.

## 4. Chi usa il sito e cosa deve trovare

| Scenario | Da dove arriva | Pagina d'ingresso | Cosa deve vedere in tre secondi | Azione riuscita |
| --- | --- | --- | --- | --- |
| Turista in strada che cerca "tiella di Gaeta" | Google, telefono, 4G | La tiella | Foto della tiella, cos'è, "a fette o intera", Chiama / Indicazioni | Tocca Indicazioni o chiama per prenotare |
| Gaetano che vuole le frittatine per domani | Ricorda il nome, telefono | Home o Ordini | La regola "chiama il giorno prima e dì a che ora passi", il numero | Chiama |
| Famiglia in vacanza che cerca "bakery Gaeta" / "Bäckerei Gaeta" | Google in inglese o tedesco | Home EN/DE | H1 nella propria lingua, OpenNow, cosa trova al banco | Tocca Indicazioni; torna il giorno dopo |
| Chi cerca gli orari | Google ("panificio de conca orari") | Contatti o Dove siamo | Stato OpenNow, tabella settimanale, orari speciali | Legge e basta (anche questo è un successo) |
| Bar, B&B, barca che cerca un fornitore | Passaparola, poi il sito | Ordini | Sezione "Bar, ristoranti, B&B e hotel" o "Barche" con il numero | Chiama |
| Chi legge la storia (stampa, scuola, curiosi) | Social, link | La storia | Timeline con date e foto d'epoca, fonti | Condivide o visita |

Nessuno scenario passa dal menu: le pagine sono tutte pagine d'ingresso. Per questo il menu su mobile può stare dietro un bottone "Menu" ([Nielsen Norman Group](https://www.nngroup.com/articles/hamburger-menus/) misura il costo dei menu nascosti, ma qui la navigazione tra pagine è secondaria rispetto a Chiama e Indicazioni) mentre la CtaBar è sempre visibile.

## 5. Struttura delle pagine e wireframe

Tutte le pagine usano un solo template: **Header · [foto, solo in Home] · H1 · sottotitolo · [OpenNow] · riga CTA (desktop) · sezioni H2 · blocco "Vieni a trovarci" · Footer**, più la CtaBar fissa su mobile. Le schermate sono descritte a 390 px di larghezza; i wireframe vanno disegnati con i testi del brief §8, non con "lorem ipsum".

### 5.1 Elementi comuni

**Header mobile (56 px, non fisso: scorre via per lasciare spazio al contenuto)**

```
┌──────────────────────────────────────────┐
│ [logo 32px] Panificio De Conca   ☎  Menu │
└──────────────────────────────────────────┘
```

- Il logo porta alla home della lingua corrente. "☎" è un bottone 44 × 44 con `tel:`. "Menu" è testo + icona, apre il foglio di navigazione.

**Foglio di navigazione (a tutto schermo, da destra)**

```
┌──────────────────────────────────────────┐
│ Panificio De Conca                    ✕  │
│                                          │
│  Home                                    │
│  La storia                               │
│  La tiella                               │
│  Pane e prodotti                         │
│  Ordini                                  │
│  Dove siamo                              │
│  Contatti                                │
│                                          │
│  ───────────────────────────             │
│  Lingua   IT · EN · DE                   │
│  ☎ 0771 460651                           │
└──────────────────────────────────────────┘
```

- Voci in Fraunces 28 px, altezza riga 56 px. La voce corrente ha `aria-current="page"` e un trattino rosso a sinistra. Senza JavaScript il bottone "Menu" è un link a `#menu`, la navigazione ripetuta nel footer.

**Header desktop (72 px)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [logo] Panificio De Conca   La storia  La tiella  Pane e prodotti  Ordini   │
│                             Dove siamo  Contatti      IT·EN·DE  ☎ 0771 460651│
└─────────────────────────────────────────────────────────────────────────────┘
```

**CtaBar (mobile, fissa in basso, 84 px + area sicura)**

```
┌──────────────────────────────────────────┐
│  Prenota il giorno prima e dicci a che   │  ← 13 px, ink-soft
│  ora passi                               │
│ ┌──────────────────────┐ ┌─────────────┐ │
│ │ ☎ Chiama e prenota   │ │ ⌖ Indicazioni│ │  ← 48 px, primario / secondario
│ └──────────────────────┘ └─────────────┘ │
└──────────────────────────────────────────┘
```

- Su desktop la barra non esiste: gli stessi due bottoni e la riga di microcopy stanno sotto il sottotitolo (riga CTA) e nel blocco "Vieni a trovarci".
- Il `body` ha un `padding-bottom` pari all'altezza della barra, così il footer resta leggibile.
- In stampa la barra è nascosta.

**Blocco "Vieni a trovarci" (chiude ogni pagina)**

```
┌──────────────────────────────────────────┐
│ Vieni a trovarci                    (H2) │
│ ◷ Aperto oggi 7:30–13:15 e 16:30–20:00   │
│ Lungomare Caboto [[CIVICO]], Gaeta       │
│ nel quartiere medievale, di fronte alla  │
│ base. Parcheggio sul lungomare.          │
│ [Orari completi]  [Indicazioni]          │
└──────────────────────────────────────────┘
```

**Footer (sfondo paper-deep)**

Tre colonne su desktop, impilate su mobile: (1) logo, "Panificio a Gaeta dal 1922", ragione sociale, P.IVA, REA; (2) indirizzo, telefono, link Facebook e Instagram; (3) navigazione (`id="menu"`), "Note legali e privacy", selettore lingua. Testo 15 px.

### 5.2 Home (mobile)

```
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────────────────────────────────┤
│ ████████████████████████████████████████ │
│ ██ FOTO 1 facciata, 3:2 (390×260) ██████ │
│ ████████████████████████████████████████ │
├──────────────────────────────────────────┤
│ Il forno del lungomare di Gaeta,    (H1) │
│ dal 1922                                 │
│ Pane, tiella di Gaeta, pizzette e dolci  │
│ delle feste. Tre generazioni, stesso     │
│ forno, stesso locale di fronte al mare.  │
│ ◷ Aperto oggi 7:30–13:15 e 16:30–20:00   │
│ · · · · · · · · · piega 660 px · · · · · │
├──────────────────────────────────────────┤
│ Cosa trovi al banco                 (H2) │
│ ┌─────────────┐ ┌─────────────┐          │
│ │ FOTO 8 4:3  │ │ FOTO 4 4:3  │          │
│ │ Pane di     │ │ Tiella di   │          │
│ │ giornata    │ │ Gaeta       │          │
│ │ una riga…   │ │ una riga…   │          │
│ └─────────────┘ └─────────────┘          │
│ ┌─────────────┐ ┌─────────────┐          │
│ │ FOTO 7      │ │ FOTO 10     │          │
│ │ Pizzette    │ │ Ciambelline │          │
│ └─────────────┘ └─────────────┘          │
│ ┌─────────────┐ ┌─────────────┐          │
│ │ FOTO 12     │ │ FOTO 16     │          │
│ │ Cornetti    │ │ Dolci feste │          │
│ └─────────────┘ └─────────────┘          │
│ Tutti i prodotti →                       │
├──────────────────────────────────────────┤
│ Dal 1922, nello stesso locale       (H2) │
│ ████ FOTO 21 d'epoca, b/n, 3:2 ████████  │
│ didascalia: anno e soggetto              │
│ Almerindo De Conca tornò dall'America…   │
│ Leggi la storia →                        │
├──────────────────────────────────────────┤
│ ┃ Prenota oggi, ritira domani       (H2) │
│ ┃ Calzoncini, frittatine di patate…      │  ← OrderRule: bordo sinistro rosso
│ ┃ [☎ Chiama e prenota]                   │
│ ┃ Come prenotare →                       │
├──────────────────────────────────────────┤
│ Vieni a trovarci                         │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
│ CtaBar fissa                             │
```

Sei card prodotto in Home (due colonne, foto 4:3), non diciotto: le sei voci del copy §8.3.

### 5.3 Home (desktop, 1440, contenitore 1120)

Variante A, due colonne:

```
┌──────────────────────────────────────────────────────────────────────┐
│ Header                                                               │
├──────────────────────────────────────────────────────────────────────┤
│ Il forno del lungomare        │ ████████████████████████████████████ │
│ di Gaeta, dal 1922       (H1) │ ██ FOTO 1 facciata 4:3 (640×480) ███ │
│ Pane, tiella di Gaeta…        │ ████████████████████████████████████ │
│ ◷ Aperto oggi …               │ ████████████████████████████████████ │
│ [☎ Chiama e prenota] [⌖ Indic.]│ ████████████████████████████████████ │
│ Prenota il giorno prima…      │ ████████████████████████████████████ │
├──────────────────────────────────────────────────────────────────────┤
│ Cosa trovi al banco                                             (H2) │
│ [card] [card] [card]                                                 │
│ [card] [card] [card]                                                 │
├──────────────────────────────────────────────────────────────────────┤
│ Dal 1922, nello stesso locale │ FOTO 21 b/n                          │
├──────────────────────────────────────────────────────────────────────┤
│ ┃ Prenota oggi, ritira domani (OrderRule a tutta larghezza)          │
├──────────────────────────────────────────────────────────────────────┤
│ Vieni a trovarci (orari | indirizzo | bottoni)                       │
├──────────────────────────────────────────────────────────────────────┤
│ Footer in tre colonne                                                │
└──────────────────────────────────────────────────────────────────────┘
```

Variante B: foto a tutta larghezza (1440 × max 55 vh, `object-fit: cover`), poi la stessa colonna testo della variante A centrata a 720 px. Le due varianti si confrontano sui mockup (§2, D2).

### 5.4 Template "pagina di contenuto": La tiella, Ordini, Note legali

```
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────────────────────────────────┤
│ La tiella di Gaeta                  (H1) │
│ Due sfoglie sottili, un ripieno di mare  │
│ o di orto, il forno. La facciamo dal 1922│
│ ████ FOTO 4 tiella intera, 3:2 ████████  │
│ · · · · · · · · · piega 660 px · · · · · │
├──────────────────────────────────────────┤
│ Cos'è                               (H2) │
│ La tiella è la pizza ripiena di Gaeta…   │
├──────────────────────────────────────────┤
│ I nostri ripieni                    (H2) │
│ ┌─────────────┐ ┌─────────────┐          │
│ │ FOTO 5      │ │ FOTO 6      │          │
│ │ Polpo       │ │ Cipolla     │          │
│ └─────────────┘ └─────────────┘          │
│ ▭ I ripieni cambiano con la stagione…    │  ← nota in paper-deep
├──────────────────────────────────────────┤
│ Quando la trovi e quanto costa      (H2) │
│ Tutti i giorni di apertura…              │
│ A fetta [[PREZZO]] · intera [[PREZZO]]   │
├──────────────────────────────────────────┤
│ Come portarla via                   (H2) │
├──────────────────────────────────────────┤
│ ┃ OrderRule (tielle intere su prenotaz.) │
├──────────────────────────────────────────┤
│ Vieni a trovarci · Footer                │
└──────────────────────────────────────────┘
```

- **Ordini**: stessa struttura senza foto sotto il sottotitolo (il numero di telefono grande prende quel posto: Fraunces 36 px, link `tel:`); sei sezioni H2 del brief §8.7, di cui la prima ("Il fresco si prenota il giorno prima") è resa come OrderRule con bottone, perché qui è il contenuto principale; la sezione "Feste e ricorrenze" ha il link al listino PDF come bottone secondario.
- **Note legali**: H1 e testo, nessuna foto, nessuna CtaBar in alto (la barra fissa resta).
- Su desktop la colonna di testo è centrata a 720 px (misura 60–65 caratteri), le griglie di foto a 2 colonne restano a 2 colonne dentro i 720 px.

### 5.5 Pane e prodotti

```
┌──────────────────────────────────────────┐
│ Pane, pizzette e dolci              (H1) │
│ Tutto quello che vendiamo esce dal       │
│ nostro forno. La lista cambia…           │
│ [Pane] [Salato] [Colazione] [Biscotti]   │  ← link ancora alle sezioni, scorrevoli
│ [Dolci] [Feste]                          │
├──────────────────────────────────────────┤
│ Pane                                (H2) │
│ ┌─────────────┐ ┌─────────────┐          │
│ │ FOTO 8      │ │ FOTO 9      │          │
│ │ Pane di     │ │ Pane senza  │          │
│ │ giornata    │ │ lievito     │          │
│ │ Filoni e…   │ │ Solo il…    │          │
│ │ al chilo    │ │ ▢ Su prenot.│          │  ← chip di stagione/prenotazione
│ └─────────────┘ └─────────────┘          │
│ ┌─────────────┐                          │
│ │ (senza foto)│                          │
│ │ Freselle e  │                          │  ← variante text-only
│ │ taralli     │                          │
│ └─────────────┘                          │
├──────────────────────────────────────────┤
│ Salato (H2) … 6 card                     │
│ Colazione (H2) … 2 card                  │
│ Biscotti (H2) … 3 card                   │
│ Dolci (H2) … 1 card                      │
│ Feste (H2) … 3 card con chip di stagione │
├──────────────────────────────────────────┤
│ ┃ OrderRule                              │
│ Vieni a trovarci · Footer                │
└──────────────────────────────────────────┘
```

- Griglia: 2 colonne a 390, 3 a 768, 4 a 1200. Le card non sono link (nessuna pagina prodotto): solo la card Tiella porta alla pagina dedicata e lo mostra con la freccia "→".
- I link di categoria in alto sono ancore (`#pane`, `#salato`…) e scorrono con `scroll-margin-top`; non sono tab.

### 5.6 La storia

```
┌──────────────────────────────────────────┐
│ Cento anni di pane sul lungomare    (H1) │
│ Dal 4 aprile 1922 il forno non ha mai    │
│ cambiato indirizzo.                      │
├──────────────────────────────────────────┤
│ ●  1922                                  │  ← anno in Fraunces 28 px, brand-deep
│ │  Almerindo De Conca torna dall'America…│
│ │  ████ FOTO 21 fondatori, b/n ████████  │
│ │  didascalia                            │
│ ●  Dopoguerra                            │
│ │  Il forno riapre…                      │
│ ●  1958                                  │
│ │  ████ FOTO 2 insegna storica, b/n ███  │
│ ●  1965                                  │
│ ●  2005                                  │
│ ●  2022                                  │
│ │  ████ FOTO 22 pergamena ████████████   │
│ ●  Oggi                                  │
│ │  ████ FOTO 20 famiglia ██████████████  │
├──────────────────────────────────────────┤
│ ▭ Fonti: Il Messaggero · Lazio Sette     │  ← SourcesBox
├──────────────────────────────────────────┤
│ Vieni a trovarci · Footer                │
└──────────────────────────────────────────┘
```

- Linea verticale a 24 px dal bordo, punto pieno in rosso del logo per ogni voce, testo rientrato di 48 px. Su desktop la colonna degli anni è a sinistra (160 px) e il testo a destra (560 px); le foto stanno nella colonna del testo.
- Le foto d'epoca sono convertite in bianco e nero nei file, non con un filtro CSS, così sono uguali ovunque (anche nelle anteprime social).

### 5.7 Dove siamo

```
┌──────────────────────────────────────────┐
│ Sul lungomare, nel quartiere        (H1) │
│ medievale                                │
│ ████ FOTO 1 facciata, 3:2 ████████████   │
│ Lungomare Giovanni Caboto [[CIVICO]]     │
│ 04024 Gaeta (LT) — angolo Salita Porta   │
│ di Terra, di fronte alla base            │
│ [⌖ Google Maps]  [⌖ Apple Maps]          │
├──────────────────────────────────────────┤
│ 🚗 In auto                          (H2) │
│ Parcheggio lungo il Lungomare Caboto…    │
│ 🚆 In treno                         (H2) │
│ 🚶 A piedi                          (H2) │
│ ⛵ In barca                         (H2) │
├──────────────────────────────────────────┤
│ ████ FOTO 24 lungomare con la base ████  │
├──────────────────────────────────────────┤
│ Vieni a trovarci · Footer                │
└──────────────────────────────────────────┘
```

- Le icone dei quattro modi sono `car`, `train-front`, `footprints`, `sailboat` (§2, C4). Nessuna mappa incorporata.

### 5.8 Contatti

```
┌──────────────────────────────────────────┐
│ Contatti                            (H1) │
│ ☎ 0771 460651                            │  ← Fraunces 36 px, link tel:
│ ◷ Aperto oggi 7:30–13:15 e 16:30–20:00   │
├──────────────────────────────────────────┤
│ Orari                               (H2) │
│ ▭ Orari delle feste: 9 nov – 11 gen …    │  ← solo se special_hours attivi
│ ┌────────────┬───────────────────────┐   │
│ │ Lunedì     │ 7:30–13:15 · 16:30–20 │   │
│ │ Martedì    │ …                     │   │
│ │ Giovedì    │ 7:30–13:15 · 17–20    │   │
│ │ Domenica   │ Chiuso                │   │
│ │ ▸ oggi     │ (riga evidenziata)    │   │
│ └────────────┴───────────────────────┘   │
├──────────────────────────────────────────┤
│ Indirizzo                           (H2) │
│ … [Google Maps] [Apple Maps]             │
├──────────────────────────────────────────┤
│ Social (H2)  Facebook · Instagram        │
│ Non abbiamo un modulo di contatto: al    │
│ telefono siamo più veloci.               │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

### 5.9 404

H1 trilingue in tre blocchi ("Pagina non trovata / Page not found / Seite nicht gefunden"), ciascuno con una riga e il link alla home della lingua; sotto, il numero di telefono. Nessuna foto. La CtaBar resta.

## 6. Design system: token e componenti

I valori sono pronti per `design/tokens.css` e per il design system in Claude Design. Nomi in inglese perché finiscono nel codice.

### 6.1 Colori (contrasti verificati)

| Token | Valore | Uso | Origine |
| --- | --- | --- | --- |
| `--color-brand` | `#DF2329` | Bottoni primari, marchio, punti della timeline, titoli H1 in Home | Campionato dal rosso del logo (mediana dei pixel rossi) |
| `--color-brand-deep` | `#B3181F` | Link nel testo, hover e stato attivo dei bottoni, anni della timeline | Derivato: stesso tono, più scuro per il testo a corpo piccolo |
| `--color-ink` | `#2A1A14` | Testo, titoli | Dal bruno del tratto del logo (`#3B1F23`), portato verso il nero per il testo lungo |
| `--color-ink-soft` | `#6B4E3A` | Testo secondario, didascalie, microcopy della CtaBar | Derivato |
| `--color-paper` | `#FBF6EC` | Sfondo di pagina | "Carta da pane" |
| `--color-paper-deep` | `#F2E8D5` | Card, note, footer, riga "oggi", sfondo delle sezioni alternate | Derivato |
| `--color-line` | `#DCCFB6` | Bordi di card e tabelle (1 px) | Derivato |
| `--color-focus` | `#2A1A14` | Anello di focus (3 px, offset 2 px) | = ink: visibile su crema e su rosso |

Contrasti ([WebAIM](https://webaim.org/resources/contrastchecker/)):

| Coppia | Rapporto | Esito |
| --- | --- | --- |
| ink su paper | 15,5 : 1 | AAA |
| ink su paper-deep | 13,8 : 1 | AAA |
| ink-soft su paper | 7,0 : 1 | AAA |
| ink-soft su paper-deep | 6,2 : 1 | AA |
| brand-deep su paper | 6,4 : 1 | AA (link e testo rosso a corpo normale) |
| brand-deep su paper-deep | 5,6 : 1 | AA |
| brand su paper | 4,4 : 1 | solo testo grande (≥ 24 px, o ≥ 19 px in grassetto) |
| bianco su brand | 4,8 : 1 | AA; nei bottoni il testo è 18 px grassetto, quindi "grande" |
| bianco su brand-deep | 6,9 : 1 | AA |

Regole: il rosso pieno (`brand`) si usa per riempire i bottoni e per i titoli grandi, mai per testo a 18 px; i link nel testo usano `brand-deep` con sottolineatura (il colore da solo non basta). Nessun verde, nessun grigio freddo. Nessuna modalità scura nella versione 1: `color-scheme: light` dichiarato.

### 6.2 Tipografia

| Token | Valore |
| --- | --- |
| `--font-display` | `"Fraunces Variable", Georgia, "Times New Roman", serif` — [Fraunces](https://fonts.google.com/specimen/Fraunces) ([sorgente](https://github.com/undercasetype/Fraunces), SIL OFL), self-hosted via [Fontsource](https://fontsource.org/fonts/fraunces), sottoinsieme latino, assi `opsz` 9–144 e `wght` 500–800, `SOFT` 50 per avvicinarsi alle lettere morbide del logo |
| `--font-text` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--text-body` | 18 px / 1,55 (mobile e desktop) |
| `--text-small` | 15 px / 1,5 (didascalie, footer, chip) |
| `--text-micro` | 13 px / 1,4 (solo la riga della CtaBar) |
| `--text-h1` | Fraunces 36 px / 1,1 mobile · 56 px / 1,05 desktop, peso 700 |
| `--text-h2` | Fraunces 28 px / 1,15 mobile · 36 px desktop, peso 600 |
| `--text-h3` | Fraunces 22 px / 1,25 · 24 px desktop, peso 600 |
| `--text-number` | Fraunces 36 px, peso 700, `font-variant-numeric: tabular-nums` (telefono grande, anni) |
| Misura | 60–65 caratteri (`max-width: 65ch` sul testo corrente) |

Il font dei titoli si carica con `font-display: swap` e un fallback con `size-adjust` per limitare il salto di layout; il font di sistema per il testo non costa nulla. Font loading e ottimizzazione: [guida Astro](https://docs.astro.build/en/guides/fonts/).

### 6.3 Spaziature, raggi, bordi

- Base 4 px. Scala: `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 24 · `-6` 32 · `-7` 48 · `-8` 64 · `-9` 96.
- Gutter di pagina: 20 px mobile, 32 px tablet, auto su desktop con contenitore 1120 px; colonna di testo 720 px.
- Spazio tra sezioni: 48 px mobile, 96 px desktop.
- Raggi: 4 px su bottoni e card, 2 px su chip, 0 sulle foto a tutta larghezza.
- Bordi: 1 px `--color-line`. Nessuna ombra, nessun gradiente.

### 6.4 Breakpoint e griglia

| Nome | Larghezza | Griglia | Si disegna a |
| --- | --- | --- | --- |
| mobile | < 600 px | 1 colonna, card a 2 colonne | 390 × 844; si verifica a 360 × 640 |
| tablet | 600–1023 px | contenuto a 720 px, card a 3 colonne | 768 × 1024 (solo verifica) |
| desktop | ≥ 1024 px | contenitore 1120 px, 12 colonne da 75 px con gutter 20, card a 4 colonne | 1440 × 900 |

### 6.5 Componenti

| Componente | Varianti | Stati | Contenuto | Note |
| --- | --- | --- | --- | --- |
| `Button` | primario (riempito brand, testo bianco 18 px grassetto), secondario (bordo 2 px ink, testo ink), link con freccia | normale, hover (brand-deep / paper-deep), focus (anello), attivo | icona 24 px + etichetta | Altezza 48 px, padding orizzontale 20 px, larghezza minima 44 px; su mobile i due bottoni della CtaBar dividono la larghezza 60/40 |
| `Header` | mobile, desktop | menu chiuso/aperto; voce corrente | logo, nav, lingua, telefono | Non fisso. Skip link "Vai al contenuto" come primo elemento focusabile |
| `NavSheet` | — | aperto/chiuso | 7 voci, lingua, telefono | `<dialog>` modale; chiusura con ✕, Esc e tocco fuori; focus intrappolato; fallback `#menu` |
| `LangSwitch` | header, foglio, footer | lingua corrente (`aria-current`, sottolineata) | IT · EN · DE | Ogni voce ha `lang` e `hreflang`; porta alla stessa pagina |
| `CtaBar` | mobile (fissa), riga CTA (desktop e blocco finale) | — | microcopy + 2 bottoni | `position: fixed; bottom: 0`, `padding-bottom: env(safe-area-inset-bottom)` |
| `OpenNow` | — | aperto oggi (fasce); chiuso ora, riapre oggi alle…; chiuso oggi, riapre domani alle…; orari speciali in vigore (con etichetta "Orari delle feste"); senza JS (fasce della settimana, statiche) | icona clock + testo | Calcolo nel fuso `Europe/Rome`; `aria-live="polite"` solo al primo render |
| `OrderRule` | con bottone, senza bottone | — | frase della regola + telefono | Bordo sinistro 4 px brand, sfondo paper-deep, padding 24 px |
| `ProductCard` | con foto 4:3, senza foto (text-only), con chip, con link (solo Tiella) | hover solo sulla variante con link | foto, nome (Fraunces 22), una riga, prezzo "da 1,20 €" | Nessun bottone dentro la card; prezzo solo se presente nel contenuto |
| `SeasonTag` | Natale, Pasqua, Carnevale, su prenotazione | — | testo 13 px maiuscoletto | Chip con bordo, nessun colore pieno |
| `StoryTimeline` + `TimelineItem` | con foto, senza foto | — | anno, testo, figura con didascalia | Linea 2 px `--color-line`, punto 12 px brand |
| `Figure` | 3:2, 4:3, 4:5, d'epoca (b/n) | — | immagine + `figcaption` 15 px ink-soft | `loading="lazy"` tranne la prima foto della pagina, che ha `fetchpriority="high"` |
| `HoursTable` | — | riga "oggi" | 7 righe + blocco orari speciali sopra | `<table>` vero con `<th scope="row">`; la riga di oggi ha sfondo paper-deep e il testo "oggi" |
| `Directions` | — | — | foto, indirizzo, 2 link mappe, 4 sezioni | Nessun iframe |
| `MapLinks` | due bottoni (pagina), un bottone (CtaBar) | — | Google Maps, Apple Maps | Regola in §7, decisione 6 |
| `SourcesBox` | — | — | etichetta "Fonti" + link | Sfondo paper-deep, testo 15 px |
| `Callout` | nota | — | testo breve | Per "I ripieni cambiano con la stagione…" e "Orari delle feste" |
| `Footer` | — | — | tre colonne | `id="menu"` sulla nav |
| `VisitBlock` | — | — | H2, OpenNow, indirizzo, 2 bottoni | Chiude ogni pagina tranne 404 e Note legali |

### 6.6 Budget di peso per pagina

| Pagina | Immagini sopra la piega | Immagini totali | Stima (WebP, font compreso) |
| --- | --- | --- | --- |
| Home | 1 hero 780 px (≈ 70 KB) | 8 | ≈ 340 KB |
| Pane e prodotti | 0 | 18 (card 400 px, ≈ 18 KB l'una, lazy) | ≈ 420 KB |
| La storia | 0 | 5 (b/n, 720 px) | ≈ 260 KB |
| La tiella | 1 | 3 | ≈ 220 KB |
| Dove siamo | 1 | 2 | ≈ 200 KB |
| Ordini, Contatti, Note legali, 404 | 0 | 0–1 | ≈ 110 KB |

Il font variabile pesa circa 70 KB nel sottoinsieme latino; HTML + CSS sotto i 40 KB. Tutte le pagine stanno nei 600 KB del brief con margine. Misura su [PageSpeed Insights](https://pagespeed.web.dev/).

## 7. Decisioni di design

| # | Decisione | Scelta | Perché | Alternativa scartata |
| --- | --- | --- | --- | --- |
| 1 | Navigazione mobile | Bottone "Menu" con etichetta visibile, foglio a tutto schermo | Nessuno scenario passa dal menu; le azioni primarie stanno nella CtaBar; l'etichetta evita l'icona ambigua | Tab bar in basso: ruberebbe lo spazio alla CtaBar |
| 2 | Header | Non fisso | Su un telefono i 56 px dell'header fissi più gli 84 della CtaBar lascerebbero poco al contenuto | Header fisso compatto: utile solo su siti con molte pagine |
| 3 | Hero mobile | Foto 3:2 sopra l'H1, testo sotto su crema | Una foto 4:5 spingerebbe l'H1 sotto la piega; il testo sopra la foto obbligherebbe a un velo scuro | Testo sovrapposto con gradiente: vietato dal brief e dalla regola 5 |
| 4 | Hero desktop | Variante A: due colonne, testo a sinistra e foto 4:3 a destra | Tiene l'H1 sopra la piega a 1440 × 900 e regge le foto a bassa risoluzione di oggi; i mockup includono anche la B | B (foto a tutta larghezza, max 55 vh): da riconsiderare quando esiste la foto vera della facciata, più vicina a "una foto a tutta larghezza" del brief |
| 5 | Microcopy della CtaBar | Riga di 13 px sopra i bottoni, sempre presente | Il brief la vuole sotto il bottone; nella barra fissa sta meglio sopra, dove non viene coperta dal pollice | Solo nella hero: si perderebbe nelle pagine interne |
| 6 | Bottone "Indicazioni" nella CtaBar | Un solo bottone, link Google Maps universale; con JavaScript, su iOS e iPadOS l'`href` diventa Apple Maps | Un bottone unico è più semplice; Google Maps funziona ovunque anche senza app; Apple Maps è l'app predefinita su iPhone | Foglio di scelta "Google / Apple": un tocco in più per tutti; `geo:` non funziona su iOS |
| 7 | Stato aperto/chiuso | Solo testo con icona clock, nessun colore semantico | Un solo accento nel sistema; leggibile da chi non distingue i colori; lo stato speciale ("Orari delle feste") non avrebbe un colore ovvio | Punto verde/rosso |
| 8 | Font dei titoli | Fraunces | Il logo ha lettere morbide e pesanti: Fraunces con `SOFT` alto le richiama senza imitarle; un solo file variabile | Source Serif 4: più neutro, meno "forno" |
| 9 | Card prodotto | Non cliccabili (tranne Tiella) | Non esistono pagine prodotto; una card che sembra un link e non lo è delude | Card con link alla sezione: inutile |
| 10 | Prezzi | Mostrati solo se nel contenuto, con "da" e formato della lingua (`1,20 €` IT/DE, `€1.20` EN, via `Intl.NumberFormat`) | Niente prezzi inventati; il formato nella lingua giusta è un dettaglio che i turisti notano | Tabella prezzi: diventerebbe un listino da mantenere |
| 11 | Orari | Formato 24 h in tutte le lingue | È il formato del cartello in negozio e di Google; evita "7:30 am" | — |
| 12 | Telefono | `0771 460651` in italiano, `+39 0771 460651` in inglese e tedesco, sempre `tel:+390771460651` | Chi è all'estero deve vedere il prefisso | — |
| 13 | Foto d'epoca | Convertite in bianco e nero nei file | Coerenza ovunque, nessun filtro a runtime | `filter: grayscale()` |
| 14 | Movimento | Solo transizioni di colore ≤ 150 ms; `prefers-reduced-motion` rispettato | Contenuto prima della cornice | Animazioni allo scorrimento |
| 15 | Modalità scura | No | Le foto di pane su fondo nero perdono; un tema solo da mantenere | — |
| 16 | Icone | 11 icone Lucide come SVG inline | Nessuna dipendenza, nessuna richiesta di rete | Font icone |
| 17 | Selettore lingua | Codici "IT · EN · DE" con `aria-label` e `lang` per voce | Compatto, capito dai turisti; tre voci non giustificano un menu | Bandiere: non rappresentano lingue |

## 8. Prompt per Claude Design

I prompt sono in ordine. Ciascuno si incolla in una chat nuova dentro il Progetto "Panificio De Conca", così il brief e questo piano sono leggibili. Dopo ogni sessione: esportare, rileggere con la checklist §10, poi passare al prompt successivo.

### 8.1 Design system

```
Crea il design system "Panificio De Conca" e impostalo come predefinito.

Contesto: sito vetrina di un panificio di Gaeta fondato nel 1922, tre lingue, mobile first, nessun e-commerce. Tono: un forno di paese con cento anni di storia, caldo e concreto, non una pasticceria di lusso. Leggi la sezione 6 di `claude/piano-ux-ui-sito-panificio-deconca.md` (token, tipografia, spaziature, breakpoint, componenti) e la sezione 5 del brief `claude/brief-sito-panificio-deconca.md` (direzione di design).

Usa esattamente questi token:
- colori: brand #DF2329, brand-deep #B3181F, ink #2A1A14, ink-soft #6B4E3A, paper #FBF6EC, paper-deep #F2E8D5, line #DCCFB6, focus #2A1A14
- font: Fraunces (variabile, SOFT 50) per i titoli, font di sistema per il testo; corpo 18 px / 1,55; H1 36/56 px, H2 28/36 px, H3 22/24 px
- spaziature base 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96); raggi 4 px (chip 2 px); bordi 1 px line; nessuna ombra, nessun gradiente
- breakpoint: mobile < 600, tablet 600–1023, desktop ≥ 1024 con contenitore 1120 px e colonna di testo 720 px

Tre regole fisse nel README: un solo accento (il rosso del logo); niente gradienti né ombre; il testo non sta mai sopra le foto. Più la regola dei tre secondi: chi arriva deve capire cosa vende, se è aperto e dove si trova.

Componenti, ciascuno con anteprima e varianti/stati come da tabella 6.5 del piano: Button (primario, secondario, link con freccia; normale/hover/focus/attivo), Header (mobile, desktop), NavSheet, LangSwitch, CtaBar (mobile fissa, riga CTA desktop), OpenNow (cinque stati), OrderRule, ProductCard (con foto, senza foto, con chip, con link), SeasonTag, StoryTimeline/TimelineItem, Figure (3:2, 4:3, d'epoca b/n con didascalia), HoursTable (con riga "oggi"), MapLinks, SourcesBox, Callout, VisitBlock, Footer.

Testi di esempio nei componenti: usa le stringhe della sezione 8.1 del brief (nav, cta, hours, season). Icone: Lucide, 24 px, tratto 1,75 px: phone, map-pin, clock, arrow-right, menu, x, languages, car, train-front, footprints, sailboat.

Non inventare colori aggiuntivi, non usare verde o grigio freddo, non aggiungere ombre "da app".
```

### 8.2 Wireframe

```
Crea una Design chiamata "Wireframe Panificio De Conca" con i wireframe in bassa fedeltà del sito: grigi, rettangoli, testi veri. Usa il design system "Panificio De Conca" solo per le dimensioni (tipografia, spaziature, bersagli), non per i colori: tutto in scala di grigi.

Segui la sezione 5 di `claude/piano-ux-ui-sito-panificio-deconca.md` (struttura di ogni pagina, disegnata in ASCII) e prendi i testi dalla sezione 8 del brief `claude/brief-sito-panificio-deconca.md`, in italiano, segnaposti [[...]] compresi.

Artboard:
1. Scheda componenti: Header mobile chiuso, NavSheet aperto, Header desktop, CtaBar, OpenNow nei cinque stati, ProductCard nelle quattro varianti, OrderRule, un TimelineItem con foto, HoursTable con riga "oggi", VisitBlock, Footer.
2. Nove schermate mobile a 390 × 844, a tutta altezza (la pagina intera, non solo la prima schermata): Home, La storia, La tiella di Gaeta, Pane e prodotti, Ordini e forniture, Dove siamo, Contatti, Note legali, 404. Su ognuna traccia una linea tratteggiata a 660 px dall'alto con l'etichetta "piega".
3. Tre schermate desktop a 1440: Home (variante A, due colonne), Pane e prodotti, La storia.

Le foto sono rettangoli grigi con il numero e il soggetto della lista foto del brief (sezione 9), per esempio "FOTO 1 — facciata, 3:2". La CtaBar è sempre visibile in basso nelle schermate mobile. Nessun colore, nessuna foto vera, nessun testo inventato.
```

### 8.3 Mockup mobile

```
Partendo dai wireframe (Design "Wireframe Panificio De Conca") e dal design system "Panificio De Conca", crea una Design chiamata "Mockup Panificio De Conca" con le nove schermate mobile in alta fedeltà a 390 × 844, a tutta altezza: Home, La storia, La tiella di Gaeta, Pane e prodotti, Ordini e forniture, Dove siamo, Contatti, Note legali, 404.

Testi: sezione 8 del brief `claude/brief-sito-panificio-deconca.md`, in italiano, segnaposti [[...]] lasciati visibili in corsivo. Foto: usa le immagini allegate a questa chat secondo la tabella della sezione 11 di `claude/piano-ux-ui-sito-panificio-deconca.md`; dove manca la foto, un rettangolo paper-deep con il numero della foto del brief. Le foto d'epoca sono in bianco e nero con didascalia.

Vincoli: il testo non sta mai sopra le foto; un solo accento rosso; niente ombre né gradienti; bottoni alti 48 px; corpo 18 px; CtaBar fissa in basso con la riga "Prenota il giorno prima e dicci a che ora passi" sopra i due bottoni. In Home, Contatti e Dove siamo lo stato OpenNow è "Aperto oggi 7:30–13:15 e 16:30–20:00".

Aggiungi due schermate in tedesco (Home e Ordini) con i testi DE della sezione 8 del brief, per verificare che titoli, bottoni ed etichette reggano le stringhe più lunghe ("Anrufen und bestellen", "Feiertagsöffnungszeiten").
```

### 8.4 Mockup desktop

```
Nella stessa Design dei mockup mobile aggiungi le schermate desktop a 1440 × 900 (pagina intera): Home in due varianti di hero — A: due colonne con testo a sinistra (H1, sottotitolo, OpenNow, due bottoni, riga della regola) e foto 4:3 a destra; B: foto a tutta larghezza con altezza massima 55 vh e la stessa colonna di testo sotto, centrata a 720 px — poi Pane e prodotti (card a 4 colonne), La storia (anni a sinistra in una colonna da 160 px, testo e foto a destra), La tiella e Dove siamo (colonna di testo a 720 px).

Header desktop con navigazione orizzontale, selettore lingua "IT · EN · DE" e telefono; la riga CTA sostituisce la CtaBar. Footer in tre colonne. Stesse regole dei mockup mobile.
```

### 8.5 Stati, Open Graph, icona

```
Nella stessa Design aggiungi:
1. Una scheda degli stati in alta fedeltà: Button primario e secondario in normale/hover/focus/attivo; OpenNow nei cinque stati (aperto oggi; chiuso ora, riapre oggi alle 16:30; chiuso oggi, riapre domani alle 7:30; orari delle feste in vigore; versione statica senza JavaScript); NavSheet aperto con la voce corrente; HoursTable con la riga "oggi"; i quattro SeasonTag; ProductCard senza foto.
2. L'immagine Open Graph 1200 × 630: foto del banco, logo nell'angolo in basso a destra su un campo paper di 40 px, nessun testo.
3. L'icona del sito a 512 × 512: il marchio del logo (arco, spiga e pani) in ink su paper, senza testo, con margine del 12 %.
```

## 9. Consegna a Claude Code e pubblicazione

### 9.1 Cosa c'è nel repository

La cartella del repository (`panificio-de-conca`) parte con questi file; tutto il resto lo crea Claude Code.

```
panificio-de-conca/
├── BRIEF.md                   ← brief-sito-panificio-deconca.md
├── DESIGN.md                  ← questo documento
├── CLAUDE.md                  ← istruzioni di lavoro per Claude Code: stack, comandi, verifiche, regole
└── design/
    ├── HANDOFF.md             ← tabella schermata → file, comportamenti non visibili nei PNG, differenze volute
    ├── tokens.json · tokens.css · design-system.md
    ├── components/            ← bundle.css + 17 componenti (README e preview.html ciascuno)
    ├── fonts/ · icons/ · logo/
    ├── mockups/               ← 20 tavole: PNG a 2×, HTML autonomo, foto con nomi parlanti, manifest.json
    ├── wireframes/            ← 13 tavole in bassa fedeltà, stessa struttura
    └── foto-provvisorie/      ← archivio Facebook per tema (non entra nel build)
```

I token si scrivono una volta sola in `src/styles/tokens.css` come custom property, con gli stessi nomi del design system; `design/components/bundle.css` è già scritto sui token e si riprende quasi alla lettera in `src/styles/components.css`. CSS puro, senza Tailwind: il design system non ne ha bisogno e una dipendenza in meno è una manutenzione in meno.

### 9.2 Prompt di partenza per Claude Code

Sostituisce il prompt della sezione 13 del brief, che resta valido per tutto ciò che qui non è ripetuto.

```
Leggi per intero CLAUDE.md, BRIEF.md, DESIGN.md e design/HANDOFF.md. Il brief dice cosa dice il sito; DESIGN.md e la cartella design/ dicono come appare; HANDOFF.md dice come usare i file di design. Lavora una fase alla volta e fermati alla fine di ciascuna per mostrarmi il risultato.

Fase 0 — repository. Inizializza git su main, aggiungi .gitignore e un README.md breve (cos'è il sito, comandi, come si pubblica). Crea il repository privato su GitHub con `gh repo create` se gh è autenticato, altrimenti dammi i comandi da eseguire; fai il primo commit e il push.

Fase 1 — fondamenta. Progetto Astro 5 statico con i18n nativo, content collections e mappa delle rotte come da BRIEF.md §3–4. Copia design/tokens.css in src/styles/tokens.css e usalo ovunque: nessun colore, dimensione o spaziatura scritta a mano fuori da quel file. Self-hosta Fraunces da design/fonts/. Costruisci il layout di base (Header, NavSheet, CtaBar, Footer, VisitBlock) secondo DESIGN.md §5.1 e §6.5. Aggiungi wrangler.jsonc per Cloudflare Workers con asset statici (assets.directory = "./dist"), public/_headers con HSTS e intestazioni di sicurezza, e le variabili SITE_URL e SITE_PHASE (preview | live) lette a build time. Mostrami uno screenshot Playwright di una pagina vuota con il layout a 390 e a 1440.

Fase 2 — componenti. Implementa i componenti della tabella DESIGN.md §6.5 con tutte le varianti e gli stati, confrontandoli con design/components/<Nome>/preview.html e design/mockups/states.png. OpenNow e la riga "oggi" calcolano nel fuso Europe/Rome e hanno il fallback statico. Il bottone Indicazioni segue DESIGN.md §7, decisione 6. I segnaposti [[...]] sono resi come <mark class="todo"> quando SITE_PHASE=preview.

Fase 3 — pagine. Una pagina alla volta, nell'ordine Home, Tiella, Prodotti, Storia, Ordini, Dove siamo, Contatti, Note legali, 404, con i testi di BRIEF.md §8 copiati letteralmente nelle tre lingue, segnaposti compresi. Home desktop: variante A (design/mockups/desktop/home-a.png). Le foto sono quelle di design/mockups/html/assets/, copiate in src/assets/photos/ con gli stessi nomi; dove manca la foto, il rettangolo paper-deep con il numero della lista foto del brief. Per ogni pagina fai uno screenshot Playwright a 390 × 844 e a 1440 × 900 (pagina intera), confrontalo con design/mockups/ ed elenca le differenze; correggi quelle non previste in HANDOFF.md §5 prima di passare alla pagina successiva.

Fase 4 — verifica. Le pagine tedesche non troncano nessuna etichetta; Lighthouse mobile ≥ 95 su ogni pagina; contrasto AA; focus visibile; hreflang reciproci e x-default; JSON-LD valido; con SITE_PHASE=preview ogni pagina ha noindex e robots.txt blocca tutto; con SITE_PHASE=live la build fallisce se resta un [[ in dist/. Aggiungi lo script di verifica a npm run build, Lighthouse CI in GitHub Actions su ogni PR, e npm run shots per gli screenshot. Riporta i punteggi e le differenze residue rispetto ai mockup.

Fase 5 — pubblicazione in anteprima. Commit e push su main. Poi elenca passo per passo cosa devo fare nel pannello Cloudflare (Workers Builds collegato al repository GitHub, comando di build, comando di deploy, variabili SITE_URL e SITE_PHASE=preview, URL workers.dev risultante): tu non hai accesso al pannello. Quando ti confermo che la build è verde, rilancia Lighthouse sull'URL pubblicato e controlla che le pagine rispondano con noindex.

Non inventare testi, prezzi, orari, ripieni o colori. Se un mockup e il brief si contraddicono, vale il brief per i contenuti e DESIGN.md per l'aspetto: segnalamelo invece di scegliere da solo.
```

### 9.3 Pubblicazione in due fasi

Il sito si costruisce per intero e si pubblica subito, così il titolare lo vede sul telefono mentre si raccolgono i dati mancanti e si scattano le foto; i testi e le foto definitive arrivano dopo, con commit normali. La variabile `SITE_PHASE` separa le due fasi:

| | Fase **anteprima** (`SITE_PHASE=preview`) | Fase **online** (`SITE_PHASE=live`) |
| --- | --- | --- |
| Indirizzo | `panificio-de-conca.<account>.workers.dev` (gratuito, immediato) | `panificiodeconca.it`, con `.com` e `ilfornaiodeconca.it` in redirect 301 |
| Segnaposti `[[...]]` | Permessi, resi come `<mark class="todo">` in corsivo su `paper-deep`: il titolare vede cosa manca | Un segnaposto residuo fa fallire la build |
| Motori di ricerca | `noindex, nofollow` su ogni pagina, `robots.txt` con `Disallow: /`, nessuna sitemap | Indicizzabile, sitemap, Search Console e Bing (brief §11) |
| Footer | Riga "Anteprima del sito: testi e foto provvisori" | Nessuna riga |
| Foto | Quelle di Facebook, a bassa risoluzione, con gli stessi nomi dei mockup | Gli scatti del brief §9, sostituiti file per file con lo stesso nome |
| Dove si condivide l'indirizzo | Solo con il titolare e con chi lavora al sito | Scheda Google, Facebook, Instagram, TripAdvisor, cartelli in negozio |

**Hosting.** Cloudflare Workers con asset statici, collegato a GitHub tramite Workers Builds: ogni push su `main` fa build e deploy, ogni altro branch produce un'anteprima con un suo URL ([guida Astro](https://docs.astro.build/en/guides/deploy/cloudflare/), [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [configurazione dei build](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [asset statici](https://developers.cloudflare.com/workers/static-assets/)). Per un sito statico Workers e Cloudflare Pages ([integrazione Git](https://developers.cloudflare.com/pages/get-started/git-integration/)) offrono le stesse cose — deploy da GitHub, anteprime per branch, dominio personalizzato, file `_headers` e `_redirects` ([tabella di compatibilità](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/)); Cloudflare sta portando su Workers tutte le funzioni di Pages, per questo il repository nasce con `wrangler.jsonc` e non con la configurazione di Pages. Se nel pannello il flusso di Pages risultasse più comodo, i comandi sono identici (`npm run build`, output `dist/`) e il codice non cambia. In entrambi i casi il costo è zero per un sito di questa dimensione.

Passi nel pannello Cloudflare, una volta sola, dopo il primo push su GitHub (li fa una persona, non Claude Code):

1. *Workers & Pages → Create → Import a repository*: autorizzare GitHub e scegliere il repository `panificio-de-conca`.
2. Nome del Worker `panificio-de-conca`; comando di build `npm run build`; comando di deploy `npx wrangler deploy` (legge `wrangler.jsonc`, che punta ad `assets.directory = "./dist"`); branch di produzione `main`.
3. *Build variables*: `SITE_URL` = l'URL `workers.dev` che il pannello mostra (poi `https://panificiodeconca.it` al passaggio online) e `SITE_PHASE` = `preview`. Sono variabili di build, non di runtime: Astro le legge durante `npm run build`.
4. Salvare: parte il primo build; l'indirizzo risultante è `https://panificio-de-conca.<sottodominio>.workers.dev`. Da qui in poi ogni push su `main` ripubblica da solo; i branch aperti in pull request compaiono in *Previews*.
5. Verificare dal telefono: pagine con `noindex`, segnaposti evidenziati, riga di anteprima nel footer, bottone Chiama che apre il telefono.

**Domini.** Si comprano subito, perché la registrazione del `.it` passa da un registrar italiano ([OVH](https://www.ovhcloud.com/it/domains/) o [Aruba](https://hosting.aruba.it/domini.aspx)) e il cambio dei nameserver verso Cloudflare richiede qualche ora; il `.com` si può prendere direttamente su [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/). Tutti e tre vanno aggiunti come zone su Cloudflare con i nameserver di Cloudflare: Workers accetta domini personalizzati solo se i nameserver sono gestiti da Cloudflare. I domini restano scollegati dal sito finché non si passa alla fase online: collegarli prima significherebbe che un indirizzo "vero" circola con testi provvisori.

**Fase dei contenuti.** Tra anteprima e online il lavoro tocca solo i file di contenuto, mai il codice: i dati del brief §10 sostituiscono i segnaposti in `src/content/`, le foto del brief §9 sostituiscono file con lo stesso nome in `src/assets/photos/`, le riletture di inglese e tedesco si fanno nei file `en/` e `de/`. Ogni sostituzione è un commit su `main` e appare in anteprima in pochi minuti; il conteggio dei segnaposti residui nel log di build dice quanto manca. Prompt per questa fase:

```
Leggi CLAUDE.md. Siamo nella fase dei contenuti (DESIGN.md §9.3): il sito è pubblicato in anteprima e non si tocca il codice. Ti do i dati confermati dal titolare e le foto nuove; tu sostituisci i segnaposti [[...]] nei file di contenuto delle tre lingue, con la stessa formulazione del brief, e le foto in src/assets/photos/ mantenendo i nomi. Se un dato non copre tutte e tre le lingue, lascia il segnaposto nelle altre e dimmelo. Alla fine esegui la build e riportami l'elenco dei segnaposti ancora presenti, per pagina e per lingua.
```

**Passaggio alla fase online**, quando i dati del brief §10 sono tutti confermati e le foto sono quelle vere: impostare `SITE_PHASE=live` e `SITE_URL=https://panificiodeconca.it` nel pannello, far passare la build (che ora blocca i segnaposti), collegare il dominio principale al Worker (*Settings → Domains & Routes*), creare le regole di redirect 301 dai domini secondari e da `www`, poi la checklist del brief §11 e la §10.4 di questo documento.

### 9.4 Dopo la build

Con `/design-sync` i componenti reali del repository si riportano nel design system "Panificio De Conca" un componente alla volta, così il riferimento di design resta quello del codice. Le manutenzioni trimestrali del brief §12 non toccano il design; se in futuro serve una pagina nuova (per esempio il listino delle feste come pagina), si parte dal design system e dal template di §5.4.

## 10. Checklist di revisione

### 10.1 Prima di passare dai wireframe ai mockup

- [ ] Su ogni schermata mobile, sopra i 660 px: H1, sottotitolo, CtaBar; in Home, Contatti e Dove siamo anche OpenNow.
- [ ] Ogni pagina contiene almeno una volta la frase intera della regola della prenotazione.
- [ ] Nessun bersaglio essenziale nel terzo superiore dello schermo oltre a logo, telefono e Menu.
- [ ] Le card prodotto in Home sono sei; nella pagina Prodotti sono raggruppate nelle sei categorie del brief §8.6.
- [ ] Il selettore lingua è presente in header (desktop), NavSheet e footer.
- [ ] Non esistono elementi che il brief vieta: modulo, mappa incorporata, carosello, banner cookie, pulsante "ordina online".
- [ ] Ogni rettangolo foto riporta il numero del brief §9.

### 10.2 Critica di design sui mockup

- [ ] Test dei tre secondi su ogni schermata mobile guardata per tre secondi: si capisce cosa vende, se è aperto, dove si trova?
- [ ] Gerarchia: un solo H1 per pagina, H2 distinguibili dal corpo a colpo d'occhio, nessun testo "decorativo" in rosso.
- [ ] Il rosso compare solo nei bottoni primari, nei link, nei punti della timeline e negli H1 di Home.
- [ ] Le foto hanno tutte lo stesso trattamento (nessun filtro, stessi rapporti), le foto d'epoca sono in bianco e nero con didascalia e anno.
- [ ] Le schermate tedesche non hanno testi troncati, bottoni su due righe non previsti, titoli con parole spezzate male.
- [ ] Gli stati di OpenNow sono leggibili senza colore.
- [ ] Coerenza tra mobile e desktop: stesso ordine dei blocchi, stessi testi.

### 10.3 Accessibilità sui mockup

- [ ] Contrasto ≥ 4,5:1 per tutto il testo a 18 px e 15 px; ≥ 3:1 per i titoli grandi e per i bordi dei bottoni secondari.
- [ ] Bersagli ≥ 44 × 44 px con almeno 8 px tra bersagli adiacenti.
- [ ] Stato di focus disegnato per bottoni, link, voci del menu, selettore lingua.
- [ ] Nessuna informazione trasmessa solo dal colore o solo da un'icona (ogni icona ha un'etichetta testuale accanto o nascosta).
- [ ] Le didascalie delle foto esistono per ogni figura; il testo alternativo sarà scritto nei file di contenuto in tre lingue (brief §6).
- [ ] L'ordine di lettura dei blocchi coincide con l'ordine visivo, anche nel layout a due colonne del desktop (testo prima della foto).

### 10.4 Prima della pubblicazione (in aggiunta al brief §11)

- [ ] Screenshot Playwright di ogni pagina a 390 e 1440 confrontati con i mockup; differenze residue annotate in `HANDOFF.md`.
- [ ] `tel:` provato su iPhone e Android; "Indicazioni" apre Apple Maps su iPhone e Google Maps altrove.
- [ ] OpenNow provato nei cinque stati cambiando l'ora di sistema; fuso corretto guardando da fuori Italia.
- [ ] Navigazione da tastiera: skip link, menu, selettore lingua, chiusura del NavSheet con Esc.
- [ ] Zoom del browser al 200 %: nessun testo tagliato, CtaBar ancora usabile.
- [ ] Stampa di Contatti e Dove siamo: CtaBar nascosta, link leggibili.
- [ ] Immagine Open Graph controllata con lo [strumento di Facebook](https://developers.facebook.com/tools/debug/); icona generata con [RealFaviconGenerator](https://realfavicongenerator.net/).
- [ ] `SITE_PHASE=live` impostato nel pannello, build verde (nessun segnaposto), `noindex` sparito da ogni pagina, `robots.txt` aperto, sitemap raggiungibile, dominio principale collegato e domini secondari in redirect 301.

## 11. Foto per i mockup

Le foto definitive sono quelle della lista del brief §9, da scattare. Per i mockup si usano le foto scaricate da Facebook (`Immagini/` nella cartella del progetto), a bassa risoluzione ma sufficienti a 2×; nei prompt di §8.3 vanno allegate alla chat.

| Riquadro (n. brief §9) | File Facebook da usare nei mockup | Note |
| --- | --- | --- |
| 1 — facciata (hero Home, Dove siamo, OG) | `Negozio e vetrina/` — la foto esterna con l'insegna, se presente; altrimenti `497707985_…` (banco con la bilancia) come hero provvisoria | La facciata va scattata di mattina, è la foto più importante del sito |
| 2 — insegna storica | `Storia e famiglia/483103371_…` (insegna "Fornaio F.lli De Conca" sul legno, con ghirlanda di Natale) | In bianco e nero nella timeline |
| 3 — banco pieno | `Negozio e vetrina/497707985_…` (banco, cornetti, pizzette, bilancia) | Anche per l'immagine Open Graph |
| 4–6 — tiella intera, polpo, cipolla | `Pizze e rustici/` — scegliere le tre inquadrature più orizzontali | Il calzoncino con scarola e olive (`482032966_…`) è utile per la card "Calzoncini e rustici" |
| 7 — pizzette rosse | `Pizze e rustici/` | |
| 8–9 — pane di giornata, pane senza lievito | `Pane e taralli/` | |
| 10–11 — ciambelline, tozzetti | `Biscotti/` | |
| 12–13 — cornetti, maritozzi | `Negozio e vetrina/` (i cornetti sono nel banco); maritozzi: rettangolo paper-deep | |
| 16 — dolci di Natale | `Feste - Natale/`, `Mostaccioli e dolci al cioccolato/` | |
| 17 — pigna e casatiello | `Feste - Pasqua/` | |
| 18 — zeppole | `Zeppole e bignè/` | |
| 14–15 — forno e laboratorio | `Laboratorio/` | |
| 20–23 — famiglia, foto d'epoca, pergamena, ritaglio | `Storia e famiglia/` (quattro file) | In bianco e nero; la pergamena e il ritaglio a colori |
| 24 — lungomare con la base | Nessuna: rettangolo paper-deep | Da scattare |
| Logo | `Logo/256725662_…` | Per header, footer, OG e icona; da scontornare (§2, A8) |

Le foto verticali di Facebook si ritagliano a 3:2 o 4:3 con il soggetto al centro; nei mockup è accettabile, nel sito definitivo servono gli scatti orizzontali del brief.

## 12. Riferimenti

- Brief del sito: `claude/brief-sito-panificio-deconca.md` (Progetto) e `brief-sito-panificio-deconca.md` (cartella sul Mac).
- Piano di visibilità e vendite: [documento nel Progetto](https://claude.ai/code/artifact/d265ea9e-d28d-4d3d-9688-3867ccb97d30), sezioni 4 e 5.
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) · [WCAG 2.5.5 Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) · [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) · [Apple HIG, accessibilità](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Fraunces su Google Fonts](https://fonts.google.com/specimen/Fraunces) · [Fraunces su GitHub](https://github.com/undercasetype/Fraunces) · [Fontsource: Fraunces](https://fontsource.org/fonts/fraunces) · [Astro: font](https://docs.astro.build/en/guides/fonts/) · [Astro: immagini](https://docs.astro.build/en/guides/images/)
- [Lucide](https://lucide.dev/) (icone, ISC)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/) · [Rich Results Test](https://search.google.com/test/rich-results) · [Schema validator](https://validator.schema.org/)
- [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started) · [Apple Maps links](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html)
- [Playwright: screenshot e confronto visivo](https://playwright.dev/docs/test-snapshots)
- [Astro: deploy su Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) · [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) · [Workers Builds, configurazione](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) · [Workers, asset statici](https://developers.cloudflare.com/workers/static-assets/) · [Workers e Pages, tabella di compatibilità](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/) · [Cloudflare Pages, integrazione Git](https://developers.cloudflare.com/pages/get-started/git-integration/) · [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
- Design system, wireframe e mockup: [Design System "Panificio De Conca"](https://claude.ai/artifact/22CZGyjpAihmsETVJvHHoh) · [Wireframe](https://claude.ai/artifact/3nZD59mPw5Pv59c5TD24AB) · [Mockup](https://claude.ai/artifact/GoyYUeeTEmasgLTGv6RR7R)
- [Nielsen Norman Group: menu nascosti](https://www.nngroup.com/articles/hamburger-menus/) · [Steven Hoober: come si tengono i telefoni](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) · [RealFaviconGenerator](https://realfavicongenerator.net/)
