<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-text-field
        v-model="dateText"
        v-bind="props"
        append-inner-icon="mdi-calendar"
        :base-color="Constants.DC_BASE_COLOR_GRAY"
        :variant="Constants.DC_VARIANT"
        :density="Constants.DC_DENSITY"
        :label="infoData?.label_nm || label || ''"
        hide-details="auto"
        :placeholder="placeholder"
        :disabled="disabled"
        :focused="focused"
        class="calendar-input"
      />
    </template>
    <v-date-picker v-model="date" hide-header color="blue lighten-1" @update:model-value="changeDate" />
  </v-menu>
</template>
<script setup>
const dateText = ref('')
const infoData = defineModel('data')
const placeholder = defineModel('placeholder')
const defaultToday = defineModel('default-today', { default: false })
const modelValue = defineModel()
const label = defineModel('label')
const dayOfWeek = defineModel('day-of-week', { default: '' })
const disabled = defineModel('disabled', { default: false })
const date = ref(new Date())
const menu = ref(false)
const focused = ref(null)
const initCheck = ref(false)

const emit = defineEmits(['change'])

onMounted(() => {
  init()
  setTimeout(() => {
    initCheck.value = true
  }, 1000)
})

watch(modelValue, (newValue, oldValue) => {
  // modelValue가 null로 변경되는 것을 방지
  if (newValue === null && oldValue && oldValue !== null) {
    modelValue.value = oldValue
    return
  }
  
  if (!initCheck.value) {
    initCheck.value = true
    init()
  } else {
    // initCheck가 true이고 modelValue가 유효한 값일 때만 처리
    if (!$gfn_isEmpty(modelValue.value)) {
      dateText.value = $gfn_convertToDateFormat(modelValue.value)
      dayOfWeek.value = $gfn_getDayOfWeek(dateText.value)
    }
  }
})

watch(dateText, () => {
  if (dateText.value) {
    dateText.value = dateText.value.trim()
    if (dateText.value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date.value = new Date(dateText.value)
    }
  }
})

const changeDate = () => {
  initCheck.value = true
  dateText.value = date.value.getFullYear() + '-' + (date.value.getMonth() + 1).toString().padStart(2, '0') + '-' + date.value.getDate().toString().padStart(2, '0')
  modelValue.value = date.value.getFullYear() + (date.value.getMonth() + 1).toString().padStart(2, '0') + date.value.getDate().toString().padStart(2, '0')

  dayOfWeek.value = $gfn_getDayOfWeek(dateText.value)
  menu.value = false
}

const init = () => {
  if ($gfn_isEmpty(modelValue.value) && defaultToday.value) {
    dateText.value = new Date().toISOString().split('T')[0]
    modelValue.value = dateText.value.replaceAll('-', '')
  } else if (infoData.value && infoData.value.init_data_yn === 'Y') {
    modelValue.value = null
    const today = new Date()
    const offset = Number(infoData.value.standard_date_val || 0)

    switch (infoData.value.standard_date_cd) {
      case 'year':
        today.setFullYear(today.getFullYear() - offset)
        break
      case 'month':
        today.setMonth(today.getMonth() - offset)
        break
      case 'day':
        today.setDate(today.getDate() - offset)
        break
      case 'toDay':
        break
    }
    dateText.value = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0')
    modelValue.value = today.getFullYear() + (today.getMonth() + 1).toString().padStart(2, '0') + today.getDate().toString().padStart(2, '0')
  } else if (!$gfn_isEmpty(modelValue.value)) {
    dateText.value = $gfn_convertToDateFormat(modelValue.value)
  }
  dayOfWeek.value = $gfn_getDayOfWeek(dateText.value)
}

const focus = () => {
  focused.value = !focused.value
}

defineExpose({ init, focus })
</script>
