import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import QuizStart from './components/quiz/QuizStart'
import QuizModeSimple from './components/quiz/QuizModeSimple'
import CategorySelection from './components/quiz/CategorySelection'
import QuizFlow from './components/quiz/QuizFlow'
import Results from './components/results/Results'
import ProfilePage from './pages/ProfilePage'
import ThemeToggle from './components/shared/ThemeToggle'
import FeedbackLink from './components/shared/FeedbackLink'
import AboutLink from './components/shared/AboutLink'
import { useThemeStore } from './stores/themeStore'

function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <div className="bg-stone-100 dark:bg-dark text-stone-800 dark:text-stone-200">
      <ThemeToggle />
      <div className="fixed bottom-4 left-4 flex items-center gap-3 z-40">
        <AboutLink />
        <span className="text-stone-400 dark:text-stone-500 text-xs">·</span>
        <FeedbackLink />
      </div>
      <Analytics />
      <Routes>
        <Route path="/" element={<QuizStart />} />
        <Route path="/quiz-setup" element={<QuizModeSimple />} />
        <Route path="/categories" element={<CategorySelection />} />
        <Route path="/quiz" element={<QuizFlow />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile/:slug" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App
