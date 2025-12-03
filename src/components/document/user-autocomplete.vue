<template>
  <v-autocomplete
    v-model="modelValue"
    chips
    :items="items"
    multiple
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    variant="underlined"
    :density="Constants.DC_DENSITY"
    clearable
    hide-details="auto"
    return-object
    placeholder="선택해주세요."
    persistent-placeholder
    @update:model-value="onChange"
  />
</template>
<script setup>
//////////////////////////////////////////////////////
// Import 및 데이터 선언 영역
//////////////////////////////////////////////////////
const modelValue = defineModel('user-id')
const schData = ref({
  sch_nm: '',
})
const items = ref([])

const emit = defineEmits(['change'])

//////////////////////////////////////////////////////
// Vue Life Cycle 영역
//////////////////////////////////////////////////////
onMounted(async () => {
  const data = await $api.post(`/common/sgst/user`, schData.value)
  data.forEach(item => {  
    items.value.push({
      title: item.title,
      value: item.value
    })
  })
})

//////////////////////////////////////////////////////
// 힘수 구현 영역
//////////////////////////////////////////////////////
const onChange = () => {
  emit('change')
}
</script>
