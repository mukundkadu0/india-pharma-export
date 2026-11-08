# Conversion audit

## Enquiry paths found
| Path | Delivery | Issue found | Status |
|---|---|---|---|
| `/request-quote/` full RFQ | Web3Forms (client-side) | Success shown on any HTTP 200; no reference number; no attribution; fake upload; phone required, quantity optional | Rebuilt |
| Bulk-RFQ modal (product cards) | `/api/bulk-lead` (Airtable) then Web3Forms | Fallback also treated HTTP 200 as success; no reference when falling back | Moved to the shared `/api/rfq` pipeline |
| `/inquiry/` multi-product list | `mailto:` / Web3Forms | Not changed in this pass | **Open** |
| Shop cart `/shop/cart/` | Web3Forms/`mailto:` | Not changed in this pass | **Open** |
| Contact page | `mailto:` / `tel:` | Real phone/email now shown; click events now tracked | Updated |
| Floating WhatsApp button | `wa.me` link | New; click tracked as `whatsapp_click` | Added |

## Changes made to the RFQ
- 7 required fields (name, company, business email, country, buyer type, quantity, product) with everything else tucked under "Add details".
- Server-side validation (email, phone, required fields), honeypot, per-IP rate limit, optional Turnstile.
- Reference number (`PX-YYMMDD-XXXXXX`) shown on success and sent in the delivery email.
- Success appears only when `/api/rfq` accepted the lead, or the form service replied `success:true`.
- Captured with every lead: UTM source/medium/campaign/term/content, `gclid`, landing page, referrer, submit page, enquiry type, enquiry date.
- Buyer type now includes "Drop Shippers" (OTC/AYUSH/devices only).

## Not delivered (be aware)
- **File upload.** Web3Forms' free tier does not accept attachments and `/api/rfq` has no file storage. The form now asks for a link (Drive/Dropbox/OneDrive) instead. True upload needs storage such as Vercel Blob or S3.
- **Separate partnership and general enquiry flows.** The endpoint supports `enquiry_type` = `buyer | partnership | general`, but no partnership form was built on the site.
- **Qualified lead / quotation sent / won order.** Needs a CRM. Airtable `Status` exists (`New`); stages beyond that must be set up by you.
- **Quote-readiness labels** (listed / supplier identified / sourcing verified / market verified / quote-ready) are not implemented because that data does not exist in the catalogue yet.

## Observations
- Persistent "Get a Quote" on mobile (bottom bar) and in the header on desktop: already present.
- Product pages show "Dosage Form / Strength: On request" and "MOQ on request" because the workbook has no such data. That is honest but weak for conversion; real specs per product are the biggest conversion lever once available.
