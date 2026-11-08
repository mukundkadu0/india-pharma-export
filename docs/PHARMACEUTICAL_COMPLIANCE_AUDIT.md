# Pharmaceutical compliance wording audit

Status: **audit only. No compliance or legal wording has been changed.** Any change needs the owner's approval, and ideally a regulatory consultant's.

Scope: every file in `src/` (pages, components, data, content JSON) and `public/` (text, llms.txt). Scanned for WHO-GMP, GMP, ISO, FDA, CDSCO, CE, WHO, prequalification, certified, approved, licensed, accredited, registered. Run 2026-11-09. Molecule data excluded (names only).

## 1. The known issue: "WHO-GMP certified manufacturing partners"
**Where it appears:** 72 mentions of "WHO-GMP" in 13 files, 20 distinct "WHO-GMP certified ..." sentences:
- Site-wide Organization structured data (`BaseLayout.astro`), so it is in the JSON-LD of **all 1,672 pages**.
- Page text and meta descriptions: About (3), Compliance intro, Disclaimer, category pages (`products/[slug].astro` description), glossary and FAQ content.
- Machine-readable files: `public/llms.txt`, `llms-molecules.txt`.
- Product copy (`products.json`, 22 mentions): "sourced from WHO-GMP certified partners ..." on individual products.

**Is it supported by documentation?** No. There is no named manufacturer, no certificate, no licence number and no supplier agreement anywhere in the repository. `BUSINESS_INFORMATION_REQUIRED.md` (earlier rounds) already records "Manufacturing partners: none named". The claim is therefore **unsupported by anything I can inspect**. It may well be true; it is not verified.

**Does it imply PharmaXports itself holds WHO-GMP?** Grammatically no: the certification is attached to "manufacturing partners", and the About and Disclaimer pages state that certifications belong to the partners. The risk is different:
1. It is a **universal statement** ("partners" in general, for every product) while the Disclaimer says certifications are "confirmed on a per-enquiry basis, not guaranteed for every product at all times". The two statements pull in different directions.
2. In Organization JSON-LD it becomes a structured, machine-read assertion about the business, repeated on every page, with no evidence behind it.
3. Terminology (to be confirmed with a regulatory consultant): "WHO-GMP" refers to a GMP standard and the WHO-format certificate that Indian regulators issue under the WHO Certification Scheme. It is not a certificate WHO itself awards to a plant. "WHO-GMP certified" is a common trade shorthand but is imprecise.

**Verdict: Requires documentary evidence.** Not "incorrect", but also not safe to leave as a blanket statement without evidence on file.

## 2. Classification of all findings
| # | Claim (where) | Classification | Why |
|---|---|---|---|
| 1 | "WHO-GMP certified manufacturing partners" in Organization JSON-LD, 1,672 pages | **Requires documentary evidence** (highest priority) | Blanket claim, structured data, no evidence on file |
| 2 | Same wording in About, Compliance, Disclaimer, category descriptions, llms.txt, glossary, FAQ | **Requires documentary evidence** | As above |
| 3 | "Certifications ... belong to the relevant manufacturing partner and are confirmed on a per-enquiry basis" (Disclaimer, About, Compliance, Home) | **Verified** (as a statement of policy) | Accurate and careful; it is the right framing. It also sits awkwardly next to claim 1 |
| 4 | Product copy: "Supplied to national TB programmes and Global Fund / Stop TB Partnership tenders", "Core Global Fund, PMI and UNICEF procurement line", ARV "donor-funded procurement programmes" (`products.json`) | **Potentially misleading** | Reads as a statement that PharmaXports supplies these buyers. No tender, contract or prequalification evidence in the repository |
| 5 | Hepatitis B vaccine "with validated cold-chain logistics" | **Requires documentary evidence** | A capability claim about logistics |
| 6 | Syringes "manufactured to ISO 7886 standards by partner facilities", "auto-disable variants available" | **Requires documentary evidence** | Standard compliance and availability are per-manufacturer facts |
| 7 | Devices: "CE marking or destination device registration confirmed per manufacturing partner" | **Verified** (conditional wording) | States what is confirmed per partner, claims nothing |
| 8 | Markets: "ANDA / EU-GMP-inspected partner required ... we do not claim capability we do not hold"; "not a capability we claim to hold" | **Verified** (honest negative statements) | They disclaim, not claim |
| 9 | "Merchant exporter" (About, Disclaimer, hero) | **Requires documentary evidence** | Implies a valid IEC and the relevant licences. None are published or on file |
| 10 | "Licensed B2B buyers" (home trust row) | **Requires documentary evidence** | States a screening practice. Needs a defined buyer-verification process behind it |
| 11 | "Freely exportable under a wholesale drug licence and RCMC" and per-class export status (class data, from the *India Pharma Export Handbook 2026*) | **Requires documentary evidence** | Sourced from a handbook; DGFT notifications change. Verify against current DGFT policy before relying commercially |
| 12 | Compliance step 06: authority "State FDA / CDSCO" for COPP / WHO-GMP certificates | **Requires documentary evidence** | The issuing authority varies; confirm with a consultant |
| 13 | Compliance steps 01 and 03 ("materially more credible" private limited company; Forms 20B and 21B "both required") | **Potentially misleading** | An opinion and an over-general rule |
| 14 | Special-handling figures (NDPS Rules 55 and 58, "21 working days", FSSAI for nutraceuticals) | **Requires documentary evidence** | Pre-date this work; check against current rules |
| 15 | Official regulator links (16 sources on the Compliance page and market pages) | **Verified** | Each opened and checked on 2026-11-06 (sites that refuse scripted requests, such as US FDA, were checked in a browser). Re-checked by script on 2026-11-07: 13 of 16 returned 200; US FDA (404) and Philippines FDA (403) refuse scripts, and Pharmexcil timed out twice from scripts. Re-open those three in a browser before launch. No requirement is stated |
| 16 | HS codes "class level" | **Verified** as labelled | Clearly marked class-level; 8-digit codes are "confirmed per enquiry" |
| 17 | ISO, FDA, CE, accreditation claims about PharmaXports itself | **none found** | No such claim appears anywhere. Good |
| 18 | "Incorrect or unsupported" | **none confirmed** | I found nothing I can show to be false. Items 1, 2, 4 and 13 are the ones to fix first |

## 3. Suggested wording (for approval; NOT applied)
Replace the blanket phrase with wording that matches what is documented, for example:
- JSON-LD / meta: "sourced from Indian manufacturing partners; GMP and licence documents provided per product on request".
- Product copy (items 4 to 6): remove tender, procurement and logistics claims, or keep them only where evidence exists, e.g. "Often procured by donor-funded programmes" (descriptive, not a supply claim).
- Once named partners and their certificates are on file, state exactly that: "Partner X, WHO-format GMP certificate no. ..., issued by ..., valid until ...".

You told me earlier not to clean compliance wording. I have respected that: nothing was changed. This paper is the evidence for revisiting that decision.

## 4. Evidence to collect
For each partner: manufacturing licence, GMP / WHO-GMP certificate with issuing authority and validity date, product permissions, and a written supply agreement. For PharmaXports: IEC, RCMC, wholesale drug licence (if any), GST and company registration. For Global Fund / UNICEF claims: tender awards or prequalification listings that name the supplier.
