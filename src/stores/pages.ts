export const usePageStore = defineStore('ds-pages', {
  state: () => ({
    pages: [],
    activePage: {},
  }),
  getters: {
    getPages: (state): object => state.pages,
    getActivePage: (state): object => state.activePage,
  },

  actions: {
    async fetch() {
      try {
        this.pages = await $api.post('/comm/login-access-page-list', {});
      } catch (error) {
        console.error('페이지 목록 조회 실패:', error);
        this.pages = [];
      }
    },
    setActivePage(route: any) {
      const forbiddenPaths = ['/error/403', '/notfound', '/error/500', '/error/401'];
      // 권한 체크가 필요 없는 공개 페이지들
      const publicPaths = [
        '/',
        '/login',
        '/settings',
        '/recentSiege',
        '/siege',
        '/rta',
        '/record',
        '/search',
        '/detail',
      ];

      this.activePage = {};
      if (!forbiddenPaths.includes(route.path)) {
        let routeName = route.name ? route.name.split('-').pop() : '';
        const lastThree = routeName.slice(-3);
        if (lastThree === 'edt' || lastThree === 'lup') {
          routeName = `[[${routeName}]]`;
        }
        let foundPage;

        // pages가 배열인지 확인
        if (!Array.isArray(this.pages)) {
          this.pages = [];
        }

        if (route.path === '/') {
          foundPage = this.pages.find(page => page.page_url === 'index');
        } else {
          foundPage = this.pages.find(page => route.path.includes(page.page_url));
        }

        // 공개 페이지이거나 페이지 정보가 있으면 허용
        const isPublicPath = publicPaths.some(path => route.path === path || route.path.startsWith(path));
        if (!foundPage && !isPublicPath) {
          navigateTo('/error/403');
          return;
        }

        if (foundPage) {
          this.activePage = {
            ...foundPage,
            page_id: foundPage.page_no || foundPage.page_id, // page_no를 page_id로 매핑
            routeName: routeName,
          };
        } else {
          // 공개 페이지인 경우 기본 정보만 설정
          this.activePage = {
            page_id: route.path === '/' ? 'index' : route.path.replace('/', ''),
            page_url: route.path === '/' ? 'index' : route.path.replace('/', ''),
            routeName: routeName,
          };
        }
      }
    },
  },
});
