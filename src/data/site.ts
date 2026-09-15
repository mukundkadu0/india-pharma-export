// Central, clearly-marked configuration. Replace CONFIGURE values with real
// business details before this site goes live — see the README note at the
// bottom of this file for what must change pre-launch.

export const site = {
  name: 'India Pharma Export',
  legalName: 'India Pharma Export', // CONFIGURE: registered legal entity name
  tagline: 'Trusted Medicines. Healthier Tomorrow.',
  domain: 'pharmaxports.com',
  // www is canonical — the apex 308-redirects to it on Vercel.
  url: 'https://www.pharmaxports.com',
  email: 'export@indiapharmaexport.com', // CONFIGURE: replace with a real monitored inbox
  partnershipEmail: 'partnerships@indiapharmaexport.com', // CONFIGURE
  phone: '+91 00000 00000', // CONFIGURE
  whatsapp: '+91 00000 00000', // CONFIGURE
  address: 'India', // CONFIGURE: registered business address
  // Web3Forms (https://web3forms.com) — delivers form submissions to
  // mukundkadu48@gmail.com (the account owner). No backend required.
  formEndpoint: 'https://api.web3forms.com/submit',
  formAccessKey: '0c8adcc9-f5ab-4a3e-a0bd-4ce039412480',
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
