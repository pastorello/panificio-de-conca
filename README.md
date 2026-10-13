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
npm run test     # solo le verifiche su dist/
npm run shots    # screenshot a 390 × 844 e 1440 × 900 in .shots/
```

Variabili di build (vedi `.env.example`): `SITE_URL` e `SITE_PHASE` (`preview` | `live`). In anteprima le pagine hanno `noindex` e i segnaposti `[[…]]` sono evidenziati; in `live` un segnaposto rimasto fa fallire la build.

## Pubblicazione

Cloudflare Workers con asset statici (`wrangler.jsonc`), collegato al repository con Workers Builds: ogni push su `main` fa build e deploy, gli altri branch generano un'anteprima. I passi nel pannello Cloudflare sono in `DESIGN.md` §9.3. Si lavora su branch e si unisce a `main` con una pull request dopo le verifiche.
