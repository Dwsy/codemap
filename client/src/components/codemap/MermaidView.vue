<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <div
      class="flex items-center justify-end px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2">
        <button
          @click="zoomOut"
          :disabled="scale <= 0.1"
          class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="缩小"
        >
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
            class="text-gray-500 dark:text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button
          @click="resetTransform"
          class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="重置"
        >
          <span class="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {{ Math.round(scale * 100) }}%
          </span>
        </button>
        <button
          @click="zoomIn"
          :disabled="scale >= 5"
          class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="放大"
        >
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
            class="text-gray-500 dark:text-gray-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <div class="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
        <button
          @click="exportAsPNG"
          class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="导出 PNG"
        >
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
            class="text-gray-500 dark:text-gray-400"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
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
      v-else-if="!diagram"
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
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <p class="text-sm">暂无流程图</p>
      </div>
    </div>

    <div
      v-else
      ref="containerRef"
      class="flex-1 overflow-hidden relative"
      @wheel.prevent="handleWheel"
    >
      <div
        ref="diagramRef"
        id="mermaid-container"
        class="absolute inset-0 origin-center cursor-grab active:cursor-grabbing"
        v-html="renderedDiagram"
        :style="getTransformStyle()"
        @mousedown="startPan"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useMermaid } from '@/composables/useMermaid'

interface Props {
  diagram?: string
}

const props = defineProps<Props>()

const {
  isLoading,
  isReady,
  scale,
  translateX,
  translateY,
  loadMermaid,
  render,
  resetTransform,
  zoomIn,
  zoomOut,
  pan,
  getTransformStyle,
  exportAsPNG
} = useMermaid()

const containerRef = ref<HTMLElement | null>(null)
const diagramRef = ref<HTMLElement | null>(null)
const renderedDiagram = ref('')
const isPanning = ref(false)
const lastMousePosition = ref({ x: 0, y: 0 })
const error = ref<string | null>(null)

const loading = computed(() => isLoading.value)

async function renderDiagram() {
  if (!props.diagram || !isReady.value) return

  try {
    const svg = await render('mermaid-diagram', props.diagram)
    renderedDiagram.value = svg
  } catch (e) {
    console.error('Failed to render diagram:', e)
    error.value = e instanceof Error ? e.message : 'Failed to render diagram'
  }
}

function handleWheel(event: WheelEvent) {
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

function startPan(event: MouseEvent) {
  isPanning.value = true
  lastMousePosition.value = { x: event.clientX, y: event.clientY }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPanning.value) return

    const dx = e.clientX - lastMousePosition.value.x
    const dy = e.clientY - lastMousePosition.value.y

    pan(dx, dy)
    lastMousePosition.value = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isPanning.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

async function handleExportAsPNG() {
  if (!containerRef.value) return

  try {
    const blob = await exportAsPNG('mermaid-container')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mermaid-diagram.png'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Failed to export diagram:', e)
  }
}

onMounted(async () => {
  await loadMermaid()
  await renderDiagram()
})

watch(
  () => props.diagram,
  async () => {
    await renderDiagram()
  }
)

watch(isReady, async (ready) => {
  if (ready) {
    await renderDiagram()
  }
})
</script>

<style scoped>
#mermaid-container :deep(svg) {
  max-width: none;
  height: auto;
}
</style>