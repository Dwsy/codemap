<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      title="切换主题"
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
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <span class="hidden sm:inline">{{ currentTheme.name }}</span>
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
        :class="['transition-transform', isOpen ? 'rotate-180' : '']"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div class="p-2">
        <div
          v-for="theme in themes"
          :key="theme.id"
          @click="selectTheme(theme)"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-700',
            currentTheme.id === theme.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          ]"
        >
          <div
            class="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
            :style="{ backgroundColor: theme.data.colors?.['editor.background'] }"
          ></div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ theme.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ theme.type === 'dark' ? '深色' : '浅色' }}
            </div>
          </div>
          <svg
            v-if="currentTheme.id === theme.id"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-blue-600 dark:text-blue-400"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          @click="resetTheme"
          class="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          重置为默认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMonacoTheme } from '@/composables/useMonacoTheme'

const { currentTheme, themes, setTheme, resetTheme } = useMonacoTheme()
const isOpen = ref(false)

function selectTheme(theme: any) {
  setTheme(theme.id)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>