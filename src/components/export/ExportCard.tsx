import type { FamilyScores } from '../../types'
import RadarChart from '../results/RadarChart'
import MandalaPortrait from '../results/MandalaPortrait'
import SummaryCard from '../results/SummaryCard'
import PrimaryFamilyProfile from '../results/PrimaryFamilyProfile'
import CombinationSection from '../results/CombinationSection'
import ExpandableFamilies from '../results/ExpandableFamilies'

interface ExportCardProps {
  scores: FamilyScores
}

/**
 * Full report card for PNG/PDF export.
 * Includes all content from the results page.
 */
export default function ExportCard({ scores }: ExportCardProps) {
  return (
    <div
      className="bg-dark p-8 rounded-xl border border-gold/30"
      style={{ width: 800 }}
    >
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-serif text-3xl text-gold-light mb-2">
            Five Buddha Families
          </h1>
          <p className="text-stone-500">Your Personal Composition</p>
        </div>

        {/* Summary + Charts */}
        <div className="text-center">
          <SummaryCard
            primary={scores.primary}
            secondary={scores.secondary}
            percentages={scores.percentages}
          />
          <div className="mt-6 flex justify-center">
            <MandalaPortrait percentages={scores.percentages} size={240} />
          </div>
          <div className="mt-6 w-full max-w-sm mx-auto">
            <RadarChart percentages={scores.percentages} />
          </div>
        </div>

        {/* Primary Family Profile */}
        <section className="border-t border-stone-700/50 pt-8">
          <PrimaryFamilyProfile primary={scores.primary} />
        </section>

        {/* Combination */}
        <section className="border-t border-stone-700/50 pt-8">
          <CombinationSection primary={scores.primary} secondary={scores.secondary} />
        </section>

        {/* All Five Families (expanded for export) */}
        <section className="border-t border-stone-700/50 pt-8">
          <ExpandableFamilies percentages={scores.percentages} allExpanded />
        </section>
      </div>
    </div>
  )
}
