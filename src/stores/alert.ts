// alert 스토어
export const useAlertStore = defineStore('ds-alert', {
    state: () => ({ isShow: false, text: '' }),
    getters: {
      getAlertState: (state): boolean => state.isShow
    },
    actions: {
      /**
       * @param text (Required) : 다이얼로그의 텍스트
       */
      setAlertState(text: string) {
        this.isShow = true
        this.text = text
      },
      closeAlert() {
        this.isShow = false
        setTimeout(() => {
          this.text = ''
        }, 1000)
      }
    }
  })
  