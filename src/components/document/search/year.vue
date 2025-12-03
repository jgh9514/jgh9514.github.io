<template>
  <v-select
    v-model="modelValue"
    :items="items"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :variant="Constants.DC_VARIANT"
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    return-object
    placeholder="미입력 시 현재년도로 설정됩니다."
    @update:model-value="onChange"
  />
</template>
<script setup>
const modelValue = defineModel()
const infoData = defineModel('data')
const cdGrp = defineModel('cd-grp')

const emit = defineEmits(['change'])

const yearData = ref([])
const items = ref([])
const modelValueCopy = ref(null)

const firstLoad = ref(true)

onMounted(() => {
  if (!$gfn_isEmpty(modelValue.value)) {
    modelValueCopy.value = JSON.parse(JSON.stringify(modelValue.value))
  }
})


const init = async () => {
  items.value = []
  const currentYear = new Date().getFullYear()
  if (firstLoad.value) {
    const startYear = currentYear - (Number(infoData.value?.decrease_year_val) || 0)
    const endYear = currentYear + (Number(infoData.value?.increase_year_val) || 0)
    
    for(let year = endYear; year >= startYear; year--) {
      yearData.value.push({
        cd: year,
        cd_nm: year.toString()
      })
    }
    firstLoad.value = false
  }
  yearData.value.forEach(item => {
    items.value.push({
      title: item.cd_nm,
      value: item.cd
    })
  })
  
  if (infoData.value.init_data_yn === 'Y') {
    modelValue.value = {
        title: currentYear,
        value: currentYear
    }
  }
}

const onChange = () => {
  emit('change')
}

defineExpose({ init })
</script>
