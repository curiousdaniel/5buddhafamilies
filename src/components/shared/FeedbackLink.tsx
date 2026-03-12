import { useState } from 'react'
import Button from './Button'

export default function FeedbackLink() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !message.trim()) return
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), message: message.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus('success')
      setEmail('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const handleClose = () => {
    setOpen(false)
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 text-xs text-stone-500 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 hover:underline z-40"
      >
        Feedback
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <div
            className="bg-stone-100 dark:bg-dark rounded-xl border border-stone-400 dark:border-stone-600 p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="feedback-title" className="font-serif text-xl text-gold-dark dark:text-gold-light mb-2">
              Feedback
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-500 mb-4">
              Share your thoughts or get in touch. I&apos;ll receive your message at curiousdaniel@gmail.com.
            </p>

            {status === 'success' ? (
              <div className="space-y-4">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Thank you. Your message has been sent.
                </p>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="feedback-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === 'loading'}
                    className="w-full rounded-lg border border-stone-500 bg-stone-100 dark:bg-stone-800 px-4 py-2 text-stone-800 dark:text-stone-200 placeholder:text-stone-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="feedback-message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    required
                    minLength={10}
                    rows={4}
                    disabled={status === 'loading'}
                    className="w-full rounded-lg border border-stone-500 bg-stone-100 dark:bg-stone-800 px-4 py-2 text-stone-800 dark:text-stone-200 placeholder:text-stone-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50 resize-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                )}
                <div className="flex gap-3">
                  <Button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : 'Send'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
