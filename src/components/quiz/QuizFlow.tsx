import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../stores/quizStore'
import { getQuestionsByMode } from '../../data/questions'
import Question from './Question'
import NavBar from './NavBar'
import ProgressBar from './ProgressBar'

export default function QuizFlow() {
  const navigate = useNavigate()
  const { mode, currentIndex, setCurrentIndex, goNext, goBack } = useQuizStore()

  const questions = mode ? getQuestionsByMode(mode) : []
  const total = questions.length
  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === total - 1

  useEffect(() => {
    if (mode === null) {
      navigate('/')
      return
    }
    if (total > 0 && currentIndex >= total) {
      setCurrentIndex(total - 1)
    }
  }, [mode, currentIndex, total, navigate, setCurrentIndex])

  const handleNext = () => {
    if (isLast) {
      navigate('/results')
    } else {
      goNext()
    }
  }

  const handleBack = () => {
    goBack()
  }

  if (total === 0) return null
  if (!currentQuestion) return null

  return (
    <div className="min-h-screen px-6 py-8 md:py-12 bg-dark">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressBar current={currentIndex + 1} total={total} />
          <p className="text-sm text-stone-500 mt-2">
            Question {currentIndex + 1} of {total}
          </p>
        </div>

        <Question question={currentQuestion} />

        <NavBar
          onBack={handleBack}
          onNext={handleNext}
          onSkip={handleNext}
          canGoBack={currentIndex > 0}
          canGoNext={true}
          isLast={isLast}
        />
      </div>
    </div>
  )
}
