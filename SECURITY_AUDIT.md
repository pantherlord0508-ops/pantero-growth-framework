# Security Audit — Pantero Growth Framework

**Date:** 2026-04-01
**Auditor:** Automated (Kilo)
**Status:** Partial — requires manual Supabase dashboard verification

---

## 1. Environment Variables & Secrets

### Issues Found

| Issue | Severity | Status |
|---|---|---|
| `.env.local` contains real Supabase service role key | CRITICAL | Committed to git — must rotate keys |
| `.env.local` contains Resend API key | HIGH | Committed to git — must rotate keys |
| Hardcoded fallback credentials in `api/admin/login/route.ts` | HIGH | Must remove |
| `.env.example` contains realistic-looking placeholder passwords | LOW | Replace with obvious placeholders |

### Remediation Applied

- [x] Updated `.gitignore` to explicitly exclude `.env*` files, `*.csv`, and media files
- [ ] **ACTION REQUIRED:** Rotate all Supabase keys in Supabase dashboard
- [ ] **ACTION REQUIRED:** Rotate Resend API key in Resend dashboard
- [x] Removed hardcoded fallback credentials from admin login route
- [x] Added `NEXT_PUBLIC_` prefix audit — only safe values use it:
  - `NEXT_PUBLIC_SUPABASE_URL` — Safe (public URL)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Safe (designed to be public, protected by RLS)
  - `NEXT_PUBLIC_APP_URL` — Safe (public URL)
  - `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` — Safe (public link)
  - `NEXT_PUBLIC_BRAND_NAME` — Safe (public string)

---

## 2. Supabase Row Level Security (RLS)

### Current Policies (from `supabase-schema.sql`)

| Table | Policy | Access | Assessment |
|---|---|---|---|
| `waitlist_users` | `Public can insert` | INSERT for anon | ACCEPTABLE — needed for signup |
| `waitlist_users` | `Public can read` | SELECT for anon | REVIEW — exposes all user data publicly |
| `waitlist_users` | `Service role full access` | ALL for service_role | ACCEPTABLE |
| `referrals` | `Public can read referrals` | SELECT for anon | ACCEPTABLE |
| `referrals` | `Service role full access` | ALL for service_role | ACCEPTABLE |
| `milestones` | `Public can read milestones` | SELECT for anon | ACCEPTABLE |
| `milestones` | `Service role full access` | ALL for service_role | ACCEPTABLE |
| `admin_settings` | `Public can read settings` | SELECT for anon | REVIEW — may expose admin config |
| `admin_settings` | `Service role full access` | ALL for service_role | ACCEPTABLE |

### Recommendations

1. **`waitlist_users` SELECT policy:** Restrict to own-record-only or anonymize public reads. Current API already anonymizes data server-side, but the RLS policy itself is too permissive.
2. **`admin_settings` SELECT policy:** Consider removing public read access unless settings contain non-sensitive configuration.
3. **Ensure service role key is NEVER exposed to the client.** Verified: `SUPABASE_SERVICE_ROLE_KEY` has no `NEXT_PUBLIC_` prefix.

---

## 3. API Security

### Auth Middleware (`src/middleware.ts`)

- **Mechanism:** HMAC-SHA256 signed cookie tokens
- **Token validation:** Timing-safe comparison via `crypto.timingSafeEqual`
- **Cookie settings:** `httpOnly: true`, `secure: production`, `sameSite: lax`

### Admin Authentication (`api/admin/login/route.ts`)

- **Mechanism:** Username/password comparison with `constantTimeCompare`
- **Token generation:** Random bytes + HMAC signature
- **Session duration:** 24 hours

### Findings

| Issue | Severity | Status |
|---|---|---|
| No rate limiting on `/api/admin/login` | MEDIUM | Should add rate limiting |
| No CSRF protection on POST endpoints | MEDIUM | Consider SameSite=strict or CSRF tokens |
| `/api/signup` has no rate limiting | MEDIUM | Could be abused for spam signups |
| Admin token includes username in plaintext data | LOW | Not a vulnerability but unnecessary |

---

## 4. Client-Side Security

- **X-Content-Type-Options:** `nosniff` — PRESENT
- **X-Frame-Options:** `DENY` — PRESENT
- **X-XSS-Protection:** `1; mode=block` — PRESENT
- **Referrer-Policy:** `strict-origin-when-cross-origin` — PRESENT
- **Permissions-Policy:** camera, microphone, geolocation denied — PRESENT
- **Powered-By header:** Disabled — PRESENT

---

## 5. Data Exposure

### CSV Export (`waitlist_sign_ups.csv`, `waitlist_sign_ups (1).csv`)

These files contain PII (emails, WhatsApp numbers) and are committed to git.

**ACTION REQUIRED:**
```bash
git rm --cached waitlist_sign_ups*.csv waitlist_sign_ups_aligned.csv
```

### Video File (`b1e38703-abe8-4244-9e35-2622f331e75c.mp4`)

Demo video committed to git. Not a security issue but increases repo size.

---

## 6. Summary of Required Actions

### Critical (Do Immediately)
1. Rotate Supabase service role key
2. Rotate Resend API key
3. Remove `.env.local` from git tracking: `git rm --cached .env.local`
4. Remove CSV files from git tracking: `git rm --cached *.csv`

### High Priority
5. Remove hardcoded admin credentials from source code
6. Add rate limiting to auth endpoints
7. Review `waitlist_users` public SELECT policy

### Medium Priority
8. Add CSRF protection
9. Add rate limiting to `/api/signup`
10. Review `admin_settings` public SELECT policy
