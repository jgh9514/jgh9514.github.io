// alert 스토어
/**
 * currentTab: 현재 활성화 탭
 * tabs: [{ // 열려있는 탭 들.
 *    {
 *      tabid: ''
 *     ,path: ''
 *     ,menuid: ''
 *     ,menunm: ''
 *    }
 * }]
 */
export const useCurrentRouterTabStore = defineStore('ds-current-router-tab', {
  state: () => ({ currentTab: '' }),
  getters: {
    getCurrentRouterTabStore: (state) => state
  },
  actions: {
    setCurrentRouterTabStore(currentTab: string) {
      this.currentTab = currentTab
    }
  },
  persist: {
    enabled: true,
    storage: 'localStorage',
  },
})
