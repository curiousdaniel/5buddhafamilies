export type QuizCategoryId =
  | 'secular'
  | 'sacred'
  | 'embodiment'
  | 'aesthetic'
  | 'time'
  | 'falling_apart'
  | 'learning'
  | 'appetite'
  | 'humor'
  | 'childhood'

export interface QuizCategory {
  id: QuizCategoryId
  title: string
  subtitle: string
  questionCount: number
  icon: string
}

export const CATEGORIES: QuizCategory[] = [
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
]

export function getCategoryById(id: string): QuizCategory | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

export function getCategoryTitle(id: string): string {
  return getCategoryById(id)?.title ?? id
}
