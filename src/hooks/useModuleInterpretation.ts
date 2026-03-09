import { useState, useEffect, useCallback } from 'react'
import type { FamilyScores } from '../types'
import { scoresToApiFormat, getModuleCacheKey } from '../lib/interpret'
import type { InterpretationSection } from './useInterpretation'

function parseSectionsFromText(text: string): InterpretationSection[] {
  const parts = text.split(/(?=###\s)/)
  const sections: InterpretationSection[] = []

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    const firstNewline = trimmed.indexOf('\n')
    const title =
      firstNewline >= 0
        ? trimmed.slice(0, firstNewline).replace(/^###\s*/, '')
        : trimmed.replace(/^###\s*/, '')
    const body = firstNewline >= 0 ? trimmed.slice(firstNewline).trim() : ''

    if (title) {
      sections.push({ title, body, complete: true })
    }
  }

  return sections
}

function parseStreamingSections(text: string): InterpretationSection[] {
  const parts = text.split(/(?=###\s)/)
  const sections: InterpretationSection[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim()
    if (!part) continue

    const firstNewline = part.indexOf('\n')
    const title =
      firstNewline >= 0
        ? part.slice(0, firstNewline).replace(/^###\s*/, '')
        : part.replace(/^###\s*/, '')
    const body = firstNewline >= 0 ? part.slice(firstNewline).trim() : ''

    if (title) {
      const isLast = i === parts.length - 1
      sections.push({ title, body, complete: !isLast })
    }
  }

  return sections
}

export type ModuleStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export function useModuleInterpretation(
  moduleId: string,
  scores: FamilyScores | null
) {
  const [content, setContent] = useState('')
  const [sections, setSections] = useState<InterpretationSection[]>([])
  const [status, setStatus] = useState<ModuleStatus>('idle')

  useEffect(() => {
    if (!scores) return
    const cacheKey = getModuleCacheKey(moduleId, scores)
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      setContent(cached)
      setSections(parseSectionsFromText(cached))
      setStatus('done')
    } else {
      setStatus('idle')
    }
  }, [moduleId, scores])

  const fetchAndStream = useCallback(async () => {
    if (!scores) return

    const cacheKey = getModuleCacheKey(moduleId, scores)
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      setContent(cached)
      setSections(parseSectionsFromText(cached))
      setStatus('done')
      return
    }

    setStatus('loading')

    try {
      const apiScores = scoresToApiFormat(scores)
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: apiScores, moduleId }),
      })

      if (!res.ok) throw new Error('Module interpretation failed')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let fullText = ''
      setStatus('streaming')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setContent(fullText)
        setSections(parseStreamingSections(fullText))
      }

      sessionStorage.setItem(cacheKey, fullText)
      setSections(parseSectionsFromText(fullText))
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }, [moduleId, scores])

  return { content, sections, status, fetchAndStream }
}

export function getCachedModuleContent(
  moduleId: string,
  scores: FamilyScores | null
): string | null {
  if (!scores) return null
  const cacheKey = getModuleCacheKey(moduleId, scores)
  return sessionStorage.getItem(cacheKey)
}
