import Anthropic from '@anthropic-ai/sdk'

const FAMILY_HEADER_COLORS = {
  Buddha: '#4A4A4A',
  Vajra: '#1B3A6B',
  Ratna: '#8B6914',
  Padma: '#8B1A1A',
  Karma: '#1A4A35',
}

const CONTEMPLATION_SYSTEM_PROMPT = `You are a wise and warm dharma teacher generating a personalized contemplation email for a practitioner who has discovered their Buddha Family composition through a quiz. You know their primary and secondary family energies and their full score composition.

Your task is to write a complete, self-contained contemplation email. The recipient does not need to visit any website or app to engage with this — everything they need is in the email itself.

The email has three parts:

**Part 1: Opening Reflection (150–200 words)**
A warm, personal opening reflection addressed directly to the reader. Ground it in the season, time of day, or a simple observation about the nature of their primary family energy as it might be showing up right now in their daily life. Make it feel timely and alive, not generic. Vary the theme each time — draw on different aspects of the family's wisdom, neurosis, transmutation, element, color, or associated teachings.

**Part 2: Contemplation Practice (100–150 words)**
A specific contemplation or short practice for the day or week. This should be concrete and doable — something the reader can actually sit with for 5–15 minutes. It should be directly related to their primary family energy and keyed to either working with their primary confused emotion or deepening their access to their corresponding wisdom. Vary the form: sometimes a sitting practice, sometimes a walking reflection, sometimes a relational observation to carry through the day.

**Part 3: Klesha Journal Prompt (80–120 words)**
A single, carefully crafted journal prompt designed to help the reader notice their primary neurotic pattern in action during ordinary life. The prompt should be specific enough to be useful but open enough to allow genuine reflection. It should feel like a question a skilled teacher would ask — pointed, compassionate, and free of judgment. Frame it as an invitation rather than a diagnosis. Include 2–3 follow-up sub-questions to deepen the inquiry.

**Tone throughout:** Warm, direct, and spiritually grounded. Like a letter from a teacher who knows you and wants the best for you. Never preachy. Never generic. Every sentence earned.

**Format:** Return the three parts clearly labeled as:
OPENING REFLECTION
CONTEMPLATION PRACTICE
KLESHA JOURNAL PROMPT

Do not use markdown formatting — this will be rendered as styled HTML email.`

function buildEmailHtml({ primaryFamily, content, profileUrl, unsubscribeUrl, appUrl, headerColor }) {
  const parts = content.split(/(?=OPENING REFLECTION|CONTEMPLATION PRACTICE|KLESHA JOURNAL PROMPT)/i)
  const opening = parts.find((p) => /OPENING REFLECTION/i.test(p))?.replace(/OPENING REFLECTION\s*/i, '').trim() || ''
  const practice = parts.find((p) => /CONTEMPLATION PRACTICE/i.test(p))?.replace(/CONTEMPLATION PRACTICE\s*/i, '').trim() || ''
  const journal = parts.find((p) => /KLESHA JOURNAL PROMPT/i.test(p))?.replace(/KLESHA JOURNAL PROMPT\s*/i, '').trim() || ''

  const toParagraphs = (text) =>
    text
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p style="margin:0 0 1em;line-height:1.6;color:#333;">${p.replace(/\n/g, '<br>')}</p>`)
      .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Contemplation</title>
</head>
<body style="margin:0;padding:0;font-family:Georgia,serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:24px;background:#fff;">
    <div style="text-align:center;margin-bottom:24px;">
      <p style="margin:0;font-size:18px;color:#666;">Five Buddha Families</p>
    </div>
    <div style="background:${headerColor};color:#fff;padding:16px 24px;margin-bottom:24px;border-radius:8px;">
      <h1 style="margin:0;font-size:24px;font-weight:normal;">${primaryFamily} Family</h1>
    </div>
    <div style="margin-bottom:24px;">
      <h2 style="font-size:18px;color:${headerColor};margin:0 0 12px;">Opening Reflection</h2>
      ${toParagraphs(opening)}
    </div>
    <div style="margin-bottom:24px;">
      <h2 style="font-size:18px;color:${headerColor};margin:0 0 12px;">Contemplation Practice</h2>
      ${toParagraphs(practice)}
    </div>
    <div style="margin-bottom:32px;">
      <h2 style="font-size:18px;color:${headerColor};margin:0 0 12px;">Klesha Journal Prompt</h2>
      ${toParagraphs(journal)}
    </div>
    <div style="border-top:1px solid #eee;padding-top:24px;margin-bottom:24px;">
      <p style="margin:0 0 12px;">
        <a href="${profileUrl}" style="color:${headerColor};text-decoration:none;">Return to your full profile →</a>
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:#666;">
        <a href="${unsubscribeUrl}" style="color:#999;text-decoration:underline;">Unsubscribe from these emails</a>
      </p>
    </div>
    <p style="margin:0;font-size:12px;color:#999;">
      You're receiving this because you subscribed at ${appUrl}
    </p>
  </div>
</body>
</html>
`
}

export async function generateContemplationEmail({
  primaryFamily,
  secondaryFamily,
  scores,
  frequency,
  isWelcome = false,
  unsubscribeUrl,
  profileSlug,
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'
  const profileUrl = profileSlug ? `${appUrl}/profile/${profileSlug}` : appUrl

  const scoreStr = [
    `Buddha ${Math.round(scores.buddha ?? 0)}%`,
    `Vajra ${Math.round(scores.vajra ?? 0)}%`,
    `Ratna ${Math.round(scores.ratna ?? 0)}%`,
    `Padma ${Math.round(scores.padma ?? 0)}%`,
    `Karma ${Math.round(scores.karma ?? 0)}%`,
  ].join(', ')

  let userMessage = `Please generate a contemplation email for a practitioner with the following composition:

Primary Family: ${primaryFamily}
Secondary Family: ${secondaryFamily}
Full Composition: ${scoreStr}
Frequency: ${frequency}`

  if (isWelcome) {
    userMessage += `

This is the subscriber's first email. Open with a warm welcome that acknowledges they have just discovered their family composition and explains briefly what these emails will offer them.`
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const anthropic = new Anthropic({ apiKey })
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    temperature: 0.9,
    system: CONTEMPLATION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')

  const headerColor = FAMILY_HEADER_COLORS[primaryFamily] || '#4A4A4A'
  const html = buildEmailHtml({
    primaryFamily,
    content: text,
    profileUrl,
    unsubscribeUrl,
    appUrl,
    headerColor,
  })

  const subject = isWelcome
    ? `Welcome — Your ${primaryFamily} Family contemplations begin`
    : `Your ${primaryFamily} contemplation for today`

  return { html, subject, text }
}
