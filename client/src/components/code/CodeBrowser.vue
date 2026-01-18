<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900">
    <div
      class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center gap-2">
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
          class="text-gray-500 dark:text-gray-400"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          文件浏览器
        </span>
      </div>
      <button
        @click="closeBrowser"
        class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="关闭"
      >
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
          class="text-gray-500 dark:text-gray-400"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
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

    <div v-else-if="fileTree.length === 0" class="flex-1 flex items-center justify-center">
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
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <p class="text-sm">暂无文件</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-2">
      <div class="space-y-1">
        <FileTreeItem
          v-for="item in fileTree"
          :key="item.path"
          :item="item"
          :depth="0"
          @select="handleFileSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCodeViewerStore } from '@/stores/codeViewer'

interface FileTreeItem {
  name: string
  path: string
  type: 'dir' | 'file'
  children?: FileTreeItem[]
}

const emit = defineEmits<{
  close: []
}>()

const codeViewerStore = useCodeViewerStore()
const loading = ref(false)
const error = ref<string | null>(null)
const fileTree = ref<FileTreeItem[]>([])

async function loadFileTree() {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('/api/v1/files/tree')
    if (!response.ok) {
      throw new Error('Failed to load file tree')
    }
    const data = await response.json()
    fileTree.value = data
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

function handleFileSelect(item: FileTreeItem) {
  if (item.type === 'file') {
    codeViewerStore.openFile(item.path)
  }
}

function closeBrowser() {
  emit('close')
}

onMounted(() => {
  loadFileTree()
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export const FileTreeItem = defineComponent({
  name: 'FileTreeItem',
  props: {
    item: {
      type: Object as () => FileTreeItem,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const expanded = ref(false)

    function toggleExpand() {
      if (props.item.type === 'dir') {
        expanded.value = !expanded.value
      } else {
        emit('select', props.item)
      }
    }

    return {
      expanded,
      toggleExpand
    }
  },
  template: `
    <div>
      <button
        @click="toggleExpand"
        :class="[
          'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-left transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          item.type === 'file' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'
        ]"
        :style="{ paddingLeft: \`\${depth * 16 + 8}px\` }"
      >
        <svg
          v-if="item.type === 'dir'"
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
            'transition-transform duration-200',
            expanded ? 'rotate-90' : ''
          ]"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <svg
          v-else
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
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span class="text-sm truncate">{{ item.name }}</span>
      </button>
      <div v-if="item.type === 'dir' && expanded" class="space-y-1">
        <FileTreeItem
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :depth="depth + 1"
          @select="$emit('select', $event)"
        />
      </div>
    </div>
  `
})
</script>

<style scoped>
button {
  user-select: none;
}
</style>