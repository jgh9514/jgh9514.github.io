export const useRouteStore = defineStore('ds-route', {
  state: () => ({ 
    currentRoute: {},
    routeHistory: [],
    pageLeave: false
  }),
  getters: {
    getCurrentRoute: (state) => {
      return state.currentRoute
    },
    getRouteHistory: (state) => state.routeHistory,
    getPageLeave: (state) => state.pageLeave
  },
  actions: {
    setCurrentRoute(route: object) {
      this.currentRoute = route
    },
    addRouteHistory(route: object) {
      this.routeHistory.push(route)
    },
    clearRouteHistory() {
      this.routeHistory = []
    },
    setPageLeave(value: boolean) {
      this.pageLeave = value
    }
  },
  persist: {
    enabled: false,
  },
})
