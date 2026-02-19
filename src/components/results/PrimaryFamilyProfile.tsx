import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'

interface PrimaryFamilyProfileProps {
  primary: FamilyCode
}

export default function PrimaryFamilyProfile({ primary }: PrimaryFamilyProfileProps) {
  const f = getFamilyByCode(primary)

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl text-gold" style={{ color: f.color }}>
        {f.name} Family Profile
      </h3>

      <section>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
          Wisdom Quality
        </h4>
        <p className="text-stone-300">{f.wisdomQuality}</p>
      </section>

      <section>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
          Neurotic Pattern
        </h4>
        <p className="text-stone-300">{f.neuroticPattern}</p>
      </section>

      <section>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
          Transmutation
        </h4>
        <p className="text-stone-300 italic">{f.transmutation}</p>
      </section>

      <section>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
          Strengths
        </h4>
        <ul className="list-disc list-inside text-stone-300 space-y-1">
          {f.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
          Growing Edges
        </h4>
        <ul className="list-disc list-inside text-stone-300 space-y-1">
          {f.growingEdges.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">
          Practice Suggestions
        </h4>
        <ul className="list-disc list-inside text-stone-300 space-y-1">
          {f.practiceSuggestions.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
