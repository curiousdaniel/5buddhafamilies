import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { FamilyScores } from '../types'
import Card from '../components/shared/Card'
import SummaryCard from '../components/results/SummaryCard'
import PieChart from '../components/results/PieChart'
import PrimaryFamilyProfile from '../components/results/PrimaryFamilyProfile'
import CombinationSection from '../components/results/CombinationSection'
import ExpandableFamilies from '../components/results/ExpandableFamilies'
import PersonalInterpretation from '../components/results/PersonalInterpretation'
import ExplorationPanel from '../components/results/ExplorationPanel'
import ExportActions from '../components/export/ExportActions'
import { parseInterpretationSections } from '../lib/interpret'
import { MODULES } from '../data/modules'
import type { InterpretationSection } from '../hooks/useInterpretation'
import { useQuizStore } from '../stores/quizStore'

interface SavedProfile {
  slug: string
  createdAt: string
  scores: FamilyScores
  primaryFamily: string
  secondaryFamily: string
  coreInterpretation: string
  completedModules: Array<{ id: string; content: string }>
  quizMode: string
}

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<SavedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/profile/load?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Profile not found')
          throw new Error('Failed to load profile')
        }
        return res.json()
      })
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-dark">
        <p className="text-stone-600 dark:text-stone-500">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-stone-100 dark:bg-dark">
        <p className="text-stone-600 dark:text-stone-500 text-center">
          {error === 'Profile not found'
            ? "This profile couldn't be found. It may have been removed or the link may be incorrect."
            : 'Something went wrong loading this profile.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light underline"
        >
          Take the quiz to discover yours
        </button>
      </div>
    )
  }

  const sections: InterpretationSection[] = parseInterpretationSections(profile.coreInterpretation).map(
    (s) => ({ ...s, complete: true })
  )
  const savedDate = new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-6 py-12 bg-stone-100 dark:bg-dark"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="rounded-lg bg-stone-200/50 dark:bg-stone-800/30 px-4 py-2 text-center text-sm text-stone-600 dark:text-stone-500">
          Saved profile from {savedDate}
        </div>

        <Card className="p-8">
          <SummaryCard
            primary={profile.scores.primary}
            secondary={profile.scores.secondary}
            percentages={profile.scores.percentages}
          />
          <div className="mt-8">
            <PieChart percentages={profile.scores.percentages} />
          </div>
        </Card>

        <Card className="p-8">
          <PersonalInterpretation
            scores={profile.scores}
            sections={sections}
            status="done"
          />
        </Card>

        <Card className="p-8">
          <ExplorationPanel
            scores={profile.scores}
            preLoadedModules={profile.completedModules}
          />
        </Card>

        <Card className="p-8">
          <PrimaryFamilyProfile primary={profile.scores.primary} />
        </Card>

        <Card className="p-8">
          <CombinationSection primary={profile.scores.primary} secondary={profile.scores.secondary} />
        </Card>

        <Card className="p-8">
          <ExpandableFamilies percentages={profile.scores.percentages} />
        </Card>

        <Card className="p-8">
          <ExportActions
            scores={profile.scores}
            interpretationSections={sections}
            interpretationError={false}
            interpretationReady
            completedModules={profile.completedModules.map((m) => {
              const mod = MODULES.find((x) => x.id === m.id)
              return { id: m.id, title: mod?.title ?? m.id, content: m.content }
            })}
            profileSlug={profile.slug}
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
