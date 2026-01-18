<template>
  <div class="h-full">
    <InfographicView :steps="codemap?.infographicSteps" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCodeMapsStore } from '@/stores/codemaps'
import InfographicView from '@/components/codemap/InfographicView.vue'

const route = useRoute()
const codemapsStore = useCodeMapsStore()

const loading = ref(false)
const error = ref<string | null>(null)

const codemap = computed(() => codemapsStore.currentCodeMap)

onMounted(async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    await codemapsStore.fetchById(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load codemap'
  } finally {
    loading.value = false
  }
})
</script>