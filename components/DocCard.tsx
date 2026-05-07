'use client'

import { useState } from 'react'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'Financeiro': 'bg-green-100 text-green-800',
  'Faturamento': 'bg-blue-100 text-blue-800',
  'Compras': 'bg-purple-100 text-purple-800',
  'Estoque': 'bg-yellow-100 text-yellow-800',
  'Contabilidade': 'bg-indigo-100 text-indigo-800',
  'Fiscal': 'bg-pink-100 text-pink-800',
  'Folha de Pagamento': 'bg-orange-100 text-orange-800',
  'Ativo Fixo': 'bg-gray-100 text-gray-800',
  'CRM': 'bg-teal-100 text-teal-800',
  'ERP Geral': 'bg-cyan-100 text-cyan-800',
  'ADVPL/TLPP': 'bg-red-100 text-red-800',
  'REST/API': 'bg-violet-100 text-violet-800',
  'TDN': 'bg-amber-100 text-amber-800',
  'Outros': 'bg-slate-100 text-slate-700',
}

interface Doc {
  id: number
  title: string
  url: string
  description?: string
  category: string
  created_at: string
}

interface Props {
  doc: Doc
  onEdit: (doc: Doc) => void
  onDelete: (id: number) => void
}

export default function DocCard({ doc, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const favicon = `https://www.google.com/s2/favicons?domain=${new URL(doc.url).hostname}&sz=32`
  const colorClass = CATEGORY_COLORS[doc.category] || CATEGORY_COLORS['Outros']
  const date = new Date(doc.created_at).toLocaleDateString('pt-BR')

  return (
    <div className="card p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={favicon} alt="" className="w-5 h-5 flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-totvs-orange truncate text-sm leading-snug flex items-center gap-1"
          >
            {doc.title}
            <ExternalLink size={12} className="flex-shrink-0 opacity-50" />
          </a>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(doc)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(doc.id)}
                className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      {doc.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{doc.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className={`badge ${colorClass}`}>{doc.category}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
    </div>
  )
}
