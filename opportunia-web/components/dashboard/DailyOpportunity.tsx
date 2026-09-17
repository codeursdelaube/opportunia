'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight, MapPin, GraduationCap, Clock, Sparkles } from 'lucide-react'
import type { MatchResult } from '@/types'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { TypeBadge } from '@/components/ui/Badge'
import { formatDeadline } from '@/lib/utils'

interface DailyOpportunityProps {
  result: MatchResult | null
}

export function DailyOpportunity({ result }: DailyOpportunityProps) {
  if (!result) return null

  const { opportunity, score, reasons } = result
  const positiveReasons = reasons.filter((r) => r.type === 'positive').slice(0, 3)

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 shadow-2xl overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Star className="w-3.5 h-3.5 fill-current" />
          ⭐ Ton opportunité du jour
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Sélectionnée spécialement selon tes points forts
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={opportunity.type} />
            <span className="text-xs text-slate-400 font-medium">
              {opportunity.entreprise}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {opportunity.titre}
          </h3>

          <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {opportunity.localisation}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              {opportunity.niveau_min}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {formatDeadline(opportunity.deadline)}
            </span>
          </div>

          {/* Pourquoi elle est recommandée */}
          <div className="pt-2 space-y-1">
            <p className="text-xs font-semibold text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pourquoi cette offre te correspond particulièrement :
            </p>
            <div className="flex flex-wrap gap-2">
              {positiveReasons.map((r, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
                >
                  ✓ {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action & Score */}
        <div className="flex flex-col items-center sm:items-end justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Taux d&apos;adéquation</p>
              <p className="text-lg font-bold text-emerald-400">{score}% compatible</p>
            </div>
            <ScoreRing score={score} size={76} strokeWidth={6} />
          </div>

          <Link
            href={`/opportunites/${opportunity.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>Voir l&apos;offre & postuler</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
