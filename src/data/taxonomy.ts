export const categoryGroups = [
  {
    id: 'formulations',
    name: 'Formulations',
    shortDescription: 'Tablets, capsules, injectables and other finished dosage forms.',
    icon: 'tablet',
  },
  {
    id: 'apis',
    name: 'APIs',
    shortDescription: 'Active pharmaceutical ingredients for international manufacturers and formulators.',
    icon: 'flask',
  },
  {
    id: 'biologicals',
    name: 'Biologicals & Vaccines',
    shortDescription: 'Vaccines, immunoglobulins and biologics supplied through qualified manufacturing partners.',
    icon: 'vial',
  },
  {
    id: 'devices',
    name: 'Medical Devices',
    shortDescription: 'Surgical disposables, diagnostics and institutional medical devices.',
    icon: 'device',
  },
  {
    id: 'ayush',
    name: 'AYUSH',
    shortDescription: "India's traditional herbal and homeopathic categories for eligible markets.",
    icon: 'leaf',
  },
  {
    id: 'nutraceuticals',
    name: 'Nutraceuticals / OTC',
    shortDescription: 'Vitamins, supplements and general-sale wellness products.',
    icon: 'capsule',
  },
  {
    id: 'specialty',
    name: 'Specialty Pharma',
    shortDescription: 'Oncology, immunology, rheumatology and rare-disease biologics.',
    icon: 'target',
  },
  {
    id: 'hospital',
    name: 'Hospital / Institutional',
    shortDescription: 'Anaesthesia, emergency care, IV fluids and other institutional-tender supplies.',
    icon: 'hospital',
  },
] as const;

export type CategoryGroupId = (typeof categoryGroups)[number]['id'];

export function getCategoryGroup(id: string) {
  return categoryGroups.find((c) => c.id === id);
}

export const exportStatusMeta = {
  free: {
    label: 'Freely Exportable',
    shortLabel: 'Free',
    className: 'bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] border-[color:var(--color-success)]/30',
    description: 'Exportable under a wholesale drug licence and RCMC for standard approved formulations. No CDSCO Export NOC needed.',
  },
  noc: {
    label: 'NOC / Conditional',
    shortLabel: 'NOC',
    className: 'bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/30',
    description: 'Requires a CDSCO Export NOC, a sector permission, or is subject to periodic DGFT quantity restrictions.',
  },
  controlled: {
    label: 'Controlled',
    shortLabel: 'Controlled',
    className: 'bg-[color:var(--color-error)]/10 text-[color:var(--color-error)] border-[color:var(--color-error)]/30',
    description: 'NDPS or psychotropic. Narcotics Commissioner authorisation and destination-specific clearance required.',
  },
  prohibited: {
    label: 'Prohibited',
    shortLabel: 'Prohibited',
    className: 'bg-[color:var(--color-error)]/20 text-[color:var(--color-error)] border-[color:var(--color-error)]/40',
    description: 'Cannot be exported, or only under exceptional case-by-case central government permission.',
  },
} as const;

export const prescriptionStatusMeta = {
  otc: {
    label: 'OTC — No Prescription',
    shortLabel: 'OTC',
    className: 'bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] border-[color:var(--color-success)]/30',
  },
  rx: {
    label: 'Schedule H — Prescription Only',
    shortLabel: 'Rx',
    className: 'bg-slate-500/10 text-slate-600 border-slate-400/30',
  },
  h1: {
    label: 'Schedule H1 — Prescription + Register',
    shortLabel: 'H1',
    className: 'bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/30',
  },
  x: {
    label: 'Schedule X / NDPS — Special Licence',
    shortLabel: 'Schedule X',
    className: 'bg-[color:var(--color-error)]/10 text-[color:var(--color-error)] border-[color:var(--color-error)]/30',
  },
  mixed: {
    label: 'Mixed — Varies by Molecule',
    shortLabel: 'Mixed',
    className: 'bg-slate-500/10 text-slate-600 border-slate-400/30',
  },
  hospital: {
    label: 'Hospital / Professional Use',
    shortLabel: 'Hospital Use',
    className: 'bg-[color:var(--color-blue)]/10 text-[color:var(--color-blue)] border-[color:var(--color-blue)]/30',
  },
} as const;

export const marketSkyline: Record<string, 'us' | 'eu' | 'africa' | 'latam' | 'cis' | 'middle-east' | 'sea'> = {
  'united-states': 'us',
  'europe-uk': 'eu',
  africa: 'africa',
  'latin-america': 'latam',
  'cis-russia': 'cis',
  'middle-east': 'middle-east',
  'southeast-asia': 'sea',
};

export const marketMeta: Record<string, { flagLabel: string }> = {
  'united-states': { flagLabel: 'US' },
  'europe-uk': { flagLabel: 'EU/UK' },
  africa: { flagLabel: 'Africa' },
  'latin-america': { flagLabel: 'LatAm' },
  'cis-russia': { flagLabel: 'CIS' },
  'middle-east': { flagLabel: 'Middle East' },
  'southeast-asia': { flagLabel: 'SE Asia' },
};

export const buyerTypes = [
  { id: 'importer', name: 'Importers', description: 'Licensed importers of record who clear pharmaceutical consignments and hold the import authorisation in their own country.' },
  { id: 'distributor', name: 'Distributors', description: 'Regional and national distributors managing onward supply to pharmacies, clinics and hospitals.' },
  { id: 'wholesaler', name: 'Wholesalers', description: 'Wholesale pharmaceutical traders supplying pharmacy and institutional channels at volume.' },
  { id: 'hospital', name: 'Hospital Groups', description: 'Private and public hospital networks sourcing formulations, devices and institutional supplies directly.' },
  { id: 'government', name: 'Government / Tender Buyers', description: 'Ministries of health and government procurement bodies buying through formal tender processes.' },
  { id: 'ngo', name: 'NGOs', description: 'NGOs and donor-funded health programmes procuring essential medicines, ARVs, antimalarials and vaccines at scale.' },
  { id: 'pharmacy-chain', name: 'Pharmacy Chains', description: 'Registered retail pharmacy chains sourcing OTC, nutraceutical and prescription lines through licensed wholesale channels.' },
  { id: 'manufacturer', name: 'Pharmaceutical Manufacturers', description: 'Formulators and manufacturers sourcing APIs and pharmaceutical intermediates.' },
] as const;
