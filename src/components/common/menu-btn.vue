<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-btn
      v-bind="props"
      :class="{
        'app-bar-menu': true,
        'transition-fast-in-fast-out app-bar-btn-menu': isHovering
      }"
      @click="clickLevel1Menu"
    >
      {{ menuLabel }}
    </v-btn>
  </v-hover>
</template>
<script setup>
const emit = defineEmits(['click'])

const menuNo = defineModel('menu-no')
const menuLabel = defineModel('label')

const clickLevel1Menu = () => {
  emit('click', menuNo)
}
</script>
