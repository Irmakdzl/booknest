import { BarChart3, BookOpen, CheckCircle2, Info, Target, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import EmptyState from '../components/EmptyState'
import GoalCard from '../components/GoalCard'
import StatCard from '../components/StatCard'
import { useLibraryStats } from '../hooks/useLibraryStats'

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid rgba(33, 73, 59, 0.12)',
  boxShadow: '0 12px 34px -22px rgba(23, 53, 44, 0.35)',
  fontSize: 12,
}

export default function Statistics() {
  const stats = useLibraryStats()

  if (stats.total === 0) {
    return (
      <div className="space-y-6">
        <section>
          <p className="eyebrow">Gerçek verilerle</p>
          <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-forest-deep sm:text-4xl">
            Okuma İstatistikleri
          </h2>
        </section>
        <EmptyState
          icon={BarChart3}
          title="Henüz gösterilecek veri yok"
          description="İstatistikler yalnızca kitaplığına eklediğin ve durumunu değiştirdiğin kitaplardan oluşturulur. Örnek veri gösterilmez."
          actionLabel="Kitap keşfet"
          actionTo="/discover"
        />
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <section>
        <p className="eyebrow">Gerçek verilerle</p>
        <h2 className="mt-1.5 font-display text-3xl font-semibold tracking-tight text-forest-deep sm:text-4xl">
          Okuma İstatistikleri
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Kitaplığındaki {stats.total} kitabın durum ve tarih bilgilerinden hesaplanır.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Toplam okunan" value={stats.readCount} hint="tamamlanan kitap" />
        <StatCard icon={TrendingUp} label="Bu ay okunan" value={stats.monthlyReadCount} hint="akım aya ait" tone="gold" />
        <StatCard icon={Target} label="Hedef doluluğu" value={`%${stats.progress}`} hint={`${stats.monthlyReadCount}/${stats.target} kitap`} tone="sage" />
        <StatCard icon={BookOpen} label="Okunuyor" value={stats.readingCount} hint="şu anda" tone="sand" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={17} className="text-gold" />
            <h3 className="section-title">Aylık okunan kitaplar</h3>
          </div>
          <p className="mt-1 text-xs text-muted">Son altı ay · “Okundu” tarihine göre</p>
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlySeries} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eae3d4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#7b857c' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#7b857c' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(33,73,59,0.05)' }} />
                <Bar dataKey="kitap" name="Okunan kitap" fill="#21493b" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <h3 className="section-title">Durum dağılımı</h3>
          <p className="mt-1 text-xs text-muted">Kitaplığının güncel görünümü</p>
          <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
            <div className="h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {stats.statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full space-y-2.5">
              {stats.statusData.map((item) => (
                <li key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium text-forest-deep">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-muted">
                    {item.value} · %{stats.total ? Math.round((item.value / stats.total) * 100) : 0}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GoalCard />

        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={17} className="text-gold" />
            <h3 className="section-title">En çok okunan kategoriler</h3>
          </div>
          <p className="mt-1 text-xs text-muted">Okunmuş kitapların konu etiketlerinden</p>
          {stats.categoryData.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-forest/12 px-4 py-10 text-center">
              <p className="font-display text-lg font-semibold text-forest-deep">Henüz veri yok</p>
              <p className="mt-1 text-sm text-muted">
                Bir kitabı “Okundu” olarak işaretlediğinde kategorileri burada görünür.
              </p>
              <Link to="/library" className="btn-soft mt-5 text-xs">
                Kitaplığıma git
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {stats.categoryData.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-forest-deep">{category.name}</span>
                    <span className="font-semibold text-muted">{category.count}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand/80">
                    <div
                      className="h-full rounded-full bg-forest transition-all duration-500"
                      style={{ width: `${(category.count / stats.categoryData[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-forest/8 bg-paper/60 px-4 py-3 text-xs leading-relaxed text-muted">
        <Info size={15} className="mt-0.5 shrink-0 text-gold" />
        <p>
          Bu ekranda örnek veya sahte istatistik kullanılmaz. Tüm değerler kitaplığındaki gerçek
          kayıtlardan hesaplanır; veri olmayan alanlar boş durum olarak gösterilir.
        </p>
      </div>
    </div>
  )
}
