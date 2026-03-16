import { motion } from 'framer-motion'
import type { FamilyScores } from '../../types'
import type { InterpretationSection, InterpretationStatus } from '../../hooks/useInterpretation'
import { getFamilyByCode } from '../../data/families'
import MandalaSpinner from './MandalaSpinner'

interface PersonalInterpretationProps {
  scores: FamilyScores
  sections: InterpretationSection[]
  status: InterpretationStatus
  isTruncated?: boolean
  onRegenerate?: () => void
  regenerating?: boolean
}

export default function PersonalInterpretation({
  scores,
  sections,
  status,
  isTruncated = false,
  onRegenerate,
  regenerating = false,
}: PersonalInterpretationProps) {
  const primaryColor = getFamilyByCode(scores.primary).color

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <MandalaSpinner />
        <p className="text-stone-400 font-serif text-lg">Preparing your personal reading...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="py-8">
        <p className="text-stone-500 text-center mb-4">
          We were unable to generate your personal reading at this time. Your score results are
          shown below.
        </p>
        {onRegenerate && (
          <div className="text-center">
            <button
              type="button"
              onClick={onRegenerate}
              className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light font-medium underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    )
  }

  if (status === 'idle' || (status === 'streaming' && sections.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <MandalaSpinner />
        <p className="text-stone-400 font-serif text-lg">Preparing your personal reading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <h3 className="font-serif text-2xl text-gold-light" style={{ color: primaryColor }}>
        Your Personal Interpretation
      </h3>
      <div className="space-y-10 font-serif text-stone-300 leading-relaxed">
        {sections
          .filter((s) => s.complete)
          .map((section) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h4
                className="font-serif text-xl font-medium mb-4"
                style={{ color: primaryColor }}
              >
                {section.title}
              </h4>
              <div className="text-stone-300 whitespace-pre-wrap">{section.body}</div>
            </motion.section>
          ))}
      </div>
      {isTruncated && onRegenerate && (
        <div className="pt-4 border-t border-stone-600/50">
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
            Your interpretation appears to have been cut off. Would you like to generate it again?
          </p>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={regenerating}
            className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light font-medium underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {regenerating ? 'Regenerating...' : 'Regenerate interpretation'}
          </button>
        </div>
      )}
    </div>
  )
}
