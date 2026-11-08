# Mobile UX QA

## Method and its limit
The Chrome window used for testing cannot be narrower than about 1,280 px, so phone layouts were **not** tested on a phone-sized browser window or a real device. Instead each route was loaded in a same-origin `<iframe>` of the target width, so CSS media queries respond to the iframe width, and the page was measured from inside. This checks layout, overflow and element sizes. It does not check touch behaviour, the on-screen keyboard, iOS Safari quirks or real network speed.

## Horizontal overflow
| Widths | Routes | Result |
|---|---|---|
| 320, 360, 390 px | About 40 distinct routes over several passes, and the final pass over the routes touched by fixes (home, catalogue, product, molecules index, request-quote, inquiry, markets, a market, compliance, buyers index and 3 segments, partner, contact, about, resources, FAQs, category, shop, cart, privacy, disclaimer, glossary, therapeutic class) | **No horizontal overflow** after fixes below |
| 768 px | Home, product, request-quote, compliance, buyer segment, contact, shop | No overflow |

Bugs this found and fixed:
1. Top bar overflowed by 54 px at 360 and 24 px at 390. Fix: the left tagline is hidden below `md`, the shop link shortens to "OTC shop", the destination select is capped in width.
2. At 320 px the header (logo plus three 44 px controls) overflowed by 37 px. Fix: smaller logo and tighter gaps below 400 px.
3. Long CTA labels such as "Request an importer quotation" overflowed at 320 px because `.btn` and `Button.astro` forced `nowrap`. Fix: labels now wrap.

## Checks by requirement
| Requirement | Result |
|---|---|
| Fast first screen | Lighthouse mobile preset, simulated slow 4G: LCP 0.8 to 2.0 s on tested pages (see SEO doc) |
| Simple navigation drawer | Opens, focus moves to the Close button, Esc closes, accordions for Products and Buyer Solutions. Tested at desktop window width, not on a phone |
| Search always accessible | Search icon in the header on every viewport, plus a search field first in the drawer |
| Easy country selection | The destination select is in the top bar on all widths (width-capped on phones). The RFQ asks for the destination country as text |
| Readable product tables | Product specs use a stacked definition list on cards; compliance table scrolls horizontally inside its own wrapper |
| Collapsible filters | "Filters" button with an active-filter count and `aria-expanded` below 640 px, tested through the iframe pass only for overflow, not by tapping |
| Large tap targets | Header controls 44 px; `.btn` 44 px minimum; chips 40 px. A scan of tap targets under 36 px found 3 to 16 per page, nearly all inline text links in body copy. The OTC shop has about 150, left as is (out of scope) |
| Sticky RFQ CTA | Existing fixed bottom bar "Get a Quote" is kept on all pages below `lg`. The WhatsApp button sits above it |
| No horizontal overflow | See above |
| Easy multi-product enquiry | RFQ list page, "Use my RFQ list" in step 1 of the RFQ, or list upload in step 3 |
| Accessible mobile forms | Labels on every field, 16 px inputs (no iOS zoom), `inputmode` and `autocomplete` set, per-step validation, status regions with `aria-live` |

## Not tested
Real phones and tablets, iOS Safari, Android Chrome, landscape orientation, touch scrolling inside the mega menu, the file picker on mobile, the on-screen keyboard covering the sticky bar, screen readers.
