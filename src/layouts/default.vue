<template>
  <div class="app-container">
    <div id="__layout">
      <v-layout class="rounded rounded-md">
        <CommonAppBar />

        <CommonMenuBar />

        <NuxtPage style="overflow-y: auto; margin-top: 64px; width: 100%" />
      </v-layout>
    </div>
    <!-- 전역 공통 컴포넌트 -->
    <CommonAlert v-if="alertStore.$state.isShow" />

    <!-- Confirm 컴포넌트  -->
    <CommonConfirm v-if="confirmStore.$state.isShow" />

    <!-- 로딩 바 -->
    <CommonApiLoading />
  </div>
</template>
<script setup>
const menuStore = useMenuStore();
const alertStore = useAlertStore();
const confirmStore = useConfirmStore();

// 화면 크기에 따른 디바이스 타입 설정
const handleResize = () => {
  isMobile.value = window.innerWidth < 600;
  isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
  isDesktop.value = window.innerWidth >= 960;
};

await callOnce(async () => {
  // const TOKEN = useCookie(Constants.HEADERS_SMW_AUTHORIZATION).value
  // if($gfn_isEmpty(TOKEN)) {
  //   navigateTo('/login')
  //   return
  // }
  // const res = await $api.get('/common/whoami')
  // if (res.result === 'nosession') {
  //   await navigateTo('/login')
  //   return
  // }
  // await menuStore.fetch();
});

onMounted(async () => {
  // 초기값 설정 및 이벤트 리스너 등록
  handleResize();
  window.addEventListener("resize", handleResize);
});
</script>
