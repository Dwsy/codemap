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
      <span class="font-medium text-sm truncate">{{ props.trace.title }}</span>
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
        <div class="font-medium text-gray-700 dark:text-gray-300">{{ location.title }}</div>
        <div class="text-gray-500 dark:text-gray-400 mt-1">{{ location.path }}:{{ location.lineNumber }}</div>
      </div>
    </div>

    <div v-if="isExpanded && props.trace.traceTextDiagram" class="px-3 py-2 ml-6">
      <pre class="text-xs bg-gray-100 dark:bg-gray-800 rounded p-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ props.trace.traceTextDiagram }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, type Ref } from 'vue'

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
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggle: [traceId: string]
}>()

const expandedIds = inject<Ref<Set<string>>>('expandedIds')

const isExpanded = computed(() => expandedIds?.value?.has(props.trace.id) ?? false)

function toggle() {
  emit('toggle', props.trace.id)
}
</script>

<style scoped>
button {
  user-select: none;
}
</style>