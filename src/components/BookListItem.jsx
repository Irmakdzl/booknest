import { useState } from 'react'
import { Check, Plus, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import { STATUS_OPTIONS, STATUS_META } from '../utils/constants'
import CoverImage from './CoverImage'
import StatusBadge from './StatusBadge'

export default function BookListItem({ book, mode = 'library' }) {
  const { addBook, removeBook, updateStatus, isSaved } = useLibrary()
  const [confirming, setConfirming] = useState(false)
  const saved = isSaved(book.key)
  const detailLink = `/book/${encodeURIComponent(book.key)}`

  return (
    <article className="card flex items-center gap-4 p-3 transition-shadow hover:shadow-float sm:p-4">
      <Link to={detailLink} state={{ book }} className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-sand sm:h-28 sm:w-20">
        <CoverImage coverId={book.coverId} title={book.title} className="h-full w-full" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={detailLink} state={{ book }}>
          <h3 className="truncate font-display text-base font-semibold text-forest-deep hover:text-forest">
            {book.title}
          </h3>
        </Link>
        <p className="mt-0.5 truncate text-sm text-muted">{book.author}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {mode === 'library' ? (
            <StatusBadge status={book.status} />
          ) : (
            <span className="text-xs text-muted">{book.year || 'Yayın yılı yok'}</span>
          )}
          <span className="text-xs text-muted/80">{book.year || '—'}</span>
          {book.pages ? <span className="text-xs text-muted/80">• {book.pages} sayfa</span> : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {mode === 'discover' ? (
          <button
            type="button"
            onClick={() => addBook(book)}
            disabled={saved}
            className="btn-soft px-3 py-2 text-xs disabled:cursor-default disabled:bg-forest/8 disabled:text-forest/60"
          >
            {saved ? <Check size={14} /> : <Plus size={14} />}
            <span className="hidden sm:inline">{saved ? 'Ekli' : 'Ekle'}</span>
          </button>
        ) : confirming ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                removeBook(book.key)
                setConfirming(false)
              }}
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Sil
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg bg-sand/70 p-2 text-forest"
              aria-label="Silmeyi iptal et"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <select
              value={book.status}
              onChange={(event) => updateStatus(book.key, event.target.value)}
              aria-label={`${book.title} okuma durumu`}
              className="rounded-lg border border-forest/10 bg-cream px-2 py-2 text-xs font-semibold text-forest outline-none focus:border-forest/40"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`${book.title} kitabını sil`}
            >
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </article>
  )
}
