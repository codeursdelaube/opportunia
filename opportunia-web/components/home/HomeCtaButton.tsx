'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { loadProfile } from '@/lib/storage'

export function HomeCtaButton() {
  const [targetHref, setTargetHref] = useState('/profil')
  const [buttonText, setButtonText] = useState('Trouver mes opportunités')

  useEffect(() => {
    const profile = loadProfile()
    if (profile) {
      setTargetHref('/dashboard')
      setButtonText('Mon espace orientation')
    } else {
      setTargetHref('/profil')
      setButtonText('Trouver mes opportunités')
    }
  }, [])

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Link
        href={targetHref}
        id="cta-main"
        className="flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-base transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 cursor-pointer"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        href="/opportunites"
        id="cta-explore"
        className="flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-base transition-all hover:bg-white/5 cursor-pointer"
      >
        Explorer les opportunités
      </Link>
    </div>
  )
}
