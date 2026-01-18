import { vi } from 'vitest'
import { config } from '@vue/test-utils'

config.global.stubs = {
  RouterLink: true,
  RouterView: true
}

vi.mock('monaco-editor', () => ({
  editor: {
    create: vi.fn(),
    createModel: vi.fn(),
    defineTheme: vi.fn(),
    setTheme: vi.fn(),
    createDiffEditor: vi.fn()
  },
  languages: {
    getLanguages: vi.fn()
  }
}))

vi.mock('@guolao/vue-monaco-editor', () => ({
  MonacoEditor: {
    name: 'MonacoEditor',
    template: '<div class="monaco-editor-mock"></div>',
    props: ['modelValue', 'language', 'options', 'theme', 'height']
  }
}))