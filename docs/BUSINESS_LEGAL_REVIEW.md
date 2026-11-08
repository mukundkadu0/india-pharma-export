# Business and legal content review

Status: **nothing was invented or changed.** Each item records what is missing, why it matters and the evidence needed. Source data: `src/data/site.ts`, `docs/BUSINESS_INFORMATION_REQUIRED.md`, `docs/COMPLIANCE_SOURCES.md`, `src/pages/compliance.astro`, `src/data/authorities.ts`. Reviewed 2026-11-09.

## 1. Company identity and contact details
| Field | Current value | Why it matters | Evidence needed | Status |
|---|---|---|---|---|
| Legal entity name | "PharmaXports" (placeholder; the legal pages use it as the operator name) | Privacy Policy, Terms and Disclaimer name `site.legalName` as the contracting party. A trade name is not a legal entity | Certificate of Incorporation or the proprietorship registration | **MISSING** |
| Registered / business address | "India" | Needed for the Organization structured data, legal pages, and buyers' due diligence. Importers and regulators expect a real address | Registered-office proof (utility bill, rent agreement, registration certificate) | **MISSING** |
| Phone / WhatsApp | +91 76663 99821 (same number) | Published sitewide and in the floating WhatsApp button | Confirmation that this number is the business line and monitored | Set by owner; **confirm** |
| Email | info@pharmaxports.com for general and partnership | Delivery target and the reply-to address | Confirm the mailbox exists and is monitored; SPF/DKIM before sending automated mail | Set by owner; **confirm** |
| Social profiles | LinkedIn and X empty (icons hidden) | Trust signal; also `sameAs` in structured data | Real, live profile URLs only | **MISSING (optional)** |
| Founded year | not stated | Only worth stating if real | Registration date | Not required |
| IEC (Importer-Exporter Code) | not published | A merchant exporter needs one to export; buyers ask for it | IEC certificate; owner decides whether to publish the number | **MISSING / owner decision** |
| RCMC (Pharmexcil) | not published | Required to export under the pharma export scheme | RCMC certificate | **MISSING / owner decision** |
| Wholesale drug licence | not published | Whether one is needed depends on the products handled; the site's wording assumes one | Licence copy, or written advice that none is needed | **MISSING** |
| GST / company registration number | not published | Invoices and buyer onboarding | GST certificate | **MISSING / owner decision** |
| Manufacturing partners | none named | The site rests on "partner manufacturers". Named partners with their own evidence would add the most trust | See `PHARMACEUTICAL_COMPLIANCE_AUDIT.md`, section 4 | **MISSING** |
| Case studies / references | none | Only real, permissioned ones should appear. None are shown (none invented) | Written permission | Not required |

## 2. "Provided by" column and licence steps
These come from the first redesign, drafted from general industry practice. Not changed. Each needs checking with a regulatory consultant before the site relies on them.
1. Licence step 01 says buyers and banks treat a private limited company as "materially more credible". This is an opinion. **Evidence:** none needed if reworded as advice; otherwise remove.
2. Step 03 says Forms 20B and 21B are "both required to access the full catalogue". Whether that is true depends on which products are handled. **Evidence:** consultant's written advice for the actual product range.
3. Step 06 names "State FDA / CDSCO" as the authority for COPP / WHO-GMP certificates. The issuing authority varies. **Evidence:** the issuing authority shown on a real partner certificate.
4. Documents table: who issues the Free Sale Certificate ("Licensing authority"), the Certificate of Origin ("Authorised issuing agency") and the licence forms ("Form 25/28, 20B/21B"). **Evidence:** a consultant's confirmation, or sample documents.
5. Special-handling box: specific figures (NDPS Rules 55 and 58, "21 working days") and the FSSAI statement for nutraceuticals pre-date this work. **Evidence:** current text of the rules from the official gazette or regulator site.
6. Page introduction: "WHO-GMP certified Indian manufacturing partners" (see the compliance audit).

## 3. Destination regulators: 24 of 34 listed countries have no verified link
Not guessed; the market pages tell visitors "No verified regulator link yet" and invite them to ask.
- Africa: Kenya, Tanzania, Uganda, Ethiopia
- South-East Asia: Vietnam, Myanmar, Cambodia, Sri Lanka, Nepal, South Korea
- Middle East: United Arab Emirates
- Latin America: Mexico, Guatemala, Peru, Bolivia, Dominican Republic
- Europe and UK: Switzerland

**Why it matters:** visitors from those markets get no authority link. **Evidence needed:** for each, the regulator's official site opened in a browser (Kenya PPB, UAE MOHAP and Australia TGA were tried and could not be loaded reliably). To add one, add an entry to `destinationSources` in `src/data/authorities.ts`; the page updates by itself.

## 4. Other items for the owner
- Web3Forms delivers backup enquiries to the owner's personal inbox. Decide whether enquiries should go to the business mailbox instead (see `RFQ_INTEGRATION_AUDIT.md`).
- Legal pages (Privacy, Terms, Disclaimer) name the legal entity and give no address; they should be reviewed by counsel before launch, in particular for data-protection obligations of buyers in the EU, UK and elsewhere. I am not a lawyer and made no change.
- Google Tag / GA4 IDs are not set, so no analytics runs; the consent banner exists. Set `PUBLIC_GA4_ID` or `PUBLIC_GTM_ID` only after confirming the privacy wording matches what is collected.

## 5. Blocking vs. not blocking for a production launch
- **Should be resolved before launch:** legal entity name, registered address, the "WHO-GMP certified" wording (owner decision), Global Fund / UNICEF supply claims, and the licence-step opinions.
- **Can follow launch:** social profiles, founded year, remaining regulator links, case studies.
