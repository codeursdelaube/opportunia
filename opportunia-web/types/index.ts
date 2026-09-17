// ============================================================
// OPPORTUNIA — TypeScript Types
// ============================================================

export type OpportunityType =
  | 'stage'
  | 'emploi'
  | 'bourse'
  | 'concours'
  | 'formation'
  | 'freelance'
  | 'projet'
  | 'Stage'
  | 'Emploi'
  | 'Bourse'
  | 'Concours'
  | 'Formation'
  | 'Freelance'
  | 'Projet'

export interface Opportunity {
  id: string
  titre: string
  type: OpportunityType | string
  source: string
  source_url?: string
  entreprise: string
  description: string
  filiere_cible: string[]
  niveau_min: string
  competences_requises: string[]
  localisation: string
  deadline: string | null
  status?: 'active' | 'expired' | string
  lien_candidature: string
  image: string
}

export interface UserProfile {
  id: string
  filiere: string
  niveau: string
  competences: string[]
  localisation: string
  interets: string[]
  createdAt: string
}

export interface MatchBreakdown {
  filiere: number      // 0-30
  niveau: number       // 0-20
  competences: number  // 0-30
  localisation: number // 0-10
  interets: number     // 0-10
}

export interface MatchReason {
  type: 'positive' | 'negative' | 'neutral'
  label: string
}

export interface MatchResult {
  opportunity: Opportunity
  score: number                // 0-100
  breakdown: MatchBreakdown
  matchedSkills: string[]
  missingSkills: string[]
  reasons: MatchReason[]
  isExpired: boolean
  daysRemaining: number | null
  expiringSoon: boolean
}

// Radar chart data shape for Recharts
export interface RadarDataPoint {
  subject: string
  value: number
  fullMark: number
}
