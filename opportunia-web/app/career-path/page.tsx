'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Compass, Sparkles, RefreshCw } from 'lucide-react'
import { loadProfile } from '@/lib/storage'
import { CareerPathView } from '@/components/career/CareerPathView'
import type { UserProfile } from '@/types'

export default function CareerPathPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setProfile(loadProfile())
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!profile) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center pt-20 px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-slate-300 mb-4">
            Complète ton profil pour générer ton parcours d&apos;orientation personnalisé.
          </p>
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-semibold text-sm"
          >
            Créer mon profil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
          <Link
            href="/profil"
            className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Changer mon objectif
          </Link>
        </div>

        <CareerPathView profile={profile} showOpportunities={true} />
      </div>
    </div>
  )
}
