import type { FamilyScores } from '../../types'
import type { InterpretationSection } from '../../hooks/useInterpretation'
import type { CompletedModule } from '../../lib/interpret'
import PieChart from '../results/PieChart'
import SummaryCard from '../results/SummaryCard'
import PrimaryFamilyProfile from '../results/PrimaryFamilyProfile'
import CombinationSection from '../results/CombinationSection'
import ExpandableFamilies from '../results/ExpandableFamilies'
import { getFamilyByCode } from '../../data/families'
import { parseInterpretationSections } from '../../lib/interpret'

interface ExportCardProps {
  scores: FamilyScores
  interpretationSections?: InterpretationSection[] | null
  interpretationError?: boolean
  completedModules?: CompletedModule[]
}

/**
 * Full report card for PNG/PDF export.
 * Includes all content from the results page.
 */
export default function ExportCard({
  scores,
  interpretationSections,
  interpretationError,
  completedModules = [],
}: ExportCardProps) {
  const primaryColor = getFamilyByCode(scores.primary).color

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
            showBuddhaImage={false}
          />
          <div className="mt-6 w-full max-w-sm mx-auto">
            <PieChart percentages={scores.percentages} />
          </div>
        </div>

        {/* Your Personal Interpretation */}
        <section className="border-t border-stone-700/50 pt-8">
          <h3
            className="font-serif text-2xl text-gold-light mb-6"
            style={{ color: primaryColor }}
          >
            Your Personal Interpretation
          </h3>
          {interpretationError ? (
            <p className="text-stone-500 text-center">
              We were unable to generate your personal reading at this time. Your
              score results are shown below.
            </p>
          ) : interpretationSections && interpretationSections.length > 0 ? (
            <div className="space-y-8 font-serif text-stone-300 leading-relaxed">
              {interpretationSections
                .filter((s) => s.complete)
                .map((section) => (
                  <div key={section.title}>
                    <h4
                      className="font-serif text-xl font-medium mb-4"
                      style={{ color: primaryColor }}
                    >
                      {section.title}
                    </h4>
                    <div className="text-stone-300 whitespace-pre-wrap">
                      {section.body}
                    </div>
                  </div>
                ))}
            </div>
          ) : null}
        </section>

        {/* Completed Deep-Dive Modules */}
        {completedModules.length > 0 &&
          completedModules.map((mod) => {
            const sections = parseInterpretationSections(mod.content)
            return (
              <section
                key={mod.id}
                className="border-t border-stone-700/50 pt-8"
              >
                <h3
                  className="font-serif text-xl text-gold-light mb-4"
                  style={{ color: primaryColor }}
                >
                  {mod.title}
                </h3>
                <div className="space-y-6 font-serif text-stone-300 leading-relaxed text-sm">
                  {sections.map((sec) => (
                    <div key={sec.title}>
                      <h4
                        className="font-medium mb-2"
                        style={{ color: primaryColor }}
                      >
                        {sec.title}
                      </h4>
                      <div className="whitespace-pre-wrap">{sec.body}</div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

        {/* Primary Family Profile */}
        <section className="border-t border-stone-700/50 pt-8">
          <PrimaryFamilyProfile primary={scores.primary} showImages={false} />
        </section>

        {/* Combination */}
        <section className="border-t border-stone-700/50 pt-8">
          <CombinationSection primary={scores.primary} secondary={scores.secondary} />
        </section>

        {/* All Five Families (expanded for export) */}
        <section className="border-t border-stone-700/50 pt-8">
          <ExpandableFamilies
            percentages={scores.percentages}
            allExpanded
            showThumbnails={false}
          />
        </section>
      </div>
    </div>
  )
}
