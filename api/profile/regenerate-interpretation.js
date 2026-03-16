import { createClient } from '@supabase/supabase-js'
import { streamInterpretation } from '../../server/interpret.js'

function scoresToApiFormat(scores) {
  const FAMILY_NAMES = { buddha: 'Buddha', vajra: 'Vajra', ratna: 'Ratna', padma: 'Padma', karma: 'Karma' }
  const p = scores.percentages || {}
  return {
    Buddha: Math.round(p.buddha ?? 0),
    Vajra: Math.round(p.vajra ?? 0),
    Ratna: Math.round(p.ratna ?? 0),
    Padma: Math.round(p.padma ?? 0),
    Karma: Math.round(p.karma ?? 0),
  }
}

export const config = {
  api: { bodyParser: true },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.body || {}
  if (!slug) {
    return res.status(400).json({ error: 'Slug required' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('scores, selected_categories')
    .eq('slug', slug)
    .single()

  if (fetchError || !profile) {
    return res.status(404).json({ error: 'Profile not found' })
  }

  const selectedCategories = profile.selected_categories ?? ['secular', 'sacred']
  const apiScores = scoresToApiFormat(profile.scores)

  try {
    let fullText = ''
    for await (const chunk of streamInterpretation(apiScores, selectedCategories)) {
      fullText += chunk
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ core_interpretation: fullText })
      .eq('slug', slug)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return res.status(500).json({ error: 'Failed to update profile' })
    }

    return res.status(200).json({ coreInterpretation: fullText })
  } catch (err) {
    console.error('Regenerate interpretation error:', err.message)
    return res.status(500).json({ error: 'Failed to regenerate interpretation' })
  }
}
