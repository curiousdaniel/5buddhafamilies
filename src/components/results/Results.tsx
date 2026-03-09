import { useEffect, useMemo, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuizStore } from '../../stores/quizStore'
import { useQuizProgress } from '../../hooks/useQuizProgress'
import { useInterpretation } from '../../hooks/useInterpretation'
import { useProfileSave } from '../../hooks/useProfileSave'
import { decodeScoresFromUrl, getModulesFromUrl } from '../../hooks/useShareUrl'
import Card from '../shared/Card'
import SummaryCard from './SummaryCard'
import PieChart from './PieChart'
import PrimaryFamilyProfile from './PrimaryFamilyProfile'
import CombinationSection from './CombinationSection'
import ExpandableFamilies from './ExpandableFamilies'
import PersonalInterpretation from './PersonalInterpretation'
import ExplorationPanel from './ExplorationPanel'
import ExportActions from '../export/ExportActions'

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { scores: quizScores } = useQuizProgress()

  const searchString = searchParams.toString()
  const scoresFromUrl = useMemo(() => decodeScoresFromUrl(searchString), [searchString])
  const isAdmin = searchParams.get('admin') === 'true'
  const modulesFromUrl = useMemo(() => getModulesFromUrl(searchString), [searchString])

  const scores = scoresFromUrl ?? quizScores
  const interpretation = useInterpretation(scores)
  const totalRaw = useMemo(
    () => (scores ? Object.values(scores.raw).reduce((a, b) => a + b, 0) : 0),
    [scores]
  )
  const interpretationReady =
    interpretation.status === 'done' || interpretation.status === 'error'
  const [modulesRefreshKey, setModulesRefreshKey] = useState(0)

  const { profileSlug, saveProfile, updateModule } = useProfileSave(
    scores,
    interpretation.content,
    interpretationReady
  )
  const hasTriggeredSave = useRef(false)

  useEffect(() => {
    if (
      interpretationReady &&
      interpretation.content &&
      !profileSlug &&
      !hasTriggeredSave.current
    ) {
      hasTriggeredSave.current = true
      saveProfile()
    }
  }, [interpretationReady, interpretation.content, profileSlug, saveProfile])

  const handleModuleComplete = (moduleId: string, content: string) => {
    setModulesRefreshKey((k) => k + 1)
    updateModule(moduleId, content)
  }

  useEffect(() => {
    if (!scoresFromUrl && totalRaw === 0) {
      navigate('/')
    }
  }, [scoresFromUrl, totalRaw, navigate])

  if (!scores || (!scoresFromUrl && totalRaw === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-dark">
        <p className="text-stone-600 dark:text-stone-500">Loading results...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-12 bg-stone-100 dark:bg-dark"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <Card className="p-8">
          <SummaryCard
            primary={scores.primary}
            secondary={scores.secondary}
            percentages={scores.percentages}
          />
          <div className="mt-8">
            <PieChart percentages={scores.percentages} />
          </div>
        </Card>

        <Card className="p-8">
          <PersonalInterpretation
            scores={scores}
            sections={interpretation.sections}
            status={interpretation.status}
          />
        </Card>

        <Card className="p-8">
          <ExplorationPanel
            scores={scores}
            onModuleComplete={handleModuleComplete}
            modulesToLoad={modulesFromUrl}
          />
        </Card>

        <Card className="p-8">
          <PrimaryFamilyProfile primary={scores.primary} />
        </Card>

        <Card className="p-8">
          <CombinationSection primary={scores.primary} secondary={scores.secondary} />
        </Card>

        <Card className="p-8">
          <ExpandableFamilies percentages={scores.percentages} />
        </Card>

        <Card className="p-8">
          <ExportActions
            scores={scores}
            interpretationSections={interpretation.sections}
            interpretationError={interpretation.status === 'error'}
            interpretationReady={interpretationReady}
            modulesRefreshKey={modulesRefreshKey}
            profileSlug={profileSlug ?? undefined}
            isAdmin={isAdmin}
          />
        </Card>

        <div className="text-center pb-8">
          <button
            type="button"
            onClick={() => {
              useQuizStore.getState().reset()
              navigate('/')
            }}
            className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light underline"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </motion.div>
  )
}
