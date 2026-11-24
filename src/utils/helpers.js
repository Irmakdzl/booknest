import placeholderCover from '../assets/book-placeholder.svg'

const COVER_BASE = 'https://covers.openlibrary.org/b'

export function getCoverUrl(coverId, size = 'M') {
  if (!coverId) return null
  const id = String(coverId)
  const path = id.startsWith('OL') ? `olid/${id}` : `id/${id}`
  return `${COVER_BASE}/${path}-${size}.jpg?default=false`
}

export function getFallbackCover() {
  return placeholderCover
}

export function extractYear(value) {
  if (!value) return null
  const match = String(value).match(/\b(1[5-9]\d{2}|20\d{2})\b/)
  return match ? Number(match[1]) : null
}

export function formatYear(value) {
  if (!value) return 'Yayın yılı yok'
  return String(value)
}

export function cleanText(value, maxLength = 220) {
  if (!value) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

export function uniqueByKey(items = []) {
  const map = new Map()
  items.forEach((item) => {
    if (item?.key && !map.has(item.key)) map.set(item.key, item)
  })
  return [...map.values()]
}

export function normalizeSearchDoc(doc) {
  if (!doc) return null
  const key = doc.key?.split('/').filter(Boolean).pop()
  if (!key) return null

  return {
    key,
    title: doc.title || 'İsimsiz kitap',
    author: doc.author_name?.slice(0, 2).join(', ') || 'Yazar bilinmiyor',
    year: doc.first_publish_year || extractYear(doc.first_publish_date) || null,
    coverId: doc.cover_i || doc.cover_edition_key || null,
    pages: doc.number_of_pages_median || null,
    subjects: (doc.subject || []).slice(0, 8),
    description: cleanText(
      typeof doc.description === 'string'
        ? doc.description
        : Array.isArray(doc.description)
          ? doc.description[0]
          : '',
      320,
    ),
    source: 'openlibrary',
  }
}

export function normalizeWork(work, authors = [], pages = null) {
  const key = work?.key?.split('/').filter(Boolean).pop()
  if (!key) return null

  const rawDescription =
    typeof work.description === 'string'
      ? work.description
      : work.description?.value || ''

  return {
    key,
    title: work.title || 'İsimsiz kitap',
    author: authors.filter(Boolean).join(', ') || 'Yazar bilinmiyor',
    year: extractYear(work.first_publish_date) || null,
    coverId: work.covers?.[0] || null,
    pages: pages || null,
    subjects: (work.subjects || []).slice(0, 8).map((subject) => subject.name || subject),
    description: cleanText(rawDescription, 900),
    source: 'openlibrary',
  }
}

export function toLibraryItem(book, status = 'want') {
  const now = new Date().toISOString()
  return {
    ...book,
    status,
    addedAt: now,
    statusChangedAt: now,
    finishedAt: status === 'read' ? now : null,
  }
}

const MONTH_LABELS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

export function monthLabel(date) {
  return MONTH_LABELS[date.getMonth()]
}

export function isSameMonth(value, reference = new Date()) {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  )
}

export function lastSixMonths(reference = new Date()) {
  const months = []
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(reference.getFullYear(), reference.getMonth() - offset, 1)
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: monthLabel(date),
      year: date.getFullYear(),
      month: date.getMonth(),
    })
  }
  return months
}

export function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(date)
}

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 6) return 'İyi geceler'
  if (hour < 12) return 'Günaydın'
  if (hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

export function parseStored(value, fallback) {
  try {
    if (value == null) return fallback
    return JSON.parse(value)
  } catch {
    return fallback
  }
}
