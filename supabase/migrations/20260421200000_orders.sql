-- Orders for Z-Pay (易支付兼容) checkout; status updated via async notify.

create table public.orders (
  id uuid not null default gen_random_uuid(),
  out_trade_no varchar(32) not null,
  course_id uuid null references public.courses (id) on delete set null,
  course_title text not null,
  money numeric(10, 2) not null,
  pay_type text not null default 'alipay',
  status text not null default 'pending',
  zpay_trade_no text null,
  raw_notify jsonb null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_out_trade_no_key unique (out_trade_no),
  constraint orders_status_check check (status in ('pending', 'paid', 'cancelled')),
  constraint orders_pay_type_check check (pay_type in ('alipay', 'wxpay'))
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (status);

comment on table public.orders is 'Course purchases; paid status set by Z-Pay notify_url';

alter table public.orders enable row level security;
