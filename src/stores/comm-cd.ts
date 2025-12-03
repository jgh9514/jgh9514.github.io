export const useCommCdStore = defineStore('ds-comm-cd', {
  state: () => ({
    commCd: {},
  }),
  actions: {
    async fetch() {
      // this.commCd
      const res = await $api.post('/comm/comm-cd', {});
      this.commCd = res;
      // res 데이터는 배열 형태임. 각 항목의 cdGrpNo를 키로 하여 this.commCd에 그룹핑하여 저장
      // 성능 최적화를 위해 forEach 대신 for문 사용 및 변수 캐싱
      // const grouped: Record<string, any[]> = {}
      // for (let i = 0, len = res.length; i < len; i++) {
      //   const item = res[i]
      //   const grpNo = item.cdGrpNo
      //   if (!grouped[grpNo]) {
      //     grouped[grpNo] = []
      //   }
      //   grouped[grpNo].push(item)
      // }
      // this.commCd = grouped
    },
    setCommCd(cd_grp_no_val: string, data: object) {
      this.commCd[cd_grp_no_val] = Object.assign({}, data);
    },
    getCommCd(cd_grp_no_val: string) {
      return this.commCd[cd_grp_no_val];
    },
  },
});
