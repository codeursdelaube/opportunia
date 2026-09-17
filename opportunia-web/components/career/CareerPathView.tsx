'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Zap,
  ExternalLink,
} from 'lucide-react'
import type { UserProfile, Opportunity } from '@/types'
import { getCareerPath } from '@/lib/careerPath'
import { ALL_OPPORTUNITIES } from '@/lib/opportunities'

interface CareerPathViewProps {
  profile: UserProfile
  showOpportunities?: boolean
}

export function CareerPathView({ profile, showOpportunities = true }: CareerPathViewProps) {
  const careerData = useMemo(() => {
    return getCareerPath(profile, ALL_OPPORTUNITIES)
  }, [profile])

  return (
    <div className="glass-card p-6 sm:p-8 border-gradient relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-blue-500/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                Opportunia Career Path
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                Parcours personnalisé
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              🚀 Objectif : {careerData.targetRole}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <div>
            <div className="flex items-center justify-between text-xs gap-4 mb-1">
              <span className="text-slate-400">Progression</span>
              <span className="font-bold text-white">{careerData.progressPercent}%</span>
            </div>
            <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-400 transition-all duration-500"
                style={{ width: `${careerData.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current Step Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-blue-500/15 to-transparent border border-purple-500/25 mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
              Étape actuelle : {careerData.currentStepTitle}
            </p>
            <p className="text-sm text-white font-medium">
              👉 {careerData.nextAction}
            </p>
          </div>
        </div>
        <Link
          href="/career-path"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
        >
          <span>Détail du parcours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stepper Timeline */}
      <div className="relative border-l-2 border-white/10 pl-6 sm:pl-8 ml-2 sm:ml-4 space-y-6 my-6">
        {careerData.steps.map((step, idx) => {
          return (
            <div key={step.id} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.completed
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : step.current
                    ? 'bg-blue-500 border-blue-300 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-[#0f172a] border-white/20 text-slate-500'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  step.current
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : step.completed
                    ? 'bg-white/[0.03] border-emerald-500/20'
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {step.title}
                    {step.current && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40">
                        En cours
                      </span>
                    )}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">{step.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {step.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Springboard Opportunities */}
      {showOpportunities && careerData.recommendedOpportunities && careerData.recommendedOpportunities.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              🎯 Opportunités qui peuvent te rapprocher de ton objectif
            </h4>
            <Link
              href="/opportunites"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Voir tout →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {careerData.recommendedOpportunities.map((opp) => (
              <Link
                key={opp.id}
                href={`/opportunites/${opp.id}`}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider">
                    {opp.type}
                  </span>
                  <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                    {opp.titre}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate">
                    {opp.entreprise} · {opp.localisation}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-500 transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
