import { useState } from 'react'
import { useShareUrl } from '../../hooks/useShareUrl'
import type { FamilyScores } from '../../types'
import Button from '../shared/Button'

interface ShareButtonProps {
  scores: FamilyScores | null
  completedModuleIds?: string[]
}

export default function ShareButton({ scores, completedModuleIds = [] }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = useShareUrl(scores, completedModuleIds)

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
