<template>
  <v-combobox
    ref="deptRef"
    v-model="selectedDepts"
    hide-details="auto"
    :label="label"
    :placeholder="disabled ? '' : placeholder ? placeholder : '선택해주세요.'"
    :chips="multiple"
    :closable-chips="multiple"
    :multiple="multiple"
    readonly
    :clearable="!disabled"
    :variant="Constants.DC_VARIANT"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :density="Constants.DC_DENSITY"
    :append-inner-icon="disabled ? '' : 'fas fa-search'"
    @click:append-inner="popOpen"
    @click:clear="clear"
    @dblclick="popOpen"
  >
    <template v-if="multiple" #chip="{ props, item }">
      <v-chip v-bind="props" :text="item.raw.dept_nm" :closable="!disabled" @click:close="chipRemove" />
    </template>
    <template v-else #selection="{ item }">
      {{ item.raw.dept_nm }}
    </template>
  </v-combobox>
  <PopupDeptSelect ref="popupDeptSelect" :multi-yn="multiple" @close="close" />
</template>

<script setup>
import PopupDeptSelect from '../popup/dept-select.vue'

const modelValue = defineModel('dept-cd')
const modelValueNm = defineModel('dept-nm')

const label = defineModel('label')
const placeholder = defineModel('placeholder')
const disabled = defineModel('disabled', {
  default: false,
})

const multiple = defineModel('multiple', {
  default: false,
})

const emit = defineEmits(['close', 'clear'])

const selectedDepts = ref([])

const popupDeptSelect = ref(null)
const deptRef = ref(null)

const initCheck = ref(true)

watch(modelValue, () => {
  if (initCheck.value) {
    init()
    initCheck.value = false
  } else {
    if (multiple.value && !$gfn_isEmpty(modelValue.value) && modelValue.value.length <= 0) {
      selectedDepts.value = []
    }
  }
})

const popOpen = () => {
  popupDeptSelect.value.open()
}

const clear = () => {
  modelValue.value = null
  selectedDepts.value = []
  emit('clear', null)
}

const close = (data) => {
  initCheck.value = false
  if (!$gfn_isEmpty(data) && data.length > 0) {
    if (multiple.value) {
      // 멀티 선택일 경우
      const existingDepts = selectedDepts.value || []
      const newDepts = data.map((item) => ({
        dept_cd: item.dept_cd,
        dept_nm: item.dept_nm,
      }))

      // 기존 데이터와 신규 데이터 병합 후 중복 제거
      const mergedDepts = [...existingDepts, ...newDepts]
      const uniqueDepts = mergedDepts.filter((dept, index, self) => index === self.findIndex((d) => d.dept_cd === dept.dept_cd))

      modelValue.value = uniqueDepts.map((dept) => dept.dept_cd)
      selectedDepts.value = uniqueDepts
      $toast($t('중복된 데이터를 제외 후 추가되었습니다.')) // 중복된 데이터를 제외 후 추가되었습니다.
    } else {
      // 단일 선택일 경우
      modelValue.value = data[0].dept_cd
      selectedDepts.value = [
        {
          dept_cd: data[0].dept_cd,
          dept_nm: data[0].dept_nm,
        },
      ]
    }
    emit('close', data)
  }
}

const focus = () => {
  deptRef.value.focus()
  deptRef.value.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const init = () => {
  selectedDepts.value = []
  if (multiple.value) {
    if (modelValue.value && modelValue.value.length > 0) {
      modelValue.value.forEach((item, index) => {
        selectedDepts.value.push({
          dept_cd: item,
          dept_nm: modelValueNm.value[index],
        })
      })
    }
  } else {
    selectedDepts.value = [
      {
        dept_cd: modelValue.value,
        dept_nm: modelValueNm.value,
      },
    ]
  }
}

const chipRemove = () => {
  if (multiple.value) {
    modelValue.value = selectedDepts.value.map((dept) => dept.dept_cd)
    modelValueNm.value = selectedDepts.value.map((dept) => dept.dept_nm)
  } else {
    if (selectedDepts.value.length > 0) {
      modelValue.value = selectedDepts.value[0].dept_cd
      modelValueNm.value = selectedDepts.value[0].dept_nm
    } else {
      modelValue.value = null
      modelValueNm.value = null
    }
  }
}

defineExpose({ init, clear, focus })
</script>
