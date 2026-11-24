import { BarChart3, BookOpen, Compass, LayoutDashboard, Library, Search } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLibraryStats } from '../hooks/useLibraryStats'

const navItems = [
  { to: '/', label: 'Genel Bakış', icon: LayoutDashboard, end: true },
  { to: '/discover', label: 'Keşfet', icon: Compass },
  { to: '/library', label: 'Kitaplığım', icon: Library },
  { to: '/statistics', label: 'İstatistikler', icon: BarChart3 },
]

const pageTitles = {
  '/': 'Genel Bakış',
  '/discover': 'Kitap Keşfet',
  '/library': 'Kitaplığım',
  '/statistics': 'Okuma İstatistikleri',
}

function Brand({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="BookNest ana sayfa">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-paper shadow-sm">
        <BookOpen size={20} strokeWidth={1.8} />
      </span>
      <span>
        <span className={`block font-display font-semibold tracking-tight text-forest-deep ${compact ? 'text-lg' : 'text-xl'}`}>
          BookNest
        </span>
        {!compact && <span className="block text-[11px] tracking-wide text-muted">dijital kitaplık</span>}
      </span>
    </Link>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const stats = useLibraryStats()
  const title = pageTitles[pathname] || (pathname.startsWith('/book/') ? 'Kitap Detayı' : 'BookNest')

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-forest/8 bg-paper/70 px-6 py-8 lg:flex">
        <Brand />

        <nav className="mt-12 flex flex-col gap-1.5" aria-label="Ana menü">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest text-paper shadow-sm'
                    : 'text-muted hover:bg-sand/60 hover:text-forest'
                }`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="rounded-2xl border border-forest/8 bg-cream/70 p-4">
            <p className="eyebrow">Bu ayın hedefi</p>
            <p className="mt-2 font-display text-2xl font-semibold text-forest-deep">
              {stats.monthlyReadCount}
              <span className="text-base text-muted"> / {stats.target}</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <Link to="/statistics" className="mt-3 block text-xs font-semibold text-forest hover:underline">
              İstatistikleri gör →
            </Link>
          </div>
          <p className="mt-5 text-[11px] leading-relaxed text-muted/80">
            Kitapların yalnızca bu cihazda saklanır.
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-forest/8 bg-cream/90 backdrop-blur-md lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <div className="lg:hidden">
              <Brand compact />
            </div>
            <div className="hidden lg:block">
              <p className="eyebrow">BookNest</p>
              <h1 className="font-display text-2xl font-semibold text-forest-deep">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-3 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-deep sm:px-4"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Kitap ara</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-14">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-forest/10 bg-paper/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Mobil menü"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[10px] font-semibold transition-colors ${
                  isActive ? 'text-forest' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`rounded-lg p-1.5 ${isActive ? 'bg-forest/10' : ''}`}>
                    <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
