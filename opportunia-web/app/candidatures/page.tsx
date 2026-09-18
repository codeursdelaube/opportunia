'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Send,
  Heart,
  FileEdit,
  Clock,
  Mic,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
  Trash2,
  Plus,
  Sparkles,
} from 'lucide-react'
import { loadApplications, updateApplicationStatus, removeApplication } from '@/lib/storage'
import { ALL_OPPORTUNITIES } from '@/lib/opportunities'
import type { ApplicationItem, ApplicationStatus } from '@/types'
import { formatDeadline } from '@/lib/utils'

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  saved: { label: 'Sauvegardée', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/30' },
  prepared: { label: 'Candidature préparée', icon: FileEdit, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/30' },
  sent: { label: 'Candidature envoyée', icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  pending: { label: 'En attente de retour', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  interview: { label: 'Entretien prévu', icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  accepted: { label: 'Offre acceptée !', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  rejected: { label: 'Non retenu', icon: XCircle, color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-600/40' },
}

export default function CandidaturesPage() {
  const [apps, setApps] = useState<ApplicationItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setApps(loadApplications())
    setMounted(true)
  }, [])

  function handleStatusChange(opportunityId: string, newStatus: ApplicationStatus) {
    const updated = updateApplicationStatus(opportunityId, newStatus)
    setApps(updated)
  }

  function handleRemove(opportunityId: string) {
    const updated = removeApplication(opportunityId)
    setApps(updated)
  }

  const enrichedApps = useMemo(() => {
    return apps.map((app) => {
      const opp = ALL_OPPORTUNITIES.find((o) => o.id === app.opportunityId)
      return {
        ...app,
        opportunity: opp,
      }
    })
  }, [apps])

  const filteredApps = useMemo(() => {
    if (selectedFilter === 'all') return enrichedApps
    return enrichedApps.filter((a) => a.status === selectedFilter)
  }, [enrichedApps, selectedFilter])

  if (!mounted) return null

  return (
    <div className="min-h-screen hero-gradient pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs sm:text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Gestionnaire de candidatures
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
                  {apps.length} dossier{apps.length > 1 ? 's' : ''}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-1">
                Suivi de mes candidatures
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Pilote chaque étape de tes démarches, de la préparation jusqu&apos;à l&apos;acceptation.
              </p>
            </div>

            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Trouver d&apos;autres offres</span>
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            Toutes ({apps.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = apps.filter((a) => a.status === key).length
            return (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                <span>{cfg.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* List of Applications */}
        {filteredApps.length === 0 ? (
          <div className="glass-card p-12 text-center border-gradient">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Tu n&apos;as pas encore de candidature dans cette catégorie.
            </h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Explore les opportunités recommandées selon ton profil et prépare tes dossiers en quelques clics.
            </p>
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Découvrir les opportunités</span>
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((item) => {
              const opp = item.opportunity
              const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.saved
              const Icon = statusCfg.icon

              return (
                <div
                  key={item.opportunityId}
                  className="glass-card p-5 sm:p-6 border-gradient flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusCfg.bg} ${statusCfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {statusCfg.label}
                      </span>
                      {opp && (
                        <span className="text-xs text-slate-400">
                          {opp.type} · {opp.entreprise} · {opp.localisation}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/opportunites/${item.opportunityId}`}
                      className="block font-bold text-base sm:text-lg text-white hover:text-blue-300 transition-colors"
                    >
                      {opp ? opp.titre : `Opportunité ${item.opportunityId}`}
                    </Link>

                    {opp && (
                      <p className="text-xs text-slate-400">
                        Date limite : {formatDeadline(opp.deadline)}
                      </p>
                    )}
                  </div>

                  {/* Actions & Status Selector */}
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.opportunityId, e.target.value as ApplicationStatus)
                      }
                      className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400 font-medium cursor-pointer"
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                        <option key={k} value={k} className="bg-slate-900 text-white">
                          Statut : {cfg.label}
                        </option>
                      ))}
                    </select>

                    <Link
                      href={`/opportunites/${item.opportunityId}`}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
                      title="Voir la fiche détaillée"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleRemove(item.opportunityId)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer"
                      title="Retirer du suivi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
