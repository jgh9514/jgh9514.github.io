<template>
  <div class="w-100">
    <v-combobox
      ref="userRef"
      v-model="selectedUsers"
      hide-details="auto"
      :label="label"
      :placeholder="disabled ? '' : placeholder ? placeholder : '선택해주세요.'"
      :chips="multiple"
      :closable-chips="multiple"
      :multiple="multiple"
      :density="Constants.DC_DENSITY"
      :variant="Constants.DC_VARIANT"
      :base-color="Constants.DC_BASE_COLOR_GRAY"
      readonly
      :clearable="!disabled"
      :append-inner-icon="disabled ? '' : 'fas fa-search'"
      @click:append-inner="popOpen"
      @click:clear="clear"
      @dblclick="popOpen"
    >
      <template v-if="multiple" #chip="{ props, item }">
        <v-chip v-bind="props" :text="item.raw.usr_nm" :closable="!disabled" @click:close="chipRemove" />
      </template>
      <template v-else #selection="{ item }">
        {{ item.raw.usr_nm }}
      </template>
    </v-combobox>
    <PopupUserMultiSelect ref="popupUserMultiSelect" @close="close" />
    <PopupUserSelect ref="popupUserSelect" @close="close" />
  </div>
</template>

<script setup>
import PopupUserMultiSelect from '../popup/user-select-multi.vue'
import PopupUserSelect from '../popup/user-select.vue'

const modelValue = defineModel('usr_id')
const modelValueNm = defineModel('usr_nm')

const label = defineModel('label')
const placeholder = defineModel('placeholder')
const emit = defineEmits(['close', 'clear'])
const disabled = defineModel('disabled', {
  default: false,
})

const multiple = defineModel('multiple', {
  default: false,
})

const selectedUsers = ref([])

const popupUserMultiSelect = ref(null)
const popupUserSelect = ref(null)
const userRef = ref(null)

const initCheck = ref(true)

onMounted(() => {
  setTimeout(() => {
    initCheck.value = false
  }, 1000)
})

watch(modelValue, () => {
  if (initCheck.value) {
    init()
    initCheck.value = false
  } else {
    if (multiple.value && !$gfn_isEmpty(modelValue.value) && modelValue.value.length <= 0) {
      selectedUsers.value = []
      // modelValue.value = modelValue.value.split(',')
    }
  }
})

const init = () => {
  selectedUsers.value = []
  if (multiple.value) {
    if (!$gfn_isEmpty(modelValue.value) && modelValue.value.length > 0) {
      modelValue.value.forEach((item, index) => {
        selectedUsers.value.push({
          usr_id: item,
          usr_nm: modelValueNm.value[index],
        })
      })
    }
  } else {
    selectedUsers.value = [
      {
        usr_id: modelValue.value,
        usr_nm: modelValueNm.value,
      },
    ]
  }
}

const popOpen = () => {
  if (multiple.value) {
    popupUserMultiSelect.value.open()
  } else {
    popupUserSelect.value.open()
  }
}

const clear = () => {
  modelValue.value = null
  modelValueNm.value = null // modelValueNm도 null로 초기화
  selectedUsers.value = []
  emit('clear', null)
}

const close = (data) => {
  if (!$gfn_isEmpty(data) && data.length > 0) {
    if (multiple.value) {
      // 멀티 선택일 경우
      const existingUsers = selectedUsers.value || []
      const newUsers = data.map((item) => ({
        usr_id: item.usr_id,
        usr_nm: item.usr_nm,
      }))

      // 기존 데이터와 신규 데이터 병합 후 중복 제거
      const mergedUsers = [...existingUsers, ...newUsers]
      const uniqueUsers = mergedUsers.filter((user, index, self) => index === self.findIndex((u) => u.usr_id === user.usr_id))

      modelValue.value = uniqueUsers.map((user) => user.usr_id)
      modelValueNm.value = uniqueUsers.map((user) => user.usr_nm) // modelValueNm도 업데이트
      selectedUsers.value = uniqueUsers
      $toast($t('중복된 데이터를 제외 후 추가되었습니다.')) // 중복된 데이터를 제외 후 추가되었습니다.
    } else {
      // 단일 선택일 경우
      modelValue.value = data[0].usr_id
      modelValueNm.value = data[0].usr_nm
      selectedUsers.value = [
        {
          usr_id: data[0].usr_id,
          usr_nm: data[0].usr_nm,
        },
      ]
    }
    emit('close', data)
  }
}

const chipRemove = () => {
  if (multiple.value) {
    modelValue.value = selectedUsers.value.map((user) => user.usr_id)
    modelValueNm.value = selectedUsers.value.map((user) => user.usr_nm) // modelValueNm도 업데이트
  } else {
    if (selectedUsers.value.length > 0) {
      modelValue.value = selectedUsers.value[0].usr_id
      modelValueNm.value = selectedUsers.value[0].usr_nm
    } else {
      modelValue.value = null
      modelValueNm.value = null // modelValueNm도 null로 초기화
    }
  }
}

const focus = () => {
  userRef.value.focus()
  userRef.value.$el.scrollIntoView(false) // 🔹 스크롤 이동
}

defineExpose({ init, focus, clear })
</script>
