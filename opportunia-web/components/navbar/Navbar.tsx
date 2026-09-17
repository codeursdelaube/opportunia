'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, LayoutDashboard, Briefcase, BookmarkCheck, User, Menu, X, Send, Compass } from 'lucide-react'
import { loadProfile } from '@/lib/storage'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/career-path', label: 'Career Path', icon: Compass },
  { href: '/candidatures', label: 'Candidatures', icon: Send },
  { href: '/opportunites', label: 'Opportunités', icon: Briefcase },
  { href: '/sauvegardees', label: 'Sauvegardées', icon: BookmarkCheck },
]

export function Navbar() {
  const pathname = usePathname()
  const [hasProfile, setHasProfile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setHasProfile(!!loadProfile())
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const isLanding = pathname === '/'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || !isLanding ? 'navbar-blur shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-shadow">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--opp-heading)' }}>
            Opportunia
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {hasProfile && NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
              style={pathname !== href ? { color: 'var(--opp-text-muted)' } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* CTA & ThemeToggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {hasProfile ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              Mon profil
            </Link>
          ) : (
            <>
              <Link
                href="/opportunites"
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: 'var(--opp-text-muted)' }}
              >
                Explorer
              </Link>
              <Link
                href="/profil"
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Créer mon profil
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger & Theme */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: 'var(--opp-text-muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 backdrop-blur-xl px-4 py-4 flex flex-col gap-2" style={{ background: 'var(--color-mobile-menu-bg)' }}>
          {hasProfile && NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === href
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'hover:bg-white/5'
              }`}
              style={pathname !== href ? { color: 'var(--opp-text-muted)' } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            {hasProfile ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold"
              >
                <User className="w-4 h-4" />
                Mon profil
              </Link>
            ) : (
              <Link
                href="/profil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-blue-500 text-white text-sm font-semibold"
              >
                Créer mon profil
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
