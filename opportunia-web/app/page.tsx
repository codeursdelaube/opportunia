import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Briefcase,
  BookOpen,
  Trophy,
  GraduationCap,
  Rocket,
  Code2,
  Zap,
  Target,
  CheckCircle2,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react'
import { ALL_OPPORTUNITIES as opportunities } from '@/lib/opportunities'
import { HomeCtaButton } from '@/components/home/HomeCtaButton'
import type { Opportunity } from '@/types'

const CATEGORIES = [
  { icon: Briefcase, label: 'Stages', count: '120+', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Expériences professionnelles' },
  { icon: Users, label: 'Emplois', count: '80+', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'CDD, CDI & temps partiel' },
  { icon: GraduationCap, label: 'Bourses', count: '45+', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'Financements & mobilité' },
  { icon: Trophy, label: 'Concours', count: '30+', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', desc: 'Hackathons & challenges' },
  { icon: BookOpen, label: 'Formations', count: '60+', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', desc: 'Certifications & MOOCs' },
  { icon: Rocket, label: 'Projets', count: '25+', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20', desc: 'Collaborations & missions' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Créez votre profil',
    desc: 'Renseignez votre filière, niveau, compétences et centres d\'intérêt en quelques minutes.',
    icon: Users,
    color: 'text-blue-400',
  },
  {
    step: '02',
    title: 'Notre moteur analyse',
    desc: 'Notre algorithme compare votre profil à chaque opportunité selon 5 dimensions clés.',
    icon: Target,
    color: 'text-purple-400',
  },
  {
    step: '03',
    title: 'Découvrez vos matches',
    desc: 'Recevez un score de compatibilité détaillé et des recommandations personnalisées.',
    icon: Star,
    color: 'text-emerald-400',
  },
  {
    step: '04',
    title: 'Candidatez directement',
    desc: 'Accédez aux offres et postulez en un clic depuis la plateforme d\'origine.',
    icon: Rocket,
    color: 'text-orange-400',
  },
]

const MATCHING_DIMENSIONS = [
  { label: 'Filière', desc: 'Proximité entre votre domaine d\'études et celui requis', weight: '30%' },
  { label: 'Niveau', desc: 'Adéquation entre votre niveau actuel et le niveau minimum', weight: '20%' },
  { label: 'Compétences', desc: 'Couverture des compétences requises par votre profil', weight: '30%' },
  { label: 'Localisation', desc: 'Compatibilité géographique avec préférence remote', weight: '10%' },
  { label: 'Intérêts', desc: 'Correspondance entre le type d\'offre et vos intérêts', weight: '10%' },
]

// Show first 3 opportunities as "popular"
const popularOpps = opportunities.slice(0, 3)

const TYPE_COLORS: Record<string, string> = {
  stage: 'bg-blue-500/20 text-blue-300',
  bourse: 'bg-purple-500/20 text-purple-300',
  concours: 'bg-orange-500/20 text-orange-300',
  emploi: 'bg-emerald-500/20 text-emerald-300',
  formation: 'bg-cyan-500/20 text-cyan-300',
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero-gradient relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-32 right-10 w-72 h-72 geo-circle opacity-30 blur-xl" aria-hidden />
        <div className="absolute bottom-20 left-0 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl" aria-hidden />
        <div className="absolute top-1/2 left-1/3 w-1 h-64 bg-gradient-to-b from-blue-500/20 to-transparent" aria-hidden />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Left — copy */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Pill label */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm font-medium">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              Matching intelligent pour étudiants
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.08] tracking-tight text-white">
              Ne cherche plus une opportunité.{' '}
              <br />
              <span className="gradient-text">Trouve celle qui te correspond.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              Opportunia analyse ton profil et te recommande les stages, emplois, formations,
              concours et bourses adaptés à ton parcours. Il te montre ce qui te manque et
              t&apos;accompagne jusqu&apos;à la candidature.
            </p>

            {/* CTAs */}
            <HomeCtaButton />

            {/* Social proof */}
            <div className="flex items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
              <div className="flex -space-x-2">
                {['🧑🏾‍💻', '👩🏽‍🎓', '👨🏿‍💼', '👩🏾‍🔬'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[#0a0f1e] bg-slate-700 flex items-center justify-center text-sm sm:text-base"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-white font-semibold text-xs sm:text-sm">+2 000 étudiants</div>
                <div className="text-slate-500 text-[11px] sm:text-xs">ont déjà trouvé leur opportunité</div>
              </div>
            </div>
          </div>

          {/* Right — Hero image with floating cards overlays */}
          <div className="relative flex items-center justify-center w-full max-w-lg mx-auto lg:max-w-none mt-6 lg:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-md h-[460px] sm:h-[530px] flex items-center justify-center">
              {/* Student image behind the cards */}
              <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0">
                <div className="relative w-[270px] sm:w-[330px] h-[390px] sm:h-[470px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/10 light:border-slate-300">
                  <Image
                    src="/heroimg.jpg"
                    alt="Étudiante Opportunia"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 270px, 330px"
                  />
                  {/* Vignette blend gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/90 via-transparent to-transparent dark:from-[#0a0f1e]/90 light:from-white/70" />
                </div>
              </div>

              {/* Foreground Floating Cards (z-10) */}
              <div className="relative z-10 w-full max-w-[270px] sm:max-w-[310px] mt-16 sm:mt-20">
                {/* Main card */}
                <div className="glass-card p-5 sm:p-6 border-gradient shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="chip border bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">Stage</span>
                    <span className="text-emerald-400 font-bold text-lg sm:text-xl">94%</span>
                  </div>
                  <h3 className="font-semibold text-white dark:text-white light:text-slate-900 text-sm sm:text-base mb-1">
                    Développeur React / Next.js
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Ace3I Africa · Lomé</p>
                  <div className="w-full h-1.5 bg-white/10 dark:bg-white/10 light:bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '94%' }} />
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-2">Compatible avec votre profil</p>
                </div>

                {/* Floating match checklist card */}
                <div className="absolute -top-10 -right-2 sm:-top-8 sm:-right-8 glass-card p-3 sm:p-4 w-40 sm:w-48 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">Filière ✓</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">Niveau ✓</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">3/4 compétences ✓</span>
                  </div>
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-8 -left-2 sm:-bottom-8 sm:-left-8 glass-card p-3 sm:p-4 w-36 sm:w-44 shadow-2xl backdrop-blur-xl">
                  <div className="text-xl sm:text-2xl font-black text-white dark:text-white light:text-slate-900 mb-0.5">14</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-tight">
                    opportunités trouvées pour vous
                  </div>
                </div>

                {/* Code icon badge */}
                <div className="absolute top-1/2 -right-3 sm:-right-6 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg backdrop-blur-md">
                  <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
          <div className="w-5 h-8 border border-slate-700 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-slate-600 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="py-24 section-dark" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Toutes les catégories
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Une plateforme, toutes vos opportunités
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Des centaines d&apos;opportunités agrégées depuis les meilleures sources, classées selon votre profil.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ icon: Icon, label, count, color, bg, desc }) => (
              <Link
                key={label}
                href={`/opportunites?type=${label.toLowerCase()}`}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all hover:-translate-y-1 hover:shadow-lg glass-card ${bg}`}
              >
                <div className={`p-3 rounded-xl bg-current/10 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{label}</div>
                  <div className={`font-bold text-lg ${color}`}>{count}</div>
                  <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-24" id="comment-ca-marche">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
              Comment ça marche
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              De votre profil à votre opportunité
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              En 4 étapes simples, notre moteur de matching trouve les offres qui vous correspondent réellement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon, color }, i) => (
              <div key={step} className="relative glass-card p-6">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-white/10 to-transparent z-10" />
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl bg-current/10 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-bold">{step}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATCHING EXPLAINER ────────────────────────────────── */}
      <section className="py-24 section-dark" id="matching">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
                Le matching intelligent
              </p>
              <h2 className="text-4xl font-bold text-white mb-6">
                Un score expliqué,
                <br />
                <span className="gradient-text-blue">pas une boîte noire</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Notre moteur calcule un score de compatibilité sur 100 points en analysant
                5 dimensions de votre profil. Chaque score est accompagné d&apos;explications
                claires pour comprendre pourquoi une offre vous est recommandée.
              </p>

              <div className="flex flex-col gap-3">
                {MATCHING_DIMENSIONS.map(({ label, desc, weight }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/8">
                    <div className="flex-shrink-0 w-12 h-8 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold">
                      {weight}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score card mockup */}
            <div className="glass-card p-8 border-gradient">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-white">Développeur React / Next.js</h3>
                  <p className="text-slate-400 text-sm">Ace3I Africa · Stage · Lomé</p>
                </div>
                <div className="text-4xl font-black text-emerald-400">94%</div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'Filière', score: 30, max: 30, color: 'bg-emerald-400' },
                  { label: 'Niveau', score: 20, max: 20, color: 'bg-emerald-400' },
                  { label: 'Compétences', score: 23, max: 30, color: 'bg-blue-400' },
                  { label: 'Localisation', score: 10, max: 10, color: 'bg-emerald-400' },
                  { label: 'Intérêts', score: 10, max: 10, color: 'bg-emerald-400' },
                ].map(({ label, score, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>{label}</span>
                      <span className="font-medium">{score}/{max}</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${(score / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-300 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Filière correspondante — Informatique</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 text-sm mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3 compétences sur 4 correspondent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR OPPORTUNITIES ─────────────────────────────── */}
      <section className="py-24" id="opportunites-populaires">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">
                Opportunités populaires
              </p>
              <h2 className="text-4xl font-bold text-white">
                Explorez quelques offres
              </h2>
            </div>
            <Link
              href="/opportunites"
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Voir toutes les offres
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularOpps.map((opp) => (
              <Link
                key={opp.id}
                href={`/opportunites/${opp.id}`}
                className="glass-card overflow-hidden group flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={opp.image}
                    alt={opp.titre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 card-img-overlay" />
                  <div className="absolute top-3 left-3">
                    <span className={`chip border ${TYPE_COLORS[opp.type] ?? 'bg-slate-500/20 text-slate-300'}`}>
                      {opp.type.charAt(0).toUpperCase() + opp.type.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors">
                    {opp.titre}
                  </h3>
                  <p className="text-sm text-slate-400">{opp.entreprise}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{opp.description}</p>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{opp.localisation}</span>
                    <span className="flex items-center gap-1 text-blue-400 text-xs font-medium">
                      Voir l&apos;offre <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Voir toutes les offres <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-24 section-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="glass-card border-gradient p-12 sm:p-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-300 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Gratuit &amp; sans inscription
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Prêt à découvrir{' '}
              <span className="gradient-text">vos opportunités ?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Créez votre profil en 2 minutes et obtenez instantanément vos recommandations personnalisées.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/profil"
                id="final-cta-create-profile"
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Créer mon profil gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/opportunites"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-base transition-all hover:bg-white/5"
              >
                Explorer sans profil
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="font-bold text-white">Opportunia</span>
            </div>
            <p className="text-slate-600 text-sm text-center">
              Prototype POC — Les opportunités existent. Trouvez celles qui vous correspondent.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="/opportunites" className="hover:text-slate-300 transition-colors">Opportunités</Link>
              <Link href="/profil" className="hover:text-slate-300 transition-colors">Profil</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
