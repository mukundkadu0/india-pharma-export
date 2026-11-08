# Implementation report

Scope note: the brief is very large. This report states exactly what was built, tested and left undone.

## Built and tested

| Area | What changed | How it was checked |
|---|---|---|
| Lead pipeline | `src/pages/api/rfq.ts` (validation, honeypot, rate limit, Turnstile, Airtable/Resend, reference no.), `src/lib/rfq-client.ts` (server first, form-service fallback, success only on confirmed accept) | Endpoint tested directly: valid -> 503 when no channel configured (so the browser falls back instead of showing false success); bad email, bad phone and missing field -> 400 with messages; honeypot -> silent 200; 6th request -> 429 |
| RFQ form | 7 required fields, collapsible details, link instead of upload, phone validation, success panel with reference number | Build passes; markup inspected. **Not submitted end-to-end** (would send a real email via the live form service) |
| Bulk modal | Uses same pipeline and tracking | Build passes. Not exercised in a browser; its field set was blocked by the rate limiter during my test run |
| Google integration | `Analytics.astro` (GTM or GA4 from env vars, Consent Mode v2), `ConsentBanner.astro`, `pxTrack` event helper, attribution capture (UTM, gclid, landing page, referrer) | Build passes; no IDs set, so the tags are intentionally inert. **Tracking events were not verified against a real GA4/GTM property** |
| Events | rfq_start, rfq_submit, whatsapp/phone/email click, product_search, product_view, add_to_inquiry, catalogue_download | Wired in code; verify with GTM Preview after you add an ID |
| Performance | WebP images, self-hosted preloaded fonts, `content-visibility` on molecule index | Lighthouse before/after (PERFORMANCE_BEFORE_AFTER.md) |
| Accessibility | Accessible orange token (`--color-accent-dark`) for text and white-on-orange buttons, darker small grey text, unique button labels, select label, footer heading order, tap targets 40-44 px | Lighthouse a11y 92-100 |
| UI | Header fits at 1280 px; molecule page single pack image; products page lists all 1,532 molecules by class with search; 27 product box images; new logo and favicon; floating WhatsApp; compact mobile spacing | Screenshots (desktop) and Lighthouse; phone layout measured in a 390 px frame only |
| Content | Narcotic/opioid/cannabinoid and market-banned molecules removed; Drop Shippers buyer type (OTC/AYUSH/devices only) | Build + search index checked |
| Contact | Phone +91 76663 99821, email info@pharmaxports.com | Contact page output verified |

## Files added
`src/components/Analytics.astro`, `src/components/ConsentBanner.astro`, `src/lib/rfq-client.ts`, `src/pages/api/rfq.ts`, `src/lib/molecules.ts`, `src/components/MoleculePage.astro`, `src/pages/llms-molecules.txt.ts`, `docs/*.md`.

## Files materially modified
`src/layouts/BaseLayout.astro`, `src/components/QuoteForm.astro`, `src/components/BulkRfqModal.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/Logo.astro`, `src/components/ProductCard.astro`, `src/pages/index.astro`, `src/pages/products/index.astro`, `src/pages/products/[slug].astro`, `src/pages/products/molecules/index.astro`, `src/styles/global.css`, `src/data/site.ts`, `src/data/taxonomy.ts`, `public/favicon.svg`, `.env.example`, `package.json` (two font packages).

## Requires external configuration
- `PUBLIC_GTM_ID` / `PUBLIC_GA4_ID` (Vercel env), then GA4/GTM/Ads setup per GOOGLE_SETUP_GUIDE.md.
- `AIRTABLE_*`, `RESEND_API_KEY`, `SALES_EMAIL`, `FROM_EMAIL` for the server lead channel; verified sending domain for Resend.
- Search Console property and sitemap submission.

## Not done
- Full homepage re-architecture per the brief's 15-section list (kept the existing structure, tightened it).
- Redesign to the brief's navy/teal/gold palette (existing navy/blue/orange kept).
- Catalogue filters for formulation/strength/API and pagination, and the five "quote-readiness" labels (no underlying data).
- Real file upload; partnership/general enquiry pages; `/inquiry/` and shop cart still use the older submit logic.
- Country landing pages; Rich Results Test; broken-link crawl; keyboard-only walkthrough; real-device testing.
- **Not deployed.** Nothing has been pushed to production.

## Known risks
- In-memory rate limiting is per serverless instance; add Vercel Firewall rate limiting or Turnstile for a hard limit.
- Production *after* numbers are from a local compressed server, not the deployed site.
- Thin/duplicate molecule pages (see SEO_AUDIT.md).
