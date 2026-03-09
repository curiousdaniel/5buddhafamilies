import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { FamilyScores } from '../../types'
import type { Module } from '../../data/modules'
import { getFamilyByCode } from '../../data/families'
import { getFamilyImages } from '../../data/familyImages'
import { useModuleInterpretation } from '../../hooks/useModuleInterpretation'
import MandalaSpinner from './MandalaSpinner'
import SacredImage from '../shared/SacredImage'

interface ModuleCardProps {
  module: Module
  scores: FamilyScores
  onComplete?: () => void
  autoFetch?: boolean
}

export default function ModuleCard({ module, scores, onComplete, autoFetch }: ModuleCardProps) {
  const { sections, status, fetchAndStream } = useModuleInterpretation(
    module.id,
    scores
  )
  const primaryColor = getFamilyByCode(scores.primary).color
  const isComplete = status === 'done'
  const isLoading = status === 'loading' || status === 'streaming'

  useEffect(() => {
    if (isComplete && onComplete) onComplete()
  }, [isComplete, onComplete])

  useEffect(() => {
    if (autoFetch && status === 'idle' && scores) {
      fetchAndStream()
    }
  }, [autoFetch, status, scores, fetchAndStream])

  const handleClick = () => {
    if (isComplete || isLoading) return
    fetchAndStream()
  }

  return (
    <motion.div
      layout
      className="rounded-xl border border-stone-600 overflow-hidden transition-colors hover:border-stone-500"
    >
      {!isComplete ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="w-full text-left p-5"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <MandalaSpinner />
              <p className="text-stone-400 text-sm">Preparing your reading...</p>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-serif text-lg text-gold-light mb-1">
                  {module.title}
                </h4>
                <p className="text-sm text-stone-500">{module.subtitle}</p>
              </div>
              <span className="text-gold text-sm shrink-0">Generate</span>
            </div>
          )}
        </button>
      ) : (
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4
              className="font-serif text-lg"
              style={{ color: primaryColor }}
            >
              {module.title}
            </h4>
            <span className="text-stone-500 text-xs">✓ Complete</span>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 min-w-0 space-y-6 font-serif text-stone-300 leading-relaxed text-sm">
              {sections
                .filter((s) => s.complete)
                .map((section) => (
                  <section key={section.title}>
                    <h5
                      className="font-medium mb-2 text-base"
                      style={{ color: primaryColor }}
                    >
                      {section.title}
                    </h5>
                    <div className="whitespace-pre-wrap">{section.body}</div>
                  </section>
                ))}
            </div>
            {module.id === 'spiritual_overview' && (() => {
              const img = getFamilyImages(scores.primary)
              const fam = getFamilyByCode(scores.primary)
              return (
                <div className="hidden sm:block shrink-0">
                  <SacredImage
                    src={img.buddhaImage}
                    alt={`${img.buddhaName}, representing ${img.buddhaWisdom} of the ${fam.name} Family`}
                    caption={img.buddhaName}
                    familyCode={scores.primary}
                    size="medium"
                  />
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </motion.div>
  )
}
