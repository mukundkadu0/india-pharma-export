// Attachment rules shared by the browser (early feedback) and the server (the real check).
// The browser checks are a convenience only; /api/rfq re-validates everything.

export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024; // Vercel functions reject request bodies over ~4.5 MB
export const ALLOWED_EXTENSIONS = ['pdf', 'xlsx', 'xls', 'csv'] as const;
export type AllowedExt = (typeof ALLOWED_EXTENSIONS)[number];

// Declared (browser-supplied) types accepted per extension. Browsers are inconsistent, so
// generic types are tolerated here; the content check below is what actually decides.
const DECLARED: Record<AllowedExt, string[]> = {
  pdf: ['application/pdf'],
  xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  xls: ['application/vnd.ms-excel'],
  csv: ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'],
};
const GENERIC = ['', 'application/octet-stream'];

export function extensionOf(name: string): string {
  const m = /\.([A-Za-z0-9]{1,5})$/.exec(name.trim());
  return m ? m[1].toLowerCase() : '';
}

export function safeFilename(name: string, ext: string): string {
  const base = name.replace(/\.[^.]*$/, '').replace(/[^A-Za-z0-9._ -]+/g, '_').replace(/^[. ]+/, '').slice(0, 60) || 'attachment';
  return `${base}.${ext}`;
}

// Cheap checks usable in the browser.
export function checkFileBasics(name: string, size: number): string | null {
  const ext = extensionOf(name);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) return 'Attachments must be PDF, XLSX, XLS or CSV files.';
  if (size <= 0) return 'The attached file is empty.';
  if (size > MAX_ATTACHMENT_BYTES) return `The attached file is too large (maximum ${MAX_ATTACHMENT_BYTES / 1024 / 1024} MB).`;
  return null;
}

const latin1 = (b: Uint8Array) => new TextDecoder('latin1').decode(b);

// Server-side content verification ("magic bytes"), so a renamed .exe or .html is refused.
export function verifyContent(ext: AllowedExt, declaredType: string, bytes: Uint8Array): string | null {
  const declared = declaredType.toLowerCase().split(';')[0].trim();
  if (!DECLARED[ext].includes(declared) && !GENERIC.includes(declared)) return `File type "${declared}" does not match a .${ext} file.`;

  if (ext === 'pdf') {
    const head = latin1(bytes.subarray(0, 1024));
    if (!head.includes('%PDF-')) return 'This does not look like a valid PDF.';
    if (!latin1(bytes.subarray(Math.max(0, bytes.length - 2048))).includes('%%EOF')) return 'This PDF looks incomplete or damaged.';
    return null;
  }
  if (ext === 'xlsx') {
    if (!(bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04)) return 'This does not look like a valid XLSX workbook.';
    const text = latin1(bytes);
    if (!text.includes('xl/workbook.xml')) return 'This ZIP file is not an Excel workbook.';
    if (text.includes('vbaProject.bin')) return 'Workbooks containing macros are not accepted.';
    return null;
  }
  if (ext === 'xls') {
    const sig = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
    if (!sig.every((v, i) => bytes[i] === v)) return 'This does not look like a valid XLS workbook.';
    // The Excel stream name is stored as UTF-16 ("Workbook" or "Book").
    const wide = (s: string) => s.split('').join('\u0000') + '\u0000';
    const text = latin1(bytes);
    if (!text.includes(wide('Workbook')) && !text.includes(wide('Book'))) return 'This OLE file is not an Excel workbook.';
    return null;
  }
  // csv: plain text only. Any NUL byte or binary control character means it is not a CSV.
  const sample = bytes.subarray(0, 16384);
  for (const b of sample) if (b === 0 || (b < 9) || (b > 13 && b < 32)) return 'This does not look like a plain-text CSV file.';
  return null;
}
