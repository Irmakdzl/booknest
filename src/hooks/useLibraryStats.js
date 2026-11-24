import { useMemo } from 'react'
import { useLibrary } from '../context/LibraryContext'
import { STATUS, STATUS_META, SUBJECTS } from '../utils/constants'
import { isSameMonth, lastSixMonths } from '../utils/helpers'

const SUBJECT_LABELS = Object.fromEntries(SUBJECTS.map((subject) => [subject.value, subject.label]))

function subjectLabel(subject) {
  const key = String(subject).toLowerCase().replace(/[\s-]+/g, '_')
  if (SUBJECT_LABELS[key]) return SUBJECT_LABELS[key]
  return String(subject)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function useLibraryStats() {
  const { library, goal } = useLibrary()

  return useMemo(() => {
    const read = library.filter((book) => book.status === STATUS.READ)
    const reading = library.filter((book) => book.status === STATUS.READING)
    const want = library.filter((book) => book.status === STATUS.WANT)
    const monthlyRead = read.filter((book) => isSameMonth(book.finishedAt || book.statusChangedAt))

    const statusData = [STATUS.WANT, STATUS.READING, STATUS.READ].map((status) => ({
      name: STATUS_META[status].label,
      value: library.filter((book) => book.status === status).length,
      color: STATUS_META[status].bar,
    }))

    const monthlySeries = lastSixMonths().map((month) => ({
      label: month.label,
      kitap: read.filter((book) => {
        const date = new Date(book.finishedAt || book.statusChangedAt)
        return (
          !Number.isNaN(date.getTime()) &&
          date.getFullYear() === month.year &&
          date.getMonth() === month.month
        )
      }).length,
    }))

    const categoryCounts = new Map()
    read.forEach((book) => {
      ;(book.subjects || []).slice(0, 4).forEach((subject) => {
        const label = subjectLabel(subject)
        categoryCounts.set(label, (categoryCounts.get(label) || 0) + 1)
      })
    })
    const categoryData = [...categoryCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const target = goal.monthlyTarget || 1
    const progress = Math.min(100, Math.round((monthlyRead.length / target) * 100))

    return {
      total: library.length,
      readCount: read.length,
      readingCount: reading.length,
      wantCount: want.length,
      monthlyReadCount: monthlyRead.length,
      progress,
      target: goal.monthlyTarget,
      statusData,
      monthlySeries,
      categoryData,
      recent: [...library].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)),
      continueReading: [...reading].sort(
        (a, b) => new Date(b.statusChangedAt || b.addedAt) - new Date(a.statusChangedAt || a.addedAt),
      ),
    }
  }, [library, goal.monthlyTarget])
}
