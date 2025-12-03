<template>
  <CommonListWrapper>
    <div v-show="schDatas.COMMON_SEARCH_PAGE_INFO" class="search-container">
      <CommonSearchCondition :sch-datas="schDatas" :page-id="usePageStore().getActivePage.page_id" @search="search" />
      <v-container v-if="schDatas.COMMON_SEARCH_PAGE_INFO">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center">
                <span>{{ $t('권한별 사용자 목록') }}</span>
                <v-spacer></v-spacer>
                <v-btn size="small" color="primary" @click="add" class="mr-2">{{ $t('추가') }}</v-btn>
                <v-btn size="small" color="error" @click="del">{{ $t('삭제') }}</v-btn>
              </v-card-title>
              <v-data-table
                v-model="selectedUsers"
                :headers="headers"
                :items="userRoleList"
                item-value="usr_id"
                show-select
                density="compact"
                :items-per-page="-1"
                hide-default-footer
                class="elevation-1"
              >
                <template v-slot:item.role_nm="{ item }">
                  <v-select
                    v-if="item.row_status === 'C'"
                    v-model="item.role_id"
                    :items="roleOptions"
                    item-title="label"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    hide-details
                    @update:model-value="(val) => onRoleChange(item, val)"
                  ></v-select>
                  <span v-else>{{ item.role_nm }}</span>
                </template>
                <template v-slot:item.usr_nm="{ item }">
                  <v-btn
                    v-if="item.row_status === 'C'"
                    variant="text"
                    size="small"
                    @click="selectUser(item)"
                  >
                    {{ item.usr_nm || $t('사용자 선택') }}
                  </v-btn>
                  <span v-else>{{ item.usr_nm }}</span>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <dc-bottom-btn button-list='["save", "list"]' @save="save" @go-list="goList" />
      <PopupUserSelect ref="userPop" @close="closeUserPop" />
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

const routeParam = $gfn_getRouteParam()

const schDatas = ref({})
const userRoleList = ref([])
const selectedUsers = ref([])
const userPop = ref(null)
const currentEditingItem = ref(null)

// 권한 목록
const roleList = {
  cd: [],
  cd_nm: [],
}

const roleOptions = computed(() => {
  return roleList.cd.map((cd, index) => ({
    value: cd,
    label: roleList.cd_nm[index]
  }))
})

// 헤더 정의
const headers = computed(() => {
  const cols = [
    { title: $t('권한ID'), key: 'role_id', align: 'center', sortable: false },
    { title: $t('권한명'), key: 'role_nm', align: 'center', sortable: false },
    { title: $t('사번'), key: 'emp_no', align: 'center', sortable: false },
    { title: $t('이름'), key: 'usr_nm', align: 'center', sortable: false },
    { title: $t('부서'), key: 'dept_nm', align: 'center', sortable: false },
    { title: $t('사용여부'), key: 'usg_yn', align: 'center', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => !['role_id', 'emp_no', 'usg_yn'].includes(col.key))
  }
  return cols
})

onMounted(async () => {
  await getRoleCode()
  if (!$gfn_isEmpty(routeParam)) {
    schDatas.value.role_nm = $gfn_isEmpty(routeParam.params.role_nm) ? '' : routeParam.params.role_nm
  }
})

// 권한 코드 조회
const getRoleCode = async () => {
  const res = await $api.post(`/sm/role/list`)
  roleList.cd.push('')
  roleList.cd_nm.push('SELECT')
  res.forEach((i) => {
    roleList.cd.push(i.role_id)
    roleList.cd_nm.push(i.role_nm)
  })
}

// 검색
const search = async () => {
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/userrole/list', searchData)
  userRoleList.value = rows.map(row => ({
    ...row,
    row_status: row.row_status || '',
  }))
}

// 추가
const add = () => {
  userRoleList.value.unshift({
    usr_id: '',
    role_tp_nm: '',
    role_nm: '',
    role_id: '',
    emp_no: '',
    usr_nm: '',
    dept_nm: '',
    usg_yn: 'Y',
    row_status: 'C',
  })
}

// 삭제
const del = async () => {
  if (selectedUsers.value.length === 0) {
    $toast($t('삭제할 데이터가 없습니다.'), 'error')
    return
  }
  
  const res = await $confirm($t('삭제하시겠습니까?'))
  if (!res) return
  
  userRoleList.value = userRoleList.value.filter(item => !selectedUsers.value.includes(item.usr_id))
  selectedUsers.value = []
}

// 권한 변경
const onRoleChange = (item, roleId) => {
  const role = roleOptions.value.find(r => r.value === roleId)
  if (role) {
    item.role_nm = role.label
  }
}

// 사용자 선택
const selectUser = (item) => {
  currentEditingItem.value = item
  userPop.value.open({}, false)
}

// 사용자 선택 팝업 닫기
const closeUserPop = (returnData) => {
  if (!$gfn_isEmpty(returnData) && currentEditingItem.value) {
    currentEditingItem.value.usr_id = returnData[0].usr_id
    currentEditingItem.value.emp_no = returnData[0].emp_no
    currentEditingItem.value.usr_nm = returnData[0].usr_nm
    currentEditingItem.value.dept_nm = returnData[0].dept_nm
    currentEditingItem.value.dept_cd = returnData[0].dept_cd
  }
  currentEditingItem.value = null
}

// 저장
const save = async () => {
  // 유효성 검사
  for (let i = 0; i < userRoleList.value.length; i++) {
    const item = userRoleList.value[i]
    
    if ($gfn_isEmpty(item.role_id)) {
      $toast($t('권한을 선택해주세요.'), 'error')
      return
    }
    
    if ($gfn_isEmpty(item.emp_no)) {
      $toast($t('사용자를 선택해 주세요.'), 'error')
      return
    }
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const insertRow = userRoleList.value.filter(item => item.row_status === 'C')
  const updateRow = userRoleList.value.filter(item => item.row_status === 'U')
  
  const frmDatas = {
    insertRow,
    updateRow,
    deleteRow: []
  }
  
  await $api.post('/sm/userrole/save', frmDatas)
  $toast($t('저장되었습니다.'))
  search()
}

const goList = () => {
  $gfn_go('/sm/mrgd/rolemn')
}
</script>
