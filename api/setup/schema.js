/**
 * Creates the required tables in Supabase.
 * Protected by SETUP_SECRET. Call: GET /api/setup/schema?secret=YOUR_SETUP_SECRET
 *
 * Requires SUPABASE_DB_URL in env (Supabase Dashboard -> Project Settings -> Database -> Connection string URI)
 */

import pg from 'pg'

const SCHEMA = `
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
`

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.query.secret
  const expected = process.env.SETUP_SECRET || process.env.CRON_SECRET

  if (!expected || secret !== expected) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

  if (!url) {
    return res.status(500).json({
      error: 'Missing SUPABASE_DB_URL or DATABASE_URL. Get it from Supabase Dashboard -> Project Settings -> Database -> Connection string (URI)',
    })
  }

  const client = new pg.Client({ connectionString: url })

  try {
    await client.connect()
    await client.query(SCHEMA)
    await client.end()
    return res.status(200).json({ success: true, message: 'Tables created successfully' })
  } catch (err) {
    console.error('Schema setup error:', err)
    if (client) await client.end().catch(() => {})
    return res.status(500).json({ error: err.message })
  }
}
