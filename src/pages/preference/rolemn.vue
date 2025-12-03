<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition v-model:sch-datas="schDatas" v-model:page-id="usePageStore().getActivePage.page_id" @search="search" />
       <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center" :class="{ 'flex-wrap': mobile }">
                <span>{{ $t('권한 목록') }}</span>
                <v-spacer></v-spacer>
                <v-btn size="small" color="primary" @click="add" class="mr-2">{{ $t('추가') }}</v-btn>
                <v-btn size="small" color="error" @click="del">{{ $t('삭제') }}</v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedRoles"
                :headers="headers"
                :items="roleList"
                item-value="role_id"
                show-select
                density="compact"
                :items-per-page="-1"
                hide-default-footer
                class="elevation-1"
              >
                <template v-slot:item.role_nm="{ item }">
                  <a href="javascript:void(0)" @click.stop="edit(item)" class="text-primary text-decoration-none">
                    {{ item.role_nm }}
                  </a>
                </template>
                <template v-slot:item.bsns_cd="{ item }">
                  <span>{{ getBsnsCdNm(item.bsns_cd) }}</span>
                </template>
                <template v-slot:item.usr_cnt="{ item }">
                  <a v-if="item.role_id" href="javascript:void(0)" @click.stop="goUserList(item)" class="text-primary text-decoration-none">
                    {{ item.usr_cnt }}
                  </a>
                  <span v-else>{{ item.usr_cnt }}</span>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <dc-bottom-btn button-list='["save"]' @save="save" />
    </div>
  </CommonListWrapper>
  
  <!-- 권한 편집 팝업 -->
  <Teleport to="body">
    <v-dialog v-model="roleDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ roleDialogTitle }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-row dense>
            <v-col cols="12" v-if="editingRole.role_id && editingRole.row_status !== 'C'">
              <v-text-field
                v-model="editingRole.role_id"
                :label="$t('권한 ID')"
                density="comfortable"
                variant="outlined"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editingRole.role_nm"
                :label="$t('권한명')"
                density="comfortable"
                variant="outlined"
                :counter="300"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="editingRole.bsns_cd"
                :items="bsnsCdOptions"
                :label="$t('업무구분')"
                item-title="label"
                item-value="value"
                density="comfortable"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="editingRole.usg_yn"
                :items="usgYnOptions"
                :label="$t('사용여부')"
                item-title="label"
                item-value="value"
                density="comfortable"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editingRole.srt_sn"
                :label="$t('정렬순서')"
                density="comfortable"
                variant="outlined"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">{{ $t('취소') }}</v-btn>
          <v-btn color="primary" variant="flat" @click="saveRole">{{ $t('저장') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Teleport>
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
const selectedRoles = ref([])
const roleDialog = ref(false)
const editingRole = ref({})

// 공통 코드 리스트
const codeList = {
  CO00000001: {},
  CO00000004: {},
}

const init = async () => {
  await $gfn_getCommonCodeArray(codeList)
}

await init()

// 업무 구분 옵션
const bsnsCdOptions = computed(() => {
  return codeList.CO00000001.cd.map((cd, index) => ({
    value: cd,
    label: codeList.CO00000001.cd_nm[index]
  }))
})

// 사용 여부 옵션
const usgYnOptions = computed(() => {
  return codeList.CO00000004.cd.map((cd, index) => ({
    value: cd,
    label: codeList.CO00000004.cd_nm[index]
  }))
})

// 업무 구분 코드명
const getBsnsCdNm = (bsnsCd) => {
  const option = bsnsCdOptions.value.find(opt => opt.value === bsnsCd)
  return option ? option.label : ''
}

// 헤더 정의
const headers = computed(() => {
  const cols = [
    { title: $t('권한 ID'), key: 'role_id', align: 'center', sortable: false },
    { title: $t('권한명'), key: 'role_nm', align: 'start', sortable: false },
    { title: $t('업무구분'), key: 'bsns_cd', align: 'center', sortable: false },
    { title: $t('사용자수'), key: 'usr_cnt', align: 'center', sortable: false },
    { title: $t('사용여부'), key: 'usg_yn', align: 'center', sortable: false },
    { title: $t('정렬순서'), key: 'srt_sn', align: 'center', sortable: false },
    { title: $t('등록자'), key: 'crt_usr_nm', align: 'center', sortable: false },
    { title: $t('등록일'), key: 'crt_dt', align: 'center', sortable: false },
  ]
  
  // 모바일에서는 일부 컬럼 숨김
  if (mobile.value) {
    return cols.filter(col => !['role_id', 'bsns_cd', 'srt_sn', 'crt_usr_nm', 'crt_dt'].includes(col.key))
  }
  return cols
})

const roleDialogTitle = computed(() => {
  return editingRole.value.row_status === 'C' ? $t('권한 추가') : $t('권한 수정')
})

// 검색
const search = async (type) => {
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/role/list', searchData)
  roleList.value = rows.map(row => ({
    ...row,
    row_status: row.row_status || '',
  }))
}

// 추가
const add = () => {
  editingRole.value = {
    role_id: '',
    role_nm: '',
    bsns_cd: '',
    usr_cnt: '0',
    usg_yn: 'Y',
    srt_sn: '',
    row_status: 'C',
  }
  roleDialog.value = true
}

// 수정
const edit = (item) => {
  editingRole.value = { ...item }
  roleDialog.value = true
}

// 삭제
const del = async () => {
  if (selectedRoles.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  
  const res = await $confirm($t('삭제하시겠습니까?'))
  if (!res) return
  
  const deleteItems = selectedRoles.value.map(id => {
    return roleList.value.find(i => i.role_id === id)
  }).filter(item => item)
  
  const frmDatas = {
    insertRow: [],
    updateRow: [],
    deleteRow: deleteItems,
  }
  
  await $api.post('/sm/role/save', frmDatas)
  $toast($t('삭제되었습니다.'))
  selectedRoles.value = []
  search('save')
}

// 팝업 닫기
const closeDialog = () => {
  roleDialog.value = false
  editingRole.value = {}
}

// 저장
const saveRole = async () => {
  // 유효성 검사
  if ($gfn_isEmpty(editingRole.value.role_nm)) {
    $toast($t('권한명을 입력해 주세요.'), 'error')
    return
  }
  if ($gfn_isEmpty(editingRole.value.bsns_cd)) {
    $toast($t('업무구분을 선택해 주세요.'), 'error')
    return
  }
  if ($gfn_isEmpty(editingRole.value.srt_sn)) {
    $toast($t('정렬순서를 입력해 주세요.'), 'error')
    return
  }
  if (!/^[0-9]*$/.test(editingRole.value.srt_sn)) {
    $toast($t('정렬순서는 숫자만 입력해주세요.'), 'error')
    return
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const frmDatas = {}
  if (editingRole.value.row_status === 'C') {
    frmDatas.insertRow = [editingRole.value]
    frmDatas.updateRow = []
  } else {
    frmDatas.insertRow = []
    frmDatas.updateRow = [editingRole.value]
  }
  frmDatas.deleteRow = []
  
  await $api.post('/sm/role/save', frmDatas)
  $toast($t('저장되었습니다.'))
  closeDialog()
  search('save')
}

// 저장 (일괄)
const save = async () => {
  $toast($t('개별 항목을 수정하여 저장해주세요.'), 'info')
}

// 사용자 목록 이동
const goUserList = (item) => {
  $gfn_go(`/sm/mrgd/roleuserlist`, {
    params: {
      role_id: item.role_id,
      role_nm: item.role_nm,
    }
  })
}
</script>

<style scoped>
.text-primary {
  color: rgb(var(--v-theme-primary));
}

.text-decoration-none {
  text-decoration: none;
}
</style>
