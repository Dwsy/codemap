<template>
  <div class="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto">
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6"
      >
        <div class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-red-500 dark:text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-900 dark:text-red-100">
              加载失败
            </h3>
            <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
          </div>
          <button
            @click="loadProject"
            class="ml-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            重试
          </button>
        </div>
      </div>

      <div v-else-if="project">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <router-link
              to="/"
              class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              返回项目列表
            </router-link>
            <span class="text-gray-400 dark:text-gray-600">/</span>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ project.name }}
            </h1>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            {{ project.description || '暂无描述' }}
          </p>
          <div class="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span>{{ project.path }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>注册于 {{ formatDate(project.registeredAt) }}</span>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            CodeMaps
          </h2>

          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="i in 4"
              :key="i"
              class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div class="animate-pulse">
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-2/3"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div
            v-else-if="codemaps.length === 0"
            class="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-gray-400 dark:text-gray-600 mx-auto mb-4"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              暂无 CodeMaps
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              该项目还没有 CodeMaps
            </p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="codemap in codemaps"
              :key="codemap.id"
              class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
              @click="navigateToCodeMap(codemap.id)"
            >
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ codemap.name }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {{ codemap.description || '暂无描述' }}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-gray-400 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>

                <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span v-if="codemap.mermaidDiagram">流程图</span>
                    <span v-if="codemap.infographicSteps && codemap.infographicSteps.length">信息图</span>
                    <span v-if="codemap.traces && codemap.traces.length">追踪链路</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>更新于 {{ formatDate(codemap.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useCodeMapsStore } from '@/stores/codemaps'

const router = useRouter()
const route = useRoute()
const projectsStore = useProjectsStore()
const codemapsStore = useCodeMapsStore()

const projectPath = computed(() => {
  const path = route.params.path as string | undefined
  const decoded = path ? decodeURIComponent(path) : null
  console.log('Project.vue - projectPath:', { path, decoded })
  return decoded
})

const loading = computed(() => projectsStore.loading || codemapsStore.loading)
const error = computed(() => projectsStore.error ?? codemapsStore.error ?? null)
const project = computed(() => {
  if (!projectPath.value) return null
  const projects = projectsStore.projects ?? []
  return projects.find(p => p.path === projectPath.value) || null
})
const codemaps = computed(() => {
  if (!projectPath.value) return []
  const codemapsStoreCodemaps = codemapsStore.codemaps ?? []
  return codemapsStoreCodemaps.filter(c => c.projectPath === projectPath.value)
})

async function loadProject() {
  if (!projectPath.value) return

  // 先加载所有项目（如果还没有加载）
  const allProjects = projectsStore.projects ?? []
  if (allProjects.length === 0) {
    await projectsStore.fetchAll()
  }

  // 然后加载当前项目的详细信息
  const projectData = await projectsStore.fetchByPath(projectPath.value)
  if (projectData) {
    await codemapsStore.fetchByProject(projectPath.value)
  }
}

function navigateToCodeMap(id: string) {
  router.push(`/view/${id}`)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString()
}

onMounted(() => {
  loadProject()
})

watch(
  () => route.params.path,
  () => {
    loadProject()
  }
)
</script>