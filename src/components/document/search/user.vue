<template>
  <v-text-field
    v-model="userName"
    :variant="Constants.DC_VARIANT"
    :base-color="Constants.DC_BASE_COLOR_GRAY"
    :density="Constants.DC_DENSITY"
    hide-details="auto"
    :label="label"
    :placeholder="placeholder ? placeholder : '선택해주세요.'"
    clearable
    append-inner-icon="fas fa-search"
    readonly
    @click:append-inner="popOpen"
    @click:clear="clear"
  />
  <PopupUserSelect ref="popupUserSelectRef" @close="close" />
</template>
<script setup>
const userStore = useUserStore()

const modelValue = defineModel()
const infoData = defineModel('data')
const label = defineModel('label')
const placeholder = defineModel('placeholder')
const emit = defineEmits(['close'])

const userName = ref(null)
const popupUserSelectRef = ref(null)


watch(modelValue, () => {
  if ($gfn_isEmpty(modelValue.value)) {
    userName.value = ''
  } else {
    userName.value = modelValue.value.title
  }
})

const popOpen = () => {
  popupUserSelectRef.value.open()
}

const clear = () => {
  modelValue.value = null
  userName.value = ''
}

const close = (data) => {
  if (!$gfn_isEmpty(data) && data.length > 0) {
    modelValue.value = {
      title: data[0].usr_nm,
      value: data[0].usr_id,
    }
    userName.value = data[0].usr_nm
  }
}

const init = async () => {
  if ((!$gfn_isEmpty(infoData.value) && infoData.value.init_data_yn === 'Y' && infoData.value.login_data_bind_yn === 'Y')) {
    const userState = await userStore.getUserState
    modelValue.value = {
      title: userState.usr_nm,
      value: userState.usr_id,
    }
    userName.value = userState.usr_nm
  } else {
    modelValue.value = null
    userName.value = ''
  }
}

defineExpose({ init })
</script>
