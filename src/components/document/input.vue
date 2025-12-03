<template>
  <v-text-field
    ref="textRef"
    v-model="modelValue"
    :label="label"
    :rules="rules"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    label-color="#ff0000"
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    :variant="Constants.DC_VARIANT"
    :disabled="disabled"
    :placeholder="placeholder ? placeholder : '입력해주세요.'"
    :clearable="!readonly"
    :maxlength="maxlength"
    @update:model-value="onChange"
    @keypress.enter="enter"
  />
</template>

<script setup>

/**
 * <dc-input v-model="userdata" />
 * 속성 :
 * - modelValue: 입력 값
 * - label: 입력 필드 레이블
 * - rules: 유효성 검사 규칙 배열
 */
const modelValue = defineModel()
const label = defineModel('label')
const placeholder = defineModel('placeholder')
const infoData = defineModel('data')
const disabled = defineModel('disabled', {
  default: false
})
const maxlength = defineModel('maxlength', {
  default: 100
})
const rules = defineModel('rules', { 
  default: () => []
})

const textRef = ref(null)

const emit = defineEmits(['change', 'enter'])

const onChange = () => {
  emit('change')
}

const enter = () => {
  emit('enter')
}

const focus = () => {
  textRef.value.focus()
  textRef.value.$el.scrollIntoView(false) // 🔹 스크롤 이동
}

const init = () => {
  modelValue.value = null
  if (!$gfn_isEmpty(infoData.value.init_data_val)) {
    modelValue.value = infoData.value.init_data_val
  }
}

defineExpose({ init, focus })
</script>