'use client'

import { useMemo } from 'react'
import { Target, CheckCircle2, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react'
import type { UserProfile, CareerReadinessScore } from '@/types'
import { calculateCareerReadiness } from '@/lib/careerPath'
import { ScoreRing } from '@/components/ui/ScoreRing'

interface CareerReadinessCardProps {
  profile: UserProfile
}

export function CareerReadinessCard({ profile }: CareerReadinessCardProps) {
  const readiness: CareerReadinessScore = useMemo(() => {
    return calculateCareerReadiness(profile)
  }, [profile])

  const dimensions = [
    { label: 'Formation', score: readiness.formation, note: `${profile.niveau}` },
    { label: 'Compétences', score: readiness.competences, note: `${(profile.competences || []).length} ajoutées` },
    {
      label: 'CV & Portfolio',
      score: readiness.cv,
      isMissing: readiness.isCvMissing,
      note: readiness.isCvMissing ? 'Profil incomplet' : 'Renseigné',
    },
    {
      label: 'Expérience / Projets',
      score: readiness.experience,
      note: `${(profile.projets || []).length} projets`,
    },
    { label: 'Objectif de carrière', score: readiness.objectif, note: profile.objectif_pro || 'Non défini' },
  ]

  return (
    <div className="glass-card p-6 sm:p-8 border-gradient relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Orientation & Insertion
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                Indice dynamique
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              🎯 Ton niveau de préparation (Career Readiness)
            </h2>
          </div>
        </div>

        {/* Global score display */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
          <ScoreRing score={readiness.total} size={64} strokeWidth={5} />
          <div>
            <p className="text-2xl font-extrabold text-white leading-none">
              {readiness.total} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {readiness.total >= 80
                ? 'Excellente préparation'
                : readiness.total >= 60
                ? 'Bonne trajectoire'
                : 'En cours de structuration'}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown per dimension */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
        {dimensions.map((dim) => (
          <div
            key={dim.label}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-slate-400 truncate">{dim.label}</span>
                <span className="text-xs font-bold text-white">{dim.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    dim.score >= 80
                      ? 'bg-emerald-400'
                      : dim.score >= 50
                      ? 'bg-blue-400'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
            <span
              className={`text-[11px] truncate font-medium ${
                dim.isMissing ? 'text-amber-400 font-semibold' : 'text-slate-400'
              }`}
            >
              {dim.note}
            </span>
          </div>
        ))}
      </div>

      {/* Action items: Pour passer à 80/100 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/20">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Pour passer à {Math.min(100, Math.max(80, readiness.total + 15))}/100 :
          </h4>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Recommandations personnalisées
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {readiness.actionItems.map((action, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 text-[11px] font-bold">
                ✓
              </div>
              <span className="leading-tight">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
