'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const CATEGORIES = [
  'Financeiro', 'Faturamento', 'Compras', 'Estoque', 'Contabilidade',
  'Fiscal', 'Folha de Pagamento', 'Ativo Fixo', 'CRM', 'ERP Geral',
  'ADVPL/TLPP', 'REST/API', 'TDN', 'Outros',
]

interface Doc {
  id?: number
  title: string
  url: string
  description?: string
  category: string
}

interface Props {
  doc?: Doc | null
  onClose: () => void
  onSave: (data: Omit<Doc, 'id'>) => Promise<void>
}

export default function DocModal({ doc, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    title: '', url: '', description: '', category: 'Outros',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (doc) {
      setForm({
        title: doc.title,
        url: doc.url,
        description: doc.description || '',
        category: doc.category,
      })
    }
  }, [doc])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSave(form)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {doc ? 'Editar link' : 'Adicionar link'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Ex: Configuração de NF-e"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              className="input-field"
              placeholder="https://tdn.totvs.com/..."
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Módulo / Categoria</label>
            <select
              className="input-field"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Breve descrição do conteúdo..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? 'Salvando...' : doc ? 'Salvar alterações' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
