<template>
  <v-col cols="12" :sm="6" :md="cellmerge ? cellmerge : 3" class="d-flex align-center pa-2">
    <slot />
  </v-col>
</template>
<script setup>
const cellmerge = defineModel('cellmerge', { default: 3 })
</script>
<style scoped>
.full-width {
  width: 100%;
}
</style>
