export default function StatCard({ icon: Icon, label, value, hint, tone = 'forest' }) {
  const tones = {
    forest: 'bg-forest/8 text-forest',
    gold: 'bg-gold/12 text-gold',
    sage: 'bg-sage/12 text-sage',
    sand: 'bg-sand text-forest',
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold leading-none text-forest-deep">{value}</p>
          {hint && <p className="mt-2 text-[11px] text-muted/80">{hint}</p>}
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone] || tones.forest}`}>
          <Icon size={19} strokeWidth={1.8} />
        </span>
      </div>
    </div>
  )
}
