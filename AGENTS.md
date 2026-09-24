# Project Guidance

## User Preferences

- Deliverable is a single self-contained HTML + CSS file with no React, no Tailwind, and no JS logic
- Arabic RTL layout (dir="rtl" lang="ar") at 390px mobile width
- Fonts: Readex Pro for headings, IBM Plex Sans Arabic for body
- Four switchable themes via data-theme on <html>: mint (default), ocean, lavender, dark
- Mint theme tokens: primary #26A69A, primary-dark #1E8C82, background #EAF7F4, surface #FFFFFF, text #1F2A2E, muted #6B7C80, line #E3ECEA, accent #F5A623
- Icons as inline outline SVG at 1.75px stroke; no external images, covers as CSS/SVG placeholders
- Soft shadows (0 2px 8px rgba(0,0,0,.06)), no backdrop blur, animate only transform and opacity, touch targets at least 44px
- Western digits everywhere; calm, clean, encouraging tone
- Style references are inspiration only — never copy their logo, illustrations, or text; create original assets

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- The showcase deliverable is a standalone HTML artifact at src/frontend/public/showcase.html served by an iframe from src/frontend/index.html; the React app is intentionally unused.
- Exact Arabic copy strings in acceptance criteria must be matched verbatim — paraphrased headings fail even when screen structure is correct.
- Under --enhanced-migration a stable actor field cannot have an inline initializer; declare it type-only in the actor and initialize it from the migration chain's NewActor.
- Touch-target compliance for small visual controls can be met with a transparent ::before hit-area overlay rather than enlarging the visible control.
