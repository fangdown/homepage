-- Public catalog: courses (managed from admin via service role)

create table public.courses (
  id uuid not null default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  category text not null default '',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  price numeric(10, 2) not null default 0,
  is_recommended boolean not null default false,
  cta_label text not null default '立即加入',
  sort_order integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint courses_pkey primary key (id),
  constraint courses_features_array check (jsonb_typeof(features) = 'array')
);

create index courses_sort_order_idx on public.courses (sort_order desc, created_at desc);

comment on table public.courses is 'Sellable courses / community products for the marketing site';

alter table public.courses enable row level security;

create policy courses_select_public
  on public.courses
  for select
  to anon, authenticated
  using (true);

-- Seed row (idempotent fixed id for first deploy)
insert into public.courses (
  id,
  title,
  subtitle,
  category,
  description,
  features,
  price,
  is_recommended,
  cta_label,
  sort_order
)
values (
  'c0ffee00-0000-4000-8000-000000000001'::uuid,
  '陪伴群',
  '一群真在用 AI 干活的人',
  '永久社群',
  '这里聚集的是真正把 AI 用在日常工作中的人：交流落地经验、抢先获取前沿信息、试用老金自制的小工具。包含第一期录播《Claude Code 基础入门》，一次加入，长期有效。',
  '[
    "第一期录播：Claude Code 基础入门",
    "各行业 AI 实践者聚集",
    "AI 前沿信息优先获取",
    "老金自制工具率先体验",
    "一次加入永久有效"
  ]'::jsonb,
  399.00,
  true,
  '立即加入',
  0
)
on conflict (id) do nothing;
