import { Briefcase, Heart, Clock, CheckCircle } from 'lucide-react'

interface StatsBarProps {
  totalMatches: number
  savedCount: number
  expiringSoonCount: number
  profileComplete: boolean
}

export function StatsBar({ totalMatches, savedCount, expiringSoonCount, profileComplete }: StatsBarProps) {
  const stats = [
    {
      icon: Briefcase,
      label: 'Opportunités compatibles',
      value: totalMatches,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Heart,
      label: 'Sauvegardées',
      value: savedCount,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20',
    },
    {
      icon: Clock,
      label: 'Expirent bientôt',
      value: expiringSoonCount,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      icon: CheckCircle,
      label: 'Profil complété',
      value: profileComplete ? '✓' : '—',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border glass-card ${bg}`}>
          <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-current/10 flex-shrink-0 ${color}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 leading-tight">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
