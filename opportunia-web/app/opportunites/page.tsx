'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
import { OpportunityCard } from '@/components/opportunity/OpportunityCard'
import { loadProfile } from '@/lib/storage'
import { rankOpportunities, computeDeadlineInfo } from '@/lib/matching'
import { getTypeLabel } from '@/lib/utils'
import { ALL_OPPORTUNITIES } from '@/lib/opportunities'
import type { MatchResult, UserProfile } from '@/types'

const TYPES = ['Tous', 'stage', 'emploi', 'bourse', 'concours', 'formation', 'projet', 'freelance']
const NIVEAUX = ['Tous', 'Aucun', 'Bac', 'Licence / Bac+3', 'Master', 'Doctorat']
const LOCALISATIONS = ['Toutes', 'À distance', 'Afrique / Régional', 'International']
const SORTS = ['Pertinence', 'Deadline', 'Plus récent']

export default function OpportunitesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [niveauFilter, setNiveauFilter] = useState('Tous')
  const [locFilter, setLocFilter] = useState('Toutes')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('active')
  const [forYouOnly, setForYouOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Pertinence')
  const [showFilters, setShowFilters] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  // Build match results for all opportunities
  const allResults: MatchResult[] = useMemo(() => {
    if (profile) {
      return rankOpportunities(profile, ALL_OPPORTUNITIES, true)
    }
    // No profile → neutral results with score 0 and accurate deadline calculations
    return ALL_OPPORTUNITIES.map((opp) => {
      const deadlineInfo = computeDeadlineInfo(opp.deadline, opp.status)
      return {
        opportunity: opp,
        score: 0,
        breakdown: { filiere: 0, niveau: 0, competences: 0, localisation: 0, interets: 0 },
        matchedSkills: [],
        missingSkills: opp.competences_requises,
        reasons: [],
        isExpired: deadlineInfo.isExpired,
        daysRemaining: deadlineInfo.daysRemaining,
        expiringSoon: deadlineInfo.expiringSoon,
      }
    })
  }, [profile])

  const filtered = useMemo(() => {
    let results = allResults

    // "Pour toi" filter
    if (forYouOnly) {
      if (profile) {
        results = results.filter((r) => r.score >= 40 && !r.isExpired)
      } else {
        return []
      }
    }

    // Status filter
    if (statusFilter === 'active') {
      results = results.filter((r) => !r.isExpired && r.opportunity.status !== 'expired')
    } else if (statusFilter === 'expired') {
      results = results.filter((r) => r.isExpired || r.opportunity.status === 'expired')
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (r) =>
          r.opportunity.titre.toLowerCase().includes(q) ||
          r.opportunity.entreprise.toLowerCase().includes(q) ||
          r.opportunity.description.toLowerCase().includes(q) ||
          r.opportunity.type.toLowerCase().includes(q) ||
          (r.opportunity.competences_requises || []).some((c) => c.toLowerCase().includes(q))
      )
    }

    // Type filter
    if (typeFilter !== 'Tous') {
      const tf = typeFilter.toLowerCase()
      results = results.filter((r) => {
        const oppType = (r.opportunity.type || '').toLowerCase()
        if (tf === 'emploi') return oppType === 'emploi' || oppType === 'job'
        return oppType === tf
      })
    }

    // Niveau filter
    if (niveauFilter !== 'Tous') {
      if (niveauFilter === 'Licence / Bac+3') {
        results = results.filter((r) => {
          const niv = (r.opportunity.niveau_min || '').toLowerCase()
          return niv.includes('licence') || niv.includes('bac+3')
        })
      } else if (niveauFilter === 'Aucun') {
        results = results.filter((r) => {
          const niv = (r.opportunity.niveau_min || '').toLowerCase()
          return niv === 'aucun' || niv === '' || niv.includes('sans')
        })
      } else {
        results = results.filter((r) =>
          (r.opportunity.niveau_min || '').toLowerCase().includes(niveauFilter.toLowerCase())
        )
      }
    }

    // Location filter
    if (locFilter !== 'Toutes') {
      if (locFilter === 'À distance') {
        results = results.filter((r) =>
          ['distance', 'remote', 'en ligne', 'teletravail'].some((kw) =>
            r.opportunity.localisation.toLowerCase().includes(kw)
          )
        )
      } else if (locFilter === 'Afrique / Régional') {
        results = results.filter((r) =>
          ['afrique', 'benin', 'togo', 'cote d ivoire', 'senegal', 'ethiopie', 'kenya'].some((kw) =>
            r.opportunity.localisation.toLowerCase().includes(kw)
          )
        )
      } else if (locFilter === 'International') {
        results = results.filter((r) =>
          ['international', 'mondial', 'canada', 'saoudite', 'turkiye', 'portugal', 'cambodge'].some((kw) =>
            r.opportunity.localisation.toLowerCase().includes(kw)
          )
        )
      } else {
        const q = locFilter.toLowerCase()
        results = results.filter((r) => r.opportunity.localisation.toLowerCase().includes(q))
      }
    }

    // Sort
    if (sortBy === 'Deadline') {
      results = [...results].sort((a, b) => {
        const da = a.opportunity.deadline
        const db = b.opportunity.deadline
        if (!da && !db) return 0
        if (!da) return 1
        if (!db) return -1
        return new Date(da).getTime() - new Date(db).getTime()
      })
    } else if (sortBy === 'Plus récent') {
      results = [...results].reverse()
    }

    return results
  }, [allResults, search, typeFilter, niveauFilter, locFilter, statusFilter, forYouOnly, sortBy, profile])

  const activeFiltersCount = [
    typeFilter !== 'Tous',
    niveauFilter !== 'Tous',
    locFilter !== 'Toutes',
    statusFilter !== 'active',
    forYouOnly,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen hero-gradient pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Catalogue d&apos;opportunités
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {filtered.length} offre{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
                {profile && <span className="text-blue-300"> · triées selon la compatibilité avec ton profil</span>}
              </p>
            </div>

            {/* "Pour toi" toggle button */}
            <button
              onClick={() => setForYouOnly(!forYouOnly)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
                forYouOnly
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${forYouOnly ? 'text-amber-300' : 'text-blue-400'}`} />
              <span>Pour toi {profile ? `(${profile.filiere})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Search & filters bar */}
        <div className="glass-card p-4 mb-8 border-gradient">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                placeholder="Rechercher par titre, entreprise, compétence (ex: React, Python, Vente)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s} value={s} className="bg-[#0f1629] text-white">
                  Trier par : {s}
                </option>
              ))}
            </select>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                  Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        typeFilter === t
                          ? 'bg-blue-500/30 border-blue-500 text-blue-200 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === 'Tous' ? 'Tous' : getTypeLabel(t as never)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                  Niveau
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NIVEAUX.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNiveauFilter(n)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        niveauFilter === n
                          ? 'bg-blue-500/30 border-blue-500 text-blue-200 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                  Localisation
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LOCALISATIONS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocFilter(l)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        locFilter === l
                          ? 'bg-blue-500/30 border-blue-500 text-blue-200 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                  Statut
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'active', label: 'Offres actives' },
                    { id: 'all', label: 'Toutes (avec expirées)' },
                    { id: 'expired', label: 'Expirées seulement' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatusFilter(s.id as never)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        statusFilter === s.id
                          ? 'bg-blue-500/30 border-blue-500 text-blue-200 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick types bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {t === 'Tous' ? 'Toutes les catégories' : getTypeLabel(t as never)}
            </button>
          ))}
        </div>

        {/* Empty States */}
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center border-gradient">
            {forYouOnly && !profile ? (
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Complète ton profil pour obtenir des recommandations personnalisées.
                </h3>
                <p className="text-slate-400 text-sm">
                  Opportunia utilise ta filière, ton niveau et tes compétences pour calculer les meilleures opportunités.
                </p>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30"
                >
                  <span>Créer mon profil</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Nous n&apos;avons pas encore trouvé d&apos;offre correspondant parfaitement à tes critères.
                </h3>
                <p className="text-slate-400 text-sm">
                  Essaie d&apos;élargir les filtres ou d&apos;ajouter d&apos;autres compétences à ton profil.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSearch('')
                      setTypeFilter('Tous')
                      setNiveauFilter('Tous')
                      setLocFilter('Toutes')
                      setStatusFilter('active')
                      setForYouOnly(false)
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold cursor-pointer"
                  >
                    Élargir ma recherche
                  </button>
                  <Link
                    href="/profil"
                    className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Améliorer mon profil
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((result) => (
              <OpportunityCard key={result.opportunity.id} result={result} showScore={!!profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
