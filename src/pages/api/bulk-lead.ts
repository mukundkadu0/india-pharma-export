import type { APIRoute } from 'astro';

export const prerender = false;

// All secrets are server-side only. If they are unset the endpoint reports that
// it is unconfigured and the browser falls back to the existing form service,
// so a lead is never silently dropped.
const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE = import.meta.env.AIRTABLE_BASE;
const AIRTABLE_TABLE = import.meta.env.AIRTABLE_TABLE;
const RESEND_KEY = import.meta.env.RESEND_API_KEY;
const SALES_EMAIL = import.meta.env.SALES_EMAIL;
const FROM_EMAIL = import.meta.env.FROM_EMAIL;
const REPLY_TO_EMAIL = import.meta.env.REPLY_TO_EMAIL;
const TURNSTILE_SECRET = import.meta.env.TURNSTILE_SECRET;

const MAX_FIELD = 2000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function clean(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : '';
}

function leadId() {
  return 'PX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function verifyTurnstile(token: string, ip: string) {
  if (!TURNSTILE_SECRET) return true;
  const body = new FormData();
  body.append('secret', TURNSTILE_SECRET);
  body.append('response', token);
  body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const json = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
  return json.success === true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? 'unknown';
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return new Response(JSON.stringify({ error: 'Invalid form data' }), { status: 400 });

  // Honeypot: accept silently so a bot learns nothing.
  if (clean(form.get('companyWebsite'))) {
    return new Response(JSON.stringify({ ok: true, leadId: leadId() }), { status: 200 });
  }

  if (!(await verifyTurnstile(clean(form.get('cf-turnstile-response')), ip))) {
    return new Response(JSON.stringify({ error: 'Verification failed' }), { status: 400 });
  }

  const lead = {
    product: clean(form.get('product')),
    fullName: clean(form.get('fullName')),
    email: clean(form.get('email')),
    country: clean(form.get('country')),
    quantity: clean(form.get('quantity')),
    company: clean(form.get('company')),
    phone: clean(form.get('phone')),
    targetPrice: clean(form.get('targetPrice')),
    frequency: clean(form.get('frequency')),
    message: clean(form.get('message')),
    source: clean(form.get('source')),
    utmSource: clean(form.get('utm_source')),
    utmMedium: clean(form.get('utm_medium')),
    utmCampaign: clean(form.get('utm_campaign')),
  };

  const missing = (['product', 'fullName', 'email', 'country', 'quantity'] as const).filter((k) => !lead[k]);
  if (missing.length) {
    return new Response(JSON.stringify({ error: `Missing: ${missing.join(', ')}` }), { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE || !AIRTABLE_TABLE) {
    return new Response(JSON.stringify({ error: 'Lead store not configured' }), { status: 503 });
  }

  const id = leadId();
  const airtableRes = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        'Lead ID': id,
        'Created At': new Date().toISOString(),
        Source: lead.source,
        'UTM Source': lead.utmSource,
        'UTM Medium': lead.utmMedium,
        'UTM Campaign': lead.utmCampaign,
        Product: lead.product,
        Quantity: lead.quantity,
        Country: lead.country,
        'Buyer Name': lead.fullName,
        Company: lead.company,
        Email: lead.email,
        Phone: lead.phone,
        'Target Price': lead.targetPrice,
        Frequency: lead.frequency,
        Message: lead.message,
        Status: 'New',
      },
    }),
  });

  if (!airtableRes.ok) {
    console.error('Airtable error', airtableRes.status, await airtableRes.text());
    return new Response(JSON.stringify({ error: 'Could not save lead' }), { status: 502 });
  }

  if (RESEND_KEY && FROM_EMAIL && SALES_EMAIL) {
    const rows = Object.entries(lead)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    const send = (to: string, subject: string, text: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, text, reply_to: REPLY_TO_EMAIL || undefined }),
      }).catch((err) => console.error('Email failed', err));

    await Promise.all([
      send(SALES_EMAIL, `New Bulk Order Lead — ${lead.product} — ${lead.quantity} — ${lead.country}`, `Lead ID: ${id}\n${rows}`),
      send(lead.email, `We received your bulk request — ${id}`, `Hello ${lead.fullName},\n\nThank you for your enquiry. We have received your bulk request for ${lead.product} (${lead.quantity}) and our team will review it and get back to you.\n\nYour reference is ${id}.\n\nPricing, availability and export eligibility are confirmed by our team before any commitment.`),
    ]);
  }

  return new Response(JSON.stringify({ ok: true, leadId: id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
