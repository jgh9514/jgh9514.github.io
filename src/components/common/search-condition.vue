<template>
  <div>
    <v-container v-show="schData.COMMON_SEARCH_PAGE_INFO" class="search-condition-container">
      <v-row>
        <v-col cols="10">
          <dc-row>
            <dc-col-label-value v-for="cnd in schCndtItems" :key="cnd" :label="cnd.label_nm">
              <div v-if="cnd.element_cd === 'SELECT'">
                <dc-search-select
                  ref="children"
                  v-model="schData[cnd.bind_column_nm]"
                  :data="cnd"
                  :cd-grp="cnd.cd_grp_no_val"
                  :up-cd="cnd.up_bind_column_nm ? schData[cnd.up_bind_column_nm] : undefined"
                  :label="cnd.label_nm"
                  :placeholder="cnd.placeholder_nm"
                  :return-object="true"
                  :disabled="isReadonly(cnd)"
                  :clearable="!isReadonly(cnd)"
                />
              </div>
              <div v-if="cnd.element_cd === 'TEXT'">
                <dc-search-input ref="children" v-model="schData[cnd.bind_column_nm]" :data="cnd" :label="cnd.label_nm" @enter="search" />
              </div>
              <div v-if="cnd.element_cd === 'USER'">
                <dc-search-user ref="children" v-model="schData[cnd.bind_column_nm]" :data="cnd" :label="cnd.label_nm" />
              </div>
              <div v-if="cnd.element_cd === 'YEAR'">
                <dc-search-year ref="children" v-model="schData[cnd.bind_column_nm]" :data="cnd" :label="cnd.label_nm" />
              </div>
              <div v-if="cnd.element_cd === 'CALENDAR'">
                <dc-search-calendar ref="children" v-model="schData[cnd.bind_column_nm]" :data="cnd" />
              </div>
              <div v-if="cnd.element_cd === 'RANGECALENDAR'">
                <dc-search-calendar-from-to ref="children" v-model:start="schData[cnd.calendar_from_model_id]" v-model:end="schData[cnd.calendar_to_model_id]" :data="cnd" @enter="search" />
              </div>
            </dc-col-label-value>
            <slot />
          </dc-row>
        </v-col>
        <v-col cols="2" class="search-condition-btn" align-self="end">
          <dc-btn :label="$t('초기화')" @click="init" />
          <dc-btn :label="$t('검색')" @click="search" />
        </v-col>
      </v-row>
      <v-divider class="mt-3 mb-0 pb-0" />
    </v-container>
  </div>
</template>
<script setup>
const searchConditionStore = useSearchConditionStore()

const schData = defineModel('sch-datas')
const pageId = defineModel('page-id')

// 자동 조건 여부 => 팝업창에서는 검색조건의 기본 값을 화면에서 보내주기 때문에
const autoCondition = defineModel('auto-condition', { default: true })
// 권한별 사업장 조건 적용 여부
const roleWkplCondition = defineModel('role-wkpl-condition', { default: true })
// 검색 로딩 여부
const loadingSearch = defineModel('loading-search', { default: true })
// 조회조건 유지 여부
const configurationManagement = defineModel('configuration-management', { default: true })
// 최초진입시 자동 검색
const autoSearch = defineModel('auto-search', { default: true })

const emit = defineEmits(['search', 'enter', 'ready', 'reset'])

const schCndtItems = ref([])

const children = ref([])
const isPrcsReady = ref(false)

const level1 = ref([])
const level2 = ref([])
const level3 = ref([])
const level4 = ref([])

const init = async () => {
  await nextTick()

  for (const child of children.value) {
    if (child.init) {
      await child.init()
    }
  }
  emit('reset')
}

onMounted(async () => {
  await getPageSearchElements()

  if (loadingSearch.value) {
    if (autoSearch.value) {
      search()
    }
  }
})

const getPageSearchElements = async () => {
  const data = await $api.post('/sm/page-search-list', { page_id: pageId.value })
console.log('data', data)
  schCndtItems.value = data
  schCndtItems.value.forEach((item) => {
    if (item.init_data_yn === 'Y') {
      if (!$gfn_isEmpty(item.bind_column_nm)) {
        schData.value[item.bind_column_nm] = item.init_data_val
      }
    }
  })
  await init()
  if (configurationManagement.value) {
    const searchDataHistory = await getSchData()
    if (!$gfn_isEmpty(searchDataHistory)) {
      // 검색 조건 이력 데이터 로드
      Object.keys(searchDataHistory).forEach((key) => {
        schData.value[key] = searchDataHistory[key]
      })
    }
  }
  setCommonSearchData()
}

const search = () => {
  setSchData()
  emit('search')
}

const isReadonly = (cnd) => {
  if (cnd.editable_yn === 'N') {
    return true
  }
  return false
}

const setSchData = () => {
  const searchData = Object.assign({}, schData.value)
  searchConditionStore.setSchCondition(pageId.value, searchData)
}
const getSchData = () => {
  return searchConditionStore.getSchCondition(pageId.value)
}

const setCommonSearchData = () => {
  schData.value.COMMON_SEARCH_PAGE_INFO = pageId.value
  schData.value.COMMON_AUTO_CONDITION = autoCondition.value ? 'Y' : 'N'
  schData.value.COMMON_ROLE_WKPL_CONDITION = roleWkplCondition.value ? 'Y' : 'N'
}
</script>
