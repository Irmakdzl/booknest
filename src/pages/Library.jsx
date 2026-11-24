import { useMemo, useState } from 'react'
import { LayoutGrid, List, Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard'
import BookListItem from '../components/BookListItem'
import EmptyState from '../components/EmptyState'
import { useLibrary } from '../context/LibraryContext'
import { STATUS, STATUS_META, STATUS_OPTIONS } from '../utils/constants'

export default function Library() {
  const { library, prefs, setViewMode } = useLibrary()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('recent')

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('tr-TR')
    const result = library.filter((book) => {
      const matchesQuery =
        !term ||
        book.title?.toLocaleLowerCase('tr-TR').includes(term) ||
        book.author?.toLocaleLowerCase('tr-TR').includes(term)
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter
      return matchesQuery && matchesStatus
    })

    return result.sort((a, b) => {
      if (sort === 'title') return (a.title || '').localeCompare(b.title || '', 'tr')
      if (sort === 'year') return (b.year || 0) - (a.year || 0)
      return new Date(b.addedAt) - new Date(a.addedAt)
    })
  }, [library, query, statusFilter, sort])

  function clearFilters() {
    setQuery('')
    setStatusFilter('all')
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Kişisel koleksiyonun</p>
          <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-forest-deep sm:text-4xl">
            Kitaplığım
          </h2>
          <p className="mt-2 text-sm text-muted">
            {library.length} kitap · {library.filter((book) => book.status === STATUS.READ).length} okundu
          </p>
        </div>
        <Link to="/discover" className="btn-primary self-start sm:self-auto">
          <Plus size={16} />
          Yeni kitap ekle
        </Link>
      </section>

      {library.length > 0 && (
        <section className="card space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Kitaplığında ara..."
                className="input-field pl-11 pr-10"
                aria-label="Kitaplıkta ara"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted hover:bg-sand/70 hover:text-forest"
                  aria-label="Aramayı temizle"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="relative sm:w-48">
              <SlidersHorizontal size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="input-field appearance-none pl-10"
                aria-label="Sıralama"
              >
                <option value="recent">Son eklenenler</option>
                <option value="title">Başlığa göre</option>
                <option value="year">Yayın yılına göre</option>
              </select>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-forest/10 bg-cream p-1" role="group" aria-label="Görünüm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${
                  prefs.viewMode === 'grid' ? 'bg-forest text-paper' : 'text-muted hover:text-forest'
                }`}
                aria-label="Izgara görünümü"
                title="Izgara görünümü"
              >
                <LayoutGrid size={17} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${
                  prefs.viewMode === 'list' ? 'bg-forest text-paper' : 'text-muted hover:text-forest'
                }`}
                aria-label="Liste görünümü"
                title="Liste görünümü"
              >
                <List size={17} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Durum filtresi">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === 'all' ? 'bg-forest text-paper' : 'bg-sand/60 text-forest hover:bg-sand'
              }`}
            >
              Tümü ({library.length})
            </button>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === status ? 'bg-forest text-paper' : 'bg-sand/60 text-forest hover:bg-sand'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[status].dot}`} />
                {STATUS_META[status].label} (
                {library.filter((book) => book.status === status).length})
              </button>
            ))}
          </div>
        </section>
      )}

      {library.length === 0 ? (
        <EmptyState
          title="Kitaplığın henüz boş"
          description="Open Library'de kitap ara ve okuma yolculuğuna ilk kitabını ekle."
          actionLabel="Kitap keşfet"
          actionTo="/discover"
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="Eşleşen kitap yok" description="Arama veya filtre seçimini değiştirerek tekrar dene.">
          <button type="button" onClick={clearFilters} className="btn-primary mt-6">
            Filtreleri temizle
          </button>
        </EmptyState>
      ) : prefs.viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((book) => (
            <BookCard key={book.key} book={book} mode="library" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((book) => (
            <BookListItem key={book.key} book={book} mode="library" />
          ))}
        </div>
      )}
    </div>
  )
}
