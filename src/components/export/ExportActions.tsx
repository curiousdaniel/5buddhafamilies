import { useRef, useMemo } from 'react'
import type { FamilyScores } from '../../types'
import type { InterpretationSection } from '../../hooks/useInterpretation'
import { getCompletedModules } from '../../lib/interpret'
import { MODULES } from '../../data/modules'
import ExportCard from './ExportCard'
import ShareButton from './ShareButton'
import CopyShareText from './CopyShareText'
import CopyFullReport from './CopyFullReport'
import EmailSubscription from './EmailSubscription'
import { exportToPng, exportToPdf } from '../../lib/export'
import Button from '../shared/Button'

function getAppUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return import.meta.env.VITE_APP_URL || import.meta.env.NEXT_PUBLIC_APP_URL || ''
}

interface ExportActionsProps {
  scores: FamilyScores | null
  interpretationSections?: InterpretationSection[] | null
  interpretationError?: boolean
  interpretationReady?: boolean
  modulesRefreshKey?: number
  completedModules?: Array<{ id: string; title: string; content: string }>
  profileSlug?: string
  isAdmin?: boolean
  selectedCategories?: string[]
}

export default function ExportActions({
  scores,
  interpretationSections,
  interpretationError,
  interpretationReady = true,
  modulesRefreshKey = 0,
  completedModules: completedModulesProp,
  profileSlug,
  isAdmin = false,
  selectedCategories = [],
}: ExportActionsProps) {
  const exportCardRef = useRef<HTMLDivElement>(null)
  const canExport = scores && interpretationReady
  const completedModulesFromStore = useMemo(
    () => (scores ? getCompletedModules(scores, MODULES) : []),
    [scores, modulesRefreshKey]
  )
  const completedModules = completedModulesProp ?? completedModulesFromStore
  const shareUrl = profileSlug ? `${getAppUrl()}/profile/${profileSlug}` : undefined

  const handleDownloadPng = async () => {
    if (!exportCardRef.current || !scores) return
    await exportToPng(exportCardRef.current)
  }

  const handleDownloadPdf = async () => {
    if (!exportCardRef.current || !scores) return
    await exportToPdf(exportCardRef.current)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl text-gold-dark dark:text-gold-light">Share & Download</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={handleDownloadPng}
          disabled={!canExport}
        >
          Download PNG
        </Button>
        <Button
          variant="secondary"
          onClick={handleDownloadPdf}
          disabled={!canExport}
        >
          Download PDF
        </Button>
        <ShareButton
          scores={scores}
          completedModuleIds={completedModules.map((m) => m.id)}
          selectedCategories={selectedCategories}
          shareUrl={shareUrl}
        />
        <CopyShareText
          scores={scores}
          completedModuleIds={completedModules.map((m) => m.id)}
          selectedCategories={selectedCategories}
          shareUrl={shareUrl}
        />
        <CopyFullReport
          scores={scores}
          interpretationSections={interpretationSections}
          interpretationError={interpretationError}
          interpretationReady={interpretationReady}
          completedModules={completedModules}
        />
      </div>
      {scores && !interpretationReady && (
        <p className="text-sm text-stone-500">
          Preparing your full report for export...
        </p>
      )}

      {scores && profileSlug && (
        <div className="mt-8 pt-8 border-t border-stone-600/50">
          <EmailSubscription scores={scores} profileSlug={profileSlug} isAdmin={isAdmin} />
        </div>
      )}

      {/* Hidden export card for capture - rendered off-screen */}
      {scores && (
        <div
          className="fixed left-[-9999px] top-0"
          style={{ zIndex: -1 }}
        >
          <div ref={exportCardRef}>
            <ExportCard
              scores={scores}
              interpretationSections={interpretationSections}
              interpretationError={interpretationError}
              completedModules={completedModules}
            />
          </div>
        </div>
      )}
    </div>
  )
}
