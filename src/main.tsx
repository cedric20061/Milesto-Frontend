import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
//@ts-ignore
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {
    // Optionnel : afficher une notification que l'update est dispo
    console.log('Nouveau contenu disponible, actualisez la page.')
  },
  onOfflineReady() {
    console.log('L’app est prête à être utilisée hors-ligne.')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
