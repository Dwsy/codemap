<template>
  <div class="trace-item">
    <button
      @click="toggle"
      :class="[
        'flex items-center gap-2 w-full px-3 py-2 rounded-md text-left transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'text-gray-700 dark:text-gray-300'
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
        :class="[
          'transition-transform duration-200 text-gray-400',
          isExpanded ? 'rotate-90' : ''
        ]"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span class="font-medium text-sm truncate">{{ props.trace.name || props.trace.title }}</span>
      <span v-if="props.trace.description" class="text-xs text-gray-400 dark:text-gray-500 truncate ml-2">
        {{ props.trace.description }}
      </span>
    </button>

    <div
      v-if="isExpanded && props.trace.description"
      class="px-3 py-2 ml-6 text-sm text-gray-600 dark:text-gray-400"
    >
      {{ props.trace.description }}
    </div>

    <div v-if="isExpanded && props.trace.locations" class="px-3 py-2 ml-6 space-y-2">
      <div
        v-for="location in props.trace.locations"
        :key="location.id"
        class="text-xs bg-gray-100 dark:bg-gray-800 rounded p-2"
      >
        <div class="font-medium text-gray-700 dark:text-gray-300 mb-1">{{ location.title }}</div>
        <div class="flex items-center gap-1">
          <CodeNodeLink
            :code-node="{
              file: resolvePath(location.path),
              line: location.lineNumber,
              snippet: location.lineContent
            }"
          />
        </div>
      </div>
    </div>

    <div v-if="isExpanded && props.trace.traceTextDiagram" class="px-3 py-2 ml-6">
      <pre class="text-xs bg-gray-100 dark:bg-gray-800 rounded p-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ props.trace.traceTextDiagram }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, type Ref } from 'vue'
import CodeNodeLink from '../code/CodeNodeLink.vue'

interface CodeNodeLocation {
  id: string
  path: string
  lineNumber: number
  lineContent: string
  title: string
  description: string
}

interface Trace {
  id: string
  title: string
  description?: string
  traceTextDiagram?: string
  traceGuide?: string
  locations?: CodeNodeLocation[]
}

interface Props {
  trace: Trace
  projectPath?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggle: [traceId: string]
}>()

const expandedIds = inject<Ref<Set<string>>>('expandedIds')

const isExpanded = computed(() => expandedIds?.value?.has(props.trace.id) ?? false)

function resolvePath(path: string): string {
  // 如果是绝对路径（以 / 开头且是项目路径），直接返回
  if (path.startsWith('/') && path.startsWith(props.projectPath || '')) {
    return path
  }
  // 如果是相对路径（不以 / 开头），拼接项目路径
  if (!path.startsWith('/')) {
    return `${props.projectPath}/${path}`
  }
  // 如果是伪绝对路径（以 / 开头但不是真正的绝对路径），拼接项目路径
  return `${props.projectPath}${path}`
}

function toggle() {
  emit('toggle', props.trace.id)
}
</script>

<style scoped>
button {
  user-select: none;
}
</style>