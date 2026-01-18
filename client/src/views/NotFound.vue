<template>
  <div class="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="text-9xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
        页面未找到
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        抱歉，您访问的页面不存在
      </p>
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>