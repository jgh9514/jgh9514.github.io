<template>
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <dc-select v-model="modelValue" cd-grp="CO00000009" />
    </template>
  </v-menu>
</template>
<script setup>
const modelValue = defineModel()

const emit = defineEmits(['change'])

onMounted(() => {})

const onChange = () => {
  emit('change')
}

</script>