<template>
  <v-number-input
    ref="numberInputRef"
    v-model="modelValue"
    :decimal-separator="'.'"
    :variant="Constants.DC_VARIANT"
    :density="Constants.DC_DENSITY"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :label="label"
    :rules="rules"
    hide-details="auto"
    :disabled="disabled"
    :placeholder="disabled ? '' : '입력해주세요.'"
    clearable
    :max="maxValue"
    :min="minValue"
    control-variant="stacked"
    @click:clear="modelValue = ''"
    @update:model-value="onChange"
    @keypress.enter="enter"
  />
</template>

<script setup>
/**
 * <dc-number-input v-model="userdata" />
 * 속성 :
 * - modelValue: 입력 값
 * - label: 입력 필드 레이블
 * - rules: 유효성 검사 규칙 배열
 */
const numberInputRef = ref(null)
const modelValue = defineModel()
const label = defineModel('label')
const max = defineModel('max', {
  default: null,
})
const min = defineModel('min', {
  default: 1,
})
const disabled = defineModel('disabled', {
  default: false,
})
const rules = defineModel('rules', {
  default: () => [],
})

const maxValue = computed(() => (max.value !== null ? Number(max.value) : null))
const minValue = computed(() => Number(min.value))

const emit = defineEmits(['change', 'enter'])

const onChange = () => {
  emit('change')
}

const enter = () => {
  emit('enter')
}

const focus = () => {
  numberInputRef.value.focus()
}

defineExpose({
  focus,
})
</script>
