export const useUserStore = defineStore('ds-user', {
    state: () => ({ user: {} }),
    getters: {
      getUserState: (state) => state.user
    },
    actions: {
      setUserState(user: object) {
        this.user = user
      }
    },
    persist: {
      enabled: false,
    },
  })
  