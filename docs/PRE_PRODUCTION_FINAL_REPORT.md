# PharmaXports: pre-production final report

Date: 2026-11-09. Status: **BLOCKED – ACTION REQUIRED** (details in sections 12 to 14).

## 1. Executive summary
The redesigned site builds cleanly (1,672 pages) and passes the full regression run: 90 page runs, no console errors, no broken images, no horizontal overflow, one `h1` per page, all RFQ paths working, and Lighthouse 100 in every category on 13 pages in mobile and desktop mode (two mobile performance scores of 99 and 97, the latter noise on rerun). This audit found and fixed one real defect that matters for launch: **the browser's backup channel (Web3Forms) could deliver a live enquiry from a preview or test site to the owner's inbox**. It also fixed one sitemap conflict. Nothing else was changed in code.

The site is not ready for production approval. The blockers are decisions and evidence only the owner can supply: the unsupported "WHO-GMP certified" claim (site-wide, including structured data on every page), product claims about supplying Global Fund and UNICEF, the missing legal entity name and address, no email or lead-store credentials configured, and the molecule-page indexing decision.

Production is untouched: nothing was pushed to `main`, nothing deployed to production, no DNS, domain, setting or environment variable changed.

## 2. Git, branch and deployment
| Item | Value |
|---|---|
| Review branch | `release/round-2-preproduction-review` (pushed to `origin`) |
| Code and audit commit | `8b8a44d` (parent `cfeb4c5`, which is confirmed present) |
| This report | added in a follow-up commit on the same branch; the final hash is given in the closing message |
| Local `main` | `cfeb4c5` (unchanged, **not pushed**) |
| Remote `main` | `3caae56`, verified by `git ls-remote` after the push (unchanged) |
| Branch preview (built by Vercel from Git) | https://india-pharma-export-jr9w8ezzx-mikki4823s-projects.vercel.app (commit `8b8a44d`, READY, target preview) |
| Stable branch alias | https://india-pharma-export-git-release-roun-586728-mikki4823s-projects.vercel.app |
| Production | latest production deployment still `dpl_6gY5UNW5...` (September). Unchanged |

Preview URLs need a Vercel login (project protection `all_except_custom_domains`). Vercel adds `noindex` to previews.

**Older previews still contain the unguarded Web3Forms fallback:** `...-3gji4oi37-...`, `...-o7chtcwp2-...` and the round-1 preview. Anyone signed in to Vercel who submits a form on them would send a live enquiry. Use only the branch preview above, or delete the older ones (needs your approval).

## 3. Changes made
| File | Change |
|---|---|
| `src/lib/rfq-client.ts` | The Web3Forms backup channel now runs only on `www.pharmaxports.com` and `pharmaxports.com`. Elsewhere a failed server call shows "Enquiry delivery is switched off on this test site, so nothing was sent." |
| `astro.config.mjs` | `/shop/cart/` (noindex) excluded from the sitemap (now 1,671 URLs) |
| `docs/` | Seven new documents (listed in section 15) |

Not changed: product images and assets, SEO indexing of molecule pages, any compliance or legal wording, any product data.

## 4. SEO findings (`SEO_MOLECULE_INDEXING_REVIEW.md`)
- All 1,532 molecule pages are indexable and in the sitemap today. About 10% of each page's text is specific to the molecule; within a class about 98% of lines are identical. The live site has 130 sitemap URLs, so these pages would be about 92% of all URLs.
- **Recommendation: noindex them at launch and graduate pages to indexable (option C) once they carry verified per-molecule data.** It is reversible in a day; indexing first is slow to undo. **Not applied, awaiting your approval.**
- Technical scan of all 1,672 pages: canonical present and equal to the page's own URL on every page; unique titles and descriptions; valid JSON-LD everywhere; one `h1` on every page; Open Graph and Twitter tags complete; no hreflang (English only); 404 page present; every sitemap URL has a built page.
- Minor: most molecule titles (about 76 characters) and descriptions (over 170) will be truncated in results; `/markets/` skips a heading level; `/shop/cart/` was in the sitemap while `noindex` (fixed).
- Live redirects (read-only check): `http://pharmaxports.com` takes 2 redirects to `https://www.pharmaxports.com` (one chain of two hops, acceptable); `www` and `https` take 1; unknown URLs return a real 404. `/about` without a trailing slash serves 200 and its canonical points to `/about/`.

## 5. Compliance findings (`PHARMACEUTICAL_COMPLIANCE_AUDIT.md`)
- "WHO-GMP certified manufacturing partners": 72 mentions in 13 files, in the Organization structured data of all 1,672 pages, page text, meta descriptions, `llms.txt` and product copy. **No manufacturer, certificate or licence is documented anywhere in the repository**, so the claim is **unsupported by documentary evidence**. It is attributed to partners (not to PharmaXports) and the Disclaimer explains it, but the blanket wording conflicts with the Disclaimer's "confirmed per enquiry, not guaranteed".
- **Potentially misleading:** product copy saying products are supplied to Global Fund, Stop TB Partnership, PMI and UNICEF programmes, and compliance step 01 and 03 opinions.
- **Verified:** the partner-certification disclaimer wording, the honest "we do not claim ANDA/EU-GMP capability" statements, and the 16 regulator links (13 returned 200 to a script; US FDA, Philippines FDA and Pharmexcil need a browser re-check).
- No ISO, FDA, CE or accreditation claim is made about PharmaXports itself. No wording was changed; suggested replacements are in the audit.

## 6. Deployment and image findings (`DEPLOYMENT_ASSET_AUDIT.md`)
- 1,639 images in source = tracked in Git = built into `dist` = in the prebuilt output. 0 broken `<img>` references; 0 images without `alt`.
- **Correction:** I earlier said a source deploy would lose images because of `.vercelignore`. It would not: the 60 files it matches (13.3 MB) are unused by any page. `.vercelignore` is not committed and should stay out.
- The Git-built preview serves images byte-identical to the source (`cat-formulations.webp`, 31,232 bytes, HTTP 200). Git builds take about 30 seconds.
- 72 source images (13.7 MB) are not referenced by any page (optional cleanup).
- Settings: Astro framework, Node 24.x, no `vercel.json`, no environment variables, production branch `main`.

## 7. RFQ integration findings (`RFQ_INTEGRATION_AUDIT.md`)
- **Correction to my earlier report:** with no email or Airtable keys, a failed server call used to fall back to Web3Forms, which emails the owner. A preview submission would therefore have been a live enquiry (not "could not send", as I wrote). Fixed (section 3) and verified.
- Server tests against a localhost mock: **43 of 43 passed** (validation, idempotency, parallel retries, attachments incl. macro and fake files, failover, 502 on total failure, rate limit).
- Open risks: `TURNSTILE_SECRET` would break all submissions (no client widget); in-memory rate limit is weak on serverless; no Origin check; the Web3Forms key in client source points at the owner's inbox; the unused `/api/bulk-lead` function is still deployed.
- Env var names, scoping and a safe delivery test plan are in the audit. **No values were created or used.**

## 8. Business and legal findings (`BUSINESS_LEGAL_REVIEW.md`)
Missing: legal entity name, registered address, IEC, RCMC, wholesale drug licence, GST or company number, named manufacturing partners, social profiles. 24 of 34 listed countries have no verified regulator link. The "Provided by" column and licence steps need consultant confirmation. Nothing was invented.

## 9. Build and test results
| Test | Result |
|---|---|
| `npm run build` | Pass, 1,672 pages (the temporary CTA fixture is absent) |
| Regression, 45 pages x desktop and 390 px mobile (90 runs) | 0 problems: status 200, 1 `h1`, no overflow, no broken images (420 images checked), no console or page errors, no failed local requests. All external requests were blocked or stubbed |
| Pages covered | all 14 checklist areas, 8 categories, 7 markets plus index, 8 buyer pages plus index, class page, privacy, terms, disclaimer, faqs, glossary, resources, partner, inquiry, cart |
| Catalogue search and filters | start 12 of 27; "amoxicillin" 2; no match 0 with empty state; APIs 3; same on desktop and mobile |
| Country CTAs | 0 buy or cart elements in the DOM for any country (all catalogued products are bulk-only); earlier fixture test covered retail-eligible cases |
| RFQ modal, desktop and 390 px | prefilled; empty step blocked; bad email blocked; step 3 reached; failed server call shows the "switched off" message, no reference, **0 Web3Forms requests** |
| Multi-product RFQ | 3 products collected and filled by "Use my RFQ list" |
| OTC shop | search, no-match empty state, add to order request (cart stored); no Buy Now, Add to Cart, Checkout or Pay buttons |
| Mobile menu | opens (`aria-expanded` true) |
| Lighthouse (26 runs, `FINAL_SCORES.md`) | all 100 except product-mobile 99 and compliance-mobile 97 once (reruns 100, 100) |
| Links | 1,672 internal links, 0 broken (earlier scan, unchanged build graph); 16 official links rechecked |
| Server RFQ suite (mock) | 43 of 43 |

**Not tested:** real phones, screen readers, Search Console, real email or Airtable delivery, Vercel redirects locally (checked read-only on the live domain), file upload in a browser (server-side tested only), the preview itself in an interactive browser (it needs Vercel login; I fetched it).

## 10. Defects found
1. Preview and test sites could send live enquiries through Web3Forms (**fixed**).
2. `/shop/cart/` listed in the sitemap while `noindex` (**fixed**).
3. Unsupported blanket "WHO-GMP certified" claim in structured data on every page (**needs your decision**).
4. Product supply claims (Global Fund, UNICEF, PMI) without evidence (**needs your decision**).
5. Turnstile server check without a client widget (**do not enable until fixed**).
6. Weak, per-instance rate limiting; no Origin check; dead `/api/bulk-lead` function; public Web3Forms key tied to a personal inbox (**proposed fixes await approval**).
7. 24 countries without verified regulators; legal identity fields unset (**owner data needed**).
8. Raw Lighthouse JSON (34 MB) is in the history of commit `cfeb4c5`; the new raw results (25 MB) were deliberately not committed.

## 11. Fixes completed
Defects 1 and 2 above, with verification. Fixes for the rest are deliberately not applied: they change legal or SEO behaviour, or need owner data.

## 12. Remaining blockers
1. Owner decision and evidence on the WHO-GMP wording and the Global Fund/UNICEF claims.
2. Legal entity name and registered address (Privacy, Terms and Disclaimer name the operator).
3. No lead delivery configured: without Resend or Airtable variables, production enquiries only go through the Web3Forms fallback (to a personal inbox), and file uploads are refused.
4. Molecule-page indexing decision.
5. Business review of the licence steps and "Provided by" column.

## 13. Decisions needing Mukund's approval
1. Molecule pages: B now, graduating to C (recommended), A, or B permanently.
2. Wording for the WHO-GMP claim and the product supply claims (proposals in the compliance audit).
3. Set Resend and Airtable variables (Preview scope first, test mailbox and test base) and then Production; remove or restrict the Web3Forms fallback afterwards and rotate its key.
4. Add an Origin allow-list; delete `/api/bulk-lead`; add a Turnstile widget before enabling it; add a Vercel Firewall rate-limit rule.
5. Delete the two older previews that still have the unguarded fallback.
6. Optional: remove the 72 unused images; shorten molecule titles and descriptions.
7. Whether to accept the 34 MB of Lighthouse JSON already in `cfeb4c5`'s history, or rewrite that unpushed-to-main commit (not done).
8. When ready: production deployment, and how (merge the review branch to `main`, then Vercel builds production from Git).

## 14. Production readiness assessment
**BLOCKED – ACTION REQUIRED.** Technically the build is sound and the regression results are clean, but I would not call it ready for production approval: it would publish an unsupported certification claim in structured data on every page, supply claims I cannot substantiate, and no legal entity or address, and it has no working lead-delivery path other than a personal-inbox fallback. A passing build does not change that.

## 15. Documents
`docs/SEO_MOLECULE_INDEXING_REVIEW.md`, `docs/PHARMACEUTICAL_COMPLIANCE_AUDIT.md`, `docs/DEPLOYMENT_ASSET_AUDIT.md`, `docs/BUSINESS_LEGAL_REVIEW.md`, `docs/RFQ_INTEGRATION_AUDIT.md`, `docs/lighthouse/FINAL_SCORES.md`, `docs/PRE_PRODUCTION_FINAL_REPORT.md`. Earlier reports are unchanged (`PREVIEW_REPORT.md` still says previews return "could not send"; that statement is corrected here and in the RFQ audit).
