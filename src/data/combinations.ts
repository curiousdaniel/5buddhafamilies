import type { CombinationDescription, FamilyCode } from '../types'

const SECONDARIES: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

export const combinations: CombinationDescription[] = SECONDARIES.flatMap((primary) =>
  SECONDARIES.filter((s) => s !== primary).map((secondary) => ({
    primary,
    secondary,
    description: `Your ${primary} essence is enriched by ${secondary} energy. This combination brings a unique flavor—the grounding or clarifying quality of your primary family is tempered and enhanced by the qualities of ${secondary}.`,
  }))
)

export function getCombinationDescription(
  primary: FamilyCode,
  secondary: FamilyCode
): string | undefined {
  return combinations.find((c) => c.primary === primary && c.secondary === secondary)?.description
}
