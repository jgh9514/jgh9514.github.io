<template>
  <v-text-field
    ref="popupRef"
    v-model="selectedData"
    :variant="Constants.DC_VARIANT"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :density="Constants.DC_DENSITY"
    placeholder="선택해주세요."
    clearable
    append-inner-icon="fas fa-search"
    readonly
    hide-details="auto"
    @click:append-inner="popOpen"
    @click:clear="clear"
    @dblclick="popOpen"
  />
</template>
<script setup>
const emit = defineEmits(['popOpen'])

const selectedData = ref(null)
const popupRef = ref(null)

const clear = () => {
  selectedData.value = null
}

const popOpen = () => {
  emit('popOpen')
}

const focus = () => {
  popupRef.value.focus()
}

defineExpose({
  focus,
})
</script>
