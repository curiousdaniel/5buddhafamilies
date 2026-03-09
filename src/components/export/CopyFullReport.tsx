import { useState } from 'react'
import type { FamilyScores } from '../../types'
import type { InterpretationSection } from '../../hooks/useInterpretation'
import type { CompletedModule } from '../../lib/interpret'
import { getFamilyByCode } from '../../data/families'
import Button from '../shared/Button'

const HORIZONTAL_RULE = '\n\n---\n\n'

interface CopyFullReportProps {
  scores: FamilyScores | null
  interpretationSections?: InterpretationSection[] | null
  interpretationError?: boolean
  interpretationReady?: boolean
  completedModules?: CompletedModule[]
}

function formatSection(title: string, body: string): string {
  return `${title}\n\n${body}`
}

export default function CopyFullReport({
  scores,
  interpretationSections,
  interpretationError,
  interpretationReady = true,
  completedModules = [],
}: CopyFullReportProps) {
  const [copied, setCopied] = useState(false)

  const getFullReportText = () => {
    if (!scores) return ''
    const parts: string[] = []

    parts.push('Five Buddha Families — Your Personal Composition')
    parts.push('')
    const primary = getFamilyByCode(scores.primary)
    const secondary = getFamilyByCode(scores.secondary)
    parts.push(`Primary: ${primary.name} | Secondary: ${secondary.name}`)
    parts.push('')
    parts.push(HORIZONTAL_RULE)

    if (interpretationError) {
      parts.push(
        'We were unable to generate your personal reading at this time.'
      )
    } else if (interpretationSections && interpretationSections.length > 0) {
      parts.push('Your Personal Interpretation')
      parts.push('')
      for (const sec of interpretationSections.filter((s) => s.complete)) {
        parts.push(formatSection(sec.title, sec.body))
        parts.push('')
      }
    }

    for (const mod of completedModules) {
      parts.push(HORIZONTAL_RULE)
      parts.push(mod.title)
      parts.push('')
      parts.push(mod.content)
    }

    return parts.join('\n')
  }

  const handleCopy = async () => {
    const text = getFullReportText()
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleCopy}
      disabled={!scores || !interpretationReady}
    >
      {copied ? 'Copied!' : 'Copy Full Report'}
    </Button>
  )
}
