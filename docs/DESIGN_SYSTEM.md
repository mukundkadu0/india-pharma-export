# Design system

Tokens live in `src/styles/global.css` (`@theme`); reusable classes are in `@layer components` in the same file. Brand logo files are in `public/`.

## Tokens
| Token | Value | Use |
|---|---|---|
| `--color-navy` | `#123451` | Headings, primary dark surfaces, secondary buttons |
| `--color-teal` | `#149C9A` | Icons, borders, hover accents. Not for text on white (3.4:1) |
| `--color-teal-dark` | `#0E7573` | Primary buttons, links, small teal text (5.5:1 on white) |
| `--color-gold` | `#D3A94D` | Rules, highlights, badges on navy. Never text on white |
| `--color-gold-dark` | `#7D5F17` | Gold-family text on white (5:1) |
| `--color-bg` | `#F4F7F9` | Soft page background |
| `--color-slate-500` | `#55677F` | Overridden from Tailwind default (4.4:1 on soft bg) to 5.4:1 |
| `--color-success / warning / error` | `#0F6B48 / #9A6A0A / #B3342F` | Status text. Success was darkened after Lighthouse flagged 3.8:1; no contrast failures remain on the pages Lighthouse tested. Warning and error were not measured separately |

Legacy names (`--color-blue`, `--color-accent`, `--color-accent-dark`, `--color-blue-light`) are kept and remapped so older components pick up the brand without edits.

## Typography
Inter Variable only (self-hosted, one preloaded file). The serif display face was removed. Headings are 700 with -0.02em tracking. Scale: `section-title` is fluid 1.6 to 2.25 rem; body 16 px; table and spec text 12 to 14 px.

## Components
| Component | Where | Notes |
|---|---|---|
| Buttons | `.btn`, `.btn-primary / -navy / -outline / -ghost`, `.btn-lg / -sm`; `Button.astro` | 44 px minimum height, 8 px radius |
| Cards | `.card`, `.card-hover` | 12 px radius, 1 px border; hover changes border and shadow only |
| Form fields | `.field`, `.label` | Visible focus ring, 16 px text on mobile |
| Chips and status | `.chip`, `Badge.astro` | Export and prescription status |
| Product card | `ProductCard.astro` | Spec list: form, strength, HS code, packaging; Request Bulk Quote; Add to RFQ list |
| Navigation and mega menu | `Header.astro` | Click, hover and keyboard; Esc closes |
| Mobile drawer | `Header.astro` | Focus moves into the drawer and back; accordions for Products and Buyer Solutions |
| Search | `Header.astro` overlay (Fuse.js index) and catalogue search | Search is in the header on every viewport |
| Filters | `products/index.astro` | Category, class, dosage form, strength text, export, Rx, region, sort, clear; collapsible on mobile |
| RFQ | `QuoteForm.astro` (3 steps) | Progress indicator, per-step validation |
| Breadcrumbs | `Breadcrumbs.astro` | |
| Accordion | `Accordion.astro` | |
| Tables | Compliance document table | `overflow-x-auto` wrapper, `scope` attributes, caption |
| Timeline | Compliance licence stack | Ordered list |
| Empty and error states | `.state-empty`, `.state-error` | Used on the catalogue |
| Loading state | `.skeleton` | Defined; not yet used on a page, since pages are static |
| Language switcher | `LanguageSwitcher.astro` | Hidden until a second language is enabled |

## Rules followed
Light backgrounds only. No glassmorphism. No decorative gradients on cards. No entrance animation on cards (`card-lift` / `card-in` are no longer used by the redesigned pages). Radius at most 12 px on cards.

## Adding a language
1. Translate all pages, with human review of pharmaceutical and regulatory wording.
2. Create routes under `/<lang>/` (for example with Astro i18n routing and content collections per language).
3. Set `enabled: true` for that language in `src/i18n/config.ts`. The switcher, `lang` and `dir` attributes, `og:locale` and hreflang alternates (including `x-default`) then appear automatically.
4. Add the language URLs to the sitemap (Astro sitemap `i18n` option).
5. For Arabic: audit physical left/right Tailwind classes and switch to logical properties (`ms-`, `me-`, `ps-`, `pe-`), then test in RTL.
6. Do not redirect visitors by IP. Every language version must stay crawlable at its own URL.

Status today: English only. No translations exist. No language is shown. The architecture file and helpers are in place and unit-checked only by the build.
