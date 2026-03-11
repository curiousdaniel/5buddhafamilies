import { useEffect, useRef } from 'react'

const KO_FI_SCRIPT_URL = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: Record<string, string>) => void
    }
  }
}

function loadKoFiWidget() {
  if (document.querySelector('script[src*="overlay-widget.js"]')) return

  const script = document.createElement('script')
  script.src = KO_FI_SCRIPT_URL
  script.async = true
  script.onload = () => {
    if (window.kofiWidgetOverlay) {
      window.kofiWidgetOverlay.draw('danielwest54124', {
        'type': 'floating-chat',
        'floating-chat.donateButton.text': 'Donate',
        'floating-chat.donateButton.background-color': '#fcbf47',
        'floating-chat.donateButton.text-color': '#323842',
      })
    }
  }
  document.body.appendChild(script)
}

export default function KoFiWidget() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return

    const timeoutId = window.setTimeout(() => {
      loaded.current = true
      loadKoFiWidget()
    }, 30_000)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return null
}
