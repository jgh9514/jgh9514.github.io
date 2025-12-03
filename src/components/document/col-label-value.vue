<template>
  <!-- <dc-col-label>
    {{ label }}
  </dc-col-label> -->
  <dc-col-value>
    <slot />
  </dc-col-value>
</template>
<script setup>
const label = defineModel('label')
const value = defineModel('value')

</script>
