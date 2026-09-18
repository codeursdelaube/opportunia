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
 * Normalise a skill name (collapsing non-alphanumerics except + and #).
 */
export function normalizeSkill(skill: string): string {
  if (!skill || typeof skill !== 'string') return ''
  return normalizeText(skill)
    .replace(/[^a-z0-9\s+#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Field taxonomy groups ─────────────────────────────────────

/**
 * Canonical groups of fields.
 * Deterministic mapping to prevent arbitrary false positives.
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
    'ia',
    'data science',
    'cybersecurite',
    'reseaux',
    'systemes informatiques',
    'programmation',
    'software engineering',
    'numerique',
    'technologie',
    'bases en numerique',
  ],
  marketing_communication: [
    'marketing',
    'communication',
    'digital marketing',
    'community management',
    'relation publique',
    'relations publiques',
    'publicite',
    'medias',
    'medias sociaux',
    'journalisme',
    'redaction',
  ],
  commerce_gestion: [
    'commerce',
    'vente',
    'commercial',
    'business development',
    'entrepreneuriat',
    'management',
    'gestion',
    'administration',
    'gestion de projet',
    'leadership',
  ],
  finance: [
    'finance',
    'comptabilite',
    'audit',
    'tresorerie',
    'economie',
    'fiscalite',
    'banque',
  ],
  rh: [
    'ressources humaines',
    'rh',
    'gestion du personnel',
    'recrutement',
    'administration du personnel',
  ],
  droit_sciences_politiques: [
    'droit',
    'juridique',
    'droit des affaires',
    'sciences politiques',
    'sciences juridiques',
    'administration publique',
  ],
  sciences_sociales_relations_internationales: [
    'sciences sociales',
    'relations internationales',
    'developpement international',
    'sociologie',
    'action humanitaire',
    'cooperation internationale',
    'diplomatie',
    'paix et securite',
    'solidarite',
  ],
  environnement_agriculture: [
    'agriculture',
    'agronomie',
    'environnement',
    'agroforesterie',
    'ecologie',
    'sciences environnementales',
    'biologie marine',
    'developpement rural',
    'ressources naturelles',
  ],
  ingenierie_sciences: [
    'ingenierie',
    'genie civil',
    'genie mecanique',
    'genie electrique',
    'genie industriel',
    'recherche',
    'recherche scientifique',
    'sciences appliquees',
  ],
  sante: [
    'sante',
    'sante publique',
    'medecine',
    'pharmacie',
    'biologie',
    'sciences medicales',
    'sante mentale',
  ],
  education_culture: [
    'education',
    'sciences de l education',
    'enseignement',
    'culture',
    'lettres',
  ],
  design: [
    'design',
    'graphisme',
    'ui ux',
    'ui/ux',
    'design graphique',
    'arts visuels',
    'creation',
  ],
}

/**
 * Find the group key for a given normalised field string.
 */
function findFieldGroup(normalised: string): string | null {
  for (const [group, synonyms] of Object.entries(FIELD_GROUPS)) {
    for (const s of synonyms) {
      if (normalised === s) return group
      if (s.length <= 3) {
        // Strict boundary check for short acronyms like 'ia', 'rh'
        const regex = new RegExp('(^|\\s)' + s + '(\\s|$)')
        if (regex.test(normalised)) return group
      } else {
        if (normalised.includes(s) || s.includes(normalised)) return group
      }
    }
  }
  return null
}

// ── Skill proximity & alternatives ────────────────────────────

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
  python: ['django', 'flask', 'fastapi', 'data science', 'machine learning', 'ia', 'intelligence artificielle'],
  ia: ['intelligence artificielle', 'machine learning', 'deep learning', 'data science', 'python'],
  'intelligence artificielle': ['ia', 'machine learning', 'deep learning', 'data science', 'python'],
  'machine learning': ['ia', 'intelligence artificielle', 'data science', 'python', 'statistiques'],
  'data science': ['machine learning', 'statistiques', 'analyse de donnees', 'python', 'sql', 'ia'],
  'bases en numerique': ['informatique', 'numerique', 'developpement web', 'web', 'outils informatiques'],
  numerique: ['informatique', 'bases en numerique', 'developpement web', 'technologie'],
  informatique: ['developpement web', 'bases en numerique', 'numerique', 'programmation', 'python', 'javascript'],
  anglais: ['anglais ou francais', 'anglais ou portugais'],
  francais: ['anglais ou francais'],
  portugais: ['anglais ou portugais'],
  communication: ['relations publiques', 'redaction', 'marketing', 'community management'],
  redaction: ['redaction de rapports', 'redaction de projet', 'communication', 'journalisme'],
  'redaction de rapports': ['redaction', 'communication', 'rapports'],
  'redaction de projet': ['redaction', 'gestion de projet', 'conception de projet'],
  'gestion de projet': ['management', 'leadership', 'redaction de projet', 'coordination'],
  leadership: ['engagement communautaire', 'management', 'gestion de projet', 'plaidoyer'],
  'engagement communautaire': ['leadership', 'vie associative', 'plaidoyer', 'action humanitaire'],
  entrepreneuriat: ['pitch', 'innovation', 'business development', 'gestion'],
  pitch: ['entrepreneuriat', 'communication', 'presentation'],
  innovation: ['entrepreneuriat', 'creativite', 'design thinking', 'ia'],
  'dossier academique': ['excellence academique', 'recherche scientifique', 'recherche'],
  'excellence academique': ['dossier academique', 'recherche scientifique'],
  figma: ['ui ux', 'ui/ux', 'design', 'prototypage', 'graphisme'],
  'ui ux': ['figma', 'design', 'ui/ux', 'prototypage'],
  marketing: ['digital marketing', 'communication', 'community management', 'reseaux sociaux'],
  'digital marketing': ['marketing', 'community management', 'communication', 'seo'],
  finance: ['comptabilite', 'tresorerie', 'audit', 'gestion'],
  comptabilite: ['finance', 'audit', 'gestion'],
}

// ── Level conversion ──────────────────────────────────────────

const LEVEL_MAP: Record<string, number> = {
  aucun: 0,
  sans: 0,
  bac: 1,
  'bac+1': 2,
  'bac+2': 3,
  'bac+3': 4,
  licence: 4,
  'bac+4': 5,
  'bac+5': 6,
  master: 6,
  doctorat: 9,
  phd: 9,
}

function levelToNumber(level: string): number {
  if (!level) return 0
  const n = normalizeText(level)
  if (n === 'aucun' || n === 'tous' || n === 'tous niveaux' || n.includes('sans')) return 0
  if (LEVEL_MAP[n] !== undefined) return LEVEL_MAP[n]
  for (const [key, val] of Object.entries(LEVEL_MAP)) {
    if (n.includes(key) || key.includes(n)) return val
  }
  return -1
}

// ── Regional & Remote Detection ───────────────────────────────

const REMOTE_KEYWORDS = [
  'a distance',
  'remote',
  'teletravail',
  'distanciel',
  'en ligne',
  'worldwide',
  'candidature a distance',
]

const AFRICAN_REGIONAL_KEYWORDS = [
  'afrique',
  'afrique de l\'ouest',
  'afrique de l ouest',
  'afrique francophone',
  'afrique subsaharienne',
  'panafricain',
  'west africa',
]

const WEST_AFRICA_COUNTRIES = [
  'togo',
  'benin',
  'cote d ivoire',
  'cote d\'ivoire',
  'ghana',
  'senegal',
  'nigeria',
  'mali',
  'burkina',
  'guinee',
  'niger',
]

function isRemote(location: string): boolean {
  const n = normalizeText(location)
  return REMOTE_KEYWORDS.some((kw) => n.includes(kw))
}

function isAfricanRegional(location: string): boolean {
  const n = normalizeText(location)
  return AFRICAN_REGIONAL_KEYWORDS.some((kw) => n.includes(kw))
}

// ── DIMENSION A — Filière score (0-30) ───────────────────────

export function getFieldMatchScore(profileField: string, opportunityFields: string[]): number {
  if (!opportunityFields || opportunityFields.length === 0) return 20 // no constraint
  if (!profileField) return 15 // neutral

  const normProfile = normalizeText(profileField)
  const normOppFields = opportunityFields.map(normalizeText)

  // Universal fields ("Toutes filières", "Tous") always match fully
  if (
    normOppFields.some(
      (f) =>
        f.includes('toutes filieres') ||
        f.includes('toutes les filieres') ||
        f === 'tous' ||
        f === 'toutes' ||
        f === 'generaliste'
    )
  ) {
    return 30
  }

  // Exact or direct inclusion match
  if (
    normOppFields.some(
      (f) => f === normProfile || f.includes(normProfile) || normProfile.includes(f)
    )
  ) {
    return 30
  }

  // Same domain group proximity
  const profileGroup = findFieldGroup(normProfile)
  if (profileGroup) {
    const oppGroups = normOppFields.map(findFieldGroup).filter(Boolean)
    if (oppGroups.includes(profileGroup)) {
      return 24
    }
  }

  // Safe keyword matching (clean words > 4 chars, excluding generic stops)
  const STOP_WORDS = new Set(['sciences', 'etudes', 'projet', 'general', 'appliquees'])
  const profileWords = normProfile.split(' ').filter((w) => w.length > 4 && !STOP_WORDS.has(w))
  for (const oppField of normOppFields) {
    if (profileWords.some((w) => oppField.includes(w))) {
      return 14
    }
  }

  return 0
}

// ── DIMENSION B — Niveau score (0-20) ───────────────────────

export function getLevelScore(profileLevel: string, requiredLevel: string): number {
  if (!requiredLevel) return 20

  const normReq = normalizeText(requiredLevel)
  if (
    normReq === 'aucun' ||
    normReq === 'tous' ||
    normReq === 'tous niveaux' ||
    normReq.includes('sans condition') ||
    normReq.includes('sans diplome')
  ) {
    return 20 // No degree requirement → open to everyone with full points!
  }

  const profileNum = levelToNumber(profileLevel)
  const requiredNum = levelToNumber(requiredLevel)

  if (profileNum < 0 || requiredNum < 0) return 12 // partial when unknown

  const diff = profileNum - requiredNum

  if (diff >= 0) return 20   // Meets or exceeds requirement
  if (diff === -1) return 12 // One level below (e.g. Bac+2 for Licence)
  if (diff === -2) return 6  // Two levels below
  return 0                   // Too far below
}

// ── DIMENSION C — Compétences score (0-30) ──────────────────

/**
 * Check if a required skill is matched by the profile skills,
 * taking into account compound alternatives ("ou", "/"), exact matches, and synonyms.
 */
function isSkillMatched(
  requiredSkill: string,
  profileSkillsNorm: string[]
): boolean {
  const normReq = normalizeSkill(requiredSkill)

  // Handle alternative requirements like "Anglais ou français" or "Anglais / portugais"
  if (normReq.includes(' ou ') || normReq.includes(' et ou ')) {
    const parts = normReq.split(/\bou\b|\bet\s+ou\b/).map((p) => p.trim()).filter(Boolean)
    return parts.some((part) => isSkillMatched(part, profileSkillsNorm))
  }

  // Direct match
  if (profileSkillsNorm.includes(normReq)) return true

  // Substring inclusion if meaningful length
  if (profileSkillsNorm.some((ps) => ps === normReq || (ps.length > 3 && normReq.includes(ps)) || (normReq.length > 3 && ps.includes(normReq)))) {
    return true
  }

  // Synonym / Proximity match
  const proxies = SKILL_PROXIMITY[normReq] || []
  if (proxies.some((p) => profileSkillsNorm.includes(p))) return true

  // Reverse proximity check (candidate has proxy that satisfies requirement)
  for (const ps of profileSkillsNorm) {
    const psProxies = SKILL_PROXIMITY[ps] || []
    if (psProxies.includes(normReq)) return true
  }

  return false
}

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

  const matchedOriginal: string[] = []
  const missingOriginal: string[] = []

  for (const req of requiredSkills) {
    if (isSkillMatched(req, normProfile)) {
      matchedOriginal.push(req)
    } else {
      missingOriginal.push(req)
    }
  }

  const coverage = matchedOriginal.length / requiredSkills.length
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
  if (!profileLocation) return 8

  const normOpp = normalizeText(opportunityLocation)
  const normProfile = normalizeText(profileLocation)

  // Remote / Telework
  if (isRemote(normOpp)) return 10

  // Pan-African / Regional African opportunities (Direct target for students in Africa)
  if (isAfricanRegional(normOpp)) return 10

  // Exact city or country match
  if (normProfile === normOpp || normOpp.includes(normProfile) || normProfile.includes(normOpp)) {
    return 10
  }

  // City extraction check
  const profileCity = normProfile.split(',')[0].trim()
  const oppCity = normOpp.split(',')[0].trim()
  if (profileCity && oppCity && (profileCity === oppCity || oppCity.includes(profileCity) || profileCity.includes(oppCity))) {
    return 10
  }

  // International open opportunities
  if (normOpp.includes('international') || normOpp.includes('mondial')) {
    return 9
  }

  // West Africa cross-border (e.g. Lomé <-> Bénin or Côte d'Ivoire)
  const isProfileWestAfrica = WEST_AFRICA_COUNTRIES.some((c) => normProfile.includes(c)) || normProfile === 'lome' || normProfile === 'cotonou'
  const isOppWestAfrica = WEST_AFRICA_COUNTRIES.some((c) => normOpp.includes(c))
  if (isProfileWestAfrica && isOppWestAfrica) {
    return 8
  }

  // International on-site with mobility (scholarships / global programmes)
  return 6
}

// ── DIMENSION E — Intérêts / Type score (0-10) ──────────────

const TYPE_SYNONYMS: Record<string, string[]> = {
  stage: ['stage', 'internship', 'apprentissage'],
  emploi: ['emploi', 'job', 'cdi', 'cdd', 'travail', 'recrutement'],
  job: ['emploi', 'job', 'cdi', 'cdd', 'travail', 'recrutement'],
  bourse: ['bourse', 'scholarship', 'financement'],
  concours: ['concours', 'competition', 'hackathon', 'challenge'],
  formation: ['formation', 'cours', 'certification', 'apprentissage'],
  freelance: ['freelance', 'mission', 'projet independant'],
  projet: ['projet', 'mission', 'collaboration'],
}

export function getInterestScore(profileInterests: string[], opportunityType: string): number {
  if (!profileInterests || profileInterests.length === 0) return 5
  if (!opportunityType) return 5

  const normType = normalizeText(opportunityType)
  const normInterests = profileInterests.map(normalizeText)

  // Direct match
  if (normInterests.includes(normType)) return 10

  // Synonym match
  const synonyms = TYPE_SYNONYMS[normType] ?? [normType]
  if (normInterests.some((i) => synonyms.includes(i))) return 10
  if (normInterests.some((i) => synonyms.some((s) => i.includes(s) || s.includes(i)))) return 7

  return 0
}

// ── Deadline & Status helpers ─────────────────────────────────

export function computeDeadlineInfo(deadline: string | null, status?: string): {
  isExpired: boolean
  daysRemaining: number | null
  expiringSoon: boolean
} {
  // If explicitly marked expired in data
  if (status === 'expired') {
    return { isExpired: true, daysRemaining: null, expiringSoon: false }
  }

  if (!deadline) {
    return { isExpired: false, daysRemaining: null, expiringSoon: false }
  }

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
  if (breakdown.filiere === 30) {
    if ((opportunity.filiere_cible || []).some((f) => normalizeText(f).includes('toutes'))) {
      reasons.push({ type: 'positive', label: `Opportunité ouverte à toutes les filières d'études` })
    } else {
      reasons.push({ type: 'positive', label: `Ta filière (${profile.filiere}) correspond parfaitement aux critères` })
    }
  } else if (breakdown.filiere >= 20) {
    reasons.push({ type: 'positive', label: `Ta filière (${profile.filiere}) s'inscrit directement dans le domaine visé` })
  } else if (breakdown.filiere >= 10) {
    reasons.push({ type: 'neutral', label: `Ta filière partage des compétences avec le domaine demandé` })
  } else {
    reasons.push({ type: 'negative', label: `Filière ciblée différente de ta formation actuelle` })
  }

  // Niveau
  const normMinLevel = normalizeText(opportunity.niveau_min || '')
  if (normMinLevel === 'aucun' || normMinLevel === 'tous' || normMinLevel.includes('sans')) {
    reasons.push({ type: 'positive', label: `Accessible sans condition de diplôme (ouvert à tous les niveaux)` })
  } else if (breakdown.niveau === 20) {
    reasons.push({ type: 'positive', label: `Ton niveau (${profile.niveau}) satisfait les prérequis (${opportunity.niveau_min})` })
  } else if (breakdown.niveau >= 12) {
    reasons.push({ type: 'neutral', label: `Niveau requis : ${opportunity.niveau_min} (profil très proche)` })
  } else {
    reasons.push({
      type: 'negative',
      label: `Niveau requis : ${opportunity.niveau_min} (tu as actuellement ${profile.niveau})`,
    })
  }

  // Compétences
  const total = matchedSkills.length + missingSkills.length
  if (total === 0) {
    reasons.push({ type: 'positive', label: 'Aucune compétence technique spécifique obligatoire' })
  } else if (matchedSkills.length === total) {
    reasons.push({ type: 'positive', label: `Toutes tes compétences requises correspondent (${total}/${total})` })
  } else if (matchedSkills.length > 0) {
    reasons.push({
      type: 'positive',
      label: `${matchedSkills.length} compétence${matchedSkills.length > 1 ? 's' : ''} validée${matchedSkills.length > 1 ? 's' : ''} (${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? '...' : ''})`,
    })
  }

  // Missing skills notes
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 2).join(' et ')
    reasons.push({
      type: 'neutral',
      label: `À préparer / renforcer : ${topMissing}`,
    })
  }

  // Localisation
  const normOpp = normalizeText(opportunity.localisation)
  if (isRemote(normOpp)) {
    reasons.push({ type: 'positive', label: 'Offre 100% accessible à distance / télétravail' })
  } else if (isAfricanRegional(normOpp)) {
    reasons.push({ type: 'positive', label: `Programme ouvert aux candidats d'Afrique (${opportunity.localisation})` })
  } else if (breakdown.localisation >= 8) {
    reasons.push({ type: 'positive', label: `Localisation adaptée : ${opportunity.localisation}` })
  } else {
    reasons.push({ type: 'neutral', label: `Localisation : ${opportunity.localisation} (mobilité ou séjour requis)` })
  }

  // Intérêts
  if (breakdown.interets >= 8) {
    reasons.push({ type: 'positive', label: `Format (${opportunity.type}) aligné avec tes préférences` })
  }

  return reasons
}

// ── Actionable missing skills advice ──────────────────────────

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
    for (const skill of missingSkills.slice(0, 2)) {
      const normS = normalizeText(skill)
      if (normS.includes('dossier academique') || normS.includes('excellence')) {
        recommendations.push(`Constituer un dossier académique soigné (relevés de notes officiels, attestations, recommandations)`)
      } else if (normS.includes('recherche') || normS.includes('proposition')) {
        recommendations.push(`Rédiger une note d'intention ou un projet de recherche clair et structuré`)
      } else if (normS.includes('pitch')) {
        recommendations.push(`Préparer une présentation / pitch percutant (problème, solution, impact)`)
      } else if (normS.includes('engagement') || normS.includes('leadership')) {
        recommendations.push(`Mettre en avant tes engagements associatifs, bénévolats ou réalisations collectives`)
      } else if (normS.includes('anglais')) {
        recommendations.push(`Soigner ton CV et ta lettre de motivation en anglais`)
      } else if (normS.includes('rapport')) {
        recommendations.push(`Valoriser des exemples concrets de comptes-rendus ou synthèses rédigés`)
      } else {
        recommendations.push(`Approfondir les notions clés de "${skill}" à travers un projet concret ou un tutoriel`)
      }
    }
    recommendations.push(`Mettre à jour ton profil et ton CV avant d'envoyer ta candidature`)
  } else {
    recommendations.push(`Ton profil couvre parfaitement les attentes demandées !`)
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
  const { isExpired, daysRemaining, expiringSoon } = computeDeadlineInfo(
    opportunity.deadline,
    opportunity.status
  )

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
 * Expired opportunities are filtered out from the top list but still ranked when includeExpired is true.
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
