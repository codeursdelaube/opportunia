// ============================================================
// OPPORTUNIA — Référentiel des Filières & Compétences adaptatives
// /lib/skillsData.ts
// ============================================================

export interface DomainCategory {
  id: string
  name: string
  iconName: string
  filieres: string[]
  skills: string[]
}

export const DOMAINS: DomainCategory[] = [
  {
    id: 'sciences_vie_sante',
    name: 'Sciences de la Vie & Santé',
    iconName: 'HeartPulse',
    filieres: [
      'Biologie',
      'Biochimie',
      'Biotechnologie',
      'Santé publique',
      'Médecine',
      'Pharmacie',
      'Sciences biomédicales',
      'Soins infirmiers',
      'Chimie',
      'Physique',
    ],
    skills: [
      'Microbiologie',
      'Biochimie',
      'Biologie moléculaire',
      'Analyses biomédicales',
      'Génétique',
      'Culture cellulaire',
      'Sécurité en laboratoire (BPL)',
      'PCR & Amplification ADN',
      'Microscopie',
      'Hématologie',
      'Immunologie',
      'Biotechnologie',
      'Santé publique',
      'Épidémiologie',
      'Pharmacologie',
      'Soins cliniques',
      'Diagnostic médical',
      'Pharmacovigilance',
      'Hygiène & Biosécurité',
      'Sensibilisation communautaire',
      'Recherche scientifique',
      'Gestion d\'échantillons',
      'Bio-statistiques',
      'Premiers secours',
    ],
  },
  {
    id: 'agriculture_environnement',
    name: 'Agriculture & Environnement',
    iconName: 'Sprout',
    filieres: [
      'Agronomie',
      'Agriculture',
      'Agroéconomie',
      'Agroforesterie',
      'Environnement & Écologie',
      'Gestion des ressources naturelles',
      'Élevage & Production animale',
      'Biologie marine & Halieutique',
      'Développement rural',
    ],
    skills: [
      'Agronomie & Sciences du sol',
      'Pédologie (analyse des sols)',
      'Protection des cultures (Phytosanitaire)',
      'Agroécologie & Permaculture',
      'Irrigation & Gestion de l\'eau',
      'Production végétale',
      'Élevage & Nutrition animale',
      'Agroforesterie',
      'SIG agricole & Cartographie (QGIS)',
      'Gestion d\'exploitation agricole',
      'Transformation agroalimentaire',
      'Étude d\'impact environnemental (EIE)',
      'Gestion des déchets & Recyclage',
      'Traitement des eaux',
      'RSE & Développement durable',
      'Changement climatique & Adaptation',
      'Foresterie & Reboisement',
      'Conservation de la biodiversité',
      'Vulgarisation agricole',
    ],
  },
  {
    id: 'informatique_tech',
    name: 'Informatique, IA & Technologies',
    iconName: 'Code2',
    filieres: [
      'Informatique',
      'Génie logiciel',
      'Développement web',
      'Data Science',
      'Intelligence artificielle',
      'Cybersécurité',
      'Réseaux & Télécoms',
      'Systèmes d\'information',
      'Développement mobile',
    ],
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Vue.js',
      'Node.js',
      'Python',
      'Django / FastAPI',
      'PHP & Laravel',
      'Java & Spring',
      'SQL / PostgreSQL / MySQL',
      'MongoDB',
      'Git & GitHub',
      'Docker & Conteneurs',
      'Linux & Administration système',
      'HTML & CSS',
      'API REST & GraphQL',
      'Cybersécurité & Tests d\'intrusion',
      'Réseaux & Protocoles IP',
      'Machine Learning',
      'Deep Learning',
      'Power BI',
      'Excel avancé',
      'Data Analysis',
      'Flutter / Mobile',
      'Cloud (AWS / GCP)',
    ],
  },
  {
    id: 'droit_politique',
    name: 'Droit & Sciences Politiques',
    iconName: 'Scale',
    filieres: [
      'Droit',
      'Droit des affaires',
      'Droit public',
      'Droit privé',
      'Sciences politiques',
      'Relations internationales',
      'Administration publique',
      'Diplomatie',
    ],
    skills: [
      'Droit des affaires',
      'Droit du travail & Droit social',
      'Droit civil',
      'Droit public & Administratif',
      'Rédaction de contrats & Actes',
      'Contentieux & Procédure judiciaire',
      'Veille juridique',
      'Droit fiscal',
      'Droit foncier',
      'Droit international & Droits de l\'Homme',
      'Marchés publics',
      'Négociation juridique',
      'Plaidoyer & Lobbying',
      'Sciences politiques',
      'Relations internationales & Diplomatie',
      'Administration publique',
      'Gestion des conflits',
    ],
  },
  {
    id: 'economie_finance_gestion',
    name: 'Économie, Finance & Gestion',
    iconName: 'Coins',
    filieres: [
      'Finance',
      'Comptabilité',
      'Audit & Contrôle de gestion',
      'Économie',
      'Banque & Assurance',
      'Commerce & Vente',
      'Gestion',
      'Management',
      'Entrepreneuriat',
      'Logistique & Supply Chain',
      'Ressources humaines',
    ],
    skills: [
      'Comptabilité générale',
      'Comptabilité analytique',
      'Finance d\'entreprise',
      'Audit & Contrôle interne',
      'Fiscalité d\'entreprise',
      'Analyse financière',
      'Contrôle de gestion',
      'Gestion de trésorerie',
      'Logiciels comptables (Sage/Excel)',
      'Économétrie & Modélisation',
      'Négociation commerciale',
      'Vente B2B & Prospection',
      'Gestion de la relation client (CRM)',
      'Management d\'équipe',
      'Entrepreneuriat & Création de startup',
      'Business Plan',
      'Pitch commercial',
      'Logistique & Gestion des stocks',
      'Recrutement & Sourcing RH',
      'Gestion de la paie',
      'Administration du personnel',
    ],
  },
  {
    id: 'communication_design_medias',
    name: 'Communication, Médias & Design',
    iconName: 'Palette',
    filieres: [
      'Communication',
      'Marketing',
      'Marketing digital',
      'Design graphique',
      'UI/UX Design',
      'Journalisme',
      'Audiovisuel & Médias',
      'Relations publiques',
    ],
    skills: [
      'Marketing digital',
      'Communication d\'entreprise',
      'Community Management',
      'SEO & Référencement',
      'Création de contenu',
      'Stratégie de marque / Branding',
      'Relations publiques & Médias',
      'Copywriting & Rédaction web',
      'Journalisme & Enquêtes',
      'Publicité en ligne (Meta/Google Ads)',
      'UI/UX Design',
      'Figma',
      'Photoshop',
      'Illustrator',
      'InDesign',
      'Canva',
      'Montage vidéo (Premiere Pro / CapCut)',
      'Prototypage & Wireframing',
      'Motion Design',
      'Événementiel & Relations presse',
    ],
  },
  {
    id: 'ingenierie_btp',
    name: 'Ingénierie, BTP & Industrie',
    iconName: 'HardHat',
    filieres: [
      'Ingénierie',
      'Génie civil',
      'Génie électrique',
      'Génie mécanique',
      'Génie industriel',
      'Énergies renouvelables',
      'Architecture',
      'Télécommunications',
    ],
    skills: [
      'AutoCAD',
      'Calcul de structures & RDM',
      'Gestion & Suivi de chantier',
      'Topographie',
      'Génie civil & BTP',
      'Schémas électriques & Électrotechnique',
      'Dimensionnement solaire & Photovoltaïque',
      'Énergies renouvelables',
      'Maintenance industrielle',
      'Revit / Modélisation BIM',
      'Devis quantitatif & Métreur',
      'Automatisme & Régulation',
      'Sécurité sur chantier (HSE)',
    ],
  },
  {
    id: 'sciences_humaines_education',
    name: 'Sciences Humaines, Éducation & Lettres',
    iconName: 'BookOpenCheck',
    filieres: [
      'Sciences sociales',
      'Sociologie',
      'Sciences de l\'éducation',
      'Lettres',
      'Journalisme',
      'Psychologie',
      'Action humanitaire',
      'Développement international',
    ],
    skills: [
      'Enquêtes de terrain & Collecte de données',
      'KoboToolbox & ODK',
      'Gestion de projet de développement',
      'Suivi & Évaluation (S&E)',
      'Action humanitaire',
      'Sociologie & Diagnostic communautaire',
      'Mobilisation communautaire',
      'Plaidoyer',
      'Ingénierie pédagogique',
      'Animation d\'ateliers & Formation',
      'Didactique & Enseignement',
      'Rédaction académique & Rapports',
      'Traduction & Interprétariat',
      'Recherche documentaire',
      'Communication institutionnelle',
    ],
  },
]

// ── Compétences transversales (universelles à toutes les filières) ─────
export const TRANSVERSAL_SKILLS: string[] = [
  'Anglais professionnel',
  'Français professionnel',
  'Communication orale & écrite',
  'Rédaction de rapports',
  'Gestion de projet',
  'Travail en équipe',
  'Leadership',
  'Pack Office (Word, Excel, PowerPoint)',
  'Résolution de problèmes',
  'Organisation & Rigueur',
  'Recherche documentaire & Synthèse',
  'Esprit critique',
  'Créativité & Innovation',
  'Gestion du temps',
]

// ── Liste aplatie de toutes les filières ───────────────────────
export const ALL_FILIERES: string[] = Array.from(
  new Set(DOMAINS.flatMap((d) => d.filieres))
).sort((a, b) => a.localeCompare(b, 'fr'))

// ── Trouver les compétences recommandées pour une filière ──────
export function getSkillsForFiliere(filiere: string): {
  recommended: string[]
  domainName: string
} {
  if (!filiere) {
    return {
      recommended: TRANSVERSAL_SKILLS.slice(0, 8),
      domainName: 'Général',
    }
  }

  const normalisedFiliere = filiere.toLowerCase().trim()

  // 1. Chercher un domaine correspondant exactement ou partiellement
  for (const domain of DOMAINS) {
    const hasFiliere = domain.filieres.some((f) => {
      const normF = f.toLowerCase().trim()
      return (
        normF === normalisedFiliere ||
        normalisedFiliere.includes(normF) ||
        normF.includes(normalisedFiliere)
      )
    })

    if (hasFiliere) {
      return {
        recommended: domain.skills,
        domainName: domain.name,
      }
    }
  }

  // 2. Par défaut si non trouvé, renvoyer les transversales
  return {
    recommended: TRANSVERSAL_SKILLS,
    domainName: 'Compétences Générales',
  }
}

// ── Liste aplatie et unique de toutes les compétences ─────────
export const ALL_SKILLS: string[] = Array.from(
  new Set([
    ...DOMAINS.flatMap((d) => d.skills),
    ...TRANSVERSAL_SKILLS,
  ])
).sort((a, b) => a.localeCompare(b, 'fr'))
