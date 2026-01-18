<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <Header />

    <main
      :class="[
        'fixed right-0 bottom-0 z-30 transition-all duration-300 overflow-auto',
        sidebarOpen ? 'top-14 left-64' : 'top-14 left-0'
      ]"
    >
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" v-if="Component" />
        </Transition>
      </RouterView>
    </main>

    <Sidebar />
    <CodePanel />
    <PerformanceMonitor v-if="isDev" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import CodePanel from '@/components/code/CodePanel.vue'
import PerformanceMonitor from '@/components/PerformanceMonitor.vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const sidebarOpen = computed(() => uiStore.sidebarOpen)
const isDev = import.meta.env.DEV
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>