import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { FamilyScores } from '../../types'
import type { Module } from '../../data/modules'
import { getFamilyByCode } from '../../data/families'
import { useModuleInterpretation } from '../../hooks/useModuleInterpretation'
import { parseInterpretationSections } from '../../lib/interpret'
import MandalaSpinner from './MandalaSpinner'

interface ModuleCardProps {
  module: Module
  scores: FamilyScores
  onComplete?: (moduleId: string, content: string) => void
  autoFetch?: boolean
  preLoadedContent?: string
}

function parseSections(content: string) {
  return parseInterpretationSections(content).map((s) => ({ ...s, complete: true }))
}

export default function ModuleCard({
  module,
  scores,
  onComplete,
  autoFetch,
  preLoadedContent,
}: ModuleCardProps) {
  const hook = useModuleInterpretation(module.id, preLoadedContent ? null : scores)
  const sections = preLoadedContent ? parseSections(preLoadedContent) : hook.sections
  const status = preLoadedContent ? 'done' : hook.status
  const fetchAndStream = hook.fetchAndStream
  const primaryColor = getFamilyByCode(scores.primary).color
  const isComplete = status === 'done'
  const isLoading = status === 'loading' || status === 'streaming'
  const content = preLoadedContent ?? hook.content
  const hasReportedComplete = useRef(false)

  useEffect(() => {
    if (isComplete && onComplete && content && !hasReportedComplete.current) {
      hasReportedComplete.current = true
      onComplete(module.id, content)
    }
  }, [isComplete, onComplete, module.id, content])

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
          <div className="space-y-6 font-serif text-stone-300 leading-relaxed text-sm">
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
        </div>
      )}
    </motion.div>
  )
}
