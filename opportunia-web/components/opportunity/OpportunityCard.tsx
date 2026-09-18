'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  GraduationCap,
  Clock,
  Heart,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileEdit,
} from 'lucide-react'
import { TypeBadge } from '@/components/ui/Badge'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { CandidatureModal } from '@/components/opportunity/CandidatureModal'
import { ApplicationPreparationModal } from '@/components/opportunity/ApplicationPreparationModal'
import { formatDeadline, getDaysRemaining, getOpportunityImage } from '@/lib/utils'
import { toggleFavorite, isFavorite, loadProfile } from '@/lib/storage'
import type { MatchResult, UserProfile } from '@/types'

interface OpportunityCardProps {
  result: MatchResult
  showScore?: boolean
}

export function OpportunityCard({ result, showScore = true }: OpportunityCardProps) {
  const { opportunity, score, expiringSoon, daysRemaining, isExpired, missingSkills } = result
  const [favorited, setFavorited] = useState(() => isFavorite(opportunity.id))
  const [modalOpen, setModalOpen] = useState(false)
  const [prepModalOpen, setPrepModalOpen] = useState(false)
  const [applied, setApplied] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(loadProfile())
    try {
      const stored = JSON.parse(localStorage.getItem('opportunia_applications') || '[]')
      setApplied(stored.some((a: { opportunityId: string }) => a.opportunityId === opportunity.id))
    } catch {}
  }, [opportunity.id])

  function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    const { isFavorite: newState } = toggleFavorite(opportunity.id)
    setFavorited(newState)
  }

  const days = daysRemaining ?? getDaysRemaining(opportunity.deadline)
  const isTrulyExpired = isExpired || opportunity.status === 'expired' || (days !== null && days < 0)
  const isExpiringSoon = !isTrulyExpired && (expiringSoon || (days !== null && days >= 0 && days <= 7))
  const imageUrl = getOpportunityImage(opportunity)

  // Verified source check
  const hasVerifiedSource =
    opportunity.source &&
    ['linkedin', 'anpe', 'opportunia', 'aiesec', 'gouv', 'france volontaires'].some((s) =>
      opportunity.source.toLowerCase().includes(s)
    )

  return (
    <article className="glass-card overflow-hidden flex flex-col group border-gradient">
      {/* Image */}
      <Link href={`/opportunites/${opportunity.id}`} className="block relative h-44 overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={opportunity.titre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 card-img-overlay" />

        {/* Type badge overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <TypeBadge type={opportunity.type} />
          {hasVerifiedSource && (
            <span className="bg-blue-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Source : {opportunity.source}
            </span>
          )}
          {applied && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Candidaté
            </span>
          )}
        </div>

        {/* Status badge */}
        {isTrulyExpired ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Offre expirée
          </div>
        ) : isExpiringSoon ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            {days === 0 ? "Expire aujourd'hui" : `Plus que ${days} jour${days && days > 1 ? 's' : ''}`}
          </div>
        ) : null}
      </Link>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link href={`/opportunites/${opportunity.id}`}>
              <h3 className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-base">
                {opportunity.titre}
              </h3>
            </Link>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1 truncate">{opportunity.entreprise}</p>
          </div>

          {/* Score ring (compact) */}
          {showScore && (
            <div className="flex-shrink-0 text-right">
              <ScoreRing score={score} size={54} strokeWidth={4} />
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {opportunity.localisation}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            {opportunity.niveau_min}
          </span>
          <span className={`flex items-center gap-1 ${isExpiringSoon ? 'text-amber-600 dark:text-orange-400 font-bold' : ''}`}>
            <Clock className="w-3.5 h-3.5" />
            {formatDeadline(opportunity.deadline)}
          </span>
        </div>

        {/* Missing skills preview tag */}
        {missingSkills && missingSkills.length > 0 && (
          <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 truncate">
            <span className="text-amber-600 dark:text-amber-400 font-bold">À développer :</span>
            <span className="truncate">{missingSkills.slice(0, 2).join(', ')}</span>
          </div>
        )}

        {/* Description excerpt */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
          <Link
            href={`/opportunites/${opportunity.id}`}
            className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 dark:bg-blue-500/15 dark:hover:bg-blue-500/25 dark:border-blue-500/20 dark:text-blue-300 text-xs font-semibold transition-all"
          >
            Voir l&apos;offre
          </Link>

          <button
            onClick={() => setPrepModalOpen(true)}
            aria-label="Préparer ma candidature"
            title="Générer email et lettre de motivation"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:border-indigo-500/30 dark:text-indigo-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Préparer</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            aria-label="Postuler à cette offre"
            title="Postuler directement (redirection)"
            className="flex items-center justify-center gap-1 py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Postuler</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleToggleFavorite}
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              favorited
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-pink-500/20 dark:border-pink-500/40 dark:text-pink-400'
                : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:border-white/10 dark:text-slate-500 dark:hover:text-pink-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Candidature Redirection Modal */}
      <CandidatureModal
        opportunity={opportunity}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          try {
            const stored = JSON.parse(localStorage.getItem('opportunia_applications') || '[]')
            setApplied(stored.some((a: { opportunityId: string }) => a.opportunityId === opportunity.id))
          } catch {}
        }}
      />

      {/* Preparation Modal */}
      <ApplicationPreparationModal
        opportunity={opportunity}
        profile={profile}
        isOpen={prepModalOpen}
        onClose={() => setPrepModalOpen(false)}
      />
    </article>
  )
}

