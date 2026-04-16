import App from '@/App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DialogProvider } from '@/contexts/DialogContext'
import Dialog from '@/components/Dialog'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DialogProvider>
      <App />
      <Dialog />
    </DialogProvider>
  </StrictMode>,
)
