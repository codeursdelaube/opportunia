'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { OpportunityCard } from '@/components/opportunity/OpportunityCard'
import { loadProfile } from '@/lib/storage'
import { rankOpportunities, calculateMatchScore } from '@/lib/matching'
import { getTypeLabel } from '@/lib/utils'
import opportunitiesData from '@/data/opportunities.json'
import type { Opportunity, MatchResult } from '@/types'

const ALL_OPPORTUNITIES = (opportunitiesData as { opportunities: Opportunity[] }).opportunities

const TYPES = ['Tous', 'stage', 'emploi', 'bourse', 'concours', 'formation', 'freelance']
const NIVEAUX = ['Tous', 'Bac', 'Bac+1', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5', 'Master']
const LOCALISATIONS = ['Toutes', 'Lomé', 'International', 'À distance']
const SORTS = ['Pertinence', 'Deadline', 'Plus récent']

export default function OpportunitesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [niveauFilter, setNiveauFilter] = useState('Tous')
  const [locFilter, setLocFilter] = useState('Toutes')
  const [sortBy, setSortBy] = useState('Pertinence')
  const [showFilters, setShowFilters] = useState(false)

  const profile = useMemo(() => loadProfile(), [])

  // Build match results for all opportunities
  const allResults: MatchResult[] = useMemo(() => {
    if (profile) {
      return rankOpportunities(profile, ALL_OPPORTUNITIES, true)
    }
    // No profile → create dummy results with score 0
    return ALL_OPPORTUNITIES.map((opp) => ({
      opportunity: opp,
      score: 0,
      breakdown: { filiere: 0, niveau: 0, competences: 0, localisation: 0, interets: 0 },
      matchedSkills: [],
      missingSkills: opp.competences_requises,
      reasons: [],
      isExpired: false,
      daysRemaining: null,
      expiringSoon: false,
    }))
  }, [profile])

  const filtered = useMemo(() => {
    let results = allResults

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (r) =>
          r.opportunity.titre.toLowerCase().includes(q) ||
          r.opportunity.entreprise.toLowerCase().includes(q) ||
          r.opportunity.description.toLowerCase().includes(q) ||
          r.opportunity.type.toLowerCase().includes(q),
      )
    }

    // Type filter
    if (typeFilter !== 'Tous') {
      results = results.filter((r) => r.opportunity.type === typeFilter)
    }

    // Niveau filter
    if (niveauFilter !== 'Tous') {
      results = results.filter((r) => r.opportunity.niveau_min === niveauFilter)
    }

    // Location filter
    if (locFilter !== 'Toutes') {
      const q = locFilter.toLowerCase()
      results = results.filter((r) =>
        r.opportunity.localisation.toLowerCase().includes(q) ||
        (locFilter === 'À distance' &&
          ['distance', 'remote', 'international'].some((kw) =>
            r.opportunity.localisation.toLowerCase().includes(kw),
          )),
      )
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
    // Default: already sorted by score

    return results
  }, [allResults, search, typeFilter, niveauFilter, locFilter, sortBy])

  const activeFiltersCount = [
    typeFilter !== 'Tous',
    niveauFilter !== 'Tous',
    locFilter !== 'Toutes',
  ].filter(Boolean).length

  return (
    <div className="min-h-screen hero-gradient pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Toutes les opportunités
          </h1>
          <p className="text-slate-400">
            {filtered.length} opportunité{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
            {profile && <span className="text-blue-300"> · triées par compatibilité avec votre profil</span>}
          </p>
        </div>

        {/* Search & filters bar */}
        <div className="glass-card p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                placeholder="Rechercher une opportunité, entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
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
                <option key={s} value={s} className="bg-[#0f1629]">
                  {s}
                </option>
              ))}
            </select>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/8 grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                  Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`chip border text-xs transition-all ${
                        typeFilter === t
                          ? 'bg-blue-500/25 border-blue-500/50 text-blue-200'
                          : 'bg-white/4 border-white/10 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {t === 'Tous' ? 'Tous' : getTypeLabel(t as never)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                  Niveau
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {NIVEAUX.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNiveauFilter(n)}
                      className={`chip border text-xs transition-all ${
                        niveauFilter === n
                          ? 'bg-blue-500/25 border-blue-500/50 text-blue-200'
                          : 'bg-white/4 border-white/10 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                  Localisation
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LOCALISATIONS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocFilter(l)}
                      className={`chip border text-xs transition-all ${
                        locFilter === l
                          ? 'bg-blue-500/25 border-blue-500/50 text-blue-200'
                          : 'bg-white/4 border-white/10 text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Type quick-filters row */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                typeFilter === t
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/25'
              }`}
            >
              {t === 'Tous' ? 'Toutes' : getTypeLabel(t as never)}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 glass-card">
            <p className="text-slate-400 text-lg mb-2">Aucune opportunité trouvée</p>
            <p className="text-slate-600 text-sm">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setTypeFilter('Tous')
                setNiveauFilter('Tous')
                setLocFilter('Toutes')
              }}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((result) => (
              <OpportunityCard
                key={result.opportunity.id}
                result={result}
                showScore={!!profile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
