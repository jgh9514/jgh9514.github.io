<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="7">
          <v-card>
            <v-card-title class="d-flex align-center">
              <span>{{ $t('메뉴 목록') }}</span>
              <v-spacer></v-spacer>
              <v-btn size="small" color="primary" @click="openNew">{{ $t('대메뉴 추가') }}</v-btn>
            </v-card-title>
            <v-data-table
              :headers="menuHeaders"
              :items="menuList"
              density="compact"
              :items-per-page="-1"
              hide-default-footer
              class="elevation-1"
              @click:row="onMenuClick"
            >
              <template v-slot:item.menu_nm="{ item }">
                <span :style="{ paddingLeft: (item.menu_lv * 20) + 'px' }">
                  {{ item.menu_nm }}
                </span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn size="x-small" variant="text" @click.stop="openEdit(item)">{{ $t('수정') }}</v-btn>
                <v-btn size="x-small" variant="text" color="error" @click.stop="deleteMenu(item)">{{ $t('삭제') }}</v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card>
            <v-card-title>{{ $t('메뉴 권한') }}</v-card-title>
            <v-data-table
              v-model="selectedRoles"
              :headers="roleHeaders"
              :items="roleList"
              item-value="role_id"
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
    <dc-bottom-btn button-list="['save']" @save="save" />
    <menupopup ref="pop" @close="popClose" />
  </div>
</template>

<script setup>
import menupopup from './menupopup.vue'
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

const menuList = ref([])
const roleList = ref([])
const selectedRoles = ref([])
const selectedMenuId = ref(null)
const pop = ref(null)

const codeList = {
  CO00000004: {
    cd: ['Y', 'N'],
    cd_nm: ['사용', '미사용'],
  },
}

const menuHeaders = computed(() => {
  const cols = [
    { title: $t('레벨'), key: 'menu_lv', align: 'center', sortable: false },
    { title: $t('메뉴 ID'), key: 'menu_id', align: 'center', sortable: false },
    { title: $t('메뉴명'), key: 'menu_nm', align: 'start', sortable: false },
    { title: $t('URL'), key: 'menu_url', align: 'start', sortable: false },
    { title: $t('사용여부'), key: 'usg_yn', align: 'center', sortable: false },
    { title: $t('액션'), key: 'actions', align: 'center', sortable: false },
  ]
  
  if (mobile.value) {
    return cols.filter(col => !['menu_lv', 'menu_id', 'menu_url', 'usg_yn'].includes(col.key))
  }
  return cols
})

const roleHeaders = [
  { title: $t('권한 ID'), key: 'role_id', align: 'center', sortable: false },
  { title: $t('권한명'), key: 'role_nm', align: 'start', sortable: false },
]

onMounted(() => {
  searchMenu()
  searchRole()
})

const searchMenu = async () => {
  const rows = await $api.post('/sm/menu/list')
  // 메뉴를 레벨 순서대로 정렬하여 트리 구조를 흉내냄
  menuList.value = (rows || []).sort((a, b) => {
    if (a.srt_path && b.srt_path) {
      return a.srt_path.localeCompare(b.srt_path)
    }
    return 0
  })
}

const searchRole = async () => {
  const rows = await $api.post('/sm/role/list')
  roleList.value = rows || []
}

const onMenuClick = async (event, { item }) => {
  selectedMenuId.value = item.menu_id
  await searchMenuRole(item.menu_id)
}

const searchMenuRole = async (menuId) => {
  if (!menuId) return
  
  const rows = await $api.post('/sm/menurole/list', { menu_id: menuId })
  
  // 선택된 권한 체크
  selectedRoles.value = rows.filter(r => r.rolechk === 'Y').map(r => r.role_id)
}

const openNew = () => {
  pop.value.open(null, null, 'new')
}

const openEdit = (item) => {
  pop.value.open(item.menu_id, item.up_menu_id, 'edit')
}

const deleteMenu = async (item) => {
  const res = await $confirm($t('삭제하시겠습니까?'))
  if (!res) return
  
  await $api.post(`/sm/menu/save`, {
    insertRow: [],
    updateRow: [],
    deleteRow: [{ menu_id: item.menu_id }]
  })
  $toast($t('삭제되었습니다.'))
  searchMenu()
}

const popClose = (result) => {
  if (result) {
    searchMenu()
  }
}

const save = async () => {
  if (!selectedMenuId.value) {
    $toast($t('메뉴를 선택해주세요.'), 'error')
    return
  }
  
  const res = await $confirm($t('저장하시겠습니까?'))
  if (!res) return
  
  const saveData = roleList.value.map(role => ({
    ...role,
    rolechk: selectedRoles.value.includes(role.role_id) ? 'Y' : 'N'
  }))
  
  await $api.post('/sm/menurole/save', {
    menu_id: selectedMenuId.value,
    roleList: saveData
  })
  
  $toast($t('저장되었습니다.'))
  searchMenuRole(selectedMenuId.value)
}
</script>
