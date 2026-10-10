<template>
  <ul class="progressive">
    <li v-for="(item, i) in items" :key="i"
        v-show="clicks >= i"
        :class="{ active: clicks === i }"
        v-html="item">
    </li>
  </ul>
</template>

<script setup>
import { useSlideContext } from '@slidev/client'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const { $clicks: clicks } = useSlideContext()
</script>
