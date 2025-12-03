<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition v-model:sch-datas="schDatas" v-model:page-id="usePageStore().getActivePage.page_id" @search="search" />
      <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12" md="7">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>{{ $t('API 목록') }}</span>
                <v-spacer></v-spacer>
                <v-btn size="small" color="primary" @click="add" class="mr-2">{{ $t('추가') }}</v-btn>
                <v-btn size="small" color="error" @click="del">{{ $t('삭제') }}</v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedApis"
                :headers="apiHeaders"
                :items="apiList"
                item-value="api_id"
                show-select
                density="compact"
                :items-per-page="-1"
                hide-default-footer
                class="elevation-1"
                @click:row="onApiClick"
              ></v-data-table>
            </v-card>
          </v-col>
          <v-col cols="12" md="5">
            <v-card>
              <v-card-title>{{ $t('API 권한 목록') }}</v-card-title>
              <v-data-table
                v-model="selectedRoles"
                :headers="roleHeaders"
                :items="roleList"
                item-value="role_id"
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
const apiList = ref([])
const roleList = ref([])
const selectedApis = ref([])
const selectedRoles = ref([])
const selectedApiId = ref(null)

const codeList = {
  CO00000001: {},
}

const init = async () => {
  await $gfn_getCommonCodeArray(codeList)
}

await init()

const apiHeaders = computed(() => {
  const cols = [
    { title: $t('API ID'), key: 'api_id', align: 'center', sortable: false },
    { title: $t('업무구분'), key: 'bsns_cd', align: 'center', sortable: false },
    { title: $t('API 명'), key: 'api_txt', align: 'start', sortable: false },
    { title: $t('API URL'), key: 'api_url', align: 'start', sortable: false },
    { title: $t('사용여부'), key: 'usg_yn', align: 'center', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => !['api_id', 'bsns_cd', 'api_url', 'usg_yn'].includes(col.key))
  }
  return cols
})

const roleHeaders = [
  { title: $t('권한 ID'), key: 'role_id', align: 'center', sortable: false },
  { title: $t('권한명'), key: 'role_nm', align: 'start', sortable: false },
]

const search = async () => {
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/api/list', searchData)
  apiList.value = rows || []
}

const onApiClick = async (event, { item }) => {
  selectedApiId.value = item.api_id
  await searchApiRole(item.api_id)
}

const searchApiRole = async (apiId) => {
  if (!apiId) return
  
  const rows = await $api.post('/sm/apirole/list', { api_id: apiId })
  roleList.value = rows || []
  
  // 이미 선택된 권한들 체크
  selectedRoles.value = rows.filter(r => r.rolechk === 'Y').map(r => r.role_id)
}

const add = () => {
  $toast($t('개발 중입니다.'), 'info')
}

const del = async () => {
  if (selectedApis.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  $toast($t('개발 중입니다.'), 'info')
}

const save = async () => {
  if (!selectedApiId.value) {
    $toast($t('API를 선택해주세요.'), 'error')
    return
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const saveData = roleList.value.map(role => ({
    ...role,
    rolechk: selectedRoles.value.includes(role.role_id) ? 'Y' : 'N'
  }))
  
  await $api.post('/sm/apirole/save', {
    api_id: selectedApiId.value,
    roleList: saveData
  })
  
  $toast($t('저장되었습니다.'))
  searchApiRole(selectedApiId.value)
}
</script>
