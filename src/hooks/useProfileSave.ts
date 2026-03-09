import { useState, useCallback, useEffect } from 'react'
import type { FamilyScores } from '../types'
import { getFamilyByCode } from '../data/families'
import { getCompletedModules, getInterpretationCacheKey } from '../lib/interpret'
import { MODULES } from '../data/modules'

function getProfileSlugKey(scores: FamilyScores | null): string {
  if (!scores) return 'buddha_quiz_profile_slug'
  return `buddha_quiz_profile_slug_${getInterpretationCacheKey(scores)}`
}

export function getStoredProfileSlug(scores: FamilyScores | null): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(getProfileSlugKey(scores))
}

export function setStoredProfileSlug(slug: string, scores: FamilyScores | null): void {
  sessionStorage.setItem(getProfileSlugKey(scores), slug)
}

export function useProfileSave(
  scores: FamilyScores | null,
  coreInterpretation: string,
  interpretationDone: boolean
) {
  const [profileSlug, setProfileSlug] = useState<string | null>(() =>
    scores ? getStoredProfileSlug(scores) : null
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (scores) {
      const stored = getStoredProfileSlug(scores)
      if (stored) setProfileSlug(stored)
    }
  }, [scores])

  const saveProfile = useCallback(async () => {
    if (!scores || !coreInterpretation || !interpretationDone) return
    setSaving(true)
    setSaveError(null)
    try {
      const primaryFamily = getFamilyByCode(scores.primary).name
      const secondaryFamily = getFamilyByCode(scores.secondary).name
      const completedModules = getCompletedModules(scores, MODULES)
      const res = await fetch('/api/profile/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,
          primaryFamily,
          secondaryFamily,
          coreInterpretation,
          completedModules: completedModules.map((m) => ({ id: m.id, content: m.content })),
          quizMode: 'full',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save')
      }
      const { slug } = await res.json()
      setStoredProfileSlug(slug, scores)
      setProfileSlug(slug)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }, [scores, coreInterpretation, interpretationDone])

  const updateModule = useCallback(
    async (moduleId: string, content: string) => {
      const slug = scores ? getStoredProfileSlug(scores) : null
      if (!slug) return
      try {
        await fetch('/api/profile/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, module: { id: moduleId, content } }),
        })
      } catch {
        // Silent fail for incremental updates
      }
    },
    [scores]
  )

  return { profileSlug, saveProfile, updateModule, saving, saveError }
}
