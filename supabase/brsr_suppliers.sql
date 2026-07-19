-- ESGEN value-chain supplier flow: a client invites suppliers by link; the
-- supplier submits emissions data WITHOUT an account (token-scoped RPCs);
-- submissions aggregate into the client's Scope 3.
-- Run in the Supabase SQL Editor after brsr_ops.sql.

-- ---------------------------------------------------------------------------
-- supplier_invites: one row per invited supplier per reporting year.
-- The token is the capability: whoever holds the link can view the invite
-- shell and submit once. No table access is granted to anon; all supplier
-- interaction goes through the two SECURITY DEFINER functions below.
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_invites (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  token          uuid not null unique default gen_random_uuid(),
  supplier_name  text not null,
  contact_email  text,
  financial_year text not null,
  message        text,
  status         text not null default 'invited',   -- invited | submitted | accepted | declined
  created_at     timestamptz not null default now(),
  submitted_at   timestamptz
);

create index if not exists supplier_invites_idx on public.supplier_invites (company_id);
create index if not exists supplier_invites_token_idx on public.supplier_invites (token);

alter table public.supplier_invites enable row level security;

drop policy if exists "supplier_invites_access" on public.supplier_invites;
create policy "supplier_invites_access" on public.supplier_invites for all
  using (exists (
    select 1 from public.companies c
    where c.id = supplier_invites.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.companies c
    where c.id = supplier_invites.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));

-- ---------------------------------------------------------------------------
-- supplier_submissions: what the supplier reported. payload is structured
-- JSONB: { period, scope1, scope2, scope3, energy_total_gj, renewable_pct,
--          allocation_basis, allocation_pct, method_note }
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_submissions (
  id           uuid primary key default gen_random_uuid(),
  invite_id    uuid not null references public.supplier_invites (id) on delete cascade,
  payload      jsonb not null,
  submitted_by text,
  created_at   timestamptz not null default now()
);

create index if not exists supplier_submissions_idx on public.supplier_submissions (invite_id);

alter table public.supplier_submissions enable row level security;

drop policy if exists "supplier_submissions_access" on public.supplier_submissions;
create policy "supplier_submissions_access" on public.supplier_submissions for all
  using (exists (
    select 1 from public.supplier_invites i join public.companies c on c.id = i.company_id
    where i.id = supplier_submissions.invite_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.supplier_invites i join public.companies c on c.id = i.company_id
    where i.id = supplier_submissions.invite_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));

-- ---------------------------------------------------------------------------
-- Token-scoped supplier RPCs (SECURITY DEFINER; safe to expose to anon).
-- ---------------------------------------------------------------------------

-- What the supplier sees when opening the link: who invited them, for which FY.
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
  where i.token = p_token;
$$;

-- The supplier's one-shot submission. Re-submitting replaces the payload while
-- the invite is not yet accepted by the client.
create or replace function public.esgen_supplier_submit(p_token uuid, p_payload jsonb, p_email text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.supplier_invites%rowtype;
begin
  select * into v_invite from public.supplier_invites where token = p_token;
  if not found then
    return json_build_object('ok', false, 'error', 'Invite not found.');
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

revoke all on function public.esgen_supplier_invite(uuid) from public;
revoke all on function public.esgen_supplier_submit(uuid, jsonb, text) from public;
grant execute on function public.esgen_supplier_invite(uuid) to anon, authenticated;
grant execute on function public.esgen_supplier_submit(uuid, jsonb, text) to anon, authenticated;
