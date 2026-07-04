import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import { ThemeProvider } from '@/context/ThemeProvider'
import { initAuditDomain } from '@/utils/auditStorage'
import '@/styles/globals.css'

initAuditDomain()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
