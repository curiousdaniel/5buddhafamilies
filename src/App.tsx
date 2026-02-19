import { Routes, Route } from 'react-router-dom'
import QuizStart from './components/quiz/QuizStart'
import QuizFlow from './components/quiz/QuizFlow'
import Results from './components/results/Results'

function App() {
  return (
    <div className="min-h-screen bg-dark text-stone-200">
      <Routes>
        <Route path="/" element={<QuizStart />} />
        <Route path="/quiz" element={<QuizFlow />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  )
}

export default App
