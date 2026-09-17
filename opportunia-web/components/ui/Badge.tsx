import { cn, getTypeColor, getTypeLabel } from '@/lib/utils'
import type { OpportunityType } from '@/types'

interface BadgeProps {
  type: OpportunityType | string
  className?: string
}

export function TypeBadge({ type, className }: BadgeProps) {
  return (
    <span className={cn('chip border', getTypeColor(type), className)}>
      {getTypeLabel(type)}
    </span>
  )
}

interface ScoreBadgeProps {
  score: number
  className?: string
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const color =
    score >= 80
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : score >= 60
      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      : score >= 40
      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'

  return (
    <span className={cn('chip border font-semibold', color, className)}>
      {score}% compatible
    </span>
  )
}
