'use client'

import { use, useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  GraduationCap,
  Clock,
  Building2,
  ExternalLink,
  Heart,
  ArrowLeft,
  FileEdit,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Share2,
  Sparkles,
} from 'lucide-react'
import { TypeBadge } from '@/components/ui/Badge'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { MatchingChart } from '@/components/opportunity/MatchingChart'
import { MissingSkillsSection } from '@/components/opportunity/MissingSkillsSection'
import { ChecklistSection } from '@/components/opportunity/ChecklistSection'
import { ApplicationPreparationModal } from '@/components/opportunity/ApplicationPreparationModal'
import { CandidatureModal } from '@/components/opportunity/CandidatureModal'
import { loadProfile, toggleFavorite, isFavorite, trackApplication, loadApplications } from '@/lib/storage'
import { calculateMatchScore } from '@/lib/matching'
import { formatDeadline } from '@/lib/utils'
import { ALL_OPPORTUNITIES } from '@/lib/opportunities'
import type { Opportunity, UserProfile, MatchResult } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OpportunityDetailPage({ params }: PageProps) {
  const { id } = use(params)

  const opportunity = ALL_OPPORTUNITIES.find((o) => o.id === id)
  if (!opportunity) notFound()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [prepModalOpen, setPrepModalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [appStatus, setAppStatus] = useState<string | null>(null)

  useEffect(() => {
    setProfile(loadProfile())
    setFavorited(isFavorite(id))

    const apps = loadApplications()
    const found = apps.find((a) => a.opportunityId === id)
    if (found) setAppStatus(found.status)

    setMounted(true)
  }, [id])

  const matchResult: MatchResult | null = useMemo(() => {
    if (!profile) return null
    return calculateMatchScore(profile, opportunity)
  }, [profile, opportunity])

  function handleToggleFavorite() {
    const { isFavorite: newState } = toggleFavorite(id)
    setFavorited(newState)
  }

  function handleApplyDirect() {
    trackApplication(id, 'sent')
    setAppStatus('sent')
  }

  const days = matchResult?.daysRemaining
  const isExpiringSoon = matchResult?.expiringSoon
  const isExpired = opportunity.status === 'expired' || (days !== null && days !== undefined && days < 0)

  const hasVerifiedSource =
    opportunity.source &&
    ['linkedin', 'anpe', 'opportunia', 'aiesec', 'gouv', 'france volontaires'].some((s) =>
      opportunity.source.toLowerCase().includes(s)
    )

  return (
    <div className="min-h-screen hero-gradient pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs / Back */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/opportunites"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux opportunités
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">ID: {opportunity.id}</span>
          </div>
        </div>

        {/* ── Main Header Card ───────────────────────────────── */}
        <div className="glass-card p-6 sm:p-8 border-gradient mb-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={opportunity.type} />
                {hasVerifiedSource && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Source : {opportunity.source}
                  </span>
                )}
                {isExpired ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-600/90 text-white">
                    🔴 Offre expirée
                  </span>
                ) : isExpiringSoon ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500 text-white">
                    <AlertCircle className="w-3.5 h-3.5" />
                    ⏰ {days === 0 ? "Expire aujourd'hui" : `Plus que ${days} jour(s)`}
                  </span>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {opportunity.titre}
              </h1>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  {opportunity.entreprise}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {opportunity.localisation}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Niveau {opportunity.niveau_min}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Deadline : {formatDeadline(opportunity.deadline)}
                </span>
              </div>
            </div>

            {/* Score Ring Preview */}
            {mounted && matchResult && (
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl flex-shrink-0">
                <ScoreRing score={matchResult.score} size={84} strokeWidth={6} />
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                    Compatibilité
                  </span>
                  <p className="text-xl font-black text-white">
                    {matchResult.score}%
                  </p>
                  <p className="text-[11px] text-slate-400">avec ton profil</p>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            {/* Bouton Candidater : lien direct officiel */}
            <a
              href={opportunity.lien_candidature || opportunity.source_url || 'https://www.linkedin.com/jobs/'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyDirect}
              id="btn-candidater-direct"
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>Candidater</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Bouton Préparer ma candidature */}
            <button
              onClick={() => setPrepModalOpen(true)}
              id="btn-preparer-candidature"
              className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>Préparer ma candidature</span>
            </button>

            {/* Bouton Sauvegarder */}
            <button
              onClick={handleToggleFavorite}
              id="btn-save-detail"
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                favorited
                  ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
              }`}
              title={favorited ? 'Retirer des favoris' : 'Sauvegarder cette offre'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Status badge if applied */}
          {appStatus && (
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Statut dans ton tracker : {appStatus.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* ── Grid 2 columns ──────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left / Main column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Pourquoi cette offre te correspond */}
            {mounted && matchResult && (
              <div className="glass-card p-6 border-gradient">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg">
                      Pourquoi cette offre te correspond
                    </h3>
                    <p className="text-xs text-slate-400">
                      Points forts et adéquation calculés avec ton profil
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {matchResult.reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm ${
                        reason.type === 'positive'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                          : reason.type === 'neutral'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                          : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
                      }`}
                    >
                      <span className="font-bold flex-shrink-0">
                        {reason.type === 'positive' ? '✓' : reason.type === 'neutral' ? '⚠' : '○'}
                      </span>
                      <span className="leading-snug">{reason.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Ce qu'il te manque */}
            {mounted && matchResult && (
              <MissingSkillsSection
                advice={matchResult.advice}
                score={matchResult.score}
              />
            )}

            {/* 3. À propos de l'offre */}
            <div className="glass-card p-6 border-gradient">
              <h3 className="font-bold text-white text-base sm:text-lg mb-3">
                À propos de l&apos;offre
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </div>

            {/* 4. Compétences requises */}
            <div className="glass-card p-6 border-gradient">
              <h3 className="font-bold text-white text-base sm:text-lg mb-3">
                Compétences requises
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.competences_requises.map((skill) => {
                  const isMatched = matchResult?.matchedSkills.includes(skill)
                  return (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 ${
                        isMatched
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      {isMatched && <span className="text-emerald-400 font-bold">✓</span>}
                      {skill}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* 5. Avant de candidater (Checklist) */}
            <ChecklistSection opportunityId={opportunity.id} />
          </div>

          {/* Right column (1 col) */}
          <div className="space-y-6">
            {/* Compatibility Radar Chart */}
            {mounted && matchResult && (
              <div className="glass-card p-6 border-gradient">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Analyse de compatibilité
                </h3>

                <div className="flex justify-center mb-2">
                  <ScoreRing score={matchResult.score} size={110} strokeWidth={8} />
                </div>

                <p className="text-center text-xs text-slate-400 mb-4">
                  Score global pondéré :{' '}
                  <span className="text-emerald-400 font-bold">{matchResult.score}/100</span>
                </p>

                {/* Radar chart Recharts */}
                <MatchingChart breakdown={matchResult.breakdown} score={matchResult.score} />

                {/* Dimensions breakdown bars */}
                <div className="mt-5 space-y-3">
                  {[
                    { label: 'Filière', score: matchResult.breakdown.filiere, max: 30 },
                    { label: 'Niveau', score: matchResult.breakdown.niveau, max: 20 },
                    { label: 'Compétences', score: matchResult.breakdown.competences, max: 30 },
                    { label: 'Localisation', score: matchResult.breakdown.localisation, max: 10 },
                    { label: 'Intérêts', score: matchResult.breakdown.interets, max: 10 },
                  ].map(({ label, score, max }) => {
                    const percent = Math.round((score / max) * 100)
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400 font-medium">{label}</span>
                          <span className="text-white font-bold">
                            {score}/{max} ({percent}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Opportunity Quick Info */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Informations clés
              </h3>
              {[
                { label: 'Type d’opportunité', value: opportunity.type },
                { label: 'Structure', value: opportunity.entreprise },
                { label: 'Localisation', value: opportunity.localisation },
                { label: 'Niveau d’études min.', value: opportunity.niveau_min },
                { label: 'Source', value: opportunity.source },
                { label: 'Date limite', value: formatDeadline(opportunity.deadline) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 text-xs py-1 border-b border-white/5">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal préparation candidature */}
      <ApplicationPreparationModal
        opportunity={opportunity}
        profile={profile}
        isOpen={prepModalOpen}
        onClose={() => setPrepModalOpen(false)}
        onPrepared={() => setAppStatus('prepared')}
      />

      {/* Modal redirection candidature standard */}
      <CandidatureModal
        opportunity={opportunity}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
