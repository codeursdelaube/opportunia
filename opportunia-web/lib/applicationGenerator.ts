// ============================================================
// OPPORTUNIA — Application Materials Generator
// /lib/applicationGenerator.ts
//
// 100% local dynamic template engine (no external API needed)
// ============================================================

import type { UserProfile, Opportunity, GeneratedApplication } from '@/types'
import { getSkillsScore } from './matching'

export function generateApplication(
  profile: UserProfile,
  opportunity: Opportunity
): GeneratedApplication {
  const prenom = profile.prenom || 'Étudiant'
  const nom = profile.nom || ''
  const fullName = `${prenom} ${nom}`.trim()
  const filiere = profile.filiere || 'Informatique'
  const niveau = profile.niveau || 'Bac+3'
  const entreprise = opportunity.entreprise || 'Votre entreprise'
  const titre = opportunity.titre || "l'opportunité proposée"
  const type = opportunity.type || 'Stage'

  // Match skills to highlight in the application
  const { matchedSkills } = getSkillsScore(
    profile.competences || [],
    opportunity.competences_requises || []
  )

  const highlightedSkills =
    matchedSkills.length > 0
      ? matchedSkills.slice(0, 4).join(', ')
      : (profile.competences || []).slice(0, 3).join(', ') || 'mes compétences techniques'

  // 1. Objet de mail
  const subject = `Candidature au poste de ${titre} - ${fullName}`

  // 2. Email de candidature
  const emailBody = `Madame, Monsieur,

Actuellement étudiant(e) en ${filiere} (niveau ${niveau}) à ${profile.localisation || 'Lomé'}, je vous adresse avec un vif intérêt ma candidature pour l'opportunité de ${type} intitulée "${titre}" au sein de ${entreprise}.

Passionné(e) par ce domaine et doté(e) de compétences concrètes en ${highlightedSkills}, je suis particulièrement motivé(e) à l'idée d'apporter mon dynamisme et ma rigueur au sein de vos équipes.

Je serais honoré(e) de pouvoir échanger avec vous lors d'un entretien pour vous exposer plus en détail mes motivations et ma vision pour ce poste.

Vous trouverez ci-joint mon curriculum vitae ainsi que les pièces complémentaires requises.

En vous remerciant pour l'attention portée à ma démarche, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${fullName}
Étudiant(e) en ${filiere} (${niveau})
${profile.localisation || ''}
`.trim()

  // 3. Lettre de motivation courte
  const coverLetter = `À l'attention du Responsable des Recrutements
${entreprise}

Objet : Candidature au poste de ${titre}

Madame, Monsieur,

C'est avec un grand enthousiasme que je vous soumets ma candidature pour le poste de ${titre} au sein de ${entreprise}.

Actuellement en formation en ${filiere} (niveau ${niveau}), mon parcours m'a permis de développer des bases solides ainsi qu'une expérience pratique sur des projets concrets. Dans le cadre de mes études et réalisations personnelles, j'ai notamment eu l'occasion de consolider mes compétences en ${highlightedSkills}.

La vision et le positionnement de ${entreprise} correspondent précisément aux défis auxquels je souhaite contribuer. Curieux(se), proactif(ve) et doté(e) d'un excellent esprit d'équipe, je suis convaincu(e) de pouvoir m'intégrer rapidement et répondre efficacement aux exigences de vos missions.

Dans l'attente d'un échange constructif lors d'un entretien, je reste à votre entière disposition pour tout renseignement complémentaire.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations les plus respectueuses.

${fullName}
`.trim()

  return {
    subject,
    emailBody,
    coverLetter,
  }
}
