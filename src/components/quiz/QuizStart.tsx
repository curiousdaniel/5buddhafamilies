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
          className="w-full mb-12"
          aria-label="Begin the quiz"
        >
          Begin the Quiz
        </Button>

        <p className="text-xs text-stone-500 dark:text-stone-500 max-w-md mx-auto leading-relaxed">
          This is a free quiz with no catch. Answer the questions and you&apos;ll receive your results at the end — no sign-up, no paywall, no complication. A public service meant to benefit beings, not a commercial application.
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-500 max-w-md mx-auto leading-relaxed mt-4">
          This quiz is a personal project offering a fun, accessible way to explore the Five Buddha Families — it&apos;s not an official teaching tool of any lineage. The results are interpretive, based on common Vajrayana descriptions, and are meant to spark curiosity rather than replace study with qualified teachers. For deeper learning, seek out authentic Vajrayana teachings and texts.
        </p>
      </div>
    </motion.div>
  )
}
