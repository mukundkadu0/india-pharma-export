# SEO audit

Facts below come from the production build output (`.vercel/output/static`) and Lighthouse runs.

## Already in good shape
- `robots.txt` allows crawling and references `sitemap-index.xml`.
- Sitemap lists 1,662 URLs.
- Canonical URL present and correct on the pages checked (home: `https://www.pharmaxports.com/`).
- One `noindex` page in the build (the 404 page).
- Lighthouse SEO score: 100 on all six tested page types after the fixes.
- Structured data: Organization + WebSite on every page; BreadcrumbList, Product, FAQPage, Article, DefinedTerm on the relevant templates. Structured data matches visible content (FAQs shown on page).

## Problems found
| # | Issue | Status |
|---|---|---|
| 1 | 24 duplicate `<title>` values across molecule pages | Fixed (class in title; 0 duplicates) |
| 2 | Home page SEO 92: non-descriptive link text ("Learn More") | Fixed |
| 3 | Same molecule listed under more than one class produces near-duplicate pages (e.g. a molecule in both Urology and Hormones) | **Open.** Recommend picking one canonical class per molecule and `rel=canonical` or `noindex` the rest. Needs your decision on which class owns each molecule |
| 4 | 1,532 generated molecule pages are thin (name, class-level text, HS code, FAQ). The brief asks not to index thousands of thin pages | **Open, decision needed.** Options: (a) keep indexed but enrich with sourcing data as you get it, (b) `noindex` molecule pages and index only classes + the 27 hand-written products. Not changed; risk is Google treating them as low-value |
| 5 | Product structured data has no offers/prices | Correct by design: no invented prices. Do not add them unless real |
| 6 | FAQPage markup | Kept for coverage; Google no longer shows FAQ rich results for most sites, so do not expect them |

## Not done in this pass
- Country landing pages: `/markets/<region>/` pages already exist (7). Country-level pages (Nigeria, Kenya, UAE...) were **not** created; they need verified, country-specific regulatory content you or a regulatory adviser must supply, otherwise they would be near-duplicate pages.
- Google Rich Results Test: not run (it needs the live URL). Run it after deploy.
- Search Console: not connected (needs your account).
