-- ESGEN operator (admin) role, report release control, final-report locking,
-- and supplier-link expiry. Run in the Supabase SQL Editor after brsr_suppliers.sql.

-- ---------------------------------------------------------------------------
-- esgen_admins: emails of ESGEN staff. Admins can see every client workspace
-- (read), release reports, and edit even after release.
-- ---------------------------------------------------------------------------
create table if not exists public.esgen_admins (
  email      text primary key,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.esgen_admins enable row level security;

-- A signed-in user may check ONLY their own membership (for showing admin UI).
drop policy if exists "esgen_admins_self" on public.esgen_admins;
create policy "esgen_admins_self" on public.esgen_admins for select
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Seed the first operator. Add colleagues with:
--   insert into public.esgen_admins (email, note) values ('name@esgen.co.uk', 'role');
insert into public.esgen_admins (email, note)
values ('lalitrajora2001@gmail.com', 'owner')
on conflict (email) do nothing;

create or replace function public.esgen_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.esgen_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Admin read access across client data (additive SELECT policies), plus
-- report updates so an admin can release/lock reports.
-- ---------------------------------------------------------------------------
drop policy if exists "admin_read_companies" on public.companies;
create policy "admin_read_companies" on public.companies for select using (public.esgen_is_admin());

drop policy if exists "admin_read_reports" on public.brsr_reports;
create policy "admin_read_reports" on public.brsr_reports for select using (public.esgen_is_admin());

drop policy if exists "admin_update_reports" on public.brsr_reports;
create policy "admin_update_reports" on public.brsr_reports for update
  using (public.esgen_is_admin()) with check (public.esgen_is_admin());

drop policy if exists "admin_read_responses" on public.brsr_responses;
create policy "admin_read_responses" on public.brsr_responses for select using (public.esgen_is_admin());

drop policy if exists "admin_read_evidence" on public.brsr_evidence;
create policy "admin_read_evidence" on public.brsr_evidence for select using (public.esgen_is_admin());

drop policy if exists "admin_read_kpi_status" on public.brsr_kpi_status;
create policy "admin_read_kpi_status" on public.brsr_kpi_status for select using (public.esgen_is_admin());

drop policy if exists "admin_read_section_status" on public.brsr_section_status;
create policy "admin_read_section_status" on public.brsr_section_status for select using (public.esgen_is_admin());

drop policy if exists "admin_read_audit" on public.brsr_audit;
create policy "admin_read_audit" on public.brsr_audit for select using (public.esgen_is_admin());

drop policy if exists "admin_read_members" on public.company_members;
create policy "admin_read_members" on public.company_members for select using (public.esgen_is_admin());

drop policy if exists "admin_read_supplier_invites" on public.supplier_invites;
create policy "admin_read_supplier_invites" on public.supplier_invites for select using (public.esgen_is_admin());

drop policy if exists "admin_read_supplier_submissions" on public.supplier_submissions;
create policy "admin_read_supplier_submissions" on public.supplier_submissions for select using (public.esgen_is_admin());

-- ---------------------------------------------------------------------------
-- Integrity: only admins may set or clear status 'final'; once a report is
-- final, its data is read-only for everyone except admins.
-- ---------------------------------------------------------------------------
create or replace function public.esgen_guard_report_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.status is distinct from old.status)
     and (new.status = 'final' or old.status = 'final')
     and not public.esgen_is_admin() then
    raise exception 'Only ESGEN can release or reopen a final report.';
  end if;
  return new;
end;
$$;

drop trigger if exists esgen_guard_report_status on public.brsr_reports;
create trigger esgen_guard_report_status
  before update on public.brsr_reports
  for each row execute function public.esgen_guard_report_status();

create or replace function public.esgen_block_final_writes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_report_id uuid;
  v_status text;
begin
  v_report_id := coalesce(new.report_id, old.report_id);
  select status into v_status from public.brsr_reports where id = v_report_id;
  if v_status = 'final' and not public.esgen_is_admin() then
    raise exception 'This report has been released and is locked. Contact ESGEN to reopen it.';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists esgen_lock_final_responses on public.brsr_responses;
create trigger esgen_lock_final_responses
  before insert or update or delete on public.brsr_responses
  for each row execute function public.esgen_block_final_writes();

drop trigger if exists esgen_lock_final_evidence on public.brsr_evidence;
create trigger esgen_lock_final_evidence
  before insert or update or delete on public.brsr_evidence
  for each row execute function public.esgen_block_final_writes();

drop trigger if exists esgen_lock_final_kpi_status on public.brsr_kpi_status;
create trigger esgen_lock_final_kpi_status
  before insert or update or delete on public.brsr_kpi_status
  for each row execute function public.esgen_block_final_writes();

-- ---------------------------------------------------------------------------
-- Supplier invite links now expire 90 days after creation (re-invite to renew).
-- Replaces the RPCs from brsr_suppliers.sql.
-- ---------------------------------------------------------------------------
create or replace function public.esgen_supplier_invite(p_token uuid)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'supplier_name', i.supplier_name,
    'client_name',   c.name,
    'financial_year', i.financial_year,
    'message',       i.message,
    'status',        i.status
  )
  from public.supplier_invites i
  join public.companies c on c.id = i.company_id
  where i.token = p_token
    and i.created_at > now() - interval '90 days';
$$;

create or replace function public.esgen_supplier_submit(p_token uuid, p_payload jsonb, p_email text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.supplier_invites%rowtype;
begin
  select * into v_invite from public.supplier_invites
  where token = p_token and created_at > now() - interval '90 days';
  if not found then
    return json_build_object('ok', false, 'error', 'Invite not found or expired.');
  end if;
  if v_invite.status = 'accepted' then
    return json_build_object('ok', false, 'error', 'This submission has already been accepted and is locked.');
  end if;

  delete from public.supplier_submissions where invite_id = v_invite.id;
  insert into public.supplier_submissions (invite_id, payload, submitted_by)
  values (v_invite.id, p_payload, p_email);

  update public.supplier_invites
  set status = 'submitted', submitted_at = now()
  where id = v_invite.id;

  return json_build_object('ok', true);
end;
$$;
