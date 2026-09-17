'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, CheckCircle2, ShieldCheck, ArrowRight, X, Sparkles } from 'lucide-react'
import type { Opportunity } from '@/types'

interface CandidatureModalProps {
  opportunity: Opportunity
  isOpen: boolean
  onClose: () => void
}

export function CandidatureModal({ opportunity, isOpen, onClose }: CandidatureModalProps) {
  const [countdown, setCountdown] = useState(3)
  const [isRedirected, setIsRedirected] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3)
      setIsRedirected(false)
      return
    }

    // Mark as applied in localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('opp_candidatures') || '[]')
      if (!stored.includes(opportunity.id)) {
        stored.push(opportunity.id)
        localStorage.setItem('opp_candidatures', JSON.stringify(stored))
      }
    } catch (e) {
      console.warn('Could not update candidatures in storage', e)
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleProceed()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, opportunity.id])

  function handleProceed() {
    setIsRedirected(true)
    const targetUrl = opportunity.lien_candidature || opportunity.source_url || 'https://www.linkedin.com/jobs/'
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  if (!isOpen) return null

  const targetUrl = opportunity.lien_candidature || opportunity.source_url || 'https://www.linkedin.com/jobs/'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#0f1629] dark:bg-[#0f1629] light:bg-white border border-blue-500/30 shadow-2xl overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-700 hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Redirection partenaire</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Lien officiel</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white dark:text-white light:text-slate-900">
              Postuler auprès de {opportunity.entreprise}
            </h3>
          </div>
        </div>

        {/* Opportunity Card Preview */}
        <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 mb-6">
          <h4 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm mb-1 line-clamp-1">
            {opportunity.titre}
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mb-3">
            {opportunity.entreprise} · {opportunity.localisation}
          </p>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 dark:border-white/10 light:border-slate-200">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">Plateforme d&apos;origine :</span>
            <span className="font-semibold text-blue-300 dark:text-blue-300 light:text-blue-600">
              {opportunity.source || 'LinkedIn'}
            </span>
          </div>
        </div>

        {/* Reassurance notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
          <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p>
            Vous quittez Opportunia pour finaliser votre dossier directement sur la plateforme de recrutement officielle.
          </p>
        </div>

        {/* Countdown & Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleProceed}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {isRedirected ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Lien ouvert dans un nouvel onglet
              </>
            ) : (
              <>
                <span>Accéder à l&apos;offre maintenant</span>
                {countdown > 0 && <span className="text-xs opacity-75">({countdown}s)</span>}
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-800 transition-colors cursor-pointer text-center"
          >
            Rester sur Opportunia
          </button>
        </div>
      </div>
    </div>
  )
}
