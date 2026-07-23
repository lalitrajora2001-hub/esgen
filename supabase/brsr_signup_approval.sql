-- ESGEN signup approval gate: every new external sign-up starts 'pending' and
-- cannot use the workspace until ESGEN staff approve them. Existing users at
-- the time this runs are grandfathered in as 'approved' so nobody currently
-- using the tool is locked out. ESGEN staff (esgen_admins) always bypass this
-- gate regardless of their row here. Run after brsr_admin.sql.

create table if not exists public.user_approvals (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  decided_by   text,
  decided_at   timestamptz,
  note         text
);

alter table public.user_approvals enable row level security;

-- A signed-in user may read only their own row (to check their own status).
drop policy if exists "user_approvals_self_read" on public.user_approvals;
create policy "user_approvals_self_read" on public.user_approvals for select
  using (user_id = auth.uid());

-- ESGEN staff can see and decide on every row.
drop policy if exists "user_approvals_admin_all" on public.user_approvals;
create policy "user_approvals_admin_all" on public.user_approvals for all
  using (public.esgen_is_admin()) with check (public.esgen_is_admin());

-- Auto-create a pending row for every new sign-up.
create or replace function public.esgen_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_approvals (user_id, email, status)
  values (new.id, new.email, 'pending')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.esgen_handle_new_user();

-- Grandfather everyone who already has an account before this migration ran.
insert into public.user_approvals (user_id, email, status, decided_by, decided_at, note)
select id, email, 'approved', 'migration', now(), 'Grandfathered: existing account when the approval gate was introduced'
from auth.users
on conflict (user_id) do nothing;
