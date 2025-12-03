<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition :sch-datas="schDatas" :page-id="usePageStore().getActivePage.page_id" :role-wkpl-condition="false" @search="search" />
      <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="loginHisList"
              :items-per-page="-1"
              hide-default-footer
              density="compact"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>{{ $t('로그인 이력 목록') }}</v-toolbar-title>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
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

// 검색조건
const schDatas = ref({})
const loginHisList = ref([])

// 헤더 정의
const headers = computed(() => [
  { title: $t('사용자 ID'), key: 'usr_id', align: 'center', sortable: false },
  { title: $t('사용자명'), key: 'usr_nm', align: 'center', sortable: false },
  { title: $t('날짜/시간'), key: 'login_dtm', align: 'center', sortable: false },
  { title: $t('IP address'), key: 'ip_addr', align: 'center', sortable: false },
  { title: $t('보유 권한'), key: 'role_list', align: 'start', sortable: false },
].filter(col => {
  // 모바일에서는 IP address, 보유 권한 숨김
  if (mobile.value && ['ip_addr', 'role_list'].includes(col.key)) return false
  return true
}))

// 검색
const search = async () => {
  const searchData = await $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post(`/api/v1/sm/log/login`, searchData)
  loginHisList.value = rows || []
}
</script>
