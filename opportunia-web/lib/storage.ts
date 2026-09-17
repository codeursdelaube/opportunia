// ============================================================
// OPPORTUNIA — localStorage helpers
// /lib/storage.ts
// ============================================================

import type { UserProfile } from '@/types'

const KEYS = {
  USER_ID: 'opportunia_user_id',
  PROFILE: 'opportunia_profile',
  FAVORITES: 'opportunia_favorites',
} as const

// ── Utility ───────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function generateUserId(): string {
  // Simple UUID v4-like generator (no crypto dependency)
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
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

export function clearProfile(): void {
  if (!isBrowser()) return
  localStorage.removeItem(KEYS.USER_ID)
  localStorage.removeItem(KEYS.PROFILE)
  localStorage.removeItem(KEYS.FAVORITES)
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
