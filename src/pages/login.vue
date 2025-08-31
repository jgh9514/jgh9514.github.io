<template>
  <div class="full-width" style="height: 100vh;">
    <div class="absolute-center">
      <v-card
        class="mx-auto pa-3"
        min-width="400"
        flat
      >
        <v-card-item class="mt-4">
          <div class="text-h5 text-center font-weight-bold">
            Login
          </div>
        </v-card-item>
        <v-card-item class="mt-4">
          <v-text-field
            v-model="frmDatas.user_id"
            placeholder="ID"
            color="#2CA4F7"
            variant="outlined"
            block
          />
          <v-text-field
            v-model="frmDatas.user_pw"
            type="password"
            placeholder="Password"
            color="#2CA4F7"
            variant="outlined"
            block
            @keyup.enter="login"
          />
          <v-checkbox
            v-model="rememberLogin"
            label="자동 로그인"
            color="#2CA4F7"
          />
        </v-card-item>
        <v-card-item class="mt-2">
          <v-btn
            color="red-lighten-2"
            text="Login"
            variant="outlined"
            block
            @click="login"
          />
        </v-card-item>
      </v-card>
    </div>
  </div>
</template>
<script setup>
import { Preferences } from '@capacitor/preferences'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'empty'
})

const userStore = useUserStore()

const validation = () => {
  // if($gfn_isEmpty(frmDatas.value.cmpy_cd)) {
  //   alert('회사코드를 입력해주세요.')
  //   return
  // }
  if($gfn_isEmpty(frmDatas.value.user_id)) {
    $toast($t('아이디를 입력해주세요.'), 'error')
    return false
  }
  if($gfn_isEmpty(frmDatas.value.user_pw)) {
    $toast($t('비밀번호를 입력해주세요.'), 'error')
    return false
  }

  return true
}

const frmDatas = ref({
  cmpy_cd: '',
  user_id: '',
  user_pw: ''
})

const rememberLogin = ref(false)
const isLoading = ref(false)

// 저장된 로그인 정보 불러오기
const loadSavedLoginInfo = async () => {
  try {
    const savedUserId = await Preferences.get({ key: 'saved_user_id' })
    const savedUserPw = await Preferences.get({ key: 'saved_user_pw' })
    const savedRemember = await Preferences.get({ key: 'remember_login' })
    
    if (savedUserId.value && savedUserPw.value && savedRemember.value === 'true') {
      frmDatas.value.user_id = savedUserId.value
      frmDatas.value.user_pw = savedUserPw.value
      rememberLogin.value = true
      
      // 자동 로그인 시도
      await autoLogin()
    }
  } catch (error) {
    console.error('저장된 로그인 정보 불러오기 실패:', error)
  }
}

// 자동 로그인
const autoLogin = async () => {
  try {
    isLoading.value = true
    
    // 로그인 API 호출
    const loginRes = await $api.get('/common/login', frmDatas.value)
    
    // whoami API 호출
    const res = await $api.get('/common/whoami')
    
    // userInfo가 있는지 확인
    if (res && res.userInfo) {
      // 사용자 스토어 업데이트
      userStore.setUserState(res.userInfo)
      
      // 로컬 스토리지에 로그인 상태 저장
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      
      $toast('자동 로그인되었습니다.', 'success')
      
      // 약간의 지연 후 페이지 이동 (상태 동기화를 위해)
      setTimeout(() => {
        navigateTo('/')
      }, 100)
    } else {
      // API 응답 구조 확인
      if (res && res.result === 'nosession') {
        throw new Error('자동 로그인 세션이 만료되었습니다.')
      } else {
        throw new Error('사용자 정보를 가져올 수 없습니다.')
      }
    }
  } catch (error) {
    console.error('자동 로그인 실패:', error)
    // 자동 로그인 실패 시 저장된 정보 삭제
    await clearSavedLoginInfo()
  } finally {
    isLoading.value = false
  }
}

// 로그인 정보 저장
const saveLoginInfo = async () => {
  if (rememberLogin.value) {
    try {
      // 자동 로그인을 위한 정보 저장
      await Preferences.set({ key: 'saved_user_id', value: frmDatas.value.user_id })
      await Preferences.set({ key: 'saved_user_pw', value: frmDatas.value.user_pw })
      await Preferences.set({ key: 'remember_login', value: 'true' })
    } catch (error) {
      console.error('로그인 정보 저장 실패:', error)
    }
  } else {
    // 자동 로그인 정보만 삭제 (로그인 상태는 유지)
    try {
      await Preferences.remove({ key: 'saved_user_id' })
      await Preferences.remove({ key: 'saved_user_pw' })
      await Preferences.remove({ key: 'remember_login' })
    } catch (error) {
      console.error('자동 로그인 정보 삭제 실패:', error)
    }
  }
}

// 저장된 로그인 정보 삭제
const clearSavedLoginInfo = async () => {
  try {
    await Preferences.remove({ key: 'saved_user_id' })
    await Preferences.remove({ key: 'saved_user_pw' })
    await Preferences.remove({ key: 'remember_login' })
  } catch (error) {
    console.error('저장된 로그인 정보 삭제 실패:', error)
  }
}

const login = async () => {
  if(validation()) {
    try {
      isLoading.value = true
      
      // 로그인 API 호출
      const loginRes = await $api.get('/common/login', frmDatas.value)
      
      // whoami API 호출
      const res = await $api.get('/common/whoami')
      
      // userInfo가 있는지 확인
      if (res && res.userInfo) {
        // 사용자 스토어 업데이트
        userStore.setUserState(res.userInfo)
        
        // 로컬 스토리지에 로그인 상태 저장
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        
        // 로그인 정보 저장
        await saveLoginInfo()
        
        $toast('로그인되었습니다.', 'success')
        
        // 약간의 지연 후 페이지 이동 (상태 동기화를 위해)
        setTimeout(() => {
          navigateTo('/')
        }, 100)
      } else {
        // API 응답 구조 확인
        if (res && res.result === 'nosession') {
          throw new Error('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
        } else {
          throw new Error('사용자 정보를 가져올 수 없습니다.')
        }
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      $toast(error.message || '로그인에 실패했습니다.', 'error')
    } finally {
      isLoading.value = false
    }
  }
}

// 페이지 로드 시 저장된 로그인 정보 확인
onMounted(async () => {
  await loadSavedLoginInfo()
})
</script>
<style scoped>
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>