<template>
  <button
    @click="handleClick"
    :class="[
      'inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-mono transition-all duration-200',
      'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'text-gray-700 dark:text-gray-300'
    ]"
    :title="`${codeNode.file}:${codeNode.line}`"
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
      class="text-gray-500 dark:text-gray-400"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
    <span class="truncate max-w-[200px]">{{ fileName }}</span>
    <span class="text-gray-400 dark:text-gray-500">:</span>
    <span class="text-blue-600 dark:text-blue-400 font-semibold">{{ codeNode.line }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCodeViewerStore } from '@/stores/codeViewer'

interface Props {
  codeNode: {
    file: string
    line: number
    column?: number
    snippet?: string
  }
}

const props = defineProps<Props>()
const codeViewerStore = useCodeViewerStore()

const fileName = computed(() => {
  const parts = props.codeNode.file.split('/')
  return parts[parts.length - 1]
})

async function handleClick() {
  await codeViewerStore.openFile(props.codeNode.file, props.codeNode.line)
}
</script>

<style scoped>
button {
  user-select: none;
}
</style>