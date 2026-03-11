import { useEffect, useRef } from 'react'

const BMC_SCRIPT_URL = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js'
const BMC_DATA = {
  id: 'curiousdanf',
  description: 'Support me on Buy me a coffee!',
  message: 'Want to keep this service free?',
  color: '#FF5F5F',
  position: 'Right',
  x_margin: '18',
  y_margin: '18',
}

function loadBMCWidget() {
  if (document.querySelector('script[data-name="BMC-Widget"]')) return

  const script = document.createElement('script')
  script.setAttribute('data-name', 'BMC-Widget')
  script.setAttribute('data-cfasync', 'false')
  script.src = BMC_SCRIPT_URL
  Object.entries(BMC_DATA).forEach(([key, value]) =>
    script.setAttribute(`data-${key}`, String(value))
  )
  document.body.appendChild(script)
}

export default function BuyMeACoffeeWidget() {
  const loaded = useRef(false)
  const timeoutId = useRef<number | null>(null)

  useEffect(() => {
    if (loaded.current) return

    const tryLoad = () => {
      if (loaded.current) return
      loaded.current = true
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
      loadBMCWidget()
    }

    // Check if already scrolled 30% (e.g. refresh while scrolled)
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight > 0 && scrollTop / docHeight >= 0.3) {
      tryLoad()
      return
    }

    timeoutId.current = window.setTimeout(tryLoad, 30_000)

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0 && scrollTop / docHeight >= 0.3) tryLoad()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return null
}
