<template>
  <div class="d-flex flex-wrap">
    <v-checkbox
      v-for="item in cdData"
      :key="item.cd"
      v-model="modelValue"
      :label="item.cd_nm"
      :value="item.cd"
      hide-details
      :density="Constants.DC_DENSITY"
      color="primary"
      :disabled="isDisabled(item.cd)"
      class="me-2"
      :multiple="multiple"
      :true-value="trueValue"
      :false-value="falseValue"
      :readonly="readonly"
    />
  </div>
</template>
<script setup>
const modelValue = defineModel()
const disabled = defineModel('disabled', {
  default: false
})
const readonly = defineModel('readonly', {
  default: false
})

const multiple = defineModel('multiple', { default: true })
const trueValue = defineModel('true-value', { default: undefined })
const falseValue = defineModel('false-value', { default: undefined })

const disabledValue = defineModel('disabled-value', { default: undefined })

const cdGrp = defineModel('cd-grp')
const bufFst = defineModel('buf-fst')
const upCd = defineModel('up-cd')
const cdData = ref([])

onMounted(async () => {
  const data = await $gfn_getCommCd(cdGrp.value)
  if (bufFst.value === 'Y') {
    cdData.value = data.filter((item) => item.buf_fst_txt === 'Y')
  } else if (!$gfn_isEmpty(upCd.value)) {
    cdData.value = data.filter((item) => item.up_cd === upCd.value)
  } else {
    cdData.value = data
  }
})
  
// 특정값 외에 비활성화 처리
const isDisabled = (cd) => {
  if (modelValue.value && disabledValue.value && modelValue.value.includes(disabledValue.value)) {
    // disabledValue가 아닌 경우, 체크 해제 후 비활성화 처리
    if (cd !== disabledValue.value) {
      if (modelValue.value.includes(cd)) {
        modelValue.value = modelValue.value.filter(value => value !== cd)
      }
      return true
    }
  }
  return disabled.value
}
</script>
<style scoped></style>
