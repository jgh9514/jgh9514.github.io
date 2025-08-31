<template>
  <div class="settings-page">
    <v-container fluid class="pa-4 settings-container">
      <v-row>
        <v-col cols="12">
          <div class="page-header">
            <h1 class="text-h4 font-weight-light">설정</h1>
            <p class="text-body-1 text-medium-emphasis mt-2">계정 및 앱 설정을 관리하세요</p>
          </div>
        </v-col>
      </v-row>

      <!-- 사용자 정보 섹션 -->
      <v-row>
        <v-col cols="12" lg="6" md="6" sm="12">
          <v-card class="settings-card" elevation="0" border>
            <v-card-title class="card-title">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon class="mr-3" color="primary" size="24">mdi-account-circle</v-icon>
                  <span>사용자 정보</span>
                </div>
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="editUserInfo"
                  prepend-icon="mdi-account-edit"
                >
                  수정
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text class="pt-0 pb-0">
              <div class="info-item">
                <span class="info-label">사용자명</span>
                <span class="info-value">{{ userStore.getUserState?.user_nm || '정보 없음' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">사용자 ID</span>
                <span class="info-value">{{ userStore.getUserState?.user_id || '정보 없음' }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 계정 설정 섹션 -->
        <v-col cols="12" lg="6" md="6" sm="12">
          <v-card class="settings-card" elevation="0" border>
            <v-card-title class="card-title">
              <v-icon class="mr-3" color="primary" size="24">mdi-shield-account</v-icon>
              계정 설정
            </v-card-title>
            <v-card-text class="pt-0 pb-0">
              <div class="setting-item">
                <div class="setting-content">
                  <v-icon class="mr-3" color="grey-darken-1">mdi-login-variant</v-icon>
                  <span class="setting-label">자동 로그인</span>
                </div>
                <v-switch
                  v-model="autoLoginEnabled"
                  @change="toggleAutoLogin"
                  color="primary"
                  hide-details
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 앱 정보 섹션 -->
      <v-row>
        <v-col cols="12" lg="6" md="6" sm="12">
          <v-card class="settings-card" elevation="0" border>
            <v-card-title class="card-title">
              <v-icon class="mr-3" color="primary" size="24">mdi-information</v-icon>
              앱 정보
            </v-card-title>
            <v-card-text class="pt-0 pb-0">
              <div class="info-item">
                <span class="info-label">앱 버전</span>
                <span class="info-value">{{ appVersion }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">빌드 날짜</span>
                <span class="info-value">{{ buildDate }}</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 로그아웃 섹션 -->
        <v-col cols="12" lg="6" md="6" sm="12">
          <v-card class="settings-card logout-card" elevation="0" border>
            <v-card-title class="card-title">
              <v-icon class="mr-3" color="error" size="24">mdi-logout</v-icon>
              계정 관리
            </v-card-title>
            <v-card-text class="pt-0 pb-0">
              <div class="logout-content">
                <p class="text-body-2 text-medium-emphasis mb-4">
                  현재 계정에서 로그아웃합니다.
                </p>
                <v-btn
                  variant="outlined"
                  color="error"
                  size="large"
                  @click="logout"
                  prepend-icon="mdi-logout"
                >
                  로그아웃
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- 하단 여백 -->
      <div class="bottom-spacer"></div>
    </v-container>

    <!-- 사용자 정보 수정 다이얼로그 -->
    <v-dialog v-model="editDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-account-edit</v-icon>
          사용자 정보 수정
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" class="mt-4">
            <v-text-field
              v-model="editFormData.user_nm"
              label="사용자명"
              variant="outlined"
              required
              class="mb-4"
            />
            <v-text-field
              v-model="editFormData.email"
              label="이메일"
              variant="outlined"
              type="email"
              class="mb-4"
            />
            <v-text-field
              v-model="editFormData.phone"
              label="전화번호"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">취소</v-btn>
          <v-btn color="primary" @click="saveUserInfo" variant="elevated">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { Preferences } from '@capacitor/preferences'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'default'
})

const userStore = useUserStore()

// 앱 정보
const appVersion = ref('1.0.0')
const buildDate = ref('2024-12-26')
const nuxtVersion = ref('3.16.2')

// 자동 로그인 상태
const autoLoginEnabled = ref(false)

// 편집 다이얼로그
const editDialog = ref(false)
const editForm = ref(null)
const editFormData = ref({
  user_nm: '',
  email: '',
  phone: ''
})

// 페이지 로드 시 자동 로그인 상태 확인
onMounted(async () => {
  try {
    const savedRemember = await Preferences.get({ key: 'remember_login' })
    autoLoginEnabled.value = savedRemember.value === 'true'
  } catch (error) {
    console.error('자동 로그인 상태 확인 실패:', error)
  }
})

// 자동 로그인 토글
const toggleAutoLogin = async (enabled) => {
  try {
    if (enabled) {
      // 자동 로그인 활성화
      await Preferences.set({ key: 'remember_login', value: 'true' })
      $toast('자동 로그인이 활성화되었습니다.', 'success')
    } else {
      // 자동 로그인 비활성화
      await Preferences.remove({ key: 'remember_login' })
      await Preferences.remove({ key: 'saved_user_id' })
      await Preferences.remove({ key: 'saved_user_pw' })
      $toast('자동 로그인이 비활성화되었습니다.', 'info')
    }
  } catch (error) {
    console.error('자동 로그인 설정 변경 실패:', error)
    $toast('설정 변경에 실패했습니다.', 'error')
  }
}

// 사용자 정보 수정
const editUserInfo = () => {
  editFormData.value = {
    user_nm: userStore.getUserState?.user_nm || '',
    email: userStore.getUserState?.email || '',
    phone: userStore.getUserState?.phone || ''
  }
  editDialog.value = true
}

// 사용자 정보 저장
const saveUserInfo = async () => {
  try {
    // 여기에 실제 API 호출 로직 추가
    $toast('사용자 정보가 수정되었습니다.', 'success')
    editDialog.value = false
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error)
    $toast('사용자 정보 수정에 실패했습니다.', 'error')
  }
}

// 로그아웃
const logout = async () => {
  try {
    await userStore.logout()
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  overflow-x: hidden;
}

.settings-container {
  min-height: 100vh;
  padding-bottom: 100px;
  padding-top: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 300;
}

.page-header p {
  color: #6c757d;
  font-size: 1.1rem;
}

.settings-card {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
  background: white;
}

.settings-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: #dee2e6;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  padding: 24px 24px 20px 24px;
  border-bottom: 2px solid #f8f9fa;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f1f3f4;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
}

.info-value {
  color: #6c757d;
  font-size: 0.95rem;
  font-weight: 500;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f1f3f4;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-content {
  display: flex;
  align-items: center;
}

.setting-label {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
}

.logout-card {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border: 1px solid #fed7d7;
}

.logout-content {
  text-align: center;
}

.logout-content p {
  color: #c53030;
  font-weight: 500;
}

.bottom-spacer {
  height: 100px;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
  border-radius: 8px;
  letter-spacing: 0.5px;
}

.v-switch {
  margin: 0;
}

.v-dialog .v-card {
  border-radius: 16px;
}

.v-dialog .v-card-title {
  color: #2c3e50;
  font-weight: 600;
}

.v-dialog .v-card-actions {
  padding: 24px;
}

.v-dialog .v-btn {
  border-radius: 8px;
  font-weight: 600;
}

/* 모바일 반응형 */
@media (max-width: 600px) {
  .settings-container {
    padding-bottom: 60px;
    padding-top: 10px;
  }
  
  .page-header {
    margin-bottom: 30px;
    padding-top: 10px;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .card-title {
    padding: 20px 20px 16px 20px;
    font-size: 1.1rem;
  }
  
  .info-item, .setting-item {
    padding: 16px 0;
  }
  
  .settings-card {
    margin-bottom: 20px;
  }
  
  .bottom-spacer {
    height: 60px;
  }
}
</style>
