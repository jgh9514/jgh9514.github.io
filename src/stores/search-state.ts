import { defineStore } from 'pinia';

export const useSearchStateStore = defineStore('searchState', () => {
  // 검색 상태
  const selectedMonsters = ref<number[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(5);
  const matchId = ref<number | null>(null);

  // 상태 설정
  const setSelectedMonsters = (monsters: number[]) => {
    selectedMonsters.value = [...monsters];
  };

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const setPageSize = (size: number) => {
    pageSize.value = size;
  };

  const setMatchId = (id: number | null) => {
    matchId.value = id;
  };

  // 상태 초기화
  const resetState = () => {
    selectedMonsters.value = [];
    currentPage.value = 1;
    pageSize.value = 5;
    matchId.value = null;
  };

  // 전체 상태 설정
  const setSearchState = (state: {
    selectedMonsters?: number[];
    currentPage?: number;
    pageSize?: number;
    matchId?: number | null;
  }) => {
    if (state.selectedMonsters) selectedMonsters.value = [...state.selectedMonsters];
    if (state.currentPage) currentPage.value = state.currentPage;
    if (state.pageSize) pageSize.value = state.pageSize;
    if (state.matchId !== undefined) matchId.value = state.matchId;
  };

  return {
    selectedMonsters,
    currentPage,
    pageSize,
    matchId,
    setSelectedMonsters,
    setCurrentPage,
    setPageSize,
    setMatchId,
    resetState,
    setSearchState
  };
});
