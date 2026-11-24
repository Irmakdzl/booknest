export default function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-busy="true" aria-label="Kitaplar yükleniyor">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card overflow-hidden">
          <div className="aspect-[2/3] animate-pulse bg-sand/80" />
          <div className="space-y-2.5 p-3.5">
            <div className="h-3.5 w-4/5 animate-pulse rounded bg-sand" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-sand/80" />
            <div className="h-8 w-full animate-pulse rounded-lg bg-sand/70" />
          </div>
        </div>
      ))}
    </div>
  )
}
