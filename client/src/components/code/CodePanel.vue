<template>
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 h-full w-[600px] max-w-[80vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col"
    >
      <div
        class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center gap-2 min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-500 dark:text-gray-400 flex-shrink-0"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {{ fileName }}
          </span>
          <span
            v-if="currentLine"
            class="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0"
          >
            :{{ currentLine }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            @click="closePanel"
            class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="关闭面板"
          >
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
              class="text-gray-500 dark:text-gray-400"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
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

      <div v-else-if="currentFile" class="flex-1 overflow-hidden">
        <Editor
          ref="editorRef"
          :model-value="currentFile.content"
          :language="language"
          :options="editorOptions"
          :theme="theme"
          height="100%"
          @mount="handleEditorMount"
          @update:model-value="handleEditorChange"
        />
      </div>

      <div
        v-else
        class="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600"
      >
        <p class="text-sm">选择一个文件查看代码</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue'
import { Editor } from '@guolao/vue-monaco-editor'
import { useCodeViewerStore } from '@/stores/codeViewer'
import { useEditorStore } from '@/stores/editor'
import { useUiStore } from '@/stores/ui'
import { useMonacoEditor } from '@/composables/useMonacoEditor'
import { useMonacoTheme } from '@/composables/useMonacoTheme'
import ThemeSwitcher from './ThemeSwitcher.vue'

const codeViewerStore = useCodeViewerStore()
const editorStore = useEditorStore()
const uiStore = useUiStore()
const { getLanguageFromPath, createEditorOptions } = useMonacoEditor()
const { currentTheme, initThemes } = useMonacoTheme()

const isOpen = computed(() => codeViewerStore.isOpen)
const currentFile = computed(() => codeViewerStore.currentFile)
const currentLine = computed(() => codeViewerStore.currentLine)
const loading = computed(() => codeViewerStore.loading)
const error = computed(() => codeViewerStore.error)

const theme = computed(() => editorStore.state.theme)
const fileName = computed(() => {
  if (!currentFile.value) return ''
  const parts = currentFile.value.path.split('/')
  return parts[parts.length - 1]
})

const language = computed(() => {
  if (!currentFile.value) return 'typescript'
  return getLanguageFromPath(currentFile.value.path)
})

const editorOptions = computed(() => {
  return createEditorOptions({
    language: language.value,
    theme: theme.value,
    readOnly: true,
    ...editorStore.getEditorOptions()
  })
})

onMounted(() => {
  initThemes()
})

async function closePanel() {
  codeViewerStore.closePanel()
}

function handleEditorChange(value: string) {
  console.log('Editor value changed:', value)
}

watch(
  () => currentLine.value,
  (newLine) => {
    if (newLine) {
      console.log('Jumping to line:', newLine)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

:deep(.highlighted-line) {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.highlighted-line-glyph) {
  background-color: rgba(59, 130, 246, 0.5);
}
</style>