import type { FamilyCode } from '../../types'
import { getCombinationDescription } from '../../data/combinations'
import { getFamilyByCode } from '../../data/families'

interface CombinationSectionProps {
  primary: FamilyCode
  secondary: FamilyCode
}

export default function CombinationSection({ primary, secondary }: CombinationSectionProps) {
  const description = getCombinationDescription(primary, secondary)
  const primaryFamily = getFamilyByCode(primary)
  const secondaryFamily = getFamilyByCode(secondary)

  return (
    <section>
      <h3 className="font-serif text-xl text-gold-light mb-4">
        {primaryFamily.name} + {secondaryFamily.name}
      </h3>
      <p className="text-stone-300 leading-relaxed">
        {description ?? `Your ${primaryFamily.name} essence is enriched by ${secondaryFamily.name} energy.`}
      </p>
    </section>
  )
}
