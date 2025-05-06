/* eslint-disable @typescript-eslint/no-explicit-any */
export const useImagesStore = defineStore('ds-images', {
  state: () => ({
    images: [],
  }),
  getters: {
    getImages: (state): object => state.images,
  },

  actions: {
    async fetch() {
      // 이미지 가져오기  
      const glob = import.meta.glob("@/assets/images/**/*", { eager: true })
      const imageList = Object.fromEntries(
        Object.entries(glob).map(([key, value]) => [key.replace(/^.*?\/images\//, '/images/'), value.default])
      )
      this.images = imageList
    },
  },
  persist: {
    enabled: true // 메모리에 저장하지 않도록 변경
  },
})