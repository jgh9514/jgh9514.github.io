<template>
  <v-textarea
    ref="textareaRef"
    v-model="modelValue"
    :base-color="Constants.DC_BASE_COLOR_GRAY" 
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    :variant="Constants.DC_VARIANT"
    :disabled="disabled"
    :placeholder="readonly || disabled ? '' : formattedPlaceholder"
    :maxlength="maxlength"
    :clearable="!readonly"
    :rows="defaultRows"
    :readonly="readonly"
    class="custom-textarea"
    @update:model-value="onChange"
  />
</template>

<script setup>
/**
 * <dc-textarea v-model="userdata" />
 * 속성 :
 * - modelValue: 입력 값
 * - placeholder: 입력 필드 레이블
 * - disabled: 비활성화 여부
 */

const modelValue = defineModel()
const textareaRef = ref(null)

const placeholder = defineModel('placeholder', {
  default: '입력해주세요.'
})
const formattedPlaceholder = computed(() =>
  placeholder.value.replace(/#10;/g, '\n')
);

const disabled = defineModel('disabled', {
  default: false
})

const maxlength = defineModel('maxlength', {
  default: 1200
})

const emit = defineEmits(['change'])

const defaultRows = defineModel('default-rows', {
  default: 6
})

const readonly = defineModel('readonly', {
  default: false
})

const focus = () => {
  textareaRef.value.focus()
  textareaRef.value.$el.scrollIntoView(false) // 🔹 스크롤 이동
}

const onChange = () => {
  emit('change')
}

defineExpose({ focus })
</script>