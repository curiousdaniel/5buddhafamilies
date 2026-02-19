import type { FamilyProfile } from '../types'
import type { FamilyCode } from '../types'

export const FAMILY_CODES: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

export const families: FamilyProfile[] = [
  {
    code: 'buddha',
    name: 'Buddha',
    color: '#E8E8E8',
    element: 'Space',
    direction: 'Center',
    wisdomQuality: 'All-accommodating spaciousness',
    neuroticPattern: 'Ignorance / Confusion',
    transmutation: 'When we recognize the open ground of being, confusion dissolves into luminous clarity.',
    strengths: ['Grounded presence', 'Equanimity', 'Accommodating nature'],
    growingEdges: ['Avoiding spaciness', 'Grounding spaciousness in embodiment'],
    practiceSuggestions: ['Body-based mindfulness', 'Earth-touching meditation'],
    balancedTraits: ['Calm', 'Spacious', 'Grounded', 'Inclusive'],
    confusedTraits: ['Spacy', 'Dissociated', 'Unclear', 'Passive'],
  },
  {
    code: 'vajra',
    name: 'Vajra',
    color: '#4A7BA7',
    element: 'Water',
    direction: 'East',
    wisdomQuality: 'Mirror-like wisdom',
    neuroticPattern: 'Anger / Aggression',
    transmutation: 'When we see clearly without distortion, aggression transforms into clarity.',
    strengths: ['Clarity', 'Precision', 'Analytical insight'],
    growingEdges: ['Softening rigidity', 'Balancing clarity with warmth'],
    practiceSuggestions: ['Analytical meditation', 'Clear seeing practices'],
    balancedTraits: ['Clear', 'Precise', 'Discerning', 'Direct'],
    confusedTraits: ['Rigid', 'Critical', 'Cold', 'Controlling'],
  },
  {
    code: 'ratna',
    name: 'Ratna',
    color: '#C9A227',
    element: 'Earth',
    direction: 'South',
    wisdomQuality: 'Equanimity / Equalizing wisdom',
    neuroticPattern: 'Pride / Greed',
    transmutation: 'When we recognize inherent richness everywhere, grasping becomes generous abundance.',
    strengths: ['Generosity', 'Appreciation of beauty', 'Resourcefulness'],
    growingEdges: ['Releasing comparison', 'Giving without expectation'],
    practiceSuggestions: ['Generosity practice', 'Tonglen for self and others'],
    balancedTraits: ['Generous', 'Appreciative', 'Rich', 'Warm'],
    confusedTraits: ['Greedy', 'Proud', 'Possessive', 'Status-oriented'],
  },
  {
    code: 'padma',
    name: 'Padma',
    color: '#B85450',
    element: 'Fire',
    direction: 'West',
    wisdomQuality: 'Discriminating wisdom',
    neuroticPattern: 'Desire / Attachment',
    transmutation: 'When desire is met with discriminating awareness, craving becomes appreciation.',
    strengths: ['Connection', 'Beauty', 'Emotional intelligence'],
    growingEdges: ['Releasing clinging', 'Loving without possessing'],
    practiceSuggestions: ['Loving-kindness meditation', 'Beauty as path'],
    balancedTraits: ['Loving', 'Aesthetic', 'Connected', 'Warm'],
    confusedTraits: ['Clinging', 'Possessive', 'Overwhelmed by feeling', 'Addictive'],
  },
  {
    code: 'karma',
    name: 'Karma',
    color: '#5A8B5A',
    element: 'Air',
    direction: 'North',
    wisdomQuality: 'All-accomplishing wisdom',
    neuroticPattern: 'Envy / Jealousy',
    transmutation: 'When we act from wholeness, envy becomes skillful, effortless action.',
    strengths: ['Efficiency', 'Accomplishment', 'Dynamic energy'],
    growingEdges: ['Slowing down', 'Acting from presence rather than drive'],
    practiceSuggestions: ['Walking meditation', 'Action as offering'],
    balancedTraits: ['Accomplishing', 'Efficient', 'Dynamic', 'Skillful'],
    confusedTraits: ['Driven', 'Competitive', 'Restless', 'Never satisfied'],
  },
]

export function getFamilyByCode(code: FamilyCode): FamilyProfile {
  const family = families.find((f) => f.code === code)
  if (!family) throw new Error(`Unknown family: ${code}`)
  return family
}
