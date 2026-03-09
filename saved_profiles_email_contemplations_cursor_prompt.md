# Feature Prompt: Saved Profiles & Email Contemplations

## Overview

Two connected features:

1. **Saved Profiles** — persist the user's complete results (scores, all generated AI text, completed modules) to a database and generate a stable shareable URL that restores the exact saved state rather than regenerating anything.
2. **Email Contemplations** — allow users to subscribe to a daily or weekly email containing a personalized reflection, a klesha journal prompt, and everything they need to engage with their practice — all derived from their family composition and delivered without requiring them to return to the app.

---

## Part 1: Saved Profiles

### The Problem Being Solved

The current share link encodes scores in query parameters and regenerates AI content on load. This means every visit produces slightly different text, the experience is slow on shared links, and there is no true persistence. We need to save the complete generated state to a database and serve it back exactly as it was created.

### Database

Use **Supabase** as the backend. It provides a hosted Postgres database, a straightforward JavaScript client, and built-in support for the Next.js app router. Create a free project at supabase.com and add the following environment variables to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key must only ever be used server-side in API routes. Never expose it to the client.

### Database Schema

Create the following tables in Supabase:

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  scores jsonb not null,
  primary_family text not null,
  secondary_family text not null,
  core_interpretation text not null,
  completed_modules jsonb default '[]',
  quiz_mode text not null default 'full',
  slug text unique not null
);

create index profiles_slug_idx on profiles (slug);

create table email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  email text not null,
  profile_slug text not null references profiles(slug),
  primary_family text not null,
  secondary_family text not null,
  scores jsonb not null,
  frequency text not null check (frequency in ('daily', 'weekly')),
  active boolean not null default true,
  last_sent_at timestamp with time zone,
  unsubscribe_token text unique not null default gen_random_uuid()::text
);

create index email_subscriptions_email_idx on email_subscriptions (email);
create index email_subscriptions_frequency_idx on email_subscriptions (frequency, active, last_sent_at);
```

**Profiles field notes:**
- `id` — internal UUID, not exposed in URLs
- `scores` — the full scores object e.g. `{"Vajra": 38, "Padma": 27, "Karma": 20, "Ratna": 10, "Buddha": 5}`
- `core_interpretation` — the complete streamed text of the core AI interpretation, stored as a single string
- `completed_modules` — a JSON array of objects, each containing `id` and `content` e.g. `[{"id": "relationships_overview", "content": "...full text..."}]`
- `slug` — a short human-readable identifier used in the shareable URL

**Email subscriptions field notes:**
- `unsubscribe_token` — a unique token used to generate a one-click unsubscribe link that requires no login
- `last_sent_at` — used by the send job to determine which subscribers are due for their next email
- `frequency` — either `daily` or `weekly`, chosen by the user at signup

### Slug Generation

Generate a short, memorable, unique slug for each profile rather than exposing the UUID. Use a combination of the primary family name and a short random alphanumeric string, e.g. `vajra-k7x2m` or `padma-9nqr4`. This makes URLs feel intentional rather than machine-generated.

```typescript
function generateSlug(primaryFamily: string): string {
  const familySlug = primaryFamily.toLowerCase();
  const random = Math.random().toString(36).substring(2, 7);
  return `${familySlug}-${random}`;
}
```

Check for slug uniqueness before inserting — regenerate if a collision occurs (extremely rare but handle it).

### Save API Route

Create `/api/profile/save/route.ts` — a POST endpoint that:

1. Receives the complete profile payload from the client
2. Generates a unique slug
3. Inserts the record into Supabase
4. Returns the slug to the client

Request body:

```typescript
type SaveProfileRequest = {
  scores: Record<string, number>;
  primaryFamily: string;
  secondaryFamily: string;
  coreInterpretation: string;
  completedModules: Array<{ id: string; content: string }>;
  quizMode: 'secular' | 'sacred' | 'full';
};
```

Response:

```json
{
  "slug": "vajra-k7x2m",
  "url": "https://yourdomain.com/profile/vajra-k7x2m"
}
```

### Load API Route

Create `/api/profile/[slug]/route.ts` — a GET endpoint that retrieves a profile by slug and returns the full saved data. Return a 404 with a graceful message if the slug is not found.

### Profile Page

Create `/profile/[slug]/page.tsx` — a new page that:

1. On load, calls the load API route with the slug from the URL
2. If found, renders the full results page using the **saved data** — no AI calls are made, everything is restored from the database exactly as it was saved
3. If not found, shows a friendly message explaining the profile could not be found, with a link to take the quiz

The profile page should be visually identical to the results page. The only difference is that AI content is rendered from the saved string rather than streamed. Display it with the same typography, section headings, and family color styling. Add a subtle banner at the top — something like *"This is a saved profile from [formatted date]"* — so the viewer knows they are seeing a preserved snapshot.

### Save Trigger on the Results Page

On the results page, after the core interpretation finishes streaming, automatically save the profile to the database in the background. Do not wait for the user to explicitly request it — saving happens silently. Once the save completes:

- Replace the existing share URL with the new stable profile URL (e.g. `https://yourdomain.com/profile/vajra-k7x2m`)
- Update the copy-link button to use this URL
- Update the share text to use this URL
- Store the slug in `sessionStorage` so that if the user generates additional modules, those can be saved incrementally

### Incremental Module Saves

When the user generates a new module on the results page, update the saved profile in the database to append the new module content. Create `/api/profile/update/route.ts` — a PATCH endpoint that accepts a slug and a new module object and appends it to the `completed_modules` array.

This means a profile shared early (before all modules are generated) will show fewer modules than one shared later — which is correct behavior. The saved state always reflects what was generated at save time.

---

## Part 2: Email Contemplations

### Overview

After receiving their results, users can optionally enter their email address to subscribe to a daily or weekly email. Each email contains a personalized reflection and a klesha journal prompt generated by Claude, keyed entirely to their saved family composition. The email is completely self-contained — recipients do not need to return to the app to engage with their practice.

### Email Service

Use **Resend** (resend.com) as the email delivery service. It has a generous free tier, excellent deliverability, and a clean API that works well with Next.js. Add the following to `.env.local`:

```
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_ADDRESS=contemplations@yourdomain.com
```

Install the Resend SDK:

```bash
npm install resend
```

### Subscription UI

On the results page, after the share panel, add a subscription section with the heading **"Receive Daily or Weekly Contemplations"** and the following subheading:

*"We'll send you a personalized reflection and journal prompt based on your family composition — everything you need for your practice, delivered to your inbox."*

The subscription form should contain:
- An email input field
- A frequency toggle: **Daily** or **Weekly**
- A subscribe button styled in the user's primary family color
- A brief reassurance line below the button: *"No account needed. Unsubscribe anytime with one click."*

On successful subscription, replace the form with a warm confirmation message such as: *"You're subscribed. Your first contemplation will arrive soon."*

### Subscription API Route

Create `/api/subscribe/route.ts` — a POST endpoint that:

1. Validates the email address format
2. Checks whether this email is already subscribed to this profile slug — if so, return a friendly message rather than creating a duplicate
3. Inserts a new row into `email_subscriptions`
4. Sends a welcome email immediately (see Welcome Email below)
5. Returns success

Request body:

```typescript
type SubscribeRequest = {
  email: string;
  frequency: 'daily' | 'weekly';
  profileSlug: string;
  primaryFamily: string;
  secondaryFamily: string;
  scores: Record<string, number>;
};
```

### Email Generation

Each email — both the welcome email and all subsequent contemplation emails — generates its content fresh via the Claude API at send time. This ensures every email feels alive and non-repetitive even for long-term subscribers.

Use the following system prompt for email generation:

```
You are a wise and warm dharma teacher generating a personalized contemplation email for a practitioner who has discovered their Buddha Family composition through a quiz. You know their primary and secondary family energies and their full score composition.

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

Do not use markdown formatting — this will be rendered as styled HTML email.
```

The user message should be:

```
Please generate a contemplation email for a practitioner with the following composition:

Primary Family: [primaryFamily]
Secondary Family: [secondaryFamily]
Full Composition: Buddha [score]%, Vajra [score]%, Ratna [score]%, Padma [score]%, Karma [score]%
Frequency: [daily/weekly]
```

Use `claude-sonnet-4-20250514`, max tokens `1500`, temperature `0.9`. Higher temperature here is intentional — we want genuine variation between emails so long-term subscribers receive fresh content every time.

### Email Template

Build an HTML email template using **React Email** (`npm install @react-email/components react-email`). The template should:

- Open with the app name and a small mandala graphic at the top (use one of the existing mandala SVGs from the project, inlined as an SVG or hosted image)
- Display the primary family name and color as a styled header banner
- Render the three generated sections with clear visual separation — elegant typography, generous whitespace, the family's signature color used as an accent
- Include a section at the bottom with:
  - A link back to the user's saved profile: *"Return to your full profile →"*
  - The user's primary family name and brief one-line reminder of their wisdom quality
  - An unsubscribe link using the `unsubscribe_token`: *"Unsubscribe from these emails"* — this should be a simple GET request to `/api/unsubscribe?token=[token]` that sets `active = false` and shows a confirmation page
- Footer with the app name and a note: *"You're receiving this because you subscribed at [app URL]"*

Use the family signature colors for the email header:

| Family | Header Color |
|--------|-------------|
| Buddha | `#4A4A4A` (dark charcoal — white doesn't work as email background) |
| Vajra | `#1B3A6B` |
| Ratna | `#8B6914` (darker gold for email legibility) |
| Padma | `#8B1A1A` (darker red for email legibility) |
| Karma | `#1A4A35` (darker green for email legibility) |

### Welcome Email

Send immediately upon subscription. Uses the same template and generation process as regular contemplation emails, but the opening reflection should acknowledge that this is the first email and briefly orient the reader to what they'll be receiving. Generate the content via Claude using the same prompt with an additional instruction appended: *"This is the subscriber's first email. Open with a warm welcome that acknowledges they have just discovered their family composition and explains briefly what these emails will offer them."*

### Send Job: Cron Route

Create `/api/cron/send-contemplations/route.ts` — an API route that serves as a cron job endpoint. This route:

1. Queries `email_subscriptions` for active subscribers who are due for their next email:
   - For **daily** subscribers: `last_sent_at` is null or more than 20 hours ago
   - For **weekly** subscribers: `last_sent_at` is null or more than 6 days ago
2. For each due subscriber, generates email content via Claude
3. Sends the email via Resend
4. Updates `last_sent_at` to the current timestamp
5. Processes subscribers in batches of 10 to avoid overwhelming the Claude API

Protect this route with a secret token to prevent unauthorized triggering:

```
CRON_SECRET=your_random_secret_here
```

The route should check for `Authorization: Bearer [CRON_SECRET]` in the request headers and return 401 if it doesn't match.

### Scheduling the Cron Job

Use **Vercel Cron Jobs** to trigger the send route automatically. Add the following to `vercel.json` in the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-contemplations",
      "schedule": "0 7 * * *"
    }
  ]
}
```

This runs the job every day at 7:00 AM UTC. Daily subscribers get their email every day at this time. Weekly subscribers get theirs once per week when the job runs and finds them due.

Note: Vercel Cron Jobs require a Pro plan. If the project is on the free tier, document an alternative: set up a free cron job via **cron-job.org** pointing to the same endpoint with the secret token in the Authorization header.

### Unsubscribe Route

Create `/api/unsubscribe/route.ts` — a GET endpoint that:

1. Accepts a `token` query parameter
2. Finds the matching subscription by `unsubscribe_token`
3. Sets `active = false`
4. Returns a simple HTML confirmation page (not a redirect to the app) that says something like: *"You've been unsubscribed. You won't receive any more contemplations from us."* with a link to take the quiz again if they ever want to resubscribe.

---

## Part 3: Rate Limiting & Abuse Prevention

Add basic rate limiting to both the save and subscribe API routes to prevent abuse:

- `/api/profile/save` — limit to 5 saves per IP per hour
- `/api/subscribe` — limit to 3 subscription attempts per IP per hour; also check that the same email cannot be subscribed to more than 3 different profiles (prevents using the system as a spam tool)

Use the **`@upstash/ratelimit`** package with **Upstash Redis** for rate limiting, which integrates cleanly with Vercel's edge runtime. Add to `.env.local`:

```
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

---

## Environment Variables Summary

Add all of the following to `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_ADDRESS=

# Cron protection
CRON_SECRET=

# Upstash (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App URL (used in emails and share links)
NEXT_PUBLIC_APP_URL=
```

---

## Build Order

1. Set up Supabase project and run the schema SQL to create both tables
2. Build `/api/profile/save` and `/api/profile/[slug]` routes
3. Build `/profile/[slug]/page.tsx` — the saved profile display page
4. Wire up the auto-save trigger on the results page and incremental module saves
5. Set up Resend account and verify sending domain
6. Install and configure React Email
7. Build the email HTML template
8. Build the Claude email content generation utility
9. Build `/api/subscribe` route and the subscription UI on the results page
10. Send the welcome email on subscription
11. Build `/api/unsubscribe` route
12. Build `/api/cron/send-contemplations` route with batch processing
13. Configure `vercel.json` cron schedule
14. Add rate limiting via Upstash to save and subscribe routes
15. End-to-end test: take quiz → profile saves → subscribe → welcome email arrives → cron sends daily email → unsubscribe link works

---

## Important Notes

- The Claude API key, Supabase service role key, Resend API key, and cron secret must never be referenced in any client component. All API calls to these services happen exclusively in server-side API routes.
- Profile data is saved permanently — there is no automatic expiration. If storage becomes a concern in the future, a cleanup job for profiles older than 12 months with no associated active email subscription can be added later.
- The email generation Claude call uses temperature `0.9` intentionally — higher than the results page calls — to ensure genuine variation between emails for long-term subscribers.
- The unsubscribe flow requires no login and no account — a single click on the link in any email is sufficient to unsubscribe permanently.
