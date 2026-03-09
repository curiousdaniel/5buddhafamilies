/**
 * Sends a single contemplation email immediately (for admin testing).
 * Protected by ADMIN_SECRET. Used when ?admin=true to test email without waiting for cron.
 */

import { Resend } from 'resend'

export const config = {
  api: { bodyParser: true },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const adminSecret = process.env.ADMIN_SECRET || process.env.VITE_ADMIN_SECRET
  if (!adminSecret || req.body?.adminSecret !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_ADDRESS
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'

  if (!resendKey || !fromAddress) {
    return res.status(500).json({ error: 'Server configuration error: RESEND_API_KEY, RESEND_FROM_ADDRESS' })
  }

  const { email, profileSlug, primaryFamily, secondaryFamily, scores, frequency = 'weekly' } = req.body || {}

  if (!email || !profileSlug || !primaryFamily || !secondaryFamily || !scores) {
    return res.status(400).json({ error: 'Missing: email, profileSlug, primaryFamily, secondaryFamily, scores' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  try {
    const { generateContemplationEmail } = await import('../server/email-contemplation.js')
    const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=test-admin-token`
    const { html, subject } = await generateContemplationEmail({
      primaryFamily,
      secondaryFamily,
      scores,
      frequency,
      isWelcome: false,
      unsubscribeUrl,
      profileSlug,
    })

    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `[Test] ${subject}`,
      html,
    })

    return res.status(200).json({ success: true, message: 'Test email sent' })
  } catch (err) {
    console.error('Send test email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
