# Google setup guide

The site is wired for Google but loads **nothing** until you set an ID. No fictional IDs are in the code.

## 1. Choose how to measure
- **Recommended: Google Tag Manager.** One container; GA4 and Google Ads are configured inside it without code changes.
- **Simple: GA4 directly.** Use only if you will not run Google Ads.

## 2. Set environment variables in Vercel
Project `india-pharma-export` -> Settings -> Environment Variables (Production, and Preview if wanted):

| Variable | Example | Notes |
|---|---|---|
| `PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Takes priority when set |
| `PUBLIC_GA4_ID` | `G-XXXXXXXXXX` | Used only when no GTM ID is set |

Redeploy afterwards (these are read at build time).

## 3. Consent
Consent Mode v2 is on: analytics and ad storage default to **denied**; a banner appears (only when an ID is set) and updates consent on Accept. Declining keeps the site fully usable. Update `/privacy/` to name the cookies/vendors you actually enable.

## 4. Events the site sends
Sent through `window.pxTrack`, as a GTM `dataLayer` event or a GA4 event:

| Event | When | Key parameters |
|---|---|---|
| `rfq_start` | Visitor first touches an RFQ form | `enquiry_type`, `page` |
| `rfq_submit` | **Only after the enquiry was accepted** (server or form service confirmed) | `transaction_id` (= reference number, for dedupe), `item_name`, `country` |
| `supplier_enquiry_submit` | Partnership form accepted (no such form exists yet) | `transaction_id` |
| `whatsapp_click` / `phone_click` / `email_click` | Click on a `wa.me`, `tel:` or `mailto:` link | `page` |
| `product_search` | 3+ characters typed in catalogue or site search (debounced 0.9 s) | `search_term`, `source` |
| `product_view` | Product or molecule page loaded | `item_id`, `item_name` |
| `add_to_inquiry` | "Add to inquiry list" | `item_id`, `item_name` |
| `catalogue_download` | Click on a PDF/Excel/Word/ZIP link (none on the site yet) | `file`, `page` |

A button click is never counted as an RFQ; `rfq_submit` fires only on confirmed acceptance.

## 5. GA4 configuration
1. Admin -> Events: mark **`rfq_submit`** (and `supplier_enquiry_submit`) as key events.
2. Create custom dimensions (event-scoped): `enquiry_type`, `country`, `item_name`, `search_term`.
3. In GTM: GA4 Configuration tag on All Pages; one GA4 Event tag per event above with trigger type *Custom Event* and the same name.
4. Test with GTM Preview / GA4 DebugView on the live site.

## 6. Google Ads (optional)
In GTM create a *Google Ads Conversion Tracking* tag triggered by the `rfq_submit` custom event. Use `transaction_id` as the order ID to deduplicate. The `gclid` is already stored with each lead for offline-conversion import later.

## 7. Search Console
1. Add property `https://www.pharmaxports.com/` (domain property via DNS is best).
2. Submit `https://www.pharmaxports.com/sitemap-index.xml`.
3. After deploy, inspect a molecule page and the home page with URL Inspection, and run the Rich Results Test on a product page.

## 8. Lead quality (CRM)
`gclid`, UTMs, landing page and referrer are saved with every lead (Airtable `Source`/UTM columns and the Message field). Add `Qualified`, `Quote sent`, `Won` values to your Airtable `Status` field to track the funnel; importing those back to Google Ads needs the stored `gclid`.
