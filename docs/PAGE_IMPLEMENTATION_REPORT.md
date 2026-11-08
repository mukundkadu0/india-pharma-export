# Page implementation report

What was built per phase, what was verified, and what was left. Screenshots: `docs/screenshots/after-*.jpg`.

| Phase | Delivered | Not delivered / limits |
|---|---|---|
| 2 Design system | Tokens, components, `docs/DESIGN_SYSTEM.md` | Loading skeleton defined but unused (static pages) |
| 3 Header | Top bar (contact, destination, OTC shop, cart); sticky 64 px header; Products mega menu (8 categories); Buyer Solutions dropdown; Markets, Quality & Compliance, Resources, About; search; RFQ list with badge; Request a Quote; mobile drawer with search first | Language selector removed because no second language exists. The destination select is the existing shipping-destination control, moved to the top bar |
| 4 Homepage | Sections in the requested order: top bar, nav, hero ("Your Global Pharmaceutical Sourcing Partner from India"), product search, 8 categories, featured products (4), molecule discovery (top classes), markets, why, buyer solutions, how sourcing works (4 steps), compliance layers, RFQ, resources, FAQ, footer | Industry statistics strip removed instead of relabelled: the figures were not verified in this work. No "200+" claim anywhere |
| 5 Catalogue | Search (product, generic, class, HS code), datalist suggestions from generic names, category, therapeutic class, dosage form, strength-contains, export status, prescription classification, listed destination region, sort, 12-per-page "Show more", clear filters, empty state, active-filter count on mobile. Product listings vs molecule index separated and explained. Cards show form, strength, HS code, packaging, export and Rx badges, listed regions, Request Bulk Quote, Add to RFQ list | Destination filter reflects each product's `marketRegions` data, not validated country coverage. Strength is a text match, not a normalised field. Search suggestions are a basic datalist. "Manufacturer-verified supply" is not shown because the data has no verification field |
| 5 Rx buttons | Unchanged rule in `lib/commerce.ts`: prescription products can never get Buy Now or Add to Cart. Their only action is Request Bulk Quote | |
| 6 Product page | Breadcrumb, name, generic name, category, export and Rx badges, listed regions, overview, key points, spec table (adds export and Rx classification), regulatory notes, destination considerations, documentation on request, FAQs, related products, sticky quote panel (quantity, destination, Request Bulk Quote to prefilled RFQ, Add to RFQ list). Direct-order buttons only for OTC products with commerce data, never in the quote panel | "Partner manufacturing status" and shelf life are shown only where data exists; none is invented. Product copy in `products.json` still says "WHO-GMP certified partners" (see UX_AUDIT #19) |
| 7 Markets | Existing content kept. Added: country chips that start a quote prefilled with the country, sourcing-category links, other-region navigation, country-prefilled CTA | No "relevant authorities" block: the regulators are named inside the existing pathway text and there is no structured field. No per-country pages |
| 8 Buyer solutions | `/buyers/` and 8 segment pages (importers, distributors, wholesalers, hospitals, government and tenders, NGOs, manufacturers, pharmacy chains). Each has its own sources, steps, enquiry checklist, documents, matching note and one CTA that prefills buyer type | Copy was drafted for this task from general industry practice. **The business owner should review it**, especially the document lists and statements about WHO PQ, DMF and CEP |
| 9 Compliance | Four credential layers, timeline for the licence stack, document table with a "Provided by" column, existing classification cards, special-handling and disclaimer kept | "Provided by" is general guidance and needs owner review. "Clearly attributed official authority sources" are named (CDSCO, DGFT, Pharmexcil, State FDA) but there are no outbound links to authority sites |
| 10 RFQ | 3-step form: requirement; contact and buyer type; specifications (dosage form, strength, packaging, target market, target price, currency, Incoterm, destination port, delivery date, link, upload, notes). Prefill from `?product=&country=&quantity=&buyer=` and from the RFQ list. Server accepts the new fields. RFQ list page restyled and now asks buyer type | Bulk modal remains a shorter 6-field variant with older styling; it uses the same submit pipeline. The partnership and general forms stay single-step |
| 11 i18n | `src/i18n/config.ts`, `LanguageSwitcher.astro`, hreflang and `lang`/`dir` plumbing, doc | No translations, no language URLs, no sitemap i18n. Arabic RTL not audited |
| 12 Footer | Company, email, phone, address ("India", as configured), 8 categories, buyer solutions, company, compliance and legal links, B2B disclaimer | No physical address or social profiles exist in the config, so none are shown. Email `info@pharmaxports.com` already matches the brand; the form backend still delivers to a Gmail address behind the Web3Forms key |
| 13 Mobile | See `MOBILE_UX_QA.md` | |
| 14 SEO and performance | See `SEO_PRESERVATION_REPORT.md` | |
| 15 QA | See `FINAL_QA.md` | |

## Files added
`src/data/buyers.ts`, `src/pages/buyers/index.astro`, `src/pages/buyers/[slug].astro`, `src/i18n/config.ts`, `src/components/LanguageSwitcher.astro`, `public/logo-header.jpg`, `public/logo-full.jpg`, `public/favicon.png`, `public/apple-touch-icon.png`, `public/favicon.ico`, six docs, screenshots.

## Files substantially changed
`global.css`, `Header.astro`, `Footer.astro`, `index.astro`, `QuoteForm.astro`, `products/index.astro`, `products/[slug].astro` (product and category blocks), `ProductCard.astro`, `CommerceCtas.astro`, `markets/[id].astro`, `compliance.astro`, `inquiry.astro`, `Button.astro`, `Seo.astro`, `BaseLayout.astro`, `api/rfq.ts` (three new optional fields).

## Not touched
Molecule pages (1,532) and the OTC shop keep their layouts; they pick up the new fonts, colours and buttons through the tokens, but were not redesigned. Product, molecule and market data files are unchanged.

## Round 2 updates
Bulk modal now uses the 3-step form (QuoteForm variant=modal). Molecule pages, the OTC shop, the order-request page, the molecule index and class pages were redesigned. The Compliance page gained official source links and market pages gained a MarketAuthorities section. See docs/ROUND2_REPORT.md.
