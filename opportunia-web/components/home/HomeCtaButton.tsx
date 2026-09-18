'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { loadProfile } from '@/lib/storage'

interface HomeCtaButtonProps {
  compact?: boolean
}

export function HomeCtaButton({ compact }: HomeCtaButtonProps) {
  const [targetHref, setTargetHref] = useState('/profil')

  useEffect(() => {
    const profile = loadProfile()
    setTargetHref(profile ? '/dashboard' : '/profil')
  }, [])

  if (compact) {
    return (
      <Link
        href={targetHref}
        id="cta-search"
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all hover:shadow-md flex-shrink-0 cursor-pointer"
        style={{ background: '#3563E9', boxShadow: '0 2px 10px rgba(53,99,233,0.3)' }}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Rechercher</span>
      </Link>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Link
        href={targetHref}
        id="cta-main"
        className="flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl font-bold text-base text-white transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        style={{ background: '#3563E9', boxShadow: '0 4px 14px rgba(53,99,233,0.35)' }}
      >
        <span>Trouver mes opportunités</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href="/opportunites"
        id="cta-explore"
        className="flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl font-semibold text-base transition-all hover:-translate-y-0.5 cursor-pointer"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          color: '#1A2035',
          boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
        }}
      >
        Explorer les opportunités
      </Link>
    </div>
  )
}
