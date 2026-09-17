'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { loadFavorites, loadProfile, toggleFavorite } from '@/lib/storage'
import { calculateMatchScore } from '@/lib/matching'
import { OpportunityCard } from '@/components/opportunity/OpportunityCard'
import opportunitiesData from '@/data/opportunities.json'
import type { Opportunity, UserProfile, MatchResult } from '@/types'

const ALL_OPPORTUNITIES = (opportunitiesData as { opportunities: Opportunity[] }).opportunities

export default function SaveeesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setFavorites(loadFavorites())
    setProfile(loadProfile())
    setMounted(true)
  }, [])

  const savedResults: MatchResult[] = useMemo(() => {
    const savedOpps = ALL_OPPORTUNITIES.filter((o) => favorites.includes(o.id))
    if (profile) {
      return savedOpps.map((opp) => calculateMatchScore(profile, opp))
    }
    return savedOpps.map((opp) => ({
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
  }, [favorites, profile])

  function handleRemove(id: string) {
    toggleFavorite(id)
    setFavorites((prev) => prev.filter((f) => f !== id))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-400 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mes opportunités sauvegardées</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {savedResults.length} opportunité{savedResults.length !== 1 ? 's' : ''} sauvegardée{savedResults.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {savedResults.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Aucune opportunité sauvegardée</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Explorez les opportunités et cliquez sur le cœur pour les sauvegarder ici.
            </p>
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-all"
            >
              Explorer les opportunités
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResults.map((result) => (
                <div key={result.opportunity.id} className="relative">
                  <OpportunityCard result={result} showScore={!!profile} />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(result.opportunity.id)}
                    className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-slate-400 hover:text-red-400 transition-colors text-xs font-medium"
                    aria-label="Retirer des favoris"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/opportunites"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Découvrir plus d&apos;opportunités
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
