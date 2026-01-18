<template>
  <aside
    :class="[
      'fixed top-14 left-0 bottom-0 z-40 bg-gray-800 text-white transition-all duration-300 border-r border-gray-700 flex-shrink-0 overflow-hidden',
      sidebarOpen ? 'w-64' : 'w-0'
    ]"
  >
    <div class="p-4 h-full overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold">项目列表</h2>
        <div class="text-xs text-gray-400">
          {{ projects.length }} 个项目
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div
        v-else-if="error"
        class="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4"
      >
        <div class="flex items-center gap-2 text-sm text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span class="truncate">{{ error }}</span>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="text-center py-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-gray-600 mx-auto mb-2"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <p class="text-sm text-gray-400">暂无项目</p>
      </div>

      <ul v-else class="space-y-2">
        <li v-for="project in projects" :key="project.path">
          <router-link
            :to="`/project/${encodeURIComponent(project.path)}`"
            class="block p-3 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-transparent hover:border-gray-600"
            active-class="bg-gray-700 border-gray-600"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-0.5">
                <div class="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-blue-400"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-gray-100 truncate">
                  {{ project.name }}
                </div>
                <div class="text-xs text-gray-400 truncate mt-1">
                  {{ project.description || project.path }}
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useUiStore } from '@/stores/ui'

const projectsStore = useProjectsStore()
const uiStore = useUiStore()

const loading = computed(() => projectsStore.loading ?? false)
const error = computed(() => projectsStore.error ?? null)
const projects = computed(() => projectsStore.projects ?? [])
const sidebarOpen = computed(() => uiStore.sidebarOpen ?? true)

onMounted(() => {
  projectsStore.fetchAll()
})
</script>