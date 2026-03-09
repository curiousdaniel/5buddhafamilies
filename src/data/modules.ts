export type ModuleCategory =
  | 'relationships'
  | 'work'
  | 'psychological'
  | 'spiritual'
  | 'creativity'
  | 'social'
  | 'decisions'
  | 'wellbeing'
  | 'pairings'

export interface Module {
  id: string
  title: string
  subtitle: string
  category: ModuleCategory
}

export const MODULES: Module[] = [
  {
    id: 'relationships_overview',
    title: 'Relationships & Personal Life',
    subtitle: 'How your energy shapes love, friendship, and family',
    category: 'relationships',
  },
  {
    id: 'work_overview',
    title: 'Work & Professional Life',
    subtitle: 'Your natural talents, leadership style, and career path',
    category: 'work',
  },
  {
    id: 'psychological_overview',
    title: 'Psychological & Inner Work',
    subtitle: 'Triggers, shadow patterns, and your path to growth',
    category: 'psychological',
  },
  {
    id: 'spiritual_overview',
    title: 'Spiritual Practice',
    subtitle: 'How your family energy shapes your path to awakening',
    category: 'spiritual',
  },
  {
    id: 'creativity_overview',
    title: 'Creativity & Expression',
    subtitle: 'How inspiration moves through you and where it gets blocked',
    category: 'creativity',
  },
  {
    id: 'social_overview',
    title: 'Social & Community Life',
    subtitle: 'Your role, influence, and presence in groups',
    category: 'social',
  },
  {
    id: 'decisions_overview',
    title: 'Decisions & Life Direction',
    subtitle: 'How you evaluate choices and what environments help you thrive',
    category: 'decisions',
  },
  {
    id: 'wellbeing_overview',
    title: 'Well-Being & Lifestyle',
    subtitle: 'Stress, burnout, pleasure, and the rhythms that sustain you',
    category: 'wellbeing',
  },
  {
    id: 'family_attractions',
    title: 'Your Relational Landscape',
    subtitle: 'Who you attract, who balances you, and who triggers you',
    category: 'pairings',
  },
]

export const PAIRING_CONTEXTS = [
  'Romantic Partnership',
  'Close Friendship',
  'Working Relationship',
  'Teacher & Student',
  'Creative Collaboration',
  'Family Dynamic',
] as const
