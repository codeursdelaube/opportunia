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
} from 'lucide-react'
import { saveProfile, generateUserId } from '@/lib/storage'
import type { UserProfile } from '@/types'

// ── Step data ────────────────────────────────────────────────

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
  // RH / Droit
  'Recrutement', 'Gestion RH', 'Droit', 'Administration',
  // Agriculture
  'Agriculture', 'Agronomie', 'Environnement',
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

// ── Step config ───────────────────────────────────────────────

const STEPS = [
  { id: 'filiere', label: 'Filière', icon: GraduationCap, description: 'Votre domaine d\'études' },
  { id: 'niveau', label: 'Niveau', icon: BookOpen, description: 'Votre niveau actuel' },
  { id: 'competences', label: 'Compétences', icon: Code2, description: 'Vos compétences clés' },
  { id: 'localisation', label: 'Localisation', icon: MapPin, description: 'Votre ville' },
  { id: 'interets', label: 'Intérêts', icon: Heart, description: 'Ce que vous recherchez' },
  { id: 'resume', label: 'Résumé', icon: CheckCircle2, description: 'Validation du profil' },
]

// ── Form state ────────────────────────────────────────────────

interface FormData {
  filiere: string
  niveau: string
  competences: string[]
  localisation: string
  interets: string[]
}

const INITIAL_FORM: FormData = {
  filiere: '',
  niveau: '',
  competences: [],
  localisation: '',
  interets: [],
}

// ── Component ─────────────────────────────────────────────────

export default function ProfilPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [searchSkill, setSearchSkill] = useState('')
  const [saving, setSaving] = useState(false)

  const totalSteps = STEPS.length
  const progressPercent = ((currentStep) / (totalSteps - 1)) * 100

  function canGoNext(): boolean {
    if (currentStep === 0) return !!form.filiere
    if (currentStep === 1) return !!form.niveau
    if (currentStep === 2) return form.competences.length > 0
    if (currentStep === 3) return !!form.localisation
    if (currentStep === 4) return form.interets.length > 0
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
      filiere: form.filiere,
      niveau: form.niveau,
      competences: form.competences,
      localisation: form.localisation,
      interets: form.interets,
      createdAt: new Date().toISOString(),
    }
    saveProfile(profile)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  const filteredSkills = COMPETENCES_LIST.filter(
    (s) => !searchSkill || s.toLowerCase().includes(searchSkill.toLowerCase()),
  )

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center pt-16 px-4 pb-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white text-lg">Opportunia</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Créez votre profil</h1>
          <p className="text-slate-400">
            En {totalSteps - 1} étapes, nous personnalisons vos recommandations.
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : isActive
                        ? 'border-blue-500 text-blue-400 bg-blue-500/15'
                        : 'border-white/15 text-slate-600 bg-transparent'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-xs hidden sm:block font-medium transition-colors ${
                      isActive ? 'text-blue-300' : isDone ? 'text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="glass-card p-5 sm:p-8 border-gradient">
          {/* Step header */}
          <div className="mb-8">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Étape {currentStep + 1} / {totalSteps}
            </p>
            <h2 className="text-2xl font-bold text-white">{STEPS[currentStep].label}</h2>
            <p className="text-slate-400 text-sm mt-1">{STEPS[currentStep].description}</p>
          </div>

          {/* ── Step 0: Filière ── */}
          {currentStep === 0 && (
            <div>
              <p className="text-slate-300 text-sm mb-4">Sélectionnez votre filière :</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {FILIERES.map((f) => (
                  <button
                    key={f}
                    onClick={() => setForm({ ...form, filiere: f })}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-all ${
                      form.filiere === f
                        ? 'bg-blue-500/25 border-blue-500/60 text-blue-200'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {form.filiere && (
                <p className="mt-4 text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {form.filiere} sélectionné
                </p>
              )}
            </div>
          )}

          {/* ── Step 1: Niveau ── */}
          {currentStep === 1 && (
            <div>
              <p className="text-slate-300 text-sm mb-4">Sélectionnez votre niveau d&apos;études actuel :</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {NIVEAUX.map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm({ ...form, niveau: n })}
                    className={`py-4 rounded-xl text-sm font-semibold border transition-all ${
                      form.niveau === n
                        ? 'bg-blue-500/25 border-blue-500/60 text-blue-200'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Compétences ── */}
          {currentStep === 2 && (
            <div>
              <p className="text-slate-300 text-sm mb-3">
                Sélectionnez vos compétences{' '}
                <span className="text-slate-500">({form.competences.length} sélectionnée{form.competences.length > 1 ? 's' : ''})</span>
              </p>
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm mb-3"
              />
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setForm({ ...form, competences: toggleItem(form.competences, skill) })}
                    className={`chip border transition-all ${
                      form.competences.includes(skill)
                        ? 'bg-blue-500/25 border-blue-500/50 text-blue-200'
                        : 'bg-white/4 border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Localisation ── */}
          {currentStep === 3 && (
            <div>
              <p className="text-slate-300 text-sm mb-4">Sélectionnez votre ville :</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LOCALISATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setForm({ ...form, localisation: loc })}
                    className={`py-4 rounded-xl text-sm font-semibold border transition-all ${
                      form.localisation === loc
                        ? 'bg-blue-500/25 border-blue-500/60 text-blue-200'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Intérêts ── */}
          {currentStep === 4 && (
            <div>
              <p className="text-slate-300 text-sm mb-4">
                Qu&apos;est-ce que vous recherchez ?{' '}
                <span className="text-slate-500">(plusieurs choix possibles)</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INTERETS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => setForm({ ...form, interets: toggleItem(form.interets, interest) })}
                    className={`py-4 rounded-xl text-sm font-semibold border transition-all ${
                      form.interets.includes(interest)
                        ? 'bg-blue-500/25 border-blue-500/60 text-blue-200'
                        : 'bg-white/4 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: Résumé ── */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Voici votre profil</p>
                  <p className="text-slate-400 text-sm">Vérifiez les informations avant de continuer.</p>
                </div>
              </div>

              {[
                { label: 'Filière', value: form.filiere, icon: GraduationCap },
                { label: 'Niveau', value: form.niveau, icon: BookOpen },
                { label: 'Localisation', value: form.localisation, icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl bg-white/4 border border-white/8">
                  <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-white">{value}</p>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  Compétences ({form.competences.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {form.competences.map((s) => (
                    <span key={s} className="chip border bg-blue-500/15 text-blue-300 border-blue-500/25 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/4 border border-white/8">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  Intérêts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {form.interets.map((i) => (
                    <span key={i} className="chip border bg-purple-500/15 text-purple-300 border-purple-500/25 text-xs">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
            <button
              onClick={goPrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-slate-400 text-sm font-medium transition-all hover:border-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={goNext}
                disabled={!canGoNext()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25"
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-all disabled:opacity-60 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                {saving ? 'Analyse en cours...' : 'Voir mes opportunités'}
                {!saving && <Zap className="w-4 h-4 fill-current" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
