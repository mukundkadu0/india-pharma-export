import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const faqSchema = z.object({ q: z.string(), a: z.string() });

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
