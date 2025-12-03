<template>
  <Teleport to="body">
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>{{ isPageMode ? $t('화면 추가') : $t('검색조건 추가') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="onCancel"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-form ref="formRef">
            <v-container>
              <v-row v-if="isPageMode">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="pageForm.page_id"
                    :label="$t('화면 ID')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="pageForm.page_nm"
                    :label="$t('화면명')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="pageForm.page_url"
                    :label="$t('화면 URL')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row v-else>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="conditionForm.cond_id"
                    :label="$t('조건 ID')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="conditionForm.cond_nm"
                    :label="$t('조건명')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="conditionForm.cond_tp_cd"
                    :items="condTypeItems"
                    item-title="text"
                    item-value="value"
                    :label="$t('조건 타입')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="conditionForm.mdat_yn"
                    :items="mdatYnItems"
                    item-title="text"
                    item-value="value"
                    :label="$t('필수여부')"
                    density="compact"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
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

// mode: 'page' | 'condition'
const mode = ref('page')
const isPageMode = computed(() => mode.value === 'page')

const pageForm = reactive({
  page_id: '',
  page_nm: '',
  page_url: '',
})

const conditionForm = reactive({
  page_id: '',
  cond_id: '',
  cond_nm: '',
  cond_tp_cd: '',
  mdat_yn: 'N',
})

const condTypeItems = [
  { text: 'INPUT', value: 'INPUT' },
  { text: 'SELECT', value: 'SELECT' },
  { text: 'DATE', value: 'DATE' },
]

const mdatYnItems = [
  { text: 'Y', value: 'Y' },
  { text: 'N', value: 'N' },
]

/**
 * 외부에서 호출하는 open 함수
 * @param {'page'|'condition'} openMode
 * @param {object|null} payload  페이지 ID 등 추가 정보
 */
const open = (openMode, payload) => {
  mode.value = openMode
  dialog.value = true

  // 초기화
  pageForm.page_id = ''
  pageForm.page_nm = ''
  pageForm.page_url = ''

  conditionForm.page_id = payload?.page_id || ''
  conditionForm.cond_id = ''
  conditionForm.cond_nm = ''
  conditionForm.cond_tp_cd = ''
  conditionForm.mdat_yn = 'N'
}

const onCancel = () => {
  dialog.value = false
  emit('close', false)
}

const onSave = async () => {
  // 간단한 유효성 검사
  if (isPageMode.value) {
    if (!pageForm.page_id || !pageForm.page_nm) {
      $toast($t('필수값을 입력해주세요.'), 'error')
      return
    }
  } else {
    if (!conditionForm.page_id) {
      $toast($t('화면을 먼저 선택해주세요.'), 'error')
      return
    }
    if (!conditionForm.cond_id || !conditionForm.cond_nm) {
      $toast($t('필수값을 입력해주세요.'), 'error')
      return
    }
  }

  // TODO: 실제 API 규격에 맞게 저장 로직을 구현하세요.
  // 현재는 단순히 성공 토스트만 띄우고 부모에서 목록을 다시 조회하게 합니다.
  $toast($t('개발 중입니다.'), 'info')
  dialog.value = false
  emit('close', true)
}

defineExpose({
  open,
})
</script>


