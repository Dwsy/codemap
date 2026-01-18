import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface EditorState {
  theme: string
  fontSize: number
  tabSize: number
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all'
  autoSave: boolean
  autoSaveDelay: number
}

const defaultState: EditorState = {
  theme: 'vscode-dark',
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  lineNumbers: 'on',
  renderWhitespace: 'trailing',
  autoSave: false,
  autoSaveDelay: 1000
}

export const useEditorStore = defineStore('editor', () => {
  const state = ref<EditorState>({ ...defaultState })

  const fontSize = computed(() => state.value.fontSize)
  const tabSize = computed(() => state.value.tabSize)
  const wordWrap = computed(() => state.value.wordWrap)
  const minimap = computed(() => state.value.minimap)
  const lineNumbers = computed(() => state.value.lineNumbers)
  const renderWhitespace = computed(() => state.value.renderWhitespace)
  const autoSave = computed(() => state.value.autoSave)

  function loadState() {
    try {
      const saved = localStorage.getItem('codemap-editor-state')
      if (saved) {
        const parsed = JSON.parse(saved)
        state.value = { ...defaultState, ...parsed }
      }
    } catch (error) {
      console.error('Failed to load editor state:', error)
    }
  }

  function saveState() {
    try {
      localStorage.setItem('codemap-editor-state', JSON.stringify(state.value))
    } catch (error) {
      console.error('Failed to save editor state:', error)
    }
  }

  function updateState(updates: Partial<EditorState>) {
    state.value = { ...state.value, ...updates }
    saveState()
  }

  function setTheme(theme: string) {
    state.value.theme = theme
    saveState()
  }

  function setFontSize(size: number) {
    state.value.fontSize = Math.max(10, Math.min(32, size))
    saveState()
  }

  function setTabSize(size: number) {
    state.value.tabSize = Math.max(1, Math.min(8, size))
    saveState()
  }

  function setWordWrap(wrap: EditorState['wordWrap']) {
    state.value.wordWrap = wrap
    saveState()
  }

  function toggleMinimap() {
    state.value.minimap = !state.value.minimap
    saveState()
  }

  function setLineNumbers(numbers: EditorState['lineNumbers']) {
    state.value.lineNumbers = numbers
    saveState()
  }

  function setRenderWhitespace(whitespace: EditorState['renderWhitespace']) {
    state.value.renderWhitespace = whitespace
    saveState()
  }

  function toggleAutoSave() {
    state.value.autoSave = !state.value.autoSave
    saveState()
  }

  function setAutoSaveDelay(delay: number) {
    state.value.autoSaveDelay = Math.max(100, Math.min(10000, delay))
    saveState()
  }

  function resetState() {
    state.value = { ...defaultState }
    saveState()
  }

  function getEditorOptions() {
    return {
      fontSize: state.value.fontSize,
      tabSize: state.value.tabSize,
      wordWrap: state.value.wordWrap,
      minimap: { enabled: state.value.minimap },
      lineNumbers: state.value.lineNumbers,
      renderWhitespace: state.value.renderWhitespace,
      automaticLayout: true,
      scrollBeyondLastLine: false
    }
  }

  loadState()

  return {
    state,
    fontSize,
    tabSize,
    wordWrap,
    minimap,
    lineNumbers,
    renderWhitespace,
    autoSave,
    updateState,
    setTheme,
    setFontSize,
    setTabSize,
    setWordWrap,
    toggleMinimap,
    setLineNumbers,
    setRenderWhitespace,
    toggleAutoSave,
    setAutoSaveDelay,
    resetState,
    getEditorOptions
  }
})