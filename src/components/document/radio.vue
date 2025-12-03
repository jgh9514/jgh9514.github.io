<template>
  <v-radio-group v-model="modelValue" hide-details :density="Constants.DC_DENSITY" color="primary" :disabled="disabled" :readonly="readonly" inline :class="flexWrap ? '' : 'radio-group-nowrap'">
    <v-radio v-for="item in cdData" :key="item.cd" class="mr-2" :label="item.cd_nm" :value="item.cd" />
  </v-radio-group>
</template>
<script setup>
const modelValue = defineModel()
const disabled = defineModel('disabled', {
  default: false,
})
const readonly = defineModel('readonly', {
  default: false,
})
const flexWrap = defineModel('flex-wrap', {
  default: false,
})

const cdGrp = defineModel('cd-grp')
const cdData = defineModel('cd-data', {
  default: [],
}) // 코드값 직접 전달 또는 코드그룹으로 조회하도록 수정 (부모 코드에 따라 cdData 바뀌는 케이스 고려 (ex.변경구분, 사고유형))

// 제외시킬 코드값 (배열로 받아서 같으면 제외)
const excludeCd = defineModel('exclude-cd', {
  default: [],
})

onMounted(async () => {
  if (cdData.value.length > 0) {
    return
  }

  let codes = await $gfn_getCommCd(cdGrp.value)
  if (excludeCd.value && excludeCd.value.length > 0) {
    codes = codes.filter((item) => !excludeCd.value.includes(item.cd))
  }
  cdData.value = codes
})
</script>
<style scoped>
.radio-group-nowrap {
  white-space: nowrap;
  width: fit-content;
  min-width: max-content;
}
.radio-group-nowrap :deep(.v-selection-control-group) {
  flex-wrap: nowrap;
}
</style>
