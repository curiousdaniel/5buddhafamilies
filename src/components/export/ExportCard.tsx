import { useRef } from 'react'
import type { FamilyScores } from '../../types'
import RadarChart from '../results/RadarChart'
import MandalaPortrait from '../results/MandalaPortrait'
import SummaryCard from '../results/SummaryCard'
import { getFamilyByCode } from '../../data/families'

interface ExportCardProps {
  scores: FamilyScores
}

/**
 * A styled card component optimized for export to PNG/PDF.
 * Fixed dimensions for social-friendly aspect ratio.
 */
export default function ExportCard({ scores }: ExportCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const primaryFamily = getFamilyByCode(scores.primary)

  return (
    <div
      ref={cardRef}
      className="bg-dark p-8 rounded-xl border border-gold/30"
      style={{ width: 1080, minHeight: 1080 }}
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="font-serif text-3xl text-gold-light mb-2">
          Five Buddha Families
        </h1>
        <p className="text-stone-500 mb-8">Your Personal Composition</p>

        <div className="mb-8">
          <MandalaPortrait percentages={scores.percentages} size={320} />
        </div>

        <SummaryCard
          primary={scores.primary}
          secondary={scores.secondary}
          percentages={scores.percentages}
        />

        <div className="mt-8 w-full max-w-md">
          <RadarChart percentages={scores.percentages} />
        </div>

        <p className="mt-6 text-stone-500 text-sm">
          Primary: {primaryFamily.name} · Wisdom: {primaryFamily.wisdomQuality}
        </p>
      </div>
    </div>
  )
}
