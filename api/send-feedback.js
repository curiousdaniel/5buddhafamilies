/**
 * Sends feedback/contact form submission to curiousdaniel@gmail.com
 */

import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
      return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    }
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_ADDRESS

  if (!resendKey || !fromAddress) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const { email, message } = req.body || {}

  if (!email || !message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Email and message are required' })
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const trimmedMessage = message.trim()
  if (trimmedMessage.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters' })
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #1c1917; max-width: 480px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #C9A227; margin-bottom: 16px;">Feedback from Five Buddha Families Quiz</h2>
  <p><strong>From:</strong> ${email}</p>
  <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 16px 0;">
  <p style="white-space: pre-wrap;">${trimmedMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
</body>
</html>
  `.trim()

  try {
    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: fromAddress,
      to: 'curiousdaniel@gmail.com',
      replyTo: email,
      subject: `Five Buddha Families — Feedback from ${email}`,
      html,
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Send feedback error:', err)
    return res.status(500).json({ error: err.message || 'Failed to send' })
  }
}
