import { useEffect, useState } from 'react'
import { RotateCw, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import EmptyState from '../components/EmptyState'
import LoadingGrid from '../components/LoadingGrid'
import { searchBooks } from '../api/openLibrary'
import { useLibrary } from '../context/LibraryContext'
import { POPULAR_SEARCHES, SEARCH_MODES, SUBJECTS } from '../utils/constants'
import { uniqueByKey } from '../utils/helpers'

const PAGE_SIZE = 24

export default function Discover() {
  const { notify } = useLibrary()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const mode = searchParams.get('mode') || 'all'
  const subject = searchParams.get('subject') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  const [input, setInput] = useState(query)
  const [modeDraft, setModeDraft] = useState(mode)
  const [subjectDraft, setSubjectDraft] = useState(subject)
  const [docs, setDocs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    setInput(query)
    setModeDraft(mode)
    setSubjectDraft(subject)
  }, [query, mode, subject])

  useEffect(() => {
    if (!query && !subject) {
      setDocs([])
      setTotal(0)
      setError('')
      setLoading(false)
      return undefined
    }

    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError('')

    searchBooks({ query, mode, subject, page, limit: PAGE_SIZE, signal: controller.signal })
      .then((result) => {
        if (cancelled) return
        setDocs((current) =>
          page === 1 ? result.docs : uniqueByKey([...current, ...result.docs]),
        )
        setTotal(result.total)
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setError(err?.message || 'Arama sırasında beklenmeyen bir hata oluştu.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [query, mode, subject, page, retry])

  function handleSubmit(event) {
    event.preventDefault()
    const term = input.trim()
    if (!term && !subjectDraft) {
      notify('Aramak için bir kitap adı veya yazar girin.', 'info')
      return
    }

    const next = new URLSearchParams()
    if (term) next.set('q', term)
    if (modeDraft !== 'all') next.set('mode', modeDraft)
    if (subjectDraft) next.set('subject', subjectDraft)
    setSearchParams(next)
  }

  function loadMore() {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(page + 1))
    setSearchParams(next)
  }

  function runPopularSearch(term) {
    const next = new URLSearchParams()
    next.set('q', term)
    setSearchParams(next)
  }

  const hasSearch = Boolean(query || subject)
  const hasMore = docs.length > 0 && docs.length < total

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-3xl border border-forest/8 bg-paper px-5 py-7 shadow-card sm:px-8 sm:py-9">
        <p className="eyebrow">Open Library · 40 milyondan fazla kitap</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-forest-deep sm:text-4xl">
          Aradığın kitap burada.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Kitap adı, yazar veya kategoriye göre ara. Beğendiğini tek dokunuşla kitaplığına ekle.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Arama türü">
            {SEARCH_MODES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setModeDraft(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  modeDraft === option.value
                    ? 'bg-forest text-paper'
                    : 'bg-sand/60 text-forest hover:bg-sand'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={modeDraft === 'author' ? 'Yazar adı (örn. Jane Austen)' : 'Kitap adı (örn. Dune)'}
                className="input-field pl-11 pr-10"
                aria-label="Arama terimi"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted hover:bg-sand/70 hover:text-forest"
                  aria-label="Aramayı temizle"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="relative sm:w-52">
              <SlidersHorizontal size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <select
                value={subjectDraft}
                onChange={(event) => setSubjectDraft(event.target.value)}
                className="input-field appearance-none pl-10"
                aria-label="Kategori filtresi"
              >
                <option value="">Tüm kategoriler</option>
                {SUBJECTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary px-6" disabled={loading}>
              <Search size={16} />
              Ara
            </button>
          </div>
        </form>

        {!hasSearch && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted">Popüler aramalar:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => runPopularSearch(term)}
                className="rounded-full border border-forest/10 bg-cream/70 px-3 py-1.5 text-xs font-medium text-forest transition-colors hover:border-forest/30 hover:bg-cream"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </section>

      {hasSearch && (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="eyebrow">Arama sonuçları</p>
              <h2 className="section-title mt-1.5">
                {loading && docs.length === 0
                  ? 'Kitaplar aranıyor…'
                  : total > 0
                    ? `${total.toLocaleString('tr-TR')} sonuç bulundu`
                    : 'Sonuç bulunamadı'}
              </h2>
              {(query || subject) && (
                <p className="mt-1 text-xs text-muted">
                  {query && <span>“{query}”</span>}
                  {query && subject && ' · '}
                  {subject && <span>{SUBJECTS.find((item) => item.value === subject)?.label || subject}</span>}
                </p>
              )}
            </div>
            {docs.length > 0 && !loading && (
              <span className="text-xs text-muted">
                {docs.length} / {total.toLocaleString('tr-TR')} gösteriliyor
              </span>
            )}
          </div>

          {error && docs.length === 0 ? (
            <EmptyState icon={SearchX} title="Arama yapılamadı" description={error}>
              <button type="button" onClick={() => setRetry((value) => value + 1)} className="btn-primary mt-6">
                <RotateCw size={15} />
                Tekrar dene
              </button>
            </EmptyState>
          ) : loading && docs.length === 0 ? (
            <LoadingGrid />
          ) : docs.length === 0 && !loading ? (
            <EmptyState
              icon={SearchX}
              title="Kitap bulunamadı"
              description="Arama terimini değiştirmeyi veya farklı bir kategori seçmeyi deneyebilirsin."
            >
              <button
                type="button"
                onClick={() => setSearchParams(new URLSearchParams())}
                className="btn-primary mt-6"
              >
                Aramayı temizle
              </button>
            </EmptyState>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {docs.map((book) => (
                  <BookCard key={book.key} book={book} mode="discover" />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button type="button" onClick={loadMore} className="btn-soft px-6" disabled={loading}>
                    {loading ? 'Yükleniyor…' : 'Daha fazla kitap yükle'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  )
}
