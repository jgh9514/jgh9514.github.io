<template>
  <v-dialog v-model="isOpenPreferences" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <span>{{ $t('환경설정') }}</span>
        <v-spacer/>
        <v-icon @click="preferencesClose()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <div class="set_layout">
          <div class="set_col mb-3">
            <dc-wkpl v-model="userInfo.wkpl_id" :label="$t('사업장')" :clearable="false" :disabled="!$gfn_isAdmin()" />
          </div>
          <div class="set_col mb-3">
            <dc-select v-model="userInfo.lang_cd" cd-grp="CO00000002" :label="$t('언어')" :clearable="false" />
          </div>
          <div class="set_col mb-3">
            <v-select
              v-model="userInfo.siege_view_scope"
              :items="siegeScopeItems"
              item-title="label"
              item-value="value"
              :label="$t('점령전 조회 범위')"
              density="compact"
              variant="outlined"
            />
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <div class="preferences-actions">
          <dc-btn :label="$t('저장')" @click="save" />
          <dc-btn :label="$t('닫기')" @click="preferencesClose" />
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>  
import dcBtn from '~/components/document/btn.vue'

const userStore = useUserStore()

const isOpenPreferences = defineModel()
const userInfo = ref({})
const tempUserInfo = ref({})
const currentSeasonNo = ref(null)

// 현재 시즌 정보 조회
const fetchCurrentSeason = async () => {
  try {
    const result = await $api.post('/summonerswar/current-season', {})
    if (result && result.season_no !== undefined) {
      currentSeasonNo.value = result.season_no
    }
  } catch (error) {
    console.error('현재 시즌 조회 실패:', error)
    // API가 없거나 실패하면 기본값 사용
    currentSeasonNo.value = null
  }
}

// 점령전 조회 범위 선택 옵션 (computed로 동적 생성)
const siegeScopeItems = computed(() => {
  const seasonLabel = currentSeasonNo.value !== null 
    ? `현재 시즌(${String(currentSeasonNo.value).padStart(2, '0')}시즌)만`
    : '현재 시즌만'
  
  return [
    { label: seasonLabel, value: 'C' },
    { label: '전체 시즌', value: 'A' }
  ]
})

watch(isOpenPreferences, async (newVal) => {
  if (newVal) {
    // 팝업이 열릴 때 현재 시즌 정보 조회
    await fetchCurrentSeason()
    
    userInfo.value = Object.assign({}, userStore.getUserState)
    // siege_view_scope가 없으면 기본값 'C' (현재 시즌만) 설정
    if (!userInfo.value.siege_view_scope) {
      userInfo.value.siege_view_scope = 'C'
    }
    tempUserInfo.value = Object.assign({}, userInfo.value)
  }
})

const preferencesClose = async () => {
  // if (JSON.stringify(Object.entries(tempUserInfo.value).sort()) !== JSON.stringify(Object.entries(userInfo.value).sort())) {
  //   const confirm = await $confirm($t('변경사항이 있습니다.<br/>저장하지않고 나가시겠습니까?'))
  //   if (!confirm) return
  // }
  isOpenPreferences.value = false
}

const save = async () => {
  if (JSON.stringify(Object.entries(tempUserInfo.value).sort()) === JSON.stringify(Object.entries(userInfo.value).sort())) {
    $toast($t('변경사항이 없습니다.'), 'error')
    return
  }
  const res = await $confirm($t('저장하시면 해당 환경 설정으로 화면이 갱신됩니다. 저장하시겠습니까?'))
  if (!res) return

  const frmData = {
    usr_id: userInfo.value.usr_id,
    wkpl_id: userInfo.value.wkpl_id,
    lang_cd: userInfo.value.lang_cd,
    siege_view_scope: userInfo.value.siege_view_scope,
  }
  await $api.post('/config/save', frmData)
  $toast($t('저장되었습니다.'))
  setTimeout(() => {
    location.reload(true)
  }, 500)
}

const logout = async () => {
  await $api.post('/auth/logout')
  await userStore.clearUserState()
  // 쿠키 삭제
  document.cookie = 'DGRM-Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'ds-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  if (Constants.IS_AD_LOGIN === 'Y') {
    location.href = '/adlogin'
  } else if (Constants.IS_AD_LOGIN === 'OAUTH') {
    location.href = '/adlogin'
  } else {
    location.href = '/login'
  }
}
</script>

<style scoped>
.preferences-actions {
  display: flex;
  gap: 8px;
}
</style>
