'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  BookOpen,
  Code2,
  MapPin,
  Heart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  User,
  Target,
  Sparkles,
} from 'lucide-react'
import { saveProfile, generateUserId } from '@/lib/storage'
import type { UserProfile } from '@/types'

// ── Lists ────────────────────────────────────────────────────

const FILIERES = [
  'Informatique', 'Génie logiciel', 'Développement web', 'Data Science',
  'Intelligence artificielle', 'Cybersécurité', 'Réseaux',
  'Marketing', 'Communication', 'Design graphique', 'UI/UX Design',
  'Commerce', 'Gestion', 'Entrepreneuriat', 'Management',
  'Finance', 'Comptabilité', 'Audit', 'Économie',
  'Ressources humaines', 'Droit', 'Sciences politiques',
  'Agronomie', 'Agriculture', 'Environnement',
  'Médecine', 'Pharmacie', 'Biologie',
  'Ingénierie', 'Génie civil', 'Génie électrique',
  'Lettres', 'Journalisme', 'Sciences de l\'éducation',
]

const NIVEAUX = [
  'Bac', 'Bac+1', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5',
  'Master', 'Doctorat',
]

const COMPETENCES_LIST = [
  // Dev
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Python', 'Django', 'Java', 'Spring', 'PHP', 'Laravel',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Git', 'Docker', 'Linux',
  'HTML', 'CSS', 'REST', 'GraphQL', 'Figma', 'UI/UX',
  // Data
  'Machine Learning', 'Data Science', 'TensorFlow', 'Excel', 'Tableau', 'Power BI',
  // Marketing
  'Marketing', 'Digital Marketing', 'SEO', 'Community Management', 'Communication',
  'Photoshop', 'Illustrator', 'InDesign', 'Design', 'Graphisme',
  // Business
  'Vente', 'Négociation', 'Prospection', 'Gestion de projet', 'Management',
  // Finance
  'Comptabilité', 'Finance', 'Audit', 'Fiscalité', 'Gestion',
  // Soft
  'Travail en équipe', 'Leadership', 'Entrepreneuriat', 'Innovation',
  'Anglais', 'Français',
]

const LOCALISATIONS = [
  'Lomé', 'Kpalimé', 'Sokodé', 'Kara', 'Atakpamé',
  'Dapaong', 'Tsévié', 'À distance',
]

const INTERETS = [
  'Stage', 'Emploi', 'Freelance', 'Bourse', 'Concours',
  'Formation', 'Entrepreneuriat', 'Projet',
]

const OBJECTIFS_SUGGESTIONS = [
  'Devenir développeur IA',
  'Devenir développeur Fullstack',
  'Devenir Data Analyst',
  'Devenir Designer UI/UX',
  'Travailler dans le Marketing Digital',
  'Devenir Chef de projet Tech',
  'Devenir Commercial B2B',
  'Créer ma startup technologique',
]

// ── Step config ───────────────────────────────────────────────

const STEPS = [
  { id: 'identite', label: 'Identité', icon: User, description: 'Qui es-tu et quel est ton objectif ?' },
  { id: 'filiere', label: 'Filière', icon: GraduationCap, description: 'Ton domaine d\'études principal' },
  { id: 'niveau', label: 'Niveau', icon: BookOpen, description: 'Ton niveau d\'études actuel' },
  { id: 'competences', label: 'Compétences', icon: Code2, description: 'Tes savoir-faire techniques et pratiques' },
  { id: 'localisation', label: 'Localisation', icon: MapPin, description: 'Ta ville de résidence' },
  { id: 'interets', label: 'Objectifs', icon: Heart, description: 'Types d\'opportunités recherchées' },
  { id: 'resume', label: 'Validation', icon: CheckCircle2, description: 'Récapitulatif de ton profil' },
]

// ── Form state ────────────────────────────────────────────────

interface FormData {
  prenom: string
  nom: string
  objectif_pro: string
  filiere: string
  niveau: string
  competences: string[]
  localisation: string
  interets: string[]
}

const INITIAL_FORM: FormData = {
  prenom: 'Éric',
  nom: 'Koffi',
  objectif_pro: 'Devenir développeur IA',
  filiere: 'Informatique',
  niveau: 'Bac+3',
  competences: ['JavaScript', 'React', 'TypeScript', 'Git'],
  localisation: 'Lomé',
  interets: ['Stage', 'Projet', 'Formation'],
}

export default function ProfilPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [searchSkill, setSearchSkill] = useState('')
  const [saving, setSaving] = useState(false)

  const totalSteps = STEPS.length
  const progressPercent = (currentStep / (totalSteps - 1)) * 100

  function canGoNext(): boolean {
    if (currentStep === 0) return form.prenom.trim().length > 0 && form.objectif_pro.trim().length > 0
    if (currentStep === 1) return !!form.filiere
    if (currentStep === 2) return !!form.niveau
    if (currentStep === 3) return form.competences.length > 0
    if (currentStep === 4) return !!form.localisation
    if (currentStep === 5) return form.interets.length > 0
    return true
  }

  function goNext() {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1)
  }

  function goPrev() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  function toggleItem(list: string[], item: string): string[] {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
  }

  function handleSave() {
    setSaving(true)
    const profile: UserProfile = {
      id: generateUserId(),
      prenom: form.prenom.trim() || 'Étudiant',
      nom: form.nom.trim(),
      objectif_pro: form.objectif_pro.trim() || 'Devenir développeur IA',
      filiere: form.filiere,
      niveau: form.niveau,
      competences: form.competences,
      localisation: form.localisation,
      interets: form.interets,
      types_opportunites: form.interets,
      projets: ['Projet étudiant ou académique'],
      createdAt: new Date().toISOString(),
    }
    saveProfile(profile)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  const filteredSkills = COMPETENCES_LIST.filter(
    (s) => !searchSkill || s.toLowerCase().includes(searchSkill.toLowerCase())
  )

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center pt-20 px-4 pb-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white text-lg">Opportunia</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Crée ton profil étudiant</h1>
          <p className="text-slate-400 text-sm">
            Personnalise ton orientation et reçois les opportunités sur-mesure.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = i === currentStep
              const isDone = i < currentStep
              return (
                <div key={step.id} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-8 sm:w-9 h-8 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : isActive
                        ? 'border-blue-400 text-blue-300 bg-blue-500/20'
                        : 'border-white/15 text-slate-500 bg-transparent'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[11px] hidden sm:block font-medium transition-colors ${
                      isActive ? 'text-blue-300 font-bold' : isDone ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="glass-card p-6 sm:p-8 border-gradient">
          <div className="mb-6">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">
              Étape {currentStep + 1} / {totalSteps}
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{STEPS[currentStep].label}</h2>
            <p className="text-slate-400 text-sm mt-1">{STEPS[currentStep].description}</p>
          </div>

          {/* ── Step 0: Identité & Objectif ── */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    placeholder="Ex: Éric"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Koffi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Objectif professionnel visé *
                </label>
                <input
                  type="text"
                  value={form.objectif_pro}
                  onChange={(e) => setForm({ ...form, objectif_pro: e.target.value })}
                  placeholder="Ex: Devenir développeur IA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 text-sm mb-2"
                />

                <p className="text-[11px] text-slate-400 mb-2">Suggestions populaires :</p>
                <div className="flex flex-wrap gap-1.5">
                  {OBJECTIFS_SUGGESTIONS.map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setForm({ ...form, objectif_pro: obj })}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        form.objectif_pro === obj
                          ? 'bg-blue-500/25 border-blue-500 text-blue-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Filière ── */}
          {currentStep === 1 && (
            <div>
              <p className="text-slate-300 text-xs mb-3">Sélectionne ta filière :</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {FILIERES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setForm({ ...form, filiere: f })}
                    className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all cursor-pointer ${
                      form.filiere === f
                        ? 'bg-blue-500/25 border-blue-500/60 text-blue-200 shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Niveau ── */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {NIVEAUX.map((n) => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, niveau: n })}
                  className={`p-4 rounded-xl text-sm font-semibold border text-center transition-all cursor-pointer ${
                    form.niveau === n
                      ? 'bg-blue-500/25 border-blue-500/60 text-blue-200 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 3: Compétences ── */}
          {currentStep === 3 && (
            <div>
              <input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="Rechercher une compétence..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 text-sm mb-3"
              />
              <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredSkills.map((s) => {
                  const selected = form.competences.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, competences: toggleItem(form.competences, s) })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selected
                          ? 'bg-blue-500 border-blue-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '} {s}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                {form.competences.length} compétence(s) sélectionnée(s)
              </p>
            </div>
          )}

          {/* ── Step 4: Localisation ── */}
          {currentStep === 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {LOCALISATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setForm({ ...form, localisation: loc })}
                  className={`p-3.5 rounded-xl text-sm font-semibold border text-center transition-all cursor-pointer ${
                    form.localisation === loc
                      ? 'bg-blue-500/25 border-blue-500/60 text-blue-200 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 5: Intérêts / Types ── */}
          {currentStep === 5 && (
            <div>
              <p className="text-slate-300 text-xs mb-3">
                Sélectionne les types d&apos;opportunités qui t&apos;intéressent :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INTERETS.map((it) => {
                  const sel = form.interets.includes(it)
                  return (
                    <button
                      key={it}
                      onClick={() => setForm({ ...form, interets: toggleItem(form.interets, it) })}
                      className={`p-3.5 rounded-xl text-sm font-semibold border text-center transition-all cursor-pointer ${
                        sel
                          ? 'bg-purple-500/25 border-purple-500/60 text-purple-200 shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      {sel ? '✓ ' : ''} {it}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 6: Résumé & Validation ── */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-slate-400">Étudiant</span>
                  <span className="text-sm font-bold text-white">
                    {form.prenom} {form.nom}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-slate-400">Objectif pro</span>
                  <span className="text-sm font-semibold text-purple-300">
                    {form.objectif_pro}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-slate-400">Filière & Niveau</span>
                  <span className="text-sm font-medium text-white">
                    {form.filiere} ({form.niveau})
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-xs text-slate-400">Ville</span>
                  <span className="text-sm font-medium text-white">{form.localisation}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">Compétences :</span>
                  <div className="flex flex-wrap gap-1">
                    {form.competences.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>
                  Ton profil est prêt ! Opportunia va calculer tes correspondances immédiatement.
                </span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10">
            {currentStep > 0 ? (
              <button
                onClick={goPrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  canGoNext()
                    ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                {saving ? 'Création en cours...' : 'Finaliser & Voir mes opportunités'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
