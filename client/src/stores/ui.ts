import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

interface UIPreference {
  sidebarOpen: boolean
  codePanelOpen: boolean
  selectedView: 'mermaid' | 'infographic' | 'traces'
  theme: 'dark' | 'light'
}

const STORAGE_KEY = 'codemap-ui-preference'

function loadFromStorage(): UIPreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load UI preferences:', e)
  }

  return {
    sidebarOpen: true,
    codePanelOpen: false,
    selectedView: 'mermaid',
    theme: 'dark'
  }
}

function saveToStorage(preference: UIPreference) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference))
  } catch (e) {
    console.error('Failed to save UI preferences:', e)
  }
}

export const useUiStore = defineStore('ui', () => {
  const initialPreference = loadFromStorage()

  const sidebarOpen = ref(initialPreference.sidebarOpen)
  const codePanelOpen = ref(initialPreference.codePanelOpen)
  const selectedView = ref<'mermaid' | 'infographic' | 'traces'>(initialPreference.selectedView)
  const theme = ref<'dark' | 'light'>(initialPreference.theme)
  const isDark = computed(() => theme.value === 'dark')

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleCodePanel() {
    codePanelOpen.value = !codePanelOpen.value
  }

  function setSelectedView(view: 'mermaid' | 'infographic' | 'traces') {
    selectedView.value = view
  }

  function setTheme(newTheme: 'dark' | 'light') {
    theme.value = newTheme
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function resetPreferences() {
    sidebarOpen.value = true
    codePanelOpen.value = false
    selectedView.value = 'mermaid'
    theme.value = 'dark'
  }

  watch(
    [sidebarOpen, codePanelOpen, selectedView, theme],
    () => {
      saveToStorage({
        sidebarOpen: sidebarOpen.value,
        codePanelOpen: codePanelOpen.value,
        selectedView: selectedView.value,
        theme: theme.value
      })
    },
    { deep: true }
  )

  return {
    sidebarOpen,
    codePanelOpen,
    selectedView,
    theme,
    isDark,
    toggleSidebar,
    toggleCodePanel,
    setSelectedView,
    setTheme,
    toggleTheme,
    resetPreferences
  }
})