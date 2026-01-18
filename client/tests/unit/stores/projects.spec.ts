import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectsStore } from '@/stores/projects'

describe('useProjectsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  it('should initialize with empty state', () => {
    const store = useProjectsStore()

    expect(store.projects).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should fetch projects successfully', async () => {
    const mockProjects = [
      { path: '/path/to/project1', name: 'Project 1', description: 'Description 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { path: '/path/to/project2', name: 'Project 2', description: 'Description 2', createdAt: '2024-01-02', updatedAt: '2024-01-02' }
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockProjects })
    })

    const store = useProjectsStore()
    await store.fetchAll()

    expect(store.projects).toEqual(mockProjects)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const store = useProjectsStore()
    await store.fetchAll()

    expect(store.projects).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).not.toBeNull()
  })

  it('should get project by path', async () => {
    const mockProjects = [
      { path: '/path/to/project1', name: 'Project 1', description: 'Description 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockProjects })
    })

    const store = useProjectsStore()
    await store.fetchAll()

    const project = store.getProjectByPath('/path/to/project1')
    expect(project).toEqual(mockProjects[0])
  })

  it('should return undefined for non-existent project', async () => {
    const mockProjects = [
      { path: '/path/to/project1', name: 'Project 1', description: 'Description 1', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
    ]

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockProjects })
    })

    const store = useProjectsStore()
    await store.fetchAll()

    const project = store.getProjectByPath('/path/to/nonexistent')
    expect(project).toBeUndefined()
  })
})