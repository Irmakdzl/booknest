import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon = BookOpen, title, description, actionLabel, actionTo, children }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand/70 text-forest">
        <Icon size={24} strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold text-forest-deep">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  )
}
