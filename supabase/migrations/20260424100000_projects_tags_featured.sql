-- Tags and featured flag for homepage works section
alter table public.projects
  add column if not exists tags text[] default array[]::text[];

alter table public.projects
  add column if not exists featured boolean default false;
