import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LibraryProvider } from './context/LibraryContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH || '/'}>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
