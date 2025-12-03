<template>
  <Teleport to="body">
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>{{ isEdit ? $t('메뉴 수정') : $t('대메뉴 추가') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="onCancel"></v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.menu_id"
                  :label="$t('메뉴 ID')"
                  :disabled="isEdit"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.menu_nm"
                  :label="$t('메뉴명')"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.menu_url"
                  :label="$t('URL')"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.usg_yn"
                  :items="useYnItems"
                  item-title="text"
                  item-value="value"
                  :label="$t('사용여부')"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="onCancel">
            {{ $t('취소') }}
          </v-btn>
          <v-btn color="primary" variant="flat" @click="onSave">
            {{ $t('저장') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Teleport>
</template>

<script setup>
const emit = defineEmits(['close'])

const dialog = ref(false)
const formRef = ref()
const form = reactive({
  menu_id: '',
  up_menu_id: null,
  menu_nm: '',
  menu_url: '',
  usg_yn: 'Y',
})

const mode = ref('new') // 'new' | 'edit'
const isEdit = computed(() => mode.value === 'edit')

const useYnItems = [
  { text: '사용', value: 'Y' },
  { text: '미사용', value: 'N' },
]

/**
 * 외부에서 호출하는 open 함수
 * @param {string|null} menuId 선택된 메뉴 ID (edit 일 때)
 * @param {string|null} upMenuId 상위 메뉴 ID
 * @param {'new'|'edit'} openMode 모드
 */
const open = async (menuId, upMenuId, openMode = 'new') => {
  mode.value = openMode
  dialog.value = true

  form.menu_id = menuId || ''
  form.up_menu_id = upMenuId || null
  form.menu_nm = ''
  form.menu_url = ''
  form.usg_yn = 'Y'

  // TODO: 필요하다면 여기서 menuId 로 상세 조회하여 form 에 세팅
  // 예: const rows = await $api.post('/sm/menu/list', { menu_id: menuId })
  //     Object.assign(form, rows?.[0] ?? {})
}

const onCancel = () => {
  dialog.value = false
  emit('close', false)
}

const onSave = async () => {
  // 간단한 유효성 검사
  if (!form.menu_id || !form.menu_nm) {
    $toast($t('필수값을 입력해주세요.'), 'error')
    return
  }

  try {
    // 실제 API 규격에 맞게 수정해서 사용하세요.
    const payload = {
      insertRow: [],
      updateRow: [],
      deleteRow: [],
    }

    if (mode.value === 'new') {
      payload.insertRow.push({ ...form })
    } else {
      payload.updateRow.push({ ...form })
    }

    await $api.post('/sm/menu/save', payload)
    $toast($t('저장되었습니다.'))
    dialog.value = false
    emit('close', true)
  } catch (e) {
    console.error(e)
    $toast($t('저장 중 오류가 발생했습니다.'), 'error')
  }
}

defineExpose({
  open,
})
</script>


