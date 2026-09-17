// ============================================================
// OPPORTUNIA — Utilities
// /lib/utils.ts
// ============================================================

import type { OpportunityType } from '@/types'

// ── Deadline formatting ───────────────────────────────────────

export function getDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null
  try {
    const d = new Date(deadline)
    const now = new Date()
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  } catch {
    return null
  }
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Pas de deadline'
  try {
    const days = getDaysRemaining(deadline)
    if (days === null) return 'Date inconnue'
    if (days < 0) return 'Expirée'
    if (days === 0) return "Expire aujourd'hui"
    if (days === 1) return 'Expire demain'
    if (days <= 7) return `${days} jours restants`
    if (days <= 30) return `${Math.ceil(days / 7)} semaines restantes`
    const date = new Date(deadline)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return 'Date inconnue'
  }
}

// ── Type labels ───────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  stage: 'Stage',
  emploi: 'Emploi',
  bourse: 'Bourse',
  concours: 'Concours',
  formation: 'Formation',
  freelance: 'Freelance',
  projet: 'Projet',
}

export function getTypeLabel(type: OpportunityType | string): string {
  return TYPE_LABELS[type?.toLowerCase()] ?? type ?? 'Autre'
}

// ── Type color classes (Tailwind) ──────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  stage: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  emploi: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  bourse: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  concours: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  formation: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  freelance: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  projet: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
}

export function getTypeColor(type: OpportunityType | string): string {
  return TYPE_COLORS[type?.toLowerCase()] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/30'
}

// ── Score color ───────────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-blue-400'
  if (score >= 40) return 'text-yellow-400'
  return 'text-slate-400'
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-yellow-500'
  return 'bg-slate-500'
}

// ── Class merge utility ───────────────────────────────────────

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

// ── Opportunity image fallback ────────────────────────────────

export function getOpportunityImage(opportunity: { image?: string; titre?: string; filiere_cible?: string[]; type?: string }): string {
  if (opportunity.image && opportunity.image.trim() !== '') {
    return opportunity.image
  }
  const title = (opportunity.titre || '').toLowerCase()
  const filiere = (opportunity.filiere_cible || []).join(' ').toLowerCase()
  const type = (opportunity.type || '').toLowerCase()

  if (title.includes('mobile')) {
    return 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('react') || title.includes('web') || title.includes('dev') || filiere.includes('logiciel')) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('reseau') || title.includes('video') || title.includes('cctv') || title.includes('system') || title.includes('support') || title.includes('technicien')) {
    return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('data') || title.includes('intelligence') || title.includes('ia') || filiere.includes('data')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('market') || title.includes('digital') || title.includes('community')) {
    return 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('design') || title.includes('graphi') || filiere.includes('design') || filiere.includes('arts')) {
    return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('compta') || title.includes('finance') || filiere.includes('comptabilite') || filiere.includes('finance')) {
    return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('commerc') || title.includes('vent') || title.includes('prospect') || title.includes('client')) {
    return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('rh') || title.includes('ressources') || title.includes('admin') || filiere.includes('ressources')) {
    return 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('logist') || title.includes('supply')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  }
  if (title.includes('projet')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
  }
  if (type.includes('bourse')) {
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'
  }
  if (type.includes('concours') || title.includes('entrepreneur')) {
    return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80'
  }
  if (type.includes('formation')) {
    return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
  }
  return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
}

