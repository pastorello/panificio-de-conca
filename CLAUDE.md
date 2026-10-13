# Panificio De Conca — sito vetrina

Sito statico in tre lingue (IT/EN/DE) per un panificio di Gaeta fondato nel 1922. Niente e-commerce, niente moduli, niente cookie: ogni pagina esiste per far telefonare il giorno prima.

## Documenti da leggere, in quest'ordine

1. `BRIEF.md` — cosa dice il sito: contesto, vincoli, stack, mappa delle pagine, SEO, copy completo nelle tre lingue (§8), foto (§9), dati da confermare (§10), messa online (§11), manutenzione (§12).
2. `DESIGN.md` — come appare: principi, wireframe, token, componenti, decisioni di design (§7), consegna e pubblicazione in due fasi (§9).
3. `design/HANDOFF.md` — come usare i file in `design/`: tabella delle schermate, comportamenti che i PNG non mostrano, differenze volute tra mockup e sito.

In caso di contraddizione: il brief vale per i contenuti, `DESIGN.md` per l'aspetto, `design/HANDOFF.md` per i dettagli di consegna. Se due documenti si contraddicono, segnalarlo invece di scegliere.

## Stack e convenzioni

- **Astro 5**, output statico, TypeScript `strict`. i18n nativo: `defaultLocale: 'it'`, `locales: ['it','en','de']`, `prefixDefaultLocale: false`, `trailingSlash: 'always'`. Slug tradotti in `src/routes.ts` (alimenta menu, selettore lingua, hreflang, sitemap).
- **CSS puro con custom property**: `src/styles/tokens.css` (copiato da `design/tokens.css`) e `src/styles/components.css` (derivato da `design/components/bundle.css`). Nessun Tailwind, nessun framework di componenti, nessun colore/dimensione/spaziatura fuori da `tokens.css`.
- **Font**: Fraunces self-hosted da `design/fonts/`; testo nel font di sistema. Nessuna richiesta a Google Fonts o a terze parti.
- **Immagini**: `astro:assets` con WebP/AVIF e `srcset`; originali in `src/assets/photos/`. Immagini citate nel JSON-LD e in Open Graph in `public/img/` con nome fisso.
- **Contenuti**: content collections tipizzate in `src/content/` (`products/{it,en,de}/*.md`, `story/{it,en,de}.md`, `site/{it,en,de}.json`, `business.json`), copiati alla lettera dal brief §8, segnaposti `[[...]]` compresi. Mai inventare testi, prezzi, orari, ripieni, superlativi.
- **JavaScript** solo dove serve: `OpenNow`, riga "oggi" della tabella orari, `NavSheet`, scelta Apple/Google Maps. Tutto funziona anche senza (fallback descritti in `design/HANDOFF.md` §4).
- **Accessibilità** WCAG 2.1 AA: `lang` corretto per pagina, un H1 per pagina, alt tradotti nei file di contenuto, focus visibile, bersagli ≥ 44 px, nessuna informazione solo per colore.
- **Prestazioni**: Lighthouse mobile ≥ 95 su ogni pagina, LCP < 1,5 s su 4G, Home < 600 KB immagini comprese.
- Identificatori e commenti in inglese; documenti, contenuti e messaggi all'utente in italiano. Messaggi di commit in inglese, imperativo, una riga di sommario.

## Comandi

```
npm install
npm run dev          # sviluppo
npm run build        # build statica in dist/ (esegue anche i controlli di §Verifiche)
npm run preview      # anteprima della build
npm run check        # astro check + eslint + prettier --check
npm run test         # script di verifica su dist/: segnaposti, hreflang, JSON-LD
npm run shots        # screenshot Playwright di ogni pagina a 390×844 e 1440×900 in .shots/
```

## Verifiche (bloccanti in CI e prima di ogni push su `main`)

- `astro check`, ESLint, Prettier.
- Script su `dist/`: ogni pagina ha i tre `hreflang` reciproci più `x-default` (inglese) e `canonical` assoluto; JSON-LD `Bakery` valido nelle home e nelle pagine Dove siamo; nessun `[[` residuo **quando `SITE_PHASE=live`** (in `preview` i segnaposti sono permessi e resi come `<mark class="todo">`).
- Lighthouse CI mobile ≥ 95 su ogni pagina (GitHub Actions, su ogni PR).
- Screenshot Playwright confrontati con `design/mockups/`: le differenze non elencate in `design/HANDOFF.md` §5 si correggono.

## Pubblicazione

- Hosting: **Cloudflare Workers con asset statici**, collegato a GitHub con Workers Builds: ogni push su `main` fa build e deploy; gli altri branch generano un'anteprima. `wrangler.jsonc` nel repository (`assets.directory = "./dist"`), `public/_headers` per HSTS e intestazioni di sicurezza. Nessun `wrangler deploy` manuale.
- Variabili d'ambiente: `SITE_URL` (es. `https://panificiodeconca.it`) e `SITE_PHASE` (`preview` | `live`). In `preview`: `<meta name="robots" content="noindex, nofollow">` su ogni pagina, `robots.txt` con `Disallow: /`, nessuna sitemap, riga "Anteprima del sito: testi e foto provvisori" nel footer. In `live`: tutto indicizzabile, sitemap, nessun segnaposto.
- Il pannello Cloudflare, GitHub e i registrar dei domini li usa una persona: quando serve un'azione lì, elencare i passi esatti e fermarsi.

## Regole di lavoro

- Branch `main` = produzione. Lavorare su branch, aprire PR, far passare le verifiche, poi merge.
- Mai modificare `BRIEF.md`, `DESIGN.md` o `design/`: sono la fonte; le decisioni nuove si propongono nella conversazione e si annotano in `design/HANDOFF.md` §5 solo su conferma.
- Nessun segreto nel repository; nessuna dipendenza che carichi risorse da terze parti a runtime.
- Una pagina alla volta, con screenshot di confronto, prima di passare alla successiva.
