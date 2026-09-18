'use client'

import { CheckCircle2, Circle, Lightbulb, Sparkles, ArrowRight } from 'lucide-react'
import type { MissingSkillsAdvice } from '@/types'

interface MissingSkillsSectionProps {
  advice?: MissingSkillsAdvice
  score: number
}

export function MissingSkillsSection({ advice, score }: MissingSkillsSectionProps) {
  if (!advice) return null

  const { matchedSkills, missingSkills, recommendations, coveragePercent } = advice

  return (
    <div className="glass-card p-6 border-gradient relative overflow-hidden">
      {/* Glow decorative */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">
              Ce qu&apos;il te manque pour cette offre
            </h3>
            <p className="text-xs text-slate-400">
              Analyse détaillée de l&apos;écart entre ton profil et les exigences du recruteur
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {coveragePercent}% compétences requises
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 my-5">
        {/* Compétences déjà acquises */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Compétences acquises ({matchedSkills.length})
            </span>
          </div>
          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  <span className="text-[10px] text-emerald-400">✓</span> {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Aucune compétence requise n&apos;est encore enregistrée dans ton profil.
            </p>
          )}
        </div>

        {/* Compétences à développer */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Circle className="w-3.5 h-3.5" />
              Compétences à développer ({missingSkills.length})
            </span>
          </div>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30"
                >
                  <span className="text-[10px]">–</span> {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              Aucune compétence manquante — Tu as le profil idéal.
            </p>
          )}
        </div>
      </div>

      {/* Pour augmenter tes chances */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2.5 text-blue-300 font-semibold text-xs sm:text-sm">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Pour augmenter tes chances de décrocher cette offre :</span>
        </div>
        <ol className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-300">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="leading-tight pt-0.5">{rec}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
