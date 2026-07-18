-- ESGen tool — BRSR module schema
-- Run this in Supabase (SQL Editor) after schema.sql. Adds the BRSR reporting
-- tables, an evidence storage bucket, and Row Level Security so a user can only
-- ever touch data belonging to a company they own.
--
-- Storage model: the BRSR framework itself lives in application code
-- (src/lib/brsr/framework/*). The database stores, per company report, one JSONB
-- answer per question plus uploaded evidence metadata. This survives SEBI
-- amendments without destructive migrations.

-- ---------------------------------------------------------------------------
-- brsr_reports: one BRSR report per company per financial year.
-- ---------------------------------------------------------------------------
create table if not exists public.brsr_reports (
  id                 uuid primary key default gen_random_uuid(),
  company_id         uuid not null references public.companies (id) on delete cascade,
  financial_year     text not null,               -- e.g. "2024-25"
  framework_version  text not null default 'BRSR-2024',
  reporting_boundary text not null default 'Standalone', -- Standalone | Consolidated
  turnover           numeric,                      -- revenue from operations (INR), denominator for intensity KPIs
  ppp_factor         numeric,                      -- USD/INR PPP factor for intensity KPIs
  status             text not null default 'draft',-- draft | in_review | final
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists brsr_reports_company_idx on public.brsr_reports (company_id);

alter table public.brsr_reports enable row level security;

drop policy if exists "brsr_reports_all_own" on public.brsr_reports;
create policy "brsr_reports_all_own" on public.brsr_reports
  for all using (
    exists (select 1 from public.companies c where c.id = brsr_reports.company_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.companies c where c.id = brsr_reports.company_id and c.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- brsr_responses: one JSONB answer per (report, question).
-- ---------------------------------------------------------------------------
create table if not exists public.brsr_responses (
  id           uuid primary key default gen_random_uuid(),
  report_id    uuid not null references public.brsr_reports (id) on delete cascade,
  question_key text not null,
  value        jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  unique (report_id, question_key)
);

create index if not exists brsr_responses_report_idx on public.brsr_responses (report_id);

alter table public.brsr_responses enable row level security;

-- Access allowed only when the response's report is owned by the current user.
drop policy if exists "brsr_responses_all_own" on public.brsr_responses;
create policy "brsr_responses_all_own" on public.brsr_responses
  for all using (
    exists (
      select 1 from public.brsr_reports r
      join public.companies c on c.id = r.company_id
      where r.id = brsr_responses.report_id and c.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.brsr_reports r
      join public.companies c on c.id = r.company_id
      where r.id = brsr_responses.report_id and c.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- brsr_evidence: metadata for uploaded supporting documents.
-- ---------------------------------------------------------------------------
create table if not exists public.brsr_evidence (
  id           uuid primary key default gen_random_uuid(),
  report_id    uuid not null references public.brsr_reports (id) on delete cascade,
  question_key text not null,
  file_path    text not null,   -- path within the storage bucket
  file_name    text not null,
  size         bigint,
  created_at   timestamptz not null default now()
);

create index if not exists brsr_evidence_report_idx on public.brsr_evidence (report_id, question_key);

alter table public.brsr_evidence enable row level security;

drop policy if exists "brsr_evidence_all_own" on public.brsr_evidence;
create policy "brsr_evidence_all_own" on public.brsr_evidence
  for all using (
    exists (
      select 1 from public.brsr_reports r
      join public.companies c on c.id = r.company_id
      where r.id = brsr_evidence.report_id and c.owner_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.brsr_reports r
      join public.companies c on c.id = r.company_id
      where r.id = brsr_evidence.report_id and c.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Storage bucket for evidence files. Files are stored under a path beginning
-- with the report id: "<report_id>/<question_key>/<filename>". RLS below ties
-- each object back to the owning company.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('brsr-evidence', 'brsr-evidence', false)
on conflict (id) do nothing;

-- The object path is "<report_id>/<question_key>/<filename>"; split_part gives
-- the report id unambiguously. Scoped to authenticated users.
drop policy if exists "brsr_evidence_objects_own" on storage.objects;
create policy "brsr_evidence_objects_own" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'brsr-evidence'
    and exists (
      select 1 from public.brsr_reports r
      join public.companies c on c.id = r.company_id
      where r.id = split_part(storage.objects.name, '/', 1)::uuid and c.owner_id = auth.uid()
    )
  ) with check (
    bucket_id = 'brsr-evidence'
    and exists (
      select 1 from public.brsr_reports r
      join public.companies c on c.id = r.company_id
      where r.id = split_part(storage.objects.name, '/', 1)::uuid and c.owner_id = auth.uid()
    )
  );
