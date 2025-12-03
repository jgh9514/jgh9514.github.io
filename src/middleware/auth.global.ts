export default defineNuxtRouteMiddleware(async to => {
  // 로그인 페이지는 체크하지 않음
  if (to.path === '/login') {
    return;
  }

  // 서버 사이드에서는 실행하지 않음
  if (process.server) {
    return;
  }

  try {
    // 로컬 스토리지에서 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userInfo = localStorage.getItem('userInfo');

    // 이미 로그인된 상태이고 사용자 정보가 있으면 통과
    if (isLoggedIn && userInfo) {
      try {
        // 사용자 정보가 유효한지 확인
        const user = JSON.parse(userInfo);
        if (user && Object.keys(user).length > 0) {
          // /admin 경로는 시스템 관리자만 접근 가능
          if (to.path.startsWith('/admin')) {
            // 사용자 권한 확인 (role_id 또는 roles 배열 확인)
            const userRoles = user.roles || (user.role_id ? [user.role_id] : []);
            const isAdmin = userRoles.some(role => role === 'RL0001');

            if (!isAdmin) {
              // 권한이 없으면 403 에러 페이지로 리다이렉트
              console.warn('관리자 권한이 필요합니다:', to.path);
              return navigateTo('/error/403');
            }
          }

          return; // 로그인 성공, 페이지 접근 허용
        }
      } catch (parseError) {
        console.error('사용자 정보 파싱 오류:', parseError);
        // 파싱 오류 시 로컬 스토리지 정리
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');
      }
    }

    // 로그인되지 않은 상태면 로그인 페이지로 리다이렉트
    return navigateTo('/login');
  } catch (error) {
    console.error('인증 체크 오류:', error);
    // 오류 발생 시 로컬 스토리지 정리
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    return navigateTo('/login');
  }
});
