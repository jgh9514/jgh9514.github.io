<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition v-model:sch-datas="schDatas" :page-id="usePageStore().getActivePage.page_id" :auto-condition="false" @search="search" />
      <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>{{ $t('화면 목록') }}</span>
                <v-spacer></v-spacer>
                <v-btn size="small" color="primary" @click="addGrp" class="mr-2">{{ $t('추가') }}</v-btn>
                <v-btn size="small" color="error" @click="delGrp">{{ $t('삭제') }}</v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedPages"
                :headers="pageHeaders"
                :items="pageList"
                item-value="page_id"
                show-select
                density="compact"
                :items-per-page="-1"
                hide-default-footer
                class="elevation-1"
                @click:row="onPageClick"
              ></v-data-table>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>{{ $t('검색조건 목록') }}</span>
                <v-spacer></v-spacer>
                <v-btn size="small" color="primary" @click="addCondition" class="mr-2">{{ $t('추가') }}</v-btn>
                <v-btn size="small" color="error" @click="delCondition">{{ $t('삭제') }}</v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedConditions"
                :headers="conditionHeaders"
                :items="conditionList"
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
      <PageConditionPopup ref="pageConditionPopup" @close="search" />
    </div>
  </CommonListWrapper>
</template>

<script setup>
import PageConditionPopup from './pageconditionpopup.vue'
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
const pageList = ref([])
const conditionList = ref([])
const selectedPages = ref([])
const selectedConditions = ref([])
const selectedPageId = ref(null)
const pageConditionPopup = ref(null)

const codeList = {
  CO00000004: {},
  CO00000005: {},
}

const init = async () => {
  await $gfn_getCommonCodeArray(codeList)
}

await init()

const pageHeaders = computed(() => {
  const cols = [
    { title: $t('화면 ID'), key: 'page_id', align: 'center', sortable: false },
    { title: $t('화면명'), key: 'page_nm', align: 'start', sortable: false },
    { title: $t('화면 URL'), key: 'page_url', align: 'start', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => col.key !== 'page_url')
  }
  return cols
})

const conditionHeaders = computed(() => {
  const cols = [
    { title: $t('조건 ID'), key: 'cond_id', align: 'center', sortable: false },
    { title: $t('조건명'), key: 'cond_nm', align: 'start', sortable: false },
    { title: $t('조건 타입'), key: 'cond_tp_cd', align: 'center', sortable: false },
    { title: $t('필수여부'), key: 'mdat_yn', align: 'center', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => !['cond_id', 'cond_tp_cd'].includes(col.key))
  }
  return cols
})

const search = async () => {
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/page/list', searchData)
  pageList.value = rows || []
}

const onPageClick = async (event, { item }) => {
  selectedPageId.value = item.page_id
  await searchCondition(item.page_id)
}

const searchCondition = async (pageId) => {
  if (!pageId) return
  
  const rows = await $api.post(`/api/v1/sm/pagecondition/list`, { page_id: pageId })
  conditionList.value = (rows || []).map((row, idx) => ({
    ...row,
    id: `${row.page_id}_${row.cond_id}_${idx}`
  }))
}

const addGrp = () => {
  pageConditionPopup.value.open('page', null)
}

const delGrp = async () => {
  if (selectedPages.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  $toast($t('개발 중입니다.'), 'info')
}

const addCondition = () => {
  if (!selectedPageId.value) {
    $toast($t('화면을 먼저 선택해주세요.'), 'error')
    return
  }
  pageConditionPopup.value.open('condition', { page_id: selectedPageId.value })
}

const delCondition = async () => {
  if (selectedConditions.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  $toast($t('개발 중입니다.'), 'info')
}

const save = async () => {
  $toast($t('개발 중입니다.'), 'info')
}
</script>
