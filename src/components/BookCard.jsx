import { useState } from 'react'
import { Check, Plus, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLibrary } from '../context/LibraryContext'
import { STATUS_OPTIONS, STATUS_META } from '../utils/constants'
import CoverImage from './CoverImage'
import StatusBadge from './StatusBadge'

export default function BookCard({ book, mode = 'discover' }) {
  const { addBook, removeBook, updateStatus, isSaved } = useLibrary()
  const [confirming, setConfirming] = useState(false)
  const saved = isSaved(book.key)
  const detailLink = `/book/${encodeURIComponent(book.key)}`

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-float">
      <Link to={detailLink} state={{ book }} className="relative block aspect-[2/3] overflow-hidden bg-sand">
        <CoverImage
          coverId={book.coverId}
          title={book.title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-[1.025]"
        />
        {mode === 'library' && (
          <span className="absolute left-2.5 top-2.5">
            <StatusBadge status={book.status} className="bg-paper/95 shadow-sm backdrop-blur-sm" />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <Link to={detailLink} state={{ book }}>
          <h3 className="line-clamp-2-custom font-display text-[15px] font-semibold leading-snug text-forest-deep transition-colors group-hover:text-forest">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1.5 truncate text-xs text-muted">{book.author}</p>
        <p className="mt-0.5 text-[11px] text-muted/80">{book.year || 'Yayın yılı yok'}</p>

        <div className="mt-auto pt-3.5">
          {mode === 'discover' ? (
            <button
              type="button"
              onClick={() => addBook(book)}
              disabled={saved}
              className="btn-soft w-full py-2 text-xs disabled:cursor-default disabled:bg-forest/8 disabled:text-forest/60"
            >
              {saved ? <Check size={14} /> : <Plus size={14} />}
              {saved ? 'Kitaplığımda' : 'Kitaplığıma Ekle'}
            </button>
          ) : confirming ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  removeBook(book.key)
                  setConfirming(false)
                }}
                className="flex-1 rounded-lg bg-red-50 px-2 py-2 text-[11px] font-semibold text-red-700 hover:bg-red-100"
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
            <div className="flex items-center gap-1.5">
              <select
                value={book.status}
                onChange={(event) => updateStatus(book.key, event.target.value)}
                aria-label={`${book.title} okuma durumu`}
                className="min-w-0 flex-1 rounded-lg border border-forest/10 bg-cream px-2 py-2 text-[11px] font-semibold text-forest outline-none focus:border-forest/40"
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
                title="Kitaplıktan çıkar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
