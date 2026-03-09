import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../stores/quizStore'
import Question from './Question'
import NavBar from './NavBar'
import ProgressBar from './ProgressBar'

export default function QuizFlow() {
  const navigate = useNavigate()
  const { questions, currentIndex, setCurrentIndex, goNext, goBack } = useQuizStore()

  const total = questions.length
  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === total - 1

  useEffect(() => {
    if (total === 0) {
      navigate('/categories')
      return
    }
    if (currentIndex >= total) {
      setCurrentIndex(total - 1)
    }
  }, [total, currentIndex, navigate, setCurrentIndex])

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
    <div className="min-h-screen px-6 py-8 md:py-12 bg-stone-100 dark:bg-dark">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <ProgressBar current={currentIndex + 1} total={total} />
          <p className="text-sm text-stone-600 dark:text-stone-500 mt-2">
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
