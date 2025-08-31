export default defineNuxtPlugin(async () => {
  // 클라이언트 사이드에서만 실행
  if (process.client) {
    try {
      // 로컬 스토리지에서 로그인 상태 확인
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const userInfoStr = localStorage.getItem('userInfo')
      
      if (isLoggedIn && userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        
        // 사용자 스토어 업데이트
        const userStore = useUserStore()
        userStore.setUserState(userInfo)
      }
    } catch (error) {
      console.error('사용자 정보 복원 실패:', error)
      // 오류 발생 시 로컬 스토리지 정리
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userInfo')
    }
  }
})
