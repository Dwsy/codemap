import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/utils/apiClient'
import type { Project } from '@/types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
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
      const data = await apiClient.get<Project[]>('/api/v1/projects', {}, { ttl: cacheTime })
      projects.value = data
      lastFetched.value = Date.now()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function fetchByPath(path: string) {
    loading.value = true
    error.value = null

    try {
      const data = await apiClient.get<Project>(`/api/v1/projects/${encodeURIComponent(path)}`)
      console.log('projects.ts - fetchByPath received data:', data)
      console.log('projects.ts - current projects:', projects.value)

      const existingIndex = projects.value.findIndex(p => p.path === path)

      if (existingIndex >= 0) {
        projects.value[existingIndex] = data
        console.log('projects.ts - updated existing project at index:', existingIndex)
      } else {
        projects.value.push(data)
        console.log('projects.ts - added new project, total:', projects.value.length)
      }

      console.log('projects.ts - projects after update:', projects.value)
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('projects.ts - fetchByPath error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    projects.value = []
    lastFetched.value = null
    error.value = null
    apiClient.clearCache('/api/v1/projects')
  }

  function getProjectByPath(path: string): Project | undefined {
    return projects.value.find(p => p.path === path)
  }

  return {
    projects,
    loading,
    error,
    lastFetched,
    fetchAll,
    fetchByPath,
    clearCache,
    getProjectByPath
  }
})