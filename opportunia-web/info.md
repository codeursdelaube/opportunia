# Opportunia — Dossier & Informations Projet

> **Projet :** Opportunia — Assistant d'Orientation, de Matching et de Candidature pour Étudiants  
> **Contexte :** ESIG Tech Arena 2026 — Hackathon Développement (Mini-challenge « Du problème à la solution »)  
> **Dernière mise à jour :** 17 septembre 2026  
> **Statut :** Prototype Web Fonctionnel (POC Hackathon) — Zéro dépendance backend

---

## 1. Vision & Proposition de Valeur

### Le Problème Identifié
La recherche d'opportunités (stages, premiers emplois, bourses, concours, formations) est un parcours du combattant pour les étudiants au Togo et en Afrique de l'Ouest :
1. **Dispersion et manque de visibilité** : Les offres sont éparpillées entre LinkedIn, l'ANPE, les groupes WhatsApp et les panneaux d'affichage campus.
2. **Auto-censure et syndrome de l'imposture** : L'étudiant ne sait pas s'il a le niveau requis, quelles compétences lui manquent, et abandonne sans postuler.
3. **Difficulté à candidater** : Rédiger un email professionnel, un objet accrocheur et une lettre de motivation adaptée reste un frein majeur.

### La Solution Opportunia
> *« Opportunia ne se contente pas de trouver des opportunités pour les étudiants : il leur montre lesquelles sont réellement accessibles, ce qui leur manque pour les décrocher et les accompagne jusqu'à la candidature. »*

Opportunia est un **assistant d'orientation complet, transparent et actionnable** qui calcule l'adéquation exacte entre un profil et les exigences du marché.

---

## 2. Les 5 Fonctionnalités Principales (Livrable Mini-Challenge)

1. **Profil Étudiant & Objectif de Carrière** :
   - Saisie rapide de l'identité, de la filière, du niveau (Bac à Bac+5), des compétences réelles, de la ville et de l'objectif professionnel visé (ex: *« Devenir développeur IA »*).
2. **Matching Intelligent & Explicabilité** :
   - Algorithme déterministe noté sur 100 points analysant les proximités sémantiques (React ≈ Next.js, UI/UX ≈ Figma, Data Science ≈ Python + Stats).
   - RadarChart Recharts (5 dimensions) et explications positives (*« Pourquoi cette offre te correspond »*).
3. **Diagnostic « Ce qu'il te manque » (Gap Analysis)** :
   - Identification visuelle des compétences déjà acquises vs compétences à développer.
   - Plan d'action concret en 3 étapes pour combler l'écart et augmenter ses chances.
4. **Générateur de Candidature & Checklist** :
   - Génération locale et personnalisée de l'**objet de mail**, du **message d'accompagnement** et d'une **lettre de motivation courte**.
   - Boutons de copie rapide en un clic et checklist interactive avant candidature (*« Avant de candidater »*).
5. **Tracker de Candidatures & Suivi Kanban** :
   - Suivi complet du statut des candidatures (Sauvegardée, Préparée, Envoyée, En attente, Entretien, Acceptée, Refusée).


---

## 3. Lancer le Projet Localement

```bash
cd opportunia-web
npm run dev
# Ouvrir l'application sur http://localhost:3000
```

Pour compiler et vérifier la conformité du build de production :
```bash
npm run build
```

---

## 4. Architecture des Fichiers

```
opportunia-web/
├── app/
│   ├── layout.tsx                # Layout racine (Navbar, metadata PWA, DaisyUI theme adaptatif)
│   ├── globals.css               # Design system complet (Tailwind v4, variables CSS, Dark/Light mode)
│   ├── page.tsx                  # Landing page (Hero, CTA dynamique, catégories, matching explainer)
│   ├── manifest.ts               # PWA Manifest
│   ├── profil/
│   │   └── page.tsx              # Formulaire de profil étudiant (Prénom, Nom, Filière, Niveau, Compétences)
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard central (Statistiques, Recommandations, Tracker, Favoris)
│   ├── opportunites/
│   │   ├── page.tsx              # Catalogue d'opportunités avec filtres (Pour toi, Type, Niveau, Ville, Statut)
│   │   └── [id]/
│   │       └── page.tsx          # Fiche détaillée (Explications, Missing skills, RadarChart, Checklist, Candidature externe)
│   ├── candidatures/
│   │   └── page.tsx              # Tracker complet du pipeline de candidatures
│   └── sauvegardees/
│       └── page.tsx              # Gestionnaire des favoris
│
├── components/
│   ├── navbar/
│   │   ├── Navbar.tsx            # Navigation sticky avec accès Dashboard, Candidatures, Opportunités, Sauvegardées
│   │   └── ThemeToggle.tsx       # Toggle Clair / Sombre
│   ├── home/
│   │   └── HomeCtaButton.tsx     # Bouton CTA intelligent (redirige selon l'état du profil)
│   ├── opportunity/
│   │   ├── OpportunityCard.tsx           # Carte premium avec score ring, source vérifiée, compétences manquantes
│   │   ├── MissingSkillsSection.tsx      # Section « Ce qu'il te manque » + conseils concrets
│   │   ├── ApplicationPreparationModal.tsx # Modal de génération d'email et lettre avec boutons copier
│   │   ├── ChecklistSection.tsx          # Checklist interactive « Avant de candidater »
│   │   ├── MatchingChart.tsx             # RadarChart Recharts sur 5 axes
│   │   ├── MatchReasons.tsx              # Liste des arguments d'adéquation
│   │   └── CandidatureModal.tsx          # Modal de redirection avec décompte
│   ├── dashboard/
│   │   ├── ApplicationTrackerSummary.tsx # Résumé du pipeline de candidatures sur le dashboard
│   │   └── StatsBar.tsx                  # Statistiques rapides
│   ├── pwa/
│   │   └── PwaRegister.tsx       # Enregistrement du Service Worker
│   └── ui/
│       ├── Badge.tsx             # TypeBadge + ScoreBadge
│       └── ScoreRing.tsx         # Jauge circulaire SVG animée
│
├── data/
│   ├── opportunities.json        # 30 opportunités qualifiées (source de vérité)
│   └── opportunia_opportunities.json # Base d'offres de référence
│
├── lib/
│   ├── matching.ts               # Moteur de scoring, proximités sémantiques et explications
│   ├── applicationGenerator.ts  # Générateur de templates de candidature (objet, mail, lettre)
│   ├── storage.ts                # Gestion centralisée du localStorage (profil, favoris, candidatures, checklists)
│   ├── opportunities.ts          # Accès et typage des opportunités
│   └── utils.ts                  # Formatage des dates, deadlines et images Unsplash
│
├── public/
│   └── sw.js                     # Service Worker pour la mise en cache PWA
└── types/
    └── index.ts                  # Types TypeScript stricts (UserProfile, Opportunity, MatchResult, etc.)
```

---

## 5. Algorithme de Matching & Pondération (Total 100 pts)

| Dimension | Points max | Description & Logique métier |
|---|---|---|
| **Filière** | **30** | Correspondance exacte ou domaine compatible (informatique, gestion, agronomie...). |
| **Compétences** | **30** | Nombre et pertinence des compétences de l'étudiant couvrant les prérequis de l'offre. |
| **Niveau d'études** | **20** | Respect du niveau minimum requis (ex: Bac+2, Bac+3, Master). |
| **Localisation** | **10** | Même ville ou opportunité signalée « À distance » / « Remote ». |
| **Centres d'intérêt** | **10** | Adéquation entre le type d'opportunité (Stage, Bourse, Concours…) et les préférences de l'étudiant. |

---

## 6. Persistance des Données (`localStorage`)

| Clé | Usage | Structure |
|---|---|---|
| `opportunia_profile` | Profil complet de l'étudiant | `{ prenom, nom, filiere, niveau, competences, localisation, interets }` |
| `opportunia_favorites` | IDs des offres mises de côté | `["opp-001", "opp-020", ...]` |
| `opportunia_applications` | Pipeline de suivi des candidatures | `[{ opportunityId, status, date, notes }]` |
| `opportunia_checklists` | États des cases à cocher par offre | `Record<opportunityId, Record<itemId, boolean>>` |

---

## 7. Scénario Démo Recommandé (Présentation 8-10 min)

1. **Accueil (`/`)** :
   - Montrer l'accroche : *« Ne cherche plus une opportunité. Trouve celle qui te correspond. »*
   - Présentation de la valeur ajoutée : orientation + diagnostic + préparation.
2. **Création du profil (`/profil`)** :
   - Saisie rapide : Éric Koffi, Informatique, Bac+3, Lomé.
   - Compétences : JavaScript, React, TypeScript, Git.
3. **Dashboard personnalisé (`/dashboard`)** :
   - Vue d'ensemble chiffrée avec la barre de statistiques (offres compatibles, sauvegardées, urgentes).
   - Recommandations personnalisées avec badge de source vérifiée (LinkedIn, ANPE...).
4. **Fiche d'offre & Explicabilité (`/opportunites/[id]`)** :
   - Examen de la compatibilité (RadarChart Recharts).
   - Section **« Pourquoi cette offre te correspond »** (points forts).
   - Section **« 🚀 Ce qu'il te manque pour cette offre »** (Python, Machine Learning) + plan d'action en 3 étapes.
   - Checklist interactive **« Avant de candidater »**.
5. **Préparation & Candidature** :
   - Clic sur **« 📝 Préparer ma candidature »** : génération instantanée de l'objet, de l'email et de la lettre avec copie en 1 clic.
   - Clic sur **« Candidater »** : ouverture directe du lien officiel partenaire dans un nouvel onglet (`target="_blank"`).
6. **Suivi des candidatures (`/candidatures`)** :
   - L'offre passe en statut *« Candidature envoyée »*.
   - Démonstration du changement de statut (En attente → Entretien → Accepté).

---

## 8. Trame des 8 Slides PowerPoint (Livrable ESIG Tech Arena)

* **Slide 1 — Titre & Équipe** : Opportunia — Du problème à la solution. Noms des membres de l'équipe et logos.
* **Slide 2 — Le Problème Identifié** : La jungle de l'insertion étudiante : offres dispersées, auto-censure par manque de clarté sur les prérequis, candidatures non préparées.
* **Slide 3 — Le Contexte & Public Cible** : Étudiants et jeunes diplômés (focus campus & Afrique de l'Ouest). Besoin d'un accompagnement personnalisé et transparent.
* **Slide 4 — La Solution Opportunia** : Un assistant d'orientation et de candidature intelligent qui analyse le profil, diagnostique les manques et propulse vers l'action.
* **Slide 5 — 5 Fonctionnalités Majeures** : 
  1. Profil étudiant & compétences clés  
  2. Matching explicable (RadarChart)  
  3. Diagnostic des compétences manquantes & conseils  
  4. Assistant de génération de candidature  
  5. Tracker de candidatures & gestionnaire de favoris
* **Slide 6 — Démonstration du Prototype** : Captures clés de l'application web (Dashboard, Fiche d'offre avec RadarChart, Modal de préparation de candidature).
* **Slide 7 — Valeur Ajoutée & Perspectives** : 
  - *Valeur ajoutée* : Gain de temps considérable, décomplexion face aux offres, zéro boîte noire.  
  - *Perspectives futures* : Partenariats entreprises locales, alertes WhatsApp/SMS, mentorat campus.
* **Slide 8 — Conclusion & Vision** : Permettre à chaque étudiant de transformer son potentiel en opportunité concrète.
