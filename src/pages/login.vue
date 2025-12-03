<template>
  <div class="login-container">
    <div class="login-content" data-aos="fade-up">
      <!-- 로고 또는 타이틀 영역 -->
      <div class="login-header">
        <div class="login-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
        </div>
        <h1 class="login-title">환영합니다</h1>
        <p class="login-subtitle">계정에 로그인하세요</p>
      </div>

      <!-- 로그인 폼 -->
      <div class="login-form">
        <v-text-field
          v-model="frmDatas.user_id"
          label="아이디"
          placeholder="아이디를 입력하세요"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-account"
          :disabled="isLoading"
        />
        
        <v-text-field
          v-model="frmDatas.user_pw"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          type="password"
          variant="outlined"
          color="primary"
          density="comfortable"
          prepend-inner-icon="mdi-lock"
          :disabled="isLoading"
          @keyup.enter="login"
        />

        <div class="login-options">
          <v-checkbox
            v-model="rememberLogin"
            label="자동 로그인"
            color="primary"
            density="compact"
            hide-details
            :disabled="isLoading"
          />
        </div>

        <v-btn
          color="primary"
          size="large"
          variant="flat"
          block
          class="login-button"
          :loading="isLoading"
          :disabled="isLoading"
          @click="login"
        >
          <v-icon start>mdi-login</v-icon>
          로그인
        </v-btn>
      </div>
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
    
    // 로그인 체크 API 호출 (토큰 기반 자동 로그인)
    const res = await $api.post('/auth/check', {})
    
    // 응답 확인
    if (res && res.result === 'SUCCESS' && res.userInfo) {
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
      // 로그인 실패 처리
      if (res && res.result === 'NOUSRINFO') {
        throw new Error('사용자 정보를 찾을 수 없습니다.')
      } else if (res && res.result === 'LOCKUSRINFO') {
        throw new Error('계정이 잠겨있습니다.')
      } else {
        throw new Error('자동 로그인 세션이 만료되었습니다.')
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
      
      // 로그인 파라미터 준비 (백엔드가 기대하는 형식으로)
      const loginParams = {
        user_id: frmDatas.value.user_id,
        password: frmDatas.value.user_pw,
        auto_login: rememberLogin.value ? 'true' : 'false'
      }
      
      // 로그인 API 호출
      const res = await $api.post('/auth/login', loginParams)
      
      // 응답 확인
      if (res && res.result === 'SUCCESS' && res.userInfo) {
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
        // 로그인 실패 처리
        let errorMessage = '로그인에 실패했습니다.'
        
        if (res && res.result === 'NOUSRINFO') {
          errorMessage = '사용자 정보를 찾을 수 없습니다.'
        } else if (res && res.result === 'LOCKUSRINFO') {
          errorMessage = '계정이 잠겨있습니다.'
        } else if (res && res.result === 'PWDNOTMATCHED') {
          errorMessage = '비밀번호가 일치하지 않습니다.'
        }
        
        throw new Error(errorMessage)
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
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-content {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.login-icon svg {
  width: 40px;
  height: 40px;
  color: white;
  stroke-width: 2.5;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
  }
}

.login-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.3;
}

.login-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-options {
  margin-top: -8px;
  margin-bottom: -8px;
}

.login-button {
  margin-top: 8px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 48px !important;
}

/* 태블릿 (768px 이하) */
@media (max-width: 768px) {
  .login-content {
    padding: 35px 30px;
    border-radius: 16px;
  }

  .login-header {
    margin-bottom: 32px;
  }

  .login-icon {
    width: 70px;
    height: 70px;
    margin-bottom: 16px;
  }

  .login-icon svg {
    width: 35px;
    height: 35px;
  }

  .login-title {
    font-size: 28px;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 15px;
  }

  .login-form {
    gap: 18px;
  }
}

/* 모바일 (480px 이하) */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }

  .login-content {
    padding: 32px 24px;
    border-radius: 12px;
  }

  .login-header {
    margin-bottom: 28px;
  }

  .login-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 14px;
  }

  .login-icon svg {
    width: 30px;
    height: 30px;
  }

  .login-title {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .login-subtitle {
    font-size: 14px;
  }

  .login-form {
    gap: 16px;
  }

  .login-button {
    height: 44px !important;
  }
}

/* 작은 모바일 (360px 이하) */
@media (max-width: 360px) {
  .login-content {
    padding: 28px 20px;
  }

  .login-title {
    font-size: 22px;
  }

  .login-icon {
    width: 55px;
    height: 55px;
  }

  .login-icon svg {
    width: 28px;
    height: 28px;
  }
}
</style>