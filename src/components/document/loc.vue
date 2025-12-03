<template>
  <v-text-field
    v-model="modelValue"
    :variant="Constants.DC_VARIANT"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    :label="label"
    :placeholder="placeholder ? placeholder : '선택해주세요.'"
    clearable
    append-inner-icon="fas fa-search"
    readonly
    @click:append-inner="popOpen" @click:clear="clear"
  />
  <PopupLocSelect ref="popupLocSelect" @close="close" />
</template>
<script setup>
import PopupLocSelect from '../popup/loc-select.vue'

const modelValue = defineModel()
const label = defineModel('label')
const placeholder = defineModel('placeholder')
const emit = defineEmits(['close', 'clear'])

const popupLocSelect = ref(null)

const disabled = defineModel('disabled', {
  default: false
})

const popOpen = () => {
  popupLocSelect.value.open()
}

const clear = () => {
  modelValue.value = null
  emit('clear', null)
}

const close = (data) => {
  if (!$gfn_isEmpty(data) && data.length > 0) {
    modelValue.value = data[0].usr_nm
    emit('close', data)
  }
}

const init = () => {}

defineExpose({ init })
</script>