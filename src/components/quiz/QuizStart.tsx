import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../shared/Button'
import { CATEGORIES } from '../../data/categories'

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
          onClick={() => navigate('/categories')}
          className="w-full mb-6"
          aria-label="Begin the quiz"
        >
          Begin the Quiz
        </Button>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <span
              key={c.id}
              className="px-2 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400"
            >
              {c.icon} {c.title}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
