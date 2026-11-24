import { useEffect, useState } from 'react'
import { Pencil, Target } from 'lucide-react'
import { useLibrary } from '../context/LibraryContext'
import { useLibraryStats } from '../hooks/useLibraryStats'

export default function GoalCard() {
  const { goal, updateGoal } = useLibrary()
  const { monthlyReadCount, progress, target } = useLibraryStats()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(goal.monthlyTarget))

  useEffect(() => {
    setDraft(String(goal.monthlyTarget))
  }, [goal.monthlyTarget])

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  function handleSubmit(event) {
    event.preventDefault()
    const next = Number(draft)
    if (!Number.isFinite(next) || next < 1) return
    updateGoal(next)
    setEditing(false)
  }

  return (
    <section className="card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Aylık hedef</p>
          <h2 className="section-title mt-1.5">Okuma hedefin</h2>
        </div>
        <button
          type="button"
          onClick={() => setEditing((current) => !current)}
          className="rounded-xl p-2 text-muted transition-colors hover:bg-sand/60 hover:text-forest"
          aria-label="Hedefi düzenle"
          title="Hedefi düzenle"
        >
          <Pencil size={16} />
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="999"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="input-field py-2"
            aria-label="Aylık okuma hedefi"
            autoFocus
          />
          <button type="submit" className="btn-primary px-3 py-2 text-xs">
            Kaydet
          </button>
        </form>
      )}

      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="64" cy="64" r={radius} fill="none" stroke="#eae3d4" strokeWidth="10" />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#21493b"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-forest-deep">%{progress}</span>
            <span className="text-[11px] text-muted">tamamlandı</span>
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-forest-deep">
          Bu ay <span className="font-bold">{monthlyReadCount}</span> / {target} kitap okudun
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-cream/80 p-3 text-xs leading-relaxed text-muted">
        <Target size={15} className="mt-0.5 shrink-0 text-gold" />
        <p>Hedef, kitaplığında “Okundu” olarak işaretlediğin kitapların tarihine göre hesaplanır.</p>
      </div>
    </section>
  )
}
