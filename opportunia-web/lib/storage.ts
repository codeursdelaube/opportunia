// ============================================================
// OPPORTUNIA — localStorage helpers
// /lib/storage.ts
// ============================================================

import type { UserProfile, ApplicationItem, ApplicationStatus } from '@/types'

const KEYS = {
  USER_ID: 'opportunia_user_id',
  PROFILE: 'opportunia_profile',
  FAVORITES: 'opportunia_favorites',
  APPLICATIONS: 'opportunia_applications',
  CHECKLISTS: 'opportunia_checklists',
} as const

// ── Utility ───────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ── Profile ───────────────────────────────────────────────────

export function saveProfile(profile: UserProfile): void {
  if (!isBrowser()) return
  localStorage.setItem(KEYS.USER_ID, profile.id)
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
}

export function loadProfile(): UserProfile | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(KEYS.PROFILE)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UserProfile
    // Backwards compatibility fallback for older profiles
    if (!parsed.prenom) parsed.prenom = 'Étudiant'
    if (!parsed.nom) parsed.nom = ''
    if (!parsed.objectif_pro) parsed.objectif_pro = 'Découvrir des opportunités'
    return parsed
  } catch {
    return null
  }
}

export function clearProfile(): void {
  if (!isBrowser()) return
  localStorage.removeItem(KEYS.USER_ID)
  localStorage.removeItem(KEYS.PROFILE)
  localStorage.removeItem(KEYS.FAVORITES)
  localStorage.removeItem(KEYS.APPLICATIONS)
  localStorage.removeItem(KEYS.CHECKLISTS)
}

// ── Favorites ─────────────────────────────────────────────────

export function loadFavorites(): string[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function saveFavorites(ids: string[]): void {
  if (!isBrowser()) return
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify([...new Set(ids)]))
}

export function toggleFavorite(opportunityId: string): { isFavorite: boolean; favorites: string[] } {
  const current = loadFavorites()
  let updated: string[]
  let isFavorite: boolean

  if (current.includes(opportunityId)) {
    updated = current.filter((id) => id !== opportunityId)
    isFavorite = false
  } else {
    updated = [...current, opportunityId]
    isFavorite = true
  }

  saveFavorites(updated)
  return { isFavorite, favorites: updated }
}

export function isFavorite(opportunityId: string): boolean {
  return loadFavorites().includes(opportunityId)
}

// ── Applications Tracker ──────────────────────────────────────

export function loadApplications(): ApplicationItem[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(KEYS.APPLICATIONS)
    if (!raw) return []
    return JSON.parse(raw) as ApplicationItem[]
  } catch {
    return []
  }
}

export function saveApplications(apps: ApplicationItem[]): void {
  if (!isBrowser()) return
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps))
}

export function getApplication(opportunityId: string): ApplicationItem | undefined {
  return loadApplications().find((a) => a.opportunityId === opportunityId)
}

export function trackApplication(
  opportunityId: string,
  status: ApplicationStatus = 'saved',
  notes?: string
): ApplicationItem[] {
  const current = loadApplications()
  const existingIdx = current.findIndex((a) => a.opportunityId === opportunityId)
  const now = new Date().toISOString()

  let updated: ApplicationItem[]
  if (existingIdx >= 0) {
    updated = [...current]
    updated[existingIdx] = {
      ...updated[existingIdx],
      status,
      notes: notes !== undefined ? notes : updated[existingIdx].notes,
    }
  } else {
    updated = [
      ...current,
      {
        opportunityId,
        status,
        date: now,
        notes,
      },
    ]
  }

  saveApplications(updated)
  return updated
}

export function updateApplicationStatus(opportunityId: string, status: ApplicationStatus): ApplicationItem[] {
  return trackApplication(opportunityId, status)
}

export function removeApplication(opportunityId: string): ApplicationItem[] {
  const current = loadApplications()
  const updated = current.filter((a) => a.opportunityId !== opportunityId)
  saveApplications(updated)
  return updated
}

// ── Checklist per opportunity ─────────────────────────────────

export function loadOpportunityChecklist(opportunityId: string): Record<string, boolean> {
  if (!isBrowser()) return {}
  try {
    const raw = localStorage.getItem(KEYS.CHECKLISTS)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, Record<string, boolean>>
    return parsed[opportunityId] || {}
  } catch {
    return {}
  }
}

export function saveOpportunityChecklist(opportunityId: string, checklist: Record<string, boolean>): void {
  if (!isBrowser()) return
  try {
    const raw = localStorage.getItem(KEYS.CHECKLISTS)
    const current = raw ? (JSON.parse(raw) as Record<string, Record<string, boolean>>) : {}
    current[opportunityId] = checklist
    localStorage.setItem(KEYS.CHECKLISTS, JSON.stringify(current))
  } catch {}
}
