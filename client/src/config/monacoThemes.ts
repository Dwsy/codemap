export interface MonacoTheme {
  id: string
  name: string
  type: 'dark' | 'light'
  data: any
}

export const monacoThemes: MonacoTheme[] = [
  {
    id: 'vscode-dark',
    name: 'VS Code Dark',
    type: 'dark',
    data: {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'operator', foreground: 'D4D4D4' }
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2A2D2E',
        'editorCursor.foreground': '#AEAFAD',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41'
      }
    }
  },
  {
    id: 'vscode-light',
    name: 'VS Code Light',
    type: 'light',
    data: {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'type', foreground: '267F99' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
        { token: 'operator', foreground: '000000' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#F0F0F0',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1'
      }
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    type: 'dark',
    data: {
      base: 'vs-dark',
      inherit: false,
      rules: [
        { token: 'comment', foreground: '75715E' },
        { token: 'keyword', foreground: 'F92672' },
        { token: 'string', foreground: 'E6DB74' },
        { token: 'number', foreground: 'AE81FF' },
        { token: 'type', foreground: '66D9EF' },
        { token: 'function', foreground: 'A6E22E' },
        { token: 'variable', foreground: 'F8F8F2' },
        { token: 'operator', foreground: 'F92672' },
        { token: 'tag', foreground: 'F92672' },
        { token: 'attribute.name', foreground: 'A6E22E' },
        { token: 'attribute.value', foreground: 'E6DB74' }
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#F8F8F2',
        'editor.lineHighlightBackground': '#3E3D32',
        'editorCursor.foreground': '#F8F8F0',
        'editor.selectionBackground': '#49483E',
        'editor.inactiveSelectionBackground': '#3E3D32'
      }
    }
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    type: 'dark',
    data: {
      base: 'vs-dark',
      inherit: false,
      rules: [
        { token: 'comment', foreground: '586E75' },
        { token: 'keyword', foreground: '859900' },
        { token: 'string', foreground: '2AA198' },
        { token: 'number', foreground: 'D33682' },
        { token: 'type', foreground: 'B58900' },
        { token: 'function', foreground: '268BD2' },
        { token: 'variable', foreground: '839496' },
        { token: 'operator', foreground: '839496' },
        { token: 'constant', foreground: 'CB4B16' }
      ],
      colors: {
        'editor.background': '#002B36',
        'editor.foreground': '#839496',
        'editor.lineHighlightBackground': '#073642',
        'editorCursor.foreground': '#839496',
        'editor.selectionBackground': '#073642',
        'editor.inactiveSelectionBackground': '#073642'
      }
    }
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    type: 'light',
    data: {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'comment', foreground: '93A1A1' },
        { token: 'keyword', foreground: '859900' },
        { token: 'string', foreground: '2AA198' },
        { token: 'number', foreground: 'D33682' },
        { token: 'type', foreground: 'B58900' },
        { token: 'function', foreground: '268BD2' },
        { token: 'variable', foreground: '657B83' },
        { token: 'operator', foreground: '657B83' },
        { token: 'constant', foreground: 'CB4B16' }
      ],
      colors: {
        'editor.background': '#FDF6E3',
        'editor.foreground': '#657B83',
        'editor.lineHighlightBackground': '#EEE8D5',
        'editorCursor.foreground': '#657B83',
        'editor.selectionBackground': '#EEE8D5',
        'editor.inactiveSelectionBackground': '#EEE8D5'
      }
    }
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    type: 'dark',
    data: {
      base: 'vs-dark',
      inherit: false,
      rules: [
        { token: 'comment', foreground: '8B949E' },
        { token: 'keyword', foreground: 'FF7B72' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'type', foreground: 'FFA657' },
        { token: 'function', foreground: 'D2A8FF' },
        { token: 'variable', foreground: 'FFA657' },
        { token: 'operator', foreground: 'FF7B72' },
        { token: 'tag', foreground: '7EE787' },
        { token: 'attribute.name', foreground: '79C0FF' },
        { token: 'attribute.value', foreground: 'A5D6FF' }
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#C9D1D9',
        'editor.lineHighlightBackground': '#161B22',
        'editorCursor.foreground': '#C9D1D9',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#161B22'
      }
    }
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    type: 'light',
    data: {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'comment', foreground: '6E7781' },
        { token: 'keyword', foreground: 'CF222E' },
        { token: 'string', foreground: '0A3069' },
        { token: 'number', foreground: '0550AE' },
        { token: 'type', foreground: '953800' },
        { token: 'function', foreground: '8250DF' },
        { token: 'variable', foreground: '953800' },
        { token: 'operator', foreground: 'CF222E' },
        { token: 'tag', foreground: '116329' },
        { token: 'attribute.name', foreground: '0550AE' },
        { token: 'attribute.value', foreground: '0A3069' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#24292F',
        'editor.lineHighlightBackground': '#F6F8FA',
        'editorCursor.foreground': '#24292F',
        'editor.selectionBackground': '#B6E3FF',
        'editor.inactiveSelectionBackground': '#F6F8FA'
      }
    }
  }
]

export function getThemeById(id: string): MonacoTheme | undefined {
  return monacoThemes.find(theme => theme.id === id)
}

export function getThemesByType(type: 'dark' | 'light'): MonacoTheme[] {
  return monacoThemes.filter(theme => theme.type === type)
}

export function getDefaultTheme(isDark: boolean): MonacoTheme {
  const type = isDark ? 'dark' : 'light'
  const themes = getThemesByType(type)
  return themes[0] || monacoThemes[0]
}