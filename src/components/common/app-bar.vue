<template>
  <!-- 상단 앱바 컴포넌트 -->
  <v-app-bar elevation="1">
    <!-- 좌측 메뉴 토글 버튼 -->
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="updateDrawer" />
    </template>

    <!-- 로고 영역 -->
    <div class="logo-container">
      <img class="logo-img" src="~/assets/images/ci_active.png" alt="logo" @click="goHome" />
    </div>

    <v-spacer></v-spacer>
    
    <div v-if="$route.path !== '/'" style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
      <v-icon font-size="19" @click="goBack">mdi-chevron-left</v-icon>
    </div>
  </v-app-bar>
</template>
<script setup>
// 좌측 메뉴 토글 함수
const updateDrawer = () => {
  leftMenuState.value = !leftMenuState.value
}

// 홈 이동 함수
const goHome = () => {
  navigateTo('/')
}

// 뒤로 이동 함수
const goBack = () => {
  history.back()
}
</script>

<style scoped>
.user-section {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.user-name {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
}
</style>
