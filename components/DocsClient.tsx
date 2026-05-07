'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, SortAsc, Download, Upload, X } from 'lucide-react'
import DocCard from './DocCard'
import DocModal from './DocModal'

const CATEGORIES = [
  'Financeiro', 'Faturamento', 'Compras', 'Estoque', 'Contabilidade',
  'Fiscal', 'Folha de Pagamento', 'Ativo Fixo', 'CRM', 'ERP Geral',
  'ADVPL/TLPP', 'REST/API', 'TDN', 'Outros',
]

interface Doc {
  id: number
  title: string
  url: string
  description?: string
  category: string
  created_at: string
}

interface Props {
  userId: string
}

export default function DocsClient({ userId }: Props) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [modalOpen, setModalOpen] = useState(false)
  const [editDoc, setEditDoc] = useState<Doc | null>(null)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (sort) params.set('sort', sort)

    const res = await fetch(`/api/docs?${params}`)
    if (res.ok) setDocs(await res.json())
    setLoading(false)
  }, [search, category, sort])

  useEffect(() => {
    const t = setTimeout(fetchDocs, 300)
    return () => clearTimeout(t)
  }, [fetchDocs])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setEditDoc(null)
        setModalOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  async function handleSave(data: Omit<Doc, 'id' | 'created_at'>) {
    const isEdit = !!editDoc

    const res = await fetch(isEdit ? `/api/docs/${editDoc!.id}` : '/api/docs', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Erro ao salvar.')
    }

    await fetchDocs()
    showToast(isEdit ? 'Link atualizado!' : 'Link adicionado!')
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/docs/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setDocs(d => d.filter(x => x.id !== id))
      showToast('Link removido.')
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(docs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `totvs-docs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exportado com sucesso!')
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const items: Doc[] = JSON.parse(text)

    let count = 0
    for (const item of items) {
      const res = await fetch('/api/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, url: item.url, description: item.description, category: item.category }),
      })
      if (res.ok) count++
    }
    await fetchDocs()
    showToast(`${count} links importados!`)
    e.target.value = ''
  }

  // Stats per category
  const categoryCount = docs.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-sm font-semibold text-gray-700">{docs.length} links</span>
        {Object.entries(categoryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              className={`badge transition-colors cursor-pointer ${category === cat ? 'bg-totvs-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat} ({count})
            </button>
          ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, URL ou descrição..."
            className="input-field !pl-9 !pr-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            className="input-field !pl-8 !pr-8 appearance-none cursor-pointer"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Todos os módulos</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <SortAsc size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            className="input-field !pl-8 !pr-8 appearance-none cursor-pointer"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="az">A → Z</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-1.5 text-sm py-2"
            title="Exportar JSON"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          <label className="btn-secondary flex items-center gap-1.5 text-sm py-2 cursor-pointer" title="Importar JSON">
            <Upload size={15} />
            <span className="hidden sm:inline">Importar</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>

          <button
            onClick={() => { setEditDoc(null); setModalOpen(true) }}
            className="btn-primary flex items-center gap-1.5 text-sm"
            title="Ctrl+N"
          >
            <Plus size={16} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-5 h-36 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-medium text-gray-500">Nenhum link encontrado</p>
          <p className="text-sm mt-1">
            {search || category ? 'Tente outros filtros.' : 'Clique em "Adicionar" para salvar o primeiro link.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {docs.map(doc => (
            <DocCard
              key={doc.id}
              doc={doc}
              onEdit={d => { setEditDoc(d); setModalOpen(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <DocModal
          doc={editDoc}
          onClose={() => { setModalOpen(false); setEditDoc(null) }}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
