import { useState } from 'react'
import { useShareUrl } from '../../hooks/useShareUrl'
import type { FamilyScores } from '../../types'
import Button from '../shared/Button'

interface ShareButtonProps {
  scores: FamilyScores | null
  completedModuleIds?: string[]
  shareUrl?: string
}

export default function ShareButton({
  scores,
  completedModuleIds = [],
  shareUrl: shareUrlProp,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const fallbackUrl = useShareUrl(scores, completedModuleIds)
  const shareUrl = shareUrlProp ?? fallbackUrl

  const handleCopy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button variant="secondary" onClick={handleCopy} disabled={!shareUrl}>
      {copied ? 'Copied!' : 'Copy Share Link'}
    </Button>
  )
}
