import { createClient } from '@supabase/supabase-js'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function generateSlug(primaryFamily) {
  const familySlug = primaryFamily.toLowerCase()
  const random = Math.random().toString(36).substring(2, 7)
  return `${familySlug}-${random}`
}

export const config = {
  api: { bodyParser: true },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
    })
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return res.status(429).json({ error: 'Too many saves. Please try again later.' })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { scores, primaryFamily, secondaryFamily, coreInterpretation, completedModules = [], quizMode = 'full' } = req.body || {}

  if (!scores || !primaryFamily || !secondaryFamily || !coreInterpretation) {
    return res.status(400).json({ error: 'Missing required fields: scores, primaryFamily, secondaryFamily, coreInterpretation' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  let slug
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    slug = generateSlug(primaryFamily)
    const { data: existing } = await supabase.from('profiles').select('id').eq('slug', slug).single()
    if (!existing) break
    attempts++
  }

  if (attempts >= maxAttempts) {
    return res.status(500).json({ error: 'Could not generate unique slug' })
  }

  const { error } = await supabase.from('profiles').insert({
    scores,
    primary_family: primaryFamily,
    secondary_family: secondaryFamily,
    core_interpretation: coreInterpretation,
    completed_modules: completedModules,
    quiz_mode: quizMode,
    slug,
  })

  if (error) {
    console.error('Profile save error:', error)
    return res.status(500).json({ error: 'Failed to save profile' })
  }

  return res.status(200).json({
    slug,
    url: `${appUrl}/profile/${slug}`,
  })
}
