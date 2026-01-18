import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/utils/apiClient'
import type { CodeMap } from '@/types'

export const useCodeMapsStore = defineStore('codemaps', () => {
  const codemaps = ref<CodeMap[]>([])
  const currentCodeMap = ref<CodeMap | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetched = ref<number | null>(null)

  async function fetchAll(forceRefresh = false) {
    const cacheTime = 5 * 60 * 1000

    if (!forceRefresh && lastFetched.value && Date.now() - lastFetched.value < cacheTime) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await apiClient.get<CodeMap[]>('/api/v1/codemaps', {}, { ttl: cacheTime })
      codemaps.value = data
      lastFetched.value = Date.now()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string, forceRefresh = false) {
    const cached = currentCodeMap.value?.id === id && !forceRefresh

    if (cached) {
      return currentCodeMap.value
    }

    loading.value = true
    error.value = null

    try {
      const data = await apiClient.get<CodeMap>(`/api/v1/codemaps/${id}`)
      currentCodeMap.value = data

      const existingIndex = codemaps.value.findIndex(c => c.id === id)
      if (existingIndex >= 0) {
        codemaps.value[existingIndex] = data
      }

      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchByProject(projectPath: string) {
    loading.value = true
    error.value = null

    try {
      const data = await apiClient.get<CodeMap[]>(`/api/v1/projects/${encodeURIComponent(projectPath)}/codemaps`)
      console.log('codemaps.ts - fetchByProject received data count:', data.length)
      codemaps.value = data
      console.log('codemaps.ts - codemaps.value updated:', codemaps.value.length)
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('codemaps.ts - fetchByProject error:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    codemaps.value = []
    currentCodeMap.value = null
    lastFetched.value = null
    error.value = null
    apiClient.clearCache('/api/v1/codemaps')
  }

  function getCodeMapById(id: string): CodeMap | undefined {
    return codemaps.value.find(c => c.id === id)
  }

  function getCodeMapsByProject(projectPath: string): CodeMap[] {
    return codemaps.value.filter(c => c.projectPath === projectPath)
  }

  return {
    codemaps,
    currentCodeMap,
    loading,
    error,
    lastFetched,
    fetchAll,
    fetchById,
    fetchByProject,
    clearCache,
    getCodeMapById,
    getCodeMapsByProject
  }
})