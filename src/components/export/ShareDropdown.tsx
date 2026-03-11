import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { FamilyScores } from '../../types'
import { getFamilyByCode } from '../../data/families'
import { exportToBlob, exportToPng } from '../../lib/export'
import Button from '../shared/Button'

function getAppUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return import.meta.env.VITE_APP_URL || ''
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

interface ShareDropdownProps {
  scores: FamilyScores | null
  shareUrl?: string
  exportRef?: React.RefObject<HTMLElement | null>
}

export default function ShareDropdown({
  scores,
  shareUrl: shareUrlProp,
  exportRef,
}: ShareDropdownProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [instagramToast, setInstagramToast] = useState(false)
  const shareDropdownRef = useRef<HTMLDivElement>(null)
  const shareButtonRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  const shareUrl = shareUrlProp ?? `${getAppUrl()}/`
  const primary = scores ? getFamilyByCode(scores.primary) : null
  const secondary = scores ? getFamilyByCode(scores.secondary) : null
  const shareText = primary && secondary
    ? `I just discovered my Five Buddha Families composition — ${primary.name} with ${secondary.name} influences. Take the quiz to discover yours!`
    : 'Take the Five Buddha Families quiz to discover your composition!'

  useEffect(() => {
    if (shareOpen && shareButtonRef.current) {
      const rect = shareButtonRef.current.getBoundingClientRect()
      const dropdownWidth = 200
      const padding = 8
      const left = Math.max(
        padding,
        Math.min(
          rect.right - dropdownWidth,
          typeof window !== 'undefined' ? window.innerWidth - dropdownWidth - padding : rect.right - dropdownWidth
        )
      )
      setDropdownPosition({ top: rect.bottom + 4, left })
    }
  }, [shareOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        shareDropdownRef.current &&
        !shareDropdownRef.current.contains(target) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(target)
      ) {
        setShareOpen(false)
      }
    }
    if (shareOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [shareOpen])

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
  }

  const handleNativeShare = async () => {
    setShareOpen(false)
    const element = exportRef?.current
    if (!navigator.share || !element) {
      handleCopyLink()
      return
    }
    try {
      const blob = await exportToBlob(element)
      const file = new File([blob], 'my-buddha-family.png', { type: 'image/png' })
      await navigator.share({
        title: 'My Five Buddha Families',
        text: shareText,
        url: shareUrl,
        files: [file],
      })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        handleCopyLink()
      }
    }
  }

  const openSharePopup = (url: string) => {
    setShareOpen(false)
    window.open(url, 'share', 'width=600,height=400,scrollbars=yes')
  }

  const handleShareFacebook = () => {
    openSharePopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
  }

  const handleShareTwitter = () => {
    openSharePopup(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    )
  }

  const handleShareLinkedIn = () => {
    openSharePopup(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)
  }

  const handleDownloadForInstagram = async () => {
    setShareOpen(false)
    const element = exportRef?.current
    if (!element) return
    await exportToPng(element, 'my-buddha-family.png')
    setInstagramToast(true)
    setTimeout(() => setInstagramToast(false), 4000)
  }

  return (
    <>
      <div className="relative" ref={shareButtonRef}>
        <Button
          variant="secondary"
          onClick={() => setShareOpen((o) => !o)}
          className={shareOpen ? 'bg-gold/10' : ''}
        >
          <span className="flex items-center gap-2">
            <ShareIcon />
            Share
          </span>
        </Button>
        {shareOpen &&
          typeof document !== 'undefined' &&
          createPortal(
            <div
              ref={shareDropdownRef}
              className="fixed z-[9999] min-w-[200px] py-2 rounded-lg border border-stone-500 dark:border-stone-600 bg-stone-100 dark:bg-dark shadow-xl"
              style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
            >
              <p className="px-3 py-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
                Share via...
              </p>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-gold/10 flex items-center gap-2"
                >
                  <ShareIcon />
                  More (native)
                </button>
              )}
              <button
                type="button"
                onClick={handleShareFacebook}
                className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-gold/10 flex items-center gap-2"
              >
                <FacebookIcon />
                Facebook
              </button>
              <button
                type="button"
                onClick={handleShareTwitter}
                className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-gold/10 flex items-center gap-2"
              >
                <TwitterIcon />
                Twitter/X
              </button>
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-gold/10 flex items-center gap-2"
              >
                <LinkedInIcon />
                LinkedIn
              </button>
              <button
                type="button"
                onClick={handleDownloadForInstagram}
                className="w-full px-3 py-2 text-left text-sm text-stone-700 dark:text-stone-300 hover:bg-gold/10 flex items-center gap-2"
              >
                <InstagramIcon />
                Download for Instagram
              </button>
            </div>,
            document.body
          )}
      </div>
      {instagramToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-700 text-stone-100 text-sm shadow-lg z-50">
          Image saved. Open Instagram and create a new post to share it.
        </div>
      )}
    </>
  )
}
