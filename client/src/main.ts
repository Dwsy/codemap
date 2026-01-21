import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import App from './App.vue'
import './styles/main.css'

// Configure Monaco workers before any Monaco instance is created
import { configureMonacoWorkers } from './config/monacoWorkers'
configureMonacoWorkers()

const app = createApp(App)

// Vapor Mode（可选，Vue 3.6+）
if (import.meta.env.VITE_ENABLE_VAPOR === 'true') {
  try {
    const { vaporInteropPlugin } = await import('vue')
    app.use(vaporInteropPlugin)
    console.log('✅ Vapor Mode enabled')
  } catch (e) {
    console.warn('⚠️ Failed to enable Vapor Mode')
  }
}

app.use(createPinia())
app.use(router)

app.mount('#app')

// Register Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope)
      })
      .catch((error) => {
        console.warn('⚠️ Service Worker registration failed:', error)
      })
  })
}