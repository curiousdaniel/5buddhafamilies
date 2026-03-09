import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Apply theme before first paint to avoid flash
const saved = localStorage.getItem('five-buddha-theme')
if (saved) {
  try {
    const { state } = JSON.parse(saved)
    document.documentElement.classList.add(state?.theme === 'light' ? 'light' : 'dark')
  } catch {
    document.documentElement.classList.add('dark')
  }
} else {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
