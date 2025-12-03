<template>
  <v-btn
    v-if="visible"
    class="btn text-subtitle-1 ml-1 pt-1 pb-1 pl-5 pr-5"
    :class="[type === 'border' ? 'btn-border' : 'btn-background', type === 'border' && color ? `btn-border-${color}` : `btn-background-${color}`]"
    flat
    @click="clickBtn"
  >
    <span class="text-pre" v-html="$t(label)" />
  </v-btn>
</template>
<script setup>
//////////////////////////////////////////////////////
// Import 및 데이터 선언 영역
//////////////////////////////////////////////////////
const label = defineModel('label')
const type = defineModel('type', { default: 'background' })
const color = defineModel('color', { default: 'primary' })
const visible = defineModel('visible', { default: true })

const emit = defineEmits(['click'])

//////////////////////////////////////////////////////
// Vue Life Cycle 영역
//////////////////////////////////////////////////////
onMounted(() => {})

//////////////////////////////////////////////////////
// 힘수 구현 영역
//////////////////////////////////////////////////////
const clickBtn = () => {
  emit('click')
}
</script>
