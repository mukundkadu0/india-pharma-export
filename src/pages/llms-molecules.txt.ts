import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { listableMolecules } from '../lib/molecules';

export const prerender = true;

// Plain-text catalogue for LLM crawlers: one line per molecule with its page, class,
// HS code and export status. Generated from the same data as the molecule pages.
export const GET: APIRoute = async ({ site }) => {
  const [moleculeEntries, classEntries, productEntries] = await Promise.all([
    getCollection('molecules'),
    getCollection('classes'),
    getCollection('products'),
  ]);
  const molecules = moleculeEntries.map((m) => m.data);
  const classes = classEntries.map((c) => c.data);
  const products = productEntries.map((p) => p.data);
  const base = (site ?? new URL('https://www.pharmaxports.com')).toString().replace(/\/$/, '');

  const listable = listableMolecules(molecules, classes, products);
  const lines: string[] = [
    '# PharmaXports - molecule catalogue',
    '',
    '> Molecules freely exportable from India (class export status "Free"), supplied B2B from WHO-GMP certified manufacturing partners. HS code is class-level; confirm the 8-digit ITC(HS) code per formulation. Export status can change by DGFT notification; verify before quoting.',
    '',
  ];
  for (const c of classes.filter((c) => c.exportStatus === 'free')) {
    const items = listable.filter((m) => m.classId === c.id).sort((a, b) => a.name.localeCompare(b.name));
    if (!items.length) continue;
    lines.push(`## ${c.name} (HS ${c.hsCode})`, '');
    for (const m of items) lines.push(`- [${m.name}](${base}/products/${m.id}/)`);
    lines.push('');
  }
  lines.push('## Hand-written product pages', '');
  for (const p of products) lines.push(`- [${p.name}](${base}/products/${p.id}/): ${p.genericName}, HS ${p.hsCode}`);

  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
