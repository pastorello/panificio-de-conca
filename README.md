# Panificio De Conca — sito vetrina

Sito statico in italiano, inglese e tedesco del Panificio De Conca di Gaeta (dal 1922). Niente e-commerce, niente moduli, niente cookie: ogni pagina porta a telefonare il giorno prima o a passare in negozio.

- `BRIEF.md`: cosa dice il sito (contenuti, SEO, dati da confermare).
- `DESIGN.md` e `design/`: come appare (token, componenti, mockup, `design/HANDOFF.md`).
- `CLAUDE.md`: stack, convenzioni, verifiche e regole di lavoro.

## Comandi

```bash
npm install
npm run dev      # sviluppo su http://localhost:4321
npm run build    # build statica in dist/ più le verifiche su dist/
npm run preview  # anteprima della build
npm run check    # astro check, ESLint, Prettier, token
npm run test     # test degli orari (tests/) e verifiche su dist/
npm run test:e2e # comportamento su dist/: menu, tastiera, fallback senza JS, link mappe
npm run shots    # screenshot a 390 × 844 e 1440 × 900 in .shots/ (--menu, --nojs, --at=2026-10-13T10:00)
npm run compare  # mockup e pagina affiancati, a fette, in .shots/compare/ (stesso browser, ora dei mockup)
```

Con `--at` l'orologio è fermo a quell'ora di Roma, così OpenNow e la riga «oggi» sono quelli dei mockup (martedì, aperto). I testi delle pagine sono in `src/content/pages/{it,en,de}/`, le schede prodotto in `src/content/products/`, la storia in `src/content/story/`; i modelli delle pagine in `src/views/`.

Catalogo dei componenti con varianti e stati, solo in locale: `SITE_GALLERY=true npm run build`, poi `npm run shots -- /componenti/` (hover, focus e attivo sono forzati sugli elementi con `data-force`).

Variabili di build (vedi `.env.example`): `SITE_URL` e `SITE_PHASE` (`preview` | `live`). In anteprima le pagine hanno `noindex` e i segnaposti `[[…]]` sono evidenziati; in `live` un segnaposto rimasto fa fallire la build.

## Pubblicazione

Cloudflare Workers con asset statici (`wrangler.jsonc`), collegato al repository con Workers Builds: ogni push su `main` fa build e deploy, gli altri branch generano un'anteprima. I passi nel pannello Cloudflare sono in `DESIGN.md` §9.3. Si lavora su branch e si unisce a `main` con una pull request dopo le verifiche.
