import Button from '../shared/Button'

interface NavBarProps {
  onBack: () => void
  onNext: () => void
  canGoBack: boolean
  canGoNext: boolean
  isLast: boolean
  nextLabel?: string
}

export default function NavBar({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLast,
  nextLabel = 'Next',
}: NavBarProps) {
  return (
    <div className="flex justify-between items-center gap-4 mt-8">
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
  )
}
