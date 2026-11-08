# Implementation QA

Result of the review requested before any further redesign. Supporting detail: `BUGS_FIXED.md`, `RFQ_TEST_RESULTS.md`, `HOSTING_CONFIGURATION.md`, `GOOGLE_ANALYTICS_TEST_RESULTS.md`.

## Verdict
The enquiry system builds (`npm run build` passes) and passes its functional tests locally against mock Airtable/Resend. **It is not proven against real services, and production currently has no delivery channel configured.** The previous report overstated the state of the code in several places (below).

## Review items

| Item | Finding | Status |
|---|---|---|
| 1. `QuoteForm.astro` audit | Confirmed bug: `kind` never destructured, everything hard-coded `buyer`. No duplicate Astro declarations, no nested forms. Duplicate IDs/names: none in the form; the page-wide duplicate-ID check found the logo gradient IDs (fixed; 0 duplicates across 1,663 built pages). Invalid phone `pattern` fixed. Required fields now depend on `kind`. Prefill works for `buyer` | Fixed |
| 2. Attachments | Had been silently replaced by a link field. Real upload restored with server-side extension, declared-MIME and content checks, 4 MB cap, emailed (no public storage). Refused with a clear message when email delivery is not configured. Link field kept as an extra | Fixed, tested with mocks; **no real mail sent** |
| 3. RFQ architecture | `rfq-client.ts`, `api/rfq.ts`, QuoteForm, bulk modal, inquiry list and OTC cart now share one validated pipeline. Partnership and general forms added. References are accepted-only; failures never show success; kinds stay separate; UTMs and landing page preserved; server validates; honeypot and rate limit work; idempotency added | Fixed / tested |
| 4. Hosting | Vercel + `@astrojs/vercel`; build emits `_render.func` that serves `/api/rfq`. **New endpoint code not yet deployed**, so no live test. **No env vars on the Vercel project** | Documented |
| 5. Google Analytics | Env-driven, consent default before tags, one install only, `rfq_submit` after acceptance only, `add_to_inquiry` is not a lead. Nothing verified inside Google | Verified in code/build; Google side open |
| 6. Tests | Build, 43 API cases, browser tests (success with file, failure with no success, retry reusing the reference), duplicate-ID scan | Done; gaps listed below |

## Gaps (honest list)
- `/inquiry/`, `/shop/cart/`, `/contact/` general form and the bulk modal were not clicked through in a browser.
- Real Airtable, Resend, Web3Forms and Turnstile were not exercised; no real enquiry was sent.
- No virus scanning of attachments.
- Rate limiting and de-duplication memory are per serverless instance; add a Firewall rule.
- The Web3Forms fallback cannot guarantee the idempotency that the main path has; a duplicate is possible only if the server accepted a lead yet failed to answer twice in a row.
- Turnstile widget is not on the forms (only the server check exists).
- Visual redesign was not started, as instructed.

## Not deployed
Nothing in this review has been deployed. The last successful deployment is the earlier **preview**; production is unchanged. Deploying needs your approval.
