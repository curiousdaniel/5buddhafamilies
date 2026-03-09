import { useState } from 'react'
import type { FamilyScores } from '../../types'
import { getFamilyByCode } from '../../data/families'
import Button from '../shared/Button'

interface EmailSubscriptionProps {
  scores: FamilyScores
  profileSlug: string
  isAdmin?: boolean
}

export default function EmailSubscription({ scores, profileSlug, isAdmin = false }: EmailSubscriptionProps) {
  const [email, setEmail] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [testSending, setTestSending] = useState(false)
  const [testSent, setTestSent] = useState(false)

  const primaryColor = getFamilyByCode(scores.primary).color

  const handleSendTest = async () => {
    if (!email.trim()) return
    setTestSending(true)
    setErrorMessage('')
    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          frequency,
          profileSlug,
          primaryFamily: getFamilyByCode(scores.primary).name,
          secondaryFamily: getFamilyByCode(scores.secondary).name,
          scores: scores.percentages,
          adminSecret: import.meta.env.VITE_ADMIN_SECRET,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send test email')
    } finally {
      setTestSending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          frequency,
          profileSlug,
          primaryFamily: getFamilyByCode(scores.primary).name,
          secondaryFamily: getFamilyByCode(scores.secondary).name,
          scores: scores.percentages,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed')
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg p-4 text-center" style={{ backgroundColor: `${primaryColor}20` }}>
        <p className="font-serif text-stone-800 dark:text-stone-200">
          You&apos;re subscribed. Your first contemplation will arrive soon.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-serif text-lg text-gold-dark dark:text-gold-light">
          Receive Daily or Weekly Contemplations
        </h4>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-500">
          We&apos;ll send you a personalized reflection and journal prompt based on your family
          composition — everything you need for your practice, delivered to your inbox.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'loading'}
            className="w-full rounded-lg border border-stone-500 bg-stone-100 dark:bg-stone-800 px-4 py-2 text-stone-800 dark:text-stone-200 placeholder:text-stone-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
          />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="frequency"
              checked={frequency === 'daily'}
              onChange={() => setFrequency('daily')}
              disabled={status === 'loading'}
              className="rounded-full"
            />
            <span className="text-sm">Daily</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="frequency"
              checked={frequency === 'weekly'}
              onChange={() => setFrequency('weekly')}
              disabled={status === 'loading'}
              className="rounded-full"
            />
            <span className="text-sm">Weekly</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={status === 'loading'}
            style={status !== 'loading' ? { backgroundColor: primaryColor } : undefined}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </Button>
          {isAdmin && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleSendTest}
              disabled={!email.trim() || testSending}
            >
              {testSending ? 'Sending...' : testSent ? 'Sent!' : 'Send test email now'}
            </Button>
          )}
        </div>
        {testSent && (
          <p className="text-sm text-green-600 dark:text-green-400">Test email sent. Check your inbox.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
        <p className="text-xs text-stone-500">
          No account needed. Unsubscribe anytime with one click.
        </p>
      </form>
    </div>
  )
}
