export const STATUS = {
  WANT: 'want',
  READING: 'reading',
  READ: 'read',
}

export const STATUS_META = {
  [STATUS.WANT]: {
    label: 'Okunacak',
    badge: 'bg-sand text-forest',
    dot: 'bg-sage',
    bar: '#b2a78f',
  },
  [STATUS.READING]: {
    label: 'Okunuyor',
    badge: 'bg-amber-100 text-amber-800',
    dot: 'bg-gold',
    bar: '#c79a55',
  },
  [STATUS.READ]: {
    label: 'Okundu',
    badge: 'bg-forest/10 text-forest',
    dot: 'bg-forest',
    bar: '#21493b',
  },
}

export const STATUS_OPTIONS = [
  STATUS.WANT,
  STATUS.READING,
  STATUS.READ,
]

export const SEARCH_MODES = [
  { value: 'all', label: 'Tümü' },
  { value: 'title', label: 'Kitap Adı' },
  { value: 'author', label: 'Yazar' },
]

export const SUBJECTS = [
  { value: 'fiction', label: 'Kurgu' },
  { value: 'fantasy', label: 'Fantastik' },
  { value: 'mystery', label: 'Gizem' },
  { value: 'science_fiction', label: 'Bilim Kurgu' },
  { value: 'romance', label: 'Romantik' },
  { value: 'history', label: 'Tarih' },
  { value: 'biography', label: 'Biyografi' },
  { value: 'poetry', label: 'Şiir' },
  { value: 'self_help', label: 'Kişisel Gelişim' },
  { value: 'children', label: 'Çocuk' },
]

export const POPULAR_SEARCHES = [
  'Harry Potter',
  'Sapiens',
  'The Hobbit',
  'Dune',
  'Jane Austen',
  'Atomic Habits',
]

export const STORAGE_KEYS = {
  LIBRARY: 'booknest.library.v1',
  GOAL: 'booknest.goal.v1',
  PREFS: 'booknest.prefs.v1',
}

export const DEFAULT_GOAL = 12
