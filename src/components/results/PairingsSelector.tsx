import { useState } from 'react'
import type { FamilyScores, FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'
import { FAMILY_CODES } from '../../data/families'
import { PAIRING_CONTEXTS } from '../../data/modules'
import { usePairingInterpretation } from '../../hooks/usePairingInterpretation'
import MandalaSpinner from './MandalaSpinner'
import Button from '../shared/Button'

interface PairingsSelectorProps {
  scores: FamilyScores
}

export default function PairingsSelector({ scores }: PairingsSelectorProps) {
  const [familyA, setFamilyA] = useState<FamilyCode>(scores.primary)
  const [familyB, setFamilyB] = useState<FamilyCode>(scores.secondary)
  const [context, setContext] = useState<string>(PAIRING_CONTEXTS[0])
  const { sections, status, fetchAndStream, reset } = usePairingInterpretation()

  const isLoading = status === 'loading' || status === 'streaming'
  const isComplete = status === 'done'
  const canGenerate = familyA !== familyB && !isLoading

  const handleGenerate = () => {
    if (!canGenerate) return
    fetchAndStream(familyA, familyB, context)
  }

  const familyBOptions = FAMILY_CODES.filter((f) => f !== familyA)

  return (
    <div className="space-y-6">
      <h4 className="font-serif text-xl text-gold-light">
        Explore a Pairing
      </h4>
      <p className="text-stone-500 text-sm">
        Select any two-family combination and context to explore that relational
        dynamic.
      </p>

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-stone-500 mb-1">
            Choose a Family
          </label>
          <select
            value={familyA}
            onChange={(e) => {
              const newA = e.target.value as FamilyCode
              setFamilyA(newA)
              if (familyB === newA) {
                const other = FAMILY_CODES.find((f) => f !== newA)
                if (other) setFamilyB(other)
              }
            }}
            className="bg-dark border border-stone-600 rounded-lg px-3 py-2 text-stone-300 focus:border-gold focus:outline-none"
          >
            {FAMILY_CODES.map((code) => (
              <option key={code} value={code}>
                {getFamilyByCode(code).name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">
            & another Family
          </label>
          <select
            value={familyB}
            onChange={(e) => setFamilyB(e.target.value as FamilyCode)}
            className="bg-dark border border-stone-600 rounded-lg px-3 py-2 text-stone-300 focus:border-gold focus:outline-none"
          >
            {familyBOptions.map((code) => (
              <option key={code} value={code}>
                {getFamilyByCode(code).name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">
            Context
          </label>
          <select
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="bg-dark border border-stone-600 rounded-lg px-3 py-2 text-stone-300 focus:border-gold focus:outline-none min-w-[180px]"
          >
            {PAIRING_CONTEXTS.map((ctx) => (
              <option key={ctx} value={ctx}>
                {ctx}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="secondary"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
        {isComplete && (
          <Button variant="ghost" onClick={reset}>
            New Pairing
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 border border-stone-600 rounded-xl">
          <MandalaSpinner />
          <p className="text-stone-400 text-sm">Preparing your reading...</p>
        </div>
      )}

      {status === 'error' && (
        <p className="text-stone-500 text-center py-4">
          We were unable to generate this pairing. Please try again.
        </p>
      )}

      {isComplete && sections.length > 0 && (
        <div
          className="space-y-6 font-serif text-stone-300 leading-relaxed border border-stone-600 rounded-xl p-6"
          style={{ borderColor: getFamilyByCode(familyA).color + '40' }}
        >
          <h5
            className="font-serif text-lg"
            style={{ color: getFamilyByCode(familyA).color }}
          >
            {getFamilyByCode(familyA).name} + {getFamilyByCode(familyB).name} —{' '}
            {context}
          </h5>
          {sections
            .filter((s) => s.complete)
            .map((section) => (
              <section key={section.title}>
                <h6
                  className="font-medium mb-2 text-base"
                  style={{ color: getFamilyByCode(familyA).color }}
                >
                  {section.title}
                </h6>
                <div className="whitespace-pre-wrap text-sm">{section.body}</div>
              </section>
            ))}
        </div>
      )}
    </div>
  )
}
