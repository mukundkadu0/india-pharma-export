import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

// Common alternate/brand names buyers may search for, mapped to product ids.
const synonyms: Record<string, string[]> = {
  'paracetamol-tablets-ip-500mg': ['acetaminophen', 'tylenol'],
  'paracetamol-api': ['acetaminophen'],
  'ibuprofen-tablets-ip-400mg': ['brufen', 'advil'],
  'omeprazole-capsules-ip-20mg': ['prilosec'],
  'metformin-tablets-ip-500mg': ['glucophage'],
  'fluconazole-capsules-ip-150mg': ['diflucan'],
  'cetirizine-tablets-ip-10mg': ['zyrtec'],
  'atorvastatin-tablets-ip-10mg': ['lipitor'],
  'sofosbuvir-velpatasvir-tablets': ['epclusa'],
};

export const GET: APIRoute = async () => {
  const [products, classes, markets, glossary, faqs, resources] = await Promise.all([
    getCollection('products'),
    getCollection('classes'),
    getCollection('markets'),
    getCollection('glossary'),
    getCollection('faqs'),
    getCollection('resources'),
  ]);

  const items = [
    ...products.map((p) => ({
      type: 'product',
      title: p.data.name,
      subtitle: p.data.genericName,
      url: `/products/${p.data.id}/`,
      keywords: [p.data.genericName, p.data.hsCode, p.data.category, ...(synonyms[p.data.id] ?? [])],
    })),
    ...classes.map((c) => ({
      type: 'class',
      title: c.data.name,
      subtitle: `HS ${c.data.hsCode}`,
      url: `/products/therapeutic-class/${c.data.id}/`,
      keywords: [...c.data.molecules, c.data.hsCode],
    })),
    ...markets.map((m) => ({
      type: 'market',
      title: m.data.name,
      subtitle: m.data.tierLabel,
      url: `/markets/${m.data.id}/`,
      keywords: m.data.countries,
    })),
    ...glossary.map((g) => ({
      type: 'glossary',
      title: g.data.term,
      subtitle: g.data.shortDef,
      url: `/glossary/${g.data.id}/`,
      keywords: [],
    })),
    ...faqs.map((f) => ({
      type: 'faq',
      title: f.data.question,
      subtitle: f.data.category,
      url: `/faqs/`,
      keywords: [],
    })),
    ...resources.map((r) => ({
      type: 'resource',
      title: r.data.title,
      subtitle: r.data.category,
      url: `/resources/${r.data.id}/`,
      keywords: [],
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
};
