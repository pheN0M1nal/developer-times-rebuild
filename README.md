# The Developer Times — challenge rebuild

A from-scratch rebuild of a vintage-newspaper developer portfolio, done as a reverse-engineering challenge. The original's source was never available; everything here was rebuilt from what its public static build reveals (layout, tokens, behaviour), then written fresh.

**All content is placeholder.** "Ezra Quill", every employer, case, quote, record and postcard is invented. Replace the files in `src/content/` with real details; components carry no copy of their own.

## Stack

- Next.js 16 (App Router) with `output: "export"`: every route is a static HTML file
- React 19, TypeScript, Tailwind CSS v4
- Framer Motion, Lenis smooth scroll, next-themes (`class` strategy)
- MDX press articles, highlighted at build time with Shiki and a custom theme
- `@react-pdf/renderer` for invoice export, `html-to-image` for "print for the records"
- Web Audio API for every sound: sound effects, ambience and surface noise are synthesised, not sampled
- Fonts self-hosted from `src/fonts` (SIL Open Font License) so builds need no font CDN

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

To serve from a sub-path (a GitHub Pages project site, for instance), build with `NEXT_PUBLIC_BASE_PATH=/developer-times-rebuild`.

## Map

| Route | What it is |
| --- | --- |
| `/` | Front page: dossier, arsenal, career reel, case marquee, endorsements, desk teaser, correspondence |
| `/cases/`, `/cases/[id]/` | Case archive with tag filter, and four dossiers |
| `/press/`, `/press/[slug]/` | The Morning Edition and its articles (MDX) |
| `/lifestyle/` | The Gazette of Moments, a photo roll |
| `/desk/` | Six browser instruments: invoices, Pomodoro, wireless, turntable, darkroom, stationer |
| `/post/` | Opens a letter sealed at the Stationer's (the letter lives in the link) |
| `/locker/` | The Evidence Locker: vinyl shelf, postcards, and the unlock game |
| `/locker/lab/` | Texture Lab: the design system on one page (unlinked, as in the original) |
| `/legal/terms/` | Publication terms |

## Things worth knowing

- **Torch.** Night edition only. A cursor-following beam made of five stacked gradients. It reveals glowing margin notes and pencilled secrets; holding the beam on a secret for 700 ms files it as found.
- **Unlock game.** Visits and finds are stored as signals in `localStorage` (`locker:signals`). Records on the shelf unseal when their rule is met.
- **Hire mode.** `?available=1` adds availability lines for the session; `?available` turns them off.
- **Surfaces.** Every paper object is the same five layers (fill, fibre grain, mottling, edge burn, lift) with seeded variation from `hash(id)`, so server and client render identically.
