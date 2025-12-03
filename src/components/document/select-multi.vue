<template>
  <v-select
    ref="selectRef"
    v-model="modelValue"
    :variant="Constants.DC_VARIANT"
    :density="Constants.DC_DENSITY"
    :items="items"
    item-title="title"
    item-value="value"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    hide-details="auto"
    :placeholder="placeholder"
    :return-object="returnObject"
    :clearable="clearable"
    :disabled="disabled"
    multiple
    class="select-input"
    @update:model-value="onChange"
  />
</template>
<script setup>
const modelValue = defineModel()
const infoData = defineModel('data')
const cdGrp = defineModel('cd-grp')
const upCd = defineModel('up-cd')
const placeholder = defineModel('placeholder', { default: 'SELECT' })
const returnObject = defineModel('return-object', { default: false })
const disabled = defineModel('disabled', { default: false })
const clearable = defineModel('clearable', { default: true })

const emit = defineEmits(['change'])

const cdData = ref([])
const items = ref([])
const modelValueCopy = ref(null)

const firstLoad = ref(true)

const selectRef = ref(null)
const initCheck = ref(false)
onMounted(async () => {
  if (!$gfn_isEmpty(modelValue.value)) {
    modelValueCopy.value = JSON.parse(JSON.stringify(modelValue.value))
  }
  await init()
  if (upCd.value !== undefined) {
    await filterItems()
  }
})

const firstInit = ref(false)

watch(modelValue, async () => {
  if ($gfn_isEmpty(modelValueCopy.value) && !$gfn_isEmpty(modelValue.value) && !initCheck.value) {
    modelValueCopy.value = JSON.parse(JSON.stringify(modelValue.value))
    await init()
  }
})

watch(upCd, async () => {
  if ($gfn_isEmpty(modelValueCopy.value) && !$gfn_isEmpty(modelValue.value)) {
    modelValueCopy.value = JSON.parse(JSON.stringify(modelValue.value))
  }
  await filterItems()
})

const init = async () => {
  initCheck.value = true
  items.value = []
  modelValue.value = JSON.parse(JSON.stringify(modelValueCopy.value))
  
  if (firstLoad.value) {
    cdData.value = await $gfn_getCommCd(cdGrp.value)
    firstLoad.value = false
  }

  cdData.value.forEach((item) => {
    if (!$gfn_isEmpty(upCd.value) && item.up_cd !== upCd.value) {
      return
    }
    items.value.push({
      title: item.cd_nm,
      value: item.cd,
    })
  })
}

const filterItems = () => {
  items.value = Object.assign([], [])

  // modelValue.value = null
  cdData.value.forEach((item) => {
    if ($gfn_isEmpty(item.up_cd) || $gfn_isEmpty(upCd.value) || item.up_cd !== (upCd.value?.value ? upCd.value.value : upCd.value)) {
      return
    }
    if (!firstInit.value && modelValueCopy.value === item.cd) {
      modelValue.value = item.cd
      firstInit.value = true
    }
    items.value.push({
      title: item.cd_nm,
      value: item.cd,
    })
  })
}

const focus = () => {
  selectRef.value.focus()
  selectRef.value.$el.scrollIntoView(false) // 🔹 스크롤 이동
}

const onChange = () => {
  emit('change')
}

defineExpose({ init, focus })
</script>
