// confirm 스토어
export const useConfirmStore = defineStore('ds-confirm', {
    state: () => ({
      title: '',
      content: '', 
      isShow: false,
      callbackOkFn: null as (() => void) | null,
      callbackCancelFn: null as (() => void) | null
    }),
    getters: {},
    actions: {
      /**
       * 확인 다이얼로그 상태를 설정하는 함수
       * @param title 다이얼로그 제목
       * @param content 다이얼로그 내용
       */
      setConfirmState(title: string, content?: string): void {
        this.isShow = true
        this.title = content ? title : 'CONFIRM'
        this.content = content || title
      }
    }
  })
  