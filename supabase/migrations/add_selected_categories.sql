-- Add selected_categories column to profiles (replaces quiz_mode for new saves)
-- Run this in Supabase Dashboard -> SQL Editor, or via migration tool

alter table profiles
  add column if not exists selected_categories jsonb default '["secular","sacred"]';

-- Backfill existing rows: convert quiz_mode to selected_categories
update profiles
set selected_categories = case
  when quiz_mode = 'secular' then '["secular"]'::jsonb
  when quiz_mode = 'sacred' then '["sacred"]'::jsonb
  else '["secular","sacred"]'::jsonb
end;
