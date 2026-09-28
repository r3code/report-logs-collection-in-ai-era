<template>
  <div v-if="show" class="slide-number">{{ current }}</div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useNav } from '@slidev/client'

const nav = useNav()

const current = ref(0)
const total = ref(0)

// useNav() возвращает объект с реактивными свойствами
// В Slidev 52.x: nav.currentPage и nav.totalPages — это ComputedRef
// Но также могут быть функциями или простыми значениями
function read() {
  try {
    const c = nav?.currentPage
    const t = nav?.totalPages
    current.value = typeof c === 'function' ? c() : (c?.value ?? c ?? 0)
    total.value = typeof t === 'function' ? t() : (t?.value ?? t ?? 0)
  } catch (e) {
    // ignore
  }
}

const show = computed(() => current.value > 1 && current.value < total.value)

onMounted(() => {
  read()
  // watchEffect для автоматической подписки на реактивность
  watchEffect(read)
})
</script>

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
