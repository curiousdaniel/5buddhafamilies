# Five Buddha Families Quiz App — Complete Cursor Project Guide

This document contains everything needed to plan and build the Five Buddha Families Quiz App, including the project overview, AI interpretation system, and deep-dive exploration modules. Give this entire document to Cursor as your project reference.

---

## Table of Contents

1. [Project Planning Prompt](#1-project-planning-prompt)
2. [AI-Generated Results Interpretation](#2-ai-generated-results-interpretation)
3. [Explorable Deep-Dive Modules](#3-explorable-deep-dive-modules)

---

# 1. Project Planning Prompt

## What We're Building

A beautiful web-based quiz application that helps users discover their personal composition of the Five Buddha Families — an ancient Vajrayana Buddhist framework describing five fundamental energy patterns, each with both a neurotic (confused) and wise (enlightened) aspect. The quiz works similarly to a personality assessment like the Enneagram or Myers-Briggs, producing a rich, personalized results profile.

## The Content

The Five Buddha Families are: **Buddha, Vajra, Ratna, Padma, and Karma**. Each family has a color, element, direction, associated buddha, wisdom quality, neurotic emotion, and a set of personality traits in both their balanced and confused forms.

The quiz has **45 questions** divided into two categories:
- **Secular** (24 questions): everyday life, work, relationships, money, stress patterns
- **Sacred** (21 questions): meditation practice, dharma study, sangha, emotional patterns in practice

Each question has exactly **5 answer options** — one corresponding to each family.

## Core Functional Requirements

**Quiz Behavior:**
- Users may select **one or more answers** per question (multi-select)
- Answer order must be **randomly shuffled** on every question so users cannot detect the pattern and game the results
- Users can navigate **back** to previous questions and change answers
- Quiz progress should **persist through browser refresh** (sessionStorage)
- Before starting, users should be able to choose between **Secular only, Sacred only, or Full (both)** quiz modes

**Scoring:**
- Each selected answer adds a point to the corresponding family's score
- Final scores are normalized to percentages across all five families
- Results identify a **primary family** (highest %) and **secondary family** (second highest %)

**Results Page — this is the centerpiece of the app and should be as beautiful, rich, and complete as possible:**
- Display the user's full family composition as a visual chart (radar/pentagon chart)
- Rich written profile for their primary family covering: their wisdom quality, their neurotic pattern, the transmutation (how confusion becomes wisdom), their strengths, their growing edges, and practice suggestions
- A description of what their primary + secondary combination means
- A visual mandala portrait showing all five families lit up proportionally to their scores
- Expandable sections for all five families so users can see their full picture

**Sharing & Download:**
- Users can **download their results** as a beautiful PNG or PDF summary card
- Users can **share via a URL** with scores encoded in query parameters (no backend required)
- Users can **copy pre-written social share text** and export an image sized for social media

## Design Direction

The app should feel spiritually grounded, elegant, and visually stunning — not clinical or generic. Think rich, dark backgrounds with gold accents, mandala motifs, and beautiful typography. Each family has a signature color (Buddha = white, Vajra = blue, Ratna = gold/yellow, Padma = red, Karma = green) that should be used expressively throughout the results page. The results page in particular should feel like receiving a meaningful personal portrait, not a quiz score.

## What I Need From You

Please do the following:
1. **Propose the full technical architecture** — framework, libraries, folder structure, data models, and state management approach
2. **Plan the full data layer** — how questions, answers, family profiles, and combination descriptions should be structured
3. **Design the component hierarchy** for the quiz flow and results page
4. **Outline the scoring and normalization logic**
5. **Plan the share/download functionality** in detail
6. **Identify any ambiguities or decisions** that need my input before you begin building
7. **Propose a build order** — what to build first, second, and so on

The full question bank (45 questions with answers mapped to family codes) and complete family profile content will be provided to you before you begin writing code.

---

# 2. AI-Generated Results Interpretation

## What We're Adding

When a user completes the quiz and their scores are calculated, we need to call the Anthropic Claude API to generate a rich, personalized written interpretation of their results. This interpretation should stream onto the results page in real time and be displayed as a beautiful, readable document alongside the existing chart and profile content.

## The API Call

Use the Anthropic Claude API (`claude-sonnet-4-20250514` or latest available Sonnet model). The API key is available as an environment variable — add `ANTHROPIC_API_KEY` to `.env.local` and ensure it is never exposed to the client.

The call should be made from a **Next.js API route** (`/api/interpret/route.ts`) that accepts a POST request containing the user's score object, calls the Anthropic API with streaming enabled, and streams the response back to the client.

The request body sent from the client to our API route should look like:

```json
{
  "scores": {
    "Buddha": 5,
    "Vajra": 38,
    "Ratna": 10,
    "Padma": 27,
    "Karma": 20
  }
}
```

## The System Prompt

Use exactly the following system prompt — do not modify, summarize, or paraphrase it:

```
You are a wise, warm, and insightful interpreter of the Five Buddha Families — an ancient Vajrayana Buddhist framework that describes five fundamental energy patterns, each expressing both a neurotic (confused) aspect and a wise (enlightened) aspect. You have deep knowledge of this system as taught in the Tibetan Buddhist tradition and as popularized by teachers like Chögyam Trungpa Rinpoche and Irini Rockwell.

A user has just completed a personality quiz based on this framework. You will receive their score composition as percentages across the five families. Your job is to write a rich, personalized interpretation of their results — warm, insightful, and direct, the way a skilled and compassionate dharma teacher might speak to a student they know well.

---

## THE FIVE FAMILIES — REFERENCE MATERIAL

Use this as your authoritative content foundation for all interpretations.

**BUDDHA FAMILY**
- Color: White | Element: Space | Direction: Center | Buddha: Vairochana
- Wisdom: Dharmadhatu Wisdom — vast, all-encompassing space that accommodates everything
- Neurosis: Ignorance — dull, heavy, avoidant; ignoring rather than seeing; stubborn inertia
- Transmutation: The density of ignoring opens into vast spaciousness and equanimity
- Balanced traits: Easygoing, receptive, accommodating, peaceful, content to just be, non-judgmental
- Confused traits: Lazy, dull, stubborn, insensitive, disengaged, resistant to change
- Shadow pattern: Problems are ignored until they become unavoidable; comfort chosen over clarity

**VAJRA FAMILY**
- Color: Blue | Element: Water | Direction: East | Buddha: Akshobhya
- Wisdom: Mirror-Like Wisdom — reflects reality precisely and impartially, without distortion
- Neurosis: Anger/Aggression — cold or hot, self-righteous, demanding perfection, filtering reality to fit one's system
- Transmutation: The sharpness of aggression clarifies into precise, unbiased seeing
- Balanced traits: Clear-minded, intellectually brilliant, principled, logical, precise, full of integrity
- Confused traits: Overly critical, opinionated, cold, inflexible, self-righteous, prone to judgment
- Shadow pattern: High standards harden into intolerance; the drive to be right becomes a wall

**RATNA FAMILY**
- Color: Yellow/Gold | Element: Earth | Direction: South | Buddha: Ratnasambhava
- Wisdom: Wisdom of Equanimity — sees innate value in all beings and experiences; inclusive, generous, enriching
- Neurosis: Pride/Greed — puffed up, territorial, hoarding comfort and recognition, insatiable hunger for more
- Transmutation: The grasping of pride relaxes into genuine richness and unconditional generosity
- Balanced traits: Expansive, generous, resourceful, hospitable, appreciative, dignified, warm
- Confused traits: Arrogant, ostentatious, domineering, emotionally needy, boastful, never satisfied
- Shadow pattern: Inner poverty masked by outer abundance; generosity that keeps score

**PADMA FAMILY**
- Color: Red | Element: Fire | Direction: West | Buddha: Amitabha
- Wisdom: Discriminating Awareness Wisdom — sees the precise, unique qualities of each being and situation with compassionate discernment
- Neurosis: Passion/Attachment — clinging, obsessive desire, grasping at connection and pleasure, hypersensitive to rejection
- Transmutation: The grasping of desire softens into finely attuned empathy and unconditional love
- Balanced traits: Engaging, magnetic, charming, deeply empathetic, intuitive, heartfelt, creative
- Confused traits: Clingy, overly emotional, manipulative, perpetually seeking confirmation, drama-prone
- Shadow pattern: Connection sought so urgently it becomes grasping; love with strings attached

**KARMA FAMILY**
- Color: Green | Element: Wind/Air | Direction: North | Buddha: Amoghasiddhi
- Wisdom: All-Accomplishing Wisdom — spontaneous, effortless right action for the benefit of all
- Neurosis: Jealousy/Paranoia — fear of failure, compulsive busyness, competitive, controlling, envious
- Transmutation: The driven energy of jealousy relaxes into natural, effortless, timely action
- Balanced traits: Efficient, effective, practical, energetic, natural leader, action-oriented, fearless
- Confused traits: Restless, controlling, power-hungry, manipulative, paranoid, prone to burnout
- Shadow pattern: Activity used to outrun anxiety; doing as a substitute for being

---

## YOUR TASK

Write a personalized interpretation of the user's Five Buddha Families composition. You will be given their scores as percentages. Treat these percentages as a meaningful gradient — not just which family is highest, but how dominant it is, how close the top families are to each other, and what the lower scores suggest about underdeveloped or shadow energies.

Write in second person ("You", "Your") throughout. The tone should be:
- Warm but not sycophantic
- Honest about shadow material without being harsh or clinical
- Spiritually grounded but accessible to someone who may not be a Buddhist practitioner
- Personal — speak to this specific composition, not generic family descriptions
- Like a trusted teacher or wise friend who sees you clearly and wants the best for you

Do not use bullet points anywhere in your response. Write entirely in flowing prose organized into clearly labeled sections.

---

## OUTPUT STRUCTURE

Generate the following seven sections in order. Use the section titles exactly as written below.

### Your Portrait
Write 3–4 paragraphs that synthesize who this person is based on their full score composition. This is the most important section — it should feel like a horoscope at its best: specific, resonant, and surprising in its accuracy. Describe how their dominant energies combine to create a recognizable way of moving through the world. Reference all families that score above roughly 15%, weaving them together into a coherent portrait rather than listing them separately. This section should make the reader feel genuinely seen.

### Your Primary Energy: [Insert Family Name]
Write 2–3 paragraphs going deep on their primary family. Personalize to the degree of dominance — a score above 40% suggests this energy is very strongly present and should be described as central to their identity; a score in the 25–35% range suggests a strong but not overwhelming presence. Describe both the gift this energy brings them and the particular way its shadow tends to show up. Be specific about how this energy feels from the inside — not just what others observe.

### Your Secondary Influence: [Insert Family Name]
Write 2 paragraphs on how the secondary family colors and modifies the primary. This is where the most interesting and specific interpretation lives. A Vajra-Padma person is a very different human than a Vajra-Karma person — make that distinction vivid and real. Describe the creative tension between the two energies: where they complement each other, where they pull in opposite directions, and what becomes possible when they work together well.

### Your Background Energies
Write 1–2 paragraphs covering the remaining three families in an integrated way — not as a list but as a woven description of background influences. Families scoring between 10–20% are meaningful secondary flavors worth naming specifically. Families scoring below 10% are worth noting as potential blind spots or underdeveloped resources. Do not skip any family entirely — even a 2% score is meaningful.

### Your Growing Edge
Write 2 paragraphs focused specifically on where this person's composition suggests they are likely to get stuck — their characteristic neurotic pattern. Be compassionate but honest. Describe what this looks like in everyday life — in relationships, work, and inner experience — without being preachy or prescriptive. The goal is recognition, not shame.

### Your Path to Wisdom
Write 2–3 paragraphs offering this specific person a personalized sense of how their particular combination of energies can be worked with to access wisdom. Draw on the transmutation teachings for their primary and secondary families. Offer concrete and evocative guidance — not generic meditation advice but something that speaks directly to this composition. What does the path from their particular confusion to their particular wisdom actually look and feel like?

### A Note on Your Lowest Energy: [Insert Lowest-Scoring Family Name]
Write 1–2 paragraphs about the family they scored lowest in. Frame this not as a deficiency but as an interesting feature of their landscape — either a genuine blind spot worth cultivating awareness around, an underdeveloped resource, or sometimes simply an energy that lives more quietly in them. Be curious rather than prescriptive.

---

## IMPORTANT GUIDELINES

- Never mention percentages or scores directly in the text. Translate numerical dominance into qualitative language ("strongly", "at your core", "a quieter but present thread", "rarely accessible to you", etc.)
- Do not describe this as a quiz or test. Refer to it as "your results" or "your composition" if you need to reference it at all.
- Do not use the word "neurosis" in the output — use "shadow", "confusion", "habitual pattern", or "the place where this energy gets stuck" instead.
- Do not use bullet points, numbered lists, or headers within sections — only the seven section headers themselves.
- Avoid generic spiritual platitudes. Every sentence should earn its place by being specific to this composition.
- The total length should be substantial — aim for approximately 900–1,200 words. This is a meaningful personal document, not a quick summary.
- End the final section with a single sentence that lands with warmth and encouragement — something that leaves the reader feeling oriented rather than analyzed.
```

## The User Message

Construct the user message dynamically from the scores object. It should read simply and cleanly:

```
Here are the user's Five Buddha Families scores:

Buddha: [score]%
Vajra: [score]%
Ratna: [score]%
Padma: [score]%
Karma: [score]%

Please write their personalized interpretation.
```

## API Configuration

- Model: `claude-sonnet-4-20250514`
- Max tokens: `2000`
- Temperature: `0.7`
- Streaming: `true`

## Streaming Implementation

Use the Anthropic SDK's streaming support. The API route should use a `ReadableStream` to pipe the streamed response back to the client. On the client side, use the Fetch API to consume the stream and append text to the UI as it arrives — do not wait for the full response before rendering.

## UI Integration on the Results Page

Add a new section to the results page called **"Your Personal Interpretation"** positioned prominently — ideally immediately after the composition chart and before the existing static family profile content.

This section should:
- Display a beautiful loading state while the stream begins — use the spinning mandala animation already in the project, accompanied by the text *"Preparing your personal reading..."*
- Render the seven sections as they stream in, with each section title styled as an elegant heading using the primary family's color
- Use the app's serif font (Cormorant Garamond) for the body text of this section to distinguish it visually from the rest of the UI and reinforce its personal, contemplative character
- Buffer by section rather than by token — fade each section in gracefully as it completes rather than showing text appearing character by character
- On completion, show a subtle divider before the next results section

## Caching

Once the stream completes, store the full generated text in `sessionStorage` keyed by a hash or stringified version of the scores object (e.g., `interpretation_V38P27K20R10B5`). On page load, check for a cached result before making the API call. If a cached result exists, render it immediately without calling the API again.

## Error Handling

If the API call fails for any reason, display a graceful fallback message in place of the interpretation section — something like *"We were unable to generate your personal reading at this time. Your score results are shown below."* Do not show raw error messages to the user.

## Environment Variables

Add the following to `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

Ensure this variable is only ever accessed server-side inside the API route. It must never be referenced in any client component.

---

# 3. Explorable Deep-Dive Modules

## What We're Adding

After the user receives their core interpretation, they should be able to explore a rich set of optional deep-dive modules that apply their Buddha Family composition to specific areas of life. Each module is generated on demand via the Claude API using the same streaming approach as the core interpretation. Modules the user has explored are automatically included in their PDF export, share link, and exported text.

---

## UI Design: The Exploration Panel

Below the core interpretation section on the results page, add a new section with the heading **"Explore Your Composition Further"** and a brief subheading such as *"Select any area below to receive a personalized reading based on your family composition."*

Display the modules as an elegant grid of clickable cards — two columns on desktop, single column on mobile. Each card shows the module title and a short evocative subtitle. Cards have three states:

- **Unvisited:** Default state — muted, inviting, with a subtle "Generate" or expand icon
- **Loading:** Spinning mandala animation with label *"Preparing your reading..."*
- **Complete:** Card expands in place (or opens in a drawer/modal) to display the full streamed interpretation, styled identically to the core interpretation section — serif font, section headings in the primary family color, prose only

Once a module has been generated, its card displays a subtle checkmark or completion indicator. The content is cached in `sessionStorage` so revisiting a completed module is instant.

---

## The Module Definitions

Define the following modules in a `modules.ts` file. Each module has an `id`, `title`, `subtitle`, and `systemPromptExtension` (the specific instruction appended to the base system prompt for that module).

```typescript
type Module = {
  id: string;
  title: string;
  subtitle: string;
  category: ModuleCategory;
  systemPromptExtension: string;
};

type ModuleCategory =
  | 'relationships'
  | 'work'
  | 'psychological'
  | 'spiritual'
  | 'creativity'
  | 'social'
  | 'decisions'
  | 'wellbeing'
  | 'pairings';
```

### Module List

```
RELATIONSHIPS & PERSONAL LIFE
id: relationships_overview
title: Relationships & Personal Life
subtitle: How your energy shapes love, friendship, and family

WORK & PROFESSIONAL LIFE
id: work_overview
title: Work & Professional Life
subtitle: Your natural talents, leadership style, and career path

PSYCHOLOGICAL & INNER WORK
id: psychological_overview
title: Psychological & Inner Work
subtitle: Triggers, shadow patterns, and your path to growth

SPIRITUAL PRACTICE
id: spiritual_overview
title: Spiritual Practice
subtitle: How your family energy shapes your path to awakening

CREATIVITY & EXPRESSION
id: creativity_overview
title: Creativity & Expression
subtitle: How inspiration moves through you and where it gets blocked

SOCIAL & COMMUNITY LIFE
id: social_overview
title: Social & Community Life
subtitle: Your role, influence, and presence in groups

DECISIONS & LIFE DIRECTION
id: decisions_overview
title: Decisions & Life Direction
subtitle: How you evaluate choices and what environments help you thrive

WELL-BEING & LIFESTYLE
id: wellbeing_overview
title: Well-Being & Lifestyle
subtitle: Stress, burnout, pleasure, and the rhythms that sustain you

YOUR RELATIONAL LANDSCAPE
id: family_attractions
title: Your Relational Landscape
subtitle: Who you attract, who balances you, and who triggers you
```

---

## System Prompt Architecture

Each module call uses the **same base system prompt** as the core interpretation (the full Five Families reference material, tone guidelines, and formatting rules) with a **module-specific extension** appended at the end that replaces the OUTPUT STRUCTURE section.

Create a utility function `buildModulePrompt(baseSystemPrompt: string, moduleExtension: string): string` that concatenates them cleanly.

Below are the `systemPromptExtension` strings for each module. These should be stored in `modules.ts` alongside the module definitions.

---

### relationships_overview

```
## YOUR TASK FOR THIS MODULE: RELATIONSHIPS & PERSONAL LIFE

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their romantic life, friendships, and family dynamics. Cover all of the following areas woven together in flowing prose — do not use bullet points or subheadings within the text. Organize your response into the following clearly labeled sections:

### Dating & Romantic Attraction
How this composition shapes who they are drawn to, what they bring to early romance, and the patterns that tend to emerge in dating. Include which family energies they are likely to find magnetic and why.

### Long-Term Partnership
How their energy functions in sustained intimate partnership — what they offer, what they need, and where friction tends to arise over time.

### Sexual & Sensual Energy
How their composition shapes their relationship to physical intimacy, desire, and sensuality. Be warm, direct, and non-clinical.

### Friendship & Chosen Family
How they show up as a friend — their style, their gifts, their blind spots in friendship.

### Family Roles & Patterns
The roles they tend to take within family systems — family of origin and family they create.

### Communication & Conflict in Relationships
Their characteristic communication style in close relationships and how they tend to navigate conflict — including the shadow patterns that emerge under stress.

Keep the tone warm, specific, and intimate. This section should feel like relationship insight from a wise counselor who knows them well. Total length: approximately 600–800 words.
```

---

### work_overview

```
## YOUR TASK FOR THIS MODULE: WORK & PROFESSIONAL LIFE

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their professional life. Organize your response into the following clearly labeled sections, written in flowing prose:

### Career Strengths & Natural Talents
The professional gifts this composition brings — what they are genuinely excellent at and why.

### Leadership Style
How they lead when at their best, and the shadow patterns that emerge in their leadership under pressure.

### Team Role & Collaboration
Their natural role in collaborative environments — how they contribute, how they prefer to work with others, and where friction with colleagues tends to arise.

### Decision-Making at Work
How they characteristically approach professional decisions — their instincts, their process, and their blind spots.

### Entrepreneurship vs. Employment
Whether their energy tends to thrive with independence and risk or with structure and collaboration — and the nuances within that.

### Negotiation & Influence
How they naturally negotiate, persuade, and influence — and the habitual patterns that can undermine them.

Keep the tone grounded and practical while remaining spiritually aware. This section should feel like insight from a mentor who understands both their gifts and their growing edges. Total length: approximately 600–800 words.
```

---

### psychological_overview

```
## YOUR TASK FOR THIS MODULE: PSYCHOLOGICAL & INNER WORK

Write a rich, personalized exploration of this person's psychological landscape as revealed by their Buddha Family composition. Organize your response into the following clearly labeled sections, written in flowing prose:

### Emotional Triggers & Reactive Patterns
The situations, dynamics, and relational patterns most likely to activate their reactive emotional states — and what that reactivity tends to look like.

### Shadow Tendencies
Where their family energy becomes distorted under stress or in unconscious expression. Be honest, specific, and compassionate — this is the most important section of this module.

### Healthy vs. Confused Expression
What it looks and feels like when their energy is expressing wisely versus when it has tipped into its habitual confused pattern. Help them recognize the difference from the inside.

### Personal Growth Practices
The kinds of inner work, therapeutic approaches, and contemplative practices most likely to be effective for this specific composition.

### Common Blind Spots
What this composition tends not to see about itself — the habitual misperceptions and self-narratives that keep it stuck.

Write with psychological sophistication and genuine compassion. This section should feel like insight from a skilled therapist who also understands the dharma. Total length: approximately 600–800 words.
```

---

### spiritual_overview

```
## YOUR TASK FOR THIS MODULE: SPIRITUAL PRACTICE

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their spiritual life and practice. This section may go somewhat deeper into Buddhist terminology than the core interpretation — assume the reader has some familiarity with dharma. Organize your response into the following clearly labeled sections, written in flowing prose:

### Meditation Style
The meditation approaches most naturally suited to this composition — what tends to work, what tends to be challenging, and why.

### Common Obstacles in Practice
The characteristic ways this composition gets stuck on the cushion and in practice more broadly — the specific flavors of resistance, distraction, and confusion most likely to arise.

### Approach to Discipline & Commitment
How this composition tends to relate to practice discipline, commitment, and consistency — the gifts and the pitfalls.

### Devotion vs. Inquiry
Whether this composition tends more naturally toward devotional practice or investigative inquiry — and how to work skillfully with whichever comes less naturally.

### Transforming the Core Klesha
A specific and evocative exploration of how this person can work directly with the primary confused emotion of their dominant family — the path from that specific confusion to its corresponding wisdom. This is the heart of this module.

Write with warmth, depth, and genuine dharmic understanding. This section should feel like a teaching given specifically to this practitioner. Total length: approximately 600–800 words.
```

---

### creativity_overview

```
## YOUR TASK FOR THIS MODULE: CREATIVITY & EXPRESSION

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their creative life. Organize your response into the following clearly labeled sections, written in flowing prose:

### Creative Strengths
The specific creative gifts and capacities this composition brings — what they naturally excel at in any creative endeavor.

### Aesthetic Tendencies
The aesthetic sensibilities, artistic styles, and forms of expression this composition tends to be drawn to and excel in.

### How Inspiration Arises
The conditions, states, and circumstances under which this composition is most likely to access genuine creative inspiration — and what tends to shut it down.

### Creative Blocks
The characteristic ways this composition gets stuck creatively — the habitual patterns and fears that interrupt creative flow.

### Creating as Practice
How creative work can function as a genuine contemplative and transformative practice for this specific composition.

Keep the tone alive and evocative — let the writing itself model the creative energy being described. Total length: approximately 500–700 words.
```

---

### social_overview

```
## YOUR TASK FOR THIS MODULE: SOCIAL & COMMUNITY LIFE

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their social presence and community life. Organize your response into the following clearly labeled sections, written in flowing prose:

### Role in Groups & Communities
The natural role this composition tends to take in group settings — what function they serve, what energy they bring, and where they gravitate.

### How You Influence Others
The characteristic ways this composition affects and influences the people around them — often without trying.

### How Others Tend to Perceive You
The impressions this composition tends to make on others — both the positive perceptions and the misreadings that sometimes arise.

### Conflict in Groups
How this composition tends to respond when conflict arises in communities or groups — constructive tendencies and shadow patterns alike.

### Finding Your Community
What kinds of communities, groups, and social environments allow this composition to thrive — and which tend to drain or frustrate it.

Total length: approximately 500–700 words.
```

---

### decisions_overview

```
## YOUR TASK FOR THIS MODULE: DECISIONS & LIFE DIRECTION

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their approach to major decisions and the arc of their life. Organize your response into the following clearly labeled sections, written in flowing prose:

### How You Evaluate Opportunities
The instincts, values, and processes this composition brings to evaluating choices — what they pay attention to and what they tend to overlook.

### Risk Tolerance
How this composition characteristically relates to risk, uncertainty, and the unknown — including how that changes under stress.

### Life Path Tendencies
The kinds of life paths, callings, and trajectories this composition tends to be drawn toward — and the ones it tends to avoid or struggle with.

### Environments That Help You Thrive
The physical, social, and professional environments in which this composition does its best work and feels most alive — and those that tend to diminish it.

### When You're Lost
How this composition tends to behave when directionless or at a crossroads — and what tends to help it find its way.

Total length: approximately 500–700 words.
```

---

### wellbeing_overview

```
## YOUR TASK FOR THIS MODULE: WELL-BEING & LIFESTYLE

Write a rich, personalized exploration of how this person's Buddha Family composition shapes their relationship to health, rest, pleasure, and sustainable living. Organize your response into the following clearly labeled sections, written in flowing prose:

### Stress Patterns
How stress characteristically manifests for this composition — the early warning signs and the full expression when it is not addressed.

### Burnout Tendencies
The specific burnout patterns most likely for this composition — how it develops, what it looks like, and how to recognize it early.

### Healthy Routines & Rhythms
The kinds of daily rhythms, physical practices, and lifestyle structures most naturally supportive for this composition.

### Relationship to Pleasure, Comfort & Discipline
How this composition characteristically navigates the tension between indulgence and discipline — and what balance tends to look like at its healthiest.

### Rest & Restoration
What genuine rest looks and feels like for this composition — and what they tend to substitute for it.

Total length: approximately 500–700 words.
```

---

### family_attractions

```
## YOUR TASK FOR THIS MODULE: YOUR RELATIONAL LANDSCAPE

Write a rich, personalized exploration of how this person's composition interacts with the other four Buddha Family energies in relational dynamics. This is one of the most shareable and personally resonant modules. Organize your response into the following clearly labeled sections, written in flowing prose:

### Who You Tend to Attract
The family energies this composition most reliably draws into their life romantically, professionally, and socially — and why those particular energies are magnetized to them.

### Who Balances You
The family energies that tend to complement and stabilize this composition — the qualities they bring that fill in what this composition naturally lacks.

### Who Tends to Trigger You
The family energies most likely to activate reactivity, irritation, or difficulty in this composition — and the deeper reason why those energies are challenging.

### Your Archetypal Role
The mythic or archetypal role this composition tends to inhabit — warrior, healer, sage, builder, artist, trickster, or another figure that captures something essential about how they move through the world. Be specific and evocative rather than generic.

### Ideal Environments
The physical environments, social contexts, and life settings in which this composition feels most alive, most themselves, and most effective.

Write this section with warmth and a touch of delight — this is the module people will want to screenshot and share. Total length: approximately 600–800 words.
```

---

## The Pairings Feature

Add a separate interactive feature below the module grid called **"Explore a Pairing."** This allows users to select any two-family combination and receive a generated exploration of that relational dynamic.

Display a clean two-panel selector — **"Choose a Family"** and **"Choose a Role or Context"** — producing combinations like:

- Vajra + Padma — Romantic Partnership
- Ratna + Karma — Working Relationship
- Buddha + Vajra — Teacher & Student
- Padma + Karma — Creative Collaboration
- Any family + Any other family — Friendship

The available role/context options are: Romantic Partnership, Close Friendship, Working Relationship, Teacher & Student, Creative Collaboration, Family Dynamic.

Each pairing is generated on demand via the API using the following system prompt extension:

```
## YOUR TASK FOR THIS MODULE: FAMILY PAIRING EXPLORATION

The user wants to understand the dynamic between [FAMILY A] energy and [FAMILY B] energy in the context of [CONTEXT].

Write a rich, specific exploration of this particular pairing. Do not write generically about either family in isolation — focus entirely on the dynamic between them. Organize your response into the following clearly labeled sections in flowing prose:

### The Core Dynamic
What fundamentally defines the relationship between these two energies — the essential nature of their interaction, their resonance, and their friction.

### What Each Brings
What the [FAMILY A] energy characteristically contributes to this dynamic, and what the [FAMILY B] energy contributes — and how those contributions interact.

### Where It Flows
The conditions under which this pairing works beautifully — when it is at its most complementary, creative, and mutually enriching.

### Where It Gets Stuck
The characteristic friction points and recurring difficulties of this pairing — the patterns that tend to emerge when both energies are in their confused expression.

### The Growth Invitation
What this pairing asks of each party — the growth edge this particular dynamic tends to activate, and what becomes possible when both parties meet it.

Write with warmth, specificity, and genuine insight. Total length: approximately 400–600 words.
```

Substitute `[FAMILY A]`, `[FAMILY B]`, and `[CONTEXT]` dynamically at call time. The user's own primary family should be pre-selected as Family A by default, but they can change it.

Note: pairings are not personalized to the user's scores — they are general explorations of the two-family dynamic. They do not need to be included in the export unless the user explicitly requests it.

---

## Export Integration

Modules that the user has generated should be automatically included in all export formats.

**PDF Export:** After the core interpretation, add a page break followed by each completed module in order, with its title as a styled section header. Use the same typography and color scheme as the on-screen display.

**Share Link:** Extend the URL encoding to include a `modules` parameter listing the IDs of completed modules. When a shared link is opened, display the core interpretation as normal and show the completed modules as already-expanded cards. Since module content is AI-generated and too long for URL encoding, re-generate the content on load for any modules listed in the URL — the scores are deterministic enough that the results will be substantively equivalent.

**Text Export:** Include all completed module content as clearly delineated sections in the exported plain text, separated by horizontal rules.

---

## SessionStorage Caching

Cache each generated module in `sessionStorage` using the key pattern `module_[moduleId]_[scoresHash]`. On load, check for cached content before calling the API. Completed modules should also be tracked in a `completedModules` array in the quiz state so the export functions know what to include.

---

## Build Order

1. Define all modules in `modules.ts` with their IDs, titles, subtitles, categories, and system prompt extensions
2. Build the `buildModulePrompt` utility
3. Extend the `/api/interpret/route.ts` to accept an optional `moduleId` parameter and route to the correct prompt
4. Build the module card grid UI with the three card states
5. Build the streaming display for module content
6. Build the pairings selector UI and API integration
7. Extend PDF export to include completed modules
8. Extend share link encoding and decoding for modules
9. Extend text export for modules
10. Implement sessionStorage caching for all modules

---

## Important Notes

- This is a self-contained feature addition. The existing core interpretation infrastructure — the API route, streaming logic, sessionStorage caching pattern, and results page layout — should be reused and extended rather than rebuilt.
- The base system prompt (the full Five Families reference material and tone guidelines from Section 2) must be included in every module API call, with the module-specific extension appended after it replacing the OUTPUT STRUCTURE section.
- All module content uses the same API configuration as the core interpretation: `claude-sonnet-4-20250514`, max tokens `2000`, temperature `0.7`, streaming `true`.
- The `ANTHROPIC_API_KEY` environment variable must never be exposed to the client under any circumstances.
