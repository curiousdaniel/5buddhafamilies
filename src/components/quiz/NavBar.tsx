import Button from '../shared/Button'

interface NavBarProps {
  onBack: () => void
  onNext: () => void
  onSkip?: () => void
  canGoBack: boolean
  canGoNext: boolean
  isLast: boolean
  nextLabel?: string
}

export default function NavBar({
  onBack,
  onNext,
  onSkip,
  canGoBack,
  canGoNext,
  isLast,
  nextLabel = 'Next',
}: NavBarProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={!canGoBack}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canGoNext}
        >
          {isLast ? 'See Results' : nextLabel}
        </Button>
      </div>
      {onSkip && (
        <div className="text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-stone-500 hover:text-stone-400 underline"
          >
            {isLast ? 'Skip to results' : 'Skip this question'}
          </button>
        </div>
      )}
    </div>
  )
}
