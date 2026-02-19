import type { FamilyScores } from '../types'

const FAMILY_NAMES: Record<string, string> = {
  buddha: 'Buddha',
  vajra: 'Vajra',
  ratna: 'Ratna',
  padma: 'Padma',
  karma: 'Karma',
}

export function scoresToApiFormat(scores: FamilyScores): Record<string, number> {
  return Object.fromEntries(
    Object.entries(scores.percentages).map(([k, v]) => [
      FAMILY_NAMES[k] ?? k,
      Math.round(v),
    ])
  )
}

export function getInterpretationCacheKey(scores: FamilyScores): string {
  const b = Math.round(scores.percentages.buddha ?? 0)
  const v = Math.round(scores.percentages.vajra ?? 0)
  const r = Math.round(scores.percentages.ratna ?? 0)
  const p = Math.round(scores.percentages.padma ?? 0)
  const k = Math.round(scores.percentages.karma ?? 0)
  return `interpretation_${b}_${v}_${r}_${p}_${k}`
}
