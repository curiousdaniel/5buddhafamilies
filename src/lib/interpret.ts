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

export function getModuleCacheKey(moduleId: string, scores: FamilyScores): string {
  const base = getInterpretationCacheKey(scores)
  return `module_${moduleId}_${base}`
}

export function getPairingCacheKey(
  familyA: string,
  familyB: string,
  context: string
): string {
  return `pairing_${familyA}_${familyB}_${context.replace(/\s+/g, '_')}`
}

export interface CompletedModule {
  id: string
  title: string
  content: string
}

export function parseInterpretationSections(text: string): { title: string; body: string }[] {
  const parts = text.split(/(?=###\s)/)
  const sections: { title: string; body: string }[] = []
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const firstNewline = trimmed.indexOf('\n')
    const title =
      firstNewline >= 0
        ? trimmed.slice(0, firstNewline).replace(/^###\s*/, '')
        : trimmed.replace(/^###\s*/, '')
    const body = firstNewline >= 0 ? trimmed.slice(firstNewline).trim() : ''
    if (title) sections.push({ title, body })
  }
  return sections
}

export function getCompletedModules(
  scores: FamilyScores,
  modules: { id: string; title: string }[]
): CompletedModule[] {
  const result: CompletedModule[] = []
  if (typeof sessionStorage === 'undefined') return result
  for (const mod of modules) {
    const cacheKey = getModuleCacheKey(mod.id, scores)
    const content = sessionStorage.getItem(cacheKey)
    if (content) {
      result.push({ id: mod.id, title: mod.title, content })
    }
  }
  return result
}
