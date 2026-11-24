# BookNest

Open Library API ile beslenen, kitap keşfetme ve kişisel okuma takibi yapabileceğiniz modern bir dijital kitaplık uygulaması.

## Başlatma

```bash
cd booknest
npm install
npm run dev
```

Geliştirme sunucusu varsayılan olarak `http://localhost:5173` adresinde açılır.

Üretim derlemesi için:

```bash
npm run build
npm run preview
```

## Çalışan özellikler

- **Ana Sayfa:** Karşılama alanı, kitap/durum sayıları, okumaya devam, son eklenenler, aylık hedef ve durum dağılımı.
- **Keşfet:** Open Library üzerinden kitap adı, yazar ve kategori arama; sayfalama; yükleme, hata ve boş sonuç ekranları; eksik kapaklar için varsayılan görsel.
- **Kitaplığım:** Ekleme, silme, okuma durumu değiştirme, arama, filtreleme, sıralama ve ızgara/liste görünümü.
- **Kitap Detayı:** Kapak, yazar, yıl, sayfa sayısı, açıklama, konular; doğrudan URL ile açıldığında da API'den veri çeker.
- **İstatistikler:** Recharts ile aylık okuma grafiği, durum dağılımı, hedef yüzdesi ve kategori dağılımı. Sahte veri kullanılmaz; veri yoksa boş durum gösterilir.
- **Kalıcılık:** Kitaplık, okuma durumları, aylık hedef ve görünüm tercihi `localStorage` üzerinde saklanır.
- **Deneyim:** Anlık bildirimler, responsive navigasyon, tutarlı mobil menü ve erişilebilir form kontrolleri.

## GitHub Pages yayını

Depoyu GitHub üzerinde `Irmakdzl/booknest` adıyla **public** olarak oluşturup `main` branch'ine push yaptığınızda `.github/workflows/deploy.yml` otomatik çalışır ve site şu adresten yayına girer:

`https://irmakdzl.github.io/booknest/`

Repo adını farklı seçerseniz URL ve derleme base yolu otomatik olarak o ada göre ayarlanır. GitHub'da **Settings → Pages → Build and deployment → Source: GitHub Actions** seçili olmalıdır.

Elle yayınlamak için:

```bash
git remote add origin https://github.com/Irmakdzl/booknest.git
git branch -M main
git push -u origin main
```

## Klasör yapısı

```
src/
├── api/          # Open Library istekleri
├── assets/       # Yerel görseller
├── components/   # Ortak UI bileşenleri
├── context/      # Kitaplık, hedef, tercih ve bildirim state'i
├── hooks/        # İstatistik türetme hook'u
├── pages/        # Sayfalar
└── utils/        # Sabitler ve yardımcı fonksiyonlar
```
