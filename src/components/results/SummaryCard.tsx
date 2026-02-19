import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'

interface SummaryCardProps {
  primary: FamilyCode
  secondary: FamilyCode
  percentages: Record<FamilyCode, number>
}

export default function SummaryCard({ primary, secondary, percentages }: SummaryCardProps) {
  const primaryFamily = getFamilyByCode(primary)
  const secondaryFamily = getFamilyByCode(secondary)

  return (
    <div className="text-center">
      <h2 className="font-serif text-2xl md:text-3xl text-gold-light mb-2">
        Your primary family: {primaryFamily.name}
      </h2>
      <p className="text-stone-400 mb-4">
        with strong {secondaryFamily.name} influence
      </p>
      <div className="flex justify-center gap-4 text-sm">
        <span style={{ color: primaryFamily.color }}>{primaryFamily.name}: {Math.round(percentages[primary])}%</span>
        <span style={{ color: secondaryFamily.color }}>{secondaryFamily.name}: {Math.round(percentages[secondary])}%</span>
      </div>
    </div>
  )
}
