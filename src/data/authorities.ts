// Official regulator and trade-body websites, shared by the Compliance centre and the market pages.
//
// Rules for this file:
//  - Only add a URL after opening it and confirming it is the authority's own site (see docs/COMPLIANCE_SOURCES.md).
//  - `verify` says what a visitor can check on the site. It must not state a requirement or a registration outcome.
//  - Countries with no verified entry are NOT guessed. They appear in `unverifiedCountries()` so the page can say so honestly.
//  - Last verified: 2026-11-06.

export type Source = { name: string; org: string; url: string; verify: string };
export type CountrySource = Source & { country: string };

export const indiaSources: Source[] = [
  { name: 'CDSCO', org: 'Central Drugs Standard Control Organisation, India', url: 'https://cdsco.gov.in/', verify: "India's central drug regulator. Check official notices, guidance and approval information for drugs, including export-related procedures." },
  { name: 'DGFT', org: 'Directorate General of Foreign Trade, India', url: 'https://www.dgft.gov.in/CP/', verify: 'Export policy, Importer-Exporter Code (IEC) services and trade notifications that can change the export status of a product.' },
  { name: 'Pharmexcil', org: 'Pharmaceuticals Export Promotion Council of India', url: 'https://pharmexcil.com/', verify: 'The export promotion council for pharmaceuticals. Information on RCMC membership and exporter services.' },
  { name: 'ICEGATE', org: 'Indian Customs electronic gateway', url: 'https://www.icegate.gov.in/', verify: 'The portal for customs e-filing in India, including shipping bills for exports.' },
];

export const globalSources: Source[] = [
  { name: 'WHO Prequalification', org: 'World Health Organization', url: 'https://extranet.who.int/prequal/', verify: 'Check whether a specific medicine, vaccine or manufacturer is WHO-prequalified. This status belongs to the manufacturer and product, never to a trading company.' },
  { name: 'WHO', org: 'World Health Organization', url: 'https://www.who.int/', verify: 'International guidance and standards on medicines quality and regulation.' },
];

// Keyed by the market page id (src/content/markets.json). `country` must match a name in that market's `countries`.
export const destinationSources: Record<string, { region: string; items: CountrySource[] }> = {
  africa: {
    region: 'Africa',
    items: [
      { country: 'Nigeria', name: 'NAFDAC', org: 'National Agency for Food and Drug Administration and Control, Nigeria', url: 'https://nafdac.gov.ng/', verify: 'Nigerian product registration and import guidance.' },
      { country: 'Ghana', name: 'Ghana FDA', org: 'Food and Drugs Authority, Ghana', url: 'https://fdaghana.gov.gh/', verify: 'Ghanaian product registration and import guidance.' },
      { country: 'South Africa', name: 'SAHPRA', org: 'South African Health Products Regulatory Authority', url: 'https://www.sahpra.org.za/', verify: 'South African medicine registration and licensing information.' },
    ],
  },
  'middle-east': {
    region: 'Middle East',
    items: [{ country: 'Saudi Arabia', name: 'SFDA', org: 'Saudi Food and Drug Authority', url: 'https://www.sfda.gov.sa/', verify: 'Saudi drug registration and import requirements. The site opens in Arabic.' }],
  },
  'southeast-asia': {
    region: 'South-East Asia',
    items: [{ country: 'Philippines', name: 'Philippines FDA', org: 'Food and Drug Administration, Philippines', url: 'https://www.fda.gov.ph/', verify: 'Philippine product registration and import guidance.' }],
  },
  'latin-america': {
    region: 'Latin America',
    items: [{ country: 'Brazil', name: 'ANVISA', org: 'Brazilian Health Regulatory Agency', url: 'https://www.gov.br/anvisa', verify: 'Brazilian medicine regulation and registration. The site is in Portuguese.' }],
  },
  'cis-russia': {
    region: 'CIS & Russia',
    items: [{ country: 'Russia', name: 'Roszdravnadzor', org: 'Federal Service for Surveillance in Healthcare, Russia', url: 'https://roszdravnadzor.gov.ru/', verify: 'Russian oversight of medicines and medical products. The site is in Russian.' }],
  },
  'europe-uk': {
    region: 'Europe & UK',
    items: [
      { country: 'European Union member states', name: 'EMA', org: 'European Medicines Agency', url: 'https://www.ema.europa.eu/', verify: 'EU medicines regulation, authorisations and guidance.' },
      { country: 'United Kingdom', name: 'MHRA', org: 'Medicines and Healthcare products Regulatory Agency, UK', url: 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency', verify: 'UK medicines regulation and licensing guidance.' },
    ],
  },
  'united-states': {
    region: 'United States',
    items: [{ country: 'United States', name: 'US FDA', org: 'U.S. Food and Drug Administration', url: 'https://www.fda.gov/', verify: 'US drug approval, import and facility-registration information.' }],
  },
};

/** Countries listed on a market page that have no verified regulator entry yet. Surfaced honestly, never guessed. */
export function unverifiedCountries(marketId: string, countries: string[]): string[] {
  const have = new Set((destinationSources[marketId]?.items ?? []).map((i) => i.country));
  return countries.filter((c) => !have.has(c));
}
