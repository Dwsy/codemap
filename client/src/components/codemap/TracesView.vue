<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <div
      class="flex items-center justify-end px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2">
        <button
          @click="expandAll"
          class="px-2 py-1 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
        >
          全部展开
        </button>
        <button
          @click="collapseAll"
          class="px-2 py-1 text-xs rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
        >
          全部折叠
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div
      v-else-if="error"
      class="flex-1 flex items-center justify-center p-4"
    >
      <div class="text-center">
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
          class="text-red-500 mx-auto mb-2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ error }}</p>
      </div>
    </div>

    <div
      v-else-if="!traces || traces.length === 0"
      class="flex-1 flex items-center justify-center"
    >
      <div class="text-center text-gray-400 dark:text-gray-600">
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
          class="mx-auto mb-2"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <p class="text-sm">暂无追踪链路</p>
      </div>
    </div>

    <div v-else class="flex-1 p-4">
      <div class="space-y-2">
        <TraceItem
          v-for="trace in traces"
          :key="trace.id"
          :trace="trace"
          :project-path="projectPath"
          @toggle="handleToggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import TraceItem from './TraceItem.vue'

interface Trace {
  id: string
  name: string
  description?: string
  traceTextDiagram?: string
  traceGuide?: string
  locations?: any[]
}

interface Props {
  traces?: Trace[]
  projectPath?: string
}

const props = defineProps<Props>()

const expandedIds = ref<Set<string>>(new Set())

watch(() => props.traces, (traces) => {
  if (traces && traces.length > 0) {
    traces.forEach(trace => {
      expandedIds.value.add(trace.id)
    })
  }
}, { immediate: true })

const loading = computed(() => false)
const error = computed(() => null)

function handleToggle(traceId: string) {
  if (expandedIds.value.has(traceId)) {
    expandedIds.value.delete(traceId)
  } else {
    expandedIds.value.add(traceId)
  }
}

function expandAll() {
  if (props.traces) {
    props.traces.forEach(trace => {
      expandedIds.value.add(trace.id)
    })
  }
}

function collapseAll() {
  expandedIds.value.clear()
}

provide('expandedIds', expandedIds)
</script>

<style scoped>
button {
  user-select: none;
}
</style>