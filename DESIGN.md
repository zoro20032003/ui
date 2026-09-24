# Design Brief — صديقك (Sadiqak)

## Direction

**Calm Companion** — a soft mint/teal Arabic study companion for Iraqi 6th-grade scientific-track students; white rounded cards, generous white space, and mint wave shapes that make studying feel encouraging, never clinical.

## Tone

Quietly optimistic and friendly — rounded geometry, flat vector warmth, and one warm amber accent keep it from reading as a generic edtech dashboard.

## Differentiation

Every surface floats on a soft mint field with a layered wave motif at the screen base, and the original "نقطة الصديق" logo — a mint speech-bubble droplet with a rising study arc — makes the identity unmistakably Sadiqak.

## Color Palette

Mint (default theme) — exact required values:

| Token         | Value     | Role                                    |
| ------------- | --------- | --------------------------------------- |
| --primary     | `#26A69A` | Buttons, active tabs, progress, links   |
| --primary-dark| `#1E8C82` | Pressed states, headings on mint        |
| --background  | `#EAF7F4` | App canvas behind cards                 |
| --surface     | `#FFFFFF` | Cards, sheets, nav bar                  |
| --text        | `#1F2A2E` | Primary text                            |
| --muted       | `#6B7C80` | Secondary text, placeholders            |
| --line        | `#E3ECEA` | Hairline borders, dividers              |
| --accent      | `#F5A623` | Sparingly: badges, highlights, stars    |

Derived theme families (same token names, `[data-theme=...]`):

| Theme    | primary   | primary-dark | background | surface   | text      | muted     | line      | accent    |
| -------- | --------- | ------------ | ---------- | --------- | --------- | --------- | --------- | --------- |
| mint     | `#26A69A` | `#1E8C82`    | `#EAF7F4`  | `#FFFFFF` | `#1F2A2E` | `#6B7C80` | `#E3ECEA` | `#F5A623` |
| ocean    | `#2E7DB8` | `#24648F`    | `#EAF2F9`  | `#FFFFFF` | `#1C2A33` | `#64757F` | `#E0EAF1` | `#F5A623` |
| lavender | `#7C6BD6` | `#6353B8`    | `#F1EEFA`  | `#FFFFFF` | `#241F33` | `#6E6880` | `#E8E3F3` | `#F5A623` |
| dark     | `#2BB3A6` | `#57C9BD`    | `#111A1C`  | `#1A2527` | `#E8F1EF` | `#8FA0A2` | `#2A383A` | `#F5A623` |

## Typography

- Display: **Readex Pro** (Google Fonts) — Arabic headings, screen titles, numerals
- Body: **IBM Plex Sans Arabic** (Google Fonts) — paragraphs, labels, buttons, list rows
- Scale: hero `28px/700`, h2 `22px/600`, card-title `17px/600`, body `15px/400`, caption `13px/400`, label `12px/600`
- Line height 1.6 for body, 1.35 for headings; Western digits everywhere

## Elevation & Depth

Flat and soft — one shadow only: `0 2px 8px rgba(0,0,0,.06)`; depth comes from white surfaces on the mint field, never from blur or gradients.

## Structural Zones

| Zone          | Background         | Border                | Notes                                              |
| ------------- | ------------------ | --------------------- | -------------------------------------------------- |
| App canvas    | `--background`     | —                     | Mint field with wave SVG at screen base            |
| Header        | `--background`     | none (bleeds to mint) | Greeting + avatar + bell; sits on mint, no card    |
| Content       | `--background`     | —                     | White `--surface` cards with `--line` hairline     |
| Sticky bars   | `--surface`        | `--line` top/bottom   | Reader toolbar, detail bottom bar, bottom nav      |
| Bottom nav    | `--surface`        | `--line` top          | 5 tabs, active tab `--primary` icon + label        |

## Spacing & Rhythm

4px base scale: 4 / 8 / 12 / 16 / 20 / 24 / 32; screen gutter 20px; card padding 16–20px; 12px gap between stacked cards, 16px between sections.

## Shape & Radius Scale

Cards 20px, sheets/modals 24px, inputs & buttons 16px, chips & nav pills full (999px); small inner badges 12px.

## Component Patterns

- Buttons: pill or 16px, filled `--primary` for primary, `--surface` + `--line` outline for secondary, min-height 44px
- Cards: `--surface`, 20px radius, 1px `--line`, soft shadow, 16–20px padding
- Chips: pill, `--surface` + `--line` default, `--primary` fill when active
- Icons: inline SVG outline, 1.75px stroke, 24px box, `currentColor`
- Illustrations: flat vector, mint/teal fills with amber accents, seated on a mint wave shape

## Logo Concept (original)

**نقطة الصديق** — a rounded mint speech bubble whose tail becomes a gentle wave; inside, a white rising arc with three dots (a page turning into a growth curve). Paired lockup: mark on the right, wordmark "صديقك" in Readex Pro 600 with the dot of the ي as a small amber circle. Used on onboarding, login, and account screens.

## Illustration Style

Flat, no outlines, no gradients: 2–3 mint/teal tones plus one amber highlight, simple geometric shapes, rounded corners, characters shown from the shoulders up, always resting on a mint wave band.

## Motion

- Entrance: `opacity 0→1` + `translateY(8px→0)`, 320ms ease-out, staggered 60ms
- Hover/press: `transform: scale(.97)` on buttons, 140ms
- Decorative: slow wave drift (`translateX` only), 6s ease-in-out infinite
- Only `transform` and `opacity` animate; no blur, no layout properties

## Constraints

- Single self-contained HTML + CSS file, `dir="rtl" lang="ar"`, 390px mobile width, no JS logic
- No external images — icons inline SVG, covers CSS/SVG placeholders
- No backdrop blur; shadows limited to `0 2px 8px rgba(0,0,0,.06)`
- All touch targets ≥ 44px; Western digits; calm, encouraging tone
- Reference material is inspiration only — logo, illustrations, and text are original

## Signature Detail

The mint wave band — a layered SVG wave sitting behind the bottom of every screen and under every illustration — is the recurring motif that ties the whole app together.
