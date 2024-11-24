import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service Worker Registered');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
