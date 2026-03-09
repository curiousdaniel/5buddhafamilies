import { useState, useCallback } from 'react'
import type { FamilyCode } from '../types'
import { getPairingCacheKey } from '../lib/interpret'
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

export type PairingStatus = 'idle' | 'loading' | 'streaming' | 'done' | 'error'

export function usePairingInterpretation() {
  const [content, setContent] = useState('')
  const [sections, setSections] = useState<InterpretationSection[]>([])
  const [status, setStatus] = useState<PairingStatus>('idle')

  const fetchAndStream = useCallback(
    async (familyA: FamilyCode, familyB: FamilyCode, context: string) => {
      const cacheKey = getPairingCacheKey(familyA, familyB, context)
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setContent(cached)
        setSections(parseSectionsFromText(cached))
        setStatus('done')
        return
      }

      setStatus('loading')

      try {
        const res = await fetch('/api/interpret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            familyA,
            familyB,
            context,
          }),
        })

        if (!res.ok) throw new Error('Pairing interpretation failed')

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
    },
    []
  )

  const reset = useCallback(() => {
    setContent('')
    setSections([])
    setStatus('idle')
  }, [])

  return { content, sections, status, fetchAndStream, reset }
}
