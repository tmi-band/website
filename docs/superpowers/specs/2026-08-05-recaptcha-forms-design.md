# reCAPTCHA on the Subscription and Contact Forms

**Date:** 2026-08-05
**Status:** Approved, ready for planning

## Problem

The band is receiving spam mailing-list subscriptions.

## Background: what exists today

| Form | Live site (`master`, deployed to S3) | Redesign (`main`, current `HEAD`) |
|---|---|---|
| Mailing list | Mailchimp classic embed, POSTing directly to `tmi-band-tucson.us18.list-manage.com/subscribe/post` | `index.html:239-244` — form exists; `script.js:158-175` is a no-op placeholder that submits nowhere |
| Contact | jQuery → API Gateway `/production/contact` | `script.js:114-156` → same endpoint |

The spam arrives through the Mailchimp embed on the live site.

### The constraint that shapes everything

reCAPTCHA is two-sided. The widget mints a token; something server-side must POST that
token to Google with the *secret* key and reject the submission when verification fails.
A widget with no verifier behind it is decorative — a bot POSTing straight to the endpoint
never loads the page.

This lands differently on the two forms:

- **Mailing list.** Mailchimp's classic embed URL cannot be made to check a token; it
  ignores unknown fields. Adding a widget to that form would do nothing at all. The
  subscription path itself has to change.
- **Contact.** The endpoint is our own Lambda, so verification can go there.

### Backend facts established by inspection

- Lambda `send-contact-email`, 43 lines, runtime **`nodejs14.x`**, last modified 2022-03-05.
- API Gateway `cpsb1m4cnk` (`tmi-band-contact`), resource `/contact` (id `hxlfog`), method POST.
- Integration is `type: AWS` (non-proxy) with **no request templates** and
  `passthroughBehavior: WHEN_NO_MATCH`. The raw JSON body arrives as the Lambda `event`
  verbatim, so a new field appears as `event.recaptchaToken` with **no API Gateway change**.
- Only a default `200` integration response exists, with **no error selection pattern**.
  A thrown Lambda error would surface as HTTP 200 regardless.
- Integration response sets `Access-Control-Allow-Origin: '*'`, so CORS survives the move
  off S3. The `'tmi-band.net'` value hardcoded at `index.js:9` sits on an unused `response`
  object and never reaches the wire.
- Execution role grants `ses:SendEmail` + CloudWatch Logs only — **no SSM or Secrets
  Manager access**. The reCAPTCHA secret therefore goes in a Lambda environment variable,
  which needs no IAM change.
- Function is **non-VPC**, so the outbound HTTPS call to Google works with no networking
  changes.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Mailing list path | Mailchimp's **hosted** signup form | Mailchimp offers built-in reCAPTCHA on hosted forms; requires no backend of ours |
| reCAPTCHA flavor | **v2 checkbox** | Visible and self-explanatory; a challenged human can always complete it. No score threshold to tune blind, and no silent rejection of a booking inquiry |
| Lambda source | Brought **into this repo** under `lambda/` | Verification must be implemented, so the source needs to be version-controlled |
| Runtime | Upgrade **nodejs14.x → nodejs22.x** | 14.x is years past EOL and AWS blocks code updates on deprecated runtimes; the port is small at 43 lines |
| Secret storage | Lambda **environment variable** `RECAPTCHA_SECRET` | Role has no SSM access; an env var avoids an IAM change and is encrypted at rest |
| Site deployment | Out of scope — moving to **DigitalOcean** | |
| Lambda deployment | New **`publish-lambda`** script | `publish-website` was deleted in the redesign and is not coming back |

## Design

### 1. Mailing list — link out to Mailchimp's hosted form

Remove the inline form (`index.html:239-244`), its dead handler (`script.js:158-175`), the
`#ml-success` element (`index.html:244`), and the now-unused `.mailing-list-form` CSS rules
(`style.css:591-615`). `.mailing-list-section` and `.form-success` stay — the latter is still
used by the contact form.

The section keeps its heading and subtitle; the Subscribe control becomes a link:

```html
<a href="https://tmi-band-tucson.us18.list-manage.com/subscribe?u=e3d5f089e937d695af2af32b6&amp;id=d41aa5c4d0"
   class="btn btn-primary" target="_blank" rel="noopener">Subscribe</a>
```

That URL is the `master` embed's action URL with `/post` removed — the hosted-page form for
the same list. It is **derived, not read from the Mailchimp account**, and must be confirmed
to load before this ships.

The reCAPTCHA here is a Mailchimp account setting, not code (Audience → Signup forms → Form
builder). **Nothing in this repo enforces it.** The site change alone does not stop the spam
until that setting is enabled.

### 2. Contact form — frontend

In `index.html`:

```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

and, inside the contact form above the submit button:

```html
<div class="form-group">
  <div class="g-recaptcha" data-sitekey="RECAPTCHA_SITE_KEY_PLACEHOLDER"></div>
</div>
```

The site key is public by design and belongs in the HTML in git. Until the real key exists,
the literal string `RECAPTCHA_SITE_KEY_PLACEHOLDER` is committed so it is greppable and
obviously not a real key.

In `script.js`, the submit handler at line 114 gains four changes:

1. **Token check** alongside the existing name/email/phone validation. Guard against the
   Google script failing to load, which would otherwise throw a `ReferenceError`:

   ```js
   if (typeof grecaptcha === 'undefined') {
     alert('The captcha failed to load. Please refresh and try again.');
     return;
   }
   const token = grecaptcha.getResponse();
   if (!token) {
     alert("Please confirm you're not a robot.");
     return;
   }
   ```

2. **`recaptchaToken: token`** added to the POST body.

3. **`grecaptcha.reset()` after every attempt**, success or failure. Tokens are single-use;
   without this a second submit silently reuses a spent token and is rejected.

4. **Inspect the response.** Line 146 currently shows "Message sent!" unconditionally — a
   rejected captcha would read as success, which would make the entire change meaningless:

   ```js
   .then(res => res.json())
   .then(result => {
     grecaptcha.reset();
     if (result && result.result === 'success') {
       // existing success path
     } else if (result && result.reason === 'captcha') {
       alert('Captcha verification failed. Please try again.');
     } else {
       alert('There was a problem sending your message. Please try again.');
     }
   })
   ```

   The current code never parses the response, so the exact body shape reaching the browser
   is unverified. Implementation must confirm it with a real call against the deployed
   endpoint before relying on `res.json()`.

### 3. Contact form — Lambda

`lambda/send-contact-email/index.js`, rewritten for nodejs22.x:

- `AWS.SES` (aws-sdk v2) → `@aws-sdk/client-ses`, provided by the runtime, not bundled.
- Legacy `context.done` callback → `async` handler.
- Verify the token against `https://www.google.com/recaptcha/api/siteverify` using built-in
  `fetch`, form-encoded with `secret` and `response`.
- **Send no email unless verification returns `success: true`.**
- **Fail closed:** if `RECAPTCHA_SECRET` is unset, log an error and reject. An unset secret
  must never degrade into an open endpoint.
- Log Google's `error-codes` on rejection, for diagnosing a misconfigured key.
- Add minimal server-side validation. There is none today, so the endpoint will currently
  email empty junk. This is deliberately *more permissive* than the client rules — its job
  is rejecting empty and malformed bot payloads, not re-implementing form UX. Require: name
  present and ≥2 characters, email matching `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, at least 10
  digits somewhere in phone, message non-empty. Truncate each field to a sane maximum
  (2000 characters, 5000 for the message) so a bot cannot mail itself a novel.
- Timeout 3s → 10s to cover the extra hop to Google.

Sender and receiver stay `sonoran.sarah@gmail.com`.

### 4. How rejection reaches the browser

Because the integration has one default `200` response and no error selection pattern, a
thrown Lambda error would surface as HTTP 200 anyway. Rather than reconfigure API Gateway on
a live shared stage, the Lambda returns a normal JSON result and the frontend reads it:

```json
{ "result": "success" }
{ "result": "error", "reason": "captcha" }
{ "result": "error", "reason": "validation" }
```

**This design requires zero API Gateway changes.** The pass-through integration carries the
new request field in and the new response body out unmodified.

### 5. Repo layout and deployment

```
website/
  index.html  script.js  style.css  img/
  lambda/send-contact-email/
    index.js
    README.md          ← one-time setup commands, env var docs
  publish-lambda       ← zip + update-function-code
  docs/superpowers/specs/
```

```bash
#!/bin/bash
set -e
cd "$(dirname "$0")/lambda/send-contact-email"
rm -f /tmp/send-contact-email.zip          # zip updates in place; a stale archive
zip -q /tmp/send-contact-email.zip index.js # would carry deleted files forward
aws lambda update-function-code \
  --function-name send-contact-email \
  --region us-west-2 \
  --zip-file fileb:///tmp/send-contact-email.zip
```

Committed with the executable bit set (`chmod +x`), matching how `publish-website` was used.

`publish-lambda` updates **code only**. The runtime change, the timeout change, and the
`RECAPTCHA_SECRET` variable are one-time `update-function-configuration` steps, documented
in `lambda/send-contact-email/README.md` rather than run on every deploy.

Site deployment is DigitalOcean's concern and leaves this repo. `CLAUDE.md` is updated to
match: single-page site, DigitalOcean hosting, `lambda/` directory, `publish-lambda`, and
removal of the stale `publish-website` reference.

### 6. Verification

No test framework exists here, and this change does not justify introducing one. Verification
is manual and specific:

1. **Widget renders** — serve locally (`python3 -m http.server`), confirm the checkbox
   appears on the contact form.
2. **Client blocks unticked submits** — submit without ticking; expect the alert and no
   network request.
3. **Lambda rejects a bad token** — `aws lambda invoke` with a payload carrying a bogus
   `recaptchaToken`; expect `{"result":"error","reason":"captcha"}` and **no email**.
4. **Happy path** — submit the real form after deploy; confirm the email arrives.
5. **The decisive test** — `curl` the endpoint directly with no token at all:

   ```bash
   curl -s -X POST https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/contact \
     -H 'Content-Type: application/json' \
     -d '{"name":"bot","phone":"5205551234","email":"bot@example.com","desc":"spam"}'
   ```

   Expect `{"result":"error","reason":"captcha"}` and no email. This is the actual spam
   path; it is what distinguishes a working fix from one that merely looks like protection.

6. **Mailing list** — confirm the Subscribe link loads the hosted form and that the
   reCAPTCHA appears on it.

## Prerequisites (owner actions, outside this repo)

1. Create reCAPTCHA **v2 checkbox** keys at `google.com/recaptcha/admin`, registered for
   **`tmi-band.net`, the DigitalOcean app hostname, and `localhost`**. A v2 site key is
   domain-locked: testing on an unregistered `*.ondigitalocean.app` URL renders
   "ERROR for site owner: Invalid domain for site key".
2. Set `RECAPTCHA_SECRET` on the `send-contact-email` Lambda.
3. Enable reCAPTCHA on the Mailchimp hosted form.
4. Confirm the hosted form URL in §1 loads.

The **site key** (public) is needed before the frontend is complete. The **secret key** never
enters git.

## Out of scope

- **Migrating the site to DigitalOcean.** Separate work.
- **How DigitalOcean serves the repo.** If DO App Platform builds a static site from the repo
  root, `lambda/` and `docs/` become web-reachable. Nothing secret is at risk — the reCAPTCHA
  secret is a Lambda environment variable and never enters git — so this is tidiness, not
  exposure. Deferred until the DO setup is known.
- **The `songs` and `events` endpoints.** Read-only GETs, not a spam vector.
- **Retrofitting the live `master` site.** The redesign on `main` supersedes it.
- **The client-side phone regex.** `/[0-9]{10}/` requires ten *consecutive* digits, so
  `520-555-1234` is rejected today. Pre-existing, unrelated to spam, left alone deliberately.
