import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'

const FAMILY_ORDER: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

interface RadarChartProps {
  percentages: Record<FamilyCode, number>
}

export default function RadarChart({ percentages }: RadarChartProps) {
  const data = FAMILY_ORDER.map((code) => {
    const f = getFamilyByCode(code)
    return {
      family: f.name,
      value: Math.round(percentages[code] ?? 0),
      fullMark: 100,
    }
  })

  return (
    <div className="w-full h-64 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#4A4541" />
          <PolarAngleAxis
            dataKey="family"
            tick={{ fill: '#C9A227', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#78716c' }}
          />
          <Radar
            name="Your composition"
            dataKey="value"
            stroke="#C9A227"
            fill="#C9A227"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2520',
              border: '1px solid #4A4541',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#C9A227' }}
            formatter={(value: number) => [`${value}%`, '']}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
