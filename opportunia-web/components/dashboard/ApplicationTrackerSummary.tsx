'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Send,
  Heart,
  FileEdit,
  Clock,
  Mic,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { loadApplications, loadFavorites } from '@/lib/storage'
import type { ApplicationItem } from '@/types'

export function ApplicationTrackerSummary() {
  const [apps, setApps] = useState<ApplicationItem[]>([])
  const [favCount, setFavCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setApps(loadApplications())
    setFavCount(loadFavorites().length)
    setMounted(true)
  }, [])

  if (!mounted) return null

  const counts = {
    saved: favCount,
    prepared: apps.filter((a) => a.status === 'prepared').length,
    sent: apps.filter((a) => a.status === 'sent').length,
    pending: apps.filter((a) => a.status === 'pending').length,
    interview: apps.filter((a) => a.status === 'interview').length,
    accepted: apps.filter((a) => a.status === 'accepted').length,
  }

  const columns = [
    { label: 'Sauvegardées', count: counts.saved, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { label: 'Préparées', count: counts.prepared, icon: FileEdit, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Envoyées', count: counts.sent, icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'En attente', count: counts.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Entretiens', count: counts.interview, icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Acceptées', count: counts.accepted, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ]

  return (
    <div className="glass-card p-6 sm:p-8 border-gradient">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Pipeline de suivi
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
              Temps réel
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            📋 Mes candidatures
          </h2>
        </div>

        <Link
          href="/candidatures"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-semibold transition-all"
        >
          <span>Gérer mes candidatures</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {columns.map((col) => {
          const Icon = col.icon
          return (
            <div
              key={col.label}
              className={`p-4 rounded-2xl border ${col.bg} flex flex-col items-center text-center transition-all hover:scale-102`}
            >
              <Icon className={`w-5 h-5 ${col.color} mb-2`} />
              <span className="text-2xl font-extrabold text-white leading-tight">
                {col.count}
              </span>
              <span className="text-xs text-slate-400 mt-1 font-medium">{col.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
