import { Preferences } from '@capacitor/preferences'

interface User {
  user_nm?: string
  [key: string]: any
}

export const useUserStore = defineStore('ds-user', {
    state: () => ({ 
      user: {} as User,
      isLoggedIn: false 
    }),
    getters: {
      getUserState: (state) => state.user,
      getLoginState: (state) => state.isLoggedIn
    },
    actions: {
      setUserState(user: User) {
        this.user = user
        this.isLoggedIn = true
      },
      
      async logout() {
        try {
          // 백엔드 로그아웃 API 호출
          await $api.post('/auth/logout', {})
          
          // 저장된 로그인 정보 삭제
          await Preferences.remove({ key: 'saved_user_id' })
          await Preferences.remove({ key: 'saved_user_pw' })
          await Preferences.remove({ key: 'remember_login' })
          await Preferences.remove({ key: 'SMW-Authorization' })
          
          // 로컬 스토리지 정리
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userInfo')
          
          // Capacitor 환경에서 토큰 삭제
          if (process.client && (window as any).Capacitor) {
            const { CapacitorStorage } = await import('~/utils/capacitorStorage')
            await CapacitorStorage.removeToken()
          } else {
            // 웹 환경에서 쿠키 삭제
            const tokenCookie = useCookie(Constants.HEADERS_SMW_AUTHORIZATION)
            tokenCookie.value = null
          }
          
          // 사용자 정보 초기화
          this.user = {}
          this.isLoggedIn = false
          
          // 로그인 페이지로 리다이렉트
          await navigateTo('/login')
        } catch (error) {
          console.error('로그아웃 오류:', error)
          // 에러가 발생해도 클라이언트 측 정리는 수행
          this.user = {}
          this.isLoggedIn = false
          await navigateTo('/login')
        }
      },
      
      clearUserState() {
        this.user = {}
        this.isLoggedIn = false
      }
    }
  })
  