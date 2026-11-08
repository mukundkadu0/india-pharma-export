# Website audit

Audited 2026-11-06 against the repository at `MedX/` and the live site https://www.pharmaxports.com (production as of the previous deploy).

## Architecture (verified from the repo)

| Area | Finding |
|---|---|
| Framework | Astro 7.3 (`astro@^7.3.2`), TypeScript, Tailwind CSS 4 |
| Rendering | Static pages; only `src/pages/api/*` run as serverless functions (`prerender = false`) |
| Hosting | Vercel via `@astrojs/vercel`. Project `india-pharma-export` (team `mikki4823s-projects`) serves `www.pharmaxports.com` |
| Package manager | npm (`package-lock.json`) |
| Data | JSON content collections in `src/content/`: `molecules` (2,376 after removals), `classes` (36), `products` (27), `markets`, `glossary`, `resources`, `faqs` |
| Product pages | 27 hand-written + 1,532 generated molecule pages (free-export classes only) |
| Search | Fuse.js over `/search-index.json` (client-side) |
| Forms | Main RFQ form, bulk-RFQ modal, inquiry list page, shop cart. Delivery: Web3Forms (client-side) and, when configured, `/api/rfq` -> Airtable/Resend |
| Analytics | **None installed at audit time.** `dataLayer.push` calls existed but no tag loaded, so no event was measured |
| Structured data | Organization, WebSite, BreadcrumbList, Product, FAQPage, Article, DefinedTerm |
| Sitemap / robots | `@astrojs/sitemap` -> `sitemap-index.xml` (1,662 URLs); `robots.txt` allows all and links the sitemap |

## Top 10 problems, ranked by business impact

1. **No analytics or conversion tracking at all.** Nothing could be measured: no GA4, no GTM, no Search Console linkage in code, and the existing `dataLayer` events went nowhere. *Fixed (integration points; needs your IDs).*
2. **RFQ success could be reported without confirmation.** The main form treated any HTTP 200 as success, including a form-service reply that says `success:false`. There was no reference number and no attribution capture. *Fixed.*
3. **A file-upload field that never delivered.** The RFQ form offered "Upload Product List" but the form service (free tier) ignores attachments, so buyers believed a file was sent. *Fixed: replaced with a product-list link field.*
4. **Contact details were placeholders** (`+91 00000 00000`, a non-existent email domain). *Fixed: real phone and `info@pharmaxports.com` set. Other business details still need verifying, see BUSINESS_INFORMATION_REQUIRED.md.*
5. **Home page weighed 10.4 MB** (unoptimised PNGs). *Fixed: 0.9 MB.*
6. **Layout shift above Google's threshold** on the home (0.166) and market pages (0.236) caused by web-font swapping. *Fixed: fonts self-hosted and preloaded; CLS 0.000.*
7. **Molecule index renders ~2,400 rows at once**: 1.0 s main-thread blocking on mobile (Lighthouse mobile 54). *Improved: 93, using `content-visibility`.*
8. **Duplicate page titles**: 24 molecule pages shared a title because one molecule sits in several classes. *Fixed: class added to the title (0 duplicates).* The underlying issue (the same molecule appearing under multiple classes with near-identical pages) remains, see SEO_AUDIT.md.
9. **Accessibility gaps**: low-contrast orange and grey text, white-on-orange buttons, unlabeled select, button labels not matching visible text, non-descriptive "Learn More", skipped heading levels in the footer, small tap targets. *Fixed (see IMPLEMENTATION_REPORT.md).*
10. **No consent handling** for analytics/advertising cookies. *Fixed: Consent Mode v2 defaults to denied; banner appears only when a Google ID is configured.*

## Not audited / out of scope of this pass

- Broken-link crawl of the full 1,662-URL sitemap (not run).
- Keyboard-only walkthrough of every flow (not run).
- Real-device mobile testing (measured with Lighthouse and a 390 px frame only).
