# Performance: before and after

**Tool:** Lighthouse (CLI, Microsoft Edge headless), categories performance / accessibility / best-practices / SEO. One run per page per form factor.

**Important caveat on comparability.**
- *Before* = the live site https://www.pharmaxports.com, tested over the real network.
- *After* = the new production build served from `localhost` with Brotli compression and long-lived cache headers (a small Node static server that mimics Vercel). It is **not yet deployed**, so the *after* numbers are local; network latency is near zero, which flatters LCP. Re-run against the deployed URL for the true figures.
- Single runs vary by a few points; treat small differences as noise.

## Before (live site)

| Page | Perf | A11y | BP | SEO | LCP s | CLS | TBT ms | KB |
|---|---|---|---|---|---|---|---|---|
| home mobile | 84 | 97 | 100 | 92 | 3.4 | 0 | 0 | 10,362 |
| home desktop | 66 | 97 | 100 | 92 | 3.3 | 0.166 | 0 | 10,362 |
| products mobile | 98 | 96 | 100 | 100 | 1.9 | 0.001 | 0 | 3,714 |
| products desktop | 99 | 92 | 100 | 100 | 0.7 | 0.004 | 0 | 3,714 |
| product mobile | 98 | 97 | 100 | 100 | 1.8 | 0 | 0 | 102 |
| product desktop | 85 | 97 | 100 | 100 | 1.6 | 0.007 | 0 | 102 |
| molecules mobile | 54 | 90 | 100 | 100 | 4.1 | 0 | 1016 | 267 |
| molecules desktop | 77 | 90 | 100 | 100 | 2.2 | 0.008 | 0 | 267 |
| market mobile | 99 | 96 | 100 | 100 | 1.8 | 0 | 0 | 101 |
| market desktop | 88 | 96 | 100 | 100 | 0.6 | 0.236 | 0 | 101 |
| quote mobile | 99 | 95 | 100 | 100 | 1.7 | 0 | 0 | 99 |
| quote desktop | 100 | 95 | 100 | 100 | 0.6 | 0.002 | 0 | 98 |

## After (new build, local, compressed)

| Page | Perf | A11y | BP | SEO | LCP s | CLS | TBT ms | KB |
|---|---|---|---|---|---|---|---|---|
| home mobile | 99 | 97 | 100 | 100 | 1.1 | 0 | 114 | 889 |
| home desktop | 100 | 97 | 100 | 100 | 0.6 | 0.000 | 0 | 931 |
| products mobile | 99 | 96 | 100 | 100 | 0.9 | 0 | 68 | 490 |
| products desktop | 100 | 92 | 100 | 100 | 0.3 | 0 | 0 | 708 |
| product mobile | 99 | 97 | 100 | 100 | 2.1 | 0 | 0 | 135 |
| product desktop | 100 | 97 | 100 | 100 | 0.4 | 0.005 | 0 | 162 |
| molecules mobile | 93 | 96 | 100 | 100 | 1.3 | 0 | 258 | 194 |
| molecules desktop | 98 | 96 | 100 | 100 | 0.4 | 0.005 | 2 | 194 |
| market mobile | 100 | 100 | 100 | 100 | 0.8 | 0 | 0 | 133 |
| market desktop | 100 | 100 | 100 | 100 | 0.2 | 0 | 0 | 192 |
| quote mobile | 100 | 100 | 100 | 100 | 0.9 | 0 | 0 | 103 |
| quote desktop | 100 | 100 | 100 | 100 | 0.3 | 0 | 0 | 103 |

## Targets
- LCP <= 2.5 s: met on all 12 runs (local).
- CLS <= 0.1: met on all 12 runs. Before: 2 pages failed (home desktop 0.166, market desktop 0.236).
- INP: **not measured.** Lighthouse lab runs cannot measure INP; Total Blocking Time is shown as the lab proxy (highest: 258 ms on the molecule index on mobile). Real INP needs field data (Search Console / CrUX) after launch.

## What changed
- Images PNG -> WebP (home 10.4 MB -> 0.9 MB); hero image high-priority, below-fold lazy.
- Google Fonts replaced with self-hosted, preloaded fonts (removes two third-party connections and the layout shift from font swap).
- Molecule index rows use `content-visibility: auto` (mobile TBT 1,016 -> 258 ms).
- Unused font weight dropped; explicit image dimensions on new images.

## Still open
- Product page mobile LCP 2.1 s (under target but the slowest); candidate: smaller box image variant for mobile.
- Products desktop accessibility 92 (not investigated in this pass).
