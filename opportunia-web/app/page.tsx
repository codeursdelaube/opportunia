import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Briefcase,
  BookOpen,
  Trophy,
  GraduationCap,
  Rocket,
  Users,
  Star,
  ChevronRight,
  CheckCircle2,
  Search,
  MapPin,
  Zap,
  TrendingUp,
  Shield,
  MessageCircle,
} from 'lucide-react'
import { ALL_OPPORTUNITIES as opportunities } from '@/lib/opportunities'
import { HomeCtaButton } from '@/components/home/HomeCtaButton'

// ── CANAL WHATSAPP DES ALERTES ────────────────────────────────
// Vous pouvez remplacer ce lien par l'URL exacte de votre chaîne WhatsApp
export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb3opportunia'

// ── Statistiques réelles calculées dynamiquement ─────────────
const countStages = opportunities.filter((o) => o.type.toLowerCase() === 'stage').length
const countBourses = opportunities.filter((o) => o.type.toLowerCase() === 'bourse').length
const countConcours = opportunities.filter((o) => o.type.toLowerCase() === 'concours').length
const countFormations = opportunities.filter((o) => o.type.toLowerCase() === 'formation').length
const countEmplois = opportunities.filter((o) => ['emploi', 'job'].includes(o.type.toLowerCase())).length
const totalCount = opportunities.length

const CATEGORIES = [
  {
    icon: Briefcase,
    label: 'Stages',
    count: `${countStages}`,
    color: '#3563E9',
    bg: '#EEF2FF',
    desc: 'Stages actifs vérifiés',
    href: '/opportunites?type=stage',
  },
  {
    icon: GraduationCap,
    label: 'Bourses',
    count: `${countBourses}`,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    desc: 'Mobilité & financements',
    href: '/opportunites?type=bourse',
  },
  {
    icon: BookOpen,
    label: 'Formations',
    count: `${countFormations}`,
    color: '#06B6D4',
    bg: '#ECFEFF',
    desc: 'Certifications & ateliers',
    href: '/opportunites?type=formation',
  },
  {
    icon: Trophy,
    label: 'Concours',
    count: `${countConcours}`,
    color: '#F97316',
    bg: '#FFF7ED',
    desc: 'Hackathons & challenges',
    href: '/opportunites?type=concours',
  },
  {
    icon: Users,
    label: 'Emplois',
    count: `${countEmplois}`,
    color: '#10B981',
    bg: '#ECFDF5',
    desc: 'Premiers emplois & jobs',
    href: '/opportunites?type=job',
  },
  {
    icon: Rocket,
    label: 'Toutes',
    count: `${totalCount}`,
    color: '#EC4899',
    bg: '#FDF2F8',
    desc: 'Catalogue complet vérifié',
    href: '/opportunites',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: GraduationCap,
    color: '#3563E9',
    bg: '#EEF2FF',
    title: 'Créez votre profil',
    desc: 'Renseignez votre filière, niveau, compétences et ville en quelques minutes.',
  },
  {
    step: '02',
    icon: Zap,
    color: '#F59E0B',
    bg: '#FFFBEB',
    title: 'Matching automatique',
    desc: 'L\'algorithme compare votre profil à chaque opportunité selon 5 axes clés.',
  },
  {
    step: '03',
    icon: TrendingUp,
    color: '#10B981',
    bg: '#ECFDF5',
    title: 'Découvrez vos matches',
    desc: 'Recevez un score de compatibilité détaillé et des recommandations personnalisées.',
  },
  {
    step: '04',
    icon: CheckCircle2,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    title: 'Postulez & suivez',
    desc: 'Accédez aux offres et postulez en un clic depuis la plateforme d\'origine.',
  },
]

const MATCHING_DIMENSIONS = [
  { label: 'Filière', desc: 'Proximité entre votre domaine d\'études et celui requis', weight: '30%', color: '#3563E9' },
  { label: 'Niveau', desc: 'Adéquation entre votre niveau et le niveau minimum requis', weight: '20%', color: '#8B5CF6' },
  { label: 'Compétences', desc: 'Couverture des compétences requises par votre profil', weight: '30%', color: '#10B981' },
  { label: 'Localisation', desc: 'Compatibilité géographique avec préférence remote', weight: '10%', color: '#F97316' },
  { label: 'Intérêts', desc: 'Correspondance entre le type d\'offre et vos intérêts', weight: '10%', color: '#06B6D4' },
]

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  stage:      { bg: '#EEF2FF', text: '#3563E9', border: '#C7D5F8' },
  bourse:     { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  concours:   { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  emploi:     { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  formation:  { bg: '#ECFEFF', text: '#0E7490', border: '#A5F3FC' },
}

export default function LandingPage() {
  const popularOpps = opportunities.slice(0, 3)

  return (
    <div className="flex flex-col" style={{ background: 'var(--opp-bg)', color: 'var(--opp-text)' }}>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-20 pb-10 lg:pb-0"
        style={{ background: 'var(--opp-surface)' }}
      >
        {/* Tinted background on right */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 hidden lg:block"
          style={{ background: 'var(--opp-bg)' }}
          aria-hidden
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-80px)] py-12 lg:py-20">

            {/* Left — Copy */}
            <div className="flex flex-col gap-6 sm:gap-7 max-w-xl">
              {/* Label pill */}
              <div
                className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'var(--opp-primary-light)',
                  color: '#3563E9',
                  border: '1px solid rgba(53,99,233,0.25)',
                }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Togo &amp; Afrique de l&apos;Ouest · 100% Gratuit
              </div>

              {/* Main headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight"
                style={{ color: 'var(--opp-heading)', fontFamily: 'var(--font-display)' }}
              >
                Trouve{' '}
                <span style={{ color: '#3563E9' }}>l&apos;Opportunité</span>
                <br />
                faite{' '}
                <span style={{ color: '#3563E9' }}>pour toi</span>
                <br />
                Facilement.
              </h1>

              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--opp-text-muted)' }}>
                Opportunia analyse ton parcours universitaire et te connecte aux meilleurs
                stages, emplois, bourses et concours — avec un score de compatibilité transparent.
              </p>

              {/* Search bar */}
              <div
                className="flex items-center gap-2 rounded-xl p-2 shadow-sm"
                style={{
                  background: 'var(--opp-bg)',
                  border: '1.5px solid var(--opp-border)',
                }}
              >
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--opp-text-muted)' }} />
                  <input
                    type="text"
                    readOnly
                    placeholder="Filière, compétence, type..."
                    className="flex-1 text-sm outline-none bg-transparent"
                    style={{ color: 'var(--opp-heading)', caretColor: '#3563E9' }}
                  />
                </div>
                <div
                  className="hidden sm:flex items-center gap-2 px-3"
                  style={{ borderLeft: '1px solid var(--opp-border)' }}
                >
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--opp-text-muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--opp-text-muted)' }}>Lomé, Togo</span>
                </div>
                <HomeCtaButton compact />
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sources fiables vérifiées
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--opp-primary-light)', color: '#3563E9', border: '1px solid rgba(53,99,233,0.25)' }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Campus Lomé, Kara &amp; sous-région
                </div>
              </div>
            </div>

            {/* Right — Jobify Visual */}
            <div className="relative flex items-center justify-center">
              {/* Blue accent circle behind person */}
              <div
                className="w-72 sm:w-96 lg:w-[440px] h-72 sm:h-96 lg:h-[440px] rounded-full flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #3563E9 0%, #1D4ED8 100%)',
                  boxShadow: '0 20px 60px rgba(53,99,233,0.3)',
                }}
              >
                {/* Secondary inner ring decoration */}
                <div
                  className="absolute inset-4 rounded-full border-2 border-white/20 pointer-events-none"
                />

                {/* Student Photo */}
                <div className="relative w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full overflow-hidden">
                  <Image
                    src="/media_1789661491971.jpg"
                    alt="Étudiante Opportunia"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                </div>
              </div>

              {/* Floating Match Card (Top-Left) */}
              <div
                className="absolute -top-4 -left-4 sm:top-6 sm:-left-6 p-4 rounded-2xl shadow-xl z-20 transition-all hover:scale-105"
                style={{
                  background: 'var(--opp-surface)',
                  border: '1.5px solid var(--opp-border)',
                  boxShadow: 'var(--card-shadow)',
                  minWidth: '200px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                    style={{ background: '#10B981' }}
                  >
                    94%
                  </div>
                  <div>
                    <div className="text-[11px] font-bold" style={{ color: '#10B981' }}>Match Idéal</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--opp-heading)' }}>Stage · Lomé</div>
                  </div>
                </div>
                <div className="mt-2 text-xs font-semibold" style={{ color: 'var(--opp-heading)' }}>
                  Développeur React / Next.js
                </div>
                <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--opp-border)' }}>
                  <div className="h-full rounded-full" style={{ width: '94%', background: '#10B981' }} />
                </div>
              </div>

              {/* Floating Stats Card (Bottom-Right) - Real platform highlights */}
              <div
                className="absolute -bottom-4 -right-4 sm:bottom-4 sm:-right-4 p-4 rounded-2xl shadow-xl z-20 transition-all hover:scale-105"
                style={{
                  background: 'var(--opp-surface)',
                  border: '1.5px solid var(--opp-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white"
                    style={{ background: '#3563E9' }}
                  >
                    100%
                  </div>
                  <div>
                    <div className="text-sm font-black" style={{ color: 'var(--opp-heading)' }}>Matching Transparent</div>
                    <p className="text-[10px]" style={{ color: 'var(--opp-text-muted)' }}>Score déterministe sur 100</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: '#10B981' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>5 critères d&apos;analyse objectifs</span>
                </div>
              </div>

              {/* Floating Opportunity Pill (Bottom-Left) */}
              <div
                className="absolute bottom-8 -left-6 sm:bottom-12 sm:-left-10 px-3.5 py-2 rounded-xl shadow-lg z-20 hidden sm:flex items-center gap-2"
                style={{
                  background: 'var(--opp-surface)',
                  border: '1.5px solid var(--opp-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold" style={{ color: 'var(--opp-heading)' }}>
                  {totalCount} opportunités vérifiées
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--opp-bg)' }} id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#3563E9' }}>
                Parcourir par catégorie
              </p>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--opp-heading)' }}>
                Des opportunités pour{' '}
                <span style={{ color: '#3563E9' }}>chaque profil</span>
              </h2>
            </div>
            <Link
              href="/opportunites"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: '#3563E9' }}
            >
              Toutes les offres <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ icon: Icon, label, count, color, bg, desc, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all hover:-translate-y-1 cursor-pointer"
                style={{
                  background: 'var(--opp-surface)',
                  border: '1.5px solid var(--opp-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--opp-heading)' }}>{label}</div>
                  <div className="font-black text-lg" style={{ color }}>{count}</div>
                  <div className="text-[11px] leading-tight hidden sm:block" style={{ color: 'var(--opp-text-muted)' }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--opp-surface)' }} id="comment-ca-marche">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#3563E9' }}>
              Comment ça marche
            </p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--opp-heading)' }}>
              De votre profil à votre{' '}
              <span style={{ color: '#3563E9' }}>opportunité</span>
            </h2>
            <p className="text-base mt-4 max-w-lg mx-auto" style={{ color: 'var(--opp-text-muted)' }}>
              En 4 étapes simples, notre moteur de matching trouve les offres qui vous correspondent réellement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon, color, bg }, i) => (
              <div
                key={step}
                className="relative p-6 rounded-2xl transition-all hover:-translate-y-1"
                style={{
                  background: 'var(--opp-bg)',
                  border: '1.5px solid var(--opp-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                {/* Step connector */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-10 left-full w-6 h-0.5 z-10"
                    style={{ background: 'var(--opp-border)' }}
                  />
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <span
                    className="text-xl font-black"
                    style={{ color: 'var(--opp-text-muted)', fontFamily: 'var(--font-display)', opacity: 0.5 }}
                  >
                    {step}
                  </span>
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--opp-heading)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--opp-text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATCHING EXPLAINER ─────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--opp-bg)' }} id="matching">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#3563E9' }}>
                Le matching intelligent
              </p>
              <h2 className="text-3xl sm:text-4xl font-black mb-5" style={{ color: 'var(--opp-heading)' }}>
                Un score transparent,{' '}
                <span style={{ color: '#3563E9' }}>pas une boîte noire</span>
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: 'var(--opp-text-muted)' }}>
                Notre moteur calcule un score de compatibilité sur 100 points en analysant
                5 dimensions de votre profil. Chaque score est accompagné d&apos;explications claires.
              </p>

              <div className="flex flex-col gap-3">
                {MATCHING_DIMENSIONS.map(({ label, desc, weight, color }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: 'var(--opp-surface)', border: '1px solid var(--opp-border)' }}
                  >
                    <div
                      className="flex-shrink-0 w-12 h-8 flex items-center justify-center rounded-lg text-xs font-black text-white"
                      style={{ background: color }}
                    >
                      {weight}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--opp-heading)' }}>{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--opp-text-muted)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score card mockup */}
            <div
              className="p-8 rounded-2xl"
              style={{ background: 'var(--opp-surface)', border: '1.5px solid var(--opp-border)', boxShadow: 'var(--card-shadow)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--opp-heading)' }}>Développeur React / Next.js</h3>
                  <p className="text-sm" style={{ color: 'var(--opp-text-muted)' }}>Ace3I Africa · Stage · Lomé</p>
                </div>
                <div className="text-4xl font-black" style={{ color: '#10B981' }}>94%</div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'Filière', score: 30, max: 30, color: '#10B981' },
                  { label: 'Niveau', score: 20, max: 20, color: '#10B981' },
                  { label: 'Compétences', score: 23, max: 30, color: '#3563E9' },
                  { label: 'Localisation', score: 10, max: 10, color: '#10B981' },
                  { label: 'Intérêts', score: 10, max: 10, color: '#10B981' },
                ].map(({ label, score, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--opp-text-muted)' }}>
                      <span>{label}</span>
                      <span className="font-semibold">{score}/{max}</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'var(--opp-border)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(score / max) * 100}%`, background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 p-4 rounded-xl"
                style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}
              >
                <div className="flex items-center gap-2 text-sm" style={{ color: '#065F46' }}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Filière correspondante — Informatique</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1.5" style={{ color: '#065F46' }}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3 compétences sur 4 correspondent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR OPPORTUNITIES ─────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--opp-surface)' }} id="opportunites-populaires">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#3563E9' }}>
                Opportunités populaires
              </p>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--opp-heading)' }}>
                Explorez quelques offres
              </h2>
            </div>
            <Link
              href="/opportunites"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: '#3563E9' }}
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularOpps.map((opp) => {
              const typeStyle = TYPE_COLORS[opp.type] ?? { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' }
              return (
                <Link
                  key={opp.id}
                  href={`/opportunites/${opp.id}`}
                  className="group overflow-hidden rounded-2xl transition-all hover:-translate-y-1"
                  style={{
                    background: 'var(--opp-bg)',
                    border: '1.5px solid var(--opp-border)',
                    boxShadow: 'var(--card-shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div className="relative h-44 overflow-hidden flex-shrink-0">
                    <Image
                      src={opp.image}
                      alt={opp.titre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 card-img-overlay" />
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: typeStyle.bg, color: typeStyle.text, border: `1px solid ${typeStyle.border}` }}
                      >
                        {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3
                      className="font-bold leading-snug group-hover:text-blue-600 transition-colors"
                      style={{ color: 'var(--opp-heading)', fontSize: '0.9375rem' }}
                    >
                      {opp.titre}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: 'var(--opp-text-muted)' }}>{opp.entreprise}</p>
                    <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--opp-text-muted)' }}>{opp.description}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--opp-text-muted)' }}>
                        <MapPin className="w-3.5 h-3.5" />
                        {opp.localisation}
                      </div>
                      <span
                        className="flex items-center gap-1 text-xs font-semibold"
                        style={{ color: '#3563E9' }}
                      >
                        Voir l&apos;offre <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: '#3563E9' }}
            >
              Voir toutes les offres <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--opp-bg)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div
            className="relative p-10 sm:p-16 rounded-3xl overflow-hidden text-center"
            style={{ background: '#3563E9' }}
          >
            {/* Background decorations */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
              style={{ background: '#5B83EE', transform: 'translate(30%, -30%)' }}
              aria-hidden
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20"
              style={{ background: '#2850C7', transform: 'translate(-30%, 30%)' }}
              aria-hidden
            />

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
              >
                <Zap className="w-4 h-4" />
                Gratuit &amp; sans inscription requise
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
                Prêt à découvrir vos opportunités ?
              </h2>
              <p className="text-base sm:text-lg text-white/80 mb-10 max-w-xl mx-auto">
                Créez votre profil en 2 minutes et obtenez instantanément vos recommandations personnalisées.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/profil"
                  id="final-cta-create-profile"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
                  style={{ background: '#FFFFFF', color: '#3563E9', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                >
                  Créer mon profil gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/opportunites"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                  }}
                >
                  Explorer sans profil
                </Link>
                <a
                  href={WHATSAPP_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-base transition-all hover:scale-105"
                  style={{
                    background: '#25D366',
                    color: '#0F172A',
                    boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Recevoir les alertes WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHATSAPP ALERTS BANNER (SECTION DÉDIÉE) ─────────────── */}
      <section className="py-14" style={{ background: 'var(--opp-surface)', borderTop: '1px solid var(--opp-border)' }} id="alertes-whatsapp">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className="p-8 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #064E3B 0%, #065F46 55%, #047857 100%)',
              boxShadow: '0 12px 36px rgba(6, 95, 70, 0.25)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -right-10 -top-10 w-44 h-44 rounded-full pointer-events-none opacity-20"
              style={{ background: '#25D366', filter: 'blur(40px)' }}
              aria-hidden
            />

            <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: '#25D366' }}
              >
                <svg className="w-9 h-9 text-slate-950 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.235-.244-.587-.493-.507-.678-.517-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.351z"/>
                  <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.81.487 3.51 1.332 4.978L2 22l5.173-1.306A9.954 9.954 0 0012.004 22C17.525 22 22 17.52 22 12s-4.475-10-9.996-10zm0 18.2c-1.61 0-3.11-.47-4.38-1.28l-.31-.2-3.08.78.82-2.95-.2-.33A8.163 8.163 0 013.8 12c0-4.52 3.68-8.2 8.204-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2z"/>
                </svg>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 bg-emerald-900/60 border border-emerald-500/30 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Canal Officiel WhatsApp
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Ne rate aucune opportunité
                </h3>
                <p className="text-sm text-emerald-100/85 mt-1 max-w-md leading-relaxed">
                  Rejoins notre chaîne WhatsApp pour recevoir les nouvelles alertes de stages, bourses et concours directement sur ton smartphone.
                </p>
              </div>
            </div>

            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-alert-button"
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-lg relative z-10 cursor-pointer"
              style={{ background: '#25D366', color: '#0F172A' }}
            >
              <MessageCircle className="w-5 h-5 text-slate-950" />
              <span>Recevoir les alertes</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--opp-surface)', borderTop: '1px solid var(--opp-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: '#3563E9' }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg leading-none" style={{ color: 'var(--opp-heading)' }}>Opportunia</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: '#F59E0B' }}
                >
                  Togo &amp; Afrique de l&apos;Ouest
                </span>
              </div>
            </div>
            <p className="text-sm text-center" style={{ color: 'var(--opp-text-muted)' }}>
              Plateforme d&apos;orientation &amp; opportunités pour étudiants — Togo &amp; Afrique de l&apos;Ouest
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold" style={{ color: 'var(--opp-text-muted)' }}>
              <Link href="/opportunites" className="hover:text-blue-600 transition-colors">Opportunités</Link>
              <Link href="/profil" className="hover:text-blue-600 transition-colors">Créer mon profil</Link>
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Alertes WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
