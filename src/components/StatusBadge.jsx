import { STATUS_META } from '../utils/constants'

export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status]
  if (!meta) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${meta.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}
