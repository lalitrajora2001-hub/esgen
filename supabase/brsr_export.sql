-- ESGEN BRSR: simple, safe data extraction from Supabase.
-- Run once in the Supabase SQL Editor. Provides a flat, queryable view of every
-- stored answer so you can read or CSV-download the data straight from Supabase
-- (Table editor / SQL editor), in the same structure it was entered.

-- Recursive flattener: turns a nested JSONB answer into (path, value) leaf rows.
-- e.g. {"current":{"scope1":{"value":134}}} -> ("current.scope1.value", "134")
create or replace function public.brsr_flatten(j jsonb, prefix text default '')
returns table(path text, val text)
language plpgsql
immutable
as $$
declare
  k text;
  v jsonb;
  idx int;
  elem jsonb;
begin
  if j is null then
    return;
  elsif jsonb_typeof(j) = 'object' then
    for k, v in select key, value from jsonb_each(j) loop
      return query select * from public.brsr_flatten(v, case when prefix = '' then k else prefix || '.' || k end);
    end loop;
  elsif jsonb_typeof(j) = 'array' then
    idx := 0;
    for elem in select value from jsonb_array_elements(j) loop
      idx := idx + 1;
      return query select * from public.brsr_flatten(elem, prefix || '[' || idx || ']');
    end loop;
  else
    return query select prefix, trim(both '"' from j::text);
  end if;
end;
$$;

-- Flat export view. security_invoker = true so Row Level Security still applies:
-- each user only sees data for companies they own or are a member of.
create or replace view public.brsr_export_view
with (security_invoker = true)
as
select
  c.name                as company,
  r.financial_year,
  r.reporting_boundary,
  r.status              as report_status,
  resp.question_key,
  f.path,
  f.val                 as value,
  resp.updated_at
from public.brsr_responses resp
join public.brsr_reports r on r.id = resp.report_id
join public.companies c   on c.id = r.company_id
cross join lateral public.brsr_flatten(resp.value, '') as f
order by c.name, r.financial_year, resp.question_key, f.path;

-- Usage:
--   select * from public.brsr_export_view;                       -- everything you can see
--   select * from public.brsr_export_view where company = '...'; -- one company
-- Then use the Supabase Table editor's "Export as CSV", or:
--   copy (select * from public.brsr_export_view) to stdout with csv header;
