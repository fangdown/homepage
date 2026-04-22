-- 若订单写入仍失败，多为 RLS 未放行；为 service_role 显式授权（与 Supabase 服务端 Key 一致）

grant usage on schema public to service_role;
grant all on table public.orders to service_role;

drop policy if exists "orders_service_role_all" on public.orders;

create policy "orders_service_role_all"
  on public.orders
  for all
  to service_role
  using (true)
  with check (true);
