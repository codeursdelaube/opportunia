'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { loadProfile, loadFavorites, clearProfile } from '@/lib/storage'
import { rankOpportunities } from '@/lib/matching'
import { OpportunityCard } from '@/components/opportunity/OpportunityCard'
import { StatsBar } from '@/components/dashboard/StatsBar'
import opportunitiesData from '@/data/opportunities.json'
import type { Opportunity, UserProfile } from '@/types'

const ALL_OPPORTUNITIES = (opportunitiesData as { opportunities: Opportunity[] }).opportunities

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const p = loadProfile()
    if (!p) {
      router.replace('/profil')
      return
    }
    setProfile(p)
    setFavorites(loadFavorites())
    setMounted(true)
  }, [router])

  // Rank opportunities using the matching engine
  const ranked = useMemo(() => {
    if (!profile) return []
    return rankOpportunities(profile, ALL_OPPORTUNITIES)
  }, [profile])

  const expiringSoon = useMemo(
    () => ranked.filter((r) => r.expiringSoon).length,
    [ranked],
  )

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement de vos opportunités...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-slate-500 text-sm mb-2">Bonjour 👋</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Voici vos opportunités personnalisées
          </h1>
          <p className="text-slate-400">
            Nous avons trouvé{' '}
            <span className="text-blue-300 font-semibold">{ranked.length} opportunités</span>{' '}
            correspondant à votre profil en{' '}
            <span className="text-white font-medium">{profile.filiere}</span>.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <StatsBar
            totalMatches={ranked.length}
            savedCount={favorites.length}
            expiringSoonCount={expiringSoon}
            profileComplete={true}
          />
        </div>

        {/* Profile summary */}
        <div className="glass-card p-5 mb-10 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              {profile.filiere.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{profile.filiere} · {profile.niveau}</p>
              <p className="text-slate-500 text-xs">{profile.localisation} · {profile.competences.length} compétences</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.interets.slice(0, 3).map((i) => (
                <span key={i} className="chip border bg-purple-500/15 text-purple-300 border-purple-500/25">
                  {i}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profil"
              className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Modifier le profil
            </Link>
            <button
              onClick={() => { clearProfile(); router.replace('/') }}
              className="text-xs text-slate-600 hover:text-red-400 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Opportunities grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Vos meilleures opportunités
          </h2>
          <Link
            href="/opportunites"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Toutes les offres
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {ranked.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <p className="text-slate-400 mb-4">Aucune opportunité trouvée pour ce profil.</p>
            <Link href="/opportunites" className="text-blue-400 hover:text-blue-300 text-sm">
              Parcourir toutes les opportunités →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ranked.map((result) => (
              <OpportunityCard key={result.opportunity.id} result={result} showScore />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
