-- Enable RLS on publicly exposed tables.
-- Service role queries continue to work; anon/authenticated roles are denied unless policies are added.

alter table if exists public.profiles enable row level security;
alter table if exists public.email_subscriptions enable row level security;
