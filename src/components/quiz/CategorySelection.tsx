import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuizStore } from '../../stores/quizStore'
import { getQuestionsForCategories } from '../../data/questions'
import { CATEGORIES } from '../../data/categories'
import Button from '../shared/Button'

export default function CategorySelection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const showQuickTest = searchParams.get('admin') === 'true'
  const { selectedCategories, setSelectedCategories, setQuestions, fillTestAnswers } = useQuizStore()

  const toggleCategory = (id: string) => {
    setSelectedCategories(
      selectedCategories.includes(id)
        ? selectedCategories.filter((c) => c !== id)
        : [...selectedCategories, id]
    )
  }

  const selectAll = () => setSelectedCategories(CATEGORIES.map((c) => c.id))
  const selectEverydayPractice = () => setSelectedCategories(['secular', 'sacred'])
  const clearAll = () => setSelectedCategories([])

  const totalQuestions = CATEGORIES.reduce(
    (sum, c) => sum + (selectedCategories.includes(c.id) ? c.questionCount : 0),
    0
  )
  const categoryCount = selectedCategories.length
  const estimatedMinutes = Math.ceil(totalQuestions * 0.75)

  const handleBegin = () => {
    const categories = selectedCategories.length > 0 ? selectedCategories : ['secular', 'sacred']
    const questions = getQuestionsForCategories(categories)
    setQuestions(questions)
    navigate('/quiz')
  }

  const handleQuickTest = () => {
    const categories = selectedCategories.length > 0 ? selectedCategories : ['secular', 'sacred']
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
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-gold-dark dark:text-gold-light mb-2">
          Choose Your Exploration
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          Select the areas of life you'd like to explore. You can choose one or as many as you like.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {CATEGORIES.map((cat) => {
            const selected = selectedCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`relative text-left p-4 rounded-xl border transition-colors ${
                  selected
                    ? 'border-gold bg-gold/10 text-gold-dark dark:text-gold-light'
                    : 'border-stone-400 dark:border-stone-600 hover:border-stone-500 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <span className="font-medium block">{cat.title}</span>
                <span className="text-sm opacity-80 block mt-1">{cat.subtitle}</span>
                <span className="text-sm mt-2 block opacity-70">
                  {cat.questionCount} questions
                </span>
                {selected && (
                  <span className="absolute top-3 right-3 text-gold" aria-hidden>
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <button
            type="button"
            onClick={selectAll}
            className="text-gold-dark dark:text-gold-light hover:underline"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={selectEverydayPractice}
            className="text-gold-dark dark:text-gold-light hover:underline"
          >
            Everyday + Practice
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-gold-dark dark:text-gold-light hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="mb-8">
          {categoryCount === 0 ? (
            <p className="text-stone-600 dark:text-stone-500">
              Select at least one category to continue
            </p>
          ) : (
            <>
              <p className="text-stone-600 dark:text-stone-400">
                You've selected {totalQuestions} questions across {categoryCount}{' '}
                {categoryCount === 1 ? 'category' : 'categories'}
              </p>
              {totalQuestions > 80 && (
                <p className="text-sm text-stone-500 dark:text-stone-500 mt-1">
                  This is a longer journey — set aside about {estimatedMinutes} minutes
                </p>
              )}
            </>
          )}
        </div>

        <Button
          onClick={handleBegin}
          disabled={categoryCount === 0}
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
      </div>
    </motion.div>
  )
}
