<template>
  <div>
    <CommonSearchCondition v-model:sch-datas="schDatas" v-model:page-id="usePageStore().getActivePage.page_id" @search="search" />
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-title>{{ $t('권한 목록') }}</v-card-title>
            <v-data-table
              :headers="roleHeaders"
              :items="roleList"
              density="compact"
              :items-per-page="-1"
              hide-default-footer
              class="elevation-1"
              @click:row="onRoleClick"
            ></v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="9">
          <v-card>
            <v-card-title>{{ $t('권한 API') }}</v-card-title>
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
            ></v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <dc-bottom-btn button-list='["save"]' @save="save" />
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
const roleList = ref([])
const apiList = ref([])
const selectedApis = ref([])
const selectedRoleId = ref(null)

const roleHeaders = [
  { title: $t('권한명'), key: 'role_nm', align: 'start', sortable: false },
]

const apiHeaders = computed(() => {
  const cols = [
    { title: $t('API ID'), key: 'api_id', align: 'center', sortable: false },
    { title: $t('업무구분'), key: 'bsns_cd_nm', align: 'center', sortable: false },
    { title: $t('API 명'), key: 'api_txt', align: 'start', sortable: false },
    { title: $t('API URL'), key: 'api_url', align: 'start', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => !['api_id', 'bsns_cd_nm', 'api_url'].includes(col.key))
  }
  return cols
})

const gridReadyCheck = async () => {
  const rows = await $api.post('/sm/role/list')
  roleList.value = rows || []
}

onMounted(() => {
  gridReadyCheck()
})

const search = () => {
  gridReadyCheck()
}

const onRoleClick = async (event, { item }) => {
  selectedRoleId.value = item.role_id
  schDatas.value.role_id = item.role_id
  await searchRoleApi()
}

const searchRoleApi = async () => {
  if (!selectedRoleId.value) return
  
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/roleapi/list', searchData)
  apiList.value = rows || []
  
  // 이미 선택된 API들 체크
  selectedApis.value = rows.filter(r => r.rolechk === 'Y').map(r => r.api_id)
}

const save = async () => {
  if (!selectedRoleId.value) {
    $toast($t('권한을 선택해주세요.'), 'error')
    return
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const saveData = apiList.value.map(api => ({
    ...api,
    rolechk: selectedApis.value.includes(api.api_id) ? 'Y' : 'N'
  }))
  
  await $api.post('/sm/roleapi/save', {
    role_id: selectedRoleId.value,
    apiList: saveData
  })
  
  $toast($t('저장되었습니다.'))
  searchRoleApi()
}
</script>
