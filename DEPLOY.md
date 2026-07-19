# Deploying esgen.co.uk (site + BRSR tool)

The whole site — marketing pages **and** the BRSR tool at `/app` — is one Next.js
project (`output: "export"`, a static build). It's hosted on **Hostinger**, which
**auto-builds from the GitHub repo** (`github.com/lalitrajora2001-hub/esgen`,
branch `main`) on every push. The repo holds **source only**; Hostinger runs the
build and serves the result.

The Supabase connection is baked in at build time from **`.env.production`**
(committed on purpose — it holds only the **public** `NEXT_PUBLIC_SUPABASE_*`
values; the anon key is safe to expose, Row Level Security protects the data).
Never commit the service_role / secret key or `.env.local`.

---

## Redeploy a change (the normal flow)

1. Make the change and confirm it builds locally:
   ```bash
   npm run build          # must be 48/48 (or current route count), exit 0
   ```
2. Commit and push to `main`:
   ```bash
   git add -A
   git commit -m "…what changed…"
   git push origin main
   ```
3. Hostinger rebuilds automatically (~1–2 min).
4. Verify (see below).

## Verify after every deploy

1. **Marketing up:** open https://esgen.co.uk — homepage loads.
2. **New build live:** the header **"Sign in"** links to `/app/login/`
   (confirms the latest build deployed, not a cached old one).
3. **Tool up + Supabase connected:** open https://esgen.co.uk/app/login — it must
   show the **real sign-in form**, NOT a "Connect your backend / Explore the demo"
   screen. The gate means the build didn't get the `NEXT_PUBLIC_SUPABASE_*` vars.
4. **Smoke test (optional):** sign in → onboarding/dashboard → enter a Scope value
   in Collect → Dashboard shows the number → clear it.

## Rollback

```bash
git revert HEAD --no-edit
git push origin main        # Hostinger redeploys the previous state (~1–2 min)
```

---

## Supabase migrations (run once, in order, when a feature needs them)

These live in `supabase/` and are run in the **Supabase SQL Editor**. They are
already applied to the current project; only re-run on a fresh project or when a
new one is added:

1. `schema.sql`        — companies, activity_entries + RLS
2. `brsr.sql`          — brsr_reports, brsr_responses, brsr_evidence + storage bucket + RLS
3. `brsr_pro.sql`      — company_members, brsr_section_status, brsr_audit + member RLS
4. `brsr_collect.sql`  — company profile columns + brsr_kpi_status
5. `brsr_export.sql`   — brsr_flatten() + brsr_export_view (data extraction)

Also in Supabase Auth: **"Confirm email" is OFF** (self-serve signup logs in
immediately). Turn on if you want email verification.

---

## Manual fallback (if the Git build ever fails or isn't building)

Hostinger serves static files, so you can deploy a pre-built bundle by hand:

1. Build locally (bakes in `.env.production`):
   ```bash
   npm run build          # produces the out/ folder
   ```
2. Zip the **contents** of `out/` and upload to Hostinger **File Manager →
   `public_html`**, then extract (replacing the current files).

`out/` and `esgen-site.zip` are gitignored — they are build artifacts, not source.

---

## Data extraction (for the operator)

- **In the tool:** Data & export → "Export all data (CSV)" (labelled rows).
- **In Supabase:** SQL Editor → `select * from brsr_export_view;` → download CSV.
- **Evidence files:** Supabase Storage → `brsr-evidence` bucket; map files to
  companies with a join on `brsr_evidence` → `brsr_reports` → `companies`.
