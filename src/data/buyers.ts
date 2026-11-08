// Buyer-segment landing content. Each segment has its own copy: what the segment typically
// sources, the information that speeds up its quotation, the documents it usually asks for,
// and how supply matching works for that buyer. No credentials, volumes, prices or customer
// names are claimed here. "Documents available on request" means requested per enquiry from
// the manufacturing partner; nothing listed is implied to be held by PharmaXports itself.

export interface BuyerSegment {
  slug: string;
  name: string;            // must match a buyerTypes[].name in taxonomy.ts so the RFQ form can prefill it
  navLabel: string;
  summary: string;         // one line for menus and cards
  headline: string;
  intro: string;
  sources: string[];       // what they can source
  categories: string[];    // category ids from taxonomy.ts
  flow: { title: string; text: string }[]; // 3 steps, specific to the segment
  submit: string[];        // what to include in the enquiry
  documents: string[];     // documentation commonly requested (available on request, per product)
  matching: string;        // how quotation and supply matching works
  caution?: string;
  cta: string;
}

export const buyerSegments: BuyerSegment[] = [
  {
    slug: 'importers',
    name: 'Importers',
    navLabel: 'Importers',
    summary: 'Licensed importers of record clearing consignments in their own country.',
    headline: 'Pharmaceutical sourcing for licensed importers',
    intro: 'You hold the import authorisation and carry the registration file. We help you find Indian manufacturing partners for the products on that file, and we line up the documents your authority will ask for.',
    sources: ['Finished formulations for registered or registrable products', 'Active pharmaceutical ingredients for local formulators', 'Medical devices and consumables', 'Nutraceutical and AYUSH lines where your market permits them'],
    categories: ['formulations', 'apis', 'devices', 'nutraceuticals'],
    flow: [
      { title: 'Share the registration position', text: 'Tell us which products are already registered in your country and which are not. It decides which manufacturers are worth approaching.' },
      { title: 'Partner and product match', text: 'We approach manufacturing partners whose facilities and dossiers fit the product and your authority.' },
      { title: 'Quote with documentation scope', text: 'You receive a written quotation with MOQ, packaging, lead time and the list of documents that can be supplied.' },
    ],
    submit: ['Product name, strength and dosage form', 'Destination country and import authority requirements', 'Annual and first-order quantity', 'Registration status of the product in your market', 'Preferred Incoterm and destination port'],
    documents: ['Certificate of Pharmaceutical Product (COPP), where issued for the product', 'Certificate of Analysis per batch', 'Manufacturing licence and GMP certificate of the partner site', 'Product dossier or CTD summary, where the partner holds one'],
    matching: 'Requirements are reviewed against product status and destination before any quotation. Registration support is a separate, case-by-case discussion and is never guaranteed.',
    cta: 'Request an importer quotation',
  },
  {
    slug: 'distributors',
    name: 'Distributors',
    navLabel: 'Distributors',
    summary: 'Regional and national distributors supplying pharmacies, clinics and hospitals.',
    headline: 'Supply lines for pharmaceutical distributors',
    intro: 'Distributors need steady supply across a portfolio, not a single deal. Send the whole range you want to cover and we work out which lines can be sourced together.',
    sources: ['Multi-product formulation portfolios', 'Packaging adapted to your market and language needs', 'OTC and nutraceutical lines for pharmacy channels', 'Repeat-order supply on agreed schedules'],
    categories: ['formulations', 'nutraceuticals', 'ayush', 'devices'],
    flow: [
      { title: 'Send the portfolio', text: 'Upload an Excel or PDF list of the molecules, strengths and pack sizes you distribute or want to add.' },
      { title: 'Consolidated sourcing', text: 'We group lines by manufacturing partner to reduce the number of shipments and suppliers you manage.' },
      { title: 'Portfolio quotation', text: 'You receive one written quotation covering the lines that can be supplied, with the lines that cannot clearly marked.' },
    ],
    submit: ['Product list (Excel, PDF or CSV)', 'Territories you distribute in', 'Expected monthly or quarterly volumes', 'Packaging and labelling requirements', 'Your distribution licence number, if you want it noted on the quotation'],
    documents: ['Certificate of Analysis per batch', 'Product specifications and shelf life', 'Artwork approval process for private-label requests', 'Stability data summary, where available'],
    matching: 'Lines are matched to manufacturing partners one by one. Exclusive territory arrangements are not offered through this form and would be discussed separately.',
    cta: 'Send your portfolio list',
  },
  {
    slug: 'wholesalers',
    name: 'Wholesalers',
    navLabel: 'Wholesalers',
    summary: 'Wholesale traders supplying pharmacy and institutional channels in volume.',
    headline: 'Volume sourcing for pharmaceutical wholesalers',
    intro: 'Wholesalers compete on availability, price per pack and reliability. Tell us your fast-moving lines and target pack prices and we start from those.',
    sources: ['High-turnover generic formulations', 'Standard commodity pack sizes', 'OTC analgesics, vitamins and digestive lines', 'Bulk and institutional pack formats'],
    categories: ['formulations', 'nutraceuticals', 'hospital'],
    flow: [
      { title: 'List the fast movers', text: 'Give us the lines you reorder most and the pack sizes your customers buy.' },
      { title: 'Price-benchmarked options', text: 'We request quotations from more than one partner where the product allows it and compare them against your target.' },
      { title: 'Order and shipment planning', text: 'Quantities, lead time and shipment batches are agreed in writing before any commitment.' },
    ],
    submit: ['Product, strength and pack size', 'Target price per pack and currency, if you have one', 'Quantity per shipment and repeat frequency', 'Destination country', 'Payment terms you work with'],
    documents: ['Certificate of Analysis per batch', 'Wholesale drug licence of the supplying partner', 'Packing list and commercial invoice per shipment'],
    matching: 'Target prices are treated as a starting point, not a promise. Pricing is always quoted per requirement.',
    cta: 'Request wholesale pricing',
  },
  {
    slug: 'hospitals',
    name: 'Hospital Groups',
    navLabel: 'Hospitals',
    summary: 'Private and public hospital networks buying formulations, devices and institutional supplies.',
    headline: 'Institutional supply for hospital procurement teams',
    intro: 'Hospital procurement works from formularies and approved-vendor lists. We help you source the lines on your formulary and the consumables that go with them, in institutional pack formats.',
    sources: ['Injectables, IV fluids and anaesthesia lines', 'Emergency and critical-care formulations', 'Surgical disposables and diagnostic devices', 'Oncology and specialty lines through qualified partners'],
    categories: ['hospital', 'formulations', 'devices', 'specialty'],
    flow: [
      { title: 'Share the formulary extract', text: 'Send the items you need with strength, form and pack. Mark urgent or tender-linked items.' },
      { title: 'Vendor documentation pack', text: 'Request the manufacturer documents your pharmacy committee and vendor-qualification process require.' },
      { title: 'Quotation and delivery plan', text: 'You receive a written quotation with lead time and a delivery schedule that fits your stock cover.' },
    ],
    submit: ['Formulary list with strength, form and pack', 'Annual and per-order quantities', 'Delivery location and required delivery window', 'Vendor documentation you must obtain', 'Whether the purchase is linked to a tender'],
    documents: ['GMP certificate and manufacturing licence of the partner site', 'Certificate of Analysis per batch', 'Product specification and storage conditions', 'Cold-chain details for temperature-sensitive lines'],
    matching: 'Cold-chain and sterile products are quoted only where a qualified partner confirms supply for your destination.',
    cta: 'Submit a hospital requirement',
  },
  {
    slug: 'government-tenders',
    name: 'Government / Tender Buyers',
    navLabel: 'Government & Tenders',
    summary: 'Ministries of health and public procurement bodies buying through formal tenders.',
    headline: 'Responding to government and tender requirements',
    intro: 'Tenders have fixed specifications, deadlines and documentation rules. Send the tender extract early, so we can confirm which lines can be supplied before the submission date.',
    sources: ['Essential-medicines lists and national formulary items', 'Programme supplies: antimalarials, antiretrovirals, antibiotics', 'Medical devices and diagnostics listed in tender schedules', 'Bulk institutional packs'],
    categories: ['formulations', 'hospital', 'devices', 'biologicals'],
    flow: [
      { title: 'Send the tender extract', text: 'Include the schedule, specifications, quantities, delivery terms and closing date.' },
      { title: 'Eligibility check', text: 'We check which lines can be supplied by manufacturing partners against the tender specification and documentation rules.' },
      { title: 'Quotation support', text: 'You receive pricing inputs and the documents a partner can provide. Final tender submission remains with the bidding entity.' },
    ],
    submit: ['Tender reference, issuing body and closing date', 'Schedule of items with specification and quantity', 'Required documents and eligibility criteria', 'Delivery terms (Incoterm, port, delivery period)', 'Whether pre-qualification (e.g. WHO PQ) is required'],
    documents: ['GMP certificate and manufacturing licence of the partner site', 'COPP, where issued', 'Certificate of Analysis', 'Pre-qualification or registration evidence, where the partner holds it'],
    matching: 'Where a tender requires a pre-qualification or registration that the product does not have, we say so up front instead of quoting.',
    caution: 'PharmaXports does not guarantee tender outcomes, registrations or pre-qualification status.',
    cta: 'Send a tender requirement',
  },
  {
    slug: 'ngos',
    name: 'NGOs',
    navLabel: 'NGOs',
    summary: 'NGOs and donor-funded programmes procuring essential medicines and supplies.',
    headline: 'Sourcing for NGOs and donor-funded programmes',
    intro: 'Donor-funded procurement carries its own quality-assurance conditions. Tell us which donor rules apply and we check supply against them before quoting.',
    sources: ['Essential medicines for programme use', 'Antimalarial, antiretroviral and anti-infective lines', 'Nutritional and supplementary products', 'Basic medical devices and consumables'],
    categories: ['formulations', 'nutraceuticals', 'devices', 'biologicals'],
    flow: [
      { title: 'State the programme rules', text: 'Tell us the donor, any quality-assurance policy, and whether WHO-prequalified or stringent-authority-approved sources are mandatory.' },
      { title: 'Compliant-source check', text: 'We screen manufacturing partners against those rules and drop the ones that do not qualify.' },
      { title: 'Quotation and delivery planning', text: 'You receive pricing, lead time and a delivery plan to the programme location.' },
    ],
    submit: ['Product, strength, form and quantity', 'Donor or funding body quality-assurance requirements', 'Delivery country and final delivery point', 'Required shelf life on arrival', 'Importer of record in the destination country'],
    documents: ['Certificate of Analysis per batch', 'GMP certificate of the partner site', 'Shelf-life and storage details', 'Pre-qualification evidence, where the partner holds it'],
    matching: 'Importation into some countries needs a local importer of record; we ask for that at the start so the quotation is workable.',
    cta: 'Submit a programme requirement',
  },
  {
    slug: 'manufacturers',
    name: 'Pharmaceutical Manufacturers',
    navLabel: 'Manufacturers (APIs)',
    summary: 'Formulators sourcing APIs and intermediates from Indian producers.',
    headline: 'API and intermediate sourcing for formulators',
    intro: 'Formulators need consistent specifications and a traceable supply chain. Send the pharmacopoeial grade and the documents your own regulator will ask you to hold.',
    sources: ['Active pharmaceutical ingredients by pharmacopoeial grade', 'Selected intermediates and excipients', 'Multiple-source options for supply-chain resilience'],
    categories: ['apis'],
    flow: [
      { title: 'Specify the grade', text: 'Give the API, pharmacopoeia (IP, BP, USP, Ph. Eur.) and any particle-size or impurity requirements.' },
      { title: 'Qualified-supplier screening', text: 'We screen producers for the documentation that your regulatory filing needs.' },
      { title: 'Sample and quotation route', text: 'Samples, audits and commercial terms are arranged between your quality team and the producer, with us coordinating.' },
    ],
    submit: ['API name, grade and pharmacopoeia', 'Specification or impurity profile you require', 'Annual and batch quantity', 'Regulatory filings the API will support', 'Whether a DMF/CEP reference is required'],
    documents: ['Certificate of Analysis and specification', 'Drug Master File (DMF) or EDQM CEP reference, where the producer holds one', 'GMP certificate and manufacturing licence', 'Residual-solvent and impurity data, where available'],
    matching: 'A DMF or CEP is only discussed where the producer actually holds one for that API.',
    cta: 'Request API quotation',
  },
  {
    slug: 'pharmacy-chains',
    name: 'Pharmacy Chains',
    navLabel: 'Pharmacy Chains',
    summary: 'Registered pharmacy chains sourcing OTC, nutraceutical and Rx lines through licensed channels.',
    headline: 'Private-label and range sourcing for pharmacy chains',
    intro: 'A pharmacy chain buys across a range and often under its own label. Tell us the range and the branding requirement and we start from there.',
    sources: ['OTC and nutraceutical ranges', 'Private-label packs where the manufacturing partner offers them', 'Prescription generics, supplied against your licence', 'AYUSH and wellness lines where your market permits them'],
    categories: ['nutraceuticals', 'formulations', 'ayush'],
    flow: [
      { title: 'Define range and label', text: 'List the products and say whether you need your own branding and local-language artwork.' },
      { title: 'Artwork and compliance check', text: 'Labelling must meet your country’s rules; we check artwork requirements with the manufacturing partner.' },
      { title: 'Range quotation', text: 'You receive one written quotation for the range with MOQ per line and lead time.' },
    ],
    submit: ['Range list with strength and pack', 'Private-label or branding requirements', 'Number of stores and expected volume', 'Pharmacy licence details for prescription lines', 'Destination country'],
    documents: ['Certificate of Analysis per batch', 'Product specifications and shelf life', 'Label artwork approval process', 'Wholesale licence of the supplying partner'],
    matching: 'Prescription lines are supplied only to buyers who can show the licence that lets them hold them.',
    cta: 'Request a range quotation',
  },
];

export function getBuyerSegment(slug: string) {
  return buyerSegments.find((b) => b.slug === slug);
}
