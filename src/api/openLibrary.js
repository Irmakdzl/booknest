import { normalizeWork, uniqueByKey } from '../utils/helpers'

const BASE_URL = 'https://openlibrary.org'

function withTimeout(signal, ms) {
  if (typeof AbortSignal.any === 'function' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.any([signal, AbortSignal.timeout(ms)].filter(Boolean))
  }
  return signal
}

async function requestJson(url, signal, timeoutMs = 12000) {
  const response = await fetch(url, { signal: withTimeout(signal, timeoutMs) })
  if (!response.ok) {
    throw new Error('Open Library şu anda yanıt vermiyor. Lütfen birazdan tekrar deneyin.')
  }
  return response.json()
}

export async function searchBooks({ query = '', mode = 'all', subject = '', page = 1, limit = 24, signal } = {}) {
  const params = new URLSearchParams({ limit: String(limit), page: String(page) })
  const term = query.trim()

  if (term) {
    if (mode === 'title') params.set('title', term)
    else if (mode === 'author') params.set('author', term)
    else params.set('q', term)
  }
  if (subject) params.set('subject', subject)

  const data = await requestJson(`${BASE_URL}/search.json?${params.toString()}`, signal)
  return {
    docs: uniqueByKey(
      (data.docs || []).map((doc) => {
        const key = doc.key?.split('/').filter(Boolean).pop()
        if (!key) return null
        return {
          ...doc,
          key,
          title: doc.title || 'İsimsiz kitap',
          author: doc.author_name?.slice(0, 2).join(', ') || 'Yazar bilinmiyor',
          year: doc.first_publish_year || null,
          coverId: doc.cover_i || doc.cover_edition_key || null,
          pages: doc.number_of_pages_median || null,
          subjects: (doc.subject || []).slice(0, 8),
          description: '',
        }
      }),
    ),
    total: data.numFound || 0,
  }
}

export async function fetchWorkDetails(key, signal) {
  const workUrl = `${BASE_URL}/works/${encodeURIComponent(key)}.json`
  const editionsUrl = `${BASE_URL}/works/${encodeURIComponent(key)}/editions.json?limit=1`

  const [workResult, editionsResult] = await Promise.allSettled([
    requestJson(workUrl, signal),
    requestJson(editionsUrl, signal, 6000),
  ])

  if (workResult.status === 'rejected') {
    throw workResult.reason
  }

  const work = workResult.value
  const authorKeys = (work.authors || [])
    .map((entry) => entry?.author?.key?.split('/').filter(Boolean).pop())
    .filter(Boolean)
    .slice(0, 2)

  const authorNames = await Promise.all(
    authorKeys.map(async (authorKey) => {
      try {
        const author = await requestJson(`${BASE_URL}/authors/${authorKey}.json`, signal, 5000)
        return author?.name || null
      } catch {
        return null
      }
    }),
  )

  const pages =
    editionsResult.status === 'fulfilled'
      ? editionsResult.value?.entries?.[0]?.number_of_pages || null
      : null

  return normalizeWork(work, authorNames, pages)
}
