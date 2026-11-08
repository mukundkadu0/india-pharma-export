# Final QA: redesign

Date: 2026-11-06. Build: `npm run build` (npm, Astro 7) passes, 1,672 pages. **Nothing has been deployed.** All tests ran locally; the only deployment that exists is the earlier preview, which does not contain this work.

## Verdict
The redesigned buyer journey builds, renders and works in real browser tests, and the enquiry backend still passes its regression suite. It is **not proven against real services**: no real Airtable, Resend or Web3Forms call was made, and production has no delivery channel configured (no environment variables on the Vercel project), as documented in `HOSTING_CONFIGURATION.md`.

## What was tested and how

| Area | Test | Result |
|---|---|---|
| Build | `npm run build` after every phase and at the end | Pass |
| All pages | Scan of 1,672 built pages: canonical, title, description, one h1, duplicate ids | 0 problems |
| Links | 1,677 unique internal links from built HTML | 0 broken |
| Header | Browser: Products mega menu opens, Esc closes it. Drawer opens, focus moves to Close. Search overlay unchanged in logic | Pass. Desktop nav was forced visible because the test window is 1,278 px, just under the `xl` breakpoint |
| Homepage | Browser render, no horizontal overflow, h1 correct | Pass |
| Catalogue | Browser, scripted: dosage filter (27 to 3 results), clear, HS-code search, no-match empty state, pagination (12 to 24 of 27) | Pass |
| Product cards and page | Browser views, RFQ list add from the correct product page adds the correct product and strength | Pass |
| Product quote panel | Visual check. Form is a GET to `/request-quote/` with product prefilled | Rendered; submit-through not clicked |
| RFQ (3 steps) | Browser, scripted: prefill from URL (product, buyer type), empty Next blocked, Next to step 2 blocked until valid, Next to step 3, submit. Network stubbed: kind, product, country, quantity, buyer type, Incoterm, currency and port all sent; success shown only after the stubbed 200; Web3Forms was never called | Pass |
| RFQ list page | Browser, scripted, network stubbed: item present, buyer type required and sent, success with reference, list cleared | Pass |
| Bulk modal | Opens from the card's Request Bulk Quote with the product prefilled | Opened; submission not re-tested |
| Server (`/api/rfq`) | Regression with the mock Airtable and Resend from the earlier review: configured phase **35/35**, failover **3/3**; plus a direct check that Incoterm, currency and destination port reach the email and the Airtable record | Pass. The "unconfigured" (4 cases) and "rate limit" phases were not re-run; that code was not changed |
| File upload | Not re-tested in the browser this round (field name and endpoint unchanged; server cases from the earlier review still apply) | Gap |
| Mobile layout | Iframes at 320, 360, 390, 768 px, about 40 routes | No overflow after 3 fixes. See `MOBILE_UX_QA.md` |
| Performance and accessibility | Lighthouse mobile on 5 pages | 99 to 100 in all four categories. See `SEO_PRESERVATION_REPORT.md` |
| Language switcher | Not shown (one language). Build emits no hreflang | As designed |
| Analytics | Event code unchanged. Stubbed submit confirms the success path runs; no GA/GTM IDs are set in this build, so events were not observed in a tag | **Not re-verified** in a real tag manager |

## Bugs found by testing during this work
1. Unlayered `.btn` CSS overrode Tailwind `hidden` and `sm:hidden`, so the mobile Filters button showed on desktop. Fixed with `@layer components`.
2. Top bar and header overflowed at 360, 390 and 320 px. Fixed.
3. Long button labels did not wrap at 320 px. Fixed.
4. Contrast failures on slate text (4.42:1) and green badges (3.82:1). Fixed at the token level.
5. Oversized new images (favicon 269 KB, header logo 213 KB) hurt LCP. Re-encoded.
6. `markets.json` uses `medical-devices`, the taxonomy `devices`: category link would have been missing. Normalised in the page.
7. Two test-harness mistakes (wrong mock base URLs; a click run before navigation finished) caused false failures. They were test errors, not product bugs, and are recorded so nobody chases them.

## Known gaps and decisions for you
1. **Content needing owner review**: all eight buyer-segment pages (`src/data/buyers.ts`) and the "Provided by" column on the compliance page were drafted from general industry practice. Check every document and certification statement before publishing.
2. **Product data wording**: `products.json` still says "WHO-GMP certified manufacturing partners" for each product. You declined wording changes earlier; this is the main remaining unverified claim.
3. **Removed**: the "200+ countries" claims, the home statistics strip (figures unverified), the non-functional newsletter form, and the language popover.
4. **Not built**: translations and language URLs; per-country market pages; structured "relevant authorities" data; outbound links to authority sites; manufacturer-verified supply flags (no such data exists); a normalised strength field.
5. **Bulk modal** is a shorter variant, not the 3-step form. The OTC shop and the 1,532 molecule pages were not redesigned.
6. **Footer** shows only configured details: email, phone, "India". Legal name, address and social profiles are still unset in `src/data/site.ts`.
7. **Real-device testing** and screen-reader testing were not done.
8. **Deployment**: not done and not approved. Production still needs Resend and/or Airtable variables before enquiries (and uploads) work through `/api/rfq`.

## Suggested next steps
1. Review the buyer pages and compliance table text.
2. Deploy a **preview** (not production) and re-run the key checks there, including `GET /api/rfq` returning 405.
3. Add the Vercel environment variables and send one real test enquiry.
4. Decide whether to trim the catalogue HTML (793 KB raw) if mobile field data is weak.

## Round 2 (molecule pages, shop, unified RFQ, authority links)
See docs/ROUND2_REPORT.md for the full results, docs/COMPLIANCE_SOURCES.md for URL verification and the business-review list, and docs/MOLECULE_PAGES_AUDIT.md for the molecule pages. Two entries above are now out of date: the bulk modal is the same 3-step form as the Request a Quote page, and the OTC shop and molecule pages have been redesigned.
