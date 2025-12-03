<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition v-model:sch-datas="schDatas" v-model:page-id="usePageStore().getActivePage.page_id" @search="search" />
      <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="userList"
              :items-per-page="-1"
              hide-default-footer
              density="compact"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>{{ $t('사용자 목록') }}</v-toolbar-title>
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

const schDatas = ref({})
const userList = ref([])

// 헤더 정의
const headers = computed(() => [
  { title: $t('사용자 ID'), key: 'user_id', align: 'center', sortable: false },
  { title: $t('사용자명'), key: 'user_nm', align: 'center', sortable: false },
  { title: $t('사용여부'), key: 'usg_yn', align: 'center', sortable: false },
  { title: $t('삭제여부'), key: 'del_yn', align: 'center', sortable: false },
  { title: $t('언어 코드'), key: 'lang_cd', align: 'center', sortable: false },
].filter(col => {
  // 모바일에서는 언어 코드 숨김
  if (mobile.value && ['lang_cd'].includes(col.key)) return false
  return true
}))

// 검색
const search = async () => {
  const searchData = await $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/user/list', searchData)
  userList.value = rows || []
}
</script>
