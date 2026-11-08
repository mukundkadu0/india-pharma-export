# RFQ test results

**How tested:** `astro dev` locally with a mock Airtable and Resend server on localhost (`AIRTABLE_API_BASE` / `RESEND_API_BASE` pointed at the mock). Nothing was sent to Airtable, Resend, Web3Forms or any real recipient. In the browser tests the Web3Forms URL was stubbed to a failure response.

**Not tested against real services:** real Airtable, real Resend (and its domain verification), real Web3Forms, real Turnstile. Those are the remaining risks (see bottom).

## API (`/api/rfq`): 43 automated cases, all passed

Run with `rfqtest.mjs` (scratchpad). Phases and results:

**No delivery channel configured (4/4)**
- Valid buyer -> 503 `not_configured` (browser then uses its backup, not a false success)
- With attachment -> 503 `attachments_unconfigured` (uploads are refused, not faked)
- `GET` -> 405
- Invalid email -> 400

**Channels configured (35/35)**
- Buyer valid -> 200, reference equals the client key; one Airtable record, one email, reply-to = buyer
- UTM source/medium/campaign, landing page, referrer and gclid stored with the lead
- Retry with same key -> 200 `duplicate:true`, same reference, still 1 record and 1 email
- Two parallel requests with the same key -> both 200, 1 record, 1 email
- Partnership valid -> 200; missing partnership type -> 400
- General valid -> 200; missing message -> 400
- Kinds stored separately (`Type: partnership`, `Type: general`); email subject names the kind
- Buyer: missing name, missing quantity, bad phone, non-https link, unknown `enquiry_type` -> 400
- Honeypot -> 200 look-alike, nothing stored
- No acknowledgement email to the visitor by default
- Attachments: valid PDF (arrives as email attachment, 45 bytes), valid XLSX, valid-looking XLS, valid CSV -> 200
- Rejected (400): XLSX with `vbaProject.bin`, ZIP that is not a workbook, binary content named .csv, HTML named .pdf, EXE named .pdf, `.exe`, declared type `image/png` on a .pdf
- 5 MB file -> 413; filename `../../etc/passwd.pdf` -> stored as `_.._etc_passwd.pdf`

**Failover (3/3)**
- Airtable down, Resend up -> still 200
- Both down -> 502 (never success)
- Same key after recovery -> delivered once (failure was not remembered as success)

**Rate limit (1/1)**
- Requests 1-8 -> 200, 9-10 -> 429

(Node printed a Windows libuv assertion at process exit after each run; it is a known Node-on-Windows exit quirk and happened after the results were printed.)

## Browser tests (Chrome, real page, local server)

| Test | Result |
|---|---|
| `/request-quote/?utm_source=google&utm_medium=cpc&utm_campaign=africa-q4`: fill 7 fields + PDF, submit | Success panel with reference `PX-261106-330736BA`; Airtable mock row has the UTMs and landing page; email carried `rfq.pdf`; exactly one `rfq_submit` (transaction_id = reference); `rfq_start` fired earlier |
| Same form while rate limiter was exhausted (earlier test run) | Error shown, no success panel, no event |
| `/partner/` with both backends failing and Web3Forms stubbed to fail | Error message shown; **no success panel, no event**; submit button re-enabled; key kept |
| Same form again after the backend recovered | Success with the **same** reference as the failed attempt; `supplier_enquiry_submit` fired once |
| Duplicate `id` / duplicate `name` check on `/partner/` | Names: none. IDs: found the logo gradient bug (fixed) |

## Not tested
- `/inquiry/` and `/shop/cart/` end to end in a browser (code migrated to the same function; build passes).
- `/contact/` general form and the bulk-RFQ modal clicked through (same component and function as tested above).
- A real file picker dialog (the file was attached via script).
- Phone `pattern` behaviour in each browser.
- Mobile devices.

## Risks that remain
1. **Production has no delivery channel configured.** `vercel env ls` shows no environment variables on the project. Until Airtable and/or Resend variables are added, `/api/rfq` returns 503 and every enquiry goes through the Web3Forms fallback, which delivers to the Gmail address behind the form key. **File attachments are refused in that state** (Web3Forms cannot carry them), and the user sees a clear message.
2. Resend needs a verified sending domain before `FROM_EMAIL` works.
3. In-memory de-duplication and rate limiting are per serverless instance. The durable duplicate protection is the Airtable lookup (when Airtable is configured) and Resend's idempotency header (24 h). Add a Vercel Firewall rate-limit rule for a hard limit.
4. Attachments are checked by type and content, **not virus-scanned**. Treat them like any email attachment; CSV files can contain spreadsheet formulas.
5. Vercel limits a function request body to about 4.5 MB, hence the 4 MB cap.
