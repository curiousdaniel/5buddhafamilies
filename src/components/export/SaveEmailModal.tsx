import { useState } from 'react'
import type { FamilyScores } from '../../types'
import { getFamilyByCode } from '../../data/families'
import Button from '../shared/Button'

interface SaveEmailModalProps {
  isOpen: boolean
  onClose: () => void
  scores: FamilyScores
  profileSlug: string
}

export default function SaveEmailModal({
  isOpen,
  onClose,
  scores,
  profileSlug,
}: SaveEmailModalProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const primaryFamily = getFamilyByCode(scores.primary).name
  const secondaryFamily = getFamilyByCode(scores.secondary).name

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/send-link-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          profileSlug,
          primaryFamily,
          secondaryFamily,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const handleClose = () => {
    setEmail('')
    setStatus('idle')
    setErrorMessage('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-email-title"
    >
      <div
        className="bg-stone-100 dark:bg-dark rounded-xl border border-stone-400 dark:border-stone-600 p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="save-email-title" className="font-serif text-xl text-gold-dark dark:text-gold-light mb-2">
          Email me my report
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-500 mb-4">
          We&apos;ll send you a link to your full report at the email address you provide.
        </p>

        {status === 'success' ? (
          <div className="space-y-4">
            <p className="text-green-600 dark:text-green-400 text-sm">
              Check your inbox — we&apos;ve sent the link to {email}.
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              className="w-full rounded-lg border border-stone-500 bg-stone-100 dark:bg-stone-800 px-4 py-2 text-stone-800 dark:text-stone-200 placeholder:text-stone-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
            />
            {status === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1"
              >
                {status === 'loading' ? 'Sending...' : 'Send link'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
