'use client'

import { useState, useMemo, useEffect } from 'react'
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
  User,
  Sparkles,
  Search,
  Plus,
  X,
  Tag,
  Check,
} from 'lucide-react'
import { saveProfile, loadProfile, generateUserId } from '@/lib/storage'
import type { UserProfile } from '@/types'
import {
  DOMAINS,
  ALL_FILIERES,
  TRANSVERSAL_SKILLS,
  ALL_SKILLS,
  getSkillsForFiliere,
} from '@/lib/skillsData'

// ── Step config ───────────────────────────────────────────────

const NIVEAUX = [
  'Bac', 'Bac+1', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5',
  'Master', 'Doctorat',
]

const LOCALISATIONS = [
  'Lomé', 'Kpalimé', 'Sokodé', 'Kara', 'Atakpamé',
  'Dapaong', 'Tsévié', 'À distance',
]

const INTERETS = [
  'Stage', 'Emploi', 'Freelance', 'Bourse', 'Concours',
  'Formation', 'Entrepreneuriat', 'Projet',
]

const STEPS = [
  { id: 'identite', label: 'Identité', icon: User, description: 'Entre ton prénom et ton nom' },
  { id: 'filiere', label: 'Filière', icon: GraduationCap, description: 'Ton domaine d\'études principal' },
  { id: 'niveau', label: 'Niveau', icon: BookOpen, description: 'Ton niveau d\'études actuel' },
  { id: 'competences', label: 'Compétences', icon: Code2, description: 'Tes savoir-faire techniques et pratiques' },
  { id: 'localisation', label: 'Localisation', icon: MapPin, description: 'Ta ville de résidence' },
  { id: 'interets', label: 'Objectifs', icon: Heart, description: 'Types d\'opportunités recherchées' },
  { id: 'resume', label: 'Validation', icon: CheckCircle2, description: 'Récapitulatif de ton profil' },
]

// ── Form state (zéro présélection par défaut) ─────────────────

interface FormData {
  prenom: string
  nom: string
  filiere: string
  niveau: string
  competences: string[]
  localisation: string
  interets: string[]
}

const INITIAL_FORM: FormData = {
  prenom: '',
  nom: '',
  filiere: '',
  niveau: '',
  competences: [],
  localisation: '',
  interets: [],
}

export default function ProfilPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  // Charger le profil existant si l'étudiant revient sur la page
  useEffect(() => {
    const existing = loadProfile()
    if (existing) {
      setForm({
        prenom: existing.prenom || '',
        nom: existing.nom || '',
        filiere: existing.filiere || '',
        niveau: existing.niveau || '',
        competences: existing.competences || [],
        localisation: existing.localisation || '',
        interets: existing.interets || [],
      })
    }
  }, [])

  // Filtres filières
  const [searchFiliere, setSearchFiliere] = useState('')
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all')

  // Filtres compétences
  const [searchSkill, setSearchSkill] = useState('')
  const [skillTab, setSkillTab] = useState<'recommended' | 'transversal' | 'all'>('recommended')

  const totalSteps = STEPS.length
  const progressPercent = (currentStep / (totalSteps - 1)) * 100

  // ── Compétences recommandées selon la filière choisie ─────────
  const { recommended: recommendedSkills, domainName } = useMemo(() => {
    return getSkillsForFiliere(form.filiere)
  }, [form.filiere])

  // ── Filières filtrées ─────────────────────────────────────────
  const filteredFilieres = useMemo(() => {
    let list = ALL_FILIERES

    if (selectedDomainId !== 'all') {
      const domain = DOMAINS.find((d) => d.id === selectedDomainId)
      if (domain) {
        list = domain.filieres
      }
    }

    if (searchFiliere.trim()) {
      const query = searchFiliere.toLowerCase().trim()
      list = list.filter((f) => f.toLowerCase().includes(query))
    }

    return list
  }, [searchFiliere, selectedDomainId])

  // ── Compétences affichées selon l'onglet actif ────────────────
  const displayedSkills = useMemo(() => {
    let list: string[] = []

    if (skillTab === 'recommended') {
      list = recommendedSkills
    } else if (skillTab === 'transversal') {
      list = TRANSVERSAL_SKILLS
    } else {
      list = ALL_SKILLS
    }

    if (searchSkill.trim()) {
      const q = searchSkill.toLowerCase().trim()
      // Chercher dans l'ensemble des compétences si recherche active
      list = ALL_SKILLS.filter((s) => s.toLowerCase().includes(q))
    }

    return list
  }, [skillTab, recommendedSkills, searchSkill])

  function canGoNext(): boolean {
    if (currentStep === 0) return form.prenom.trim().length > 0
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

  function addCustomSkill(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!form.competences.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        competences: [...prev.competences, trimmed],
      }))
    }
    setSearchSkill('')
  }

  function removeSkill(name: string) {
    setForm((prev) => ({
      ...prev,
      competences: prev.competences.filter((c) => c !== name),
    }))
  }

  function selectFiliere(filiereName: string) {
    setForm((prev) => {
      // Si la filière change, on garde les compétences actuelles mais on bascule vers l'onglet recommandé
      return { ...prev, filiere: filiereName }
    })
    setSkillTab('recommended')
  }

  function handleSave() {
    setSaving(true)
    const profile: UserProfile = {
      id: generateUserId(),
      prenom: form.prenom.trim() || 'Étudiant',
      nom: form.nom.trim(),
      filiere: form.filiere,
      niveau: form.niveau,
      competences: form.competences,
      localisation: form.localisation,
      interets: form.interets,
      types_opportunites: form.interets,
      createdAt: new Date().toISOString(),
    }
    saveProfile(profile)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center pt-20 px-4 pb-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-slate-900 dark:text-white text-base leading-none">Opportunia</span>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Campus &amp; Avenir</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Crée ton profil étudiant</h1>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            Personnalise ton orientation et reçois les opportunités adaptées à ton parcours.
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
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : isActive
                        ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[11px] hidden sm:block transition-colors ${
                      isActive ? 'text-blue-700 dark:text-blue-400 font-bold' : isDone ? 'text-slate-800 dark:text-slate-300 font-semibold' : 'text-slate-500 dark:text-slate-500 font-medium'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="glass-card p-6 sm:p-8 border-gradient">
          <div className="mb-6">
            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
              Étape {currentStep + 1} / {totalSteps}
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{STEPS[currentStep].label}</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 font-medium">{STEPS[currentStep].description}</p>
          </div>

          {/* ── Step 0: Identité ── */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                    placeholder="Ex: Éric"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm font-semibold shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1.5">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Koffi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm font-semibold shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Filière ── */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Barre de recherche de filière */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFiliere}
                  onChange={(e) => setSearchFiliere(e.target.value)}
                  placeholder="Rechercher ta filière (ex: Biologie, Agronomie, Droit, Informatique...)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm font-semibold shadow-xs"
                />
                {searchFiliere && (
                  <button
                    onClick={() => setSearchFiliere('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtres par grand domaine */}
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Filtrer par domaine :
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                  <button
                    onClick={() => setSelectedDomainId('all')}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedDomainId === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Tous les domaines
                  </button>
                  {DOMAINS.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomainId(domain.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedDomainId === domain.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {domain.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grille des filières */}
              <div>
                <p className="text-slate-900 dark:text-slate-200 text-xs mb-2 font-bold flex items-center justify-between">
                  <span>Sélectionne ta filière :</span>
                  {form.filiere && (
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                      Choisie : {form.filiere}
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredFilieres.map((f) => (
                    <button
                      key={f}
                      onClick={() => selectFiliere(f)}
                      className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                        form.filiere === f
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-700 font-bold dark:bg-blue-600/30 dark:border-blue-400 dark:text-blue-100 shadow-sm'
                          : 'bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-slate-500'
                      }`}
                    >
                      <span className="truncate">{f}</span>
                      {form.filiere === f && <Check className="w-3.5 h-3.5 flex-shrink-0 text-blue-600 dark:text-blue-300" />}
                    </button>
                  ))}
                </div>

                {/* Option filière personnalisée si non trouvée */}
                {searchFiliere.trim() && !filteredFilieres.some(f => f.toLowerCase() === searchFiliere.trim().toLowerCase()) && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-2">
                    <span className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                      Ta filière n&apos;est pas listée ?
                    </span>
                    <button
                      onClick={() => selectFiliere(searchFiliere.trim())}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all"
                    >
                      Utiliser &quot;{searchFiliere.trim()}&quot;
                    </button>
                  </div>
                )}
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
                  className={`p-4 rounded-xl text-sm font-bold border text-center transition-all cursor-pointer ${
                    form.niveau === n
                      ? 'bg-blue-600 border-2 border-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 3: Compétences adaptatives ── */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Compétences déjà sélectionnées */}
              {form.competences.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-600" />
                      Tes compétences sélectionnées ({form.competences.length}) :
                    </span>
                    <button
                      onClick={() => setForm({ ...form, competences: [] })}
                      className="text-[11px] text-red-500 hover:underline font-semibold"
                    >
                      Tout effacer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {form.competences.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs"
                      >
                        {c}
                        <button
                          onClick={() => removeSkill(c)}
                          className="hover:bg-blue-700 rounded p-0.5 transition-colors cursor-pointer"
                          title="Retirer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Champ de recherche / ajout de compétence personnalisée */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addCustomSkill(searchSkill)
                      }
                    }}
                    placeholder={`Rechercher une compétence pour ${form.filiere || 'ta filière'}...`}
                    className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 text-sm font-semibold shadow-xs"
                  />
                  {searchSkill.trim() && (
                    <button
                      onClick={() => addCustomSkill(searchSkill)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter
                    </button>
                  )}
                </div>

                {/* Onglets de navigation entre types de compétences */}
                {!searchSkill.trim() && (
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                    <button
                      onClick={() => setSkillTab('recommended')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        skillTab === 'recommended'
                          ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate">Pour {form.filiere || 'ta filière'}</span>
                    </button>

                    <button
                      onClick={() => setSkillTab('transversal')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        skillTab === 'transversal'
                          ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>Transversales</span>
                    </button>

                    <button
                      onClick={() => setSkillTab('all')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        skillTab === 'all'
                          ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      <span>Toutes</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bannière de contexte filière */}
              {skillTab === 'recommended' && !searchSkill.trim() && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 text-xs font-semibold text-blue-800 dark:text-blue-200">
                  <Sparkles className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    Compétences clés suggérées pour <strong>{form.filiere}</strong> ({domainName}) :
                  </span>
                </div>
              )}

              {/* Grille des compétences à cocher */}
              <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto pr-1">
                {displayedSkills.map((s) => {
                  const selected = form.competences.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, competences: toggleItem(form.competences, s) })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs scale-[1.02]'
                          : 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                      <span>{s}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 font-medium">
                <span>Sélectionne au moins une compétence pour continuer</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {form.competences.length} sélectionnée(s)
                </span>
              </div>
            </div>
          )}

          {/* ── Step 4: Localisation ── */}
          {currentStep === 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {LOCALISATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setForm({ ...form, localisation: loc })}
                  className={`p-4 rounded-xl text-sm font-bold border text-center transition-all cursor-pointer ${
                    form.localisation === loc
                      ? 'bg-blue-600 border-2 border-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}

          {/* ── Step 5: Objectifs / Intérêts ── */}
          {currentStep === 5 && (
            <div>
              <p className="text-slate-900 dark:text-slate-200 text-xs mb-3 font-bold">
                Quels types d&apos;opportunités t&apos;intéressent ? (sélection multiple)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INTERETS.map((item) => {
                  const selected = form.interets.includes(item)
                  return (
                    <button
                      key={item}
                      onClick={() => setForm({ ...form, interets: toggleItem(form.interets, item) })}
                      className={`p-4 rounded-xl text-sm font-bold border text-center transition-all cursor-pointer ${
                        selected
                          ? 'bg-blue-600 border-2 border-blue-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Step 6: Récapitulatif ── */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Étudiant :</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {form.prenom} {form.nom}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Filière &amp; Niveau :</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {form.filiere} · {form.niveau}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">Ville :</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{form.localisation}</span>
                </div>
                <div className="pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">Types recherchés :</span>
                  <div className="flex flex-wrap gap-1">
                    {form.interets.map((i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-300 font-bold"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5 font-bold">
                    Compétences ({form.competences.length}) :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {form.competences.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700/50 font-bold"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Ton profil est prêt ! Opportunia va calculer tes correspondances immédiatement.
                </span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200 dark:border-white/10">
            {currentStep > 0 ? (
              <button
                onClick={goPrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
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
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  canGoNext()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
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
