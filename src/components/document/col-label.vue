<template>
  <v-col class="font-weight-bold pl-3 pr-3 d-flex align-center bg-label" :cols="cellmerge ? cellmerge : 1"> <slot /> <b v-if="essn" class="text-red">&nbsp;*</b> </v-col>
</template>
<script setup>
const cellmerge = defineModel('cellmerge', { default: 1 })
defineProps({
  essn: {
    type: Boolean,
    default: false,
  },
})
</script>
<style scoped>
.bg-label {
  background-color: #f1f1f1;
}
</style>
