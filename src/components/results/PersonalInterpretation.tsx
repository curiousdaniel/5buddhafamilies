import { motion } from 'framer-motion'
import type { FamilyScores } from '../../types'
import { getFamilyByCode } from '../../data/families'
import { useInterpretation } from '../../hooks/useInterpretation'
import MandalaSpinner from './MandalaSpinner'

interface PersonalInterpretationProps {
  scores: FamilyScores
}

export default function PersonalInterpretation({ scores }: PersonalInterpretationProps) {
  const { sections, status } = useInterpretation(scores)
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
        <p className="text-stone-500 text-center">
          We were unable to generate your personal reading at this time. Your score results are
          shown below.
        </p>
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
    </div>
  )
}
