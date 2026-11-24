import { ArrowRight, BookOpen, CheckCircle2, Clock3, Compass, LibraryBig, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import CoverImage from '../components/CoverImage'
import EmptyState from '../components/EmptyState'
import GoalCard from '../components/GoalCard'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useLibraryStats } from '../hooks/useLibraryStats'
import { formatLongDate, greeting } from '../utils/helpers'

export default function Dashboard() {
  const stats = useLibraryStats()
  const hasLibrary = stats.total > 0

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-forest px-6 py-8 text-paper shadow-float sm:px-10 sm:py-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(233,223,201,0.35), transparent 45%)',
          }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold/90">
              {formatLongDate()}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {greeting()}, okur.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">
              Kitapların seni bekliyor. Bugün yeni bir sayfa açmanın tam zamanı.
            </p>
            <Link
              to="/discover"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-cream"
            >
              <Compass size={16} />
              Yeni kitap keşfet
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hidden shrink-0 rounded-2xl border border-paper/15 bg-paper/5 px-5 py-4 text-right sm:block">
            <p className="font-display text-4xl font-semibold leading-none">{stats.total}</p>
            <p className="mt-2 text-xs text-paper/70">kitap kitaplığında</p>
          </div>
        </div>
      </section>

      <section aria-label="Kitaplık özeti">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={LibraryBig} label="Toplam kitap" value={stats.total} hint="kitaplığında" />
          <StatCard icon={CheckCircle2} label="Okunan" value={stats.readCount} hint="tamamlanan kitap" tone="sage" />
          <StatCard icon={BookOpen} label="Okunuyor" value={stats.readingCount} hint="şu anda" tone="gold" />
          <StatCard icon={Clock3} label="Okunacak" value={stats.wantCount} hint="sıra bekliyor" tone="sand" />
        </div>
      </section>

      {!hasLibrary ? (
        <EmptyState
          icon={LibraryBig}
          title="Kitaplığın henüz boş"
          description="Open Library'den bir kitap ara ve kitaplığına ekle. Okuma yolculuğun burada başlasın."
          actionLabel="Kitap keşfet"
          actionTo="/discover"
        />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,1fr)]">
            <section className="card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Okuma masan</p>
                  <h2 className="section-title mt-1.5">Okumaya devam et</h2>
                </div>
                <Link to="/library" className="btn-ghost text-xs">
                  Tümünü gör <ArrowRight size={14} />
                </Link>
              </div>

              {stats.continueReading.length === 0 ? (
                <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest/15 px-4 py-10 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sand/70 text-forest">
                    <BookOpen size={20} />
                  </span>
                  <p className="mt-3 font-display text-lg font-semibold text-forest-deep">Şu an okunan kitap yok</p>
                  <p className="mt-1 max-w-sm text-sm text-muted">
                    Kitaplığından bir kitabı “Okunuyor” olarak işaretle, burada görünsün.
                  </p>
                  <Link to="/library" className="btn-soft mt-5 text-xs">
                    Kitaplığıma git
                  </Link>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {stats.continueReading.slice(0, 4).map((book) => (
                    <Link
                      key={book.key}
                      to={`/book/${encodeURIComponent(book.key)}`}
                      state={{ book }}
                      className="group flex items-center gap-3 rounded-2xl border border-forest/8 bg-cream/60 p-3 transition-colors hover:border-forest/20 hover:bg-cream"
                    >
                      <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <CoverImage coverId={book.coverId} title={book.title} className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2-custom font-display text-sm font-semibold leading-snug text-forest-deep">
                          {book.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted">{book.author}</p>
                        <span className="mt-2 inline-block text-[11px] font-semibold text-gold">
                          Okumaya devam et →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <GoalCard />
          </div>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Kitaplığından</p>
                <h2 className="section-title mt-1.5">Son eklenenler</h2>
              </div>
              <Link to="/library" className="btn-ghost text-xs">
                Kitaplığım <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {stats.recent.slice(0, 4).map((book) => (
                <article key={book.key} className="card group overflow-hidden transition-shadow hover:shadow-float">
                  <Link to={`/book/${encodeURIComponent(book.key)}`} state={{ book }} className="block aspect-[2/3] overflow-hidden bg-sand">
                    <CoverImage
                      coverId={book.coverId}
                      title={book.title}
                      className="h-full w-full transition-transform duration-300 group-hover:scale-[1.025]"
                    />
                  </Link>
                  <div className="p-3">
                    <span className="inline-block">
                      <StatusBadge status={book.status} />
                    </span>
                    <Link to={`/book/${encodeURIComponent(book.key)}`} state={{ book }}>
                      <h3 className="mt-2 line-clamp-2-custom font-display text-sm font-semibold leading-snug text-forest-deep">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="mt-1 truncate text-[11px] text-muted">{book.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-gold" />
              <h2 className="section-title">Okuma durumları</h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {stats.statusData.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-forest-deep">{item.name}</span>
                    <span className="font-semibold text-muted">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand/80">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.total ? (item.value / stats.total) * 100 : 0}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
