'use client'

import { useState, useMemo } from 'react'
import { X, Copy, Check, Sparkles, Mail, FileText, Send, BookmarkCheck } from 'lucide-react'
import type { Opportunity, UserProfile } from '@/types'
import { generateApplication } from '@/lib/applicationGenerator'
import { trackApplication } from '@/lib/storage'

interface ApplicationPreparationModalProps {
  opportunity: Opportunity
  profile: UserProfile | null
  isOpen: boolean
  onClose: () => void
  onPrepared?: () => void
}

export function ApplicationPreparationModal({
  opportunity,
  profile,
  isOpen,
  onClose,
  onPrepared,
}: ApplicationPreparationModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'letter'>('email')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [markedAsPrepared, setMarkedAsPrepared] = useState(false)

  const fallbackProfile: UserProfile = useMemo(() => {
    if (profile) return profile
    return {
      id: 'demo-user',
      prenom: 'John',
      nom: 'Doe',
      filiere: '',
      niveau: '',
      competences: [''],
      localisation: 'Lomé',
      interets: ['Stage'],
      createdAt: new Date().toISOString(),
    }
  }, [profile])

  const docs = useMemo(() => {
    return generateApplication(fallbackProfile, opportunity)
  }, [fallbackProfile, opportunity])

  if (!isOpen) return null

  function handleCopy(text: string, fieldName: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  function handleSavePrepared() {
    trackApplication(opportunity.id, 'prepared')
    setMarkedAsPrepared(true)
    if (onPrepared) onPrepared()
    setTimeout(() => {
      setMarkedAsPrepared(false)
    }, 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f172a] border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-400">
                Assistant Candidature
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                Préparer ma candidature : {opportunity.titre}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Email Subject Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1. Objet du mail recommandé
              </span>
              <button
                onClick={() => handleCopy(docs.subject, 'subject')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 transition-colors cursor-pointer"
              >
                {copiedField === 'subject' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm font-semibold text-white select-all bg-black/30 p-2.5 rounded-xl border border-white/5">
              {docs.subject}
            </p>
          </div>

          {/* Tabs: Email body vs Cover Letter */}
          <div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('email')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'email'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
              >
                <Mail className="w-4 h-4" />
                Message email
              </button>
              <button
                onClick={() => setActiveTab('letter')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeTab === 'letter'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                  }`}
              >
                <FileText className="w-4 h-4" />
                Lettre de motivation courte
              </button>
            </div>

            <div className="relative rounded-2xl bg-black/40 border border-white/10 p-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() =>
                    handleCopy(
                      activeTab === 'email' ? docs.emailBody : docs.coverLetter,
                      activeTab
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 transition-all cursor-pointer"
                >
                  {copiedField === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Texte copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier tout le texte</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs sm:text-sm text-slate-300 font-sans whitespace-pre-wrap leading-relaxed select-all">
                {activeTab === 'email' ? docs.emailBody : docs.coverLetter}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleSavePrepared}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${markedAsPrepared
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
              : 'bg-white/10 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white'
              }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            {markedAsPrepared ? 'Ajouté à "Candidatures préparées"' : 'Enregistrer dans mon tracker'}
          </button>

          {opportunity.lien_candidature && opportunity.lien_candidature.trim() !== '' ? (
            <a
              href={opportunity.lien_candidature}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackApplication(opportunity.id, 'sent')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>Candidater maintenant</span>
              <Send className="w-4 h-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Lien de candidature indisponible"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-500 text-xs sm:text-sm font-semibold cursor-not-allowed opacity-60"
            >
              <span>Lien de candidature indisponible</span>
              <Send className="w-4 h-4 opacity-40" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
