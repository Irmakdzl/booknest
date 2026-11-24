import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { DEFAULT_GOAL, STATUS, STORAGE_KEYS } from '../utils/constants'
import { parseStored, toLibraryItem } from '../utils/helpers'

const LibraryContext = createContext(null)

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const TOAST_STYLES = {
  success: 'border-forest/15 bg-forest text-paper',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-forest/10 bg-paper text-forest-deep',
}

function ToastHost({ toasts, dismiss }) {
  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      role="region"
      aria-label="Bildirimler"
    >
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.variant] || Info
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-float ${TOAST_STYLES[toast.variant] || TOAST_STYLES.info}`}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-lg p-0.5 opacity-70 transition-opacity hover:opacity-100"
              aria-label="Bildirimi kapat"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function LibraryProvider({ children }) {
  const [library, setLibrary] = useState(() => {
    const stored = parseStored(localStorage.getItem(STORAGE_KEYS.LIBRARY), [])
    return Array.isArray(stored) ? stored : []
  })

  const [goal, setGoal] = useState(() => {
    const stored = parseStored(localStorage.getItem(STORAGE_KEYS.GOAL), null)
    const target = Number(stored?.monthlyTarget)
    return { monthlyTarget: Number.isFinite(target) && target > 0 ? target : DEFAULT_GOAL }
  })

  const [prefs, setPrefs] = useState(() => {
    const stored = parseStored(localStorage.getItem(STORAGE_KEYS.PREFS), null)
    return { viewMode: stored?.viewMode === 'list' ? 'list' : 'grid' }
  })

  const [toasts, setToasts] = useState([])
  const toastId = useRef(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library))
  }, [library])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOAL, JSON.stringify(goal))
  }, [goal])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs))
  }, [prefs])

  function dismiss(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  function notify(message, variant = 'success') {
    const id = ++toastId.current
    setToasts((current) => [...current.slice(-2), { id, message, variant }])
    window.setTimeout(() => dismiss(id), 3200)
  }

  function isSaved(key) {
    return library.some((book) => book.key === key)
  }

  function addBook(book, status = STATUS.WANT) {
    if (!book?.key) return false
    if (isSaved(book.key)) {
      notify('Bu kitap zaten kitaplığında.', 'info')
      return false
    }
    setLibrary((current) => [toLibraryItem(book, status), ...current])
    notify(`“${book.title}” kitaplığına eklendi.`)
    return true
  }

  function removeBook(key) {
    const book = library.find((item) => item.key === key)
    setLibrary((current) => current.filter((item) => item.key !== key))
    if (book) notify(`“${book.title}” kitaplığından çıkarıldı.`, 'info')
  }

  function updateStatus(key, status) {
    if (!Object.values(STATUS).includes(status)) return
    setLibrary((current) =>
      current.map((book) =>
        book.key === key
          ? {
              ...book,
              status,
              statusChangedAt: new Date().toISOString(),
              finishedAt: status === STATUS.READ ? new Date().toISOString() : null,
            }
          : book,
      ),
    )
    notify('Okuma durumu güncellendi.')
  }

  function updateGoal(target) {
    const value = Number(target)
    if (!Number.isFinite(value) || value < 1) return
    setGoal({ monthlyTarget: Math.round(value) })
    notify('Aylık okuma hedefin güncellendi.')
  }

  const value = useMemo(
    () => ({
      library,
      goal,
      prefs,
      addBook,
      removeBook,
      updateStatus,
      updateGoal,
      isSaved,
      setViewMode: (viewMode) => setPrefs((current) => ({ ...current, viewMode })),
      notify,
      dismiss,
    }),
    [library, goal, prefs],
  )

  return (
    <LibraryContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} dismiss={dismiss} />
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary, LibraryProvider içinde kullanılmalıdır.')
  return context
}
