import { useMemo } from 'react'
import type { FamilyScores, FamilyCode } from '../types'

const FAMILY_ORDER: readonly FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

export function encodeScoresToUrl(percentages: Record<string, number>): string {
  const parts = FAMILY_ORDER.map((f) => `${f}:${Math.round(percentages[f] ?? 0)}`)
  return parts.join(',')
}

export function decodeScoresFromUrl(search: string): FamilyScores | null {
  const params = new URLSearchParams(search)
  const scoresParam = params.get('scores')
  if (!scoresParam) return null

  const percentages: Record<string, number> = {}
  const parts = scoresParam.split(',')
  for (const part of parts) {
    const [family, value] = part.split(':')
    if (family && value !== undefined) {
      const num = parseFloat(value)
      if (!isNaN(num) && FAMILY_ORDER.includes(family as FamilyCode)) {
        percentages[family] = num
      }
    }
  }

  if (Object.keys(percentages).length !== 5) return null

  const total = (Object.values(percentages) as number[]).reduce((a, b) => a + b, 0)
  if (Math.abs(total - 100) > 1) return null

  const sorted = (Object.entries(percentages) as [FamilyCode, number][]).sort(
    (a, b) => b[1] - a[1]
  )
  const primary = sorted[0]?.[0]
  const secondary = sorted[1]?.[0]
  if (!primary || !secondary) return null

  const raw: Record<FamilyCode, number> = {
    buddha: Math.round((percentages.buddha ?? 0) / 100 * 20),
    vajra: Math.round((percentages.vajra ?? 0) / 100 * 20),
    ratna: Math.round((percentages.ratna ?? 0) / 100 * 20),
    padma: Math.round((percentages.padma ?? 0) / 100 * 20),
    karma: Math.round((percentages.karma ?? 0) / 100 * 20),
  }

  return {
    raw,
    percentages: {
      buddha: percentages.buddha ?? 0,
      vajra: percentages.vajra ?? 0,
      ratna: percentages.ratna ?? 0,
      padma: percentages.padma ?? 0,
      karma: percentages.karma ?? 0,
    },
    primary,
    secondary,
  }
}

export function useShareUrl(
  scores: FamilyScores | null,
  completedModuleIds: string[] = []
) {
  return useMemo(() => {
    if (!scores) return ''
    const encoded = encodeScoresToUrl(scores.percentages)
    const base = `${window.location.origin}/results?scores=${encoded}`
    if (completedModuleIds.length > 0) {
      return `${base}&modules=${completedModuleIds.join(',')}`
    }
    return base
  }, [scores, completedModuleIds])
}

export function getModulesFromUrl(search: string): string[] {
  const params = new URLSearchParams(search)
  const modulesParam = params.get('modules')
  if (!modulesParam) return []
  return modulesParam.split(',').filter(Boolean)
}
