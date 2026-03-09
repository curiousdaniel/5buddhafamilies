#!/usr/bin/env node
/**
 * Creates the required tables in Supabase.
 * Run: npm run db:setup
 *
 * Requires SUPABASE_DB_URL in .env.local (Supabase Dashboard -> Project Settings -> Database -> Connection string URI)
 */

import dotenv from 'dotenv'
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: '.env.local' })
dotenv.config()

const url = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

if (!url) {
  console.error('Missing SUPABASE_DB_URL or DATABASE_URL in .env.local')
  console.error('Get it from: Supabase Dashboard -> Project Settings -> Database -> Connection string (URI)')
  process.exit(1)
}

const schemaPath = join(__dirname, '..', 'supabase', 'schema.sql')
const schema = readFileSync(schemaPath, 'utf8')
  .replace(/^--.*$/gm, '')
  .trim()

async function main() {
  const client = new pg.Client({ connectionString: url })
  try {
    await client.connect()
    console.log('Connected to Supabase')
    await client.query(schema)
    console.log('Tables created successfully')
  } catch (err) {
    console.error('Setup failed:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
