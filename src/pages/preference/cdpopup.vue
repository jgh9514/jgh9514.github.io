<template>
  <Teleport to="body">
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>{{ $t('코드 목록') }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <CommonSearchCondition v-model:sch-datas="schDatas" page-id="PAGE001343" :configuration-management="false" :role-wkpl-condition="false" @search="search" />
          <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
            <v-row>
              <v-col cols="12">
                <v-data-table
                  v-model="selectedCodes"
                  :headers="headers"
                  :items="codeList"
                  item-value="cd"
                  show-select
                  density="compact"
                  :items-per-page="-1"
                  hide-default-footer
                  class="elevation-1"
                  @click:row="onRowClick"
                ></v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="close">{{ $t('취소') }}</v-btn>
          <v-btn color="primary" variant="flat" @click="returnData">{{ $t('선택') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Teleport>
</template>

<script setup>
const emit = defineEmits(['close'])

// State
const dialog = ref(false)
const schDatas = ref({})
const propsData = ref({})
const codeList = ref([])
const selectedCodes = ref([])

const headers = [
  { title: $t('코드그룹'), key: 'cd_grp_no', align: 'center', sortable: false },
  { title: $t('코드그룹명'), key: 'cd_grp_nm', align: 'start', sortable: false },
  { title: $t('코드'), key: 'cd', align: 'center', sortable: false },
  { title: $t('코드명'), key: 'cd_nm', align: 'start', sortable: false },
]

const open = (data) => {
  dialog.value = true
  propsData.value = data
}

const search = async () => {
  const searchData = await $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/cd/popup', searchData)
  codeList.value = rows || []
}

const onRowClick = (event, { item }) => {
  const index = selectedCodes.value.indexOf(item.cd)
  if (index > -1) {
    selectedCodes.value.splice(index, 1)
  } else {
    selectedCodes.value.push(item.cd)
  }
}

const close = () => {
  dialog.value = false
  propsData.value = {}
  schDatas.value = {}
  codeList.value = []
  selectedCodes.value = []
  emit('close')
}

const returnData = () => {
  if (selectedCodes.value.length > 0) {
    const data = codeList.value.filter(item => selectedCodes.value.includes(item.cd))
    close()
    emit('close', data)
  } else {
    $toast($t('선택할 항목이 없습니다.'), 'error')
  }
}

defineExpose({
  open,
})
</script>
