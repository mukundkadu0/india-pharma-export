// Central, clearly-marked configuration. Replace CONFIGURE values with real
// business details before this site goes live — see the README note at the
// bottom of this file for what must change pre-launch.

export const site = {
  name: 'India Pharma Export',
  legalName: 'India Pharma Export', // CONFIGURE: registered legal entity name
  tagline: 'Trusted Medicines. Healthier Tomorrow.',
  domain: 'indiapharmaexport.com', // CONFIGURE: confirm once the domain is live
  url: 'https://www.indiapharmaexport.com', // CONFIGURE
  email: 'export@indiapharmaexport.com', // CONFIGURE: replace with a real monitored inbox
  partnershipEmail: 'partnerships@indiapharmaexport.com', // CONFIGURE
  phone: '+91 00000 00000', // CONFIGURE
  whatsapp: '+91 00000 00000', // CONFIGURE
  address: 'India', // CONFIGURE: registered business address
  // CONFIGURE: point this at a real form backend (Formspree, a serverless
  // function, etc.) before launch — forms render and validate without it,
  // but nothing is delivered until this is set.
  formEndpoint: '',
  social: {
    // CONFIGURE: add only real, live profile URLs. Leave empty to hide the icon.
    linkedin: '',
    twitter: '',
  },
  founded: null as number | null, // CONFIGURE: set only if there is a real founding year to state
} as const;

export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms of Use', href: '/terms/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
];
