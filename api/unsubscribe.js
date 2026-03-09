import { createClient } from '@supabase/supabase-js'

const CONFIRMATION_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribed</title>
  <style>
    body { font-family: Georgia, serif; margin: 0; padding: 40px; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .box { max-width: 400px; background: #fff; padding: 32px; border-radius: 8px; text-align: center; }
    h1 { font-size: 24px; margin: 0 0 16px; color: #333; }
    p { margin: 0 0 24px; line-height: 1.6; color: #666; }
    a { color: #C9A227; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="box">
    <h1>You've been unsubscribed</h1>
    <p>You won't receive any more contemplations from us.</p>
    <p><a href="/">Take the quiz again</a> if you ever want to resubscribe.</p>
  </div>
</body>
</html>
`

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).setHeader('Allow', 'GET').end()
  }

  const token = req.query.token
  if (!token) {
    res.setHeader('Content-Type', 'text/html')
    return res.status(400).send(`
      <!DOCTYPE html>
      <html><body style="font-family:Georgia;padding:40px;text-align:center;">
        <p>Invalid unsubscribe link.</p>
      </body></html>
    `)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    res.setHeader('Content-Type', 'text/html')
    return res.status(500).send('<p>Server error.</p>')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from('email_subscriptions')
    .update({ active: false })
    .eq('unsubscribe_token', token)

  if (error) {
    console.error('Unsubscribe error:', error)
  }

  res.setHeader('Content-Type', 'text/html')
  return res.status(200).send(CONFIRMATION_HTML)
}
