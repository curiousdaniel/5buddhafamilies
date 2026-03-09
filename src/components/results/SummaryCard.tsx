import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'
import { getFamilyImages } from '../../data/familyImages'
import SacredImage from '../shared/SacredImage'

interface SummaryCardProps {
  primary: FamilyCode
  secondary: FamilyCode
  percentages: Record<FamilyCode, number>
  showBuddhaImage?: boolean
}

export default function SummaryCard({ primary, secondary, percentages, showBuddhaImage = true }: SummaryCardProps) {
  const primaryFamily = getFamilyByCode(primary)
  const secondaryFamily = getFamilyByCode(secondary)
  const images = getFamilyImages(primary)

  return (
    <div className="text-center">
      {showBuddhaImage && (
      <SacredImage
        src={images.buddhaImage}
        alt={`${images.buddhaName}, representing ${images.buddhaWisdom} of the ${primaryFamily.name} Family`}
        caption={images.buddhaName}
        familyCode={primary}
        size="hero"
        className="mb-6 mx-auto"
      />
      )}
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
