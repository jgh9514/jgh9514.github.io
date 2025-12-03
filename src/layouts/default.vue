<template>
  <v-app>
    <div class="app-container">
      <div id="__layout" style="height: 100vh; overflow: hidden;">
        <CommonAppBar />

        <CommonMenuBar />

        <div 
          :style="{
            overflowY: 'auto',
            marginTop: '64px',
            marginLeft: isDrawerOpen && !isMobile ? '256px' : '0',
            width: isDrawerOpen && !isMobile ? 'calc(100% - 256px)' : '100%',
            height: 'calc(100vh - 64px)',
            transition: 'margin-left 0.3s ease, width 0.3s ease'
          }"
        >
          <NuxtPage />
        </div>
      </div>
      <!-- 전역 공통 컴포넌트 -->
      <CommonAlert v-if="alertStore.$state.isShow" />

      <!-- Confirm 컴포넌트  -->
      <CommonConfirm v-if="confirmStore.$state.isShow" />

      <!-- 로딩 바 -->
      <CommonApiLoading />

      <!-- 우측 하단 설정 플로팅 버튼 -->
      <v-btn
        class="floating-settings-btn"
        color="primary"
        icon="mdi-cog"
        size="large"
        @click="isOpenPreferences = true"
      />

      <!-- 환경설정 팝업 -->
      <CommonPreferences v-model="isOpenPreferences" />
    </div>
  </v-app>
</template>
<script setup>
import { leftMenuState } from '~/utils/navigation';
import { isMobile as isMobileLayout } from '~/utils/layout';

const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();
const confirmStore = useConfirmStore();
const pageStore = usePageStore();

// 환경설정 팝업 열림 여부
const isOpenPreferences = ref(false);

// 모바일 여부 확인
const isMobile = computed(() => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 960 || isMobileLayout.value;
  }
  return isMobileLayout.value;
});

// 사이드바 상태를 computed로 관리
const isDrawerOpen = computed(() => leftMenuState.value);

// 화면 크기에 따른 디바이스 타입 설정
const handleResize = () => {
  isMobileLayout.value = window.innerWidth < 600;
  isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
  isDesktop.value = window.innerWidth >= 960;
};

const init = async () => {
  try {
    // 페이지 목록 조회
    await pageStore.fetch();
    // 현재 페이지 설정
    await pageStore.setActivePage(route);
  } catch (error) {
    console.error('페이지 초기화 실패:', error);
    // service.ts에서 이미 navigateTo가 호출되므로 여기서는 추가 처리 불필요
  }
};

await callOnce(async () => {
  await init();
});

onMounted(async () => {
  // 초기값 설정 및 이벤트 리스너 등록
  handleResize();
  window.addEventListener("resize", handleResize);
});

// 라우트 변경 시 현재 페이지 업데이트
router.afterEach((to) => {
  pageStore.setActivePage(to);
});
</script>

<style scoped>
.floating-settings-btn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
}
</style>
