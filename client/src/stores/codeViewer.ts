import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/utils/apiClient'
import type { FileContent } from '@/types'

export const useCodeViewerStore = defineStore('codeViewer', () => {
  const isOpen = ref(false)
  const currentFile = ref<FileContent | null>(null)
  const currentLine = ref<number | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fileCache = ref<Map<string, FileContent>>(new Map())

  async function openFile(filePath: string, line?: number) {
    console.log('Opening file:', { filePath, line })
    
    const cached = fileCache.value.get(filePath)

    if (cached) {
      console.log('Using cached file')
      currentFile.value = cached
      currentLine.value = line || null
      isOpen.value = true
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await apiClient.get<FileContent>(`/api/v1/files?path=${encodeURIComponent(filePath)}`)
      console.log('File loaded:', { path: data.path, contentLength: data.content?.length })
      currentFile.value = data
      currentLine.value = line || null
      isOpen.value = true
      fileCache.value.set(filePath, data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Failed to load file:', error.value)
    } finally {
      loading.value = false
    }
  }

  function closePanel() {
    isOpen.value = false
    currentFile.value = null
    currentLine.value = null
  }

  function goToLine(line: number) {
    currentLine.value = line
  }

  function clearCache() {
    fileCache.value.clear()
  }

  function invalidateCache(filePath: string) {
    fileCache.value.delete(filePath)
  }

  return {
    isOpen,
    currentFile,
    currentLine,
    loading,
    error,
    fileCache,
    openFile,
    closePanel,
    goToLine,
    clearCache,
    invalidateCache
  }
})