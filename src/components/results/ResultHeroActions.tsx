import { useState } from 'react'
import type { FamilyScores } from '../../types'
import { getFamilyByCode } from '../../data/families'
import { exportToPng, exportToPdf, exportToBlob } from '../../lib/export'
import { useShareUrl } from '../../hooks/useShareUrl'

function getAppUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return import.meta.env.VITE_APP_URL || ''
}

const IconButton = ({
  onClick,
  disabled,
  title,
  children,
  className = '',
}: {
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
  className?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg text-stone-500 hover:text-gold hover:bg-gold/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    aria-label={title}
  >
    {children}
  </button>
)

interface ResultHeroActionsProps {
  scores: FamilyScores
  heroRef: React.RefObject<HTMLElement | null>
  profileSlug?: string
  shareUrl?: string
  completedModuleIds?: string[]
  selectedCategories?: string[]
  onSaveClick?: () => void
}

export default function ResultHeroActions({
  scores,
  heroRef,
  profileSlug,
  shareUrl: shareUrlProp,
  completedModuleIds = [],
  selectedCategories = [],
  onSaveClick,
}: ResultHeroActionsProps) {
  const [copied, setCopied] = useState(false)
  const fallbackUrl = useShareUrl(scores, completedModuleIds, selectedCategories)
  const shareUrl = shareUrlProp ?? (profileSlug ? `${getAppUrl()}/profile/${profileSlug}` : fallbackUrl)

  const handleDownloadPng = async () => {
    if (!heroRef.current) return
    await exportToPng(heroRef.current, 'my-buddha-family.png')
  }

  const handleDownloadPdf = async () => {
    if (!heroRef.current) return
    await exportToPdf(heroRef.current, 'my-buddha-family.pdf')
  }

  const handleCopyLink = async () => {
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

  const handleSocialShare = async () => {
    const primary = getFamilyByCode(scores.primary)
    const secondary = getFamilyByCode(scores.secondary)
    const text = `I just discovered my Five Buddha Families composition — ${primary.name} with ${secondary.name} influences. Take the quiz to discover yours!`
    const url = shareUrl || `${getAppUrl()}/`

    if (navigator.share && heroRef.current) {
      try {
        const blob = await exportToBlob(heroRef.current)
        const file = new File([blob], 'my-buddha-family.png', { type: 'image/png' })
        await navigator.share({
          title: 'My Five Buddha Families',
          text,
          url,
          files: [file],
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink()
        }
      }
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + url)}`
      window.open(twitterUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 mt-6">
      <IconButton onClick={handleDownloadPng} title="Download as PNG">
        <DownloadIcon />
      </IconButton>
      <IconButton onClick={handleDownloadPdf} title="Download as PDF">
        <PdfIcon />
      </IconButton>
      <IconButton onClick={handleCopyLink} title={copied ? 'Copied!' : 'Copy link'}>
        <LinkIcon />
      </IconButton>
      {onSaveClick && (
        <IconButton onClick={onSaveClick} title="Email me my report">
          <MailIcon />
        </IconButton>
      )}
      <IconButton onClick={handleSocialShare} title="Share to social">
        <ShareIcon />
      </IconButton>
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
