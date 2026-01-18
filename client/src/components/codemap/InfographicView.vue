<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900">
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
      v-else-if="!steps || steps.length === 0"
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
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <p class="text-sm">暂无信息图</p>
      </div>
    </div>

    <div
      v-else
      ref="containerRef"
      class="flex-1 p-6"
    >
      <div class="max-w-6xl mx-auto">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="mb-8"
        >
          <div
            v-html="renderMarkdown(step)"
            class="prose prose-sm dark:prose-invert max-w-none"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import infographicPlugin from 'markdown-it-infographic'

interface Props {
  steps?: string[]
}

const props = defineProps<Props>()

const containerRef = ref<HTMLElement>()
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
})

md.use(infographicPlugin, {
  width: '100%',
  height: 'auto'
})

const loading = ref(false)
const error = ref<string | null>(null)
const isReady = ref(false)

const steps = computed(() => {
  if (!props.steps || props.steps.length === 0) {
    return []
  }

  if (props.steps.length > 0 && typeof props.steps[0] === 'string') {
    return props.steps as string[]
  }

  return []
})

function renderMarkdown(text: string): string {
  if (!text) return ''
  try {
    return md.render(text)
  } catch (e) {
    console.error('Markdown render error:', e)
    return `<div class="text-red-500">渲染错误: ${e instanceof Error ? e.message : '未知错误'}</div>`
  }
}

watch(() => props.steps, async () => {
  if (steps.value.length > 0) {
    await nextTick()
  }
}, { immediate: true })

onMounted(() => {
  isReady.value = true
  console.log('InfographicView mounted with', steps.value.length, 'steps')
})
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3 {
  color: #111827;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose h1 {
  font-size: 1.875rem;
}

.prose h2 {
  font-size: 1.5rem;
}

.prose h3 {
  font-size: 1.25rem;
}

.prose h4 {
  font-size: 1.125rem;
}

.prose p {
  margin-top: 1em;
  margin-bottom: 1em;
}

.prose ul,
.prose ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: #111827;
}

.prose pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-top: 1em;
  margin-bottom: 1em;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.prose strong {
  font-weight: 600;
}

.prose a {
  color: #2563eb;
  text-decoration: underline;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
}

.dark .prose {
  color: #d1d5db;
}

.dark .prose h1,
.dark .prose h2,
.dark .prose h3 {
  color: #f9fafb;
}

.dark .prose code {
  background-color: #374151;
  color: #f9fafb;
}

.dark .prose pre {
  background-color: #1f2937;
}

.dark .prose a {
  color: #60a5fa;
}

.dark .prose blockquote {
  border-left-color: #4b5563;
  color: #9ca3af;
}
</style>