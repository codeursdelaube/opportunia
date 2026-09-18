'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, LayoutDashboard, Briefcase, BookmarkCheck, User, Menu, X, Send } from 'lucide-react'
import { loadProfile } from '@/lib/storage'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled || !isLanding ? 'shadow-sm' : ''
      }`}
      style={{
        background: 'var(--opp-surface)',
        borderBottom: scrolled || !isLanding ? '1px solid var(--opp-border)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm transition-all group-hover:shadow-md"
            style={{ background: '#3563E9' }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight leading-none" style={{ color: 'var(--opp-heading)' }}>
              Opportunia
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5" style={{ color: '#F59E0B' }}>
              Campus &amp; Avenir
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {hasProfile && NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive ? 'var(--opp-primary-light)' : 'transparent',
                  color: isActive ? '#3563E9' : 'var(--opp-text-muted)',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right CTA + Theme */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {hasProfile ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: '#3563E9', boxShadow: '0 2px 10px rgba(53,99,233,0.25)' }}
            >
              <User className="w-4 h-4" />
              Mon espace
            </Link>
          ) : (
            <>
              <Link
                href="/opportunites"
                className="px-4 py-2 text-sm font-semibold transition-colors hover:text-blue-600"
                style={{ color: 'var(--opp-text-muted)' }}
              >
                Explorer
              </Link>
              <Link
                href="/profil"
                className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: '#3563E9',
                  boxShadow: '0 3px 12px rgba(53,99,233,0.3)',
                }}
              >
                Trouver mes opportunités
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg transition-colors"
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
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-2"
          style={{
            background: 'var(--opp-surface)',
            borderTop: '1px solid var(--opp-border)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}
        >
          {hasProfile && NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? 'var(--opp-primary-light)' : 'transparent',
                  color: isActive ? '#3563E9' : 'var(--opp-text-muted)',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
          <div className="pt-2" style={{ borderTop: '1px solid var(--opp-border)' }}>
            {hasProfile ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#3563E9' }}
              >
                <User className="w-4 h-4" />
                Mon profil
              </Link>
            ) : (
              <Link
                href="/profil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#3563E9' }}
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
