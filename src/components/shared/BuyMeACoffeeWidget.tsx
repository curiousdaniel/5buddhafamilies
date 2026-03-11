import { useEffect } from 'react'

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
  script.onload = () => {
    const evt = new Event('DOMContentLoaded', { bubbles: true })
    window.dispatchEvent(evt)
  }
  document.body.appendChild(script)
}

export default function BuyMeACoffeeWidget() {
  useEffect(() => {
    loadBMCWidget()
  }, [])

  return null
}
