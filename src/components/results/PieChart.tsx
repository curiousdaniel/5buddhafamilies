import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import type { FamilyCode } from '../../types'
import { getFamilyByCode } from '../../data/families'

const FAMILY_ORDER: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

interface PieChartProps {
  percentages: Record<FamilyCode, number>
}

export default function PieChart({ percentages }: PieChartProps) {
  const data = FAMILY_ORDER.map((code) => {
    const f = getFamilyByCode(code)
    return {
      name: f.name,
      value: Math.round(percentages[code] ?? 0),
      color: f.color,
    }
  })
  const filteredData = data.filter((d) => d.value > 0)
  const chartData = filteredData.length > 0 ? filteredData : data.map((d) => ({ ...d, value: 1 }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            stroke="#2A2520"
            strokeWidth={2}
            label={({ name, percent }) =>
              percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
            }
            labelLine={{ stroke: '#78716c' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2520',
              border: '1px solid #4A4541',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#C9A227' }}
            formatter={(value: number, name: string) => [
              `${Math.round(value)}%`,
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ paddingTop: '1rem' }}
            formatter={(value) => (
              <span className="text-stone-400 text-sm">{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
