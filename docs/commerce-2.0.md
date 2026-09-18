# PharmaXports Commerce 2.0 — Audit & Architecture

Status: planning. Nothing in this document is implemented yet.
Written 2026-09-18 against commit `250283c`.

---

## 1. Current-site audit

**Stack.** Astro 7 static build, Tailwind 4, content collections loaded from JSON
files in `src/content/`. Deployed on Vercel (`prj_LEEVFdkBRXs748JkBpkTa6it1FFa`)
from `main` on GitHub. No adapter, no SSR, no API routes today — but Vercel
serverless functions can be added, which is what the RFQ/Airtable/email work needs.

**Routes live today (131 pages).** `/`, `/about/`, `/contact/`, `/compliance/`,
`/faqs/`, `/glossary/` + 26 terms, `/resources/` + 6 articles, `/markets/` + 7
regions, `/products/` + 8 categories + 27 product pages,
`/products/therapeutic-class/` × 36, `/products/molecules/` (2,405 molecules),
`/shop/`, `/shop/cart/`, `/request-quote/`, `/inquiry/`, `/privacy/`, `/terms/`,
`/disclaimer/`, `/404`. Sitemap + robots + `llms.txt` present. JSON-LD already
covers Organization, WebSite, Product, FAQPage, Article, Breadcrumb.

**Commerce today.** No payment gateway, no prices anywhere in the schema. "Buy Now"
adds to a localStorage cart (`ipe-direct-cart`) and submits an order *request*
through Web3Forms to a Gmail inbox. This is a lead form wearing a cart's clothes —
it is not checkout.

**What is missing for the spec (blocking, cannot be invented):**

| Gap | Detail | Needed from business |
| --- | --- | --- |
| Product images | `public/images/` holds only 15 category/market/hero images. Zero product photos. | Real photography per SKU |
| Prices | No price field exists anywhere. No cost data either. | Cost sheet per SKU |
| Payment account | No PayPal/Stripe/Razorpay merchant account referenced anywhere | Merchant account + approval for this business type |
| Legal identity | `site.legalName` = "India Pharma Export", marked CONFIGURE | Registered entity name + address |
| Contact details | `export@indiapharmaexport.com` (dead domain, bounces), phone `+91 00000 00000` | Real inbox + phone |
| Airtable | No base/table identified yet | Base + table ID + token |
| Analytics | None installed at all — no GA4, no dataLayer | GA4 property or equivalent |
| Brand | Site says "India Pharma Export"; domain is pharmaxports.com | Decision on brand relationship |

**Reality check on the shop.** `/shop/` currently lists 150 molecule *names* from the
handbook (e.g. "Ashwagandha", "Alpha lipoic acid"). These are molecules, not sellable
products. A real DTC product needs a brand, pack size, strength, images, price and a
manufacturer. The 150 entries cannot become sellable SKUs without that data being
supplied per product. Expect the launch catalogue to be ~10–30 real SKUs, not 150.

---

## 2. URL preservation map

Rule: no existing indexed URL changes. New commerce lives on new paths.

| Existing | Action |
| --- | --- |
| `/products/`, `/products/{category}/`, `/products/{slug}/` | Keep. B2B catalogue. |
| `/products/therapeutic-class/{slug}/`, `/products/molecules/` | Keep as-is |
| `/markets/`, `/compliance/`, `/resources/`, `/glossary/`, `/faqs/` | Keep untouched |
| `/request-quote/`, `/inquiry/` | Keep. Pharma RFQ path. |
| `/shop/` | Becomes real storefront (filters, cards, images) |
| `/shop/cart/` | Becomes real cart; order-request fallback retained until payment is live |
| **New** `/shop/{product}/` | DTC product pages |
| **New** `/wholesale/` | Wholesale/RFQ landing for trade buyers |
| **New** `/shop/category/{slug}/` | Consumer categories (Vitamins, Ayurveda…) |

No redirects are required for phase 1, since nothing moves. If `/shop/` item URLs
ever change, add `vercel.json` `redirects` with 301s, one line per moved path.

---

## 3. Product data model (additions)

Extend the `products` collection; do not disturb existing required fields.

```
commerceStatus: 'DTC_AND_BULK' | 'BULK_ONLY' | 'NOT_AVAILABLE' | 'REQUEST_REVIEW'
sku, brand, manufacturer
consumerCategory: 'vitamins' | 'minerals' | 'herbal' | 'ayurveda' | 'nutraceuticals'
                | 'sports' | 'protein' | 'wellness' | 'digestive' | 'beauty'
servingSize, servings, packSize, netWeight, ingredients[], directions,
warnings[], countryOfOrigin, images[], coaAvailable, gmpStatus,
approvedClaims[], disclaimer, regulatoryNotes
pricing: { indiaCost, packagingCost, exportHandlingCost, shippingCostEstimate,
           paymentFeePercent, paymentFixedFee, targetMarginPercent,
           usComparablePrice, usComparableUrl, targetDiscountPercent,
           retailPriceUsd, comparePriceUsd, priceStatus }
bulk: { enabled, moq, tiers[{ minQty, unitPrice }] }
countryEligibility: { US|CA|UK|EU|AE|AU|SG|OTHER:
                      'AVAILABLE'|'BULK_ONLY'|'RESTRICTED'|'NOT_AVAILABLE'|'REVIEW_REQUIRED' }
```

Defaults are deliberately conservative: `commerceStatus` defaults to `BULK_ONLY` and
every country defaults to `REVIEW_REQUIRED`. A product only becomes buyable when
someone explicitly marks it so. Prescription status `rx`/`h1`/`x` force `BULK_ONLY`
in a build-time check — a data-entry mistake cannot put a prescription drug behind
Buy Now.

---

## 4. Country eligibility

Resolution order: `countryEligibility[country]` → prescription status → default
`REVIEW_REQUIRED`. The visitor's country is chosen explicitly (selector, persisted in
`localStorage`), never inferred silently, because the button they see depends on it.

| Resolved | Product page shows |
| --- | --- |
| AVAILABLE + DTC_AND_BULK | `BUY NOW` + `ADD TO CART` + `BUY IN BULK` |
| BULK_ONLY | `BUY IN BULK` only, with reason line |
| RESTRICTED / NOT_AVAILABLE | `CHECK AVAILABILITY` → RFQ, no cart |
| REVIEW_REQUIRED | `CONTACT US` |

---

## 5. Pricing model

```
landed      = indiaCost + packagingCost + exportHandlingCost + shippingCostEstimate
breakeven   = (landed + paymentFixedFee) / (1 - paymentFeePercent/100)
sustainable = breakeven / (1 - targetMarginPercent/100)
```

Then compare `sustainable` against `usComparablePrice`:

- `sustainable` ≤ comparable × (1 − targetDiscount) → **COMPETITIVE**
- ≤ comparable → **PREMIUM** (sells, but not on price)
- \> comparable → **BULK_ONLY** — do not force a retail price that loses money
- any input missing → **NEEDS_REVIEW**, and the product cannot go DTC

`comparePriceUsd` renders only when `usComparablePrice` and `usComparableUrl` are both
set, so no invented MSRP and no fake "was" price is possible. The planning bands in the
brief ($7.99–$29.99 by type) are seeded as `suggestedBand` for the admin UI only —
never rendered to shoppers.

---

## 6. Checkout & payment architecture

Two candidate paths. This is the decision that shapes everything else.

**A. Shopify as commerce engine.** Products mirrored into Shopify; Astro stays the
storefront; `BUY NOW` opens Shopify checkout (permalink or Storefront API cart).
Shopify handles payments, tax, fraud, receipts, refunds, order admin, and the PCI
burden. Costs ~$29+/mo plus fees. Fastest credible route to taking real money, and
the user already has Shopify experience on another store.

**B. Astro + PayPal serverless.** `/api/checkout` creates a PayPal order server-side;
webhook confirms payment; orders land in Airtable. No monthly platform fee, full design
control, but we then own order management, receipts, refunds, failure states and
fulfilment tracking — a large ongoing build.

Recommendation: **A**. Either way, secrets live only in Vercel environment variables,
the browser never sees a key, and card data never touches this codebase.

---

## 7. Airtable schema

Table **Bulk Leads** — fields exactly as in the brief (Lead ID, Created At, Source, UTM
Source/Medium/Campaign, Product, Variant, Quantity, Country, Buyer Name, Company, Email,
Phone, WhatsApp, Buyer Type, Target Price, Packaging, Frequency, Message, Attachment URL,
Status, Assigned To, Follow Up Date, Last Contacted, Notes). Status: New, Contacted,
Qualified, Quote Sent, Negotiation, Won, Lost, Spam. Related tables (Products, Customers,
Quotes, Orders, Interactions) once Bulk Leads is proven.

Write path: browser → `POST /api/bulk-lead` (Vercel function) → Airtable REST + email.
Token in `AIRTABLE_TOKEN` env var only. Lead ID format `PX-XXXXXX`.

---

## 8. Email workflow

Resend or SMTP via serverless. Env: `SALES_EMAIL`, `FROM_EMAIL`, `REPLY_TO_EMAIL`.
Sales alert carries the full lead + Airtable link; buyer gets a plain acknowledgement
with their Lead ID and **no** promised response time, price or stock. `FROM_EMAIL`
requires a domain the business controls — today's addresses are on a dead domain.

---

## 9. Security

Honeypot (already present), server-side validation, rate limit by IP, Turnstile on the
RFQ endpoint, upload restricted to pdf/jpg/png ≤ 5 MB stored outside the web root.
No secret ever reaches client JS. Cart contents are re-validated server-side at checkout
so a tampered localStorage cart cannot buy a `BULK_ONLY` item.

---

## 10. Analytics

GA4 via `dataLayer` wrapper with the event list from the brief (`view_item`,
`add_to_cart`, `begin_checkout`, `purchase`, `bulk_order_open`, `bulk_order_submit`,
`country_selected`, …). UTM + referrer + landing page captured on first visit into
`sessionStorage` and attached to every lead. Needs a GA4 measurement ID.

---

## 11. Phased plan

**Phase 1 — foundation (no secrets, no money).** Data model + commerce status +
country eligibility + CTA logic everywhere; `/shop/` rebuilt as a real storefront with
filters/sort/cards; consumer categories; `/shop/{product}/` pages; cart drawer;
`BUY IN BULK` modal; mobile sticky bar; Product/Offer schema; analytics event layer
(dormant until a GA4 ID exists). Ships with zero real SKUs marked DTC — everything
sits at `BULK_ONLY` until data arrives.

**Phase 2 — leads.** `/api/bulk-lead`, Airtable, transactional email, Turnstile,
`/wholesale/` page. Needs Airtable + email domain.

**Phase 3 — money.** Commerce engine per §6, real checkout, order confirmation,
shipping rules, tracking. Needs merchant account, prices, images, legal entity.

**Phase 4 — polish.** Performance/CWV pass, admin/CMS for prices without deploys,
review collection, funnels.

---

## 12. Test checklist (run before each phase ships)

Product search · filters · product page · BUY NOW · ADD TO CART · checkout · payment
success · payment failure · bulk order · Airtable record created · sales email ·
customer email · spam protection · country eligibility (each status) · prescription
product can never reach checkout · mobile at 390px · schema validates · canonicals ·
404s · redirects · analytics events fire.
