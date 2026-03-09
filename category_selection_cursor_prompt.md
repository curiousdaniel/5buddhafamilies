# Feature Prompt: Multi-Category Quiz Selection

## Overview

The question bank has grown from 2 categories (Secular, Sacred) to 10 categories. We need to replace the existing quiz mode selector with a rich, flexible category selection experience that lets users choose exactly which categories they want to include in their quiz. The scoring and results system must be updated to weight scores correctly regardless of which combination of categories the user selects.

---

## The Full Category List

The CSV question bank now contains the following categories. Each has an `id`, display `title`, `subtitle`, and `questionRange` for reference:

```typescript
type QuizCategory = {
  id: string;
  title: string;
  subtitle: string;
  questionCount: number;
  icon: string; // emoji or icon name
};

const CATEGORIES: QuizCategory[] = [
  {
    id: 'secular',
    title: 'Everyday Life',
    subtitle: 'Work, relationships, money, and how you move through the world',
    questionCount: 24,
    icon: '🌍',
  },
  {
    id: 'sacred',
    title: 'Buddhist Practice',
    subtitle: 'Meditation, dharma study, sangha, and the path',
    questionCount: 21,
    icon: '🪷',
  },
  {
    id: 'embodiment',
    title: 'Body & Senses',
    subtitle: 'How your energy lives in your physical experience',
    questionCount: 10,
    icon: '🫀',
  },
  {
    id: 'aesthetic',
    title: 'Aesthetic & Beauty',
    subtitle: 'What you find beautiful and how beauty shapes your world',
    questionCount: 10,
    icon: '🎨',
  },
  {
    id: 'time',
    title: 'Your Relationship to Time',
    subtitle: 'Punctuality, pace, past, future, and how time feels',
    questionCount: 10,
    icon: '⏳',
  },
  {
    id: 'falling_apart',
    title: 'When Things Fall Apart',
    subtitle: 'Crisis, loss, failure, and how you find your way back',
    questionCount: 10,
    icon: '🌊',
  },
  {
    id: 'learning',
    title: 'Learning & Knowledge',
    subtitle: 'How you take in the world and what you do with what you learn',
    questionCount: 10,
    icon: '📚',
  },
  {
    id: 'appetite',
    title: 'Desire & Appetite',
    subtitle: 'What you hunger for and how you relate to wanting',
    questionCount: 10,
    icon: '🔥',
  },
  {
    id: 'humor',
    title: 'Humor & Play',
    subtitle: 'What makes you laugh and how you play',
    questionCount: 10,
    icon: '😄',
  },
  {
    id: 'childhood',
    title: 'Childhood & Origins',
    subtitle: 'The child you were and what still echoes from that time',
    questionCount: 10,
    icon: '🌱',
  },
];
```

---

## Data Layer Updates

### questions.ts

Update the question loading and filtering logic to support the full category set. The questions are already categorized in the CSV — ensure the `category` field is preserved on each `Question` object and that questions can be filtered by an array of selected category IDs.

```typescript
// Filter questions by selected categories
function getQuestionsForCategories(
  allQuestions: Question[],
  selectedCategories: string[]
): Question[] {
  return allQuestions.filter((q) =>
    selectedCategories.includes(q.category)
  );
}
```

### Quiz State

Update the quiz state to store `selectedCategories` as an array of category IDs rather than a single `quizMode` string. All downstream logic — question filtering, progress tracking, scoring, session storage, saved profiles, and share links — should reference `selectedCategories`.

```typescript
type QuizState = {
  selectedCategories: string[];   // replaces quizMode
  questions: Question[];          // filtered question set
  currentIndex: number;
  responses: Record<string, Family[]>;
  finalScores: ScoreMap | null;
  profileSlug: string | null;
};
```

Update `sessionStorage` serialization to persist `selectedCategories` alongside existing state.

Update the saved profile schema to store `selectedCategories` as a `jsonb` array rather than the single `quiz_mode` text field. Run a migration in Supabase:

```sql
alter table profiles
  add column selected_categories jsonb default '["secular","sacred"]';
```

---

## Category Selection UI

### Replacing the Existing Mode Selector

Remove the existing Secular / Sacred / Full toggle. Replace it with a full category selection screen that appears before the quiz begins. This screen is the new pre-quiz landing step — after the user clicks "Begin the Quiz" on the landing page, they land here before any questions are shown.

### Layout

The category selection screen should feel like a beautiful menu, not a settings panel. Use the same dark background and gold accent aesthetic as the rest of the app.

**Header:**
- Title: *"Choose Your Exploration"*
- Subtitle: *"Select the areas of life you'd like to explore. You can choose one or as many as you like."*

**Category Cards Grid:**
- Display all 10 categories as a grid — 2 columns on desktop, 1 column on mobile
- Each card shows: icon, title, subtitle, and question count (e.g., *"24 questions"*)
- Cards are **multi-selectable** — clicking toggles selection on and off
- Selected cards are highlighted using the app's gold accent color with a visible checkmark
- Unselected cards are muted but clearly clickable

**Selection Controls:**
Below the grid, show three quick-select options as small text links:
- *"Select All"* — selects all 10 categories
- *"Everyday + Practice"* — selects `secular` and `sacred` only (the original experience)
- *"Clear All"* — deselects everything

**Question Count Summary:**
As the user toggles categories, show a live-updating summary below the controls:
- *"You've selected [N] questions across [M] categories"*
- If zero categories are selected, show: *"Select at least one category to continue"* and disable the continue button
- If more than 80 questions are selected, show a gentle note: *"This is a longer journey — set aside about [estimated minutes] minutes"* (estimate at roughly 45 seconds per question)

**Continue Button:**
- Label: *"Begin — [N] Questions"*
- Disabled if no categories are selected
- Styled in the app's primary gold/dark style
- On click, filters the question bank to the selected categories, shuffles within each category (preserving category grouping if desired, or fully randomizing across categories — see note below), and navigates to the first question

**Randomization Note:**
Give Cursor a choice to make here: questions can either be presented category by category (all Embodiment questions together, then all Humor questions, etc.) or fully shuffled across all selected categories. **Recommend full shuffle across all categories** — it produces a more engaging, less predictable experience and prevents the user from realizing which category they are in and adjusting their answers accordingly. Implement full shuffle as the default.

---

## Quiz Experience Updates

### Progress Bar

Update the progress bar to show progress through the total selected question set, not a fixed number. The label should read *"Question [N] of [Total]"* where Total is the count of questions in the selected categories.

### Category Badge

The existing category badge on each question card currently shows "Everyday Life" or "Buddhist Practice". Keep this badge — it gives useful context — but update it to display the correct category title for all 10 categories using the `CATEGORIES` lookup.

### Back Navigation

Back navigation should work correctly through the full selected question set regardless of category mix.

---

## Scoring Updates

The scoring logic does not need to change — each selected answer still adds one point to the corresponding family regardless of which category the question came from. The normalization to percentages handles any variation in total question count automatically.

However, update the results page to show which categories were included in the user's quiz. Add a subtle line beneath the composition chart, something like:

*"Based on your responses across: Everyday Life, Body & Senses, Humor & Play, and Childhood & Origins"*

This helps the user understand the basis of their results and may prompt them to retake the quiz with different or additional categories.

---

## Saved Profile Updates

Update the profile save payload and the `/api/profile/save` route to include `selectedCategories`:

```typescript
type SaveProfileRequest = {
  scores: Record<string, number>;
  primaryFamily: string;
  secondaryFamily: string;
  coreInterpretation: string;
  completedModules: Array<{ id: string; content: string }>;
  selectedCategories: string[];  // replaces quizMode
};
```

On the saved profile page (`/profile/[slug]`), display the selected categories in the same subtle line beneath the chart as on the live results page.

---

## Share Link Updates

Update the URL encoding for the share link to include the selected categories. Extend the query parameter encoding to include a `cats` parameter containing a comma-separated list of selected category IDs:

```
/results?scores=V38P27K20R10B5&cats=secular,sacred,humor,childhood
```

When the share link is loaded, restore the selected categories from the URL and display them on the profile page.

---

## AI Interpretation Updates

The core interpretation system prompt does not need to change. However, pass the selected categories to the API route and append a single line to the user message so Claude is aware of the basis of the scores:

```
These scores are based on the user's responses in the following categories: [comma-separated category titles].
```

This allows Claude to subtly calibrate its interpretation — for example, if someone only completed the Childhood and Falling Apart categories, the interpretation can acknowledge that the picture is drawn from a particular angle.

---

## Landing Page Updates

Update the landing page to remove any reference to the old Secular / Sacred / Full toggle. Replace it with a single **"Begin the Quiz"** CTA that takes the user to the new category selection screen. If you want to give users a preview of what they're in for, add a small line beneath the CTA listing the 10 available categories as tags or pills — purely decorative, not interactive on the landing page.

---

## Retake Experience

When a user clicks "Retake the Quiz" from the results page or a saved profile, take them back to the category selection screen with their previously selected categories pre-selected. This makes it easy to retake with the same configuration or to add new categories to see how their results shift.

---

## Build Order

1. Update `questions.ts` to load all 10 categories and support array-based filtering
2. Define the `CATEGORIES` constant in a new `categories.ts` file
3. Update quiz state type to use `selectedCategories` array
4. Build the category selection screen UI
5. Wire up the "Begin" button to filter and shuffle questions based on selection
6. Update progress bar and category badge for the full question set
7. Update the results page to display selected categories beneath the chart
8. Update the save payload and Supabase schema
9. Update share link encoding and decoding
10. Update the AI interpretation user message to include category context
11. Update the landing page CTA
12. Update the retake flow to pre-select previous categories
13. End-to-end test with various category combinations including single-category, all-categories, and the original secular+sacred combination
