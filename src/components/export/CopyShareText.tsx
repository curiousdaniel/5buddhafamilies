import { useState } from 'react'
import { useShareUrl } from '../../hooks/useShareUrl'
import type { FamilyScores } from '../../types'
import { getFamilyByCode } from '../../data/families'
import Button from '../shared/Button'

interface CopyShareTextProps {
  scores: FamilyScores | null
  completedModuleIds?: string[]
  shareUrl?: string
}

const QUIZ_URL = 'Take the quiz to discover yours!'

export default function CopyShareText({
  scores,
  completedModuleIds = [],
  shareUrl: shareUrlProp,
}: CopyShareTextProps) {
  const [copied, setCopied] = useState(false)
  const fallbackUrl = useShareUrl(scores, completedModuleIds)
  const shareUrl = shareUrlProp ?? fallbackUrl

  const getShareText = () => {
    if (!scores) return ''
    const primary = getFamilyByCode(scores.primary)
    const secondary = getFamilyByCode(scores.secondary)
    return `I just discovered my Five Buddha Families composition — ${primary.name} with ${secondary.name} influences. ${QUIZ_URL} ${shareUrl}`
  }

  const handleCopy = async () => {
    const text = getShareText()
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
    <Button variant="ghost" onClick={handleCopy} disabled={!scores}>
      {copied ? 'Copied!' : 'Copy Share Text'}
    </Button>
  )
}
