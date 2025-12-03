<template>
  <v-combobox
    ref="deptRef"
    v-model="modelValue"
    :items="items"
    :variant="Constants.DC_VARIANT"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    :return-object="returnObject"
    placeholder="SELECT"
    :multiple="multiple"
    clearable
    @update:model-value="onChange"
  />
</template>
<script setup>
const modelValue = defineModel()
const infoData = defineModel('data')
const returnObject = defineModel('return-object', { default: false })
const schData = ref({})
const items = ref([])
const userStore = useUserStore()
const multiple = defineModel('multiple', { default: false })
const emit = defineEmits(['change'])

const deptRef = ref(null)

const firstLoad = ref(true)

onMounted(async () => {
  init()
  if (firstLoad.value) {
    const data = await $api.post(`/common/sgst/dept`, schData.value)
    firstLoad.value = false
    data.forEach((item) => {
      items.value.push({
        title: item.title,
        value: item.value,
      })
    })
  }
})

const init = () => {
  if (!$gfn_isEmpty(infoData.value) && infoData.value.login_data_bind_yn === 'Y') {
    const userState = userStore.getUserState
    if (returnObject.value) {
      modelValue.value = {
        title: userState.dept_nm,
        value: userState.dept_cd,
      }
    } else {
      modelValue.value = userState.dept_cd
    }
  } else {
    modelValue.value = null
  }
}

const castData = (data) => {
  if (multiple.value && typeof data === 'string') {
    if (data.includes(',')) {
      data = data.trim()
      data = data.split(',')
      return data
    } else {
      return [data]
    }
  } else {
    return data
  }
}

const focus = () => {
  deptRef.value.focus()
  deptRef.value.$el.scrollIntoView(false) // 🔹 스크롤 이동
}

const onChange = () => {
  emit('change')
}

defineExpose({ init, focus })
</script>
