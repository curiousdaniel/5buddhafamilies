import type { FamilyScores } from '../../types'
import { MODULES } from '../../data/modules'
import ModuleCard from './ModuleCard'
import PairingsSelector from './PairingsSelector'

interface ExplorationPanelProps {
  scores: FamilyScores
  onModuleComplete?: () => void
  modulesToLoad?: string[]
}

export default function ExplorationPanel({ scores, onModuleComplete, modulesToLoad = [] }: ExplorationPanelProps) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-serif text-2xl text-gold-light mb-2">
          Explore Your Composition Further
        </h3>
        <p className="text-stone-500">
          Select any area below to receive a personalized reading based on your
          family composition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            scores={scores}
            onComplete={onModuleComplete}
            autoFetch={modulesToLoad.includes(module.id)}
          />
        ))}
      </div>

      <div className="border-t border-stone-700/50 pt-8">
        <PairingsSelector scores={scores} />
      </div>
    </div>
  )
}
