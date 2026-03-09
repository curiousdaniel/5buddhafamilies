import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const CRON_SECRET = process.env.CRON_SECRET

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = req.headers.authorization
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_ADDRESS
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'

  if (!supabaseUrl || !supabaseKey || !resendKey || !fromAddress) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const now = new Date()
  const twentyHoursAgo = new Date(now.getTime() - 20 * 60 * 60 * 1000)
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)

  const { data: dailyDue } = await supabase
    .from('email_subscriptions')
    .select('*')
    .eq('active', true)
    .eq('frequency', 'daily')
    .or(`last_sent_at.is.null,last_sent_at.lt.${twentyHoursAgo.toISOString()}`)

  const { data: weeklyDue } = await supabase
    .from('email_subscriptions')
    .select('*')
    .eq('active', true)
    .eq('frequency', 'weekly')
    .or(`last_sent_at.is.null,last_sent_at.lt.${sixDaysAgo.toISOString()}`)

  const due = [...(dailyDue || []), ...(weeklyDue || [])]
  const resend = new Resend(resendKey)

  const { generateContemplationEmail } = await import('../../server/email-contemplation.js')

  let sent = 0
  const batchSize = 10
  for (let i = 0; i < due.length; i += batchSize) {
    const batch = due.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async (sub) => {
        try {
          const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=${sub.unsubscribe_token}`
          const { html, subject } = await generateContemplationEmail({
            primaryFamily: sub.primary_family,
            secondaryFamily: sub.secondary_family,
            scores: sub.scores,
            frequency: sub.frequency,
            isWelcome: false,
            unsubscribeUrl,
            profileSlug: sub.profile_slug,
          })

          await resend.emails.send({
            from: fromAddress,
            to: sub.email,
            subject,
            html,
          })

          await supabase
            .from('email_subscriptions')
            .update({ last_sent_at: now.toISOString() })
            .eq('id', sub.id)

          sent++
        } catch (err) {
          console.error('Send contemplation error:', err)
        }
      })
    )
  }

  return res.status(200).json({ sent, total: due.length })
}
