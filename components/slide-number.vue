<template>
  <div
    v-if="show"
    class="slide-number"
    :class="{ 'on-dark': onDark }"
  >
    {{ current }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()

// Не показываем на первом и последнем слайде
const show = computed(() => {
  const page = $slidev.nav.currentPage
  const total = $slidev.nav.totalPages
  return page !== 1 && page !== total
})

const current = computed(() => $slidev.nav.currentPage)

// На слайдах-разделителях (bg-black) — белый номер
const onDark = computed(() => {
  // Layout с class: bg-black — определяем по текущему слайду
  const layout = $slidev.nav.currentLayout
  // Проверим также class атрибут, но layout — надёжнее
  return false // упрощаем: цвет всегда чёрный, на тёмных слайдах переопределим через CSS
})
</script>

<style scoped>
.slide-number {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-family: 'Arial', sans-serif;
  font-size: 14pt;
  font-weight: 400;
  color: #000;
  z-index: 100;
  pointer-events: none;
}

/* На тёмных слайдах (родитель имеет bg-black) — белый номер */
:global(.slidev-layout.bg-black) .slide-number,
:global(.bg-black) .slide-number {
  color: #fff !important;
}
</style>
