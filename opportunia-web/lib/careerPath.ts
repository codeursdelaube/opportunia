// ============================================================
// OPPORTUNIA — Career Path & Career Readiness Engine
// /lib/careerPath.ts
//
// 100% deterministic rule-based engine (no external API needed)
// ============================================================

import type {
  UserProfile,
  Opportunity,
  CareerReadinessScore,
  CareerPathData,
  CareerPathStep,
} from '@/types'
import { normalizeText, normalizeSkill } from './matching'

// ── Career Trajectory Presets ──────────────────────────────────

interface CareerPreset {
  id: string
  keywords: string[]
  targetRole: string
  fundamentals: string[]
  advanced: string[]
  suggestedProjects: string[]
  steppingStoneTypes: string[]
}

const CAREER_PRESETS: CareerPreset[] = [
  {
    id: 'ia',
    keywords: ['ia', 'intelligence artificielle', 'machine learning', 'deep learning', 'data scientist', 'ia engineer'],
    targetRole: 'Développeur IA / Machine Learning Engineer',
    fundamentals: ['Python', 'Git', 'SQL', 'Mathématiques & Statistiques'],
    advanced: ['Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP'],
    suggestedProjects: [
      'Créer un modèle de classification d’images ou de prédiction',
      'Développer un agent de recommandation ou chatbot intelligent',
      'Publier le code sur GitHub avec un README documenté',
    ],
    steppingStoneTypes: ['Stage', 'Projet', 'Formation', 'Concours'],
  },
  {
    id: 'web',
    keywords: ['web', 'frontend', 'backend', 'fullstack', 'react', 'next.js', 'developpeur web'],
    targetRole: 'Développeur Web Fullstack',
    fundamentals: ['HTML', 'CSS', 'JavaScript', 'Git', 'SQL'],
    advanced: ['React', 'Next.js', 'Node.js', 'TypeScript', 'REST API'],
    suggestedProjects: [
      'Développer une application web complète (CRUD) responsive',
      'Intégrer une authentification et une API externe',
      'Déployer le projet en ligne (Vercel/Netlify)',
    ],
    steppingStoneTypes: ['Stage', 'Freelance', 'Projet', 'Emploi'],
  },
  {
    id: 'data',
    keywords: ['data', 'data analyst', 'analyste de donnees', 'business intelligence', 'power bi'],
    targetRole: 'Data Analyst / BI Specialist',
    fundamentals: ['Excel avancé', 'SQL', 'Statistiques descriptives', 'Communication'],
    advanced: ['Python (Pandas)', 'Power BI', 'Tableau', 'Modélisation de données'],
    suggestedProjects: [
      'Analyser un jeu de données réel et extraire des KPIs actionnables',
      'Créer un tableau de bord interactif sur Power BI ou Tableau',
      'Rédiger une synthèse de recommandations pour décideurs',
    ],
    steppingStoneTypes: ['Stage', 'Formation', 'Projet'],
  },
  {
    id: 'design',
    keywords: ['ui', 'ux', 'ui/ux', 'design', 'designer', 'produit', 'graphiste'],
    targetRole: 'Product & UI/UX Designer',
    fundamentals: ['Principes d’ergonomie', 'Figma', 'Typographie & Couleurs', 'Wireframing'],
    advanced: ['Design System', 'Prototypage interactif', 'User Research', 'Tests utilisateurs'],
    suggestedProjects: [
      'Concevoir une étude de cas UI/UX complète pour une application mobile',
      'Créer un mini design system réutilisable sur Figma',
      'Publier un portfolio sur Behance ou Dribbble',
    ],
    steppingStoneTypes: ['Stage', 'Freelance', 'Concours', 'Projet'],
  },
  {
    id: 'marketing',
    keywords: ['marketing', 'communication', 'digital marketing', 'social media', 'growth'],
    targetRole: 'Spécialiste Marketing Digital',
    fundamentals: ['Stratégie de contenu', 'Copywriting', 'Canva / Visuels', 'Réseaux sociaux'],
    advanced: ['SEO / SEA', 'Google Analytics', 'Publicités Meta/Google', 'Email marketing'],
    suggestedProjects: [
      'Lancer une campagne de sensibilisation ou de promotion avec métriques',
      'Optimiser le référencement naturel (SEO) d’un site ou blog',
      'Rédiger un calendrier éditorial pour une marque locale',
    ],
    steppingStoneTypes: ['Stage', 'Emploi', 'Formation'],
  },
  {
    id: 'commerce',
    keywords: ['commercial', 'vente', 'business developer', 'prospection', 'negociation'],
    targetRole: 'Business Developer / Responsable Commercial',
    fundamentals: ['Techniques de prospection', 'Négociation', 'Relation client', 'CRM'],
    advanced: ['Stratégie B2B', 'Pitching commercial', 'Gestion de pipeline de vente'],
    suggestedProjects: [
      'Mener une campagne de prospection terrain et qualifier 20 prospects',
      'Structurer un argumentaire de vente et un script de relance',
    ],
    steppingStoneTypes: ['Stage', 'Emploi'],
  },
]

function findCareerPreset(objective: string): CareerPreset | null {
  const norm = normalizeText(objective)
  for (const preset of CAREER_PRESETS) {
    if (preset.keywords.some((kw) => norm.includes(kw))) {
      return preset
    }
  }
  return null
}

// ── Career Readiness Calculator ────────────────────────────────

export function calculateCareerReadiness(profile: UserProfile): CareerReadinessScore {
  const normGoal = normalizeText(profile.objectif_pro || '')
  const hasGoal = normGoal.length > 3
  const preset = findCareerPreset(normGoal)

  // 1. Formation (0-100) : basée sur le niveau d'études
  let formation = 60
  const niv = normalizeText(profile.niveau || '')
  if (niv.includes('bac+5') || niv.includes('master') || niv.includes('doctorat')) formation = 95
  else if (niv.includes('bac+4')) formation = 90
  else if (niv.includes('bac+3') || niv.includes('licence')) formation = 85
  else if (niv.includes('bac+2')) formation = 75
  else if (niv.includes('bac+1')) formation = 65
  else if (niv.includes('bac')) formation = 60

  // 2. Compétences (0-100)
  const skills = profile.competences || []
  let competences = Math.min(90, Math.max(30, skills.length * 15))

  if (preset) {
    const required = [...preset.fundamentals, ...preset.advanced].map(normalizeSkill)
    const matched = skills.filter((s) =>
      required.some((r) => normalizeSkill(s) === r || r.includes(normalizeSkill(s)))
    )
    competences = Math.min(100, Math.round((matched.length / Math.max(1, required.length)) * 100))
  }

  // 3. Projets / Expérience (0-100)
  const projects = profile.projets || []
  let experience = projects.length > 0 ? Math.min(100, 40 + projects.length * 20) : 35

  // 4. Objectif (0-100)
  const objectif = hasGoal ? 85 : 40

  // 5. CV (0-100)
  // POC : Si le CV n'est pas uploadé, on n'invente rien
  const cvUploaded = !!profile.cv_uploaded
  const cv = cvUploaded ? 75 : 30 // Indique profil incomplet si non renseigné
  const isCvMissing = !cvUploaded

  // Score total pondéré
  const total = Math.round(
    formation * 0.25 + competences * 0.35 + experience * 0.2 + objectif * 0.1 + cv * 0.1
  )

  // Actions concrètes "Pour passer à 80/100" ou s'améliorer
  const actionItems: string[] = []
  if (isCvMissing) {
    actionItems.push('Compléter la section CV / Portfolio de ton profil')
  }
  if (projects.length === 0) {
    actionItems.push('Ajouter au moins un projet personnel ou académique récent')
  }
  if (preset) {
    const missingFundamental = preset.fundamentals.find(
      (f) => !skills.some((s) => normalizeSkill(s) === normalizeSkill(f))
    )
    if (missingFundamental) {
      actionItems.push(`Développer la compétence fondamentale : ${missingFundamental}`)
    }
  } else if (skills.length < 5) {
    actionItems.push('Ajouter au moins 2 compétences techniques supplémentaires')
  }

  if (actionItems.length < 3) {
    actionItems.push('Postuler à une offre de stage ou projet tremplin cette semaine')
  }

  return {
    total,
    formation,
    competences,
    cv,
    experience,
    objectif,
    actionItems: actionItems.slice(0, 4),
    isCvMissing,
  }
}

// ── Career Path Visual Generator ───────────────────────────────

export function getCareerPath(
  profile: UserProfile,
  allOpportunities: Opportunity[]
): CareerPathData {
  const objective = profile.objectif_pro || 'Devenir développeur IA'
  const preset = findCareerPreset(objective)

  const targetRole = preset?.targetRole || objective
  const userSkills = (profile.competences || []).map(normalizeSkill)

  // Steps definition
  const fundamentals = preset?.fundamentals || ['Compétences de base', 'Git & Travail d’équipe', 'Outils du domaine']
  const advanced = preset?.advanced || ['Spécialisation avancée', 'Outils modernes', 'Résolution de problèmes complexes']
  const projects = preset?.suggestedProjects || [
    'Créer un projet pratique complet',
    'Construire un portfolio visible en ligne',
  ]

  const fundamentalsDone = fundamentals.filter((f) => userSkills.includes(normalizeSkill(f))).length
  const advancedDone = advanced.filter((a) => userSkills.includes(normalizeSkill(a))).length

  const step1Completed = fundamentalsDone >= Math.max(1, Math.floor(fundamentals.length * 0.6))
  const step2Completed = step1Completed && advancedDone >= Math.max(1, Math.floor(advanced.length * 0.5))
  const step3Completed = (profile.projets || []).length > 0

  const steps: CareerPathStep[] = [
    {
      id: 'step-1',
      category: 'fondamentaux',
      title: 'Compétences fondamentales',
      skills: fundamentals,
      description: 'Les bases incontournables pour structurer ton savoir-faire.',
      completed: step1Completed,
      current: !step1Completed,
    },
    {
      id: 'step-2',
      category: 'avance',
      title: 'Compétences avancées & Outils',
      skills: advanced,
      description: 'Les technologies et méthodologies professionnelles recherchées.',
      completed: step2Completed,
      current: step1Completed && !step2Completed,
    },
    {
      id: 'step-3',
      category: 'projets',
      title: 'Projets pratiques & Portfolio',
      skills: projects,
      description: 'Démontre concrètement tes compétences par des réalisations concrètes.',
      completed: step3Completed,
      current: step2Completed && !step3Completed,
    },
    {
      id: 'step-4',
      category: 'tremplins',
      title: 'Opportunités tremplins (Stages, Projets)',
      skills: ['Stages pratiques', 'Concours d’innovation', 'Missions freelance'],
      description: 'Une première immersion professionnelle pour forger ton expérience.',
      completed: false,
      current: step3Completed,
    },
    {
      id: 'step-5',
      category: 'objectif',
      title: `Premier poste : ${targetRole}`,
      skills: ['Emploi junior', 'Intégration d’équipe', 'Évolution continue'],
      description: 'L’aboutissement de ton parcours d’orientation.',
      completed: false,
      current: false,
    },
  ]

  // Calculate progress %
  let progress = 20
  if (step1Completed) progress += 25
  if (step2Completed) progress += 25
  if (step3Completed) progress += 15

  // Next action determination
  let nextAction = 'Acquérir les compétences fondamentales'
  const currentStep = steps.find((s) => s.current) || steps[0]
  if (currentStep.id === 'step-1') {
    const nextSkill = fundamentals.find((f) => !userSkills.includes(normalizeSkill(f)))
    nextAction = nextSkill ? `Apprendre et pratiquer ${nextSkill}` : 'Valider les fondamentaux'
  } else if (currentStep.id === 'step-2') {
    const nextSkill = advanced.find((a) => !userSkills.includes(normalizeSkill(a)))
    nextAction = nextSkill ? `Développer ${nextSkill}` : 'Approfondir les compétences avancées'
  } else if (currentStep.id === 'step-3') {
    nextAction = 'Créer et publier ton premier projet pratique'
  } else if (currentStep.id === 'step-4') {
    nextAction = 'Postuler aux opportunités recommandées ci-dessous'
  }

  // Recommended springboard opportunities matching this path
  const steppingTypes = preset?.steppingStoneTypes || ['Stage', 'Projet', 'Formation']
  const recommendedOpportunities = allOpportunities
    .filter((opp) => {
      const isTypeMatch = steppingTypes.some((t) => opp.type.toLowerCase() === t.toLowerCase())
      const isNotExpired = opp.status !== 'expired'
      return isTypeMatch && isNotExpired
    })
    .slice(0, 4)

  return {
    objective,
    targetRole,
    progressPercent: Math.min(100, progress),
    currentStepTitle: currentStep.title,
    steps,
    recommendedOpportunities,
    nextAction,
  }
}
