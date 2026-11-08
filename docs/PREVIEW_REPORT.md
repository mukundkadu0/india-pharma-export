# Preview deployment report (2026-11-07)

Preview (not production): https://india-pharma-export-o7chtcwp2-mikki4823s-projects.vercel.app
Protected by Vercel login (project default, unchanged). Sign in to Vercel to open it.
Superseded earlier previews: `...-3gji4oi37-...` (same build without the badge-contrast fix), `...-1te2ebfmt-...` (round 1).

Deployed with `vercel deploy --prebuilt` (no `--prod`) from `.vercel/output`, because `.vercelignore` excludes ~14 MB of images that a source deploy would have dropped.
Production untouched: newest production deployment is still `dpl_6gY5UNW5...` (created Sept 2026). No DNS, domain, env var or setting changed. The project has no env vars.

## Build
`npm run build` passes, 1,672 pages. Temporary CTA fixture deleted; `/cta-fixture-tmp/` is 404 on the preview and absent from `dist` and `.vercel/output`.

## Tests (local server on the identical build, real Chrome, network stubbed)
| Area | Result |
|---|---|
| Commerce CTAs (fixture, deleted after) | Rx: 0 buy/cart elements; OTC: buy/cart in US only; CA/OTHER bulk; UK/AE check availability; hideBulk, not-available, review cases correct |
| Real pages | 1,272 pages with CTA blocks: 0 BUY_NOW, 0 ADD_TO_CART, no duplicate elements |
| Catalogue search and filters | search, no-match empty state, category, prescription class, sort, "Show more" (12 of N) all work |
| RFQ modal | validation blocks empty steps and bad email; server error shows "We could not send your enquiry..." with no reference; success shows reference only after accepted |
| Multi-product RFQ | 3 items in RFQ list -> "Use my RFQ list" -> all 3 sent, entry_point recorded |
| Mobile nav | menu opens (aria-expanded true), no horizontal overflow at 390 px |
| Overflow at 390 px | 13 pages, none |
| Console errors | Lighthouse errors-in-console: 0 on all 26 runs |
| Internal links | 1,672 unique, 0 broken |
| SEO | canonical/title/description on all; one h1 on all; 0 duplicate ids; 1,532/1,532 molecule routes |
| URLs vs live production sitemap | 130 production URLs, all 130 present in the build; build adds 1,542 new URLs (1,532 molecule pages plus buyer pages etc.) |
| External links (compliance page, 16) | 13 returned 200 to scripts; fda.gov 404 and fda.gov.ph 403 to scripts (open in a browser); pharmexcil.com timed out from scripts twice (loaded earlier in round 2) |

## Lighthouse (production build, localhost, 26 runs)
All 13 pages in mobile and desktop score 100/100/100/100 except `product-mobile` performance 99. LCP 0.2-0.6 s desktop, 0.9-2.0 s mobile; CLS 0 to 0.003.
Found and fixed in this pass: formulations category page accessibility 96 (amber badge contrast 4.16:1); `--color-warning` darkened to `#7f5608`, re-run 100/100/100/100. JSON in `docs/lighthouse/preview-*.json`.

## Screenshots
`docs/screenshots/preview-<page>-desktop.png` (1440 px) and `-mobile.png` (390 px emulated, tall pages cropped at 5,000 px) for home, catalogue, product, molecule-index, molecule, category, market, buyer, compliance, request-quote, shop, contact, about; plus `preview-bulk-rfq-modal-desktop.png` and `-mobile.png`.

## Not tested / outstanding
- The preview itself is behind Vercel login, so interactive browser tests ran on a local server of the identical build; the preview was checked by fetch only (molecule page, products page, fixture 404).
- No real submission, file upload or delivery: the Vercel project has no Resend/Airtable/Web3Forms variables. Preview submissions will return "could not send" (by design, no fake success).
- Real phones, screen readers, live analytics not tested.
- Organization structured data on every page still says "WHO-GMP certified manufacturing partners" (unverified; the owner declined wording changes earlier).
- 24 countries without verified regulator links; "Provided by" column and licence steps need business review (see COMPLIANCE_SOURCES.md).
- Molecule pages are near-duplicates (index/noindex decision open); production sitemap would gain 1,532 URLs.
- Legal name, address, socials unset.
