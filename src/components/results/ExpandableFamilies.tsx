import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'
import { getFamilyImages, FAMILY_IMAGE_COLORS } from '../../data/familyImages'
const FAMILY_ORDER: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

interface ExpandableFamiliesProps {
  percentages: Record<FamilyCode, number>
  allExpanded?: boolean
  showThumbnails?: boolean
}

const familyContent = (f: ReturnType<typeof getFamilyByCode>) => (
  <div className="pt-4 space-y-3 text-sm text-stone-400">
    <p><strong className="text-stone-300">Element:</strong> {f.element} · <strong className="text-stone-300">Direction:</strong> {f.direction}</p>
    <p><strong className="text-stone-300">Wisdom:</strong> {f.wisdomQuality}</p>
    <p><strong className="text-stone-300">Neurotic pattern:</strong> {f.neuroticPattern}</p>
    <div><strong className="text-stone-300">Balanced:</strong> {f.balancedTraits.join(', ')}</div>
    <div><strong className="text-stone-300">Confused:</strong> {f.confusedTraits.join(', ')}</div>
  </div>
)

export default function ExpandableFamilies({ percentages, allExpanded = false, showThumbnails = true }: ExpandableFamiliesProps) {
  const [expanded, setExpanded] = useState<FamilyCode | null>(null)

  return (
    <div className="space-y-2">
      <h3 className="font-serif text-xl text-gold-light mb-4">
        Your Full Composition
      </h3>
      {FAMILY_ORDER.map((code) => {
        const f = getFamilyByCode(code)
        const pct = Math.round(percentages[code] ?? 0)
        const isExpanded = allExpanded || expanded === code

        const images = getFamilyImages(code)
        const borderColor = FAMILY_IMAGE_COLORS[code]
        const thumbnail = showThumbnails ? (
          <div
            className="w-[60px] sm:w-[80px] md:w-[100px] shrink-0 aspect-[3/4] overflow-hidden rounded-lg bg-stone-900/80"
            style={{ border: `1px solid ${borderColor}50` }}
          >
            <img
              src={images.buddhaImage}
              alt={`${images.buddhaName}, ${f.name} Family`}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
        ) : null

        if (allExpanded) {
          return (
            <div key={code} className="border border-stone-600 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-stone-700/50">
                {thumbnail}
                <span className="flex items-center gap-3 flex-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                  <span className="font-medium" style={{ color: f.color }}>{f.name}</span>
                  <span className="text-stone-500 text-sm">{pct}%</span>
                </span>
              </div>
              <div className="px-4 pb-4 pt-0">{familyContent(f)}</div>
            </div>
          )
        }

        return (
          <div key={code} className="border border-stone-600 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(isExpanded ? null : code)}
              className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-stone-800/50 transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`family-${code}-content`}
            >
              <span className="flex items-center gap-3 flex-1 min-w-0">
                {thumbnail}
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
                <span className="font-medium" style={{ color: f.color }}>{f.name}</span>
                <span className="text-stone-500 text-sm">{pct}%</span>
              </span>
              <span className="text-stone-500 shrink-0">{isExpanded ? '−' : '+'}</span>
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id={`family-${code}-content`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 pt-0 border-t border-stone-700/50 mt-0 overflow-hidden"
                >
                  {familyContent(f)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
