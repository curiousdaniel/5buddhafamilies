import { useState, useEffect, useCallback } from 'react'
import type { FamilyScores } from '../types'
import { scoresToApiFormat, getInterpretationCacheKey } from '../lib/interpret'

export interface InterpretationSection {
  title: string
  body: string
  complete: boolean
}

export type InterpretationStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

function parseSectionsFromText(text: string): InterpretationSection[] {
  const parts = text.split(/(?=###\s)/)
  const sections: InterpretationSection[] = []

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    const firstNewline = trimmed.indexOf('\n')
    const title = firstNewline >= 0 ? trimmed.slice(0, firstNewline).replace(/^###\s*/, '') : trimmed.replace(/^###\s*/, '')
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
    const title = firstNewline >= 0 ? part.slice(0, firstNewline).replace(/^###\s*/, '') : part.replace(/^###\s*/, '')
    const body = firstNewline >= 0 ? part.slice(firstNewline).trim() : ''

    if (title) {
      const isLast = i === parts.length - 1
      sections.push({ title, body, complete: !isLast })
    }
  }

  return sections
}

export function useInterpretation(scores: FamilyScores | null, selectedCategories: string[] = []) {
  const [content, setContent] = useState('')
  const [sections, setSections] = useState<InterpretationSection[]>([])
  const [status, setStatus] = useState<InterpretationStatus>('idle')
  const [error, setError] = useState<Error | null>(null)

  const fetchAndStream = useCallback(async (skipCache = false) => {
    if (!scores) return

    const cacheKey = getInterpretationCacheKey(scores)
    if (!skipCache) {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setContent(cached)
        setSections(parseSectionsFromText(cached))
        setStatus('done')
        return
      }
    }

    setStatus('loading')
    setError(null)

    try {
      const apiScores = scoresToApiFormat(scores)
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: apiScores, selectedCategories }),
      })

      if (!res.ok) {
        throw new Error('Interpretation failed')
      }

      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

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
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Interpretation failed'))
      setStatus('error')
    }
  }, [scores, selectedCategories])

  const regenerate = useCallback(() => {
    if (!scores) return
    sessionStorage.removeItem(getInterpretationCacheKey(scores))
    fetchAndStream(true)
  }, [scores, fetchAndStream])

  useEffect(() => {
    if (scores) {
      fetchAndStream()
    }
  }, [scores, fetchAndStream])

  return { content, sections, status, error, regenerate }
}
