import type { APIRoute } from 'astro';
import { ALLOWED_EXTENSIONS, MAX_ATTACHMENT_BYTES, extensionOf, safeFilename, verifyContent, type AllowedExt } from '../../lib/rfq-files';

export const prerender = false;

// Server-side intake for buyer RFQs, manufacturer partnerships and general enquiries.
// Secrets are server-only (read from process.env at runtime). Behaviour:
//   - Validates and sanitises every field on the server; honeypot hits get a silent fake success.
//   - Idempotent: the browser sends one key per submission; a retry returns the same reference
//     without creating a second record or email.
//   - Stores to Airtable and/or emails via Resend. 503 means NO channel is configured, so the
//     browser can use its backup channel. 200 means a channel really accepted it.
//   - Optional attachment (PDF/XLSX/XLS/CSV, max 4 MB) is verified by content and sent as an
//     email attachment. Nothing is stored publicly; with no email channel, uploads are refused.
const env = (k: string): string => ((process.env[k] ?? (import.meta.env as Record<string, string | undefined>)[k] ?? '') as string).trim();

const MAX_FIELD = 6000; // long multi-product lists and messages
const RATE_LIMIT = Number(process.env.RFQ_RATE_LIMIT) || 8; // env override is for tests
const RATE_WINDOW_MS = 10 * 60 * 1000;
// In-memory: per serverless instance, so it only blunts casual abuse. A hard limit needs a Vercel
// Firewall rate-limit rule and/or Turnstile (see docs/HOSTING_CONFIGURATION.md).
const hits = new Map<string, number[]>();
const seen = new Map<string, number>(); // idempotency keys handled by this instance
const inflight = new Map<string, Promise<Response>>();

function rateLimited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t > RATE_WINDOW_MS)) hits.delete(k);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');
const clean = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.replace(/\u0000/g, '').trim().slice(0, MAX_FIELD) : '');
const json = (body: object, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const KEY_RE = /^PX-\d{6}-[0-9A-F]{8}$/;
function reference() {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `PX-${ymd}-${rand}`;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = env('TURNSTILE_SECRET');
  if (!secret) return true;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(8000) }).catch(() => null);
  const r = (await res?.json().catch(() => ({ success: false }))) as { success?: boolean } | undefined;
  return r?.success === true;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const PHONE_RE = /^[+0-9()\s-]{7,20}$/;

export const GET: APIRoute = () => json({ error: 'Method not allowed' }, 405);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (rateLimited(ip)) return json({ error: 'Too many requests' }, 429);

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_ATTACHMENT_BYTES + 256 * 1024) return json({ error: 'The submission is too large. Attachments can be up to 4 MB.', code: 'too_large' }, 413);

  const form = await request.formData().catch(() => null);
  if (!form) return json({ error: 'Invalid form data' }, 400);

  // Honeypot: look successful to a bot, deliver nothing.
  if (clean(form.get('companyWebsite'))) return json({ ok: true, reference: reference() });

  if (!(await verifyTurnstile(clean(form.get('cf-turnstile-response')), ip))) return json({ error: 'Verification failed' }, 400);

  const kind = (['buyer', 'partnership', 'general'] as const).find((k) => k === clean(form.get('enquiry_type'))) ?? 'general';
  const lead = {
    kind,
    name: clean(form.get('fullName')) || clean(form.get('companyName')),
    company: clean(form.get('companyName')) || clean(form.get('company')),
    email: clean(form.get('email')),
    phone: clean(form.get('phone')),
    country: clean(form.get('country')),
    buyerType: clean(form.get('buyerType')),
    partnershipType: clean(form.get('partnershipType')),
    product: clean(form.get('product')),
    quantity: clean(form.get('quantity')),
    dosageForm: clean(form.get('dosageForm')),
    strength: clean(form.get('strength')),
    packaging: clean(form.get('packaging')),
    targetMarket: clean(form.get('targetMarket')),
    deliveryDate: clean(form.get('deliveryDate')),
    targetPrice: clean(form.get('targetPrice')),
    currency: clean(form.get('currency')),
    incoterm: clean(form.get('incoterm')),
    destinationPort: clean(form.get('destinationPort')),
    listUrl: clean(form.get('attachmentUrl')),
    message: clean(form.get('message')),
    page: clean(form.get('page')),
    landingPage: clean(form.get('landing_page')),
    referrer: clean(form.get('referrer')),
    utmSource: clean(form.get('utm_source')),
    utmMedium: clean(form.get('utm_medium')),
    utmCampaign: clean(form.get('utm_campaign')),
    utmTerm: clean(form.get('utm_term')),
    utmContent: clean(form.get('utm_content')),
    gclid: clean(form.get('gclid')),
    enquiryDate: clean(form.get('enquiry_date')) || new Date().toISOString(),
  };

  // Required fields depend on the enquiry type. The main RFQ page sends rfq_mode=full.
  const full = clean(form.get('rfq_mode')) === 'full';
  const required: (keyof typeof lead)[] =
    kind === 'buyer'
      ? full ? ['company', 'email', 'phone', 'country', 'buyerType', 'product', 'quantity'] : ['name', 'email', 'country', 'product', 'quantity']
      : kind === 'partnership'
        ? ['name', 'company', 'email', 'country', 'partnershipType', 'message']
        : ['name', 'email', 'message'];
  const missing = required.filter((k) => !lead[k]);
  if (missing.length) return json({ error: `Please fill in: ${missing.join(', ')}` }, 400);
  if (!EMAIL_RE.test(lead.email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (lead.phone && !PHONE_RE.test(lead.phone)) return json({ error: 'Please enter a valid phone number (digits, +, spaces, dashes).' }, 400);
  if (lead.listUrl && !/^https:\/\/[^\s]+$/i.test(lead.listUrl)) return json({ error: 'The file link must start with https://' }, 400);

  const airtableOn = Boolean(env('AIRTABLE_TOKEN') && env('AIRTABLE_BASE') && env('AIRTABLE_TABLE'));
  const emailOn = Boolean(env('RESEND_API_KEY') && env('FROM_EMAIL') && env('SALES_EMAIL'));

  // ---- Optional attachment: validated before anything is delivered ---------------------
  let attachment: { filename: string; content: string; size: number } | null = null;
  const file = form.get('attachment');
  if (file instanceof File && file.size > 0) {
    if (!emailOn) return json({ error: 'File uploads are not available right now. Remove the attachment, or email the file to us.', code: 'attachments_unconfigured' }, 503);
    const ext = extensionOf(file.name);
    if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) return json({ error: 'Attachments must be PDF, XLSX, XLS or CSV files.', code: 'bad_attachment' }, 400);
    if (file.size > MAX_ATTACHMENT_BYTES) return json({ error: 'The attached file is too large (maximum 4 MB).', code: 'too_large' }, 413);
    const bytes = new Uint8Array(await file.arrayBuffer());
    const problem = verifyContent(ext as AllowedExt, file.type, bytes);
    if (problem) return json({ error: problem, code: 'bad_attachment' }, 400);
    attachment = { filename: safeFilename(file.name, ext), content: Buffer.from(bytes).toString('base64'), size: bytes.length };
  }

  if (!airtableOn && !emailOn) return json({ error: 'Lead channels not configured', code: 'not_configured' }, 503);

  // ---- Idempotency: the browser keeps one key per submission across retries ------------
  const supplied = clean(form.get('idempotency_key'));
  const id = KEY_RE.test(supplied) ? supplied : reference();
  const nowMs = Date.now();
  for (const [k, t] of seen) if (nowMs - t > 24 * 3600 * 1000) seen.delete(k);
  if (seen.has(id)) return json({ ok: true, reference: id, duplicate: true });

  // Concurrent requests with the same key (a retry arriving while the first is still running)
  // wait for the first one and share its result instead of delivering twice.
  const run = async (): Promise<Response> => {
  // *_API_BASE overrides exist only so staging tests can point at a mock server.
  const AT_URL = `${env('AIRTABLE_API_BASE') || 'https://api.airtable.com'}/v0/${env('AIRTABLE_BASE')}/${env('AIRTABLE_TABLE')}`;
  const AT_HEAD = { Authorization: `Bearer ${env('AIRTABLE_TOKEN')}`, 'Content-Type': 'application/json' };
  if (airtableOn && KEY_RE.test(id)) {
    const q = await fetch(`${AT_URL}?maxRecords=1&filterByFormula=${encodeURIComponent(`{Lead ID}="${id}"`)}`, { headers: AT_HEAD, signal: AbortSignal.timeout(8000) }).catch(() => null);
    const found = (await q?.json().catch(() => null)) as { records?: unknown[] } | null;
    if (found?.records?.length) {
      seen.set(id, nowMs);
      return json({ ok: true, reference: id, duplicate: true });
    }
  }

  const attribution = [
    `Type: ${lead.kind}`,
    `Landing page: ${lead.landingPage}`,
    `Submitted from: ${lead.page}`,
    `Referrer: ${lead.referrer}`,
    `UTM: ${[lead.utmSource, lead.utmMedium, lead.utmCampaign].join(' / ')}`,
    lead.utmTerm ? `UTM term: ${lead.utmTerm}` : '',
    lead.utmContent ? `UTM content: ${lead.utmContent}` : '',
    lead.gclid ? `GCLID: ${lead.gclid}` : '',
  ].filter(Boolean).join('\n');
  const detail = [
    lead.partnershipType ? `Partnership type: ${lead.partnershipType}` : '',
    `Buyer type: ${lead.buyerType}`,
    `Dosage form: ${lead.dosageForm}`,
    `Strength: ${lead.strength}`,
    `Packaging: ${lead.packaging}`,
    `Target market: ${lead.targetMarket}`,
    `Delivery date: ${lead.deliveryDate}`,
    `Currency: ${lead.currency}`,
    `Incoterm: ${lead.incoterm}`,
    `Destination port: ${lead.destinationPort}`,
    lead.listUrl ? `Product list link: ${lead.listUrl}` : '',
    attachment ? `Attachment: ${attachment.filename} (${Math.round(attachment.size / 1024)} KB), sent by email to sales` : '',
    lead.message ? `\nMessage:\n${lead.message}` : '',
  ].filter((l) => !/: $/.test(l) && l !== '').join('\n');

  let delivered = false;

  if (airtableOn) {
    // Only fields already used by the original bulk-lead table, so existing tables keep working.
    // Everything extra is folded into Message rather than risking a 422 on unknown columns.
    const res = await fetch(AT_URL, {
      method: 'POST',
      headers: AT_HEAD,
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        fields: {
          'Lead ID': id,
          'Created At': lead.enquiryDate,
          Source: lead.landingPage || lead.page,
          'UTM Source': lead.utmSource,
          'UTM Medium': lead.utmMedium,
          'UTM Campaign': lead.utmCampaign,
          Product: lead.product,
          Quantity: lead.quantity,
          Country: lead.country,
          'Buyer Name': lead.name,
          Company: lead.company,
          Email: lead.email,
          Phone: lead.phone,
          'Target Price': lead.targetPrice,
          Message: `${detail}\n\n${attribution}`,
          Status: 'New',
        },
      }),
    }).catch(() => null);
    if (res?.ok) delivered = true;
    else console.error('Airtable error', res?.status, await res?.text().catch(() => ''));
  }

  if (emailOn) {
    const RESEND_KEY = env('RESEND_API_KEY');
    const text = `Reference: ${id}\nName: ${lead.name}\nCompany: ${lead.company}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nCountry: ${lead.country}\nProduct: ${lead.product}\nQuantity: ${lead.quantity}\n${detail}\n\n${attribution}`;
    const send = (to: string, subject: string, body: string, idemSuffix: string, files?: { filename: string; content: string }[]) =>
      fetch(`${env('RESEND_API_BASE') || 'https://api.resend.com'}/emails`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `${id}-${idemSuffix}` },
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({ from: env('FROM_EMAIL'), to, subject: oneLine(subject), text: body, reply_to: lead.email, ...(files ? { attachments: files } : {}) }),
      }).catch(() => null);
    const salesRes = await send(
      env('SALES_EMAIL'),
      `New ${lead.kind} enquiry ${id} - ${lead.product || lead.company || lead.name} - ${lead.country}`,
      text,
      'sales',
      attachment ? [{ filename: attachment.filename, content: attachment.content }] : undefined,
    );
    if (salesRes?.ok) delivered = true;
    else console.error('Resend error', salesRes?.status, await salesRes?.text().catch(() => ''));
    // Acknowledgement to the sender is OFF unless SEND_ACK_EMAIL=true: it mails an address typed
    // by an anonymous visitor, which can be abused to send mail to third parties.
    if (delivered && env('SEND_ACK_EMAIL') === 'true') {
      await send(lead.email, `We received your enquiry - ${id}`, `Hello ${lead.name},\n\nThank you for contacting PharmaXports. We have received your enquiry (reference ${id}) and our team will review it and reply by email. Pricing, availability and export eligibility are confirmed in writing before any commitment.\n\nPharmaXports${env('REPLY_TO_EMAIL') ? `\n${env('REPLY_TO_EMAIL')}` : ''}`, 'ack');
    }
  }

  if (!delivered) return json({ error: 'Could not deliver the enquiry', code: 'delivery_failed' }, 502);
  seen.set(id, nowMs);
  return json({ ok: true, reference: id });
  };

  const pending = inflight.get(id);
  if (pending) return (await pending).clone();
  const job = run();
  inflight.set(id, job);
  try {
    return (await job).clone();
  } finally {
    inflight.delete(id);
  }
};
