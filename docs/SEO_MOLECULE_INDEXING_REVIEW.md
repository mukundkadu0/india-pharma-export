# Molecule pages: indexing review (decision paper)

Status: **recommendation only. Nothing in this paper has been applied.** `MOLECULE_PAGES_INDEXABLE` is still `true`, so all 1,532 pages are currently indexable and listed in the sitemap. Mass indexing or noindexing needs the owner's approval.

Measured on the final build (`dist/client`, 1,672 pages) on 2026-11-09.

## 1. What the pages are
- 1,532 pages at `/products/<molecule-id>/` (24 therapeutic classes, 29 to 156 pages per class). Data per molecule is only: name, class, category, a direct-order flag. There is no per-molecule dosage form, strength, pharmacopoeia, 8-digit HS code, manufacturer or stock data.
- 125 pages have combination names ("A + B"); 5 have names under 5 characters.
- 150 are OTC molecules (they carry the separate "Add to order request" action).
- The live production site currently has **130 sitemap URLs**. These 1,532 pages would raise the indexable URL count by about 12x, so molecule pages would be about 92% of all URLs on a young domain.

## 2. Measurements
| Check | Result |
|---|---|
| Self-referencing canonical | 1,532 of 1,532 |
| Title and description unique | yes (0 duplicate titles, 0 duplicate descriptions) |
| Titles over 70 characters | most (about 76 characters, e.g. "Benznidazole (Anthelmintics) - Export from India \| HS 3004.90 \| PharmaXports"). They will be truncated in results |
| Descriptions over 170 characters | most. They will be truncated |
| Structured data | Organization, WebSite, Product, FAQPage, BreadcrumbList, all valid JSON. Product has no `offers` and no ratings |
| Internal links in | exactly 15 per page (class page, molecule index, 12 siblings, related links); 0 orphan pages |
| Words per page | median 1,376 |
| Page-specific words | median **145** (about 10%). The other 90% is shared template and class-level text |
| Text overlap | within one class about 98% of lines are identical after swapping the molecule name; across classes about 70% |
| In sitemap | 1,532 |
| `llms-molecules.txt` | lists all of them (147 KB) |

Not measured (no access): search demand per molecule, Search Console data, competitor result pages. I did not pull keyword volumes. They would make option C much easier to decide, and I can pull Semrush data on request.

## 3. Risks of indexing all pages (option A)
- **Thin and near-duplicate content at scale.** About 10% of each page is specific to the molecule. Google's spam policies treat many pages of low added value generated from a template as "scaled content abuse"; at minimum they are likely to be crawled and then not indexed ("Crawled, currently not indexed"). A site where 92% of URLs are like this can also drag down how the 130 hand-written pages are judged. This is a risk, not a certainty, and I cannot measure it before launch.
- **Cannibalisation.** Pages in one class target near-identical queries ("<molecule> export from India"). They compete with each other and with the class page and the hand-written product pages for the same terms.
- **Search intent mismatch.** A visitor searching a molecule name often wants a product (strength, form, manufacturer). The page honestly says this is a listing and not a statement of stock, so it can satisfy a "can this be exported" query but not a product query.
- **Structured data:** `Product` markup without offers or reviews is allowed but earns no rich result, and it asserts a product page for something that is not stocked. That conflicts with the page's own wording.
- **Crawl budget** is not a concern at this size.

## 4. Options
| | A. Index all 1,532 | B. Noindex all 1,532 | C. Selective |
|---|---|---|---|
| Long-tail visibility | maximum, if Google accepts them | none from these pages | only for pages that qualify |
| Quality-dilution risk | highest | none | low |
| Reversibility | slow: de-indexing takes weeks to months | fast: remove the tag and resubmit | fast |
| Work now | none | one switch plus a sitemap filter | needs per-molecule data and a rule |
| Pages that qualify today | n/a | n/a | **0**, because no molecule has data of its own yet |

## 5. Recommendation: B now, graduating to C (safest)
1. **At launch: `noindex, follow` on all 1,532 and remove them from the sitemap.** Keep them live, linked and useful for visitors who navigate to them; keep the RFQ prefill working. Keep the 24 class pages, the molecule index and the 27 hand-written product pages indexable: those are the ranking pages today.
2. **Graduate pages to indexable one batch at a time (C)** once a molecule has real, verified data of its own. Suggested minimum, all required: at least three verified fields from (dosage forms offered, strengths, pharmacopoeia, 8-digit ITC-HS code, manufacturer-confirmed availability); at least 300 words that are not shared with sibling pages; documentary evidence on file for any certification stated. Add evidence of demand (impressions in Search Console or keyword volume).
3. Re-evaluate after 8 to 12 weeks of Search Console data on the class and product pages.

Why this is the safest: production indexes none of these URLs today, so noindex at launch loses no existing traffic, and it can be reversed in a day. Indexing first and noindexing later is the slow, risky direction.

Trade-off: you give up speculative long-tail impressions for "<molecule> export from India" until pages qualify. I could not measure how much that is worth.

## 6. How it would be implemented (not done)
- `src/lib/molecules.ts`: set `MOLECULE_PAGES_INDEXABLE = false`. `MoleculePage.astro` already passes `noindex={!MOLECULE_PAGES_INDEXABLE}`, which emits `noindex, follow`.
- Sitemap: `astro.config.mjs` currently filters only `/shop/cart/`. Add the molecule ids to the filter. That needs a small shared helper that lists the molecule ids, since the config cannot call the page logic directly.
- Decide whether `llms-molecules.txt` should still list them (it is advisory for AI crawlers; it links to pages that would be noindex).
- Optional: shorten molecule titles to about 60 characters and descriptions to about 155 for when pages are indexed.
- Rollback: set the flag back to `true` and revert the sitemap filter.

## 7. Other findings from the technical SEO scan (applied, small)
- `/shop/cart/` was `noindex` but listed in the sitemap, which gives a "submitted URL marked noindex" warning. Excluded it from the sitemap (`astro.config.mjs`). The sitemap now has 1,671 URLs.

## Decision needed
Approve one of: **B now, graduating to C** (recommended), **A**, or **B permanently**.
