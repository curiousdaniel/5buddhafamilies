export type FamilyCode = 'buddha' | 'vajra' | 'ratna' | 'padma' | 'karma'

export type QuizMode = 'secular' | 'sacred' | 'full'

export type QuestionCategory =
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

export interface Option {
  id: string
  family: FamilyCode
  text: string
}

export interface Question {
  id: string
  category: QuestionCategory
  text: string
  options: Option[]
}

export interface FamilyProfile {
  code: FamilyCode
  name: string
  color: string
  element: string
  direction: string
  wisdomQuality: string
  neuroticPattern: string
  transmutation: string
  strengths: string[]
  growingEdges: string[]
  practiceSuggestions: string[]
  balancedTraits: string[]
  confusedTraits: string[]
}

export interface CombinationDescription {
  primary: FamilyCode
  secondary: FamilyCode
  description: string
}

export interface FamilyScores {
  raw: Record<FamilyCode, number>
  percentages: Record<FamilyCode, number>
  primary: FamilyCode
  secondary: FamilyCode
}
