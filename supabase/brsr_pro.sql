-- ESGen BRSR "pro" features: team members (multi-user), section review workflow,
-- and a per-field audit trail. Run in the Supabase SQL Editor after brsr.sql.
--
-- All member policies are ADDITIVE (OR'd with the existing owner policies), so
-- the company owner never loses access. A teammate invited by email gains
-- access once they sign in with that email and their membership row is linked.

-- ---------------------------------------------------------------------------
-- company_members: people invited to collaborate on a company's reports.
-- (Created before the helper function, which references it.)
-- ---------------------------------------------------------------------------
create table if not exists public.company_members (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  email      text not null,
  user_id    uuid references auth.users (id) on delete set null,
  role       text not null default 'editor', -- editor | reviewer
  created_at timestamptz not null default now(),
  unique (company_id, email)
);

-- Helper: is the current user a linked member of this company?
-- SECURITY DEFINER so it can read company_members without triggering that
-- table's RLS (avoids recursion when referenced from other tables' policies).
create or replace function public.esgen_is_company_member(cid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.company_members m
    where m.company_id = cid and m.user_id = auth.uid()
  );
$$;

alter table public.company_members enable row level security;

-- Owner manages the member list for companies they own.
drop policy if exists "members_owner_all" on public.company_members;
create policy "members_owner_all" on public.company_members for all
  using (exists (select 1 from public.companies c where c.id = company_members.company_id and c.owner_id = auth.uid()))
  with check (exists (select 1 from public.companies c where c.id = company_members.company_id and c.owner_id = auth.uid()));

-- A user can see their own membership rows (by matching email or already-linked).
drop policy if exists "members_self_select" on public.company_members;
create policy "members_self_select" on public.company_members for select
  using (lower(email) = lower(auth.jwt() ->> 'email') or user_id = auth.uid());

-- A user can claim (link) their own membership row by email.
drop policy if exists "members_self_claim" on public.company_members;
create policy "members_self_claim" on public.company_members for update
  using (lower(email) = lower(auth.jwt() ->> 'email'))
  with check (lower(email) = lower(auth.jwt() ->> 'email'));

-- ---------------------------------------------------------------------------
-- Additive member access to companies + BRSR data.
-- ---------------------------------------------------------------------------
drop policy if exists "companies_member_select" on public.companies;
create policy "companies_member_select" on public.companies for select
  using (public.esgen_is_company_member(id));

drop policy if exists "brsr_reports_member" on public.brsr_reports;
create policy "brsr_reports_member" on public.brsr_reports for all
  using (public.esgen_is_company_member(company_id))
  with check (public.esgen_is_company_member(company_id));

drop policy if exists "brsr_responses_member" on public.brsr_responses;
create policy "brsr_responses_member" on public.brsr_responses for all
  using (exists (select 1 from public.brsr_reports r where r.id = brsr_responses.report_id and public.esgen_is_company_member(r.company_id)))
  with check (exists (select 1 from public.brsr_reports r where r.id = brsr_responses.report_id and public.esgen_is_company_member(r.company_id)));

drop policy if exists "brsr_evidence_member" on public.brsr_evidence;
create policy "brsr_evidence_member" on public.brsr_evidence for all
  using (exists (select 1 from public.brsr_reports r where r.id = brsr_evidence.report_id and public.esgen_is_company_member(r.company_id)))
  with check (exists (select 1 from public.brsr_reports r where r.id = brsr_evidence.report_id and public.esgen_is_company_member(r.company_id)));

drop policy if exists "brsr_evidence_objects_member" on storage.objects;
create policy "brsr_evidence_objects_member" on storage.objects for all to authenticated
  using (
    bucket_id = 'brsr-evidence'
    and exists (select 1 from public.brsr_reports r where r.id = split_part(storage.objects.name, '/', 1)::uuid and public.esgen_is_company_member(r.company_id))
  )
  with check (
    bucket_id = 'brsr-evidence'
    and exists (select 1 from public.brsr_reports r where r.id = split_part(storage.objects.name, '/', 1)::uuid and public.esgen_is_company_member(r.company_id))
  );

-- ---------------------------------------------------------------------------
-- brsr_section_status: review workflow state per module (section / principle).
-- ---------------------------------------------------------------------------
create table if not exists public.brsr_section_status (
  id               uuid primary key default gen_random_uuid(),
  report_id        uuid not null references public.brsr_reports (id) on delete cascade,
  module_key       text not null,
  assignee_email   text,
  state            text not null default 'not_started', -- not_started | in_progress | submitted | approved | needs_changes
  reviewer_comment text,
  updated_at       timestamptz not null default now(),
  unique (report_id, module_key)
);

alter table public.brsr_section_status enable row level security;

drop policy if exists "brsr_section_status_access" on public.brsr_section_status;
create policy "brsr_section_status_access" on public.brsr_section_status for all
  using (exists (
    select 1 from public.brsr_reports r join public.companies c on c.id = r.company_id
    where r.id = brsr_section_status.report_id and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.brsr_reports r join public.companies c on c.id = r.company_id
    where r.id = brsr_section_status.report_id and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));

-- ---------------------------------------------------------------------------
-- brsr_audit: append-only change log, one row per saved answer.
-- ---------------------------------------------------------------------------
create table if not exists public.brsr_audit (
  id           uuid primary key default gen_random_uuid(),
  report_id    uuid not null references public.brsr_reports (id) on delete cascade,
  question_key text not null,
  actor_email  text,
  value        jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists brsr_audit_idx on public.brsr_audit (report_id, question_key, created_at desc);

alter table public.brsr_audit enable row level security;

-- Insert allowed for owner/members; the log is append-only (no update/delete policy).
drop policy if exists "brsr_audit_insert" on public.brsr_audit;
create policy "brsr_audit_insert" on public.brsr_audit for insert
  with check (exists (
    select 1 from public.brsr_reports r join public.companies c on c.id = r.company_id
    where r.id = brsr_audit.report_id and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));

drop policy if exists "brsr_audit_select" on public.brsr_audit;
create policy "brsr_audit_select" on public.brsr_audit for select
  using (exists (
    select 1 from public.brsr_reports r join public.companies c on c.id = r.company_id
    where r.id = brsr_audit.report_id and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));
