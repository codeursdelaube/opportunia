'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, ClipboardCheck, Sparkles } from 'lucide-react'
import { loadOpportunityChecklist, saveOpportunityChecklist } from '@/lib/storage'

interface ChecklistSectionProps {
  opportunityId: string
}

const CHECKLIST_ITEMS = [
  { id: 'cv', label: 'CV à jour au format PDF' },
  { id: 'lettre', label: 'Lettre de motivation adaptée à l’offre' },
  { id: 'diplome', label: 'Diplôme ou attestation de scolarité récente' },
  { id: 'identite', label: 'Pièce d’identité en cours de validité' },
  { id: 'portfolio', label: 'Portfolio ou liens vers tes projets (GitHub, Behance, etc.)' },
]

export function ChecklistSection({ opportunityId }: ChecklistSectionProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCheckedItems(loadOpportunityChecklist(opportunityId))
    setMounted(true)
  }, [opportunityId])

  function handleToggle(itemId: string) {
    const updated = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId],
    }
    setCheckedItems(updated)
    saveOpportunityChecklist(opportunityId, updated)
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100)

  if (!mounted) return null

  return (
    <div className="glass-card p-6 border-gradient">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              📋 Avant de candidater
            </h3>
            <p className="text-xs text-slate-400">
              Vérifie et coche les documents indispensables avant d&apos;envoyer ton dossier
            </p>
          </div>
        </div>

        {/* Mini progress */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-400">
            {completedCount}/{CHECKLIST_ITEMS.length} prêts
          </span>
          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {CHECKLIST_ITEMS.map((item) => {
          const isChecked = !!checkedItems[item.id]
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isChecked
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.07]'
              }`}
            >
              {isChecked ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-slate-400' : ''}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
