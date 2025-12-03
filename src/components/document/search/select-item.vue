<template>
  <v-select
    v-model="modelValue"
    :variant="Constants.DC_VARIANT"
    :density="Constants.DC_DENSITY"
    :items="items"
    item-title="title"
    item-value="value"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    hide-details="auto"
    :placeholder="'SELECT'"
    :clearable="clearable"
    :return-object="returnObject"
    @update:model-value="onChange"
  />
</template>
<script setup>
const modelValue = defineModel()
const itemsData = defineModel('items')
const cdColumn = defineModel('cd-column')
const cdNameColumn = defineModel('cd-name-column')
const upCdColumn = defineModel('up-cd-column')
const upCdData = defineModel('up-cd-data')
const emit = defineEmits(['change'])
const returnObject = defineModel('return-object')
const clearable = defineModel('clearable', { default: true })
const items = ref([])
const modelValueCopy = ref(null)

const isUpCdInit = defineModel('is-up-cd-init', { default: false })

onMounted(() => {
  if (!$gfn_isEmpty(modelValue.value)) {
    modelValueCopy.value = JSON.parse(JSON.stringify(modelValue.value))
  }
  init()
})

const firstInit = ref(false)

watch(upCdData, () => {
  filterItems()
})

watch(isUpCdInit, () => {
  if (isUpCdInit.value) {
    filterItems()
  }
})

const init = async () => {
  items.value = []
  modelValue.value = JSON.parse(JSON.stringify(modelValueCopy.value))
  itemsData.value.forEach((item) => {
    if (modelValueCopy.value === item[cdColumn.value]) {
      modelValue.value = item[cdColumn.value]
    }
    if ($gfn_isEmpty(upCdColumn.value)) {
      items.value.push({
        title: item[cdNameColumn.value],
        value: item[cdColumn.value],
      })
    }
  })
  if (!$gfn_isEmpty(upCdData.value)) {
    filterItems()
  }
}

const filterItems = () => {
  items.value = []
  // SELECT OR ALL 추가

  // modelValue.value = null
  itemsData.value.forEach((item) => {
    if (item[upCdColumn.value] === (upCdData.value?.value ? upCdData.value.value : upCdData.value)) {
      if (!firstInit.value && modelValueCopy.value === item[cdColumn.value]) {
        modelValue.value = item[cdColumn.value]
        firstInit.value = true
      }
      items.value.push({
        title: item[cdNameColumn.value],
        value: item[cdColumn.value],
      })
    }
  })
}

const onChange = () => {
  emit('change')
}

defineExpose({ init })
</script>
