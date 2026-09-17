// ============================================================
// OPPORTUNIA — Matching Engine
// /lib/matching.ts
//
// Deterministic, explainable scoring engine.
// Score breakdown: Filière (30) + Niveau (20) + Compétences (30)
//                  + Localisation (10) + Intérêts (10) = 100
// ============================================================

import type {
  Opportunity,
  UserProfile,
  MatchResult,
  MatchBreakdown,
  MatchReason,
  MissingSkillsAdvice,
} from '@/types'

// ── Text normalization ────────────────────────────────────────

/**
 * Normalise a text string: lowercase, remove accents, trim whitespace.
 */
export function normalizeText(text: string): string {
  if (!text || typeof text !== 'string') return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Normalise a skill name (same as normalizeText but also collapses punctuation).
 */
export function normalizeSkill(skill: string): string {
  if (!skill || typeof skill !== 'string') return ''
  return normalizeText(skill)
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Field proximity groups ────────────────────────────────────

/**
 * Groups of related fields. When a profile field and an opportunity field
 * belong to the same group, they get a proximity bonus.
 *
 * Key = canonical group name; Value = list of normalised synonyms / variants.
 */
const FIELD_GROUPS: Record<string, string[]> = {
  informatique: [
    'informatique',
    'genie logiciel',
    'developpement web',
    'developpement logiciel',
    'developpement mobile',
    'ingenierie logicielle',
    'intelligence artificielle',
    'data science',
    'cybersecurite',
    'reseaux',
    'systemes informatiques',
    'programmation',
    'software engineering',
  ],
  marketing: [
    'marketing',
    'communication',
    'digital marketing',
    'community management',
    'relation publique',
    'publicite',
    'medias sociaux',
    'ecommerce',
    'e-commerce',
  ],
  commerce: [
    'commerce',
    'vente',
    'commercial',
    'business development',
    'entrepreneuriat',
    'management commercial',
  ],
  finance: [
    'finance',
    'comptabilite',
    'gestion',
    'audit',
    'tresorerie',
    'economie',
    'fiscalite',
    'finance d entreprise',
  ],
  rh: [
    'ressources humaines',
    'rh',
    'gestion du personnel',
    'administration du personnel',
    'recrutement',
    'formation professionnelle',
  ],
  droit: ['droit', 'juridique', 'droit des affaires', 'droit prive', 'sciences politiques'],
  design: ['design', 'graphisme', 'ui ux', 'design graphique', 'art', 'arts visuels', 'creation'],
  agriculture: [
    'agriculture',
    'agronomie',
    'environnement',
    'developpement rural',
    'alimentation',
    'agroalimentaire',
  ],
  ingenierie: [
    'ingenierie',
    'genie civil',
    'genie mecanique',
    'genie electrique',
    'genie industriel',
    'sciences',
  ],
  sante: ['sante', 'medecine', 'pharmacie', 'biologie', 'sciences medicales'],
}

/**
 * Find the group key for a given normalised field string.
 * Returns null if no group matches.
 */
function findFieldGroup(normalised: string): string | null {
  for (const [group, synonyms] of Object.entries(FIELD_GROUPS)) {
    if (synonyms.some((s) => normalised.includes(s) || s.includes(normalised))) {
      return group
    }
  }
  return null
}

// ── Skill proximity ───────────────────────────────────────────

/**
 * Maps a normalised skill to a list of normalised near-synonyms.
 * Only well-documented, reasonable relationships are included.
 */
const SKILL_PROXIMITY: Record<string, string[]> = {
  javascript: ['typescript', 'node.js', 'nodejs', 'react', 'developpement web', 'frontend'],
  typescript: ['javascript', 'react', 'next.js', 'node.js', 'developpement web'],
  react: ['next.js', 'nextjs', 'react native', 'javascript', 'typescript', 'frontend', 'developpement web'],
  'next.js': ['react', 'nextjs', 'typescript', 'javascript', 'frontend', 'developpement web'],
  nextjs: ['react', 'next.js', 'typescript', 'javascript', 'developpement web'],
  'node.js': ['nodejs', 'javascript', 'typescript', 'express', 'backend'],
  nodejs: ['node.js', 'javascript', 'typescript', 'express', 'backend'],
  'developpement web': ['web', 'react', 'javascript', 'typescript', 'html', 'css', 'next.js', 'frontend', 'backend', 'fullstack'],
  web: ['developpement web', 'html', 'css', 'javascript', 'react'],
  html: ['css', 'javascript', 'developpement web', 'frontend'],
  css: ['html', 'javascript', 'tailwind', 'bootstrap', 'developpement web'],
  tailwind: ['css', 'bootstrap', 'developpement web'],
  python: ['django', 'flask', 'fastapi', 'data science', 'machine learning', 'statistiques', 'analyse de donnees'],
  django: ['python', 'backend'],
  flask: ['python', 'backend'],
  fastapi: ['python', 'backend', 'api'],
  java: ['spring', 'kotlin', 'backend'],
  spring: ['java', 'backend'],
  kotlin: ['java', 'android'],
  android: ['kotlin', 'java', 'mobile'],
  figma: ['ui ux', 'ui/ux', 'design', 'prototypage', 'graphisme', 'wireframing'],
  'ui ux': ['figma', 'design', 'ui/ux', 'prototypage', 'wireframing'],
  'ui/ux': ['figma', 'ui ux', 'design', 'prototypage'],
  photoshop: ['illustrator', 'design', 'graphisme', 'indesign'],
  illustrator: ['photoshop', 'design', 'graphisme', 'indesign'],
  indesign: ['photoshop', 'illustrator', 'graphisme'],
  graphisme: ['photoshop', 'illustrator', 'design', 'figma'],
  design: ['figma', 'ui ux', 'ui/ux', 'graphisme', 'photoshop'],
  marketing: ['digital marketing', 'communication', 'community management', 'reseaux sociaux'],
  'digital marketing': ['marketing', 'community management', 'communication', 'seo'],
  'community management': ['marketing', 'digital marketing', 'communication', 'reseaux sociaux'],
  communication: ['marketing', 'community management', 'relations publiques'],
  vente: ['prospection', 'negociation', 'commercial', 'relation client'],
  prospection: ['vente', 'negociation', 'commercial'],
  negociation: ['vente', 'prospection', 'commercial'],
  commercial: ['vente', 'prospection', 'negociation', 'business development'],
  finance: ['comptabilite', 'tresorerie', 'audit', 'gestion'],
  comptabilite: ['finance', 'audit', 'gestion', 'tresorerie'],
  audit: ['comptabilite', 'finance', 'gestion'],
  gestion: ['management', 'administration', 'finance', 'comptabilite'],
  management: ['gestion', 'leadership', 'gestion de projet'],
  'gestion de projet': ['management', 'agile', 'scrum', 'leadership'],
  sql: ['mysql', 'postgresql', 'base de donnees', 'analyse de donnees'],
  mysql: ['sql', 'postgresql', 'base de donnees'],
  postgresql: ['sql', 'mysql', 'base de donnees'],
  git: ['github', 'gitlab', 'versionning'],
  github: ['git', 'gitlab'],
  gitlab: ['git', 'github'],
  programmation: ['informatique', 'developpement logiciel', 'python', 'javascript', 'java'],
  'developpement logiciel': ['programmation', 'informatique', 'ingenierie logicielle'],
  'ingenierie logicielle': ['developpement logiciel', 'programmation'],
  informatique: ['programmation', 'developpement logiciel', 'systemes', 'reseaux'],
  innovation: ['entrepreneuriat', 'design thinking', 'creativite'],
  entrepreneuriat: ['innovation', 'business development'],
  ia: ['intelligence artificielle', 'machine learning', 'deep learning', 'data science', 'python'],
  'intelligence artificielle': ['ia', 'machine learning', 'deep learning', 'data science', 'python'],
  'machine learning': ['ia', 'intelligence artificielle', 'data science', 'deep learning', 'python', 'statistiques'],
  'data science': ['machine learning', 'statistiques', 'analyse de donnees', 'python', 'sql', 'intelligence artificielle'],
  'analyse de donnees': ['data science', 'statistiques', 'excel', 'power bi', 'sql', 'python'],
  statistiques: ['data science', 'analyse de donnees', 'machine learning', 'python'],
  excel: ['analyse de donnees', 'comptabilite', 'gestion', 'finance', 'bureautique'],
  'power bi': ['tableau', 'analyse de donnees', 'business intelligence', 'excel'],
  tableau: ['power bi', 'analyse de donnees', 'business intelligence'],
}

// ── Level conversion ──────────────────────────────────────────

const LEVEL_MAP: Record<string, number> = {
  bac: 0,
  'bac+1': 1,
  'bac+2': 2,
  'bac+3': 3,
  licence: 3,
  'bac+4': 4,
  'bac+5': 5,
  master: 5,
  doctorat: 8,
  phd: 8,
}

function levelToNumber(level: string): number {
  if (!level) return -1
  const n = normalizeText(level)
  if (LEVEL_MAP[n] !== undefined) return LEVEL_MAP[n]
  // Try partial matches
  for (const [key, val] of Object.entries(LEVEL_MAP)) {
    if (n.includes(key) || key.includes(n)) return val
  }
  return -1
}

// ── Remote location detection ─────────────────────────────────

const REMOTE_KEYWORDS = [
  'a distance',
  'remote',
  'teletravail',
  'distanciel',
  'international',
  'en ligne',
  'worldwide',
]

function isRemote(location: string): boolean {
  const n = normalizeText(location)
  return REMOTE_KEYWORDS.some((kw) => n.includes(kw))
}

// ── DIMENSION A — Filière score (0-30) ───────────────────────

export function getFieldMatchScore(profileField: string, opportunityFields: string[]): number {
  if (!profileField || !opportunityFields || opportunityFields.length === 0) return 15 // neutral

  const normProfile = normalizeText(profileField)
  const normOppFields = opportunityFields.map(normalizeText)

  // Universal fields ("toutes filières") always match
  if (normOppFields.some((f) => f.includes('toutes filieres') || f.includes('tous'))) return 28

  // Exact match
  if (normOppFields.some((f) => f === normProfile || f.includes(normProfile) || normProfile.includes(f))) {
    return 30
  }

  // Same group proximity
  const profileGroup = findFieldGroup(normProfile)
  if (profileGroup) {
    const oppGroups = normOppFields.map(findFieldGroup)
    if (oppGroups.includes(profileGroup)) return 22
    // Adjacent group check (e.g., informatique <-> ingénierie)
    const ADJACENT: Record<string, string[]> = {
      informatique: ['ingenierie', 'commerce'],
      ingenierie: ['informatique', 'agriculture'],
      marketing: ['commerce', 'design'],
      commerce: ['marketing', 'finance'],
      finance: ['commerce', 'rh'],
      rh: ['finance', 'droit'],
      droit: ['rh', 'finance'],
      design: ['marketing', 'informatique'],
      agriculture: ['ingenierie'],
    }
    const adjacent = ADJACENT[profileGroup] ?? []
    if (oppGroups.some((g) => g && adjacent.includes(g))) return 10
  }

  // Keyword partial match
  const profileWords = normProfile.split(' ')
  for (const oppField of normOppFields) {
    if (profileWords.some((w) => w.length > 3 && oppField.includes(w))) return 8
  }

  return 0
}

// ── DIMENSION B — Niveau score (0-20) ───────────────────────

export function getLevelScore(profileLevel: string, requiredLevel: string): number {
  if (!requiredLevel) return 20 // no requirement → full score

  const profileNum = levelToNumber(profileLevel)
  const requiredNum = levelToNumber(requiredLevel)

  if (profileNum < 0 || requiredNum < 0) return 10 // unknown levels → partial

  const diff = profileNum - requiredNum

  if (diff >= 0) return 20           // meets or exceeds requirement
  if (diff === -1) return 12         // one level below
  if (diff === -2) return 5          // two levels below
  return 0                           // too far below
}

// ── DIMENSION C — Compétences score (0-30) ──────────────────

export function getSkillsScore(
  profileSkills: string[],
  requiredSkills: string[],
): {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  coverage: number
} {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { score: 20, matchedSkills: [], missingSkills: [], coverage: 1 }
  }
  if (!profileSkills || profileSkills.length === 0) {
    return { score: 0, matchedSkills: [], missingSkills: requiredSkills, coverage: 0 }
  }

  const normProfile = [...new Set(profileSkills.map(normalizeSkill).filter(Boolean))]
  const normRequired = [...new Set(requiredSkills.map(normalizeSkill).filter(Boolean))]

  const matchedOriginal: string[] = []
  const missingOriginal: string[] = []

  for (let i = 0; i < normRequired.length; i++) {
    const req = normRequired[i]
    const originalReq = requiredSkills[i] ?? req

    // Exact match
    const exactMatch = normProfile.includes(req)
    if (exactMatch) {
      matchedOriginal.push(originalReq)
      continue
    }

    // Proximity match
    const proxies = SKILL_PROXIMITY[req] ?? []
    const proximityMatch = proxies.some((p) => normProfile.includes(p))

    // Partial substring match (for compound skill names)
    const partialMatch = normProfile.some(
      (ps) => (ps.length > 3 && req.includes(ps)) || (req.length > 3 && ps.includes(req)),
    )

    if (proximityMatch || partialMatch) {
      matchedOriginal.push(originalReq)
    } else {
      missingOriginal.push(originalReq)
    }
  }

  const coverage = matchedOriginal.length / normRequired.length
  const score = Math.round(coverage * 30)

  return {
    score,
    matchedSkills: matchedOriginal,
    missingSkills: missingOriginal,
    coverage,
  }
}

// ── DIMENSION D — Localisation score (0-10) ─────────────────

export function getLocationScore(profileLocation: string, opportunityLocation: string): number {
  if (!opportunityLocation) return 10
  if (!profileLocation) return 5

  const normProfile = normalizeText(profileLocation)
  const normOpp = normalizeText(opportunityLocation)

  // Remote/international opportunities match everyone
  if (isRemote(normOpp)) return 10

  // Exact match
  if (normProfile === normOpp || normOpp.includes(normProfile) || normProfile.includes(normOpp)) return 10

  // Same city partial
  const profileCity = normProfile.split(',')[0].trim()
  const oppCity = normOpp.split(',')[0].trim()
  if (profileCity === oppCity) return 10
  if (oppCity.includes(profileCity) || profileCity.includes(oppCity)) return 8

  // Foreign / different city
  return 2
}

// ── DIMENSION E — Intérêts / Type score (0-10) ──────────────

export function getInterestScore(profileInterests: string[], opportunityType: string): number {
  if (!profileInterests || profileInterests.length === 0) return 5
  if (!opportunityType) return 5

  const normType = normalizeText(opportunityType)
  const normInterests = profileInterests.map(normalizeText)

  // Direct match
  if (normInterests.includes(normType)) return 10

  // Near-synonym match
  const TYPE_SYNONYMS: Record<string, string[]> = {
    stage: ['stage', 'internship', 'apprentissage'],
    emploi: ['emploi', 'job', 'cdi', 'cdd', 'travail'],
    bourse: ['bourse', 'scholarship', 'financement'],
    concours: ['concours', 'competition', 'hackathon', 'challenge'],
    formation: ['formation', 'cours', 'certification', 'apprentissage'],
    freelance: ['freelance', 'mission', 'projet independant'],
    projet: ['projet', 'mission', 'collaboration'],
  }

  const synonyms = TYPE_SYNONYMS[normType] ?? [normType]
  if (normInterests.some((i) => synonyms.includes(i))) return 10
  if (normInterests.some((i) => synonyms.some((s) => i.includes(s) || s.includes(i)))) return 6

  return 0
}

// ── Deadline helpers ──────────────────────────────────────────

function computeDeadlineInfo(deadline: string | null): {
  isExpired: boolean
  daysRemaining: number | null
  expiringSoon: boolean
} {
  if (!deadline) return { isExpired: false, daysRemaining: null, expiringSoon: false }
  try {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const diffMs = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return {
      isExpired: diffDays < 0,
      daysRemaining: diffDays,
      expiringSoon: diffDays >= 0 && diffDays <= 7,
    }
  } catch {
    return { isExpired: false, daysRemaining: null, expiringSoon: false }
  }
}

// ── Build human-readable reasons ─────────────────────────────

export function getMatchReasons(
  profile: UserProfile,
  opportunity: Opportunity,
  breakdown: MatchBreakdown,
  matchedSkills: string[],
  missingSkills: string[],
): MatchReason[] {
  const reasons: MatchReason[] = []

  // Filière
  if (breakdown.filiere >= 28) {
    reasons.push({ type: 'positive', label: `Ta filière (${profile.filiere}) correspond parfaitement` })
  } else if (breakdown.filiere >= 18) {
    reasons.push({ type: 'positive', label: `Ta filière (${profile.filiere}) est proche du domaine ciblé` })
  } else if (breakdown.filiere >= 8) {
    reasons.push({ type: 'neutral', label: `Ta filière est partiellement compatible avec l'offre` })
  } else {
    reasons.push({ type: 'negative', label: `Ta filière s'éloigne des critères ciblés` })
  }

  // Niveau
  const profileNum = levelToNumber(profile.niveau)
  const reqNum = levelToNumber(opportunity.niveau_min)
  if (!opportunity.niveau_min || breakdown.niveau === 20) {
    reasons.push({ type: 'positive', label: `Ton niveau (${profile.niveau}) est suffisant pour cette offre` })
  } else if (profileNum < reqNum) {
    reasons.push({
      type: 'negative',
      label: `Niveau requis : ${opportunity.niveau_min} (tu es actuellement à ${profile.niveau})`,
    })
  } else {
    reasons.push({ type: 'positive', label: `Ton niveau (${profile.niveau}) est compatible` })
  }

  // Compétences
  const total = matchedSkills.length + missingSkills.length
  if (total === 0) {
    reasons.push({ type: 'positive', label: 'Aucune compétence technique préalable obligatoire' })
  } else if (matchedSkills.length === total) {
    reasons.push({ type: 'positive', label: `Toutes tes compétences requises correspondent (${total}/${total})` })
  } else if (matchedSkills.length > 0) {
    reasons.push({
      type: 'positive',
      label: `${matchedSkills.length} de tes compétences correspondent (${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? '...' : ''})`,
    })
  }

  // Missing skills warnings
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 2).join(' et ')
    reasons.push({
      type: 'neutral',
      label: `Compétence${missingSkills.length > 1 ? 's' : ''} à renforcer : ${topMissing}`,
    })
  }

  // Localisation
  if (breakdown.localisation >= 8) {
    const normOpp = normalizeText(opportunity.localisation)
    if (isRemote(normOpp)) {
      reasons.push({ type: 'positive', label: "Offre 100% accessible à distance / remote" })
    } else {
      reasons.push({ type: 'positive', label: `L'opportunité est située à ${opportunity.localisation}` })
    }
  } else if (breakdown.localisation > 0) {
    reasons.push({ type: 'neutral', label: `Localisation (${opportunity.localisation}) différente de ta ville (${profile.localisation})` })
  } else {
    reasons.push({ type: 'negative', label: 'Localisation géographique éloignée' })
  }

  // Intérêts
  if (breakdown.interets === 10) {
    reasons.push({ type: 'positive', label: `Le format (${opportunity.type}) correspond à tes objectifs recherchés` })
  }

  return reasons
}

// ── Missing skills actionable advice ──────────────────────────

export function getMissingSkillsAdvice(
  profile: UserProfile,
  opportunity: Opportunity,
): MissingSkillsAdvice {
  const { matchedSkills, missingSkills } = getSkillsScore(
    profile.competences ?? [],
    opportunity.competences_requises ?? [],
  )

  const total = matchedSkills.length + missingSkills.length
  const coveragePercent = total > 0 ? Math.round((matchedSkills.length / total) * 100) : 100

  const recommendations: string[] = []
  if (missingSkills.length > 0) {
    recommendations.push(`Apprendre les fondamentaux de ${missingSkills[0]}`)
    if (missingSkills.length > 1) {
      recommendations.push(`Réaliser un mini-projet combinant ${matchedSkills[0] || profile.filiere} et ${missingSkills[1]}`)
    } else {
      recommendations.push(`Créer un projet pratique utilisant ${missingSkills[0]}`)
    }
    recommendations.push(`Ajouter cette réalisation sur ton profil et ton CV avant d'envoyer`)
  } else {
    recommendations.push(`Ton profil technique couvre 100% des compétences demandées !`)
    recommendations.push(`Prépare ta candidature en valorisant tes réalisations récentes`)
    recommendations.push(`Postule rapidement pour maximiser tes chances d'être retenu`)
  }

  return {
    matchedSkills,
    missingSkills,
    coveragePercent,
    recommendations,
  }
}

// ── Master function ───────────────────────────────────────────

export function calculateMatchScore(profile: UserProfile, opportunity: Opportunity): MatchResult {
  const { isExpired, daysRemaining, expiringSoon } = computeDeadlineInfo(opportunity.deadline)

  const filiereScore = getFieldMatchScore(profile.filiere ?? '', opportunity.filiere_cible ?? [])
  const niveauScore = getLevelScore(profile.niveau ?? '', opportunity.niveau_min ?? '')
  const { score: competencesScore, matchedSkills, missingSkills } = getSkillsScore(
    profile.competences ?? [],
    opportunity.competences_requises ?? [],
  )
  const localisationScore = getLocationScore(profile.localisation ?? '', opportunity.localisation ?? '')
  const interetsScore = getInterestScore(profile.interets ?? [], opportunity.type ?? '')

  const breakdown: MatchBreakdown = {
    filiere: filiereScore,
    niveau: niveauScore,
    competences: competencesScore,
    localisation: localisationScore,
    interets: interetsScore,
  }

  const rawScore = filiereScore + niveauScore + competencesScore + localisationScore + interetsScore
  const score = Math.min(100, Math.max(0, rawScore))

  const reasons = getMatchReasons(profile, opportunity, breakdown, matchedSkills, missingSkills)
  const advice = getMissingSkillsAdvice(profile, opportunity)

  return {
    opportunity,
    score,
    breakdown,
    matchedSkills,
    missingSkills,
    reasons,
    advice,
    isExpired,
    daysRemaining,
    expiringSoon,
  }
}

/**
 * Rank all opportunities for a given profile.
 * Expired opportunities are filtered out from the top list but still ranked.
 */
export function rankOpportunities(
  profile: UserProfile,
  opportunities: Opportunity[],
  includeExpired = false,
): MatchResult[] {
  const results = opportunities
    .map((opp) => calculateMatchScore(profile, opp))
    .filter((r) => includeExpired || !r.isExpired)
    .sort((a, b) => b.score - a.score)

  return results
}
