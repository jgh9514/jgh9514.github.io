<template>
  <div>
    <CommonListWrapper>
      <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
        <!-- 공통 검색 조건 컴포넌트 -->
        <CommonSearchCondition v-model:page-id="usePageStore().getActivePage.page_id" v-model:sch-datas="schDatas" @search="cdGrpSearch" />
        <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
          <v-row>
            <v-col cols="12" md="5">
              <v-card>
                <v-card-title class="d-flex align-center">
                  <span>{{ $t('코드 그룹 목록') }}</span>
                  <v-spacer></v-spacer>
                  <v-btn size="small" color="primary" @click="addGrp" class="mr-2">{{ $t('추가') }}</v-btn>
                  <v-btn size="small" color="error" @click="delGrp">{{ $t('삭제') }}</v-btn>
                </v-card-title>
                <v-data-table
                  v-model="selectedCdGrp"
                  :headers="cdGrpHeaders"
                  :items="cdGrpItems"
                  item-value="id"
                  show-select
                  density="compact"
                  :items-per-page="-1"
                  hide-default-footer
                  class="elevation-1 code-grp-table"
                  @click:row="onCdGrpRowClick"
                >
                  <template v-slot:item.bsns_cd="{ item }">
                    <span>{{ getBsnsCdNm(item.bsns_cd) }}</span>
                  </template>
                  <template v-if="!mobile" v-slot:item.dtl_bsns_cd="{ item }">
                    <span>{{ getDtlBsnsCdNm(item.bsns_cd, item.dtl_bsns_cd) }}</span>
                  </template>
                  <template v-slot:item.cd_grp_nm="{ item }">
                    <a href="javascript:void(0)" @click.stop="editGrp(item)" class="text-primary text-decoration-none">
                      {{ item.cd_grp_nm }}
                    </a>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <v-card>
                <v-card-title class="d-flex align-center">
                  <span>{{ $t('코드 목록') }}</span>
                  <v-spacer></v-spacer>
                  <v-btn size="small" color="primary" @click="add" class="mr-2" :disabled="!selectedCdGrpItem">{{ $t('추가') }}</v-btn>
                  <v-btn size="small" color="error" @click="del" :disabled="!selectedCdGrpItem">{{ $t('삭제') }}</v-btn>
                </v-card-title>
                <v-data-table
                  v-model="selectedCd"
                  :headers="cdHeaders"
                  :items="cdItems"
                  item-value="id"
                  show-select
                  density="compact"
                  :items-per-page="-1"
                  hide-default-footer
                  class="elevation-1"
                >
                  <template v-slot:item.cd="{ item }">
                    <a href="javascript:void(0)" @click.stop="edit(item)" class="text-primary text-decoration-none">
                      {{ item.cd }}
                    </a>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </CommonListWrapper>
    
    <!-- 코드 그룹 편집 팝업 -->
    <Teleport to="body">
      <v-dialog v-model="cdGrpDialog" fullscreen persistent transition="dialog-bottom-transition">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span>{{ cdGrpDialogTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" @click="closeCdGrpDialog"></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <v-container>
              <v-row justify="center">
                <v-col cols="12" sm="8" md="6" lg="4">
                  <v-row dense>
                    <v-col cols="12">
                <v-select
                  v-model="editingCdGrp.bsns_cd"
                  :items="bsnsCdOptions"
                  :label="$t('업무')"
                  item-title="label"
                  item-value="value"
                  density="comfortable"
                  variant="outlined"
                  :disabled="editingCdGrp.row_status !== 'C'"
                  @update:model-value="onBsnsCdChange(editingCdGrp)"
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="!mobile">
                <v-select
                  v-model="editingCdGrp.dtl_bsns_cd"
                  :items="getFilteredDtlBsnsCd(editingCdGrp.bsns_cd)"
                  :label="$t('상세업무')"
                  item-title="label"
                  item-value="value"
                  density="comfortable"
                  variant="outlined"
                  :disabled="!editingCdGrp.bsns_cd || editingCdGrp.bsns_cd === 'CO' || editingCdGrp.row_status !== 'C'"
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="editingCdGrp.row_status !== 'C'">
                <v-text-field
                  v-model="editingCdGrp.cd_grp_no"
                  :label="$t('코드그룹')"
                  density="comfortable"
                  variant="outlined"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editingCdGrp.cd_grp_nm"
                  :label="$t('코드그룹명')"
                  density="comfortable"
                  variant="outlined"
                  :counter="100"
                ></v-text-field>
              </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeCdGrpDialog">{{ $t('취소') }}</v-btn>
            <v-btn color="primary" variant="flat" @click="saveCdGrp">{{ $t('저장') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Teleport>

    <!-- 코드 편집 팝업 -->
    <Teleport to="body">
      <v-dialog v-model="cdDialog" fullscreen persistent transition="dialog-bottom-transition">
        <v-card>
          <v-card-title class="d-flex align-center">
            <span>{{ cdDialogTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" @click="closeCdDialog"></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            <v-container>
              <v-row justify="center">
                <v-col cols="12" md="10" lg="8">
                  <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.cd"
                  :label="$t('코드값')"
                  density="comfortable"
                  variant="outlined"
                  :counter="20"
                  :readonly="editingCd.row_status !== 'C'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.srt_sn"
                  :label="$t('정렬순서')"
                  density="comfortable"
                  variant="outlined"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editingCd.cd_nm"
                  :label="$t('코드명')"
                  density="comfortable"
                  variant="outlined"
                  :counter="600"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.buf_fst_txt"
                  label="BUFF1"
                  density="comfortable"
                  variant="outlined"
                  :counter="200"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.buf_snd_txt"
                  label="BUFF2"
                  density="comfortable"
                  variant="outlined"
                  :counter="200"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.buf_trd_txt"
                  label="BUFF3"
                  density="comfortable"
                  variant="outlined"
                  :counter="200"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.buf_fth_txt"
                  label="BUFF4"
                  density="comfortable"
                  variant="outlined"
                  :counter="200"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editingCd.buf_ffh_txt"
                  label="BUFF5"
                  density="comfortable"
                  variant="outlined"
                  :counter="200"
                ></v-text-field>
              </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeCdDialog">{{ $t('취소') }}</v-btn>
            <v-btn color="primary" variant="flat" @click="saveCd">{{ $t('저장') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
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

// 공통 코드 목록
const codeList = reactive({
  CO00000001: {
    cd: [],
    cd_nm: [],
  },
})

// 업무 상세 코드
const bsnsDtlCd = reactive({
  id: 'bsnsDtlCd',
  levels: 2,
  tags: [],
  keys: [],
  values: [],
})

// 검색 조건 데이터
const schDatas = ref({})
// 코드 검색 조건 데이터
const cdSchDatas = ref({})

// 테이블 데이터
const cdGrpItems = ref([])
const cdItems = ref([])
const selectedCdGrp = ref([])
const selectedCd = ref([])
const selectedCdGrpItem = ref(null)

// 팝업 관련
const cdGrpDialog = ref(false)
const cdDialog = ref(false)
const editingCdGrp = ref({})
const editingCd = ref({})

// 팝업 제목
const cdGrpDialogTitle = computed(() => {
  return editingCdGrp.value.row_status === 'C' ? $t('코드 그룹 추가') : $t('코드 그룹 수정')
})
const cdDialogTitle = computed(() => {
  return editingCd.value.row_status === 'C' ? $t('코드 추가') : $t('코드 수정')
})

// 고유 ID 생성용 카운터
let idCounter = 0

// 업무 코드 옵션
const bsnsCdOptions = computed(() => {
  return codeList.CO00000001.cd.map((cd, index) => ({
    value: cd,
    label: codeList.CO00000001.cd_nm[index]
  }))
})

// 코드 그룹 헤더
const cdGrpHeaders = computed(() => {
  const headers = [
    { title: $t('업무'), key: 'bsns_cd', align: 'center', width: '120px' },
  ]
  
  // 모바일이 아닐 때만 상세업무 추가
  if (!mobile.value) {
    headers.push({ title: $t('상세업무'), key: 'dtl_bsns_cd', align: 'center', width: '120px' })
  }
  
  headers.push(
    { title: $t('코드그룹'), key: 'cd_grp_no', align: 'center', width: '120px' },
    { title: $t('코드그룹명'), key: 'cd_grp_nm', align: 'start', width: '200px' }
  )
  
  return headers
})

// 코드 헤더
const cdHeaders = computed(() => {
  const headers = [
    { title: $t('코드값'), key: 'cd', align: 'center', width: '100px' },
    { title: $t('코드명'), key: 'cd_nm', align: 'start', width: '150px' },
    { title: $t('정렬순서'), key: 'srt_sn', align: 'center', width: '100px' },
  ]
  
  // 모바일이 아닐 때만 BUFF 추가
  if (!mobile.value) {
    headers.push(
      { title: 'BUFF1', key: 'buf_fst_txt', align: 'center', width: '100px' },
      { title: 'BUFF2', key: 'buf_snd_txt', align: 'center', width: '100px' },
      { title: 'BUFF3', key: 'buf_trd_txt', align: 'center', width: '100px' },
      { title: 'BUFF4', key: 'buf_fth_txt', align: 'center', width: '100px' },
      { title: 'BUFF5', key: 'buf_ffh_txt', align: 'center', width: '100px' }
    )
  }
  
  return headers
})

// 업무 코드명 가져오기
const getBsnsCdNm = (bsnsCd) => {
  const option = bsnsCdOptions.value.find(opt => opt.value === bsnsCd)
  return option ? option.label : ''
}

// 상세 업무 코드명 가져오기
const getDtlBsnsCdNm = (bsnsCd, dtlBsnsCd) => {
  if (!bsnsCd || bsnsCd === 'CO' || !dtlBsnsCd) return ''
  const filtered = getFilteredDtlBsnsCd(bsnsCd)
  const option = filtered.find(opt => opt.value === dtlBsnsCd)
  return option ? option.label : ''
}

// 상세업무 필터링 함수
const getFilteredDtlBsnsCd = (bsnsCd) => {
  if (!bsnsCd || bsnsCd === 'CO') return []
  
  const filtered = []
  for (let i = 0; i < bsnsDtlCd.tags.length; i++) {
    const tag = bsnsDtlCd.tags[i]
    const parts = tag.split('\t')
    if (parts[0] === bsnsCd) {
      filtered.push({
        label: bsnsDtlCd.values[i],
        value: parts[1]
      })
    }
  }
  return filtered
}

// 업무 코드 변경 시
const onBsnsCdChange = (item) => {
  // 업무 코드가 변경되면 상세업무를 초기화
  item.dtl_bsns_cd = ''
}

// 코드 그룹 행 클릭 시
const onCdGrpRowClick = async (event, { item }) => {
  if ($gfn_isEmpty(item.cd_grp_no)) return
  
  // 기존 하이라이트 제거
  const table = document.querySelector('.code-grp-table tbody')
  if (table) {
    const rows = table.querySelectorAll('tr')
    rows.forEach(row => row.classList.remove('active-row'))
  }
  
  // 새로운 행 하이라이트
  const clickedRow = event.currentTarget || event.target.closest('tr')
  if (clickedRow) {
    clickedRow.classList.add('active-row')
  }
  
  selectedCdGrpItem.value = item
  cdSchDatas.value.cd_grp_no = item.cd_grp_no
  await cdSearch('cdGrp')
}

// 코드 그룹 추가
const addGrp = () => {
  editingCdGrp.value = {
    id: `new_${idCounter++}`,
    cd_grp_no: '',
    bsns_cd: '',
    dtl_bsns_cd: '',
    cd_grp_nm: '',
    row_status: 'C',
  }
  cdGrpDialog.value = true
}

// 코드 그룹 수정
const editGrp = (item) => {
  editingCdGrp.value = { ...item }
  cdGrpDialog.value = true
}

// 코드 그룹 팝업 닫기
const closeCdGrpDialog = () => {
  cdGrpDialog.value = false
  editingCdGrp.value = {}
}

// 코드 그룹 저장
const saveCdGrp = async () => {
  // 유효성 검사
  if ($gfn_isEmpty(editingCdGrp.value.bsns_cd)) {
    $toast($t('업무코드를 선택해주세요.'), 'error')
    return
  }
  if ($gfn_isEmpty(editingCdGrp.value.cd_grp_nm)) {
    $toast($t('코드 그룹명을 입력해주세요.'), 'error')
    return
  }
  if (editingCdGrp.value.cd_grp_nm && editingCdGrp.value.cd_grp_nm.length > 100) {
    $toast($t('코드 그룹명은 100자 이하로 입력해주세요.'), 'error')
    return
  }
  if (editingCdGrp.value.bsns_cd !== 'CO' && $gfn_isEmpty(editingCdGrp.value.dtl_bsns_cd)) {
    $toast($t('상세 업무를 선택해주세요.'), 'error')
    return
  }

  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return

  const fromData = {}

  if (editingCdGrp.value.row_status === 'C') {
    fromData.insertGrpRow = [editingCdGrp.value]
    fromData.updateGrpRow = []
  } else {
    fromData.insertGrpRow = []
    fromData.updateGrpRow = [editingCdGrp.value]
  }
  fromData.deleteGrpRow = []
  fromData.insertRow = []
  fromData.updateRow = []
  fromData.deleteRow = []

  await $api.post('/sm/cd/save', fromData)
  $toast($t('저장되었습니다.'))
  closeCdGrpDialog()
  await cdGrpSearch('save')
}

// 코드 그룹 삭제
const delGrp = async () => {
  if (selectedCdGrp.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  
  const res = await $confirm($t('삭제하시겠습니까?'))
  if (!res) return

  const deleteItems = selectedCdGrp.value.map(id => {
    return cdGrpItems.value.find(i => i.id === id)
  }).filter(item => item)

  const fromData = {
    insertGrpRow: [],
    updateGrpRow: [],
    deleteGrpRow: deleteItems,
    insertRow: [],
    updateRow: [],
    deleteRow: []
  }

  await $api.post('/sm/cd/save', fromData)
  $toast($t('삭제되었습니다.'))
  selectedCdGrp.value = []
  cdItems.value = []
  selectedCdGrpItem.value = null
  await cdGrpSearch('save')
}

// 코드 추가
const add = () => {
  if (!selectedCdGrpItem.value) {
    $toast($t('코드 그룹을 먼저 선택해주세요.'), 'error')
    return
  }
  
  editingCd.value = {
    id: `new_${idCounter++}`,
    cd: '',
    cd_nm: '',
    srt_sn: '',
    buf_fst_txt: '',
    buf_snd_txt: '',
    buf_trd_txt: '',
    buf_fth_txt: '',
    buf_ffh_txt: '',
    row_status: 'C',
  }
  cdDialog.value = true
}

// 코드 수정
const edit = (item) => {
  editingCd.value = { ...item }
  cdDialog.value = true
}

// 코드 팝업 닫기
const closeCdDialog = () => {
  cdDialog.value = false
  editingCd.value = {}
}

// 코드 저장
const saveCd = async () => {
  // 유효성 검사
  if ($gfn_isEmpty(editingCd.value.cd)) {
    $toast($t('코드값을 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.cd && editingCd.value.cd.length > 20) {
    $toast($t('코드값은 20자 이하로 입력해주세요.'), 'error')
    return
  }
  if (/[\s]/g.test(editingCd.value.cd)) {
    $toast($t('코드값에 공백문자는 사용할 수 없습니다.'), 'error')
    return
  }
  if (!/^[A-Za-z0-9+]*$/.test(editingCd.value.cd)) {
    $toast($t('코드값은 영문, 숫자만 입력해주세요.'), 'error')
    return
  }
  if ($gfn_isEmpty(editingCd.value.cd_nm)) {
    $toast($t('코드명을 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.cd_nm && editingCd.value.cd_nm.length > 600) {
    $toast($t('코드명은 600자 이하로 입력해주세요.'), 'error')
    return
  }
  if ($gfn_isEmpty(editingCd.value.srt_sn)) {
    $toast($t('정렬 순서를 입력해주세요.'), 'error')
    return
  }
  if (!/^[0-9]*$/.test(editingCd.value.srt_sn)) {
    $toast($t('정렬 순서는 숫자만 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.srt_sn && String(editingCd.value.srt_sn).length > 9) {
    $toast($t('정렬 순서는 9자리 이하로 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.buf_fst_txt && editingCd.value.buf_fst_txt.length > 200) {
    $toast($t('BUFF1은 200자 이하로 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.buf_snd_txt && editingCd.value.buf_snd_txt.length > 200) {
    $toast($t('BUFF2은 200자 이하로 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.buf_trd_txt && editingCd.value.buf_trd_txt.length > 200) {
    $toast($t('BUFF3은 200자 이하로 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.buf_fth_txt && editingCd.value.buf_fth_txt.length > 200) {
    $toast($t('BUFF4은 200자 이하로 입력해주세요.'), 'error')
    return
  }
  if (editingCd.value.buf_ffh_txt && editingCd.value.buf_ffh_txt.length > 200) {
    $toast($t('BUFF5은 200자 이하로 입력해주세요.'), 'error')
    return
  }

  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return

  const fromData = {
    insertGrpRow: [],
    updateGrpRow: [],
    deleteGrpRow: [],
    bsns_cd: selectedCdGrpItem.value.bsns_cd,
    cd_grp_no: selectedCdGrpItem.value.cd_grp_no,
  }

  if (editingCd.value.row_status === 'C') {
    fromData.insertRow = [editingCd.value]
    fromData.updateRow = []
  } else {
    fromData.insertRow = []
    fromData.updateRow = [editingCd.value]
  }
  fromData.deleteRow = []

  await $api.post('/sm/cd/save', fromData)
  $toast($t('저장되었습니다.'))
  closeCdDialog()
  await cdSearch('save')
}

// 코드 삭제
const del = async () => {
  if (selectedCd.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  
  const res = await $confirm($t('삭제하시겠습니까?'))
  if (!res) return

  const deleteItems = selectedCd.value.map(id => {
    return cdItems.value.find(i => i.id === id)
  }).filter(item => item)

  const fromData = {
    insertGrpRow: [],
    updateGrpRow: [],
    deleteGrpRow: [],
    insertRow: [],
    updateRow: [],
    deleteRow: deleteItems,
    bsns_cd: selectedCdGrpItem.value.bsns_cd,
    cd_grp_no: selectedCdGrpItem.value.cd_grp_no,
  }

  await $api.post('/sm/cd/save', fromData)
  $toast($t('삭제되었습니다.'))
  selectedCd.value = []
  await cdSearch('save')
}

// 선택된 행 하이라이트 적용
const applyActiveRowHighlight = async () => {
  await nextTick()
  if (selectedCdGrpItem.value) {
    const table = document.querySelector('.code-grp-table tbody')
    if (table) {
      const rows = table.querySelectorAll('tr')
      rows.forEach(row => {
        row.classList.remove('active-row')
        // data-item-value 또는 다른 방법으로 행 식별
        const checkbox = row.querySelector('input[type="checkbox"]')
        if (checkbox && checkbox.value === selectedCdGrpItem.value.id) {
          row.classList.add('active-row')
        }
      })
    }
  }
}

// 코드 그룹 검색
const cdGrpSearch = async (type) => {
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post(`/sm/cd/group`, searchData)
  
  cdGrpItems.value = rows.map((row, index) => ({
    ...row,
    id: row.cd_grp_no || `grp_${index}`,
    row_status: row.row_status || '',
  }))
  
  if (type !== 'save') {
    cdItems.value = []
    selectedCdGrpItem.value = null
  }
  
  if (type === 'save' && selectedCdGrpItem.value) {
    // 저장 후 이전 선택 항목 유지
    const item = cdGrpItems.value.find(i => i.cd_grp_no === selectedCdGrpItem.value.cd_grp_no)
    if (item) {
      selectedCdGrpItem.value = item
      cdSchDatas.value.cd_grp_no = item.cd_grp_no
      await cdSearch('cdGrp')
      await applyActiveRowHighlight()
    }
  }
}

// 코드 검색
const cdSearch = async (type) => {
  if (!$gfn_isEmpty(cdSchDatas.value.cd_grp_no)) {
    const cdSearchData = $gfn_searchDataExtraction(cdSchDatas.value)
    const cdRows = await $api.post(`/sm/cd/list`, cdSearchData)
    
    cdItems.value = cdRows.map((row, index) => ({
      ...row,
      id: row.cd ? `cd_${row.cd}_${index}` : `cd_${index}`,
      row_status: row.row_status || '',
    }))
  }
}

const init = async () => {
  await $gfn_getCommonCodeArray(codeList)
  const CO00000002 = await $gfn_getCommonCodeArrayToHierarchy('CO00000002')
  bsnsDtlCd.keys = CO00000002.keys
  bsnsDtlCd.values = CO00000002.values
  bsnsDtlCd.tags = CO00000002.tags
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.text-primary {
  color: rgb(var(--v-theme-primary));
}

.text-decoration-none {
  text-decoration: none;
}

:deep(.v-data-table) {
  font-size: 0.875rem;
}

:deep(.v-data-table .v-data-table__td) {
  padding: 4px 8px !important;
}

:deep(.v-data-table tbody tr) {
  cursor: pointer;
}

:deep(.code-grp-table tbody tr) {
  position: relative;
}

/* 체크박스로 선택된 행 */
:deep(.code-grp-table tbody tr[aria-selected="true"]) {
  background-color: rgba(25, 118, 210, 0.08) !important;
}

/* 클릭하여 활성화된 행 (코드 목록을 보여주는 행) */
:deep(.code-grp-table tbody tr.active-row) {
  background-color: rgba(25, 118, 210, 0.18) !important;
  border-left: 4px solid rgb(25, 118, 210);
  font-weight: 500;
}

:deep(.code-grp-table tbody tr.active-row:hover) {
  background-color: rgba(25, 118, 210, 0.25) !important;
}

/* 체크박스 선택과 활성화가 동시에 된 경우 */
:deep(.code-grp-table tbody tr.active-row[aria-selected="true"]) {
  background-color: rgba(25, 118, 210, 0.22) !important;
}
</style>
