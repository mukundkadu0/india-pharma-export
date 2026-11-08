# Round 2: consolidated report

Date: 2026-11-06. `npm run build` passes, 1,672 pages (no URL added or removed). **Nothing deployed to production.** A preview from before this round exists; this round is not deployed anywhere.

## Completed
| # | Task | What was done |
|---|---|---|
| 1 | Unify the RFQ | `QuoteForm` is now the single RFQ component (prefixed element ids, form-scoped script). `BulkRfqModal` embeds it as `variant="modal"`, so the modal has the same 3 steps, fields, validation, delivery, success message and reference as `/request-quote/`. Prefill: product from the card or row, country from the visitor's chosen destination (only if they chose one), RFQ list via "Use my RFQ list". Modal resets on every open, traps focus, Esc closes. A hidden `entry_point` field (`bulk_modal` or `page_form`) tells the two apart in submissions |
| 2 | Clean the catalogue | `CommerceCtas` renders a button only if some country can use it. Prescription products have **no** Buy Now or Add to Cart in their markup. Also fixed the molecule index and therapeutic-class pages, which showed Buy Now on prescription molecules |
| 3 | Molecule pages | All 1,532 redesigned. See `MOLECULE_PAGES_AUDIT.md` |
| 4 | OTC/AYUSH shop | New identity, a banner that separates it from B2B export, wording changed from "Buy Now / cart" to "Add to order request" (there is no price or payment), type filter, category counts, "Show more" paging, empty state, links to product details, a direct-order panel on OTC molecule pages. Order request page restyled and its item names are now HTML-escaped |
| 5 | Compliance authority links | 16 official sources on `#official-sources`, each opened and checked. See `COMPLIANCE_SOURCES.md` |
| 6 | Market pages | Reusable `MarketAuthorities` section on every market page, fed by `src/data/authorities.ts`. 10 of 34 listed countries have a verified regulator; the other 24 are shown honestly as "no verified link yet" |
| - | Translations | Not started, as instructed. English only; no language options shown; the i18n plumbing from round 1 is untouched |

## Test results
| Test | Result |
|---|---|
| Production build | Pass, 1,672 pages |
| Scan of all 1,672 pages | Canonical, title, description present on all; exactly one h1 on all; 0 duplicate ids; 1,672 unique internal links, 0 broken |
| 1,532 molecule routes | All present. All have RFQ actions, class link, Product and FAQPage schema. 0 prescription pages with a buy or cart button; 150 of 150 OTC pages have the order-request button |
| Catalogue and 27 product pages | 0 Buy Now, 0 Add to Cart; 27 Request Bulk Quote, 27 Add to RFQ list |
| RFQ entry points (real browser, network stubbed) | Catalogue card modal, molecule-page modal, class-page row modal, molecule-index modal, `/request-quote/` with URL prefill, home form, product-page form, `/inquiry/` multi-product list, contact and partner single-step forms: all pass. Empty steps blocked, success and reference only after the (stubbed) server accepted, correct fields sent, no duplicate ids with two forms on a page |
| OTC shop (browser) | Search, type filter, category tabs, paging, empty state, add to order request, badge and toast, order-request submit (stubbed), no "Buy Now", "Checkout" or price wording |
| Layout | 12 routes x 4 widths (320, 360, 390, 768) = 48 combinations: no horizontal overflow. Modal fits and keeps its Next button visible at each width |
| Lighthouse mobile (production build, gzip) | Molecule, shop, compliance, market, molecule index, class page: **100 / 100 / 100 / 100** (after fixes below) |
| External links | 16 official sources verified, see `COMPLIANCE_SOURCES.md` |
| Screenshots | `docs/screenshots/after-molecule-page.jpg`, `after-bulk-modal-3step.jpg`, `after-shop.jpg`, `after-compliance-sources.jpg`, `after-market-authorities.jpg`; Lighthouse JSON in `docs/lighthouse/r2-*.json` |

### Bugs the testing found (all fixed)
1. Prescription molecule rows on class pages and the molecule index offered Buy Now and added Rx items to a direct-order cart.
2. Shop category counts used reduced-opacity text that failed contrast (4.34:1).
3. On phones the molecule-index row squeezed the class link, then off-screen rows (reserved at 68 px) overlapped when stacked. Fixed by stacking rows and reserving a realistic height.
4. A missing space in the market-page "no verified link" sentence.
Test-harness mistakes (not product bugs): a wrong product id (404), wrong field names for the inquiry form, and a stale selector. These caused false failures that I corrected before reporting.

## Outstanding issues
1. **Molecule pages are near-duplicates** (98% shared lines within a class). Fixable only with real per-molecule data. Index or noindex is your decision (one switch, see the audit).
2. **Business verification needed:** the "Provided by" column, licence steps, special-handling figures, and the "WHO-GMP certified partners" wording. List in `COMPLIANCE_SOURCES.md`.
3. **24 countries lack a verified regulator link** (list in `COMPLIANCE_SOURCES.md`). Kenya, UAE and Australia were attempted and could not be verified.
4. **Not tested:** real file upload, a real submission (no delivery keys on Vercel), analytics events in a real tag, real phones, screen readers.
5. **The `/inquiry/` page** keeps its own form (different field names, no currency field). It works and uses the same delivery pipeline, but it is not the same component as the 3-step form.
6. **OTC shop:** the order request still uses the old Web3Forms-backed pipeline in production until Resend or Airtable keys are set. Shop items link to a detail page only where a molecule page exists (all 150 currently do).
7. **Business details** (legal name, address, social profiles) are still unset in `src/data/site.ts`.
8. **Not deployed.** No Vercel env vars. Search Console impact of the new molecule templates can only be judged after deployment.
