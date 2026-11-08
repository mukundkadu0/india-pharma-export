# UX audit (Phase 1)

Audit of the site as it stood before the redesign, from reading every route and component and from browser views. Before screenshots: `docs/screenshots/before-*.jpg` (home, catalogue, product, RFQ). Desktop width about 1100 px.

## Scope inspected
Routes: home, products index, 8 category pages, therapeutic-class pages, molecule index and 1,532 molecule pages, 27 product pages, markets index and 7 market pages, about, compliance, resources and guides, glossary, FAQs, contact, partner, request-quote, inquiry list, OTC/AYUSH shop and cart, legal pages. Components: header, footer, buttons, cards, forms, bulk modal, analytics, SEO.

## Findings

| # | Finding | Where | Severity | Status after redesign |
|---|---|---|---|---|
| 1 | Hero claimed "200+ Countries" and a "200+ destination countries" stat. Not verifiable for PharmaXports | Home | High (trust) | Removed. Industry statistics strip removed from the home page |
| 2 | Newsletter form only opened a `mailto:` link, with no real subscription | Footer, every page | High (non-functional form) | Removed. Footer now has contact details instead |
| 3 | OTC shop sat in the primary nav next to the B2B journey | Header | Medium | Moved to the top bar as "OTC & AYUSH shop" with its own cart icon |
| 4 | Language button with a "planned" popover for languages that do not exist | Header | Medium | Removed. Switcher renders only when a second language is enabled |
| 5 | Serif display headings plus sans body: two families, weak technical hierarchy | Global | Medium | One family (Inter), clear scale |
| 6 | Palette (navy and orange) did not match the brand palette in the brief | Global | Medium | Brand tokens: navy, teal, gold, soft background. Contrast-checked |
| 7 | Primary CTA wording differed by page: "Export Enquiry", "Get a Quote", "Buy in Bulk", "Get an Export Quote" | Many | Medium | "Request a Quote" and "Request Bulk Quote" |
| 8 | Catalogue filters: category, Rx, export, market only. No dosage form, class, strength, sort or pagination. All 27 cards rendered at once | Products | Medium | Added, see PAGE_IMPLEMENTATION_REPORT.md |
| 9 | Product and molecule index shown together with no explanation of the difference. Risk of reading every molecule as stock | Products | Medium | Explanatory copy added; molecule index renamed and described |
| 10 | Product page: sticky panel offered "Order {product}", price absent, country-driven buttons | Product | Medium | Quote panel: quantity, destination, Request Bulk Quote, Add to RFQ list |
| 11 | Product-page trust tiles said "WHO-GMP Partner-Manufactured" and "Reliable Supply Chain" without product-level evidence | Product | Medium | Reworded to what the page can support |
| 12 | Four different enquiry designs: home quote form, request-quote, inquiry list, bulk modal, with different field sets | RFQ | High | One 3-step RFQ component, RFQ list restyled to the same field system. The bulk modal is still a shorter variant (see gaps) |
| 13 | `markets.json` writes `medical-devices`; the taxonomy uses `devices` | Data | Low | Normalised in the market page. Data file left unchanged |
| 14 | No pages for the 8 buyer segments | IA | High | `/buyers/` and 8 segment pages, each with its own copy |
| 15 | Compliance page mixed company, manufacturer, product and destination credentials in one narrative | Compliance | High | Four-layer separation, timeline, document table with "provided by" |
| 16 | `text-slate-500` on the soft background was 4.42:1; green badges 3.82:1 | Global | Medium | Fixed at token level; Lighthouse accessibility 100 on tested pages |
| 17 | Unlayered CSS could override utility classes such as `hidden` | CSS | Low | Design-system classes moved to `@layer components` |
| 18 | Footer: logo only, generic categories (first 6), no markets, no buyer links | Footer | Low | Rebuilt: contact, 8 categories, buyer solutions, company, compliance and legal |
| 19 | Product descriptions and key points in `products.json` say "WHO-GMP certified manufacturing partners" for every product | Data | Medium (claim) | **Not changed** (you declined wording cleanup earlier). Flagged here |
| 20 | Shop page has about 150 small controls (under 36 px) on mobile | Shop | Low | **Not changed**. Shop kept visually separate; out of scope |

## Not found / not an issue
- Broken internal links: 0. Checked on the final build: 1,677 unique internal links collected from every built page, each resolved to a built file.
- No duplicate form `name` attributes on the forms reviewed.
- Duplicate HTML ids: 0 across all 1,672 built pages.
