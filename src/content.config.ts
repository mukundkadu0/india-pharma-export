import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const faqSchema = z.object({ q: z.string(), a: z.string() });

export const COUNTRIES = ['US', 'CA', 'UK', 'EU', 'AE', 'AU', 'SG', 'OTHER'] as const;

// Every commerce field is optional with a deliberately restrictive default: a
// product is never purchasable until someone supplies real data for it.
const eligibilityStatus = z.enum(['AVAILABLE', 'BULK_ONLY', 'RESTRICTED', 'NOT_AVAILABLE', 'REVIEW_REQUIRED']);

const commerceFields = {
  commerceStatus: z.enum(['DTC_AND_BULK', 'BULK_ONLY', 'NOT_AVAILABLE', 'REQUEST_REVIEW']).default('BULK_ONLY'),
  sku: z.string().optional(),
  brand: z.string().optional(),
  manufacturer: z.string().optional(),
  consumerCategory: z
    .enum(['vitamins', 'minerals', 'herbal', 'ayurveda', 'nutraceuticals', 'sports', 'protein', 'wellness', 'digestive', 'beauty'])
    .optional(),
  servingSize: z.string().optional(),
  servings: z.number().optional(),
  packSize: z.string().optional(),
  netWeight: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  directions: z.string().optional(),
  warnings: z.array(z.string()).optional(),
  countryOfOrigin: z.string().default('India'),
  images: z.array(z.object({ src: z.string(), alt: z.string() })).optional(),
  coaAvailable: z.boolean().optional(),
  approvedClaims: z.array(z.string()).optional(),
  disclaimer: z.string().optional(),
  pricing: z
    .object({
      indiaCost: z.number().optional(),
      packagingCost: z.number().optional(),
      exportHandlingCost: z.number().optional(),
      shippingCostEstimate: z.number().optional(),
      paymentFeePercent: z.number().optional(),
      paymentFixedFee: z.number().optional(),
      targetMarginPercent: z.number().optional(),
      usComparablePrice: z.number().optional(),
      usComparableUrl: z.string().optional(),
      targetDiscountPercent: z.number().optional(),
      retailPriceUsd: z.number().optional(),
      comparePriceUsd: z.number().optional(),
    })
    .optional(),
  bulk: z
    .object({
      enabled: z.boolean().default(true),
      moq: z.string().optional(),
      tiers: z.array(z.object({ minQty: z.number(), unitPrice: z.number() })).optional(),
    })
    .optional(),
  stockStatus: z.enum(['in_stock', 'made_to_order', 'out_of_stock']).optional(),
  // Keyed by CountryCode, but typed loosely: an enum-keyed z.record demands every
  // country be present, and these maps are deliberately partial — anything unlisted
  // resolves to REVIEW_REQUIRED at runtime.
  countryEligibility: z.record(z.string(), eligibilityStatus).optional(),
};

const classes = defineCollection({
  loader: file('src/content/classes.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    categoryGroup: z.enum([
      'formulations',
      'apis',
      'biologicals',
      'devices',
      'ayush',
      'nutraceuticals',
      'specialty',
      'hospital',
    ]),
    hsCode: z.string(),
    exportStatus: z.enum(['free', 'noc', 'controlled', 'prohibited']),
    exportNote: z.string().optional(),
    prescriptionStatus: z.enum(['otc', 'rx', 'h1', 'x', 'mixed', 'hospital']),
    prescriptionNote: z.string().optional(),
    markets: z.array(z.string()),
    listedCount: z.number(),
    otcCount: z.number().optional(),
    rxCount: z.number().optional(),
    restrictedCount: z.number().optional(),
    summary: z.string(),
    description: z.string(),
    molecules: z.array(z.string()),
  }),
});

const products = defineCollection({
  loader: file('src/content/products.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    genericName: z.string(),
    category: z.enum([
      'formulations',
      'apis',
      'biologicals',
      'devices',
      'ayush',
      'nutraceuticals',
      'specialty',
      'hospital',
    ]),
    therapeuticClass: z.string(),
    dosageForm: z.string(),
    strength: z.string(),
    hsCode: z.string(),
    prescriptionStatus: z.enum(['otc', 'rx', 'h1', 'x']),
    exportStatus: z.enum(['free', 'noc', 'controlled']),
    marketRegions: z.array(z.string()),
    description: z.string(),
    keyPoints: z.array(z.string()),
    packaging: z.string(),
    moq: z.string().default('MOQ on request'),
    shelfLife: z.string().optional(),
    storage: z.string().optional(),
    regulatoryNotes: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    faqs: z.array(faqSchema).optional(),
    relatedProducts: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    ...commerceFields,
  }),
});

const markets = defineCollection({
  loader: file('src/content/markets.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    tier: z.string(),
    tierLabel: z.string(),
    countries: z.array(z.string()),
    character: z.string(),
    overview: z.string(),
    whatSells: z.array(z.string()),
    buyerTypes: z.array(z.string()),
    categories: z.array(z.string()),
    pathway: z.string(),
    plantRequirement: z.string(),
    timeline: z.string(),
    barrierToEntry: z.string(),
    regulatoryConsiderations: z.array(z.string()),
    documents: z.array(z.string()),
    opportunity: z.string(),
    faqs: z.array(faqSchema),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

const glossary = defineCollection({
  loader: file('src/content/glossary.json'),
  schema: z.object({
    id: z.string(),
    term: z.string(),
    shortDef: z.string(),
    definition: z.string(),
    whyItMatters: z.string(),
    relatedTerms: z.array(z.string()).optional(),
  }),
});

const resources = defineCollection({
  loader: file('src/content/resources.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    excerpt: z.string(),
    body: z.array(z.object({ heading: z.string().optional(), paragraphs: z.array(z.string()).optional(), list: z.array(z.string()).optional() })),
    publishedDate: z.string(),
    updatedDate: z.string().optional(),
    relatedProducts: z.array(z.string()).optional(),
    relatedMarkets: z.array(z.string()).optional(),
    relatedGlossary: z.array(z.string()).optional(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    featured: z.boolean().optional(),
  }),
});

const faqs = defineCollection({
  loader: file('src/content/faqs.json'),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string(),
    category: z.string(),
  }),
});

const molecules = defineCollection({
  loader: file('src/content/molecules.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    classId: z.string(),
    categoryGroup: z.enum([
      'formulations',
      'apis',
      'biologicals',
      'devices',
      'ayush',
      'nutraceuticals',
      'specialty',
      'hospital',
    ]),
    buyDirect: z.boolean(),
    flag: z.string().optional(),
    flagDetail: z.string().optional(),
  }),
});

export const collections = { classes, products, markets, glossary, resources, faqs, molecules };
