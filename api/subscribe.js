import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
      limiter: Ratelimit.slidingWindow(3, '1 h'),
    })
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return res.status(429).json({ error: 'Too many subscription attempts. Please try again later.' })
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_ADDRESS
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'

  if (!supabaseUrl || !supabaseKey || !resendKey || !fromAddress) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { email, frequency, profileSlug, primaryFamily, secondaryFamily, scores } = req.body || {}

  if (!email || !frequency || !profileSlug || !primaryFamily || !secondaryFamily || !scores) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  if (!['daily', 'weekly'].includes(frequency)) {
    return res.status(400).json({ error: 'Frequency must be daily or weekly' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: existing } = await supabase
    .from('email_subscriptions')
    .select('id')
    .eq('email', email.toLowerCase())
    .eq('profile_slug', profileSlug)
    .eq('active', true)
    .single()

  if (existing) {
    return res.status(200).json({
      message: 'You are already subscribed to this profile.',
      alreadySubscribed: true,
    })
  }

  const { data: allSubscriptions } = await supabase
    .from('email_subscriptions')
    .select('profile_slug')
    .eq('email', email.toLowerCase())
    .eq('active', true)

  const uniqueProfiles = new Set((allSubscriptions || []).map((s) => s.profile_slug))
  if (uniqueProfiles.size >= 3 && !uniqueProfiles.has(profileSlug)) {
    return res.status(400).json({
      error: 'This email is already subscribed to the maximum number of profiles (3).',
    })
  }

  const { data: insertData, error: insertError } = await supabase
    .from('email_subscriptions')
    .insert({
      email: email.toLowerCase(),
      profile_slug: profileSlug,
      primary_family: primaryFamily,
      secondary_family: secondaryFamily,
      scores,
      frequency,
    })
    .select('id, unsubscribe_token')
    .single()

  if (insertError) {
    console.error('Subscribe insert error:', insertError)
    return res.status(500).json({ error: 'Failed to subscribe' })
  }

  const resend = new Resend(resendKey)
  const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${insertData.unsubscribe_token}`

  try {
    const { generateContemplationEmail } = await import('../server/email-contemplation.js')
    const { html, subject } = await generateContemplationEmail({
      primaryFamily,
      secondaryFamily,
      scores,
      frequency,
      isWelcome: true,
      unsubscribeUrl,
      profileSlug,
    })

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject,
      html,
    })
  } catch (err) {
    console.error('Welcome email send error:', err)
    // Don't fail the subscription - they're in the DB
  }

  return res.status(200).json({ success: true })
}
