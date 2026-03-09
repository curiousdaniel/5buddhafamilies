import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Question as QuestionType } from '../../types'
import { shuffle } from '../../lib/shuffle'
import { useQuizStore } from '../../stores/quizStore'
import { getCategoryTitle } from '../../data/categories'

interface QuestionProps {
  question: QuestionType
}

export default function Question({ question }: QuestionProps) {
  const { answers, toggleOption } = useQuizStore()
  const selected = answers[question.id] ?? []

  const shuffledOptions = useMemo(() => shuffle(question.options), [question.id])

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <span className="inline-block px-2 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400 mb-2">
        {getCategoryTitle(question.category)}
      </span>
      <h2 className="font-serif text-xl md:text-2xl text-stone-800 dark:text-stone-100 leading-relaxed">
        {question.text}
      </h2>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 border border-gold/30">
        <span className="text-gold-dark dark:text-gold-light" aria-hidden>
          ☑
        </span>
        <p className="text-sm font-medium text-gold-dark dark:text-gold-light">
          Select all that apply
        </p>
      </div>
      <div className="space-y-3">
        {shuffledOptions.map((opt) => {
          const isChecked = selected.includes(opt.id)
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                isChecked ? 'border-gold bg-gold/10' : 'border-stone-400 dark:border-stone-600 hover:border-stone-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleOption(question.id, opt.id)}
                className="mt-1 rounded border-stone-500 text-gold focus:ring-gold"
                aria-label={opt.text}
              />
              <span className="text-stone-700 dark:text-stone-200">{opt.text}</span>
            </label>
          )
        })}
      </div>
    </motion.div>
  )
}
