-- ESGen tool schema
-- Run this once in your Supabase project: SQL Editor > New query > paste > Run.
--
-- Emission factors live in application code (src/lib/emissions/factors.ts), so
-- the database only stores each workspace's company profile and its activity
-- data. Row Level Security ensures a signed-in user can only ever read or write
-- their own rows, even though the anon key is public in the browser.

-- ---------------------------------------------------------------------------
-- companies: one reporting entity per row, owned by the creating user.
-- ---------------------------------------------------------------------------
create table if not exists public.companies (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users (id) on delete cascade default auth.uid(),
  name           text not null,
  sector         text not null,
  reporting_year integer not null,
  employees      integer,
  created_at     timestamptz not null default now()
);

alter table public.companies enable row level security;

drop policy if exists "companies_select_own" on public.companies;
create policy "companies_select_own" on public.companies
  for select using (owner_id = auth.uid());

drop policy if exists "companies_insert_own" on public.companies;
create policy "companies_insert_own" on public.companies
  for insert with check (owner_id = auth.uid());

drop policy if exists "companies_update_own" on public.companies;
create policy "companies_update_own" on public.companies
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "companies_delete_own" on public.companies;
create policy "companies_delete_own" on public.companies
  for delete using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- activity_entries: activity data lines, each referencing a factor id in code.
-- ---------------------------------------------------------------------------
create table if not exists public.activity_entries (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid not null references public.companies (id) on delete cascade,
  factor_id     text not null,
  activity_date date not null,
  quantity      numeric not null check (quantity >= 0),
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists activity_entries_company_idx
  on public.activity_entries (company_id);

alter table public.activity_entries enable row level security;

-- Access is granted only when the row's company is owned by the current user.
drop policy if exists "entries_select_own" on public.activity_entries;
create policy "entries_select_own" on public.activity_entries
  for select using (
    exists (
      select 1 from public.companies c
      where c.id = activity_entries.company_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "entries_insert_own" on public.activity_entries;
create policy "entries_insert_own" on public.activity_entries
  for insert with check (
    exists (
      select 1 from public.companies c
      where c.id = activity_entries.company_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "entries_update_own" on public.activity_entries;
create policy "entries_update_own" on public.activity_entries
  for update using (
    exists (
      select 1 from public.companies c
      where c.id = activity_entries.company_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "entries_delete_own" on public.activity_entries;
create policy "entries_delete_own" on public.activity_entries
  for delete using (
    exists (
      select 1 from public.companies c
      where c.id = activity_entries.company_id and c.owner_id = auth.uid()
    )
  );
