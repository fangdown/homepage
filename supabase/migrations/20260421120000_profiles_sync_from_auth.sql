-- Sync public.profiles when auth.users gets a new row (e.g. first Google sign-in),
-- and refresh name/avatar/email when OAuth metadata or email changes (bio is not overwritten).
-- Apply: Supabase Dashboard → SQL → paste & run, or `supabase db push` if you use the CLI.

create or replace function public.handle_auth_user_sync()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar, email)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'User'
    ),
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'avatar_url'), ''),
      nullif(trim(new.raw_user_meta_data->>'picture'), '')
    ),
    new.email
  )
  on conflict (id) do update set
    name = excluded.name,
    avatar = excluded.avatar,
    email = excluded.email;

  return new;
end;
$$;

comment on function public.handle_auth_user_sync() is
  'Upsert public.profiles from auth.users; leaves bio unchanged on conflict.';

drop trigger if exists on_auth_user_created_sync_profiles on auth.users;
create trigger on_auth_user_created_sync_profiles
  after insert on auth.users
  for each row
  execute procedure public.handle_auth_user_sync();

drop trigger if exists on_auth_user_updated_sync_profiles on auth.users;
create trigger on_auth_user_updated_sync_profiles
  after update on auth.users
  for each row
  when (
    old.raw_user_meta_data is distinct from new.raw_user_meta_data
    or old.email is distinct from new.email
  )
  execute procedure public.handle_auth_user_sync();

-- Backfill profiles for users created before this migration (safe to re-run)
insert into public.profiles (id, name, avatar, email)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(u.raw_user_meta_data->>'name'), ''),
    nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
    'User'
  ),
  coalesce(
    nullif(trim(u.raw_user_meta_data->>'avatar_url'), ''),
    nullif(trim(u.raw_user_meta_data->>'picture'), '')
  ),
  u.email
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;
