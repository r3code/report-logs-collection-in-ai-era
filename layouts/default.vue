<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()

const current = ref(0)
const total = ref(0)

function read() {
  try {
    const nav = ($slidev as any)?.nav
    if (nav) {
      const c = (nav as any).currentPage
      const t = (nav as any).total  // Slidev 52: nav.total (не totalPages)
      current.value = c?.value ?? (typeof c === 'function' ? c() : c) ?? 0
      total.value = t?.value ?? (typeof t === 'function' ? t() : t) ?? 0
    }
  } catch (e) {
    // ignore
  }
}

const show = computed(() => current.value > 1 && current.value < total.value)

let pollInterval: any = null

onMounted(() => {
  read()
  pollInterval = setInterval(read, 200)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<template>
  <div class="slidev-layout default">
    <slot />
    <div v-if="show" class="slide-number">{{ current }}</div>
  </div>
</template>

<style scoped>
.slide-number {
  position: absolute !important;
  top: 1rem !important;
  right: 1.5rem !important;
  font-family: 'Arial', sans-serif !important;
  font-size: 14pt !important;
  font-weight: 400 !important;
  color: #000 !important;
  z-index: 1000 !important;
  pointer-events: none !important;
}
</style>
