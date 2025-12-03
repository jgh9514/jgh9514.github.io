export const useSearchConditionStore = defineStore('ds-search-condition', {
  state: () => ({
    searchCondition: {},
  }),
  actions: {
    setSchCondition(page_id: string, data: object) {
      this.searchCondition[page_id] = Object.assign({}, data)
    },
    getSchCondition(page_id: string) {
      return this.searchCondition[page_id]
    },
  },
})
