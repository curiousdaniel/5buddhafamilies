-- Run this in your Supabase SQL editor to create the required tables

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  scores jsonb not null,
  primary_family text not null,
  secondary_family text not null,
  core_interpretation text not null,
  completed_modules jsonb default '[]',
  quiz_mode text not null default 'full',
  slug text unique not null
);

create index if not exists profiles_slug_idx on profiles (slug);

create table if not exists email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  email text not null,
  profile_slug text not null references profiles(slug),
  primary_family text not null,
  secondary_family text not null,
  scores jsonb not null,
  frequency text not null check (frequency in ('daily', 'weekly')),
  active boolean not null default true,
  last_sent_at timestamp with time zone,
  unsubscribe_token text unique not null default gen_random_uuid()::text
);

create index if not exists email_subscriptions_email_idx on email_subscriptions (email);
create index if not exists email_subscriptions_frequency_idx on email_subscriptions (frequency, active, last_sent_at);
