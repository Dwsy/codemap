import { ref } from 'vue'

interface FormatOptions {
  prettier?: boolean
  tabWidth?: number
  useTabs?: boolean
  semi?: boolean
  singleQuote?: boolean
  trailingComma?: 'none' | 'es5' | 'all'
}

const defaultOptions: FormatOptions = {
  prettier: false,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: 'es5'
}

export function useCodeFormat() {
  const options = ref<FormatOptions>({ ...defaultOptions })
  const isFormatting = ref(false)

  function detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || ''

    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'json': 'json',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'less': 'less',
      'md': 'markdown',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml'
    }

    return languageMap[ext] || 'plaintext'
  }

  async function formatWithMonaco(code: string, language: string, model: any): Promise<string> {
    try {
      const result = await monaco.editor.format(model.getFullModelRange(), {
        insertSpaces: !options.value.useTabs,
        tabSize: options.value.tabWidth
      })
      return model.applyEdits(result)
    } catch (error) {
      console.error('Monaco format error:', error)
      return code
    }
  }

  async function formatWithPrettier(code: string, language: string): Promise<string> {
    if (!options.value.prettier) {
      return code
    }

    try {
      const prettier = await import('prettier/standalone')
      const parsers: Record<string, any> = {}

      try {
        parsers.babel = await import('prettier/plugins/babel')
        parsers.typescript = await import('prettier/plugins/typescript')
        parsers.html = await import('prettier/plugins/html')
        parsers.css = await import('prettier/plugins/postcss')
        parsers.markdown = await import('prettier/plugins/markdown')
      } catch (e) {
        console.warn('Some Prettier plugins not available:', e)
      }

      const parserMap: Record<string, string> = {
        'javascript': 'babel',
        'typescript': 'typescript',
        'json': 'babel',
        'html': 'html',
        'css': 'css',
        'scss': 'css',
        'markdown': 'markdown'
      }

      const parser = parserMap[language] || 'babel'
      const plugins = parsers[parser] ? [parsers[parser]] : []

      return prettier.format(code, {
        parser,
        plugins,
        tabWidth: options.value.tabWidth,
        useTabs: options.value.useTabs,
        semi: options.value.semi,
        singleQuote: options.value.singleQuote,
        trailingComma: options.value.trailingComma,
        printWidth: 100
      })
    } catch (error) {
      console.error('Prettier format error:', error)
      return code
    }
  }

  async function formatCode(code: string, filename: string, model?: any): Promise<string> {
    isFormatting.value = true

    try {
      const language = detectLanguage(filename)

      if (options.value.prettier) {
        return await formatWithPrettier(code, language)
      } else if (model) {
        return await formatWithMonaco(code, language, model)
      }

      return code
    } finally {
      isFormatting.value = false
    }
  }

  function updateOptions(newOptions: Partial<FormatOptions>) {
    options.value = { ...options.value, ...newOptions }
  }

  function resetOptions() {
    options.value = { ...defaultOptions }
  }

  function getSupportedLanguages(): string[] {
    return [
      'javascript',
      'typescript',
      'json',
      'html',
      'css',
      'scss',
      'markdown'
    ]
  }

  return {
    options,
    isFormatting,
    formatCode,
    detectLanguage,
    updateOptions,
    resetOptions,
    getSupportedLanguages
  }
}