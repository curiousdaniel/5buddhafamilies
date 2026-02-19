import { useRef } from 'react'
import type { FamilyScores } from '../../types'
import ExportCard from './ExportCard'
import ShareButton from './ShareButton'
import CopyShareText from './CopyShareText'
import { exportToPng, exportToPdf } from '../../lib/export'
import Button from '../shared/Button'

interface ExportActionsProps {
  scores: FamilyScores | null
}

export default function ExportActions({ scores }: ExportActionsProps) {
  const exportCardRef = useRef<HTMLDivElement>(null)

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
      <h3 className="font-serif text-xl text-gold-light">Share & Download</h3>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={handleDownloadPng} disabled={!scores}>
          Download PNG
        </Button>
        <Button variant="secondary" onClick={handleDownloadPdf} disabled={!scores}>
          Download PDF
        </Button>
        <ShareButton scores={scores} />
        <CopyShareText scores={scores} />
      </div>

      {/* Hidden export card for capture - rendered off-screen */}
      {scores && (
        <div
          className="fixed left-[-9999px] top-0"
          style={{ zIndex: -1 }}
        >
          <div ref={exportCardRef}>
            <ExportCard scores={scores} />
          </div>
        </div>
      )}
    </div>
  )
}
