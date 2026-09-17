# Opportunia — Info Projet

> Prototype POC de matching d'opportunités étudiantes.  
> Dernière mise à jour : 17 septembre 2026

---

## Lancer le projet

```bash
cd opportunia-web
npm run dev
# Ouvrir http://localhost:3000
```

---

## Architecture des fichiers

```
opportunia-web/
├── app/
│   ├── layout.tsx            # Layout racine (Navbar, metadata, DaisyUI theme)
│   ├── globals.css           # Design system complet (variables CSS, glass-card, gradients…)
│   ├── page.tsx              # Landing page (Hero, catégories, how-it-works, matching, CTA)
│   ├── profil/
│   │   └── page.tsx          # Formulaire profil en 6 étapes
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard avec ranking des opportunités
│   ├── opportunites/
│   │   ├── page.tsx          # Liste avec recherche + filtres + tri
│   │   └── [id]/
│   │       └── page.tsx      # Détail avec RadarChart Recharts + MatchReasons
│   └── sauvegardees/
│       └── page.tsx          # Favoris localStorage
│
├── components/
│   ├── navbar/
│   │   └── Navbar.tsx        # Navbar sticky responsive avec état profil
│   ├── ui/
│   │   ├── Badge.tsx         # TypeBadge + ScoreBadge
│   │   └── ScoreRing.tsx     # Ring SVG animé avec score %
│   ├── opportunity/
│   │   ├── OpportunityCard.tsx   # Carte premium avec image, score, favoris
│   │   ├── MatchingChart.tsx     # RadarChart Recharts (5 axes)
│   │   └── MatchReasons.tsx      # Explication du score + compétences
│   └── dashboard/
│       └── StatsBar.tsx      # 4 stats cards
│
├── data/
│   ├── opportunities.json        # 20 opportunités (source de vérité)
│   └── opportunia_opportunities.json  # Fichier original (backup)
│
├── lib/
│   ├── matching.ts           # Moteur de scoring (5 dimensions, 100 pts)
│   ├── storage.ts            # localStorage (profil + favoris)
│   └── utils.ts              # Formatage deadlines, couleurs, labels
│
└── types/
    └── index.ts              # Opportunity, UserProfile, MatchResult, etc.
```

---

## Stack technique

| Technologie | Version | Usage |
|---|---|---|
| Next.js | 16.3.5 | App Router, SSR/CSR |
| TypeScript | 5+ | Typage complet |
| Tailwind CSS | 4 | Styles utilitaires |
| DaisyUI | 5 | Thème dark "opportunia" |
| Lucide React | 1.47 | Icônes |
| Motion | 13+ | Animations (prêt à utiliser) |
| Swiper | 14+ | Carousel (prêt à utiliser) |
| Recharts | 2+ | RadarChart sur page détail |

---

## Moteur de matching (`/lib/matching.ts`)

Score sur **100 points**, décomposé en 5 dimensions :

| Dimension | Points | Logique |
|---|---|---|
| Filière | 30 | Proximité via `FIELD_GROUPS` (dictionnaire de synonymes) |
| Niveau | 20 | Comparaison numérique (Bac=0, Bac+1=1, …, Master=5) |
| Compétences | 30 | Couverture + `SKILL_PROXIMITY` (ex: React↔Next.js) |
| Localisation | 10 | Exact/partiel + remote toujours compatible |
| Intérêts | 10 | Type offre vs centres d'intérêt du profil |

**Fonctions exportées :**
- `normalizeText()` / `normalizeSkill()` — normalisation accents/casse
- `getFieldMatchScore()` — score filière
- `getLevelScore()` — score niveau
- `getSkillsScore()` — score compétences + listes matched/missing
- `getLocationScore()` — score localisation
- `getInterestScore()` — score intérêts
- `calculateMatchScore()` — score complet avec breakdown
- `rankOpportunities()` — tri + filtrage expiré
- `getMatchReasons()` — raisons humaines (✓ / ✗ / ~)

---

## localStorage

| Clé | Contenu |
|---|---|
| `opportunia_user_id` | UUID généré côté client |
| `opportunia_profile` | JSON complet du profil |
| `opportunia_favorites` | Array d'IDs d'opportunités |

---

## Parcours utilisateur

```
/ (Landing)
  → /profil  (6 étapes)
    → /dashboard  (recommandations personnalisées)
      → /opportunites  (liste filtrée)
        → /opportunites/[id]  (détail + RadarChart)
      → /sauvegardees  (favoris)
```

---

## Profil de test recommandé

Pour une démo optimale :

```
Filière     : Informatique
Niveau      : Bac+3
Compétences : React, JavaScript, TypeScript, Git
Localisation: Lomé
Intérêts    : Stage, Concours
```

→ opp-001 (Développeur React/Next.js) devrait scorer ~85-94%

---

## Ce qui N'est PAS dans ce projet (par choix POC)

- ❌ Supabase / Prisma / Firebase
- ❌ Authentification / OAuth / login
- ❌ API backend
- ❌ OpenAI / IA externe
- ❌ Paiement
- ❌ Dashboard recruteur

---

## Avancement

- [x] Data : `data/opportunities.json` (20 offres)
- [x] Types TypeScript complets
- [x] Moteur de matching (5 dimensions, explainable)
- [x] localStorage (profil + favoris)
- [x] Design system (CSS variables, dark theme, DaisyUI)
- [x] Navbar responsive
- [x] Landing page premium
- [x] Formulaire profil 6 étapes
- [x] Dashboard avec scoring
- [x] Page liste avec filtres/recherche/tri
- [x] Page détail avec RadarChart Recharts
- [x] Page favoris
- [x] Composants : OpportunityCard, MatchingChart, MatchReasons, ScoreRing, StatsBar
