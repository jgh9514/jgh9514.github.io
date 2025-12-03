<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
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
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>{{ $t('권한 메뉴') }}</v-card-title>
            <v-data-table
              v-model="selectedMenus"
              :headers="menuHeaders"
              :items="menuList"
              item-value="menu_id"
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

const roleList = ref([])
const menuList = ref([])
const selectedMenus = ref([])
const schDatas = ref({})
const selectedRoleId = ref(null)

const roleHeaders = [
  { title: $t('권한명'), key: 'role_nm', align: 'start', sortable: false },
]

const menuHeaders = computed(() => {
  const cols = [
    { title: $t('레벨'), key: 'menu_lv', align: 'center', sortable: false },
    { title: $t('메뉴번호'), key: 'menu_id', align: 'center', sortable: false },
    { title: $t('메뉴명'), key: 'menu_nm', align: 'start', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => col.key !== 'menu_lv')
  }
  return cols
})

onMounted(() => {
  searchRole()
})

const searchRole = async () => {
  const rows = await $api.post('/sm/role/list')
  roleList.value = rows || []
}

const onRoleClick = async (event, { item }) => {
  selectedRoleId.value = item.role_id
  schDatas.value.role_id = item.role_id
  await searchMenu()
}

const searchMenu = async () => {
  if (!selectedRoleId.value) return
  
  const searchData = $gfn_searchDataExtraction(schDatas.value)
  const rows = await $api.post('/sm/rolemenu/list', searchData)
  menuList.value = rows || []
  
  // 이미 선택된 메뉴들 체크
  selectedMenus.value = rows.filter(r => r.rolechk === 'Y').map(r => r.menu_id)
}

const save = async () => {
  if (!selectedRoleId.value) {
    $toast($t('권한을 선택해주세요.'), 'error')
    return
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const saveData = menuList.value.map(menu => ({
    ...menu,
    rolechk: selectedMenus.value.includes(menu.menu_id) ? 'Y' : 'N'
  }))
  
  await $api.post('/sm/rolemenu/save', {
    role_id: selectedRoleId.value,
    menuList: saveData
  })
  
  $toast($t('저장되었습니다.'))
  searchMenu()
}
</script>
