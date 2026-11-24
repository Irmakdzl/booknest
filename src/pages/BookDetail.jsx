import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, CalendarDays, FileText, Info, Layers3, RotateCw, Trash2 } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchWorkDetails } from '../api/openLibrary'
import CoverImage from '../components/CoverImage'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { useLibrary } from '../context/LibraryContext'
import { STATUS_OPTIONS, STATUS_META } from '../utils/constants'

function labelForSubject(subject) {
  return String(subject)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function BookDetail() {
  const { key } = useParams()
  const location = useLocation()
  const passedBook = location.state?.book
  const { addBook, removeBook, updateStatus, isSaved } = useLibrary()

  const [book, setBook] = useState(passedBook || null)
  const [loading, setLoading] = useState(!passedBook)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    setLoading((current) => current || !book)
    setError('')

    fetchWorkDetails(key, controller.signal)
      .then((details) => {
        if (cancelled || !details) return
        setBook((current) => ({
          ...(current || {}),
          ...details,
          description: details.description || current?.description || '',
          subjects: details.subjects?.length ? details.subjects : current?.subjects || [],
          coverId: details.coverId || current?.coverId || null,
        }))
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        setError(err?.message || 'Kitap detayları yüklenemedi.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, retry])

  const saved = isSaved(key)

  if (loading && !book) {
    return (
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="mx-auto aspect-[2/3] w-full max-w-[300px] animate-pulse rounded-2xl bg-sand" />
        <div className="space-y-4 py-4">
          <div className="h-4 w-24 animate-pulse rounded bg-sand" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-sand" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-sand" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-sand/80" />
        </div>
      </div>
    )
  }

  if (error && !book) {
    return (
      <EmptyState icon={Info} title="Kitap yüklenemedi" description={error}>
        <button type="button" onClick={() => setRetry((value) => value + 1)} className="btn-primary mt-6">
          <RotateCw size={15} />
          Tekrar dene
        </button>
      </EmptyState>
    )
  }

  if (!book) return null

  return (
    <div className="space-y-6">
      <Link to="/discover" className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-forest">
        <ArrowLeft size={16} />
        Keşfe dön
      </Link>

      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
        <div className="mx-auto w-full max-w-[300px] lg:mx-0">
          <div className="overflow-hidden rounded-2xl bg-sand shadow-float">
            <CoverImage coverId={book.coverId} title={book.title} size="L" className="aspect-[2/3] w-full" />
          </div>
          <p className="mt-3 text-center text-[11px] text-muted">
            Kapak görseli Open Library Covers API'den gelir.
          </p>
        </div>

        <div className="min-w-0">
          <p className="eyebrow">Kitap detayı · Open Library</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-forest-deep sm:text-4xl">
            {book.title}
          </h2>
          <p className="mt-3 flex items-center gap-2 text-base text-muted">
            <BookOpen size={17} className="text-gold" />
            {book.author}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {saved && <StatusBadge status={book.status} />}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/60 px-3 py-1.5 text-xs font-medium text-forest">
              <CalendarDays size={14} />
              {book.year || 'Yayın yılı yok'}
            </span>
            {book.pages && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand/60 px-3 py-1.5 text-xs font-medium text-forest">
                <FileText size={14} />
                {book.pages} sayfa
              </span>
            )}
          </div>

          <div className="card mt-7 p-5 sm:p-6">
            {saved ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-forest-deep">Bu kitap kitaplığında</p>
                    <p className="mt-0.5 text-xs text-muted">Okuma durumunu istediğin zaman değiştirebilirsin.</p>
                  </div>
                  <StatusBadge status={book.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateStatus(key, status)}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                        book.status === status
                          ? 'bg-forest text-paper'
                          : 'bg-sand/60 text-forest hover:bg-sand'
                      }`}
                    >
                      {STATUS_META[status].label}
                    </button>
                  ))}
                </div>
                <div className="mt-5 border-t border-forest/8 pt-4">
                  {confirmingRemove ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          removeBook(key)
                          setConfirmingRemove(false)
                        }}
                        className="rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Evet, çıkar
                      </button>
                      <button type="button" onClick={() => setConfirmingRemove(false)} className="btn-ghost text-xs">
                        Vazgeç
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingRemove(true)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-muted transition-colors hover:text-red-600"
                    >
                      <Trash2 size={14} />
                      Kitaplıktan çıkar
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-forest-deep">Bu kitabı okumak istiyor musun?</p>
                  <p className="mt-0.5 text-xs text-muted">Kitaplığına ekle, durumunu sonra değiştir.</p>
                </div>
                <button type="button" onClick={() => addBook(book)} className="btn-primary shrink-0">
                  Kitaplığıma Ekle
                </button>
              </div>
            )}
          </div>

          <section className="mt-7">
            <h3 className="section-title">Kitap hakkında</h3>
            {book.description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{book.description}</p>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-forest/12 px-4 py-5 text-sm text-muted">
                Open Library bu kitap için açıklama metni sağlamıyor.
              </p>
            )}
          </section>

          {book.subjects?.length > 0 && (
            <section className="mt-7">
              <h3 className="flex items-center gap-2 section-title">
                <Layers3 size={17} className="text-gold" />
                Konular ve kategoriler
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {book.subjects.map((subject, index) => (
                  <span
                    key={`${subject}-${index}`}
                    className="rounded-full border border-forest/10 bg-paper px-3 py-1.5 text-xs font-medium text-forest"
                  >
                    {labelForSubject(subject)}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
