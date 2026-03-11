import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuizStore } from '../../stores/quizStore'
import { getQuestionsForCategories } from '../../data/questions'
import Button from '../shared/Button'

type SimpleMode = 'secular' | 'sacred' | 'both'

const MODES: { value: SimpleMode; label: string; description: string; questionCount: number }[] = [
  { value: 'secular', label: 'Everyday Life', description: 'Work, relationships, money, and how you move through the world', questionCount: 24 },
  { value: 'sacred', label: 'Buddhist Practice', description: 'Meditation, dharma study, sangha, and the path', questionCount: 21 },
  { value: 'both', label: 'Full exploration', description: 'Both everyday life and Buddhist practice', questionCount: 45 },
]

export default function QuizModeSimple() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const showQuickTest = searchParams.get('admin') === 'true'
  const { setSelectedCategories, setQuestions, fillTestAnswers } = useQuizStore()

  const [selectedMode, setSelectedMode] = useState<SimpleMode | null>(null)

  const totalQuestions = selectedMode
    ? MODES.find((m) => m.value === selectedMode)?.questionCount ?? 0
    : 0

  const handleBegin = () => {
    if (!selectedMode) return
    const categories: string[] =
      selectedMode === 'both' ? ['secular', 'sacred'] : [selectedMode]
    setSelectedCategories(categories)
    const questions = getQuestionsForCategories(categories)
    setQuestions(questions)
    navigate('/quiz')
  }

  const handleQuickTest = () => {
    const mode = selectedMode ?? 'both'
    const categories: string[] = mode === 'both' ? ['secular', 'sacred'] : [mode]
    setSelectedCategories(categories)
    const questions = getQuestionsForCategories(categories)
    const answers: Record<string, string[]> = {}
    questions.forEach((q, i) => {
      const optionIndex = i % 5
      answers[q.id] = [q.options[optionIndex].id]
    })
    setQuestions(questions)
    fillTestAnswers(answers)
    navigate(showQuickTest ? '/results?admin=true' : '/results')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-12 bg-stone-100 dark:bg-dark"
    >
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gold-dark dark:text-gold-light mb-2">
          Choose Your Exploration
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          Select one of the options below to begin your quiz.
        </p>

        <div className="space-y-3 mb-8">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setSelectedMode(m.value)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedMode === m.value
                  ? 'border-gold bg-gold/10 text-gold-dark dark:text-gold-light'
                  : 'border-stone-400 dark:border-stone-600 hover:border-stone-500 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span className="font-medium block">{m.label}</span>
              <span className="text-sm text-stone-600 dark:text-stone-500">{m.description}</span>
              <span className="text-sm mt-1 block opacity-70">{m.questionCount} questions</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleBegin}
          disabled={!selectedMode}
          className="w-full"
          aria-label={`Begin quiz with ${totalQuestions} questions`}
        >
          Begin — {totalQuestions} Questions
        </Button>

        {showQuickTest && (
          <button
            type="button"
            onClick={handleQuickTest}
            className="w-full mt-4 py-3 text-sm text-gold-dark dark:text-gold-light border border-stone-400 dark:border-stone-600 rounded-xl hover:border-gold hover:bg-gold/5 transition-colors"
          >
            Quick test (fill sample answers)
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate('/categories')}
          className="w-full mt-8 text-left p-4 rounded-xl border border-gold/50 dark:border-gold/30 hover:border-gold hover:bg-gold/10 transition-colors text-gold-dark dark:text-gold-light"
        >
          <span className="font-medium block">Want the best assessment?</span>
          <span className="text-sm mt-1 block opacity-90">
            Go really deep — 125 questions across 10 areas of life. Choose your own categories for the most thorough exploration.
          </span>
        </button>
      </div>
    </motion.div>
  )
}
