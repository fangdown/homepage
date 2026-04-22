-- 下单时的购买人（与登录态关联；未登录则留空）

alter table public.orders
  add column if not exists user_id uuid null references auth.users (id) on delete set null,
  add column if not exists buyer_display_name text null,
  add column if not exists buyer_email text null;

comment on column public.orders.buyer_display_name is '下单时快照：展示名（Google 全名等）';
comment on column public.orders.buyer_email is '下单时快照：邮箱';
