# Performance audit (baseline)

Baseline numbers for the live site are in [PERFORMANCE_BEFORE_AFTER.md](PERFORMANCE_BEFORE_AFTER.md) (Lighthouse, 6 page types x mobile/desktop).

## Baseline findings, in priority order
1. **Home page 10.4 MB**: unoptimised PNG category/market/hero/CTA images. Mobile LCP 3.4 s, desktop perf 66.
2. **Layout shift 0.166 (home) and 0.236 (market) on desktop**: web-font swap from Google Fonts.
3. **Molecule index (mobile perf 54, LCP 4.1 s, 1.0 s blocking)**: ~2,400 rows rendered at once.
4. **Products page 3.7 MB**: oversized PNGs in category cards.
5. Third-party requests: Google Fonts only (no analytics at the time).
6. JavaScript is small (Astro ships none by default; only Fuse.js on search and small inline scripts).

All six are addressed; see the after table. Open items: field INP data, a smaller mobile image for product pages.
