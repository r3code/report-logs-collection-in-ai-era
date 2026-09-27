<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  count: {
    default: 0,
  },
})

const counter = ref(props.count)
</script>

<template>
  <button flex="~" w-min border="~ gray-400 opacity-50" :class="counter === 0 ? '' : 'bg-gray-400 text-white'" @click="counter++">
    slot {{ counter }}
  </button>
</template>
