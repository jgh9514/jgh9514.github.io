<template>
  <div>
    <CommonListWrapper>
      <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
        <CommonSearchCondition v-model:page-id="usePageStore().getActivePage.page_id" v-model:sch-datas="schDatas" :role-wkpl-condition="false" @search="parentSearch" />
        <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title>{{ $t('부모 코드 목록') }}</v-card-title>
                <v-data-table
                  :headers="parentHeaders"
                  :items="parentList"
                  density="compact"
                  :items-per-page="-1"
                  hide-default-footer
                  class="elevation-1"
                  @click:row="onParentClick"
                ></v-data-table>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="d-flex align-center">
                  <span>{{ $t('자식 코드 목록') }}</span>
                  <v-spacer></v-spacer>
                  <v-btn size="small" color="primary" @click="add" class="mr-2">{{ $t('추가') }}</v-btn>
                  <v-btn size="small" color="error" @click="del">{{ $t('삭제') }}</v-btn>
                </v-card-title>
                <v-data-table
                  v-model="selectedChildren"
                  :headers="childHeaders"
                  :items="childList"
                  item-value="id"
                  show-select
                  density="compact"
                  :items-per-page="-1"
                  hide-default-footer
                  class="elevation-1"
                ></v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <dc-bottom-btn button-list='["save"]' @save="save" />
      </div>
    </CommonListWrapper>
    
    <!-- 코드 선택 팝업 -->
    <Teleport to="body">
      <v-dialog v-model="cdDialog" fullscreen persistent transition="dialog-bottom-transition">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span>{{ $t('코드 목록') }}</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" @click="closeCdDialog"></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <CommonSearchCondition v-model:sch-datas="cdPopupSchDatas" page-id="PAGE001343" :configuration-management="false" :role-wkpl-condition="false" @search="cdPopupSearch" />
            <v-container v-if="cdPopupSchDatas.COMMON_SEARCH_PAGE_INFO">
              <v-row>
                <v-col cols="12">
                  <v-data-table
                    v-model="selectedPopupCodes"
                    :headers="cdPopupHeaders"
                    :items="cdPopupList"
                    item-value="id"
                    show-select
                    density="compact"
                    :items-per-page="-1"
                    hide-default-footer
                    class="elevation-1"
                  ></v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeCdDialog">{{ $t('취소') }}</v-btn>
            <v-btn color="primary" variant="flat" @click="returnCdPopupData">{{ $t('선택') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Teleport>
  </div>
</template>

<script setup>
// 모바일 여부 확인
const mobile = ref(false);
const checkMobile = () => {
  mobile.value = window.innerWidth < 960;
};
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const schDatas = ref({})
const schChlidrenDatas = ref({})
const parentList = ref([])
const childList = ref([])
const selectedChildren = ref([])
const selectedParent = ref(null)

// 팝업 관련
const cdDialog = ref(false)
const cdPopupSchDatas = ref({})
const cdPopupList = ref([])
const selectedPopupCodes = ref([])

const parentHeaders = computed(() => {
  const cols = [
    { title: $t('코드그룹'), key: 'cd_grp_no', align: 'center', sortable: false },
    { title: $t('코드그룹명'), key: 'cd_grp_nm', align: 'start', sortable: false },
    { title: $t('코드'), key: 'cd', align: 'center', sortable: false },
    { title: $t('코드명'), key: 'cd_nm', align: 'start', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => col.key !== 'cd_grp_nm')
  }
  return cols
})

const childHeaders = computed(() => {
  const cols = [
    { title: $t('코드그룹'), key: 'cd_grp_no', align: 'center', sortable: false },
    { title: $t('코드그룹명'), key: 'cd_grp_nm', align: 'start', sortable: false },
    { title: $t('코드'), key: 'cd', align: 'center', sortable: false },
    { title: $t('코드명'), key: 'cd_nm', align: 'start', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => col.key !== 'cd_grp_nm')
  }
  return cols
})

const cdPopupHeaders = computed(() => {
  const cols = [
    { title: $t('코드그룹'), key: 'cd_grp_no', align: 'center', sortable: false },
    { title: $t('코드그룹명'), key: 'cd_grp_nm', align: 'start', sortable: false },
    { title: $t('코드'), key: 'cd', align: 'center', sortable: false },
    { title: $t('코드명'), key: 'cd_nm', align: 'start', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => col.key !== 'cd_grp_nm')
  }
  return cols
})

const parentSearch = async () => {
  const searchData = await $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post(`/sm/cd/parent/list`, searchData)
  parentList.value = rows || []
}

const childSearch = async () => {
  const searchData = await $gfn_searchDataExtraction(schChlidrenDatas.value)
  const childRows = await $api.post(`/sm/cdrel/list`, searchData)
  childList.value = (childRows || []).map((row, idx) => ({
    ...row,
    id: `${row.cd_grp_no}_${row.cd}_${idx}`
  }))
}

const onParentClick = async (event, { item }) => {
  selectedParent.value = item
  schChlidrenDatas.value.up_cd_grp_no = item.cd_grp_no
  schChlidrenDatas.value.up_cd = item.cd
  await childSearch()
}

const add = () => {
  if (!selectedParent.value) {
    $toast($t('부모코드목록에서 코드를 선택해주세요.'), 'error')
    return
  }
  cdDialog.value = true
}

const cdPopupSearch = async () => {
  const searchData = await $gfn_searchDataExtraction(cdPopupSchDatas.value)
  const rows = await $api.post('/sm/cd/popup', searchData)
  cdPopupList.value = (rows || []).map((row, idx) => ({
    ...row,
    id: `${row.cd_grp_no}_${row.cd}_${idx}`
  }))
}

const closeCdDialog = () => {
  cdDialog.value = false
  cdPopupSchDatas.value = {}
  cdPopupList.value = []
  selectedPopupCodes.value = []
}

const returnCdPopupData = () => {
  if (selectedPopupCodes.value.length === 0) {
    $toast($t('선택할 항목이 없습니다.'), 'error')
    return
  }
  
  const returnData = cdPopupList.value.filter(item => 
    selectedPopupCodes.value.includes(item.id)
  )
  
  for (let i = 0; i < returnData.length; i++) {
    const exists = childList.value.some(
      c => c.cd_grp_no === returnData[i].cd_grp_no && c.cd === returnData[i].cd
    )
    
    if (!exists) {
      childList.value.push({
        ...returnData[i],
        id: `${returnData[i].cd_grp_no}_${returnData[i].cd}_${Date.now()}_${i}`,
        row_status: 'C'
      })
    }
  }
  
  $toast($t('중복된 데이터를 제외 후 추가되었습니다.'))
  closeCdDialog()
}

const del = async () => {
  if (selectedChildren.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  
  const res = await $confirm($t('삭제하시겠습니까?'))
  if (!res) return
  
  childList.value = childList.value.filter(item => !selectedChildren.value.includes(item.id))
  selectedChildren.value = []
}

const save = async () => {
  if (!selectedParent.value) {
    $toast($t('부모코드목록에서 코드를 선택해주세요.'), 'error')
    return
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const fromData = {
    insertRow: childList.value.filter(item => item.row_status === 'C'),
    updateRow: [],
    deleteRow: [],
    up_cd_grp_no: selectedParent.value.cd_grp_no,
    up_cd: selectedParent.value.cd,
  }
  
  const response = await $api.post('/sm/cdrel/save', fromData)
  if (response.result === 'Success') {
    $toast($t('저장되었습니다.'))
    await parentSearch()
    await childSearch()
  } else if (response.result === 'OverlapFail') {
    $toast($t('이미 존재하는 키입니다.'), 'error')
  } else {
    $toast($t('오류가 발생했습니다.'), 'error')
  }
}
</script>
