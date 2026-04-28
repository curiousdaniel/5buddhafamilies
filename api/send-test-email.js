/**
 * Sends a single contemplation email immediately (for admin testing).
 * POST /api/send-test-email with JSON body:
 * - adminSecret: must match env ADMIN_SECRET or VITE_ADMIN_SECRET
 * - email, profileSlug, primaryFamily, secondaryFamily, scores (e.g. { buddha, vajra, ratna, padma, karma })
 * - optional: frequency ("daily" | "weekly"), contextDate (ISO string) to preview another day’s US-Eastern focus + calendar
 *
 * From the results page with admin mode, use the “Send test email” control (uses VITE_ADMIN_SECRET).
 * Or curl, for example:
 * curl -sS -X POST "$APP_URL/api/send-test-email" -H "Content-Type: application/json" \
 *   -d '{"adminSecret":"YOUR_ADMIN_SECRET","email":"you@example.com","profileSlug":"abc","primaryFamily":"Padma","secondaryFamily":"Karma","scores":{"buddha":10,"vajra":15,"ratna":20,"padma":35,"karma":20}}'
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

  const {
    email,
    profileSlug,
    primaryFamily,
    secondaryFamily,
    scores,
    frequency = 'weekly',
    contextDate: contextDateRaw,
  } = req.body || {}

  let contextDate = new Date()
  if (contextDateRaw) {
    const parsed = new Date(contextDateRaw)
    if (!Number.isNaN(parsed.getTime())) {
      contextDate = parsed
    }
  }

  if (!email || !profileSlug || !primaryFamily || !secondaryFamily || !scores) {
    return res.status(400).json({ error: 'Missing: email, profileSlug, primaryFamily, secondaryFamily, scores' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  try {
    const { generateContemplationEmail } = await import('../server/email-contemplation.js')
    const unsubscribeUrl = `${appUrl}/api/unsubscribe?token=test-admin-token`
    const { html, subject, focusArea } = await generateContemplationEmail({
      primaryFamily,
      secondaryFamily,
      scores,
      frequency,
      isWelcome: false,
      unsubscribeUrl,
      profileSlug,
      contextDate,
    })

    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `[Test] ${subject}`,
      html,
    })

    return res.status(200).json({
      success: true,
      message: 'Test email sent',
      focusArea,
      contextDate: contextDate.toISOString(),
    })
  } catch (err) {
    console.error('Send test email error:', err)
    return res.status(500).json({ error: err.message })
  }
}
