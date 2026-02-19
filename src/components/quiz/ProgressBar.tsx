interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0
  return (
    <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gold transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
