import Anthropic from '@anthropic-ai/sdk'

const FAMILY_HEADER_COLORS = {
  Buddha: '#4A4A4A',
  Vajra: '#1B3A6B',
  Ratna: '#8B6914',
  Padma: '#8B1A1A',
  Karma: '#1A4A35',
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** US Eastern wall clock — matches focus rotation and "today" for contemplation emails. */
const US_EASTERN_TZ = 'America/New_York'

function getUsEasternCalendarParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: US_EASTERN_TZ,
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  const parts = formatter.formatToParts(date)
  const pick = (type) => parts.find((p) => p.type === type)?.value
  const year = Number(pick('year'))
  const month = Number(pick('month')) - 1
  const day = Number(pick('day'))
  const weekday = pick('weekday') || 'Monday'
  return { year, month, day, weekday }
}

/**
 * Meteorological seasons in the Northern Hemisphere (common for colloquial "spring," etc.).
 * Returns text the model must follow for seasonal imagery.
 * Calendar date and weekday are interpreted in US Eastern Time (America/New_York).
 */
export function getNorthernHemisphereSeasonContext(date = new Date()) {
  const { year, month, day, weekday } = getUsEasternCalendarParts(date)
  const monthName = MONTHS[month]

  let seasonKey
  let seasonLabel
  let seasonGuidance
  if (month >= 2 && month <= 4) {
    seasonKey = 'spring'
    seasonLabel = 'spring'
    const phase =
      month === 2 ? 'Early spring (March)' : month === 3 ? 'Mid-spring (April)' : 'Late spring (May)'
    seasonGuidance = `${phase}. Northern Hemisphere spring: longer days, renewal, thaw, buds, warming air. Do not use winter imagery (e.g. "early winter" light, deep cold, snow) unless you explicitly mean a rare regional exception.`
  } else if (month >= 5 && month <= 7) {
    seasonKey = 'summer'
    seasonLabel = 'summer'
    const phase =
      month === 5 ? 'Early summer (June)' : month === 6 ? 'Mid-summer (July)' : 'Late summer (August)'
    seasonGuidance = `${phase}. Northern Hemisphere summer: heat, peak light, long evenings, full growth.`
  } else if (month >= 8 && month <= 10) {
    seasonKey = 'fall'
    seasonLabel = 'fall (autumn)'
    const phase =
      month === 8 ? 'Early fall (September)' : month === 9 ? 'Mid-fall (October)' : 'Late fall (November)'
    seasonGuidance = `${phase}. Northern Hemisphere fall: cooling air, shorter days, harvest, turning leaves where applicable.`
  } else {
    seasonKey = 'winter'
    seasonLabel = 'winter'
    const phase =
      month === 11 ? 'Early winter (December)' : month === 0 ? 'Mid-winter (January)' : 'Late winter (February)'
    seasonGuidance = `${phase}. Northern Hemisphere winter: low sun, cold, short days; frost or snow as general imagery — not spring buds or summer heat.`
  }

  const dateLine = `${weekday}, ${monthName} ${day}, ${year}`

  return {
    dateLine,
    seasonKey,
    seasonLabel,
    seasonGuidance,
    block: `CALENDAR CONTEXT (Northern Hemisphere — use this for any seasonal, weather, or time-of-year imagery; do not contradict it):
- Today's date is US Eastern Time (${US_EASTERN_TZ}): ${dateLine}
- Season: ${seasonLabel} (${seasonKey})
- Guidance: ${seasonGuidance}`,
  }
}

/**
 * Domains the quiz already explores — one is chosen per US Eastern calendar day so recurring emails
 * stay varied while all subscribers share the same "territory" on a given send day.
 */
export const CONTEMPLATION_FOCUS_AREAS = [
  {
    title: 'Everyday Life',
    description: 'Work, relationships, money, and how you move through the world.',
  },
  {
    title: 'Buddhist Practice',
    description: 'Meditation, dharma study, sangha, and the path.',
  },
  {
    title: 'Body & Senses',
    description: 'How your energy lives in your physical experience.',
  },
  {
    title: 'Aesthetic & Beauty',
    description: 'What you find beautiful and how beauty shapes your world.',
  },
  {
    title: 'Your Relationship to Time',
    description: 'Punctuality, pace, past, future, and how time feels.',
  },
  {
    title: 'When Things Fall Apart',
    description: 'Crisis, loss, failure, and how you find your way back.',
  },
  {
    title: 'Learning & Knowledge',
    description: 'How you take in the world and what you do with what you learn.',
  },
  {
    title: 'Desire & Appetite',
    description: 'What you hunger for and how you relate to wanting.',
  },
  {
    title: 'Humor & Play',
    description: 'What makes you laugh and how you play.',
  },
  {
    title: 'Childhood & Origins',
    description: 'The child you were and what still echoes from that time.',
  },
]

function usEasternCalendarDayNumber(d) {
  const { year, month, day } = getUsEasternCalendarParts(d)
  return Math.floor(Date.UTC(year, month, day) / 86400000)
}

/** Which focus area seeds generation for this calendar day (US Eastern). */
export function getContemplationFocusAreaForDate(date = new Date()) {
  const n = usEasternCalendarDayNumber(date)
  const idx = ((n % CONTEMPLATION_FOCUS_AREAS.length) + CONTEMPLATION_FOCUS_AREAS.length) % CONTEMPLATION_FOCUS_AREAS.length
  return CONTEMPLATION_FOCUS_AREAS[idx]
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const CONTEMPLATION_SYSTEM_PROMPT = `You are a wise and warm dharma teacher generating a personalized contemplation email for a practitioner who has discovered their Buddha Family composition through a quiz. You know their primary and secondary family energies and their full score composition.

Your task is to write a complete, self-contained contemplation email. The recipient does not need to visit any website or app to engage with this — everything they need is in the email itself.

**Seasonal and temporal accuracy:** The user message includes a CALENDAR CONTEXT block for the Northern Hemisphere; the stated calendar date is US Eastern Time. Whenever you mention seasons, weather, quality of light, length of day, or time of year in the opening reflection (or elsewhere), it MUST match that context. Do not describe winter, snow, or "early winter" light when the context says spring or summer, and vice versa. If you prefer not to use season at all, you may focus on time of day or inner experience instead — but never invent the wrong season.

**Today's focus area:** The user message includes a TODAY'S FOCUS AREA block (one of the domains the quiz already explores). Seed the entire email from that lens: the opening reflection, contemplation practice, and journal prompt should each clearly live in that territory — not by repeating its title as a slogan, but through concrete situations, questions, and felt life. Their Buddha Family composition remains the thread: the focus area is the *where* and *what*, the family energies are the *how* they meet it. Do not drift into a generic dharma talk unrelated to today's focus.

The email has three parts:

**Part 1: Opening Reflection (150–200 words)**
A warm, personal opening reflection addressed directly to the reader. Ground it in the season, time of day, or a simple observation about the nature of their primary family energy as it might be showing up right now in their daily life — specifically in connection with today's focus area. Make it feel timely and alive, not generic. Draw on different aspects of the family's wisdom, neurosis, transmutation, element, color, or associated teachings as they meet this focus.

**Part 2: Contemplation Practice (100–150 words)**
A specific contemplation or short practice for the day or week. This should be concrete and doable — something the reader can actually sit with for 5–15 minutes. It should be directly related to their primary family energy and keyed to either working with their primary confused emotion or deepening their access to their corresponding wisdom, while staying rooted in today's focus area. Vary the form: sometimes a sitting practice, sometimes a walking reflection, sometimes a relational observation to carry through the day.

**Part 3: Klesha Journal Prompt (80–120 words)**
A single, carefully crafted journal prompt designed to help the reader notice their primary neurotic pattern in action during ordinary life — with today's focus area as the scene. The prompt should be specific enough to be useful but open enough to allow genuine reflection. It should feel like a question a skilled teacher would ask — pointed, compassionate, and free of judgment. Frame it as an invitation rather than a diagnosis. Include 2–3 follow-up sub-questions to deepen the inquiry.

**Tone throughout:** Warm, direct, and spiritually grounded. Like a letter from a teacher who knows you and wants the best for you. Never preachy. Never generic. Every sentence earned.

**Format:** Return the three parts clearly labeled as:
OPENING REFLECTION
CONTEMPLATION PRACTICE
KLESHA JOURNAL PROMPT

Do not use markdown formatting — this will be rendered as styled HTML email.`

function buildEmailHtml({
  primaryFamily,
  content,
  profileUrl,
  unsubscribeUrl,
  appUrl,
  headerColor,
  focusTitle,
  focusDescription,
}) {
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
    ${
      focusTitle && focusDescription
        ? `<div style="margin-bottom:24px;padding:14px 16px;background:#fafafa;border-radius:8px;border-left:4px solid ${headerColor};">
      <p style="margin:0 0 6px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:#666;">Today's focus</p>
      <p style="margin:0 0 8px;font-size:17px;font-weight:600;color:#222;">${escapeHtml(focusTitle)}</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:#444;">${escapeHtml(focusDescription)}</p>
    </div>`
        : ''
    }
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
  /** When the email is notionally "for" (cron batch should pass the same Date for all sends). */
  contextDate = new Date(),
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VITE_APP_URL || 'https://www.mybuddhafamily.org'
  const profileUrl = profileSlug ? `${appUrl}/profile/${profileSlug}` : appUrl

  const focusArea = getContemplationFocusAreaForDate(contextDate)

  const scoreStr = [
    `Buddha ${Math.round(scores.buddha ?? 0)}%`,
    `Vajra ${Math.round(scores.vajra ?? 0)}%`,
    `Ratna ${Math.round(scores.ratna ?? 0)}%`,
    `Padma ${Math.round(scores.padma ?? 0)}%`,
    `Karma ${Math.round(scores.karma ?? 0)}%`,
  ].join(', ')

  const calendar = getNorthernHemisphereSeasonContext(contextDate)

  let userMessage = `Please generate a contemplation email for a practitioner with the following composition:

Primary Family: ${primaryFamily}
Secondary Family: ${secondaryFamily}
Full Composition: ${scoreStr}
Frequency: ${frequency}

TODAY'S FOCUS AREA (seed the entire email through this lens — opening, practice, and journal):
- Title: ${focusArea.title}
- Territory: ${focusArea.description}

${calendar.block}`

  if (isWelcome) {
    userMessage += `

This is the subscriber's first email. Begin with a warm welcome that acknowledges they have just discovered their family composition and explains briefly what these emails will offer them. Then let today's focus area above shape the rest of the three parts so they immediately feel the kind of varied territory these reflections will visit — without sounding like a dry list of topics.`
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
    focusTitle: focusArea.title,
    focusDescription: focusArea.description,
  })

  const subject = isWelcome
    ? `Welcome — Your ${primaryFamily} Family contemplations begin`
    : `Your ${primaryFamily} contemplation — ${focusArea.title}`

  return { html, subject, text, focusArea }
}
