'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const current = document.documentElement.getAttribute('data-theme')
    if (current === 'light') {
      setTheme('light')
    } else {
      const saved = localStorage.getItem('opp_theme') as 'dark' | 'light' | null
      if (saved) {
        setTheme(saved)
        document.documentElement.setAttribute('data-theme', saved)
        document.documentElement.classList.toggle('light', saved === 'light')
      }
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    document.documentElement.classList.toggle('light', next === 'light')
    localStorage.setItem('opp_theme', next)
  }

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-slate-400">
        <Sun className="w-4 h-4 opacity-50" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl border border-white/10 dark:border-white/10 light:border-slate-300 flex items-center justify-center text-slate-400 hover:text-white dark:hover:text-white hover:bg-white/5 transition-all cursor-pointer"
      aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-blue-600 hover:-rotate-12 transition-transform" />
      )}
    </button>
  )
}
