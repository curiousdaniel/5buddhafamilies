import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuizStore } from '../../stores/quizStore'
import { useQuizProgress } from '../../hooks/useQuizProgress'
import { decodeScoresFromUrl } from '../../hooks/useShareUrl'
import Card from '../shared/Card'
import SummaryCard from './SummaryCard'
import RadarChart from './RadarChart'
import MandalaPortrait from './MandalaPortrait'
import PrimaryFamilyProfile from './PrimaryFamilyProfile'
import CombinationSection from './CombinationSection'
import ExpandableFamilies from './ExpandableFamilies'
import ExportActions from '../export/ExportActions'

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { scores: quizScores } = useQuizProgress()

  const scoresFromUrl = useMemo(() => decodeScoresFromUrl(searchParams.toString()), [searchParams])

  const scores = scoresFromUrl ?? quizScores
  const totalRaw = useMemo(
    () => (scores ? Object.values(scores.raw).reduce((a, b) => a + b, 0) : 0),
    [scores]
  )

  useEffect(() => {
    if (!scoresFromUrl && totalRaw === 0) {
      navigate('/')
    }
  }, [scoresFromUrl, totalRaw, navigate])

  if (!scores || (!scoresFromUrl && totalRaw === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <p className="text-stone-500">Loading results...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-12 bg-dark"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <Card className="p-8">
          <SummaryCard
            primary={scores.primary}
            secondary={scores.secondary}
            percentages={scores.percentages}
          />
          <div className="mt-8 flex justify-center">
            <MandalaPortrait percentages={scores.percentages} size={240} />
          </div>
          <div className="mt-8">
            <RadarChart percentages={scores.percentages} />
          </div>
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
          <ExportActions scores={scores} />
        </Card>

        <div className="text-center pb-8">
          <button
            type="button"
            onClick={() => {
              useQuizStore.getState().reset()
              navigate('/')
            }}
            className="text-gold hover:text-gold-light underline"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </motion.div>
  )
}
