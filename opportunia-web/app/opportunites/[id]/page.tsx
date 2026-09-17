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
  Globe,
  AlertCircle,
} from 'lucide-react'
import { TypeBadge } from '@/components/ui/Badge'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { MatchingChart } from '@/components/opportunity/MatchingChart'
import { MatchReasons } from '@/components/opportunity/MatchReasons'
import { CandidatureModal } from '@/components/opportunity/CandidatureModal'
import { loadProfile, toggleFavorite, isFavorite } from '@/lib/storage'
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
  const [modalOpen, setModalOpen] = useState(false)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
    setFavorited(isFavorite(id))
    try {
      const stored = JSON.parse(localStorage.getItem('opp_candidatures') || '[]')
      setApplied(stored.includes(id))
    } catch {
      // ignore
    }
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

  const days = matchResult?.daysRemaining
  const isExpiringSoon = matchResult?.expiringSoon

  return (
    <div className="min-h-screen hero-gradient pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link
          href="/opportunites"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux opportunités
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Main content ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image */}
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
              <Image
                src={opportunity.image}
                alt={opportunity.titre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
              <div className="absolute inset-0 card-img-overlay" />
              <div className="absolute top-4 left-4 flex gap-2">
                <TypeBadge type={opportunity.type} />
                {isExpiringSoon && (
                  <span className="chip border bg-orange-500/90 text-white border-orange-500/50">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Expire bientôt
                  </span>
                )}
              </div>
            </div>

            {/* Title & meta */}
            <div className="glass-card p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                {opportunity.titre}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  {opportunity.entreprise}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {opportunity.localisation}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  {opportunity.niveau_min}
                </span>
                <span className={`flex items-center gap-1.5 ${isExpiringSoon ? 'text-orange-400' : ''}`}>
                  <Clock className="w-4 h-4" />
                  {formatDeadline(opportunity.deadline)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-500" />
                  {opportunity.source}
                </span>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
                  Description
                </h2>
                <p className="text-slate-300 leading-relaxed">{opportunity.description}</p>
              </div>
            </div>

            {/* Skills required */}
            {opportunity.competences_requises.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
                  Compétences requises
                </h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.competences_requises.map((skill) => (
                    <span
                      key={skill}
                      className={`chip border ${
                        matchResult?.matchedSkills.includes(skill)
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {mounted && profile && (
                  <p className="text-xs text-slate-500 mt-3">
                    {matchResult?.matchedSkills.length ?? 0} sur {opportunity.competences_requises.length} compétences correspondent à votre profil
                  </p>
                )}
              </div>
            )}

            {/* Match reasons (if profile exists) */}
            {mounted && matchResult && (
              <div className="glass-card p-6">
                <MatchReasons result={matchResult} />
              </div>
            )}

            {/* No profile prompt */}
            {mounted && !profile && (
              <div className="glass-card p-6 border border-blue-500/20 bg-blue-500/5 text-center">
                <p className="text-slate-300 mb-3">
                  Créez votre profil pour voir votre score de compatibilité avec cette offre.
                </p>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all"
                >
                  Créer mon profil
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Score & chart (if profile) */}
            {mounted && matchResult && (
              <div className="glass-card p-6 border-gradient">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
                  Votre compatibilité
                </h2>

                {/* Score ring */}
                <div className="flex justify-center mb-4">
                  <ScoreRing score={matchResult.score} size={110} strokeWidth={8} />
                </div>

                {/* Score label */}
                <p className="text-center text-xs text-slate-500 mb-6">
                  {matchResult.score >= 80
                    ? '🎯 Excellente correspondance'
                    : matchResult.score >= 60
                    ? '✅ Bonne correspondance'
                    : matchResult.score >= 40
                    ? '⚡ Correspondance partielle'
                    : '💡 Correspondance limitée'}
                </p>

                {/* Radar chart */}
                <MatchingChart breakdown={matchResult.breakdown} score={matchResult.score} />

                {/* Dimension breakdown */}
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'Filière', score: matchResult.breakdown.filiere, max: 30 },
                    { label: 'Niveau', score: matchResult.breakdown.niveau, max: 20 },
                    { label: 'Compétences', score: matchResult.breakdown.competences, max: 30 },
                    { label: 'Localisation', score: matchResult.breakdown.localisation, max: 10 },
                    { label: 'Intérêts', score: matchResult.breakdown.interets, max: 10 },
                  ].map(({ label, score, max }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{label}</span>
                        <span className="text-slate-400 font-medium">
                          {score}/{max}
                        </span>
                      </div>
                      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-400 transition-all"
                          style={{ width: `${(score / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="glass-card p-5 space-y-3">
              <button
                onClick={() => setModalOpen(true)}
                id="btn-candidater"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer"
              >
                {applied ? 'Postuler à nouveau' : 'Candidater'}
                <ExternalLink className="w-4 h-4" />
              </button>

              {applied && (
                <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span>✓ Candidature enregistrée</span>
                </div>
              )}

              <button
                onClick={handleToggleFavorite}
                id="btn-save-favorite"
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border font-medium text-sm transition-all cursor-pointer ${
                  favorited
                    ? 'bg-pink-500/20 border-pink-500/40 text-pink-300 hover:bg-pink-500/30'
                    : 'bg-white/5 border-white/15 text-slate-400 hover:text-white hover:border-white/30'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                {favorited ? 'Sauvegardée' : 'Sauvegarder'}
              </button>
            </div>

            {/* Candidature Redirection Modal */}
            <CandidatureModal
              opportunity={opportunity}
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false)
                try {
                  const stored = JSON.parse(localStorage.getItem('opp_candidatures') || '[]')
                  setApplied(stored.includes(id))
                } catch {}
              }}
            />

            {/* Quick info */}
            <div className="glass-card p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Informations
              </h3>
              {[
                { label: 'Type', value: opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1) },
                { label: 'Entreprise', value: opportunity.entreprise },
                { label: 'Source', value: opportunity.source },
                { label: 'Niveau', value: opportunity.niveau_min },
                { label: 'Deadline', value: formatDeadline(opportunity.deadline) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs text-slate-300 font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
