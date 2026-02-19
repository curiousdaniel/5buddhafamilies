import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'

const FAMILY_ORDER: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

interface MandalaPortraitProps {
  percentages: Record<FamilyCode, number>
  size?: number
}

export default function MandalaPortrait({ percentages, size = 280 }: MandalaPortraitProps) {
  const center = size / 2
  const baseRadius = center * 0.85
  const segmentAngle = (2 * Math.PI) / 5
  const startAngle = -Math.PI / 2

  const innerRadius = baseRadius * 0.2
  const segments = FAMILY_ORDER.map((code, i) => {
    const pct = Math.max(10, percentages[code] ?? 0)
    const angle = startAngle + i * segmentAngle
    const nextAngle = angle + segmentAngle
    const outerRadius = innerRadius + ((baseRadius - innerRadius) * pct) / 100

    const x1 = center + innerRadius * Math.cos(angle)
    const y1 = center + innerRadius * Math.sin(angle)
    const x2 = center + outerRadius * Math.cos(angle)
    const y2 = center + outerRadius * Math.sin(angle)
    const x3 = center + outerRadius * Math.cos(nextAngle)
    const y3 = center + outerRadius * Math.sin(nextAngle)
    const x4 = center + innerRadius * Math.cos(nextAngle)
    const y4 = center + innerRadius * Math.sin(nextAngle)

    const f = getFamilyByCode(code)
    return {
      path: `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`,
      color: f.color,
      name: f.name,
    }
  })

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="rounded-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={baseRadius * 0.95}
          fill="none"
          stroke="#4A4541"
          strokeWidth={1}
          opacity={0.5}
        />
        {segments.map((seg) => (
          <path
            key={seg.name}
            d={seg.path}
            fill={seg.color}
            fillOpacity={0.7}
            stroke="#2A2520"
            strokeWidth={1}
            filter="url(#glow)"
            className="transition-opacity duration-500"
          />
        ))}
      </svg>
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {segments.map((seg) => (
          <span
            key={seg.name}
            className="text-xs flex items-center gap-1"
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: seg.color }}
            />
            {seg.name}
          </span>
        ))}
      </div>
    </div>
  )
}
