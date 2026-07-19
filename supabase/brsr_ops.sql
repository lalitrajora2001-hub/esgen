-- ESGEN BRSR ops: custom emission factors, organisation units, collection tasks,
-- richer member profiles. Run in the Supabase SQL Editor after brsr_collect.sql.

-- ---------------------------------------------------------------------------
-- Richer member profiles (Add-user form: name, phone, org unit).
-- ---------------------------------------------------------------------------
alter table public.company_members add column if not exists first_name text;
alter table public.company_members add column if not exists last_name  text;
alter table public.company_members add column if not exists phone      text;
alter table public.company_members add column if not exists org_unit   text;

-- ---------------------------------------------------------------------------
-- company_emission_factors: the client's own factor library, alongside the
-- system defaults shipped in the app. Versioned by validity date range.
-- ---------------------------------------------------------------------------
create table if not exists public.company_emission_factors (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid not null references public.companies (id) on delete cascade,
  activity        text not null,                     -- e.g. "Grid electricity - Maharashtra"
  scope           int  not null check (scope in (1, 2, 3)),
  unit            text not null,                     -- kWh, litre, kg, km, tonne-km...
  kgco2e_per_unit numeric not null check (kgco2e_per_unit >= 0),
  co2_factor      numeric,                           -- optional gas-level breakdown
  ch4_factor      numeric,
  n2o_factor      numeric,
  valid_from      date,
  valid_to        date,
  source_label    text not null,                     -- citation is mandatory for custom factors
  source_url      text,
  note            text,
  created_by      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists company_emission_factors_idx on public.company_emission_factors (company_id);

alter table public.company_emission_factors enable row level security;

drop policy if exists "company_factors_access" on public.company_emission_factors;
create policy "company_factors_access" on public.company_emission_factors for all
  using (exists (
    select 1 from public.companies c
    where c.id = company_emission_factors.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.companies c
    where c.id = company_emission_factors.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));

-- ---------------------------------------------------------------------------
-- org_units: sites / facilities / plants that contribute data bottom-up.
-- ---------------------------------------------------------------------------
create table if not exists public.org_units (
  id         uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name       text not null,
  location   text,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists org_units_idx on public.org_units (company_id);

alter table public.org_units enable row level security;

drop policy if exists "org_units_access" on public.org_units;
create policy "org_units_access" on public.org_units for all
  using (exists (
    select 1 from public.companies c
    where c.id = org_units.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.companies c
    where c.id = org_units.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));

-- ---------------------------------------------------------------------------
-- collection_tasks: scheduled data-collection work items. A task asks a person
-- to submit one metric for one period (e.g. "March electricity bill - Pune").
-- ---------------------------------------------------------------------------
create table if not exists public.collection_tasks (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid not null references public.companies (id) on delete cascade,
  report_id      uuid references public.brsr_reports (id) on delete set null,
  title          text not null,
  question_key   text,                               -- optional link to a BRSR KPI
  org_unit_id    uuid references public.org_units (id) on delete set null,
  assignee_email text,
  schedule       text not null default 'one_off',    -- one_off | monthly | quarterly | annual
  period         text,                               -- e.g. "2025-04", "Q1 FY25", "FY 2024-25"
  due_date       date,
  status         text not null default 'open',       -- open | submitted | done
  value          numeric,
  unit           text,
  note           text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists collection_tasks_idx on public.collection_tasks (company_id, status);

alter table public.collection_tasks enable row level security;

drop policy if exists "collection_tasks_access" on public.collection_tasks;
create policy "collection_tasks_access" on public.collection_tasks for all
  using (exists (
    select 1 from public.companies c
    where c.id = collection_tasks.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ))
  with check (exists (
    select 1 from public.companies c
    where c.id = collection_tasks.company_id
      and (c.owner_id = auth.uid() or public.esgen_is_company_member(c.id))
  ));
