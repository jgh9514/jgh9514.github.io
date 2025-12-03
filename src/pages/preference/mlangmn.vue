<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition :sch-datas="schDatas" :page-id="usePageStore().getActivePage.page_id" @search="search" />
      <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>{{ $t('다국어 목록') }}</span>
                <v-spacer></v-spacer>
                <v-btn size="small" color="primary" @click="add" class="mr-2">{{ $t('추가') }}</v-btn>
                <v-btn size="small" color="error" @click="del">{{ $t('삭제') }}</v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedItems"
                :headers="headers"
                :items="mlangList"
                item-value="mlang_id"
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
const mlangList = ref([])
const selectedItems = ref([])

const codeList = {
  CO00000001: {},
  CO00000008: {},
}

const init = async () => {
  await $gfn_getCommonCodeArray(codeList)
}

await init()

const headers = computed(() => {
  const cols = [
    { title: $t('MLANG_ID'), key: 'mlang_id', align: 'center', sortable: false },
    { title: $t('다국어 유형'), key: 'mlang_tp_cd', align: 'center', sortable: false },
    { title: $t('업무구분'), key: 'bsns_cd', align: 'center', sortable: false },
    { title: $t('언어'), key: 'lang_cd', align: 'center', sortable: false },
    { title: $t('라벨/메시지'), key: 'mlang_txt', align: 'start', sortable: false },
    { title: $t('등록자'), key: 'usr_nm', align: 'center', sortable: false },
    { title: $t('등록일'), key: 'upt_dt', align: 'center', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => !['mlang_tp_cd', 'bsns_cd', 'usr_nm', 'upt_dt'].includes(col.key))
  }
  return cols
})

const search = async () => {
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/mlang/list', searchData)
  mlangList.value = rows || []
}

const add = () => {
  $toast($t('개발 중입니다.'), 'info')
}

const del = async () => {
  if (selectedItems.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  $toast($t('개발 중입니다.'), 'info')
}

const save = async () => {
  $toast($t('개발 중입니다.'), 'info')
}
</script>
