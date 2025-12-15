import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VisitorModeProvider } from './context/VisitorModeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VisitorModeProvider>
      <App />
    </VisitorModeProvider>
  </StrictMode>,
)
