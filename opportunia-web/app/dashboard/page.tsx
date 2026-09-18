'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  RefreshCw,
  Flame,
  Heart,
} from 'lucide-react'
import { loadProfile, loadFavorites } from '@/lib/storage'
import { rankOpportunities } from '@/lib/matching'
import { OpportunityCard } from '@/components/opportunity/OpportunityCard'
import { ApplicationTrackerSummary } from '@/components/dashboard/ApplicationTrackerSummary'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { ALL_OPPORTUNITIES } from '@/lib/opportunities'
import type { UserProfile } from '@/types'

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
    return rankOpportunities(profile, ALL_OPPORTUNITIES, false)
  }, [profile])

  // Saved opportunities list
  const savedOpportunities = useMemo(() => {
    if (!profile || favorites.length === 0) return []
    return ALL_OPPORTUNITIES.filter((opp) => favorites.includes(opp.id)).map((opp) => {
      const match = ranked.find((r) => r.opportunity.id === opp.id)
      return match || rankOpportunities(profile, [opp], true)[0]
    })
  }, [profile, favorites, ranked])

  const expiringSoon = useMemo(
    () => ranked.filter((r) => r.expiringSoon).length,
    [ranked]
  )

  if (!mounted || !profile) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Chargement de ton espace personnalisé...</p>
        </div>
      </div>
    )
  }

  const prenom = profile.prenom || 'Étudiant'

  return (
    <div className="min-h-screen hero-gradient pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* ── Welcome Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 mb-2">
              <span>Espace Étudiant</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Bonjour {prenom}, voici tes opportunités
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
              Filière : <span className="font-semibold text-blue-700 dark:text-blue-400">{profile.filiere}</span> ({profile.niveau}) · Ville : <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.localisation}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profil"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white text-xs font-bold transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Modifier mon profil
            </Link>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <StatsBar
          totalMatches={ranked.length}
          savedCount={favorites.length}
          expiringSoonCount={expiringSoon}
          profileComplete={Boolean(profile.filiere && profile.niveau && profile.competences?.length > 0)}
        />

        {/* ── SECTION 1 : Meilleures opportunités pour toi ── */}
        <section aria-label="Meilleures opportunités">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Meilleures opportunités pour toi
                </h2>
                <p className="text-xs text-slate-400">
                  Classées par ordre de compatibilité avec ton profil et tes compétences
                </p>
              </div>
            </div>

            <Link
              href="/opportunites"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Explorer toutes les offres ({ALL_OPPORTUNITIES.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {ranked.length === 0 ? (
            <div className="glass-card p-12 text-center border-gradient">
              <p className="text-slate-400 mb-2">
                Nous n&apos;avons pas encore trouvé d&apos;offre correspondant parfaitement à ton profil.
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <Link
                  href="/opportunites"
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-semibold"
                >
                  Élargir ma recherche
                </Link>
                <Link
                  href="/profil"
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Améliorer mon profil
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ranked.slice(0, 6).map((result) => (
                <OpportunityCard key={result.opportunity.id} result={result} showScore />
              ))}
            </div>
          )}
        </section>

        {/* ── SECTION 2 : Mes candidatures ── */}
        <section aria-label="Mes candidatures">
          <ApplicationTrackerSummary />
        </section>

        {/* ── SECTION 3 : Opportunités sauvegardées ── */}
        <section aria-label="Opportunités sauvegardées">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Opportunités sauvegardées ({favorites.length})
              </h2>
            </div>
            {favorites.length > 0 && (
              <Link
                href="/sauvegardees"
                className="text-xs text-pink-400 hover:text-pink-300 font-semibold transition-colors"
              >
                Gérer les favoris →
              </Link>
            )}
          </div>

          {savedOpportunities.length === 0 ? (
            <div className="glass-card p-8 text-center border-gradient">
              <p className="text-slate-400 text-sm mb-3">
                Tu n&apos;as pas encore sauvegardé d&apos;opportunité en favoris.
              </p>
              <Link
                href="/opportunites"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
              >
                Découvrir les offres recommandées
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedOpportunities.slice(0, 3).map((result) => (
                <OpportunityCard key={result.opportunity.id} result={result} showScore />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
