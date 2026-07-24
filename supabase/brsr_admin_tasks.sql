-- Admin read access to collection_tasks (the one client table brsr_admin.sql
-- missed). Run after brsr_ops.sql and brsr_admin.sql. Powers the cross-company
-- deadline view in the Admin Portal.

drop policy if exists "admin_read_collection_tasks" on public.collection_tasks;
create policy "admin_read_collection_tasks" on public.collection_tasks for select
  using (public.esgen_is_admin());
