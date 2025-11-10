import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { LocaleProvider } from './context/LocaleContext'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </HelmetProvider>
  </StrictMode>,
)
