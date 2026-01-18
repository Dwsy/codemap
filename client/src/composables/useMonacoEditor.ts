import { ref, onUnmounted } from 'vue'
import { loader } from '@guolao/vue-monaco-editor'
import type * as Monaco from 'monaco-editor'

declare global {
  interface Window {
    monaco?: any
  }
}

export interface MonacoEditorConfig {
  language?: string
  theme?: 'vs' | 'vs-dark' | 'hc-black'
  readOnly?: boolean
  minimap?: boolean
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  fontSize?: number
  fontFamily?: string
  wordWrap?: 'on' | 'off'
  autoIndent?: 'none' | 'keep' | 'brackets' | 'advanced' | 'full'
  formatOnPaste?: boolean
  formatOnType?: boolean
}

export function useMonacoEditor() {
  const isReady = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  loader.config({
    paths: {
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
    }
  })

  async function initMonaco() {
    if (!isReady.value) {
      isLoading.value = true
      error.value = null

      try {
        await loader.init()
        isReady.value = true
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to initialize Monaco Editor'
        throw e
      } finally {
        isLoading.value = false
      }
    }
  }

  function getLanguageFromPath(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase()

    const languageMap: Record<string, string> = {
      ts: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      tsx: 'typescript',
      vue: 'vue',
      html: 'html',
      css: 'css',
      scss: 'scss',
      less: 'less',
      json: 'json',
      md: 'markdown',
      py: 'python',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      java: 'java',
      kt: 'kotlin',
      swift: 'swift',
      cpp: 'cpp',
      c: 'c',
      h: 'c',
     hpp: 'cpp',
      cs: 'csharp',
      php: 'php',
      sh: 'shell',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      sql: 'sql',
      graphql: 'graphql'
    }

    return languageMap[ext || ''] || 'plaintext'
  }

  function createEditorOptions(config: MonacoEditorConfig = {}): Monaco.editor.IStandaloneEditorConstructionOptions {
    return {
      value: '',
      language: config.language || 'typescript',
      theme: config.theme || 'vs-dark',
      readOnly: config.readOnly !== false,
      minimap: { enabled: config.minimap !== false },
      lineNumbers: config.lineNumbers || 'on',
      fontSize: config.fontSize || 14,
      fontFamily: config.fontFamily || "'JetBrains Mono', 'Fira Code', monospace",
      wordWrap: config.wordWrap || 'off',
      autoIndent: config.autoIndent || 'advanced',
      formatOnPaste: config.formatOnPaste !== false,
      formatOnType: config.formatOnType !== false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderWhitespace: 'selection',
      renderLineHighlight: 'all',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true,
      contextmenu: true,
      mouseWheelZoom: true,
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      matchBrackets: 'always',
      bracketPairColorization: {
        enabled: true
      },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      padding: {
        top: 16,
        bottom: 16
      }
    }
  }

  function createDecorations(line: number): Monaco.editor.IModelDeltaDecoration[] {
    return [
      {
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1073741824
        },
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
          glyphMarginClassName: 'highlighted-line-glyph'
        }
      }
    ]
  }

  async function loadMonaco(): Promise<any> {
    if (!isReady.value) {
      await initMonaco()
    }
    return { monaco: loader.__getMonacoInstance?.() || window.monaco }
  }

  function dispose() {
    isReady.value = false
    error.value = null
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    isReady,
    isLoading,
    error,
    initMonaco,
    loadMonaco,
    getLanguageFromPath,
    createEditorOptions,
    createDecorations,
    dispose
  }
}