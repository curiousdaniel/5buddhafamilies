import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import QuizStart from './components/quiz/QuizStart'
import QuizModeSimple from './components/quiz/QuizModeSimple'
import CategorySelection from './components/quiz/CategorySelection'
import QuizFlow from './components/quiz/QuizFlow'
import Results from './components/results/Results'
import ProfilePage from './pages/ProfilePage'
import ThemeToggle from './components/shared/ThemeToggle'
import BuyMeACoffeeWidget from './components/shared/BuyMeACoffeeWidget'
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
      <BuyMeACoffeeWidget />
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
