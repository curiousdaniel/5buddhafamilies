import type { FamilyCode, FamilyScores } from '../types'
import { QUESTIONS } from '../data/questions'

const FAMILY_ORDER: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

const optionToFamily = new Map<string, FamilyCode>()
for (const q of QUESTIONS) {
  for (const opt of q.options) {
    optionToFamily.set(opt.id, opt.family)
  }
}

export function getFamilyByOptionId(optionId: string): FamilyCode | undefined {
  return optionToFamily.get(optionId)
}

export function calculateScores(answers: Record<string, string[]>): FamilyScores {
  const raw: Record<FamilyCode, number> = {
    buddha: 0,
    vajra: 0,
    ratna: 0,
    padma: 0,
    karma: 0,
  }

  for (const selectedIds of Object.values(answers)) {
    for (const id of selectedIds) {
      const family = getFamilyByOptionId(id)
      if (family) raw[family]++
    }
  }

  const total = (Object.values(raw) as number[]).reduce((a, b) => a + b, 0)
  const percentages: Record<FamilyCode, number> = {
    buddha: total > 0 ? (raw.buddha / total) * 100 : 20,
    vajra: total > 0 ? (raw.vajra / total) * 100 : 20,
    ratna: total > 0 ? (raw.ratna / total) * 100 : 20,
    padma: total > 0 ? (raw.padma / total) * 100 : 20,
    karma: total > 0 ? (raw.karma / total) * 100 : 20,
  }

  const sorted = [...FAMILY_ORDER].sort((a, b) => percentages[b] - percentages[a])
  const primary = sorted[0]
  const secondary = sorted[1]

  return { raw, percentages, primary, secondary }
}
