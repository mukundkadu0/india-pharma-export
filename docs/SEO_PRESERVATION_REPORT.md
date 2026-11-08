# SEO preservation and performance report

## URLs
| Check | Result |
|---|---|
| Built pages before this work (earlier review) | 1,663 |
| Built pages now | **1,672** = 1,663 + 9 new (`/buyers/` and 8 segment pages) |
| Routes removed or renamed | None. No redirects were needed |
| Sitemap | 1,672 URLs, including 9 `/buyers/` URLs (Astro sitemap, unchanged config) |
| Internal links | 1,677 unique internal links from all built pages, 0 broken |

## On-page checks (all 1,672 built pages)
| Check | Result |
|---|---|
| `rel="canonical"` | present on every page |
| `<title>` and meta description | present on every page |
| Exactly one `<h1>` | every page |
| Duplicate element ids | 0 pages |
| hreflang | 0 pages. Correct for now: only English is enabled. Alternates appear automatically when a second language is enabled |
| `<html lang dir>` | `en` / `ltr` |
| Structured data | Unchanged: Organization, WebSite with SearchAction, Product, FAQPage on products and markets. No reviews, prices or offers were added |
| Robots | Unchanged (`index, follow`) |
| Breadcrumbs | Kept; new pages have them |

## Content preserved
No product, molecule, market, glossary, FAQ or resource content was deleted. The home page copy changed (new hero and sections). The old home page text about "India's Trusted Partner" is gone; titles and descriptions of the home page changed accordingly. If the old home title was ranking for a branded query, watch Search Console after deployment.

## Performance (Lighthouse, mobile preset, simulated slow 4G, headless Chrome)
Run on the production build (`dist/client`) served locally with gzip. Lab data only. **Field Core Web Vitals (CrUX) could not be checked because the new build is not deployed.** Raw reports: `docs/lighthouse/*.json`.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home | 100 | 100 | 100 | 100 | 0.9 s | 0 | 0 ms |
| Catalogue | 100 | 100 | 100 | 100 | 1.1 s | 0 | 20 ms |
| Product | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| Request a Quote | 100 | 100 | 100 | 100 | 0.9 s | 0 | 0 ms |
| Buyer segment | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

### What was found and fixed
1. First run (served without compression): catalogue 68, product 80. Causes: the catalogue HTML is 793 KB uncompressed, and two images I had just added were oversized (`favicon.png` 269 KB, `logo-header.png` 213 KB). Fix: favicon 6 KB, header logo 15 KB JPEG, footer logo 30 KB JPEG. Vercel compresses HTML in production, so the gzip run is the representative one.
2. Accessibility 96 to 97 on all pages, from colour contrast only (slate text 4.42:1, green badge 3.82:1). Fixed at token level; 100 after.
3. Serif font file removed (one fewer preloaded font).

### Not done
- The catalogue page is still heavy HTML (793 KB raw) because every product card embeds per-country button data and the molecule index lists about 1,500 links. Scores are fine after compression, but this is the first thing to trim if mobile field data is poor.
- No image resizing or `srcset` work on product images (existing WebP files were kept).
- Lighthouse was not run on molecule pages, market pages or the desktop preset.
- Caching headers are Vercel's defaults; no custom caching was added.
