import { CheckCircle2, XCircle, MinusCircle, Sparkles, AlertTriangle } from 'lucide-react'
import type { MatchReason, MatchResult } from '@/types'

interface MatchReasonsProps {
  result: MatchResult
}

function ReasonItem({ reason }: { reason: MatchReason }) {
  const config = {
    positive: {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    negative: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    neutral: {
      icon: MinusCircle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
    },
  }[reason.type]

  const Icon = config.icon

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${config.bg}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
      <span className="text-sm text-slate-200 leading-snug">{reason.label}</span>
    </div>
  )
}

export function MatchReasons({ result }: MatchReasonsProps) {
  const { reasons, matchedSkills, missingSkills } = result

  return (
    <div className="space-y-6">
      {/* Why this opportunity */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Pourquoi cette offre vous correspond ?
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {reasons.map((reason, i) => (
            <ReasonItem key={i} reason={reason} />
          ))}
        </div>
      </div>

      {/* Skills breakdown */}
      {(matchedSkills.length > 0 || missingSkills.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Matched skills */}
          {matchedSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-medium text-slate-300">Compétences correspondantes</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="chip border bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {missingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <h4 className="text-sm font-medium text-slate-300">Compétences à développer</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="chip border bg-orange-500/15 text-orange-300 border-orange-500/25"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
