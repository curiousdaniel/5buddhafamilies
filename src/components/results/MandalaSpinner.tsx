const FAMILY_COLORS = ['#E8E8E8', '#4A7BA7', '#C9A227', '#B85450', '#5A8B5A']
const size = 120
const center = size / 2
const baseRadius = center * 0.85
const segmentAngle = (2 * Math.PI) / 5
const startAngle = -Math.PI / 2
const innerRadius = baseRadius * 0.3

const segments = FAMILY_COLORS.map((color, i) => {
  const angle = startAngle + i * segmentAngle
  const nextAngle = angle + segmentAngle
  const x1 = center + innerRadius * Math.cos(angle)
  const y1 = center + innerRadius * Math.sin(angle)
  const x2 = center + baseRadius * Math.cos(angle)
  const y2 = center + baseRadius * Math.sin(angle)
  const x3 = center + baseRadius * Math.cos(nextAngle)
  const y3 = center + baseRadius * Math.sin(nextAngle)
  const x4 = center + innerRadius * Math.cos(nextAngle)
  const y4 = center + innerRadius * Math.sin(nextAngle)
  return { path: `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`, color }
})

export default function MandalaSpinner() {
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="animate-spin" style={{ animationDuration: '4s' }}>
        <circle
          cx={center}
          cy={center}
          r={baseRadius * 0.95}
          fill="none"
          stroke="#4A4541"
          strokeWidth={1}
          opacity={0.5}
        />
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.path}
            fill={seg.color}
            fillOpacity={0.6}
            stroke="#2A2520"
            strokeWidth={1}
          />
        ))}
      </svg>
    </div>
  )
}
