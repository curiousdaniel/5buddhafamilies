import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import QuizStart from './components/quiz/QuizStart'
import QuizFlow from './components/quiz/QuizFlow'
import Results from './components/results/Results'
import ProfilePage from './pages/ProfilePage'
import ThemeToggle from './components/shared/ThemeToggle'
import { useThemeStore } from './stores/themeStore'

function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-dark text-stone-800 dark:text-stone-200">
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<QuizStart />} />
        <Route path="/quiz" element={<QuizFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile/:slug" element={<ProfilePage />} />
      </Routes>
      <Analytics />
    </div>
  )
}

export default App
