-- Supplier confidentiality: the client must never learn a supplier's absolute
-- emissions or how dependent the supplier is on them (revenue share) unless the
-- supplier explicitly opts in. The submit RPC now computes the allocated figure
-- server-side (Scope 1+2 only, avoiding double counting of the supplier's own
-- Scope 3) and stores a REDACTED payload by default. Run after brsr_admin.sql.

create or replace function public.esgen_supplier_submit(p_token uuid, p_payload jsonb, p_email text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.supplier_invites%rowtype;
  v_s1 numeric := nullif(p_payload->>'scope1', '')::numeric;
  v_s2 numeric := nullif(p_payload->>'scope2', '')::numeric;
  v_pct numeric := nullif(p_payload->>'allocation_pct', '')::numeric;
  v_share boolean := coalesce((p_payload->>'share_details')::boolean, false);
  v_allocated numeric;
  v_stored jsonb;
begin
  select * into v_invite from public.supplier_invites
  where token = p_token and created_at > now() - interval '90 days';
  if not found then
    return json_build_object('ok', false, 'error', 'Invite not found or expired.');
  end if;
  if v_invite.status = 'accepted' then
    return json_build_object('ok', false, 'error', 'This submission has already been accepted and is locked.');
  end if;

  -- Allocation basis: Scope 1 + Scope 2 x share. The supplier's own Scope 3 is
  -- excluded so the client's Scope 3 does not double count deeper tiers.
  if v_pct is not null and v_pct > 0 and v_pct <= 100
     and (coalesce(v_s1, 0) + coalesce(v_s2, 0)) > 0 then
    v_allocated := round(((coalesce(v_s1, 0) + coalesce(v_s2, 0)) * v_pct / 100)::numeric, 3);
  end if;

  -- What the client can see. Raw totals and the share % stay out unless the
  -- supplier opted in to share them.
  v_stored := jsonb_build_object(
    'period',            p_payload->>'period',
    'allocated_tco2e',   v_allocated,
    'allocation_basis',  p_payload->>'allocation_basis',
    'renewable_pct',     nullif(p_payload->>'renewable_pct', '')::numeric,
    'method_note',       p_payload->>'method_note',
    'shared_details',    v_share
  );
  if v_share then
    v_stored := v_stored || jsonb_build_object(
      'scope1',          v_s1,
      'scope2',          v_s2,
      'scope3',          nullif(p_payload->>'scope3', '')::numeric,
      'energy_total_gj', nullif(p_payload->>'energy_total_gj', '')::numeric,
      'allocation_pct',  v_pct
    );
  end if;

  delete from public.supplier_submissions where invite_id = v_invite.id;
  insert into public.supplier_submissions (invite_id, payload, submitted_by)
  values (v_invite.id, v_stored, p_email);

  update public.supplier_invites
  set status = 'submitted', submitted_at = now()
  where id = v_invite.id;

  return json_build_object('ok', true, 'allocated_tco2e', v_allocated);
end;
$$;
