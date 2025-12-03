<template>
  <div :class="[subtitle ? 'text-subtitle-1' : `text-h${level}`, `font-weight-${weight}`, 'mb-1 mt-1']">
    {{ label }}
  </div>
</template>

<script setup>
const label = defineModel('label')

const props = defineProps({
  level: {
    type: String,
    default: '6',
  },
  weight: {
    type: String,
    default: 'bold',
  },
  subtitle: {
    type: Boolean,
    default: false,
  },
})
</script>
