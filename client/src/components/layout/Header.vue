<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-900 text-white flex items-center justify-between px-4 border-b border-gray-700 flex-shrink-0">
    <div class="flex items-center gap-4">
      <button
        @click="toggleSidebar"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="切换侧边栏"
      >
        <Menu :size="20" />
      </button>
      <router-link
        to="/"
        class="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-blue-400"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <h1 class="text-xl font-bold">CodeMap</h1>
      </router-link>
    </div>

    <nav class="flex items-center gap-2">
      <router-link
        to="/"
        class="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2"
        active-class="bg-gray-700 text-blue-400"
      >
        <LayoutDashboard :size="16" />
        <span class="hidden sm:inline">Dashboard</span>
      </router-link>

      <div class="h-6 w-px bg-gray-700 mx-1"></div>

      <a
        href="https://github.com/anomalyco/codemap"
        target="_blank"
        rel="noopener noreferrer"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="GitHub"
      >
        <Github :size="18" />
      </a>

      <button
        @click="toggleTheme"
        class="p-2 hover:bg-gray-700 rounded-md transition-colors"
        title="切换主题"
      >
        <Sun v-if="isDark" :size="18" />
        <Moon v-else :size="18" />
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Menu, LayoutDashboard, Github, Sun, Moon } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const isDark = ref(true)

function toggleSidebar() {
  uiStore.toggleSidebar()
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>