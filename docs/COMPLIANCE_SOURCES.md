# Compliance: official sources and "Provided by" review

Data lives in `src/data/authorities.ts` and feeds both the Compliance centre (`#official-sources`) and every market page (`MarketAuthorities.astro`).

## How each URL was verified (2026-11-06)
Each URL was opened and the page identity checked. Scripted fetches were used first; sites that refused scripts were opened in a real browser.

| Source | URL used | Result |
|---|---|---|
| CDSCO | https://cdsco.gov.in/ | 200, redirects to its own Home |
| DGFT | https://www.dgft.gov.in/CP/ | Root redirects here. Page title "Directorate General of Foreign Trade, Ministry of Commerce and Industry, Government of India" (browser) |
| Pharmexcil | https://pharmexcil.com/ | 200, "Pharmaceuticals Export Promotion Council of India" |
| ICEGATE | https://www.icegate.gov.in/ | 200 on three retries (one scripted run failed once, transient) |
| WHO Prequalification | https://extranet.who.int/prequal/ | 200, "WHO - Prequalification of Medical Products" |
| WHO | https://www.who.int/ | 200 |
| NAFDAC (Nigeria) | https://nafdac.gov.ng/ | 200 |
| Ghana FDA | https://fdaghana.gov.gh/ | 200 |
| SAHPRA (South Africa) | https://www.sahpra.org.za/ | 200 |
| SFDA (Saudi Arabia) | https://www.sfda.gov.sa/ | 200, Arabic site (stated on the page) |
| Philippines FDA | https://www.fda.gov.ph/ | 200 |
| ANVISA (Brazil) | https://www.gov.br/anvisa | 200, Portuguese |
| Roszdravnadzor (Russia) | https://roszdravnadzor.gov.ru/ | 200, Russian |
| EMA | https://www.ema.europa.eu/ | 200 |
| MHRA (UK) | gov.uk MHRA organisation page | 200 |
| US FDA | https://www.fda.gov/ | Refuses scripts (404); opened in a real browser: "U.S. Food and Drug Administration" |

**Not added because they could not be verified:** Kenya Pharmacy and Poisons Board (403 to scripts, page did not load in the browser), UAE MOHAP (timed out), Australia TGA (timed out, and Australia is not a listed market). Do not add these without opening them.

The "What you can check" sentences describe what the site is for. They state no requirement, no deadline and no registration outcome.

## Countries on market pages with no verified regulator yet (flagged, not guessed)
- Africa: Kenya, Tanzania, Uganda, Ethiopia
- South-East Asia: Vietnam, Myanmar, Cambodia, Sri Lanka, Nepal, South Korea
- Middle East: United Arab Emirates
- Latin America: Mexico, Guatemala, Peru, Bolivia, Dominican Republic
- Europe & UK: Switzerland

The market pages show this list to visitors ("No verified regulator link yet for ...") and ask them to contact us. To add one: open the authority's own site, add an entry to `destinationSources`, and the page and the "not yet verified" list update by themselves.

## "Provided by" column and licence steps: items needing business verification
These were drafted from general industry practice in the first redesign and were **not changed** in this round. Please confirm each with your regulatory consultant before relying on them.

1. Licence step 01 says buyers and banks treat a private limited company as "materially more credible". This is an opinion, not a rule.
2. Step 03 says Forms 20B and 21B "are both required to access the full catalogue". Whether that is true depends on which products you actually handle.
3. Step 06 names "State FDA / CDSCO" as the authority for COPP / WHO-GMP certificates. The issuing authority varies; confirm it.
4. Documents table: confirm who issues the Free Sale Certificate ("Licensing authority"), the Certificate of Origin ("Authorised issuing agency"), and the manufacturing and wholesale licence forms listed ("Form 25/28, 20B/21B").
5. Special-handling box states specific figures (NDPS Rules 55 and 58, "21 working days") and the FSSAI statement for nutraceuticals. They pre-date this work and need checking against current rules.
6. The page introduction says supply is from "WHO-GMP certified Indian manufacturing partners". No such certification is verified in the site data. You previously chose not to change compliance wording, so it is untouched; it remains the main unverified claim (also in `products.json`).
