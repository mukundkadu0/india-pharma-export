# RFQ and email integration audit

Code reviewed: `src/pages/api/rfq.ts`, `src/lib/rfq-client.ts`, `src/lib/rfq-files.ts`, `src/components/QuoteForm.astro`, `src/pages/inquiry.astro`, `src/pages/shop/cart.astro`, legacy `src/pages/api/bulk-lead.ts`. Run 2026-11-09. No credentials were used or created; no real enquiry was sent.

## 1. Correction and fix: the backup channel could send real email from previews
**What I got wrong:** my preview report said submissions on the preview "return could not send". That was wrong. When the server has no channel configured it answers 503, and the browser then falls back to **Web3Forms**, which delivers a real email to the owner's inbox. The preview has no email or Airtable variables, so any submission on it would have gone to the owner's inbox as a live enquiry. My tests stubbed the network, so nothing leaked. Production behaves the same way today.

**Fix applied (small, `src/lib/rfq-client.ts`):** the Web3Forms fallback now runs only on `www.pharmaxports.com` and `pharmaxports.com`. On previews, localhost and any other host a failed server call shows "Enquiry delivery is switched off on this test site, so nothing was sent." Verified in Chrome at desktop and mobile widths with the network intercepted: after a 503 from `/api/rfq`, **0** requests were made to Web3Forms and no reference number was shown.

## 2. Findings
| Area | Result |
|---|---|
| Client validation | Required fields per step, email format, step blocking: tested (desktop and 390 px): empty steps blocked, bad email blocked |
| Server validation | Per-type required fields, email regex, phone pattern, https-only file link, 6,000-character field cap, NUL stripping. **Pass** |
| Email header safety | Subject collapsed to one line; `reply_to` only after the email regex (no whitespace allowed). **Pass** |
| Airtable query | The only interpolated value is the idempotency key, and it is queried only if it matches `PX-YYMMDD-XXXXXXXX`. **Pass** |
| Multi-product RFQ | RFQ list of 3 products: "Use my RFQ list" fills all three; tested desktop and mobile. **Pass** |
| File upload | PDF, XLSX, XLS, CSV only; 4 MB limit; content/magic-byte check; macro-enabled files refused; filename sanitised; sent as an email attachment only; refused (not faked) when no email channel is configured. The mock suite covers these (section 4). Vercel functions accept bodies up to about 4.5 MB, so the 4 MB cap is close to the platform limit |
| Success handling | Reference shown only after the server (or, on production only, the fallback) accepts. **Pass** |
| Error handling | 429, 413, 4xx and 5xx messages are distinct; failed attempts keep the same key so a retry cannot duplicate |
| Spam protection | **Honeypot:** a bot gets a fake success and a reference that was never stored (by design). **Rate limit:** 8 per 10 minutes per IP, but held in memory per serverless instance, so it only blunts casual abuse. **Turnstile:** server check exists but **no widget exists in the client** (see 3a) |
| API security | POST only (GET returns 405), secrets read from `process.env` on the server, no CORS headers, no Origin check |

## 3. Defects and risks (not fixed unless stated)
a. **Turnstile trap.** If `TURNSTILE_SECRET` is set today, every submission fails with "Verification failed", because no form sends a Turnstile token. **Do not set `TURNSTILE_SECRET` until a widget is added.**
b. **Rate limit is weak on serverless.** Add a Vercel Firewall rate-limit rule on `/api/rfq`.
c. **No Origin check.** Any site can POST to `/api/rfq` from a visitor's browser or a script. There is no login or cookie so no data is at risk, but it allows spam. Suggest an Origin allow-list (needs approval; small change).
d. **Web3Forms access key is in client source** (`src/data/site.ts`, sent in every form). Web3Forms keys are designed to be public, but this one is tied to the owner's personal inbox, so anyone can post directly to it and bypass the honeypot and rate limit. Suggest: once Resend or Airtable is live, remove the fallback, or restrict the key to the production domain in the Web3Forms dashboard, and rotate it. I have not printed the key here.
e. **Dead endpoint `/api/bulk-lead`.** Nothing in the site calls it any more; it is still built as a serverless function with its own Airtable writer and no idempotency. Recommend deleting it (approval needed).
f. **Backup channel cannot carry attachments** (stated honestly to the visitor).
g. **Idempotency memory is per instance.** With Airtable the key is also looked up in the table; with Resend only, Resend's `Idempotency-Key` header deduplicates for 24 hours. Acceptable.
h. Airtable writes only the columns the original table already has; a missing column returns 422 and the request falls back to email.

## 4. Mock-server integration tests
**Result, 2026-11-09: 43 of 43 checks passed** (unconfigured 4/4, configured 35/35, failover 3/3, rate limit 1/1). Covered: valid and invalid buyer, partnership and general enquiries; Airtable record created once with UTM and landing page; one sales email with reply-to; no acknowledgement email by default; same-key retry returns the same reference with no second record or email; two parallel requests with one key give one record and one email; honeypot stores nothing; PDF, XLSX, XLS and CSV accepted; macro workbooks, fake ZIPs, binary CSV, HTML or EXE renamed to .pdf, wrong MIME type and a 5 MB file refused; path-traversal filename sanitised; one channel down still succeeds; all channels down gives 502 (never a fake success) and a retry after recovery delivers; the 9th request in 10 minutes gets 429. The configured phase needs the test-only override `RFQ_RATE_LIMIT=1000`; at the default limit of 8 the suite itself trips the limiter (an earlier run without it showed 7 false failures for that reason). These tests exercise the server code only, not real Airtable or Resend accounts. Method: `astro dev` on localhost with a mock Airtable and Resend on localhost (`AIRTABLE_API_BASE` and `RESEND_API_BASE` pointed at the mock). The harness uses placeholder strings in process memory only. Nothing is persisted and nothing leaves the machine.

## 5. Deployment checklist: environment variable NAMES only
Set these in Vercel, scoped separately for **Preview** and **Production**. Never commit values.
| Name | Needed for | Notes |
|---|---|---|
| `RESEND_API_KEY` | email delivery | server only |
| `FROM_EMAIL` | email delivery | must be on a Resend-verified domain (SPF, DKIM) |
| `SALES_EMAIL` | email delivery | who receives enquiries. Use a test mailbox in Preview scope |
| `REPLY_TO_EMAIL` | optional | shown in the acknowledgement mail |
| `SEND_ACK_EMAIL` | optional | `true` mails the visitor; off by default (it can be abused to mail third parties) |
| `AIRTABLE_TOKEN`, `AIRTABLE_BASE`, `AIRTABLE_TABLE` | lead store | all three needed together |
| `PUBLIC_GA4_ID` or `PUBLIC_GTM_ID` | analytics | public values; set only after the privacy wording matches |
| `TURNSTILE_SECRET` | spam check | **do not set yet** (3a) |
| `RFQ_RATE_LIMIT` | tests only | leave unset in production (default 8) |
| `AIRTABLE_API_BASE`, `RESEND_API_BASE` | mock tests only | **must never be set in Preview or Production** |

At least one of the email set or the Airtable set is required. With neither, `/api/rfq` answers 503 and (on production) the Web3Forms backup is used.

## 6. How to test real delivery safely
1. Create a separate Airtable "RFQ test" base and table with the same columns, and a test mailbox. Do not use the live base.
2. In Vercel, add the variables above in **Preview** scope only, restricted to the branch `release/round-2-preproduction-review` (branch-specific Preview variables), with `SALES_EMAIL` set to the test mailbox and the test Airtable base.
3. Open the branch preview and submit one clearly marked enquiry ("QA TEST, ignore"). Confirm one Airtable record and one email; resubmit with the same key to confirm no duplicate; try a small PDF and a macro-enabled file (must be refused).
4. Confirm the rate-limit and error paths, then delete the test records.
5. Only after approval, add the Production-scope variables and repeat once with a clearly marked test enquiry.
Because of the fix in section 1, previews send nothing unless these Preview variables exist, so previews can no longer create a live enquiry by accident.
