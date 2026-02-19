import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuizStore } from '../../stores/quizStore'
import type { QuizMode } from '../../types'
import Button from '../shared/Button'

const MODES: { value: QuizMode; label: string; description: string }[] = [
  { value: 'secular', label: 'Secular', description: 'Everyday life, work, relationships (24 questions)' },
  { value: 'sacred', label: 'Sacred', description: 'Meditation, dharma study, practice (21 questions)' },
  { value: 'full', label: 'Full', description: 'Both secular and sacred (45 questions)' },
]

export default function QuizStart() {
  const navigate = useNavigate()
  const { mode, setMode } = useQuizStore()

  const handleStart = () => {
    if (mode) navigate('/quiz')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-dark"
    >
      <div className="max-w-lg w-full text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gold-light mb-2">
          Five Buddha Families
        </h1>
        <p className="text-stone-400 text-lg mb-12">
          Discover your personal composition of the Five Buddha Families — an ancient Vajrayana Buddhist framework describing five fundamental energy patterns.
        </p>

        <div className="space-y-3 mb-12">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                mode === m.value
                  ? 'border-gold bg-gold/10 text-gold-light'
                  : 'border-stone-600 hover:border-stone-500 text-stone-300'
              }`}
            >
              <span className="font-medium block">{m.label}</span>
              <span className="text-sm text-stone-500">{m.description}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={handleStart}
          disabled={!mode}
          className="w-full"
          aria-label="Start quiz with selected mode"
        >
          Begin Quiz
        </Button>
      </div>
    </motion.div>
  )
}
