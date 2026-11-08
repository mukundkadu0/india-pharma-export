# Google Analytics: review and test results

No real GTM container or GA4 property exists yet, so **nothing was verified inside Google**. What was checked is the page code and the events the site pushes.

| Check | Method | Result |
|---|---|---|
| IDs come from environment variables only; no fictional IDs in code | Read `Analytics.astro`, `ConsentBanner.astro`, grep for `GTM-`/`G-` | Pass. Only `PUBLIC_GTM_ID` / `PUBLIC_GA4_ID`; `.env.example` has empty values |
| Nothing loads without an ID | Built with no IDs, inspected `/request-quote/` HTML | Pass: 0 Google loaders, no consent banner |
| GTM set -> only GTM loads | Built with test IDs `GTM-TESTONLY` and `G-TESTONLY00` both set | Pass: 1 GTM loader, 0 gtag loaders (no duplicate GA4 install from code) |
| GA4 only -> only gtag loads | Built with GA4 ID only | Pass: 1 gtag loader |
| Consent default is set before any Google tag | Compared positions in built HTML | Pass: consent default (about char 2,470) precedes the loader (about 2,880-3,080) in all builds |
| Consent banner appears only when an ID exists, Accept/Decline both keep the site usable | Code read and build output | Pass for presence; **banner click behaviour not browser-tested** |
| `rfq_submit` fires only after an accepted enquiry | Browser test: failed submission -> no event; accepted -> exactly one `rfq_submit` with `transaction_id` = reference | Pass |
| Buyer / partnership / general use different events | Browser test of buyer and partnership | `rfq_submit`, `supplier_enquiry_submit`; general uses `general_enquiry_submit` (code path, not browser-tested) |
| The same reference cannot fire twice | `trackRfqSubmit` keeps a per-page set of references | Pass by code; retry test showed one event |
| `add_to_inquiry` is not a lead | It is a separate event name, fired from the layout; only `rfq_submit` is a conversion | Pass by code |
| UTM source/medium/campaign survive navigation to the form and reach the lead | Browser test: landing on `/request-quote/?utm_...`; stored in `sessionStorage`; present on the Airtable record | Pass. Also fixed: a tagged visit now replaces an untagged first touch (still same-tab session only) |
| Events not duplicated | `rfq_start` is `once` per form; click events use one delegated listener; `Analytics` is included once in `BaseLayout` | Pass by code |

## Not verified
- Anything inside GA4 or GTM (DebugView, GTM Preview, key events, Ads conversions).
- The consent banner in a real browser and Google's consent signalling.
- Cross-tab attribution: `sessionStorage` is per tab, so a visitor who returns days later loses the tag. For longer attribution, store in a first-party cookie after consent.

## Exact setup for this implementation
See `GOOGLE_SETUP_GUIDE.md`. Summary:
1. Create a GTM container; put `GTM-XXXXXXX` in Vercel as `PUBLIC_GTM_ID`; redeploy.
2. In GTM add one GA4 Configuration tag (All Pages). **Do not also set `PUBLIC_GA4_ID`** or you would install GA4 twice if you also add it in code.
3. Add GA4 Event tags triggered by Custom Events named `rfq_submit`, `supplier_enquiry_submit` (and optionally `general_enquiry_submit`, `whatsapp_click`, `phone_click`, `email_click`, `product_search`, `product_view`, `add_to_inquiry`, `rfq_start`).
4. Mark `rfq_submit` (and `supplier_enquiry_submit`) as key events in GA4.
5. Verify with GTM Preview on the live site, then submit one test enquiry yourself and confirm one `rfq_submit` with a `transaction_id`.
