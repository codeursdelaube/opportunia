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
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50/70 border-blue-200/70 dark:bg-blue-500/10 dark:border-blue-500/20',
    },
    {
      icon: Heart,
      label: 'Sauvegardées',
      value: savedCount,
      color: 'text-rose-600 dark:text-pink-400',
      bg: 'bg-rose-50/70 border-rose-200/70 dark:bg-pink-500/10 dark:border-pink-500/20',
    },
    {
      icon: Clock,
      label: 'Expirent bientôt',
      value: expiringSoonCount,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50/70 border-amber-200/70 dark:bg-amber-500/10 dark:border-amber-500/20',
    },
    {
      icon: CheckCircle,
      label: 'Profil complété',
      value: profileComplete ? 'Oui' : 'Non',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50/70 border-emerald-200/70 dark:bg-emerald-500/10 dark:border-emerald-500/20',
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
