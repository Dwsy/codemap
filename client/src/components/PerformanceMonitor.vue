<template>
  <div
    v-if="showMetrics"
    class="fixed bottom-4 right-4 bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 text-xs font-mono max-w-xs"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="font-bold">Performance</span>
      <button @click="toggleMetrics" class="text-gray-400 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    <div class="space-y-1">
      <div class="flex justify-between">
        <span>LCP:</span>
        <span :class="getScoreClass('lcp')">{{ formatMetric(metrics.lcp) }}</span>
      </div>
      <div class="flex justify-between">
        <span>FID:</span>
        <span :class="getScoreClass('fid')">{{ formatMetric(metrics.fid) }}</span>
      </div>
      <div class="flex justify-between">
        <span>CLS:</span>
        <span :class="getScoreClass('cls')">{{ metrics.cls?.toFixed(3) || '-' }}</span>
      </div>
      <div class="flex justify-between">
        <span>FCP:</span>
        <span :class="getScoreClass('fcp')">{{ formatMetric(metrics.fcp) }}</span>
      </div>
      <div class="flex justify-between">
        <span>TTFB:</span>
        <span :class="getScoreClass('ttfb')">{{ formatMetric(metrics.ttfb) }}</span>
      </div>
      <div v-if="memory" class="mt-2 pt-2 border-t border-gray-700">
        <div class="flex justify-between">
          <span>Memory:</span>
          <span>{{ formatMemory(memory.usedJSHeapSize) }}</span>
        </div>
      </div>
    </div>
  </div>
  <button
    v-else
    @click="toggleMetrics"
    class="fixed bottom-4 right-4 bg-gray-900 dark:bg-gray-800 text-white p-2 rounded-lg shadow-lg z-50 hover:bg-gray-700 dark:hover:bg-gray-600"
    title="Show Performance Metrics"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePerformance } from '@/composables/usePerformance'

const { metrics, getMemoryUsage } = usePerformance()

const showMetrics = ref(false)
const memory = computed(() => getMemoryUsage())

function toggleMetrics() {
  showMetrics.value = !showMetrics.value
}

function formatMetric(value?: number): string {
  if (value === undefined) return '-'
  return `${value.toFixed(0)}ms`
}

function formatMemory(bytes?: number): string {
  if (bytes === undefined) return '-'
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

function getScoreClass(metric: keyof typeof metrics.value): string {
  const score = getScore(metric)
  switch (score) {
    case 'good':
      return 'text-green-400'
    case 'needs-improvement':
      return 'text-yellow-400'
    case 'poor':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

function getScore(metric: keyof typeof metrics.value): 'good' | 'needs-improvement' | 'poor' {
  const value = metrics.value[metric]
  if (!value) return 'needs-improvement'

  switch (metric) {
    case 'lcp':
      if (value <= 2500) return 'good'
      if (value <= 4000) return 'needs-improvement'
      return 'poor'
    case 'fid':
      if (value <= 100) return 'good'
      if (value <= 300) return 'needs-improvement'
      return 'poor'
    case 'cls':
      if (value <= 0.1) return 'good'
      if (value <= 0.25) return 'needs-improvement'
      return 'poor'
    case 'fcp':
      if (value <= 1800) return 'good'
      if (value <= 3000) return 'needs-improvement'
      return 'poor'
    case 'ttfb':
      if (value <= 800) return 'good'
      if (value <= 1800) return 'needs-improvement'
      return 'poor'
    default:
      return 'needs-improvement'
  }
}
</script>