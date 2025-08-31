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
          // 저장된 로그인 정보 삭제
          await Preferences.remove({ key: 'saved_user_id' })
          await Preferences.remove({ key: 'saved_user_pw' })
          await Preferences.remove({ key: 'remember_login' })
          
          // 로컬 스토리지 정리
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userInfo')
          
          // 사용자 정보 초기화
          this.user = {}
          this.isLoggedIn = false
          
          // 로그인 페이지로 리다이렉트
          await navigateTo('/login')
        } catch (error) {
          console.error('로그아웃 오류:', error)
        }
      },
      
      clearUserState() {
        this.user = {}
        this.isLoggedIn = false
      }
    },
    persist: false,
  })
  