import { ref, computed } from 'vue'
import type * as monaco from 'monaco-editor'

interface SearchResult {
  file: string
  line: number
  column: number
  text: string
  context: {
    before: string
    after: string
  }
}

interface SearchOptions {
  matchCase: boolean
  matchWholeWord: boolean
  regex: boolean
  useExclude: boolean
  excludePattern: string
  includePattern: string
}

const defaultOptions: SearchOptions = {
  matchCase: false,
  matchWholeWord: false,
  regex: false,
  useExclude: false,
  excludePattern: '**/node_modules/**',
  includePattern: '**/*.{js,ts,jsx,tsx,vue,css,html,json,md}'
}

export function useCodeSearch() {
  const isSearching = ref(false)
  const query = ref('')
  const options = ref<SearchOptions>({ ...defaultOptions })
  const results = ref<SearchResult[]>([])
  const selectedIndex = ref(0)

  const resultCount = computed(() => results.value.length)
  const hasResults = computed(() => results.value.length > 0)

  function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function buildRegex(query: string, opts: SearchOptions): RegExp {
    let pattern = opts.regex ? query : escapeRegex(query)

    if (opts.matchWholeWord) {
      pattern = `\\b${pattern}\\b`
    }

    try {
      return new RegExp(pattern, opts.matchCase ? 'g' : 'gi')
    } catch (error) {
      console.error('Invalid regex pattern:', error)
      return new RegExp(escapeRegex(query), 'gi')
    }
  }

  async function searchInFile(filePath: string, pattern: RegExp): Promise<SearchResult[]> {
    try {
      const response = await fetch(`/api/v1/files/content?path=${encodeURIComponent(filePath)}`)
      if (!response.ok) {
        return []
      }

      const { content } = await response.json()
      const lines = content.split('\n')
      const fileResults: SearchResult[] = []

      lines.forEach((line, index) => {
        const matches = line.matchAll(pattern)
        for (const match of matches) {
          if (match.index !== undefined) {
            fileResults.push({
              file: filePath,
              line: index + 1,
              column: match.index + 1,
              text: line.trim(),
              context: {
                before: lines[Math.max(0, index - 2)]?.trim() || '',
                after: lines[Math.min(lines.length - 1, index + 2)]?.trim() || ''
              }
            })
          }
        }
      })

      return fileResults
    } catch (error) {
      console.error(`Error searching in file ${filePath}:`, error)
      return []
    }
  }

  async function searchFiles(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return []
    }

    isSearching.value = true
    results.value = []

    try {
      const response = await fetch('/api/v1/files/tree')
      if (!response.ok) {
        throw new Error('Failed to load file tree')
      }

      const fileTree = await response.json()
      const files = collectFiles(fileTree)

      const pattern = buildRegex(query, options.value)
      const allResults: SearchResult[] = []

      for (const file of files) {
        const fileResults = await searchInFile(file.path, pattern)
        allResults.push(...fileResults)
      }

      return allResults
    } catch (error) {
      console.error('Search error:', error)
      return []
    } finally {
      isSearching.value = false
    }
  }

  function collectFiles(items: any[]): { path: string }[] {
    const files: { path: string }[] = []

    function traverse(items: any[]) {
      for (const item of items) {
        if (item.type === 'file') {
          files.push(item)
        } else if (item.children) {
          traverse(item.children)
        }
      }
    }

    traverse(items)
    return files
  }

  async function performSearch() {
    if (!query.value.trim()) {
      results.value = []
      return
    }

    results.value = await searchFiles(query.value)
    selectedIndex.value = 0
  }

  function selectNext() {
    if (hasResults.value) {
      selectedIndex.value = (selectedIndex.value + 1) % resultCount.value
    }
  }

  function selectPrevious() {
    if (hasResults.value) {
      selectedIndex.value = (selectedIndex.value - 1 + resultCount.value) % resultCount.value
    }
  }

  function clearResults() {
    results.value = []
    selectedIndex.value = 0
  }

  function updateOptions(newOptions: Partial<SearchOptions>) {
    options.value = { ...options.value, ...newOptions }
  }

  function resetOptions() {
    options.value = { ...defaultOptions }
  }

  function highlightMatch(text: string, pattern: RegExp): string {
    return text.replace(pattern, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">$&</mark>')
  }

  return {
    isSearching,
    query,
    options,
    results,
    selectedIndex,
    resultCount,
    hasResults,
    performSearch,
    selectNext,
    selectPrevious,
    clearResults,
    updateOptions,
    resetOptions,
    highlightMatch
  }
}