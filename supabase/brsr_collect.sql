-- ESGEN BRSR Collect: organisation-profile fields + per-KPI status state machine.
-- Run in the Supabase SQL Editor after brsr_pro.sql.

-- ---------------------------------------------------------------------------
-- Extend the organisation profile (companies) with BRSR Collect fields.
-- ---------------------------------------------------------------------------
alter table public.companies add column if not exists size_band        text;   -- Micro / Small / Medium / Large
alter table public.companies add column if not exists is_listed        boolean;
alter table public.companies add column if not exists value_chain_role text;    -- self / upstream_partner / downstream_partner
alter table public.companies add column if not exists country          text default 'India';
alter table public.companies add column if not exists cin              text;    -- Corporate Identity Number
alter table public.companies add column if not exists contact_email    text;

-- ---------------------------------------------------------------------------
-- brsr_kpi_status: per-KPI ownership + status (the state machine) per report.
-- Statuses: not_started | in_progress | data_entered | evidence_attached |
--           validated | assurance_ready | needs_changes | not_applicable
-- ---------------------------------------------------------------------------
create table if not exists public.brsr_kpi_status (
  id             uuid primary key default gen_random_uuid(),
  report_id      uuid not null references public.brsr_reports (id) on delete cascade,
  question_key   text not null,
  status         text not null default 'not_started',
  assignee_email text,
  validated_by   text,
  validated_at   timestamptz,
  note           text,
  updated_at     timestamptz not null default now(),
  unique (report_id, question_key)
);

create index if not exists brsr_kpi_status_idx on public.brsr_kpi_status (report_id, question_key);

alter table public.brsr_kpi_status enable row level security;

drop policy if exists "brsr_kpi_status_access" on public.brsr_kpi_status;
create policy "brsr_kpi_status_access" on public.brsr_kpi_status for all
  using (exists (
    select 1 from public.brsr_reports r join public.companies c on c.id = r.company_id
    where r.id = brsr_kpi_status.report_id and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.brsr_reports r join public.companies c on c.id = r.company_id
    where r.id = brsr_kpi_status.report_id and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));
