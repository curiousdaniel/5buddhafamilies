import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../shared/Button'

export default function QuizStart() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-stone-100 dark:bg-dark"
    >
      <div className="max-w-lg w-full text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gold-dark dark:text-gold-light mb-2">
          Five Buddha Families
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-lg mb-12">
          Discover your personal composition of the Five Buddha Families — an ancient Vajrayana Buddhist framework describing five fundamental energy patterns.
        </p>

        <Button
          onClick={() => navigate('/quiz-setup')}
          className="w-full mb-4"
          aria-label="Begin the quiz"
        >
          Begin the Quiz
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/categories')}
          className="w-full"
          aria-label="Go deep with 125 questions"
        >
          Want the most thorough assessment? Go deep with 125 questions across 10 areas of life.
        </Button>
      </div>
    </motion.div>
  )
}
