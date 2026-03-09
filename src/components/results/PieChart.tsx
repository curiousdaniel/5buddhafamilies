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
import { useMediaQuery } from '../../hooks/useMediaQuery'

const FAMILY_ORDER: FamilyCode[] = ['buddha', 'vajra', 'ratna', 'padma', 'karma']

interface PieChartProps {
  percentages: Record<FamilyCode, number>
}

export default function PieChart({ percentages }: PieChartProps) {
  const isNarrow = useMediaQuery('(max-width: 767px)')

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
    <div className="w-full">
      <div className="h-80 min-h-[min(85vw,420px)] md:min-h-0 md:h-80">
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
              label={
                isNarrow
                  ? false
                  : ({ name, percent }) =>
                      percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
              }
              labelLine={isNarrow ? false : { stroke: '#78716c' }}
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
      {isNarrow && (
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-stone-500 dark:text-stone-400">
          {data.map((d) => (
            <span key={d.name} style={{ color: d.color }}>
              {d.name} {d.value}%
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
