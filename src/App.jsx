import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import Library from './pages/Library'
import BookDetail from './pages/BookDetail'
import Statistics from './pages/Statistics'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="discover" element={<Discover />} />
          <Route path="library" element={<Library />} />
          <Route path="book/:key" element={<BookDetail />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
