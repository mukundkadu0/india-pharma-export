# Molecule pages: audit and redesign

## What the 1,532 pages are
`src/content/molecules.json` holds 2,376 molecules. Each record has only `id`, `name`, `classId`, `categoryGroup`, `buyDirect` (and sometimes a restriction flag). A molecule gets its own page at `/products/<id>/` when its class is "free" to export, it has no restriction flag, and no hand-written product page already covers it. That is **1,532 pages**. All still exist at the same URLs.

## Audit results (all 1,532, from the built output)
| Check | Result |
|---|---|
| Routes present | 1,532 of 1,532, none missing |
| Title format "... Export from India \| HS ..." | all |
| Canonical, description, exactly one h1, no duplicate ids | all |
| Product and FAQPage structured data, breadcrumb schema | all (unchanged types) |
| Request Bulk Quote and Add to RFQ list | all |
| Buy Now or Add to Cart on prescription molecules | 0 of 1,382 |
| Direct-order button on OTC molecules | 150 of 150 (separate OTC order request) |
| Link to its therapeutic class page | all |
| Text per page | 1,312 to 1,417 words (mostly shared template and class text) |

## What changed
- New hierarchy: breadcrumb, badges, molecule name, class link, an honest lead, "Molecule at a glance" table, enquiry checklist, export and regulatory context, class explanation, quick answers.
- Rows that describe the whole class are labelled "class level" so no one reads a class HS code as a product-specific one.
- Sourcing status now states "Listed in the molecule index. Not a statement of stock".
- Removed the unverified "WHO-GMP certified manufacturing partners" wording from this template (page text, FAQ and meta description). Manufacturer certifications are "confirmed per enquiry".
- RFQ: the sticky panel opens the same 3-step modal, with the molecule prefilled. The long duplicate form at the bottom of every page was removed.
- Internal linking: catalogued products in the same class (up to 3), up to 12 sibling molecules, up to 6 related classes in the same category, links to the molecule index, product catalogue and markets.
- Molecule index and class pages: prescription rows no longer have Buy Now (only OTC rows do). Rows lead with Request Bulk Quote.

## The limit that remains: near-duplicate content
Measured on two molecules in the same class, **98% of text lines are identical** after swapping in the molecule name. Across different classes about 70% are shared. A page differs from its class siblings only by the name, the image and the sibling list. This redesign cannot fix that honestly, because no molecule-specific data exists, and inventing dosage forms, strengths or regulatory facts would be wrong.

What would fix it: per-molecule verified data (dosage forms, strengths, pharmacopoeia, 8-digit HS code, manufacturer-confirmed availability). Until then there is an owner decision, which is **unchanged from before: indexable**.

To noindex the pages, set `MOLECULE_PAGES_INDEXABLE = false` in `src/lib/molecules.ts` (pages then send `noindex, follow`). If you do, also remove `/products/<molecule>/` URLs from the sitemap, since Astro's sitemap lists them by default. Doing so drops those pages from search results, so decide with Search Console data.

## Not verified
Rankings and indexing for these pages could not be checked: the new build is not live. Watch Search Console after any deployment.
