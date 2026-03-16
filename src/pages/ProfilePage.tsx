import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
import ResultHeroActions from '../components/results/ResultHeroActions'
import SaveEmailModal from '../components/export/SaveEmailModal'
import { parseInterpretationSections, isInterpretationTruncated } from '../lib/interpret'
import { MODULES } from '../data/modules'
import type { InterpretationSection } from '../hooks/useInterpretation'
import { useQuizStore } from '../stores/quizStore'
import { getCategoryTitle } from '../data/categories'

interface SavedProfile {
  slug: string
  createdAt: string
  scores: FamilyScores
  primaryFamily: string
  secondaryFamily: string
  coreInterpretation: string
  completedModules: Array<{ id: string; content: string }>
  selectedCategories: string[]
}

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAdmin = searchParams.get('admin') === 'true'
  const [profile, setProfile] = useState<SavedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveEmailOpen, setSaveEmailOpen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const exportCardRef = useRef<HTMLDivElement>(null)

  const handleModuleComplete = useCallback(
    async (moduleId: string, content: string) => {
      if (!profile?.slug) return
      try {
        await fetch('/api/profile/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: profile.slug,
            module: { id: moduleId, content },
          }),
        })
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                completedModules: [
                  ...prev.completedModules.filter((m) => m.id !== moduleId),
                  { id: moduleId, content },
                ],
              }
            : null
        )
      } catch {
        // Silent fail
      }
    },
    [profile?.slug]
  )

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
  const interpretationTruncated = isInterpretationTruncated(profile.coreInterpretation)

  const handleRegenerateInterpretation = async () => {
    if (!profile?.slug || regenerating) return
    setRegenerating(true)
    try {
      const res = await fetch('/api/profile/regenerate-interpretation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: profile.slug }),
      })
      if (!res.ok) throw new Error('Regeneration failed')
      const { coreInterpretation } = await res.json()
      setProfile((prev) => (prev ? { ...prev, coreInterpretation } : null))
    } catch {
      // Silent fail - user can try again
    } finally {
      setRegenerating(false)
    }
  }

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
          <div ref={heroRef}>
            <SummaryCard
              primary={profile.scores.primary}
              secondary={profile.scores.secondary}
              percentages={profile.scores.percentages}
            />
            <div className="mt-8">
              <PieChart percentages={profile.scores.percentages} />
            </div>
            <div className="mt-6 space-y-2 text-center">
              {profile.selectedCategories.length > 0 && (
                <p className="text-sm text-stone-600 dark:text-stone-500">
                  Based on your responses across:{' '}
                  {profile.selectedCategories.map(getCategoryTitle).join(', ')}
                </p>
              )}
              <p className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate('/categories?addMore=true')}
                  className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light font-medium underline underline-offset-2"
                >
                  Answer more questions to update your profile
                </button>
              </p>
            </div>
            <ResultHeroActions
              scores={profile.scores}
              heroRef={heroRef}
              exportRef={exportCardRef}
              profileSlug={profile.slug}
              completedModuleIds={profile.completedModules.map((m) => m.id)}
              selectedCategories={profile.selectedCategories}
              onSaveClick={() => setSaveEmailOpen(true)}
            />
          </div>
          <SaveEmailModal
            isOpen={saveEmailOpen}
            onClose={() => setSaveEmailOpen(false)}
            scores={profile.scores}
            profileSlug={profile.slug}
          />
        </Card>

        <Card className="p-8">
          <PersonalInterpretation
            scores={profile.scores}
            sections={sections}
            status="done"
            isTruncated={interpretationTruncated}
            onRegenerate={handleRegenerateInterpretation}
            regenerating={regenerating}
          />
        </Card>

        <Card className="p-8">
          <ExplorationPanel
            scores={profile.scores}
            onModuleComplete={handleModuleComplete}
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
            isAdmin={isAdmin}
            selectedCategories={profile.selectedCategories}
            exportCardRef={exportCardRef}
          />
        </Card>

        <div className="text-center pb-8 space-y-2">
          <div>
            <button
              type="button"
              onClick={() => {
                useQuizStore.getState().setSelectedCategories(profile.selectedCategories, true)
                navigate('/categories?addMore=true')
              }}
              className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light underline"
            >
              Answer more questions
            </button>
            <span className="text-stone-500 dark:text-stone-500 mx-2">·</span>
            <button
              type="button"
              onClick={() => {
                useQuizStore.getState().setSelectedCategories(profile.selectedCategories)
                navigate('/categories')
              }}
              className="text-gold-dark dark:text-gold hover:text-gold dark:hover:text-gold-light underline"
            >
              Retake Quiz
            </button>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-500">
            Add more answers to update your profile, or start fresh with a new quiz.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
