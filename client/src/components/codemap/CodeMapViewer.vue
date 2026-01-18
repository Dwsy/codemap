<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <div
      class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10"
    >
      <div class="flex items-center gap-3">
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ codemap?.name || 'CodeMap' }}
        </h1>
        <span
          v-if="codemap?.description"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          {{ codemap.description }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="scrollToView('mermaid')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
              activeView === 'mermaid'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
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
              class="inline mr-1.5"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            流程图
          </button>
          <button
            @click="scrollToView('infographic')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
              activeView === 'infographic'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
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
              class="inline mr-1.5"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            信息图
          </button>
          <button
            @click="scrollToView('traces')"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
              activeView === 'traces'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
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
              class="inline mr-1.5"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            追踪链路
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div
      v-else-if="error"
      class="flex-1 flex items-center justify-center p-8"
    >
      <div class="text-center max-w-md">
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
          class="text-red-500 mx-auto mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          加载失败
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ error }}
        </p>
        <button
          @click="loadCodeMap"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          重新加载
        </button>
      </div>
    </div>

    <div
      v-else-if="!codemap"
      class="flex-1 flex items-center justify-center"
    >
      <div class="text-center text-gray-400 dark:text-gray-600">
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
          class="mx-auto mb-4"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        <p class="text-sm">暂无 CodeMap 数据</p>
      </div>
    </div>

    <div v-else ref="contentRef" class="flex-1 overflow-y-auto scroll-smooth">
      <section id="view-mermaid" class="min-h-full">
        <MermaidView :diagram="codemap.mermaidDiagram" />
      </section>

      <section id="view-infographic" class="min-h-full">
        <InfographicView :steps="codemap.infographicSteps" />
      </section>

      <section id="view-traces" class="min-h-full">
        <TracesView :traces="codemap.traces" />
      </section>
    </div>

    <CodePanel />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useCodeMapsStore } from '@/stores/codeMaps'
import { useUiStore } from '@/stores/ui'
import MermaidView from './MermaidView.vue'
import InfographicView from './InfographicView.vue'
import TracesView from './TracesView.vue'
import CodePanel from '../code/CodePanel.vue'

const route = useRoute()
const codeMapsStore = useCodeMapsStore()
const uiStore = useUiStore()

const loading = ref(false)
const error = ref<string | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const activeView = ref<'mermaid' | 'infographic' | 'traces'>('mermaid')

const codemap = computed(() => codeMapsStore.currentCodeMap)

async function loadCodeMap() {
  const id = route.params.id as string
  if (!id) return

  loading.value = true
  error.value = null

  try {
    await codeMapsStore.fetchById(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load CodeMap'
  } finally {
    loading.value = false
  }
}

function scrollToView(view: 'mermaid' | 'infographic' | 'traces') {
  const element = document.getElementById(`view-${view}`)
  if (element && contentRef.value) {
    contentRef.value.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    })
  }
}

function handleScroll() {
  if (!contentRef.value) return

  const mermaidEl = document.getElementById('view-mermaid')
  const infographicEl = document.getElementById('view-infographic')
  const tracesEl = document.getElementById('view-traces')

  if (!mermaidEl || !infographicEl || !tracesEl) return

  const scrollPos = contentRef.value.scrollTop
  const containerHeight = contentRef.value.clientHeight

  const mermaidMiddle = mermaidEl.offsetTop + mermaidEl.offsetHeight / 2
  const infographicMiddle = infographicEl.offsetTop + infographicEl.offsetHeight / 2
  const tracesMiddle = tracesEl.offsetTop + tracesEl.offsetHeight / 2

  const distances = {
    mermaid: Math.abs(scrollPos + containerHeight / 2 - mermaidMiddle),
    infographic: Math.abs(scrollPos + containerHeight / 2 - infographicMiddle),
    traces: Math.abs(scrollPos + containerHeight / 2 - tracesMiddle)
  }

  const minDistance = Math.min(...Object.values(distances))
  activeView.value = Object.keys(distances).find(
    key => distances[key as keyof typeof distances] === minDistance
  ) as 'mermaid' | 'infographic' | 'traces'
}

onMounted(() => {
  loadCodeMap()
  contentRef.value?.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  contentRef.value?.removeEventListener('scroll', handleScroll)
})

watch(
  () => route.params.id,
  () => {
    loadCodeMap()
    activeView.value = 'mermaid'
  }
)
</script>

<style scoped>
button {
  user-select: none;
}
</style>