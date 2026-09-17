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
  prenom: string
  nom: string
  filiere: string
  niveau: string
  competences: string[]
  localisation: string
  interets: string[]
  types_opportunites?: string[]
  objectif_pro: string
  projets?: string[]
  cv_uploaded?: boolean
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

export interface MissingSkillsAdvice {
  matchedSkills: string[]
  missingSkills: string[]
  coveragePercent: number
  recommendations: string[]
}

export interface MatchResult {
  opportunity: Opportunity
  score: number                // 0-100
  breakdown: MatchBreakdown
  matchedSkills: string[]
  missingSkills: string[]
  reasons: MatchReason[]
  advice?: MissingSkillsAdvice
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

// ── Application Tracker ───────────────────────────────────────

export type ApplicationStatus =
  | 'saved'       // ❤️ Sauvegardée
  | 'prepared'    // 📝 Candidature préparée
  | 'sent'        // 📨 Candidature envoyée
  | 'pending'     // 👀 En attente
  | 'interview'   // 🎤 Entretien
  | 'accepted'    // 🎉 Accepté
  | 'rejected'    // ❌ Refusé

export interface ApplicationItem {
  opportunityId: string
  status: ApplicationStatus
  date: string
  notes?: string
}

// ── Career Readiness ──────────────────────────────────────────

export interface CareerReadinessScore {
  total: number           // 0-100
  formation: number       // 0-100
  competences: number     // 0-100
  cv: number              // 0-100 (ou note explicite si non renseigné)
  experience: number      // 0-100
  objectif: number        // 0-100
  actionItems: string[]
  isCvMissing: boolean
}

// ── Career Path ───────────────────────────────────────────────

export interface CareerPathStep {
  id: string
  title: string
  category: 'fondamentaux' | 'avance' | 'projets' | 'tremplins' | 'objectif'
  skills: string[]
  description: string
  completed: boolean
  current?: boolean
}

export interface CareerPathData {
  objective: string
  targetRole: string
  progressPercent: number
  currentStepTitle: string
  steps: CareerPathStep[]
  recommendedOpportunities?: Opportunity[]
  nextAction: string
}

// ── Application Generator ─────────────────────────────────────

export interface GeneratedApplication {
  subject: string
  emailBody: string
  coverLetter: string
}

