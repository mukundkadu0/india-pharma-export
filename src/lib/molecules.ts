// Which catalogue molecules get their own /products/<id>/ page.
// Rule: class export status is "free" AND the molecule carries no restricted-list flag.
// Flagged molecules (market-specific bans, controlled abroad, B2C-risk) stay in the
// molecule index only, with their warning, until someone reviews them individually.
// Molecules already covered by a hand-written product page are skipped to avoid duplicates.

/**
 * OWNER DECISION (open). The ~1,530 molecule pages are built from only a name and a therapeutic class, so pages
 * in the same class share almost all of their text. They are indexable today, which preserves current URLs and
 * rankings. Set this to false to send `noindex, follow` on every molecule page (links still work). If you do,
 * also exclude /products/<molecule>/ from the sitemap. See docs/MOLECULE_PAGES_AUDIT.md.
 */
export const MOLECULE_PAGES_INDEXABLE = true;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9+]+/g, ' ')
    .trim();

interface MoleculeLike {
  id: string;
  name: string;
  classId: string;
  flag?: string;
}
interface ClassLike {
  id: string;
  exportStatus: string;
}
interface ProductLike {
  genericName: string;
}

export function listableMolecules<M extends MoleculeLike>(molecules: M[], classes: ClassLike[], products: ProductLike[]): M[] {
  const freeClasses = new Set(classes.filter((c) => c.exportStatus === 'free').map((c) => c.id));
  const covered = new Set(products.map((p) => norm(p.genericName)));
  return molecules.filter((m) => freeClasses.has(m.classId) && !m.flag && !covered.has(norm(m.name)));
}
