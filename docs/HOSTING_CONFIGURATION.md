# Hosting configuration

## What the project actually uses
- Framework: Astro 7 (`package.json`), package manager: **npm** (`package-lock.json`), build: `npm run build`.
- `astro.config.mjs` sets `adapter: vercel()` (`@astrojs/vercel`). Pages are prerendered static HTML; only routes with `export const prerender = false` become serverless functions.
- Host: **Vercel**, project `india-pharma-export`, production domain `www.pharmaxports.com`.

## Does `/api/rfq` work in production?
- `prerender = false` alone would do nothing without an adapter. Here the Vercel adapter is installed, and the build (`npm run build`) produces a Node function (`.vercel/output/functions/_render.func`) that handles `/api/rfq`. Build passes.
- A preview deployment of the earlier code was served from Vercel successfully (the site, images and 404 page). **The new `/api/rfq` code has not been deployed yet**, so a live test of the endpoint on Vercel has not been run. After deploy, `GET https://www.pharmaxports.com/api/rfq` should return `405` and a valid empty `POST` should return `400`/`503`; that proves the function is live.
- Local behaviour (`astro dev`, same code path) was tested heavily; see `RFQ_TEST_RESULTS.md`.
- Secrets are read from `process.env` at request time inside the function and never reach the browser. Only `PUBLIC_*` variables are built into pages.

## Current Vercel state
- **No environment variables are set** on the project (checked with `vercel env ls`). So today every enquiry falls back to Web3Forms, and file attachments are refused.

## What to set in Vercel (Settings -> Environment Variables, Production)
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY`, `FROM_EMAIL`, `SALES_EMAIL` | Email delivery and **attachments**. `FROM_EMAIL` must be on a domain you have verified in Resend (SPF/DKIM) |
| `AIRTABLE_TOKEN`, `AIRTABLE_BASE`, `AIRTABLE_TABLE` | Lead storage and durable duplicate protection. Table needs the columns listed in `src/pages/api/rfq.ts` (`Lead ID`, `Created At`, `Source`, `UTM Source`, `UTM Medium`, `UTM Campaign`, `Product`, `Quantity`, `Country`, `Buyer Name`, `Company`, `Email`, `Phone`, `Target Price`, `Message`, `Status`) |
| `REPLY_TO_EMAIL` | Optional, used in the acknowledgement |
| `SEND_ACK_EMAIL` | `true` to email the visitor an acknowledgement (off by default) |
| `TURNSTILE_SECRET` | Optional bot check. The widget itself is not on the forms yet, so enabling the secret alone would reject all submissions; add the widget first |
| `RFQ_RATE_LIMIT` | Optional, default 8 per 10 minutes per IP |
| `PUBLIC_GTM_ID` / `PUBLIC_GA4_ID` | Google (see `GOOGLE_SETUP_GUIDE.md`). Build-time: redeploy after changing |

Do **not** set `AIRTABLE_API_BASE` / `RESEND_API_BASE` in production; they exist only for tests.
Server variables are read at runtime, so no rebuild is needed for them (a redeploy is still the simplest way to be sure they are picked up).

## Hard rate limiting
The in-memory limiter is per instance. Add a Vercel Firewall rule (Project -> Firewall -> Rate Limiting) on `POST /api/rfq`, for example 10 requests per minute per IP. This changes an external account setting, so it was not done for you.

## Attachment storage decision
Files are emailed as attachments (Resend) and not stored. That avoids storage credentials and public URLs. If you later need files kept and shared, add private object storage (for example Vercel Blob or S3 with signed URLs) behind this endpoint; the validation code in `src/lib/rfq-files.ts` can be reused unchanged.

## Business impact of moving host
Not changed. Moving to Cloudflare or Netlify would mean swapping the adapter and re-entering the variables; no code change to the form logic.
