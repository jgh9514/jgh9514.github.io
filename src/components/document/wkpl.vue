<template>
  <v-select
    ref="wkplRef"
    v-model="modelValue"
    :variant="Constants.DC_VARIANT"
    :items="items"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    :return-object="returnObject"
    :clearable="true"
    @update:model-value="onChange"
  />
</template>
<script setup>
const userStore = useUserStore()

const modelValue = defineModel()
const cdGrp = defineModel('cd-grp')
const infoData = defineModel('data')
const returnObject = defineModel('return-object', { default: false })
const defaultLoginData = defineModel('default-login-data', { default: false })
const items = ref([])
const wkplRef = ref(null)

const emit = defineEmits(['change'])

onMounted(async () => {
  init()
  await filterAuthorizedWkpl()
})

const filterAuthorizedWkpl = async () => {
  const data = await $gfn_getCommCd('ST00000001')
  
  const usrWkplRole = userStore.getUserState.wkpl_role

  data.forEach((item) => {
    // 사용자에게 권한이 있는 사업장만 조회조건에 보이도록 처리
    if (usrWkplRole.includes(item.cd)) {
      items.value.push({
        title: item.cd_nm,
        value: item.cd,
      })
    }
  })
}

const init = async () => {
  if (defaultLoginData.value || (infoData.value && infoData.value.init_data_yn==='Y' && infoData.value.login_data_bind_yn === 'Y')) {
    const userState = await userStore.getUserState
    if (returnObject.value) {
      modelValue.value = {
        title: userState.wkpl_nm,
        value: userState.wkpl_id,
      }
    } else {
      modelValue.value = userState.wkpl_id
    }
  }
}

const focus = () => {
  wkplRef.value.focus()
  wkplRef.value.$el.scrollIntoView(false) // 🔹 스크롤 이동
}

const onChange = () => {
  emit('change')
}

defineExpose({ init, focus })
</script>
