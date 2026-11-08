// Shared browser-side submit for every enquiry form (RFQ, bulk modal, partnership, general,
// multi-product inquiry list, direct-order cart).
//
// Delivery order:
//   1. POST /api/rfq  - server validates, de-duplicates, stores (Airtable) and emails (Resend).
//   2. Only if the server is not configured (503) or has a server fault (5xx) and there is NO
//      attachment, POST to the Web3Forms endpoint.
// A form is only reported as sent when one of those channels explicitly accepted it.
//
// Idempotency: one key (the reference number) is created per submission attempt and reused on
// every retry of that attempt, so a network retry cannot create a second enquiry.

import { checkFileBasics } from './rfq-files';

export type EnquiryKind = 'buyer' | 'partnership' | 'general';
export type SubmitResult = { ok: true; reference: string; channel: 'server' | 'web3forms' } | { ok: false; error: string };

// Hostnames where the Web3Forms backup channel may send real email. Keep in sync with site.domain.
const FALLBACK_HOSTS = new Set(['www.pharmaxports.com', 'pharmaxports.com']);

const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'landing_page', 'referrer', 'first_seen'];

function newReference(): string {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `PX-${ymd}-${rand}`;
}

function setIfEmpty(fd: FormData, key: string, value: string) {
  if (value && !fd.get(key)) fd.set(key, value);
}

export function decorate(fd: FormData, kind: EnquiryKind, reference: string) {
  let attr: Record<string, string> = {};
  try {
    attr = JSON.parse(sessionStorage.getItem('px-attr') || '{}');
  } catch {
    /* sessionStorage unavailable: attribution is simply omitted */
  }
  for (const k of ATTR_KEYS) setIfEmpty(fd, k, attr[k] ?? '');
  fd.set('enquiry_type', kind);
  fd.set('enquiry_date', new Date().toISOString());
  fd.set('page', location.pathname + location.search);
  fd.set('reference', reference);
  fd.set('idempotency_key', reference);
}

type ServerReply = { ok?: boolean; reference?: string; error?: string; code?: string };

async function postToServer(fd: FormData): Promise<{ status: number; body: ServerReply } | null> {
  try {
    const res = await fetch('/api/rfq', { method: 'POST', body: fd, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
    return { status: res.status, body: (await res.json().catch(() => ({}))) as ServerReply };
  } catch {
    return null; // network error or timeout
  }
}

/**
 * @param extra fields to set on top of the form (used by pages whose field names differ)
 */
export async function submitEnquiry(form: HTMLFormElement, kind: EnquiryKind, endpointFallback: string, extra: Record<string, string> = {}): Promise<SubmitResult> {
  const fd = new FormData(form);
  for (const [k, v] of Object.entries(extra)) fd.set(k, v);

  // Attachment: drop an empty file input, validate a chosen one.
  const file = fd.get('attachment');
  const hasFile = file instanceof File && file.size > 0 && file.name !== '';
  if (!hasFile) fd.delete('attachment');
  else {
    const problem = checkFileBasics((file as File).name, (file as File).size);
    if (problem) return { ok: false, error: problem };
  }

  // One key per attempt; kept on the form until the enquiry is accepted.
  const reference = form.dataset.idemKey || (form.dataset.idemKey = newReference());
  decorate(fd, kind, reference);

  // 1) Own server endpoint, retried once with the SAME key if the network dropped the reply.
  let reply = await postToServer(fd);
  if (!reply) reply = await postToServer(fd);

  if (reply) {
    const { status, body } = reply;
    if (status >= 200 && status < 300 && body.ok) {
      delete form.dataset.idemKey;
      return { ok: true, reference: body.reference || reference, channel: 'server' };
    }
    if (status === 429) return { ok: false, error: 'Too many submissions from your connection. Please try again in a few minutes.' };
    if (status === 413) return { ok: false, error: body.error || 'The attached file is too large (maximum 4 MB).' };
    if (status >= 400 && status < 500) return { ok: false, error: body.error || 'Please check the form and try again.' };
    if (body.code === 'attachments_unconfigured') return { ok: false, error: body.error || 'File uploads are not available right now. Please remove the attachment.' };
    // 5xx (including 503 "not configured") falls through to the backup channel below.
  }

  // 2) Form-service fallback. It delivers a REAL email to the business inbox, so it only runs on the
  //    production hostnames. Previews, localhost and test deployments never create a live enquiry.
  if (!FALLBACK_HOSTS.has(location.hostname)) {
    return { ok: false, error: 'Enquiry delivery is switched off on this test site, so nothing was sent. On the live site this form delivers normally.' };
  }
  // It cannot carry attachments, so never pretend it did.
  if (hasFile) return { ok: false, error: 'We could not send your enquiry with its attachment right now. Remove the attachment and try again, or email the file to us.' };
  try {
    fd.set('subject', `New ${kind} enquiry ${reference} - PharmaXports`);
    const res = await fetch(endpointFallback, { method: 'POST', body: fd, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(25000) });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (res.ok && json.success === true) {
      delete form.dataset.idemKey;
      return { ok: true, reference, channel: 'web3forms' };
    }
    return { ok: false, error: json.message || 'We could not send your enquiry right now.' };
  } catch {
    return { ok: false, error: 'We could not send your enquiry right now.' };
  }
}

// Fire once per form when the visitor starts filling it in. This is NOT a lead.
export function trackRfqStart(form: HTMLFormElement, kind: EnquiryKind) {
  let fired = false;
  const go = () => {
    if (fired) return;
    fired = true;
    (window as unknown as { pxTrack?: (n: string, p?: object) => void }).pxTrack?.('rfq_start', { enquiry_type: kind, page: location.pathname });
  };
  form.addEventListener('focusin', go, { once: true });
  form.addEventListener('input', go, { once: true });
}

// A completed enquiry, called only after submitEnquiry returned ok. transaction_id lets
// GA4 deduplicate if the event ever fires twice. general enquiries are not lead conversions.
export function trackRfqSubmit(kind: EnquiryKind, reference: string, extra: Record<string, string> = {}) {
  const w = window as unknown as { pxTrack?: (n: string, p?: object) => void; __pxSent?: Set<string> };
  w.__pxSent ??= new Set();
  if (w.__pxSent.has(reference)) return; // never fire twice for the same reference
  w.__pxSent.add(reference);
  const event = kind === 'partnership' ? 'supplier_enquiry_submit' : kind === 'general' ? 'general_enquiry_submit' : 'rfq_submit';
  w.pxTrack?.(event, { enquiry_type: kind, transaction_id: reference, ...extra });
}
