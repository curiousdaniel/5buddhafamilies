import { createClient } from '@supabase/supabase-js'

export const config = {
  api: { bodyParser: true },
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { slug, module: newModule } = req.body || {}
  if (!slug || !newModule || !newModule.id || !newModule.content) {
    return res.status(400).json({ error: 'Missing slug or module (id, content)' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('completed_modules')
    .eq('slug', slug)
    .single()

  if (fetchError || !profile) {
    return res.status(404).json({ error: 'Profile not found' })
  }

  const modules = Array.isArray(profile.completed_modules) ? profile.completed_modules : []
  const existing = modules.find((m) => m.id === newModule.id)
  const updated = existing
    ? modules.map((m) => (m.id === newModule.id ? newModule : m))
    : [...modules, newModule]

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ completed_modules: updated })
    .eq('slug', slug)

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update profile' })
  }

  return res.status(200).json({ success: true })
}
