/**
 * Sends a one-time email with a link to the user's profile/report.
 * No subscription - just a single email with the shareable link.
 */

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
      limiter: Ratelimit.slidingWindow(5, '1 h'),
    })
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || '127.0.0.1'
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_ADDRESS
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'

  if (!resendKey || !fromAddress) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { email, profileSlug, primaryFamily, secondaryFamily } = req.body || {}

  if (!email || !profileSlug || !primaryFamily || !secondaryFamily) {
    return res.status(400).json({ error: 'Missing required fields: email, profileSlug, primaryFamily, secondaryFamily' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const profileUrl = `${appUrl}/profile/${profileSlug}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 480px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #C9A227; margin-bottom: 16px;">Your Five Buddha Families Report</h2>
  <p>Here's your personalized link to your full report — ${primaryFamily} with ${secondaryFamily} influences.</p>
  <p style="margin: 24px 0;">
    <a href="${profileUrl}" style="display: inline-block; padding: 12px 24px; background-color: #C9A227; color: #1A1612; text-decoration: none; border-radius: 8px; font-weight: 600;">View Your Report</a>
  </p>
  <p style="font-size: 14px; color: #78716c;">
    You can bookmark this link or share it with others. No account needed.
  </p>
</body>
</html>
  `.trim()

  try {
    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Your Five Buddha Families Report — ${primaryFamily} with ${secondaryFamily}`,
      html,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Send link email error:', err)
    return res.status(500).json({ error: err.message || 'Failed to send email' })
  }
}
