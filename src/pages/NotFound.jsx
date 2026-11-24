import { Compass } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="Sayfa bulunamadı"
      description="Aradığın sayfa taşınmış veya hiç var olmamış olabilir."
      actionLabel="Ana sayfaya dön"
      actionTo="/"
    />
  )
}
