'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { MatchBreakdown } from '@/types'

interface MatchingChartProps {
  breakdown: MatchBreakdown
  score: number
}

// Normalize breakdown to 0-100 scale for each axis
function toPercent(value: number, max: number): number {
  return Math.round((value / max) * 100)
}

const AXIS_MAXES: Record<keyof MatchBreakdown, number> = {
  filiere: 30,
  niveau: 20,
  competences: 30,
  localisation: 10,
  interets: 10,
}

const AXIS_LABELS: Record<keyof MatchBreakdown, string> = {
  filiere: 'Filière',
  niveau: 'Niveau',
  competences: 'Compétences',
  localisation: 'Localisation',
  interets: 'Intérêts',
}

export function MatchingChart({ breakdown, score }: MatchingChartProps) {
  const data = (Object.keys(AXIS_LABELS) as Array<keyof MatchBreakdown>).map((key) => ({
    subject: AXIS_LABELS[key],
    value: toPercent(breakdown[key], AXIS_MAXES[key]),
    fullMark: 100,
  }))

  const scoreColor =
    score >= 80 ? '#34d399' : score >= 60 ? '#3b82f6' : score >= 40 ? '#fbbf24' : '#64748b'

  return (
    <div className="relative w-full">
      {/* Center score overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center mt-2">
          <div className="text-3xl font-bold tabular-nums" style={{ color: scoreColor }}>
            {score}%
          </div>
          <div className="text-xs text-slate-500 mt-0.5">compatibilité</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid
            gridType="polygon"
            stroke="rgba(255,255,255,0.06)"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Votre profil"
            dataKey="value"
            stroke={scoreColor}
            fill={scoreColor}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 22, 41, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '8px 16px',
              fontSize: 13,
              color: '#e2e8f0',
            }}
            formatter={(value: any) => [`${value}%`, 'Score']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
