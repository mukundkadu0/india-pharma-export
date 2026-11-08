# Business information required from the owner

Central config: `src/data/site.ts`. Nothing below has been invented; anything marked **OPEN** is still a placeholder or unverified.

| Item | Current value | Status |
|---|---|---|
| Phone / WhatsApp | +91 76663 99821 | Set from your instruction. Confirm both are the same number |
| General email | info@pharmaxports.com | Set from your instruction. **Confirm the mailbox exists and is monitored.** Needs SPF/DKIM for the sending domain before automated emails (Resend) will deliver reliably |
| Partnership email | info@pharmaxports.com | Set to the same address; give a dedicated one if wanted |
| Legal entity name | `PharmaXports` | **OPEN.** Replace with the registered company name (e.g. "... Pvt Ltd") |
| Registered office address | `India` | **OPEN.** Needs full address; used in Organization structured data |
| IEC (Importer-Exporter Code) | not published | **OPEN.** Publish only if you want it shown |
| Wholesale drug licence / RCMC | not published | **OPEN.** Same |
| GST / company registration number | not published | **OPEN** |
| LinkedIn / X profiles | empty (icons hidden) | **OPEN.** Add real profile URLs |
| Founded year | not stated | **OPEN.** Only add if real |
| Manufacturing partners | none named | **OPEN.** The site correctly says "partner manufacturers" without naming them. Named partners with their own WHO-GMP/COPP evidence would add the most trust |
| Case studies / client references | none | **OPEN.** Only add real, permissioned ones. No testimonials are shown (none invented) |
| Form delivery inbox | Web3Forms key delivers to `mukundkadu48@gmail.com` | Decide if enquiries should go to `info@pharmaxports.com` instead |
| Google IDs | not set | **OPEN.** `PUBLIC_GTM_ID` or `PUBLIC_GA4_ID` in Vercel |
| Lead store | Airtable not configured | **OPEN.** `AIRTABLE_*`, `RESEND_API_KEY`, `SALES_EMAIL`, `FROM_EMAIL` |

## Statements to keep accurate
- The site says PharmaXports is a merchant exporter that sources from WHO-GMP certified partners and does not manufacture. Keep it that way unless that changes.
- "WHO-GMP, COPP" etc. are described as partner certifications, not held by PharmaXports.
- Export status per class comes from the *India Pharma Export Handbook 2026*; confirm it against current DGFT notifications before relying on it commercially.
