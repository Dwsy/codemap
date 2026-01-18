import { ref, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { monacoThemes, getDefaultTheme, getThemeById, type MonacoTheme } from '@/config/monacoThemes'
import { useUiStore } from '@/stores/ui'

const STORAGE_KEY = 'codemap-monaco-theme'

export function useMonacoTheme() {
  const uiStore = useUiStore()
  const currentTheme = ref<MonacoTheme>(monacoThemes[0])
  const isLoaded = ref(false)

  function loadTheme(): string {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const theme = getThemeById(saved)
      if (theme) {
        return theme.id
      }
    }

    const defaultTheme = getDefaultTheme(uiStore.isDark)
    return defaultTheme.id
  }

  function applyTheme(theme: MonacoTheme) {
    try {
      monaco.editor.defineTheme(theme.id, theme.data)
      monaco.editor.setTheme(theme.id)
      currentTheme.value = theme
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to apply theme:', error)
    }
  }

  function setTheme(themeId: string) {
    const theme = getThemeById(themeId)
    if (theme) {
      applyTheme(theme)
      localStorage.setItem(STORAGE_KEY, themeId)
    }
  }

  function setThemeByDarkMode(isDark: boolean) {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedTheme = saved ? getThemeById(saved) : null

    if (savedTheme && savedTheme.type === (isDark ? 'dark' : 'light')) {
      applyTheme(savedTheme)
    } else {
      const theme = getDefaultTheme(isDark)
      applyTheme(theme)
      localStorage.setItem(STORAGE_KEY, theme.id)
    }
  }

  function resetTheme() {
    const theme = getDefaultTheme(uiStore.isDark)
    setTheme(theme.id)
  }

  function initThemes() {
    monacoThemes.forEach(theme => {
      try {
        monaco.editor.defineTheme(theme.id, theme.data)
      } catch (error) {
        console.error(`Failed to define theme ${theme.id}:`, error)
      }
    })

    const themeId = loadTheme()
    setTheme(themeId)
  }

  watch(
    () => uiStore.isDark,
    (isDark) => {
      setThemeByDarkMode(isDark)
    }
  )

  return {
    currentTheme,
    isLoaded,
    themes: monacoThemes,
    setTheme,
    setThemeByDarkMode,
    resetTheme,
    initThemes
  }
}